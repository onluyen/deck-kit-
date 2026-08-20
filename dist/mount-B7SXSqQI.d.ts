/**
 * Schema `DeckJson` — nạp vào là hiển thị được ngay, không cần backend.
 *
 * Khác model `Slide` phía Python (không JSON-hoá được): `formula_png: bytes` → `formulaImage`
 * data-URI; `figure.path: Path` → tham chiếu `assets`; `body: list[Block]` (đệ quy, lồng bytes+Path)
 * → phẳng thành `bullets` + `notes`; `_oidx`/`_skipped` (attr động) → trường thật `id`/`skipped`.
 */
type ThemeKey = string;
type TransitionKey = "fade" | "slide" | "slideup" | "zoom" | "flip" | "none";
type SlideColumn = {
    title?: string;
    bullets?: string[];
};
type SlideImage = {
    asset: string;
    title?: string;
    aspect?: number;
};
type SlideQuestion = {
    index?: number;
    stem: string;
    options?: string[];
};
type DeckSlide = {
    /** Bền qua mọi thao tác sửa — khoá để ánh xạ bản chỉnh sửa. */
    id: string;
    kind: string;
    title?: string;
    subtitle?: string;
    caption?: string;
    /** Nhãn nhỏ phía trên tiêu đề (Python lấy từ `SlidePlan.sub_id`/`tag`). */
    kicker?: string;
    bullets?: string[];
    columns?: SlideColumn[];
    image?: SlideImage;
    images?: SlideImage[];
    formula?: string;
    /** Ảnh công thức đã render sẵn — data-URI hoặc id trong `assets`. Ưu tiên hơn `formula`. */
    formulaImage?: string;
    table?: string[][];
    question?: SlideQuestion;
    /** Không hiển thị trên slide; dùng cho Notes/Presenter View khi xuất .pptx. */
    notes?: string;
    /** Màu nhấn riêng slide (hex) — đè `--sl-gold`/`--sl-rail`. */
    accent?: string;
    /** Ẩn khỏi trình chiếu/xuất; trong trình sửa vẫn thấy (mờ). */
    skipped?: boolean;
    /** Nội dung nguyên văn — không cho sửa/đổi bố cục. */
    locked?: boolean;
};
/**
 * Cấu hình HIỂN THỊ của deck — thứ giáo viên chỉnh được, khác `size` (khổ canvas, cố định).
 *
 * Để RIÊNG chứ không nhồi vào `size`: `size` đã bị 3 tầng backend đọc (`deck_json.py`,
 * `pptx_theme.py`, `pptx_build.py`) nên thêm khoá lạ vào đó là mời lỗi im lặng. `display` là
 * trường mới hoàn toàn — consumer cũ bỏ qua, không ai vỡ.
 */
type DeckDisplay = {
    /** Hệ số cỡ chữ toàn deck. 1 = thiết kế gốc. Áp qua `--dk-fs`, .pptx tự khớp theo. */
    fontScale?: number;
    /** Mật độ lề. `--pad` đổi theo: compact 48px · normal 64px · roomy 80px. */
    density?: "compact" | "normal" | "roomy";
    /**
     * Kiểu chữ toàn deck — ghi đè `--sl-font` của theme (theme chỉ định nghĩa BẢNG MÀU + một
     * font mặc định, không cho chọn).
     *
     * Phải là NGĂN XẾP font, không phải một tên: máy giáo viên và máy dựng .pptx có bộ font
     * khác nhau, nên tên đầu tiên thường không có ở cả hai nơi. Ngăn xếp phải kết thúc bằng một
     * họ chắc chắn đọc được tiếng Việt (`Liberation Sans`/`DejaVu Sans` có trong ảnh Docker;
     * `sans-serif`/`serif` là chốt cuối).
     */
    fontFamily?: string;
};
type DeckJson = {
    version: 1;
    title?: string;
    theme?: ThemeKey;
    transition?: TransitionKey;
    size?: {
        w: number;
        h: number;
    };
    /** Cấu hình hiển thị (cỡ chữ, mật độ). Thiếu = mặc định thiết kế gốc. */
    display?: DeckDisplay;
    /** Chân trang hiện trên mọi slide có khung. */
    foot?: string;
    /** Ảnh để RIÊNG, slide chỉ tham chiếu id — tránh lặp data-URI trên deck vài trăm slide. */
    assets?: Record<string, string>;
    slides: DeckSlide[];
};
/** Bản chỉ-phần-đổi, hợp để gửi lên server (ánh xạ thẳng sang `apply_edits`). */
type DeckPatch = {
    slides: Record<string, Partial<DeckSlide>>;
    /** Thứ tự hiển thị theo id (đã tính cả xoá/thêm). */
    order: string[];
    added: DeckSlide[];
    removed: string[];
    skipped: string[];
};
declare const DEFAULT_SIZE: {
    readonly w: 1280;
    readonly h: 720;
};
/** Chuẩn hoá deck đầu vào: điền id thiếu, mặc định theme/size — nhận cả JSON viết tay. */
declare function normalizeDeck(input: DeckJson): DeckJson;

