import { d as DeckSlide, D as DeckJson } from './mount-B7SXSqQI.cjs';
export { C as ConvertCheck, e as DEFAULT_SIZE, f as DeckDisplay, g as DeckEvent, c as DeckHandle, b as DeckPatch, M as MountOpts, S as SaveState, h as SlideColumn, i as SlideImage, j as SlideQuestion, T as ThemeKey, a as TransitionKey, k as applyDisplay, l as bulletsToColumns, n as canConvert, o as columnsToBullets, p as convert, q as diffDeck, m as mountDeck, r as normalizeDeck, t as toStandaloneHtml } from './mount-B7SXSqQI.cjs';

/**
 * Builder bố cục — hàm dựng HTML cho từng `kind`.
 *
 * 36 bố cục đầu port nguyên hành vi từ `slides_html._h_*` (Python) nên khớp pixel với bản cũ;
 * 7 bố cục đợt 2 (`kpirow`, `imageleft/right`, `quoteauthor`, `agenda`, `compare3`, `blank`)
 * CHỈ có ở đây — cổng so ảnh không phủ chúng, `layout_test.py` mới là chỗ kiểm.
 *
 * Mỗi builder là hàm THUẦN `(slide, ctx) => string`, không đụng đĩa/mạng: ảnh đã là data-URI
 * trong `ctx.assets` nên chạy được trên trình duyệt mà không cần backend.
 */

type BuildCtx = {
    /** Chỉ số slide dùng cho `data-e` (khớp `_oidx` phía Python). */
    idx: number;
    edit?: boolean;
    kicker?: string;
    foot?: string;
    page?: number | string;
    total?: number | string;
    /** Vị trí hiển thị — quyết định slide nào có class `active`. */
    pos?: number;
    isNew?: boolean;
    /** Bảng ảnh data-URI; slide chỉ giữ id. */
    assets?: Record<string, string>;
};
type Builder = (sl: DeckSlide, ctx: BuildCtx) => string;
/**
 * Palette CỐ ĐỊNH (không theo theme) cho thanh pyramid/funnel — chữ TRẮNG luôn tương phản.
 *
 * ĐÃ THỬ lấy màu từ token theme (`navy`/`navy2`/`blue-deep`…) cho khỏi "lạc quẻ" trên theme
 * tối — HỎNG, và hỏng theo cách chỉ soi ảnh mới thấy: trên theme TỐI, `navy` là màu CHỮ SÁNG
 * (`black-gold` có `navy:#F7E7B0`) còn `navy2` gần như đen. Thanh ra vàng nhạt chữ trắng
 * (không đọc nổi) và thanh đen trên nền đen (biến mất).
 *
 * Ý nghĩa token ĐẢO NGƯỢC giữa theme sáng và tối, nên không thể chọn "token tối" một cách
 * tĩnh. Giữ palette cứng: 5 màu này đảm bảo chữ trắng đọc được trên MỌI theme, đúng như ràng
 * buộc ban đầu. Muốn theme hoá thì phải thêm token RIÊNG cho thanh (`--sl-bar-1..5`) ở cả 12
 * theme — việc đó lớn hơn lợi ích, chưa làm.
 */
declare const BAR_COLORS: string[];
declare const BUILDERS: Record<string, Builder>;
/** Bố cục full-bleed → class riêng thay cho khung chuẩn. */
declare const HERO_CLASS: Record<string, string>;

/**
 * `DeckJson` → HTML. Port của `render_slide_html` / `render_deck_html` phía Python.
 *
 * DOM contract giữ NGUYÊN (`#scaler > section.slide`, `data-notes`, `data-title`, `data-nb/nc/nct/nf`)
 * để `deck_to_pptx` chụp nền + trích bbox không phải sửa gì.
 */

type RenderOpts = {
    edit?: boolean;
    /** Chân trang mặc định khi slide không tự khai. */
    foot?: string;
};
/** Một `<section class="slide …">` hoàn chỉnh. */
declare function renderSlide(sl: DeckSlide, ctx: BuildCtx): string;
/**
 * Bậc cỡ tiêu đề (1–3) theo độ dài. Tiêu đề dài phải được chừa chỗ, nếu không nó đè lên nội dung.
 * Tính bằng SỐ KÝ TỰ để renderer Python suy ra y hệt — không cần đo bằng JS, ảnh chụp mới ổn định.
 */
