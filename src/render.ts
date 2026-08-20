/**
 * `DeckJson` → HTML. Port của `render_slide_html` / `render_deck_html` phía Python.
 *
 * DOM contract giữ NGUYÊN (`#scaler > section.slide`, `data-notes`, `data-title`, `data-nb/nc/nct/nf`)
 * để `deck_to_pptx` chụp nền + trích bbox không phải sửa gì.
 */
import type { DeckJson, DeckSlide } from "./model"
import { DEFAULT_SIZE, normalizeDeck } from "./model"
import { BUILDERS, HERO_CLASS, type BuildCtx } from "./layouts/builders"
import { esc, nonEmpty } from "./util/html"
import { DEFAULT_THEME, themeCss } from "./themes"
import { BASE_CSS, EDIT_CSS, PRINT_CSS } from "./styles/index"

export type RenderOpts = {
  edit?: boolean
  /** Chân trang mặc định khi slide không tự khai. */
  foot?: string
}

/** Một `<section class="slide …">` hoàn chỉnh. */
export function renderSlide(sl: DeckSlide, ctx: BuildCtx): string {
  // ĐỪNG "sửa" chỗ này cho `data-kind` báo lại bố cục GỐC: `layout_test.py` dựa vào đúng việc
  // `data-kind` mang bố cục ĐÃ RƠI để phát hiện bố cục hỏng (nó so `rendered != kind` rồi in
  // "RƠI"). Cho nó báo bố cục gốc là làm mù luôn cổng kiểm đó.
  const kind = BUILDERS[sl.kind] ? sl.kind : "content"
  const fn = BUILDERS[kind]
  const cls = HERO_CLASS[kind] ? `slide ${HERO_CLASS[kind]}` : "slide chrome dots"
  const active = (ctx.pos ?? ctx.idx) === 0 ? " active" : ""
  // `.edregen` chỉ là CỜ cho thanh công cụ biết slide này có ảnh AI (vẽ lại được);
  // không còn nút nổi trên slide — xoá/nhân bản/chuyển đã có ở thanh trên và thumbnail.
  const bar = ctx.edit && (sl as any).imagePrompt
    ? '<span class="edregen" hidden></span>' : ""
  const newattr = ctx.isNew ? ' data-new="1"' : ""
  const sk = sl.skipped ? " skipped" : ""
  const styleattr = sl.accent ? ` style="--sl-gold:${sl.accent};--sl-rail:${sl.accent}"` : ""
  // Ghi chú KHÔNG hiển thị — chỉ để deck_to_pptx đưa vào Notes của PowerPoint (Presenter View).
  const notes = sl.notes ? ` data-notes="${esc(sl.notes)}"` : ""
  const t = (sl.title || sl.subtitle || nonEmpty(sl.bullets)[0] || kind).trim()
  const titleAttr = t ? ` data-title="${esc(t.slice(0, 180))}"` : ""
  // Mô tả DỮ LIỆU slide → bộ chọn bố cục biết bố cục nào dùng được / cần tự chuyển dữ liệu.
  const cs = sl.columns || []
  const caps = ` data-nb="${nonEmpty(sl.bullets).length}" data-nc="${cs.length}"` +
    ` data-nct="${cs.filter(c => c?.title).length}"` +
    ` data-nf="${(sl.images || []).length + (sl.image ? 1 : 0)}"`
  const lock = sl.locked ? ' data-locked="1"' : ""
  const tt = titleBucket(sl.title)
  const ttAttr = tt > 1 ? ` data-tt="${tt}"` : ""       // bậc 1 = mặc định → không phát, HTML giữ nguyên
  return `<section class="${cls}${active}${sk}" data-index="${ctx.idx}" data-id="${esc(sl.id)}" ` +
    `data-kind="${esc(kind)}"${newattr}${styleattr}${notes}${titleAttr}${caps}${lock}${ttAttr}>${bar}${fn(sl, ctx)}</section>`
}

/**
 * Bậc cỡ tiêu đề (1–3) theo độ dài. Tiêu đề dài phải được chừa chỗ, nếu không nó đè lên nội dung.
 * Tính bằng SỐ KÝ TỰ để renderer Python suy ra y hệt — không cần đo bằng JS, ảnh chụp mới ổn định.
 */