/**
 * Ma trận chuyển đổi bố cục — "bố cục nào đổi được sang bố cục nào, và dữ liệu đi theo thế nào".
 *
 * Nguyên tắc: KHÔNG BAO GIỜ XOÁ dữ liệu khi đổi bố cục. Bố cục mới không hiển thị phần nào thì
 * phần đó chỉ *tạm ẩn* (đổi ngược lại là thấy nguyên vẹn), và người dùng được báo trước.
 */

type ConvertCheck = {
    ok: boolean;
    /** Lý do khoá (hiện trong tooltip) khi `ok=false`. */
    reason?: string;
    /** Số ý/cột sẽ tạm ẩn nếu đổi (bố cục mới không render phần đó) — để cảnh báo trước. */
    willHide?: number;
    /** Dữ liệu sẽ được tự chuyển dạng (ý → cột hoặc ngược lại). */
    transform?: "bulletsToColumns" | "columnsToBullets";
    /**
     * Nội dung ĐỔI ĐƯỢC nhưng nhìn sẽ xấu (chữ dài hơn sức chứa của bố cục).
     * KHÁC `reason`: đây chỉ cảnh báo, vẫn cho chọn — giáo viên có thể định rút gọn chữ
     * ngay sau khi đổi. Trước đây ý dài 65 ký tự vẫn đổi tuốt sang "Số lớn" (vốn cho "42%")
     * mà không một lời nhắc nào.
     */
    fitWarning?: string[];
};
/**
 * Đổi `slide` sang bố cục `to` được không? Có phải tự chuyển dạng dữ liệu không? Có ẩn bớt gì không?
 */
declare function canConvert(slide: DeckSlide, to: string): ConvertCheck;
/** Mỗi ý thành 1 cột; riêng ưu/nhược & bảng so sánh thì chia đôi danh sách. */
declare function bulletsToColumns(bullets: string[], to: string): SlideColumn[];
/** Làm phẳng cột thành danh sách ý (title trước, rồi tới bullets của cột đó). */
declare function columnsToBullets(columns: SlideColumn[]): string[];
/**
 * Trả slide MỚI ở bố cục `to`. Dữ liệu cũ được giữ nguyên (chỉ thêm dạng đã chuyển), nên
 * đổi đi rồi đổi về là khôi phục đúng bản gốc.
 */
declare function convert(slide: DeckSlide, to: string): DeckSlide;

/**
 * `mountDeck(el, deck, opts)` — API chính của thư viện.
 *
 * Thư viện KHÔNG tự gọi mạng: mọi việc cần server (sinh ảnh AI, lưu) đều bắn sự kiện ra cho app chủ
 * tự quyết. Đó là điều kiện để Angular dùng được mà không cần backend Python nào.
 */