declare function titleBucket(title?: string): 1 | 2 | 3;
/** Toàn bộ `<section>` của deck (không kèm khung trang) — dùng khi mount vào DOM sẵn có. */
declare function renderSections(deck: DeckJson, opts?: RenderOpts): string;
/**
 * Khung trình sửa: THANH CÔNG CỤ trên + PREVIEW (thumbnail) trái.
 *
 * Thư viện tự sinh khung này (trước kia do template Python sinh) để Angular dùng được mà
 * không cần backend. `buildToolbar`/`buildRail` bám đúng hai id `#dk-toolbar`/`#lp-rail`.
 */
declare function renderEditChrome(): string;
/** Khung `#scaler` bao các slide — phần DOM mà player điều khiển. */
declare function renderStage(deck: DeckJson, opts?: RenderOpts): string;
/**
 * CSS đầy đủ cho một deck (base + token theme + CSS trình sửa nếu bật).
 *
 * Bọc trong `@layer deck-kit` để app CÓ THỂ đè deck-kit khi cần, thay vì phải chạy đua
 * `!important`.
 *
 * ⚠️ Layer KHÔNG tự nó chặn rò — đã đo và thấy sai giả thuyết ban đầu: layer khai SAU luôn
 * thắng layer khai trước, mà `@layer deck-kit` sinh ra lúc mount (sau khi app đã khai
 * `theme,base,components,utilities`) nên nó vẫn ở cuối chuỗi và vẫn thắng. Thứ THẬT SỰ chặn
 * rò là **phạm vi selector**: `.dk-root` bọc reset, `.slide` bọc `b,strong`, và không còn
 * `html,body{}` (xem `base.css`).
 *
 * Bọc ở chỗ GHÉP CHUỖI chứ không sửa file `.css`: chúng bị `npm run sync:css` copy sang
 * `backend/app/tools/lesson_plan/assets/` và renderer Python đọc thô.
 *
 * `@keyframes` KHÔNG chịu ảnh hưởng của layer (không tham gia cascade theo specificity) nên
 * 6 hiệu ứng chuyển slide vẫn chạy nguyên.
 */
declare function deckCss(deck: DeckJson, opts?: RenderOpts): string;

/**
 * Player: điều hướng + fit-scale + toàn màn hình. Port của `pptx_html.renderer._runtime_js`.
 *
 * Khác bản cũ ở đúng một điểm quan trọng: mọi truy vấn DOM đều **giới hạn trong `root`**, không dùng
 * `document.getElementById` toàn cục. Không có iframe che chắn nữa nên hai deck trên cùng một trang
 * (hoặc deck nằm cạnh UI của app chủ) vẫn phải chạy độc lập.
 */
type PlayerOpts = {
    /** Kích thước gốc của slide (mặc định 1280×720). */
    w?: number;
    h?: number;
    /** Bật phím tắt ←/→/Home/End/F (tắt khi nhúng trong form của app chủ). */
    keyboard?: boolean;
    /** Chừa chỗ cho rail/console của trình sửa khi tính tỉ lệ. */
    reserve?: () => number;
    onSlideChange?: (i: number, total: number) => void;
};
type Player = {
    show(i: number): void;
    next(): void;
    prev(): void;
    cur(): number;
    count(): number;
    fit(): void;
    fullscreen(): void;
    /** Gọi lại sau khi DOM slide đổi (thêm/xoá/sắp xếp). */
    refresh(): void;
    destroy(): void;
};
declare function attachPlayer(root: HTMLElement | Document, opts?: PlayerOpts): Player;
/**
 * Bản tương thích cho tool `pptx_html` (deck .pptx→HTML): giữ nguyên `window.__deck` và giao thức
 * postMessage `{lpGoto}` / `{lpReady,count}` mà preview-modal đang dùng.
 */
declare function attachLegacyPlayer(w?: number, h?: number): Player;

/**
 * 12 theme dựng sẵn — mỗi theme là một bộ CSS-variable `--sl-*`.
 * Sinh 1:1 từ `slide_themes.THEMES` phía Python; đổi theme KHÔNG đụng template layout.
 */
type Theme = {
    key: string;
    label: string;
    dark: boolean;
    tokens: Record<string, string>;
};
declare const THEMES: Theme[];
declare const THEME_BY_KEY: Record<string, Theme>;
declare const DEFAULT_THEME = "navy-gold";
/** Khối `:root{--sl-…}` cho theme — dùng khi xuất HTML tự chứa. */
declare function themeCss(name: string, selector?: string): string;
/** Áp theme lên một phần tử (mount trong DOM chung, không cần đụng :root). */
declare function applyTheme(el: HTMLElement, name: string): void;

