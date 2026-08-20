/**
 * MỘT nguồn sự thật cho mọi bố cục slide.
 *
 * Trước đây danh sách bố cục nằm rải 3 nơi trong `slides_html.py` và lệch nhau âm thầm:
 * `_HTML_BUILDERS` 36 kind · `LAYOUTS` (picker) 31 · `mini()` chỉ vẽ 22 case.
 * Từ file này suy ra: bộ chọn bố cục, ngưỡng khoá, ma trận chuyển đổi, mini-preview,
 * `_KINDS` phía Python (xuất ra `manifest.json` lúc build) và cả tài liệu.
 */

/** Hình dạng DỮ LIỆU của bố cục — quyết định chuyển đổi qua lại được hay không. */
export type Shape = "list" | "columns" | "headline" | "media" | "verbatim"

export type LayoutDef = {
  key: string
  /** Nhãn tiếng Việt hiện trên bộ chọn. */
  label: string
  /** Nhóm hiện trên bộ chọn. */
  group: "Cơ bản" | "Số liệu" | "So sánh" | "Quy trình" | "Nhấn mạnh" | "Đặc biệt" | "Nguyên văn"
  shape: Shape
  /** Dữ liệu tối thiểu để bố cục hiện đúng (thiếu thì phải chuyển đổi hoặc khoá). */
  needs?: { bullets?: number; columns?: number; columnsWithTitle?: number; images?: number }
  /** Số cột tối đa bố cục vẽ được (dùng khi tách ý → cột). */
  maxColumns?: number
  /** false = không cho GV chọn (nội dung nguyên văn từ giáo án, không được bịa). */
  selectable: boolean
  /** Bố cục full-bleed (không có khung tiêu đề/chân trang chuẩn). */
  hero?: boolean
  /** Trường được render — dùng để cảnh báo "đổi sang đây sẽ tạm ẩn N ý". */
  renders: Array<"title" | "subtitle" | "bullets" | "columns" | "image" | "images" | "formula" | "table" | "question">
  /**
   * Ngưỡng VỪA VẶN — chữ dài quá thì bố cục vẫn dựng được nhưng nhìn xấu/khó đọc.
   * Khác `needs` (thiếu dữ liệu ⇒ KHOÁ): đây chỉ để CẢNH BÁO, giáo viên vẫn được chọn
   * (họ có thể định rút gọn chữ ngay sau đó).
   *
   * Con số lấy từ THỐNG KÊ 990 slide thật (đo ~07/2026 — kho `outputs/` đã sinh lại từ đó,
   * nay còn 610 slide; giữ nguyên số CŨ vì ngưỡng đang dùng chính là ngưỡng suy ra từ nó.
   * Sửa số mà không tính lại ngưỡng là biến quan sát có ngày tháng thành lời khai sai mới):
   * ngưỡng ≈ p95 của chính bố cục đó,
   * hoặc theo giới hạn hình học khi bố cục chưa từng được dùng.
   */
  fits?: { title?: number; bullet?: number; bulletCount?: number; colTitle?: number }
}