type DeckEvent = "ready" | "change" | "save" | "slideChange" | "requestImage" | "requestRegenImage" | "reset";
type MountOpts = {
    edit?: boolean;
    theme?: ThemeKey;
    transition?: TransitionKey;
    foot?: string;
    /** Tự phát `save` sau khi ngừng sửa (ms). 0 = tắt. Mặc định 1200. */
    autoSaveMs?: number;
    keyboard?: boolean;
};
type DeckHandle = {
    goto(i: number): void;
    next(): void;
    prev(): void;
    current(): number;
    count(): number;
    present(on: boolean): void;
    fit(): void;
    setEditMode(on: boolean): void;
    setTheme(k: ThemeKey): void;
    setTransition(k: TransitionKey): void;
    undo(): void;
    redo(): void;
    getDeck(): DeckJson;
    getPatch(): DeckPatch;
    setDeck(d: DeckJson): void;
    /** Đổi bố cục slide đang chọn (tự chuyển dạng dữ liệu theo ma trận). */
    setKind(idx: number, kind: string): boolean;
    canSetKind(idx: number, kind: string): ReturnType<typeof canConvert>;
    toHTML(): string;
    /**
     * Báo KẾT QUẢ THẬT của lượt lưu lên thanh trạng thái.
     *
     * Thư viện không tự gọi mạng nên không biết lưu thành công hay không — nếu tự hiện
     * "Đã lưu" ngay lúc bắn sự kiện thì đó là NÓI DỐI khi request hỏng. App chủ gọi hàm này
     * sau khi biết kết quả.
     */
    setSaveState(state: SaveState, detail?: string): void;
    on(ev: DeckEvent, fn: (payload?: any) => void): () => void;
    destroy(): void;
};
/** `saving` đang gửi · `saved` xong · `error` hỏng (kèm lý do) · `dirty` có thay đổi chưa gửi. */
type SaveState = "saving" | "saved" | "error" | "dirty";
/**
 * Áp cấu hình hiển thị lên khung deck.
 *
 * KẸP `fontScale` vào [0.6, 1.6]: dữ liệu có thể tới từ JSON người dùng sửa tay hoặc API, và
 * cỡ chữ ×10 làm slide vỡ hoàn toàn mà không có gì chặn (`.body{overflow:hidden}` chỉ cắt chứ
 * không thu nhỏ).
 */
declare function applyDisplay(el: HTMLElement, d?: DeckDisplay): void;
declare function mountDeck(el: HTMLElement, input: DeckJson, opts?: MountOpts): DeckHandle;
/** So bản gốc với bản đã sửa → chỉ phần đổi (ánh xạ thẳng sang `apply_edits` phía backend). */
declare function diffDeck(base: DeckJson, cur: DeckJson): DeckPatch;
/**
 * 1 file HTML tự chứa (CSS + ảnh data-URI + player) — mở offline là chiếu được, và **in ra
 * giấy / lưu PDF được** bằng Ctrl+P.
 *
 * CSS in nằm sẵn trong `deckCss()` (ngoài `@layer`) nên file này không phải ghép thêm — mọi
 * đường mount đều in được, kể cả trang deck `/preview/deck/…` mở ở tab riêng.
 *
 * `html,body` phải tự khai ở đây: từ 0.2.0 `base.css` không còn selector trần nữa (nó từng rò
 * ra app chủ nhà), nên file độc lập không có ai đặt nền và chiều cao cho nó.
 *
 * ⚠️ Khung BẮT BUỘC có class `.dk-root` và token theme đặt sẵn trên đó. Trong app thì
 * `mountDeck` lo hai việc này (`el.classList.add("dk-root")` + `applyTheme`), nhưng file tự
 * chứa không chạy `mountDeck` — chỉ có `bootstrapPlayer` rút gọn. Thiếu là **mọi `--sl-*` không
 * tồn tại ⇒ slide trong suốt, chữ trắng trên nền trắng**: đo được `backgroundColor:
 * rgba(0,0,0,0)` trên theme tối. Lỗi này im lặng từ 0.2.0 tới khi cổng `print_test` bắt được.
 */
declare function toStandaloneHtml(deck: DeckJson, foot?: string): string;

export { type ConvertCheck as C, type DeckJson as D, type MountOpts as M, type SaveState as S, type ThemeKey as T, type TransitionKey as a, type DeckPatch as b, type DeckHandle as c, type DeckSlide as d, DEFAULT_SIZE as e, type DeckDisplay as f, type DeckEvent as g, type SlideColumn as h, type SlideImage as i, type SlideQuestion as j, applyDisplay as k, bulletsToColumns as l, mountDeck as m, canConvert as n, columnsToBullets as o, convert as p, diffDeck as q, normalizeDeck as r, toStandaloneHtml as t };
