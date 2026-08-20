/**
 * Rail: thumbnail kéo-thả đổi thứ tự, nhân bản, xoá.
 *
 * Nhân bản/xoá/chuyển slide uỷ quyền ngược cho `mount.ts` qua callback (không dùng biến
 * global) để chỉ có MỘT bản cài đặt và nhiều deck cùng trang không giẫm lên nhau.
 *
 * Dựng lại CÓ CHỌN LỌC — vì sao
 * ------------------------------
 * Bản đầu làm `rail.innerHTML = ""` rồi clone lại TOÀN BỘ thumbnail mỗi lần `syncEditor()`.
 * Mà `syncEditor()` chạy cả trong `onSlideChange` (`mount.ts`), nên **mỗi lần bấm mũi tên**
 * là dựng lại hết. Trên bài thật 156 slide, mỗi thumbnail là một slide 1280×720 clone đầy đủ
 * rồi thu nhỏ bằng `transform:scale()` (`edit.css`) — tức layout + paint THẬT, không phải ảnh
 * rẻ tiền. Đo được: 156 clone cho một thao tác không đổi nội dung gì cả.
 *
 * Giờ đối chiếu theo khoá `data-sid`: dùng lại node cũ, chỉ clone lại thumbnail khi nội dung
 * slide đó THẬT SỰ đổi (so bằng `_sig`), đổi thứ tự bằng cách di chuyển node sẵn có.
 *
 * ⚠️ Bất biến phải giữ bằng mọi giá: `railThumb` gỡ `data-index`/`data-id`/`data-e` khỏi bản
 * clone. Thiếu bước đó thì `collect()` coi thumbnail là slide thật và **ghi dữ liệu hai lần**
 * — mất chỉnh sửa của giáo viên. Dùng lại node KHÔNG được đụng tới bất biến này.
 */

import { icon } from "../ui/icons"

let dragSource: HTMLElement | null = null

export type RailOpts = {
  /** `note` = lời nhắc riêng cho thao tác vừa làm (hiện trên thanh trạng thái). */
  onSync: (note?: string) => void
  onMsg: (m: string) => void
  pushUndo: (fn: () => void) => void
  onGoto: (i: number) => void
  onDup: (sec: HTMLElement) => void
  onDel: (sec: HTMLElement) => void
}

/**
 * Đếm số lần clone thumbnail — để cổng `railperf_test` đo được việc dựng lại có thật sự
 * giảm hay không. Nếu chỉ đo bằng mắt thì hồi quy sẽ lọt: nhìn vẫn đúng, chỉ là chậm.
 */
declare global {
  interface Window { __dkRailClones?: number }
}
function countClone(): void {
  if (typeof window !== "undefined") window.__dkRailClones = (window.__dkRailClones || 0) + 1
}

/**
 * Dấu vân tay nội dung slide. Đổi ⇒ phải vẽ lại thumbnail.
 *
 * Dùng `innerHTML` vì thumbnail là bản sao y của DOM — bất cứ thứ gì đổi trong đó đều phải
 * thấy trên thumbnail. Kèm `kind`/`skipped`/style (màu nhấn ghi bằng inline style) vì chúng
 * nằm trên chính thẻ `<section>` chứ không nằm trong `innerHTML`.
 */
function sig(sec: HTMLElement): string {
  return (sec.dataset.kind || "") + "|" + (sec.classList.contains("skipped") ? "1" : "0") +
    "|" + (sec.getAttribute("style") || "") + "|" + sec.innerHTML.length +
    "|" + sec.innerHTML
}

/** Khoá nhận dạng slide. `data-id` bền hơn vị trí; slide mới chưa có id thì tạo tạm. */
let tmpSeq = 0
function sidOf(sec: HTMLElement): string {
  let s = sec.dataset.railSid
  if (!s) {
    s = sec.dataset.id || `tmp${++tmpSeq}`
    sec.dataset.railSid = s
  }
  return s
}

/**
 * Tiêu đề nhóm cho slide thứ `i`, hoặc `null` nếu nó không mở đầu nhóm nào.
 *
 * Suy từ slide `section`/`hero` — đó chính là slide ngăn cách mà `_divider_plan` chèn ở đầu
 * mỗi tiết. Không bịa thêm dữ liệu: bài 156 slide vốn đã có sẵn mốc, chỉ là rail chưa dùng.
 */
