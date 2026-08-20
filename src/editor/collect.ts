/**
 * collect(): Thu thập edits từ DOM → gói gửi lên server.
 *
 * Đọc mọi `[data-e]` trong DOM + state (kinds/accents/skipped/cols/bul đã tự chuyển)
 * → trả object `{edits, structure, skipped}` ánh xạ thẳng sang `apply_edits` phía Python.
 */
/**
 * Đọc chữ trong vùng sửa, GIỮ 4 thẻ inline an toàn (`<b> <i> <sup> <sub>`).
 *
 * `innerText` phẳng hết thẻ, nên chỉ cần GV sửa MỘT ý là mọi định dạng trên slide đó biến mất
 * rồi được lưu đè bản phẳng — mất dữ liệu im lặng. Giáo án thật có 43% khối mang định dạng
 * (đậm cho thuật ngữ, nghiêng cho biến, chỉ số dưới `Sₜₚ`) nên mất là thấy ngay.
 *
 * Chỉ giữ đúng 4 thẻ KHÔNG thuộc tính; thẻ khác và mọi thuộc tính đều bị bỏ, nên chuỗi thu về
 * vẫn nằm trong đúng tập mà `escRich` biết mở lại — không có đường cho HTML lạ đi vòng.
 */
function richText(el: HTMLElement): string {
  const walk = (n: Node): string => {
    if (n.nodeType === 3) return n.textContent || ""
    if (n.nodeType !== 1) return ""
    const e = n as HTMLElement
    const kids = Array.from(e.childNodes).map(walk).join("")
    const tag = e.tagName.toLowerCase()
    if (tag === "b" || tag === "strong") return `<b>${kids}</b>`
    if (tag === "i" || tag === "em") return `<i>${kids}</i>`
    if (tag === "sup" || tag === "sub") return `<${tag}>${kids}</${tag}>`
    if (tag === "br") return " "
    if (tag === "button") return ""            // nút "×" xoá ý — không phải nội dung
    return kids
  }
  return walk(el).replace(/\s+/g, " ").trim()
}

export function collect(root: HTMLElement, state: any): any {
  const e: Record<string, any> = {}

  // Chỉ đọc slide THẬT trong `#scaler`. Rail chứa bản CLONE của từng slide (kèm `data-index`
  // và mọi `[data-e]`) — quét cả trang sẽ đọc mỗi ý hai lần và nhân đôi dữ liệu khi lưu.
  root.querySelectorAll<HTMLElement>("#scaler > .slide[data-index]").forEach(sec => {
    if (sec.dataset.new) return // slide mới GV thêm → vào structure, không vào edits
    const idx = sec.dataset.index!

    sec.querySelectorAll<HTMLElement>("[data-e]").forEach(el => {
      const p = (el.getAttribute("data-e") || "").split(".")
      const v = richText(el)
      const o = (e[idx] = e[idx] || {})
      const f = p[1]

      if (f === "bullets") {
        ;(o.bullets = o.bullets || []).push(v)
      } else if (f === "columns") {
        const ci = +p[2]
        o.columns = o.columns || []
        const col = (o.columns[ci] = o.columns[ci] || { title: "", bullets: [] })
        if (p[3] === "title") col.title = v
        else col.bullets.push(v)
      } else if (f === "table") {
        // `table.<hàng>.<cột>` — phải dựng lại MA TRẬN, không thì nhánh `else` bên dưới
        // ghi đè `o.table` bằng chữ của ô cuối cùng và mất cả bảng.
        const r = +p[2], c = +p[3]
        o.table = o.table || []
        o.table[r] = o.table[r] || []
        o.table[r][c] = v
      } else if (f === "question") {
        o.question = o.question || {}
        if (p[2] === "stem") o.question.stem = v
        else if (p[2] === "options") (o.question.options = o.question.options || [])[+p[3]] = v
      } else if (f === "image" && p[2] === "title") {
        o.image_title = v                         // chú thích ảnh (backend map sang figure.title)
      } else if (f === "images" && p[3] === "title") {
        ;(o.images_title = o.images_title || [])[+p[2]] = v
      } else {
        o[f] = v                                  // title/subtitle/caption/kicker/formula…
      }
    })
  })

  // Ghi đè từ state (đã tự chuyển dữ liệu khi đổi bố cục)
  Object.keys(state.kinds).forEach(i => {
    e[i] = e[i] || {}
    e[i].kind = state.kinds[i]
  })
  Object.keys(state.accents).forEach(i => {
    e[i] = e[i] || {}
    e[i].accent = state.accents[i]
  })
  Object.keys(state.columns).forEach(i => {
    e[i] = e[i] || {}
    e[i].columns = state.columns[i]
  })
  Object.keys(state.bullets).forEach(i => {
    e[i] = e[i] || {}
    e[i].bullets = state.bullets[i]
  })

  const _sk: number[] = []
  Object.keys(state.skipped).forEach(i => {
    if (state.skipped[i]) _sk.push(+i)
  })
  e.skipped = _sk

  // structure: thứ tự slide (kể cả slide GV thêm mới)
  const st: Array<{ ref?: number; new?: any }> = []
  root.querySelectorAll<HTMLElement>("#scaler > .slide").forEach(sec => {
    if (sec.dataset.new) {
      st.push({ new: readNew(sec) })
    } else if (sec.dataset.index != null) {
      st.push({ ref: +sec.dataset.index })
    }
  })
  e.structure = st

  return e
}

function readNew(sec: HTMLElement) {
  const o: any = { kind: sec.dataset.kind || "content", title: "", subtitle: "", bullets: [], columns: [] }
  sec.querySelectorAll<HTMLElement>("[data-e]").forEach(el => {
    const p = (el.getAttribute("data-e") || "").split(".")
    const f = p[1]
    const v = richText(el)
    if (f === "title") o.title = v
    else if (f === "subtitle") o.subtitle = v
    else if (f === "bullets") {
      if (v) o.bullets.push(v)
    } else if (f === "columns") {
      const ci = +p[2]
      o.columns[ci] = o.columns[ci] || { title: "", bullets: [] }
      if (p[3] === "title") o.columns[ci].title = v
      else if (v) o.columns[ci].bullets.push(v)
    }
  })
  if (!o.columns.length) delete o.columns
  if (!o.subtitle) delete o.subtitle
  return o
}
