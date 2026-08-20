/**
 * Picker: bộ chọn bố cục, mỗi ô xem trước bằng CHÍNH bố cục thật.
 *
 * Vì sao đổi cách xem trước
 * -------------------------
 * Bản đầu có hai thứ, cả hai đều SAI:
 *
 *  1. `mini()` — sơ đồ vẽ TAY cho từng bố cục, 38 `case` cho 41 bố cục chọn được. Ba bố cục
 *     (`defcard`, `tablewide`, `formulasteps`) không có `case` nên rơi vào icon gạch đầu dòng
 *     chung: chọn "Bảng rộng" mà nhìn thấy hình danh sách.
 *  2. Rê chuột thì đổi `sec.dataset.kind` trên slide THẬT — thay đổi ở mức CSS. Nhưng mỗi bố
 *     cục có builder riêng sinh DOM khác hẳn (`BUILDERS`, 46 hàm), nên thấy một đằng bấm ra
 *     một nẻo. Nó còn để lại bẫy: `unpreview()` khôi phục `origKind` chụp lúc MỞ picker, bất
 *     cứ đường nào đổi slide trong lúc picker mở là để lại `kind` sai.
 *
 * Giờ mỗi ô render bằng đúng đường thật: `convert(slide, k)` → `renderSlide(...)`. Cả hai đều
 * là hàm THUẦN (không chạm đĩa/mạng) nên gọi thẳng được. Xem trước đúng với thứ sẽ nhận, và
 * xem được CẢ 41 ô cùng lúc thay vì phải rê từng cái.
 *
 * Render LƯỜI bằng `IntersectionObserver` (lưới 4 cột ⇒ ~12 ô trong tầm nhìn) và nhớ kết quả
 * vào `Map`, nên cuộn/rê chuột không render lại.
 */
import { SELECTABLE_LAYOUTS, GROUP_ORDER, LAYOUT_BY_KEY } from "../layouts/manifest"
import type { DeckSlide } from "../model"
import { canConvert, convert } from "../layouts/convert"
import { renderSlide } from "../render"
import { esc } from "../util/html"

/** Observer vẽ-lười của lần mở picker gần nhất — giữ ở module để `closePicker()` dọn được. */
let pickerIO: IntersectionObserver | null = null