function groupTitle(sec: HTMLElement): string | null {
  const k = sec.dataset.kind || ""
  if (k !== "section" && k !== "hero") return null
  const t = sec.querySelector<HTMLElement>(".sec-ttl,.hbig")
  const s = (t?.textContent || sec.dataset.title || "").trim()
  return s || null
}

/** Bộ lọc rail hiện hành. `""` = hiện hết. */
let railFilter = ""

export function buildRail(root: HTMLElement, opts: RailOpts): void {
  // Tìm trong `root` trước (nhiều deck cùng trang), rồi mới tới document.
  const rail = root.querySelector<HTMLElement>("#lp-rail") || document.getElementById("lp-rail")
  if (!rail) return
  const secs = Array.from(root.querySelectorAll<HTMLElement>("#scaler > .slide"))

  // Gom node đang có theo khoá để dùng lại.
  const old = new Map<string, HTMLElement>()
  rail.querySelectorAll<HTMLElement>(".rail-it").forEach(it => {
    const s = it.dataset.sid
    if (s) old.set(s, it)
  })

  const wanted: HTMLElement[] = []

  secs.forEach((sec, i) => {
    const sid = sidOf(sec)
    let it = old.get(sid)

    if (it) {
      old.delete(sid)
      // Nội dung đổi thì mới vẽ lại thumbnail — đây là chỗ tiết kiệm chính.
      const s = sig(sec)
      if (it.dataset.sig !== s) {
        const t = it.querySelector(".rail-thumb")
        if (t) t.replaceWith(railThumb(sec))
        it.dataset.sig = s
      }
    } else {
      it = document.createElement("div")
      it.dataset.sid = sid
      it.draggable = true
      it.appendChild(railThumb(sec))
      it.dataset.sig = sig(sec)

      const n = document.createElement("span")
      n.className = "rail-num"
      it.appendChild(n)

      const du = document.createElement("button")
      du.className = "rail-dup"
      du.title = "Nhân bản"
      du.innerHTML = icon("duplicate")
      it.appendChild(du)

      const dl = document.createElement("button")
      dl.className = "rail-del"
      dl.title = "Xoá slide"
      dl.innerHTML = icon("trash")
      it.appendChild(dl)
    }

    // Class + số thứ tự cập nhật MỖI lần (rẻ), vì chúng đổi theo vị trí và slide đang chọn.
    it.className = "rail-it" +
      (sec.classList.contains("active") ? " on" : "") +
      (sec.classList.contains("skipped") ? " skip" : "")
    if (sec.dataset.locked === "1") it.dataset.locked = "1"
    else delete it.dataset.locked
    const num = it.querySelector<HTMLElement>(".rail-num")
    if (num) num.textContent = String(i + 1)

    // Handler bind LẠI mỗi lần: chúng bắt `sec`/`i` theo closure, mà node được dùng lại có
    // thể đã trỏ sang slide khác sau khi đổi thứ tự. Dùng thuộc tính `on*` (không phải
    // addEventListener) để gán đè, khỏi chồng handler cũ.
    wire(it, sec, i, opts)

    wanted.push(it)
  })

  // Node của slide đã bị xoá → gỡ đi.
  old.forEach(it => it.remove())

  // ── Tiêu đề nhóm theo TIẾT ────────────────────────────────────────────────
  // Bài thật 156 slide / 6 tiết trong một cột 150px: không có mốc thì tìm "đầu tiết 4" là
  // cuộn-và-nheo-mắt. Tiêu đề dựng lại mỗi lượt (rẻ — chỉ vài chữ, không phải clone slide).
  rail.querySelectorAll(".rail-g").forEach(g => g.remove())
  const seq: HTMLElement[] = []
  secs.forEach((sec, i) => {
    const gt = groupTitle(sec)
    if (gt) {
      const g = document.createElement("div")
      g.className = "rail-g"
      g.textContent = gt
      g.title = gt
      seq.push(g)
    }
    seq.push(wanted[i])
  })

  // Sắp lại đúng thứ tự, chỉ động vào chỗ lệch.
  seq.forEach((n, i) => {
    if (rail.children[i] !== n) rail.insertBefore(n, rail.children[i] || null)
  })

  applyFilter(rail)
}

/**
 * Lọc rail: `""` hiện hết · `skip` chỉ slide bị ẩn · `lock` chỉ slide nguyên văn.
 *
 * 57/156 slide của bài thật là `locked` (nội dung lấy nguyên văn giáo án, sửa không ăn) —
 * giấu được thứ không sửa được là đỡ thật khi đang soát bài.
 */