export function titleBucket(title?: string): 1 | 2 | 3 {
  const n = (title || "").trim().length
  return n <= 46 ? 1 : n <= 92 ? 2 : 3
}

/** Toàn bộ `<section>` của deck (không kèm khung trang) — dùng khi mount vào DOM sẵn có. */
export function renderSections(deck: DeckJson, opts: RenderOpts = {}): string {
  const d = normalizeDeck(deck)
  const total = d.slides.length
  const out = d.slides.map((sl, pos) => renderSlide(sl, {
    idx: pos, pos, edit: opts.edit, assets: d.assets,
    kicker: sl.kicker || "", foot: opts.foot ?? d.foot ?? "",
    page: pos + 1, total,
  }))
  if (!out.length) {
    out.push('<section class="slide chrome active" data-index="0"><div class="hd">' +
      '<div class="ttl">Chưa có slide</div></div></section>')
  }
  return out.join("")
}

/**
 * Khung trình sửa: THANH CÔNG CỤ trên + PREVIEW (thumbnail) trái.
 *
 * Thư viện tự sinh khung này (trước kia do template Python sinh) để Angular dùng được mà
 * không cần backend. `buildToolbar`/`buildRail` bám đúng hai id `#dk-toolbar`/`#lp-rail`.
 */
export function renderEditChrome(): string {
  // Thanh công cụ TRÊN + preview TRÁI. Bỏ console phải: 3 vùng chrome ăn hết chỗ khiến
  // slide chỉ còn 406px trên panel 864px; bố cục này cho slide 682px (gấp 1,7 lần).
  return '<div id="dk-toolbar" class="dk-toolbar"></div><aside id="lp-rail"></aside>'
}

/** Khung `#scaler` bao các slide — phần DOM mà player điều khiển. */
export function renderStage(deck: DeckJson, opts: RenderOpts = {}): string {
  const d = normalizeDeck(deck)
  const { w, h } = d.size || DEFAULT_SIZE
  return (opts.edit ? renderEditChrome() : "") +
    `<div class="stage"><div class="scaler" id="scaler" data-tr="${esc(d.transition)}" ` +
    `style="width:${w}px;height:${h}px">${renderSections(d, opts)}</div></div>` +
    '<div class="nav"><button id="prev">‹</button><span class="counter" id="cnt">1 / 1</span>' +
    '<button id="next">›</button><button id="fs">⛶</button></div><div id="sprog"></div>'
}

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
export function deckCss(deck: DeckJson, opts: RenderOpts = {}): string {
  // Token theme ghi lên `.dk-root`, KHÔNG phải `:root` — `:root` là `<html>` của app chủ nhà,
  // đổ `--sl-*` lên đó là bơm 24 biến lạ vào toàn trang. `.dk-root` là khung deck nên biến
  // vẫn kế thừa xuống mọi slide bên trong, không mất gì.
  const css = BASE_CSS + themeCss(deck.theme || DEFAULT_THEME, ".dk-root") +
    (opts.edit ? EDIT_CSS : "")
  // `PRINT_CSS` để NGOÀI layer: luật in phải thắng luật màn hình (`#scaler>.slide` là
  // id+class), mà CSS không-layer luôn thắng CSS trong layer.
  //
  // Vì sao mọi đường mount đều nhận, không riêng file tự chứa: trang deck `/preview/deck/…`
  // là URL THẬT, GV mở tab rồi bấm Ctrl+P được. Trước đây bấm ở đó ra **1 trang khổ DỌC chỉ
  // có slide đang xem** (đo được 612×792, 1/9 slide) — vô dụng mà không có gì báo.
  //
  // An toàn với panel trong app: mọi luật đều nằm trong `@media print` và bám `.dk-root`/
  // `#scaler`, nên lúc xem màn hình không đổi gì. Nếu app chủ nhà tự lo phần in riêng thì
  // luật của họ khai SAU vẫn thắng (cùng không-layer, specificity ngang thì sau thắng trước).
  return `@layer deck-kit {\n${css}\n}\n${PRINT_CSS}`
}
