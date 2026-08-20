/**
 * Ma trận chuyển đổi bố cục — "bố cục nào đổi được sang bố cục nào, và dữ liệu đi theo thế nào".
 *
 * Nguyên tắc: KHÔNG BAO GIỜ XOÁ dữ liệu khi đổi bố cục. Bố cục mới không hiển thị phần nào thì
 * phần đó chỉ *tạm ẩn* (đổi ngược lại là thấy nguyên vẹn), và người dùng được báo trước.
 */
import type { DeckSlide, SlideColumn } from "../model"
import { LAYOUT_BY_KEY, type LayoutDef } from "./manifest"

export type ConvertCheck = {
  ok: boolean
  /** Lý do khoá (hiện trong tooltip) khi `ok=false`. */
  reason?: string
  /** Số ý/cột sẽ tạm ẩn nếu đổi (bố cục mới không render phần đó) — để cảnh báo trước. */
  willHide?: number
  /** Dữ liệu sẽ được tự chuyển dạng (ý → cột hoặc ngược lại). */
  transform?: "bulletsToColumns" | "columnsToBullets"
  /**
   * Nội dung ĐỔI ĐƯỢC nhưng nhìn sẽ xấu (chữ dài hơn sức chứa của bố cục).
   * KHÁC `reason`: đây chỉ cảnh báo, vẫn cho chọn — giáo viên có thể định rút gọn chữ
   * ngay sau khi đổi. Trước đây ý dài 65 ký tự vẫn đổi tuốt sang "Số lớn" (vốn cho "42%")
   * mà không một lời nhắc nào.
   */
  fitWarning?: string[]
}

const nonEmpty = (a?: string[]) => (a || []).filter(x => String(x || "").trim()).length
const colCount = (c?: SlideColumn[]) => (c || []).length
const colWithTitle = (c?: SlideColumn[]) => (c || []).filter(x => String(x?.title || "").trim()).length
const imgCount = (s: DeckSlide) => (s.images || []).length + (s.image ? 1 : 0)

/**
 * Đổi `slide` sang bố cục `to` được không? Có phải tự chuyển dạng dữ liệu không? Có ẩn bớt gì không?
 */
export function canConvert(slide: DeckSlide, to: string): ConvertCheck {
  const def = LAYOUT_BY_KEY[to]
  if (!def) return { ok: false, reason: "Bố cục không tồn tại" }
  if (!def.selectable) return { ok: false, reason: "Bố cục dành cho nội dung nguyên văn, không chọn tay được" }
  if (slide.locked) return { ok: false, reason: "Slide nội dung nguyên văn — không đổi bố cục" }

  const nb = nonEmpty(slide.bullets)
  const nc = colCount(slide.columns)
  const nct = colWithTitle(slide.columns)
  const need = def.needs || {}
  let transform: ConvertCheck["transform"]

  // Cần ẢNH thì không thể bịa
  if (need.images && imgCount(slide) < need.images) {
    return { ok: false, reason: `Cần ít nhất ${need.images} ảnh trong slide (hiện ${imgCount(slide)})` }
  }
  // Cần CỘT: có sẵn thì thôi, không thì tách từ các ý
  if (need.columns || need.columnsWithTitle) {
    const want = Math.max(need.columns || 0, need.columnsWithTitle || 0)
    const have = need.columnsWithTitle ? Math.max(nc, nct) : nc
    if (have < want) {
      if (nb >= Math.min(2, want)) transform = "bulletsToColumns"
      else return { ok: false, reason: `Cần ≥${want} cột, hoặc ≥2 ý để tách thành cột (hiện ${nb} ý)` }
    }
  }
  // Cần Ý: có sẵn thì thôi, không thì làm phẳng từ cột
  if (need.bullets && nb < need.bullets) {
    if (nc > 0) transform = "columnsToBullets"
    else return { ok: false, reason: `Cần ít nhất ${need.bullets} ý (hiện ${nb})` }
  }

  // Bố cục mới không render gì → cảnh báo tạm ẩn (KHÔNG chặn, dữ liệu vẫn còn)
  let willHide = 0
  if (!def.renders.includes("bullets") && transform !== "bulletsToColumns") willHide += nb
  if (!def.renders.includes("columns") && transform !== "columnsToBullets") willHide += nc
  const fitWarning = checkFit(slide, def, transform)
  return { ok: true, willHide: willHide || undefined, transform,
           fitWarning: fitWarning.length ? fitWarning : undefined }
}