function applyFilter(rail: HTMLElement): void {
  const f = railFilter
  rail.querySelectorAll<HTMLElement>(".rail-it").forEach(it => {
    const hide = (f === "skip" && !it.classList.contains("skip"))
      || (f === "lock" && it.dataset.locked !== "1")
    it.hidden = hide
  })
  // Tiêu đề nhóm không còn ô nào bên dưới thì ẩn luôn, khỏi trơ tiêu đề rỗng.
  rail.querySelectorAll<HTMLElement>(".rail-g").forEach(g => {
    let n = g.nextElementSibling as HTMLElement | null
    let any = false
    while (n && !n.classList.contains("rail-g")) {
      if (n.classList.contains("rail-it") && !n.hidden) { any = true; break }
      n = n.nextElementSibling as HTMLElement | null
    }
    g.hidden = !any
  })
}

/** Đổi bộ lọc rail (gọi từ thanh công cụ). */
export function setRailFilter(root: HTMLElement, f: string): void {
  railFilter = f
  const rail = root.querySelector<HTMLElement>("#lp-rail") || document.getElementById("lp-rail")
  if (rail) applyFilter(rail)
}

export function getRailFilter(): string {
  return railFilter
}

function wire(it: HTMLElement, sec: HTMLElement, i: number, opts: RailOpts): void {
  const du = it.querySelector<HTMLElement>(".rail-dup")
  const dl = it.querySelector<HTMLElement>(".rail-del")

  it.onclick = ev => {
    if (ev.target === du || ev.target === dl) return
    opts.onGoto(i)
  }

  it.ondragstart = () => {
    dragSource = sec
    it.classList.add("drag")
  }
  it.ondragend = () => it.classList.remove("drag")
  it.ondragover = ev => ev.preventDefault()
  it.ondrop = ev => {
    ev.preventDefault()
    if (!dragSource || dragSource === sec) return
    const dpar = dragSource.parentNode
    const dref = dragSource.nextSibling
    const r = it.getBoundingClientRect()
    const after = ev.clientY - r.top > r.height / 2
    sec.parentNode!.insertBefore(dragSource, after ? sec.nextSibling : sec)
    const moved = dragSource
    opts.pushUndo(() => {
      dpar!.insertBefore(moved, dref)
    })
    dragSource = null
    opts.onSync("Đã đổi thứ tự — Ctrl+Z để hoàn tác")
  }

  if (du) du.onclick = ev => { ev.stopPropagation(); opts.onDup(sec) }
  if (dl) dl.onclick = ev => { ev.stopPropagation(); opts.onDel(sec) }
}

/**
 * Chỉ đổi slide ĐANG CHỌN — không đụng thumbnail.
 *
 * Đường riêng cho việc chuyển slide, vì chuyển slide KHÔNG đổi nội dung gì cả. Trước đây
 * nó gọi thẳng `buildRail()` nên bấm mũi tên một cái là clone lại cả 156 thumbnail.
 */
export function railSetActive(root: HTMLElement, index: number): void {
  const rail = root.querySelector<HTMLElement>("#lp-rail") || document.getElementById("lp-rail")
  if (!rail) return
  const items = rail.querySelectorAll<HTMLElement>(".rail-it")
  items.forEach((it, i) => it.classList.toggle("on", i === index))
  // Kéo slide đang chọn vào tầm nhìn — với bài 156 slide thì không có bước này là lạc chỗ.
  const cur = items[index]
  if (cur && typeof cur.scrollIntoView === "function") {
    cur.scrollIntoView({ block: "nearest" })
  }
}

/**
 * Thumbnail = bản CLONE của slide. Phải gỡ hết dấu nhận dạng (`data-index`, `data-id`,
 * `data-e`, `data-new`) — nếu không, `collect()` sẽ coi bản sao là slide thật và
 * ghi dữ liệu hai lần.
 */
function railThumb(sec: HTMLElement): HTMLElement {
  countClone()
  const t = document.createElement("div")
  t.className = "rail-thumb"
  const c = sec.cloneNode(true) as HTMLElement
  c.classList.remove("active")
  c.removeAttribute("data-index")
  c.removeAttribute("data-id")
  c.removeAttribute("data-new")
  c.removeAttribute("data-rail-sid")
  const sb = c.querySelector(".slidebar")
  if (sb) sb.remove()
  c.querySelectorAll("[data-e]").forEach(e => e.removeAttribute("data-e"))
  c.querySelectorAll("[contenteditable]").forEach(e => e.setAttribute("contenteditable", "false"))
  t.appendChild(c)
  return t
}