/**
 * MỘT nguồn sự thật cho mọi bố cục slide.
 *
 * Trước đây danh sách bố cục nằm rải 3 nơi trong `slides_html.py` và lệch nhau âm thầm:
 * `_HTML_BUILDERS` 36 kind · `LAYOUTS` (picker) 31 · `mini()` chỉ vẽ 22 case.
 * Từ file này suy ra: bộ chọn bố cục, ngưỡng khoá, ma trận chuyển đổi, mini-preview,
 * `_KINDS` phía Python (xuất ra `manifest.json` lúc build) và cả tài liệu.
 */
/** Hình dạng DỮ LIỆU của bố cục — quyết định chuyển đổi qua lại được hay không. */
type Shape = "list" | "columns" | "headline" | "media" | "verbatim";
type LayoutDef = {
    key: string;
    /** Nhãn tiếng Việt hiện trên bộ chọn. */
    label: string;
    /** Nhóm hiện trên bộ chọn. */
    group: "Cơ bản" | "Số liệu" | "So sánh" | "Quy trình" | "Nhấn mạnh" | "Đặc biệt" | "Nguyên văn";
    shape: Shape;
    /** Dữ liệu tối thiểu để bố cục hiện đúng (thiếu thì phải chuyển đổi hoặc khoá). */
    needs?: {
        bullets?: number;
        columns?: number;
        columnsWithTitle?: number;
        images?: number;
    };
    /** Số cột tối đa bố cục vẽ được (dùng khi tách ý → cột). */
    maxColumns?: number;
    /** false = không cho GV chọn (nội dung nguyên văn từ giáo án, không được bịa). */
    selectable: boolean;
    /** Bố cục full-bleed (không có khung tiêu đề/chân trang chuẩn). */
    hero?: boolean;
    /** Trường được render — dùng để cảnh báo "đổi sang đây sẽ tạm ẩn N ý". */
    renders: Array<"title" | "subtitle" | "bullets" | "columns" | "image" | "images" | "formula" | "table" | "question">;
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
    fits?: {
        title?: number;
        bullet?: number;
        bulletCount?: number;
        colTitle?: number;
    };
};
declare const LAYOUTS: LayoutDef[];
declare const LAYOUT_BY_KEY: Record<string, LayoutDef>;
declare const LAYOUT_KEYS: string[];
declare const SELECTABLE_LAYOUTS: LayoutDef[];
/** Thứ tự nhóm hiện trên bộ chọn. */
declare const GROUP_ORDER: readonly ["Cơ bản", "Số liệu", "So sánh", "Quy trình", "Nhấn mạnh", "Đặc biệt"];

declare const BASE_CSS: string;
/** Token phải đứng TRƯỚC `edit.css` — các luật bên dưới đọc biến `--dk-*` khai ở đây. */
declare const EDIT_CSS: string;

/**
 * Như `esc()` nhưng MỞ LẠI đúng 4 thẻ inline an toàn: `<b> <i> <sup> <sub>`.
 *
 * Nội dung giáo án có 43% khối mang định dạng inline (đậm cho thuật ngữ, nghiêng cho biến
 * `a`/`x`, chỉ số dưới `Sₜₚ`, mũ `x²`). Trước đây `esc()` phẳng hết nên slide và .pptx mất
 * sạch — `S<sub>tp</sub>` hiện thành `Stp`.
 *
 * AN TOÀN vì đi theo thứ tự: escape TOÀN BỘ trước (mọi `<` thành `&lt;`), rồi mới mở lại
 * đúng 4 thẻ KHÔNG THUỘC TÍNH bằng danh sách đóng. HTML lạ, thuộc tính, `<script>` đều không
 * có đường lọt — chúng đã bị escape ở bước một và không khớp mẫu ở bước hai.
 */
declare function escRich(s: unknown): string;

export { BAR_COLORS, BASE_CSS, BUILDERS, type BuildCtx, type Builder, DEFAULT_THEME, DeckJson, DeckSlide, EDIT_CSS, GROUP_ORDER, HERO_CLASS, LAYOUTS, LAYOUT_BY_KEY, LAYOUT_KEYS, type LayoutDef, type Player, type PlayerOpts, type RenderOpts, SELECTABLE_LAYOUTS, type Shape, THEMES, THEME_BY_KEY, type Theme, applyTheme, attachLegacyPlayer, attachPlayer, deckCss, escRich, renderEditChrome, renderSections, renderSlide, renderStage, themeCss, titleBucket };