export const LAYOUTS: LayoutDef[] = [
  // ── Cơ bản (danh sách) ────────────────────────────────────────────────────
  { key: "content",   label: "Nội dung",     group: "Cơ bản", shape: "list", selectable: true, renders: ["title", "bullets", "image"] },
  { key: "twocol",    label: "Hai cột",      group: "Cơ bản", shape: "list", selectable: true, needs: { bullets: 3 }, renders: ["title", "bullets"] },
  { key: "cards",     label: "Thẻ lưới",     group: "Cơ bản", shape: "list", selectable: true, needs: { bullets: 2 }, fits: { bullet: 60, bulletCount: 6 }, renders: ["title", "bullets"] },
  { key: "numbered",  label: "Đánh số",      group: "Cơ bản", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "checklist", label: "Danh sách ✓",  group: "Cơ bản", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "toc",       label: "Mục lục",      group: "Cơ bản", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "agenda",    label: "Mục lục có mốc", group: "Cơ bản", shape: "list", selectable: true, needs: { bullets: 2 }, renders: ["title", "bullets"] },
  { key: "blank",     label: "Khung trắng",  group: "Cơ bản", shape: "list", selectable: true, renders: ["title", "bullets"] },
  { key: "goals",     label: "Mục tiêu",     group: "Cơ bản", shape: "list", selectable: true, renders: ["title", "bullets"] },
  { key: "remember",  label: "Ghi nhớ",      group: "Cơ bản", shape: "list", selectable: true, renders: ["title", "bullets"] },
  { key: "define",    label: "Định nghĩa",   group: "Nhấn mạnh", shape: "list", selectable: true, renders: ["title", "bullets"] },
  { key: "example",   label: "Ví dụ",        group: "Nhấn mạnh", shape: "list", selectable: true, renders: ["title", "bullets"] },
  // note/define có ý dài TB 123, max 413 ký tự (80 slide thật, đo ~07/2026) — gạch đầu dòng
  // làm vỡ vụn.
  { key: "defcard",   label: "Thẻ định nghĩa", group: "Nhấn mạnh", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },

  // ── Số liệu / So sánh (cột) ───────────────────────────────────────────────
  { key: "bignum",       label: "Số lớn",       group: "Số liệu", shape: "columns", selectable: true, needs: { columnsWithTitle: 1 }, maxColumns: 3, fits: { title: 60, colTitle: 18 }, renders: ["title", "columns"] },
  { key: "metrics",      label: "Thẻ số",       group: "Số liệu", shape: "columns", selectable: true, needs: { columnsWithTitle: 2 }, maxColumns: 4, fits: { title: 60, colTitle: 22 }, renders: ["title", "columns"] },
  { key: "kpirow",       label: "Dãy chỉ số",   group: "Số liệu", shape: "columns", selectable: true, needs: { columnsWithTitle: 2 }, maxColumns: 4, fits: { title: 60, colTitle: 18 }, renders: ["title", "columns"] },
  { key: "three",        label: "Ba cột",       group: "So sánh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 3, fits: { colTitle: 40 }, renders: ["title", "columns"] },
  { key: "compare3",     label: "So sánh 3 cột", group: "So sánh", shape: "columns", selectable: true, needs: { columnsWithTitle: 2 }, maxColumns: 3, fits: { colTitle: 40 }, renders: ["title", "columns"] },
  { key: "compare",      label: "So sánh",      group: "So sánh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 2, fits: { colTitle: 40 }, renders: ["title", "columns"] },
  { key: "proscons",     label: "Ưu / Nhược",   group: "So sánh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 2, renders: ["title", "columns"] },
  { key: "quadrant",     label: "Ma trận 2×2",  group: "So sánh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 4, renders: ["title", "columns"] },
  { key: "comparetable", label: "Bảng so sánh", group: "So sánh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 2, renders: ["title", "columns"] },
  // Bảng biến thiên: 9/12 bảng trong dữ liệu thật (đo ~07/2026) là loại RỘNG 6–10 cột mà `comparetable`
  // (tối đa 2 cột) và `table` (co dúm ở góc) đều không kham nổi.
  { key: "tablewide",    label: "Bảng rộng",    group: "So sánh", shape: "verbatim", selectable: true, renders: ["title", "table"] },
  { key: "feature",      label: "Đặc điểm",     group: "So sánh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 4, renders: ["title", "columns"] },

  // ── Quy trình (danh sách có thứ tự) ───────────────────────────────────────
  { key: "steps",     label: "Các bước",       group: "Quy trình", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "arrow",     label: "Mũi tên",        group: "Quy trình", shape: "list", selectable: true, needs: { bullets: 1 }, fits: { bullet: 40, bulletCount: 4 }, renders: ["title", "bullets"] },
  { key: "timeline",  label: "Dòng thời gian", group: "Quy trình", shape: "list", selectable: true, needs: { bullets: 1 }, fits: { bullet: 48, bulletCount: 5 }, renders: ["title", "bullets"] },
  { key: "vtimeline", label: "Mốc dọc",        group: "Quy trình", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "pyramid",   label: "Kim tự tháp",    group: "Quy trình", shape: "list", selectable: true, needs: { bullets: 2 }, fits: { bullet: 48, bulletCount: 5 }, renders: ["title", "bullets"] },
  { key: "funnel",    label: "Phễu",           group: "Quy trình", shape: "list", selectable: true, needs: { bullets: 2 }, fits: { bullet: 48, bulletCount: 5 }, renders: ["title", "bullets"] },

  // ── Nhấn mạnh (tiêu đề lớn) ───────────────────────────────────────────────
  { key: "statement", label: "Câu chốt",   group: "Nhấn mạnh", shape: "headline", selectable: true, hero: true, fits: { title: 120 }, renders: ["title", "subtitle"] },
  { key: "spotlight", label: "Điểm nhấn",  group: "Nhấn mạnh", shape: "list",     selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "quote",     label: "Trích dẫn",  group: "Nhấn mạnh", shape: "headline", selectable: true, hero: true, fits: { title: 120 }, renders: ["title", "subtitle"] },
  { key: "quoteauthor", label: "Trích dẫn có tác giả", group: "Nhấn mạnh", shape: "headline", selectable: true, hero: true, fits: { title: 120 }, renders: ["title", "subtitle", "image"] },

  // ── Đặc biệt ──────────────────────────────────────────────────────────────
  { key: "hero",    label: "Bìa lớn",  group: "Đặc biệt", shape: "headline", selectable: true, hero: true, fits: { title: 70 }, renders: ["title", "subtitle"] },
  { key: "split",   label: "Chia đôi", group: "Đặc biệt", shape: "headline", selectable: true, hero: true, renders: ["title", "subtitle", "bullets"] },
  { key: "section", label: "Mở phần",  group: "Đặc biệt", shape: "headline", selectable: true, hero: true, fits: { title: 90 }, renders: ["title", "subtitle"] },
  { key: "gallery", label: "Lưới ảnh", group: "Đặc biệt", shape: "media", selectable: true, needs: { images: 2 }, renders: ["title", "images"] },
  { key: "imageleft",  label: "Ảnh trái",  group: "Đặc biệt", shape: "media", selectable: true, needs: { images: 1 }, renders: ["title", "bullets", "image"] },
  { key: "imageright", label: "Ảnh phải",  group: "Đặc biệt", shape: "media", selectable: true, needs: { images: 1 }, renders: ["title", "bullets", "image"] },

  // ── Nguyên văn: KHÔNG cho chọn (dữ liệu lấy đúng từ giáo án, không bịa được) ──
  { key: "formula",  label: "Công thức", group: "Nguyên văn", shape: "verbatim", selectable: false, renders: ["title", "formula"] },
  { key: "figure",   label: "Hình",      group: "Nguyên văn", shape: "verbatim", selectable: false, renders: ["title", "image"] },
  { key: "table",    label: "Bảng",      group: "Nguyên văn", shape: "verbatim", selectable: false, renders: ["title", "table"] },
  { key: "formulasteps", label: "Công thức + các bước", group: "Quy trình", shape: "list", selectable: true, needs: { bullets: 1 }, fits: { bullet: 70, bulletCount: 5 }, renders: ["title", "bullets", "formula"] },
  { key: "note",     label: "Lưu ý",     group: "Nguyên văn", shape: "verbatim", selectable: false, renders: ["title", "bullets"] },
  { key: "question", label: "Câu hỏi",   group: "Nguyên văn", shape: "verbatim", selectable: false, renders: ["title", "question"] },
]

export const LAYOUT_BY_KEY: Record<string, LayoutDef> = Object.fromEntries(LAYOUTS.map(l => [l.key, l]))
export const LAYOUT_KEYS = LAYOUTS.map(l => l.key)
export const SELECTABLE_LAYOUTS = LAYOUTS.filter(l => l.selectable)

/** Thứ tự nhóm hiện trên bộ chọn. */
export const GROUP_ORDER = ["Cơ bản", "Số liệu", "So sánh", "Quy trình", "Nhấn mạnh", "Đặc biệt"] as const
