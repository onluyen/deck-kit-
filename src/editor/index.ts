/**
 * Editor: kiểu dùng chung + các helper đọc/ghi DOM.
 *
 * Port từ `_EDIT_JS` (22 KB inline string trong Python) sang TS để linter/test chạm tới được.
 * Vòng đời (gắn handler, undo, autosave, rail/side) do `mount.ts` điều phối — module này
 * chỉ giữ phần thuần: đọc dữ liệu ra khỏi DOM và dựng HTML slide mới.
 */

export type EditorOpts = {
  onSave?: (patch: any) => void
  onRequestImage?: (index: number) => void
  onRequestRegenImage?: (index: number, prompt?: string) => void
  onReset?: () => void
  autoSaveMs?: number
}

export type DeckColumn = { title: string; bullets: string[] }

/**
 * State sửa slide — nguồn sự thật cho những gì KHÔNG đọc lại được từ DOM
 * (bố cục đã đổi, màu nhấn, slide bị ẩn, và dữ liệu đã tự chuyển ý ⇄ cột).
 */
export type EditorState = {
  kinds: Record<number, string>
  accents: Record<number, string>
  skipped: Record<number, boolean>
  /** Dữ liệu đã TỰ CHUYỂN khi đổi bố cục (ý ⇄ cột) — ghi hẳn vào edits để bền. */
  columns: Record<number, DeckColumn[]>
  bullets: Record<number, string[]>
}

export function newEditorState(): EditorState {
  return { kinds: {}, accents: {}, skipped: {}, columns: {}, bullets: {} }
}

/** Text của một `[data-e]` — gộp mọi khoảng trắng để so sánh ổn định. */
export function readText(el: HTMLElement): string {
  return (el.innerText || "").replace(/\s+/g, " ").trim()
}

/** Đọc các ý (bullets) đang hiển thị trong một slide. */
export function readBul(sec: HTMLElement): string[] {
  const out: string[] = []
  sec.querySelectorAll<HTMLElement>("[data-e]").forEach(el => {
    const p = (el.getAttribute("data-e") || "").split(".")
    if (p[1] === "bullets") {
      const v = readText(el)
      if (v) out.push(v)
    }
  })
  return out
}

/** Đọc các cột đang hiển thị trong một slide. */
export function readCols(sec: HTMLElement): DeckColumn[] {
  const m: Record<number, DeckColumn> = {}
  sec.querySelectorAll<HTMLElement>("[data-e]").forEach(el => {
    const p = (el.getAttribute("data-e") || "").split(".")
    if (p[1] !== "columns") return
    const i = +p[2]
    const v = readText(el)
    m[i] = m[i] || { title: "", bullets: [] }
    if (p[3] === "title") m[i].title = v
    else if (v) m[i].bullets.push(v)
  })
  return Object.keys(m)
    .sort((a, b) => +a - +b)
    .map(k => m[+k])
}

/**
 * Tách danh sách ý thành cột cho khớp bố cục `k`.
 *
 * `proscons`/`comparetable` chia đôi danh sách (ý đầu → cột trái); còn lại mỗi ý thành
 * tiêu đề một cột, cắt theo sức chứa của bố cục.
 */
export function toCols(k: string, bs: string[]): DeckColumn[] {
  if (!bs.length) return []
  if (k === "proscons" || k === "comparetable") {
    const h = Math.ceil(bs.length / 2)
    return [
      { title: k === "proscons" ? "Ưu điểm" : "Cột 1", bullets: bs.slice(0, h) },
      { title: k === "proscons" ? "Nhược điểm" : "Cột 2", bullets: bs.slice(h) },
    ]
  }
  const cap = k === "bignum" || k === "three" || k === "compare" ? 3 : 4
  return bs.slice(0, cap).map(b => ({ title: b, bullets: [] }))
}

/** Làm phẳng cột thành danh sách ý (tiêu đề cột cũng thành một ý). */
export function colsToBul(cs: DeckColumn[]): string[] {
  const fl: string[] = []
  cs.forEach(c => {
    if (c.title) fl.push(c.title)
    c.bullets.forEach(b => fl.push(b))
  })
  return fl.slice(0, 12)
}

/** HTML ruột của một slide trống GV vừa thêm. */
export function newSlideHTML(): string {
  return (
    '<div class="slidebar"><button class="edmv" data-d="-1" title="Chuyển lên">▲</button>' +
    '<button class="edmv" data-d="1" title="Chuyển xuống">▼</button>' +
    '<button class="eddel" title="Xoá slide này">✕</button></div>' +
    '<div class="hd"><div class="kick"></div><div class="ttl" contenteditable="true" data-e="n.title">Tiêu đề slide mới</div></div>' +
    '<div class="rule"></div><div class="foot"></div><div class="pgno"></div>' +
    '<div class="body"><ul class="bul" data-base="n.bullets">' +
    '<li><span contenteditable="true" data-e="n.bullets.0">Nội dung…</span><button class="edx" title="Xoá ý">×</button></li>' +
    '</ul><button class="edadd" data-base="n.bullets">+ ý</button></div>'
  )
}