export function openPicker(
  idx: number,
  current: string,
  sec: HTMLElement,
  opts: {
    onSelect: (kind: string, idx: number, sec: HTMLElement) => void
  }
): void {
  let pk = document.getElementById("lp-picker")
  if (!pk) {
    pk = document.createElement("div")
    pk.id = "lp-picker"
    document.body.appendChild(pk)
  }

  // Slide GIẢ dựng từ `data-nb/nc/nct/nf` — chỉ cần đủ để `canConvert` đếm.
  // `nct` (số cột CÓ tiêu đề) phải phản ánh đúng, không thì bố cục cần tiêu đề cột bị khoá oan.
  const nb = +(sec.dataset.nb || 0)
  const nc = +(sec.dataset.nc || 0)
  const nct = +(sec.dataset.nct || 0)
  const nf = +(sec.dataset.nf || 0)

  // Đọc chữ THẬT từ DOM, không bịa "ý 1"/"cột 1": cảnh báo độ vừa vặn đo ĐỘ DÀI, mà chữ
  // giả thì lúc nào cũng ngắn ⇒ cảnh báo không bao giờ nổ. Thiếu chữ (slide chưa render
  // phần đó) thì mới lùi về đếm theo `data-nb/nc`.
  const txt = (sel: string) => Array.from(sec.querySelectorAll<HTMLElement>(sel))
    .map(e => (e.innerText || "").replace(/\s+/g, " ").trim()).filter(Boolean)

  // KHÔNG gộp `[data-e*='.bullets.']` với `ul.bul li`: ở chế độ sửa mỗi <li> BỌC một
  // <span data-e> nên hai selector khớp CÙNG một ý ⇒ đếm gấp đôi (3 ý báo thành 6).
  const marked = txt("[data-e*='.bullets.']")
  const realBullets = marked.length ? marked : txt("ul.bul li")
  const realColTitles = txt("[data-e$='.title'][data-e*='.columns.'], .col .ch, .c3-h, .metric .val, .kpi-v")

  const slide: DeckSlide = {
    id: sec.dataset.id || String(idx),
    kind: sec.dataset.kind || "content",
    title: (sec.querySelector<HTMLElement>(".ttl,.msg,.qmsg,.sec-ttl,.hbig")?.innerText || "").trim(),
    bullets: realBullets.length ? realBullets
      : Array.from({ length: nb }, (_, i) => `ý ${i + 1}`),
    columns: (realColTitles.length ? realColTitles : Array.from({ length: nc }, (_, i) => i < nct ? `cột ${i + 1}` : ""))
      .map(t => ({ title: t, bullets: [] })),
    images: Array.from({ length: nf }, (_, i) => ({ asset: `pv${i}` })),
    locked: sec.dataset.locked === "1",
  }

  // Bảng ảnh cho ô xem trước.
  //
  // Builder ảnh (`gallery`, `imageleft`, `imageright`) cố tình lùi về `h_content` khi không
  // có ảnh — đúng đắn lúc render thật ("không có ảnh thì đừng để khung rỗng"), nhưng ở ô xem
  // trước thì thành 3 ô hiện bố cục CONTENT trong khi nhãn ghi "Ảnh trái". `uri()` tra ảnh
  // theo ID trong `ctx.assets`, nên phải dựng bảng khớp với id `pv0…` ở trên.
  //
  // Ảnh thật của slide lấy từ DOM; slide chưa có ảnh thì dùng ô xám 1×1 để bố cục vẫn hiện
  // đúng khung — GV thấy được chỗ ảnh sẽ nằm.
  const GREY = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="5">' +
    '<rect width="8" height="5" fill="%23c7cede"/></svg>')
  const domSrc = Array.from(sec.querySelectorAll<HTMLImageElement>("img"))
    .map(im => im.getAttribute("src") || "").filter(Boolean)
  const pvAssets: Record<string, string> = {}
  for (let i = 0; i < Math.max(nf, 4); i++) pvAssets[`pv${i}`] = domSrc[i] || GREY

  let h = '<div class="pk-box"><div class="pk-hd">Chọn bố cục slide' +
    '<input id="pk-q" class="pk-q" type="search" placeholder="Tìm bố cục… (gõ tên)" autocomplete="off">' +
    '<button class="pk-x" title="Đóng">✕</button></div><div class="pk-body">'

  GROUP_ORDER.forEach(g => {
    const items = SELECTABLE_LAYOUTS.filter(l => l.group === g)
    if (!items.length) return
    h += `<div class="pk-g" data-g="${g}">${g}</div><div class="pk-grid" data-g="${g}">`
    items.forEach(o => {
      const chk = canConvert(slide, o.key)
      const lk = chk.ok ? "" : chk.reason || "Không đủ dữ liệu"
      const warn = chk.ok && chk.willHide ? ` data-hide="${chk.willHide}"` : ""
      // Cảnh báo VỪA VẶN khác cảnh báo KHOÁ: ô vẫn bấm được, chỉ báo trước là sẽ xấu.
      const fit = chk.fitWarning || []
      const tip = !chk.ok ? lk : fit.join(" · ")
      h +=
        `<button class="pk-tile${o.key === current ? " on" : ""}${!chk.ok ? " off" : ""}` +
        `${chk.ok && fit.length ? " tight" : ""}" data-k="${o.key}"` +
        ` data-s="${norm(o.label + " " + o.key + " " + o.group)}"` +
        `${!chk.ok ? " disabled" : ""}${tip ? ` title="${esc(tip)}"` : ""}${warn}>` +
        // Khung rỗng — nội dung do `paintTile()` đổ vào khi ô lọt vào tầm nhìn.
        '<span class="pk-mini" data-pv="1"></span>' +
        `<span class="pk-lb">${o.label}</span>` +
        (!chk.ok ? '<span class="pk-lock">🔒</span>' : "") +
        (chk.willHide ? `<span class="pk-warn">⚠ Ẩn ${chk.willHide}</span>` : "") +
        (chk.ok && fit.length ? '<span class="pk-tight">Chữ hơi dài</span>' : "") +
        `</button>`
    })
    h += "</div>"
  })
  h += '<div class="pk-none" hidden>Không có bố cục nào khớp</div></div></div>'
  pk.innerHTML = h

  pk.classList.add("show")
  pk.querySelector(".pk-x")!.addEventListener("click", () => closePicker())
  pk.onclick = e => {
    if (e.target === pk) closePicker()
  }

  const tiles = Array.from(pk.querySelectorAll<HTMLButtonElement>(".pk-tile"))

  // ── Xem trước THẬT trong từng ô ────────────────────────────────────────────
  // Nhớ theo `kind`: cùng một slide nguồn nên kết quả không đổi giữa các lần cuộn.
  const cache = new Map<string, string>()

  const paintTile = (b: HTMLButtonElement) => {
    const box = b.querySelector<HTMLElement>(".pk-mini[data-pv]")
    if (!box || box.dataset.done) return
    const k = b.getAttribute("data-k")!
    let html = cache.get(k)
    if (html == null) {
      // Đúng đường render thật — không phải sơ đồ vẽ tay.
      // Bố cục bị KHOÁ vẫn xem trước được: `convert()` trả lại slide nguyên vẹn khi không
      // chuyển được, nên ô hiện bố cục đó với dữ liệu sẵn có. GV thấy được vì sao nó khoá.
      // Bố cục ảnh cần `images` để không lùi về `content`. Slide nguồn có thể không có ảnh
      // nào (`nf=0`), nên cấp ảnh giữ chỗ RIÊNG cho ô xem trước — không đụng `slide` gốc
      // (nó còn dùng cho `canConvert`, thêm ảnh giả vào là mở khoá oan).
      // `image` (một) và `images` (nhiều) là HAI trường khác nhau — builder đọc đúng trường
      // mà bố cục khai trong `renders`. Cấp nhầm trường thì builder vẫn lùi về `content`:
      // `imageleft` đọc `sl.image`, còn `gallery` đọc `sl.images`.
      const def = LAYOUT_BY_KEY[k]
      const rn = def?.renders || []
      // `convert()` trả slide NGUYÊN VẸN khi bố cục đích bị khoá (`convert.ts:147`) — đúng
      // cho đường ghi thật (không được đổi khi thiếu dữ liệu), nhưng ở đây thì ô sẽ hiện bố
      // cục CŨ dưới nhãn bố cục MỚI. Ép `kind` để ô luôn cho thấy bố cục của chính nó; đây
      // chỉ là bản xem, không ghi đi đâu.
      let src = { ...convert(slide, k), kind: k }
      if (rn.includes("images") && !(src.images || []).length) {
        src = { ...src, images: [{ asset: "pv0" }, { asset: "pv1" }, { asset: "pv2" }] }
      }
      if (rn.includes("image") && !src.image) {
        src = { ...src, image: { asset: "pv0" } }
      }
      html = renderSlide(src, { idx: 0, pos: 1, foot: "", assets: pvAssets })
      cache.set(k, html)
    }
    box.innerHTML = html
    box.dataset.done = "1"
  }

  // Lười: chỉ render ô đang trong tầm nhìn (lưới 4 cột ⇒ ~12 ô). Render hết 41 ô ngay là
  // phí — phần lớn không bao giờ được nhìn tới.
  if (typeof IntersectionObserver === "function") {
    // Dọn observer của lần mở TRƯỚC. `openPicker` ghi đè `pk.innerHTML` nên các ô cũ đã rời
    // DOM, nhưng observer trỏ vào chúng thì vẫn sống: mở picker 20 lần là 20 observer treo
    // lại, mỗi cái giữ tham chiếu tới cả lưới ô cũ.
    pickerIO?.disconnect()
    const io = new IntersectionObserver(ents => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          paintTile(e.target as HTMLButtonElement)
          io.unobserve(e.target)
        }
      })
    }, { root: pk.querySelector(".pk-body"), rootMargin: "160px" })
    pickerIO = io
    tiles.forEach(b => io.observe(b))
  } else {
    tiles.forEach(paintTile)          // môi trường không có IO (test cũ) → vẽ hết
  }

  tiles.forEach(b => {
    b.onclick = () => {
      if (b.disabled) return
      opts.onSelect(b.getAttribute("data-k")!, idx, sec)
      closePicker()
    }
    // Rê/focus vào ô chưa kịp vẽ thì vẽ ngay, khỏi chờ observer.
    //
    // Gắn cho CẢ ô bị khoá: khoá nghĩa là "chưa đủ dữ liệu để chuyển", nhưng đó chính là lúc
    // GV cần nhìn xem bố cục ấy trông ra sao để quyết định có bổ sung dữ liệu hay không.
    // Bản đầu chỉ gắn cho ô bấm được ⇒ 3 bố cục ảnh (`gallery`/`imageleft`/`imageright`) bị
    // khoá trên slide không ảnh, và ô của chúng TRỐNG TRƠN.
    b.onmouseenter = () => paintTile(b)
    b.onfocus = () => paintTile(b)
  })

  // ── Ô tìm kiếm ──
  const q = pk.querySelector<HTMLInputElement>("#pk-q")
  const none = pk.querySelector<HTMLElement>(".pk-none")
  if (q) {
    const filter = () => {
      const s = norm(q.value)
      let shown = 0
      tiles.forEach(b => {
        const hit = !s || (b.getAttribute("data-s") || "").includes(s)
        b.hidden = !hit
        if (hit) shown++
      })
      // ẩn luôn tiêu đề nhóm không còn ô nào
      pk.querySelectorAll<HTMLElement>(".pk-grid").forEach(grid => {
        const any = Array.from(grid.querySelectorAll<HTMLElement>(".pk-tile")).some(t => !t.hidden)
        grid.hidden = !any
        const head = pk.querySelector<HTMLElement>(`.pk-g[data-g="${grid.dataset.g}"]`)
        if (head) head.hidden = !any
      })
      if (none) none.hidden = shown > 0
    }
    q.oninput = filter
    q.onkeydown = e => {
      if (e.key === "Escape") { if (q.value) { q.value = ""; filter() } else closePicker(); e.stopPropagation() }
      // Enter = chọn ô đầu tiên còn hiện (dùng bàn phím là chọn được ngay)
      if (e.key === "Enter") {
        const first = tiles.find(t => !t.hidden && !t.disabled)
        if (first) first.click()
      }
    }
    setTimeout(() => q.focus(), 30)
  }

  // Esc ở bất kỳ đâu trong picker cũng đóng
  pk.onkeydown = e => { if (e.key === "Escape") closePicker() }
}

/**
 * Bỏ dấu tiếng Việt + hạ chữ thường — gõ "muc luc" vẫn tìm ra "Mục lục".
 *
 * Dùng escape `\u0300-\u036f` (dải dấu kết hợp) chứ KHÔNG dán ký tự dấu thẳng vào source:
 * ký tự vô hình trong regex rất dễ bị công cụ/biên tập viên làm hỏng mà không ai thấy.
 * `đ` không phải chữ `d` + dấu nên NFD không tách được, phải thay riêng.
 */
function norm(s: string): string {
  return (s || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
}

export function closePicker(): void {
  const pk = document.getElementById("lp-picker")
  if (pk) pk.classList.remove("show")
  // Đóng là thôi theo dõi — ô đã khuất, không có gì để vẽ lười nữa.
  pickerIO?.disconnect()
  pickerIO = null
}

/**
 * Mini-preview: sơ đồ thu nhỏ của bố cục — khớ với JS cũ để CSS không đổi.
 */
