/**
 * Player: điều hướng + fit-scale + toàn màn hình. Port của `pptx_html.renderer._runtime_js`.
 *
 * Khác bản cũ ở đúng một điểm quan trọng: mọi truy vấn DOM đều **giới hạn trong `root`**, không dùng
 * `document.getElementById` toàn cục. Không có iframe che chắn nữa nên hai deck trên cùng một trang
 * (hoặc deck nằm cạnh UI của app chủ) vẫn phải chạy độc lập.
 */
export type PlayerOpts = {
  /** Kích thước gốc của slide (mặc định 1280×720). */
  w?: number
  h?: number
  /** Bật phím tắt ←/→/Home/End/F (tắt khi nhúng trong form của app chủ). */
  keyboard?: boolean
  /** Chừa chỗ cho rail/console của trình sửa khi tính tỉ lệ. */
  reserve?: () => number
  onSlideChange?: (i: number, total: number) => void
}

export type Player = {
  show(i: number): void
  next(): void
  prev(): void
  cur(): number
  count(): number
  fit(): void
  fullscreen(): void
  /** Gọi lại sau khi DOM slide đổi (thêm/xoá/sắp xếp). */
  refresh(): void
  destroy(): void
}

export function attachPlayer(root: HTMLElement | Document, opts: PlayerOpts = {}): Player {
  const W = opts.w || 1280, H = opts.h || 720
  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)
  const sc = q<HTMLElement>("#scaler")
  let S: HTMLElement[] = []
  let cur = 0

  const collect = () => { S = Array.from(root.querySelectorAll<HTMLElement>("#scaler > .slide")) }

  /**
   * Co slide cho vừa KHUNG CHỨA — đo `.stage`, KHÔNG dùng `innerWidth/innerHeight`.
   *
   * Bản cũ đo cả cửa sổ vì luôn chạy trong iframe (iframe = đúng khung chứa). Bỏ iframe rồi
   * mà vẫn đo cửa sổ thì deck nhúng trong panel hẹp sẽ được phóng theo bề ngang MÀN HÌNH →
   * slide tràn ra ngoài panel, chữ bị cắt hai bên. `reserve` cũng thành thừa: rail/console
   * nằm trong khung nên `.stage` đã trừ sẵn (CSS `.lp-edit .stage{left:172px;right:238px}`).
   */
  function fit() {
    if (!sc) return
    const stage = q<HTMLElement>(".stage")
    const box = stage?.getBoundingClientRect()
    let aw = box?.width || 0
    let ah = box?.height || 0

    // Khung chưa có kích thước (chưa gắn vào DOM / display:none) → lùi về cửa sổ,
    // trừ phần rail/console như trước để không vỡ đường dùng cũ (trang shell, xuất .pptx).
    if (aw < 2 || ah < 2) {
      const reserved = opts.reserve
        ? opts.reserve()
        : (q<HTMLElement>("#lp-rail")?.offsetWidth || 0) + (q<HTMLElement>("#lp-side")?.offsetWidth || 0)
      aw = innerWidth - reserved
      ah = innerHeight
    }
    const s = Math.min((aw - 48) / W, (ah - 96) / H)
    if (s > 0) sc.style.transform = `scale(${s})`
  }

  function show(i: number) {
    if (!S.length) return
    cur = Math.max(0, Math.min(S.length - 1, i))
    S.forEach((s, k) => s.classList.toggle("active", k === cur))
    const cnt = q<HTMLElement>("#cnt")
    if (cnt) cnt.textContent = `${cur + 1} / ${S.length}`
    const p = q<HTMLElement>("#sprog")
    if (p) p.style.width = `${((cur + 1) / S.length) * 100}%`
    opts.onSlideChange?.(cur, S.length)
  }

  function fullscreen() {
    const el = (root instanceof Document ? root.documentElement : root) as HTMLElement
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen?.()
  }

  const onResize = () => fit()
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { show(cur + 1); e.preventDefault() }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { show(cur - 1); e.preventDefault() }
    else if (e.key === "Home") show(0)
    else if (e.key === "End") show(S.length - 1)
    else if (e.key === "f" || e.key === "F") fullscreen()
  }

  addEventListener("resize", onResize)
  // Panel co/giãn mà CỬA SỔ không đổi (mở/đóng cây KHBD, kéo thanh chia đôi) thì sự kiện
  // `resize` KHÔNG bắn — phải theo dõi chính khung chứa, nếu không slide giữ nguyên tỉ lệ cũ
  // và tràn ra ngoài.
  let ro: ResizeObserver | null = null
  const stageEl = q<HTMLElement>(".stage")
  if (stageEl && typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => fit())
    ro.observe(stageEl)
  }
  if (opts.keyboard !== false) addEventListener("keydown", onKey)
  const prev = q<HTMLElement>("#prev"), next = q<HTMLElement>("#next"), fsb = q<HTMLElement>("#fs")
  const goPrev = () => show(cur - 1), goNext = () => show(cur + 1)
  prev?.addEventListener("click", goPrev)
  next?.addEventListener("click", goNext)
  fsb?.addEventListener("click", fullscreen)

  collect(); fit(); show(0)

  return {
    show, next: goNext, prev: goPrev,
    cur: () => cur,
    count: () => S.length,
    fit, fullscreen,
    refresh() { collect(); if (cur >= S.length) cur = S.length - 1; show(cur) },
    destroy() {
      removeEventListener("resize", onResize)
      ro?.disconnect(); ro = null
      removeEventListener("keydown", onKey)
      prev?.removeEventListener("click", goPrev)
      next?.removeEventListener("click", goNext)
      fsb?.removeEventListener("click", fullscreen)
    },
  }
}

/**
 * Bản tương thích cho tool `pptx_html` (deck .pptx→HTML): giữ nguyên `window.__deck` và giao thức
 * postMessage `{lpGoto}` / `{lpReady,count}` mà preview-modal đang dùng.
 */
export function attachLegacyPlayer(w = 1280, h = 720): Player {
  const p = attachPlayer(document, { w, h })
  addEventListener("message", (e: MessageEvent) => {
    const d = (e as any).data || {}
    if (typeof d.lpGoto === "number") p.show(d.lpGoto)
  })
  try { parent.postMessage({ lpReady: true, count: p.count() }, "*") } catch { /* ngoài iframe */ }
  ;(window as any).__deck = { show: p.show, fit: p.fit, cur: p.cur, refresh: p.refresh }
  return p
}