/**
 * Nội dung có VỪA bố cục không — chỉ cảnh báo, không khoá.
 *
 * Ngưỡng `fits` lấy từ thống kê 990 slide thật + giới hạn hình học của từng bố cục
 * (xem `manifest.ts`). Ví dụ "Số lớn" vẽ nhãn cỡ 98px nên quá 18 ký tự là vỡ khung.
 */
function checkFit(slide: DeckSlide, def: LayoutDef, transform?: string): string[] {
  const f = def.fits
  if (!f) return []
  const out: string[] = []

  const title = String(slide.title || "").trim()
  if (f.title && title.length > f.title) {
    out.push(`Tiêu đề ${title.length} ký tự — bố cục "${def.label}" hợp với tiêu đề dưới ${f.title}`)
  }

  const bs = (slide.bullets || []).map(b => String(b || "")).filter(b => b.trim())
  if (f.bulletCount && bs.length > f.bulletCount) {
    out.push(`${bs.length} ý — bố cục "${def.label}" vẽ đẹp nhất với tối đa ${f.bulletCount} ý`)
  }
  if (f.bullet) {
    const longest = bs.reduce((m, b) => Math.max(m, b.length), 0)
    if (longest > f.bullet) {
      out.push(`Ý dài nhất ${longest} ký tự — bố cục "${def.label}" hợp với ý ngắn dưới ${f.bullet}`)
    }
  }

  // Nhãn cột: khi TỰ TÁCH từ ý thì chính các ý sẽ thành nhãn ⇒ phải đo theo ý, không
  // theo `columns` hiện có (lúc đó columns còn rỗng, kiểm sẽ luôn lọt).
  if (f.colTitle) {
    const labels = transform === "bulletsToColumns"
      ? bs.slice(0, def.maxColumns ?? 4)
      : (slide.columns || []).map(c => String(c?.title || ""))
    const longest = labels.reduce((m, t) => Math.max(m, t.length), 0)
    if (longest > f.colTitle) {
      out.push(`Nhãn cột dài ${longest} ký tự — bố cục "${def.label}" hợp với nhãn dưới ${f.colTitle}`)
    }
  }
  return out
}

/** Mỗi ý thành 1 cột; riêng ưu/nhược & bảng so sánh thì chia đôi danh sách. */
export function bulletsToColumns(bullets: string[], to: string): SlideColumn[] {
  const bs = bullets.filter(b => String(b || "").trim())
  if (!bs.length) return []
  if (to === "proscons" || to === "comparetable") {
    const half = Math.ceil(bs.length / 2)
    return [
      { title: to === "proscons" ? "Ưu điểm" : "Cột 1", bullets: bs.slice(0, half) },
      { title: to === "proscons" ? "Nhược điểm" : "Cột 2", bullets: bs.slice(half) },
    ]
  }
  const cap = LAYOUT_BY_KEY[to]?.maxColumns ?? 4
  return bs.slice(0, cap).map(b => ({ title: b, bullets: [] }))
}

/** Làm phẳng cột thành danh sách ý (title trước, rồi tới bullets của cột đó). */
export function columnsToBullets(columns: SlideColumn[]): string[] {
  const out: string[] = []
  for (const c of columns || []) {
    if (String(c?.title || "").trim()) out.push(c.title!.trim())
    for (const b of c?.bullets || []) if (String(b || "").trim()) out.push(b)
  }
  return out.slice(0, 12)
}

/**
 * Trả slide MỚI ở bố cục `to`. Dữ liệu cũ được giữ nguyên (chỉ thêm dạng đã chuyển), nên
 * đổi đi rồi đổi về là khôi phục đúng bản gốc.
 */
export function convert(slide: DeckSlide, to: string): DeckSlide {
  const chk = canConvert(slide, to)
  if (!chk.ok) return slide
  const next: DeckSlide = { ...slide, kind: to }
  if (chk.transform === "bulletsToColumns") next.columns = bulletsToColumns(slide.bullets || [], to)
  if (chk.transform === "columnsToBullets") next.bullets = columnsToBullets(slide.columns || [])
  return next
}
