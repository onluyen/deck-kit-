/**
 * Schema `DeckJson` — nạp vào là hiển thị được ngay, không cần backend.
 *
 * Khác model `Slide` phía Python (không JSON-hoá được): `formula_png: bytes` → `formulaImage`
 * data-URI; `figure.path: Path` → tham chiếu `assets`; `body: list[Block]` (đệ quy, lồng bytes+Path)
 * → phẳng thành `bullets` + `notes`; `_oidx`/`_skipped` (attr động) → trường thật `id`/`skipped`.
 */

export type ThemeKey = string
export type TransitionKey = "fade" | "slide" | "slideup" | "zoom" | "flip" | "none"

export type SlideColumn = { title?: string; bullets?: string[] }
export type SlideImage = { asset: string; title?: string; aspect?: number }
export type SlideQuestion = { index?: number; stem: string; options?: string[] }

export type DeckSlide = {
  /** Bền qua mọi thao tác sửa — khoá để ánh xạ bản chỉnh sửa. */
  id: string
  kind: string
  title?: string
  subtitle?: string
  caption?: string
  /** Nhãn nhỏ phía trên tiêu đề (Python lấy từ `SlidePlan.sub_id`/`tag`). */
  kicker?: string
  bullets?: string[]
  columns?: SlideColumn[]
  image?: SlideImage
  images?: SlideImage[]
  formula?: string
  /** Ảnh công thức đã render sẵn — data-URI hoặc id trong `assets`. Ưu tiên hơn `formula`. */
  formulaImage?: string
  table?: string[][]
  question?: SlideQuestion
  /** Không hiển thị trên slide; dùng cho Notes/Presenter View khi xuất .pptx. */
  notes?: string
  /** Màu nhấn riêng slide (hex) — đè `--sl-gold`/`--sl-rail`. */
  accent?: string
  /** Ẩn khỏi trình chiếu/xuất; trong trình sửa vẫn thấy (mờ). */
  skipped?: boolean
  /** Nội dung nguyên văn — không cho sửa/đổi bố cục. */
  locked?: boolean
}

/**
 * Cấu hình HIỂN THỊ của deck — thứ giáo viên chỉnh được, khác `size` (khổ canvas, cố định).
 *
 * Để RIÊNG chứ không nhồi vào `size`: `size` đã bị 3 tầng backend đọc (`deck_json.py`,
 * `pptx_theme.py`, `pptx_build.py`) nên thêm khoá lạ vào đó là mời lỗi im lặng. `display` là
 * trường mới hoàn toàn — consumer cũ bỏ qua, không ai vỡ.
 */
export type DeckDisplay = {
  /** Hệ số cỡ chữ toàn deck. 1 = thiết kế gốc. Áp qua `--dk-fs`, .pptx tự khớp theo. */
  fontScale?: number
  /** Mật độ lề. `--pad` đổi theo: compact 48px · normal 64px · roomy 80px. */
  density?: "compact" | "normal" | "roomy"
  /**
   * Kiểu chữ toàn deck — ghi đè `--sl-font` của theme (theme chỉ định nghĩa BẢNG MÀU + một
   * font mặc định, không cho chọn).
   *
   * Phải là NGĂN XẾP font, không phải một tên: máy giáo viên và máy dựng .pptx có bộ font
   * khác nhau, nên tên đầu tiên thường không có ở cả hai nơi. Ngăn xếp phải kết thúc bằng một
   * họ chắc chắn đọc được tiếng Việt (`Liberation Sans`/`DejaVu Sans` có trong ảnh Docker;
   * `sans-serif`/`serif` là chốt cuối).
   */
  fontFamily?: string
}

export type DeckJson = {
  version: 1
  title?: string
  theme?: ThemeKey
  transition?: TransitionKey
  size?: { w: number; h: number }
  /** Cấu hình hiển thị (cỡ chữ, mật độ). Thiếu = mặc định thiết kế gốc. */
  display?: DeckDisplay
  /** Chân trang hiện trên mọi slide có khung. */
  foot?: string
  /** Ảnh để RIÊNG, slide chỉ tham chiếu id — tránh lặp data-URI trên deck vài trăm slide. */
  assets?: Record<string, string>
  slides: DeckSlide[]
}

/** Bản chỉ-phần-đổi, hợp để gửi lên server (ánh xạ thẳng sang `apply_edits`). */
export type DeckPatch = {
  slides: Record<string, Partial<DeckSlide>>
  /** Thứ tự hiển thị theo id (đã tính cả xoá/thêm). */
  order: string[]
  added: DeckSlide[]
  removed: string[]
  skipped: string[]
}

export const DEFAULT_SIZE = { w: 1280, h: 720 } as const

/** Chuẩn hoá deck đầu vào: điền id thiếu, mặc định theme/size — nhận cả JSON viết tay. */
export function normalizeDeck(input: DeckJson): DeckJson {
  const slides = (input.slides || []).map((s, i) => ({ ...s, id: s.id || `s${i}` }))
  const seen = new Set<string>()
  for (const s of slides) {
    while (seen.has(s.id)) s.id = `${s.id}_`            // id trùng thì tách ra, không để đè nhau
    seen.add(s.id)
  }
  return {
    ...input,
    version: 1,
    theme: input.theme || "navy-gold",
    transition: input.transition || "fade",
    size: input.size || { ...DEFAULT_SIZE },
    assets: input.assets || {},
    slides,
  }
}
