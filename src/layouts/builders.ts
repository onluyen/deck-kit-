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
import type { DeckSlide, SlideColumn } from "../model"
import { esc, escRich, nonEmpty, pad2, stripStep, texToText } from "../util/html"

export type BuildCtx = {
  /** Chỉ số slide dùng cho `data-e` (khớp `_oidx` phía Python). */
  idx: number
  edit?: boolean
  kicker?: string
  foot?: string
  page?: number | string
  total?: number | string
  /** Vị trí hiển thị — quyết định slide nào có class `active`. */
  pos?: number
  isNew?: boolean
  /** Bảng ảnh data-URI; slide chỉ giữ id. */
  assets?: Record<string, string>
}

export type Builder = (sl: DeckSlide, ctx: BuildCtx) => string

/** Thuộc tính vùng SỬA được — `data-e = "{idx}.{đường-field}"`. */
export function ed(ctx: BuildCtx, path: string): string {
  return ctx?.edit ? ` contenteditable="true" data-e="${ctx.idx ?? 0}.${path}"` : ""
}

/** Ảnh của slide → data-URI (qua bảng assets). */
function uri(ctx: BuildCtx, asset?: string): string {
  return (asset && ctx.assets?.[asset]) || ""
}

export function bullets(items: unknown[] | undefined, ctx?: BuildCtx, base = "bullets"): string {
  const bs = nonEmpty(items)
  // `escRich` (không phải `esc`): giữ 4 thẻ inline an toàn `<b> <i> <sup> <sub>` mà giáo án
  // dùng cho thuật ngữ/biến/chỉ số — 43% khối nội dung thật có định dạng này.
  if (!ctx?.edit) return `<ul class="bul">${bs.map(b => `<li>${escRich(b)}</li>`).join("")}</ul>`
  const idx = ctx.idx ?? 0
  const lis = bs.map((b, j) =>
    `<li><span contenteditable="true" data-e="${idx}.${base}.${j}">${escRich(b)}</span>` +
    `<button class="edx" title="Xoá ý">×</button></li>`).join("")
  return `<ul class="bul" data-base="${idx}.${base}">${lis}</ul>` +
    `<button class="edadd" data-base="${idx}.${base}">+ ý</button>`
}

const kicker = (ctx: BuildCtx) => esc(ctx.kicker || "")
const pgno = (ctx: BuildCtx, style = "") =>
  `<div class="pgno"${style}>${ctx.page ?? ""}/${ctx.total ?? ""}</div>`

/**
 * Khung chuẩn: kicker + tiêu đề + đường kẻ + chân trang + số trang.
 *
 * `kicker` KHÔNG cho sửa: nó là nhãn HOẠT ĐỘNG ("HĐ 1.2"), dùng chung cho mọi slide trong
 * hoạt động đó và sinh từ `sub_id` — cho sửa một slide sẽ khiến GV tưởng đổi được riêng lẻ,
 * trong khi backend không có chỗ lưu per-slide.
 */
export function chrome(sl: DeckSlide, ctx: BuildCtx): string {
  return `<div class="hd"><div class="kick">${kicker(ctx)}</div>` +
    `<div class="ttl"${ed(ctx, "title")}>${esc(sl.title)}</div></div><div class="rule"></div>` +
    `<div class="foot">${esc(ctx.foot || "")}</div>` + pgno(ctx)
}

const gridCols = (n: number) => (n >= 5 ? 3 : n >= 2 ? 2 : 1)
const cols4 = ["var(--sl-blue)", "var(--sl-gold)", "var(--sl-green)", "var(--sl-navy)"]
const cols3 = ["var(--sl-blue)", "var(--sl-gold)", "var(--sl-green)"]
/** `arrow` cố tình đảo navy lên thứ 2 — chevron liền mạch cần 2 tông đậm cạnh nhau. */
const colsArrow = ["var(--sl-blue)", "var(--sl-navy)", "var(--sl-gold)", "var(--sl-green)"]

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
export const BAR_COLORS = ["#2B4182", "#2563EB", "#0E9F6E", "#7C3AED", "#B45309"]

const withTitle = (sl: DeckSlide, n: number): SlideColumn[] =>
  (sl.columns || []).filter(c => String(c?.title || "").trim()).slice(0, n)
const withAny = (sl: DeckSlide, n: number): SlideColumn[] =>
  (sl.columns || []).filter(c => c?.title || (c?.bullets || []).length).slice(0, n)

// ───────────────────────────────────────────────────────────────── các builder

const h_content: Builder = (sl, ctx) => {
  const src = uri(ctx, sl.image?.asset)
  if (src) {
    const cap = sl.image?.title ? `<div class="fcap"${ed(ctx, "image.title")}>${esc(sl.image.title)}</div>` : ""
    return chrome(sl, ctx) + `<div class="body"><div class="two"><div>${bullets(sl.bullets, ctx)}` +
      `</div><div class="fig"><img src="${src}">${cap}</div></div></div>`
  }
  return chrome(sl, ctx) + `<div class="body">${bullets(sl.bullets, ctx)}</div>`
}

const h_goals: Builder = (sl, ctx) =>
  chrome(sl, ctx) + `<div class="body">${bullets(sl.bullets, ctx)}</div>`

const h_cards: Builder = (sl, ctx) => {
  const items = nonEmpty(sl.bullets).slice(0, 6)
  const cells = items.map((t, i) =>
    `<div><div class="card-n">${pad2(i + 1)}</div><div class="bar"></div>` +
    `<div class="card-t"${ed(ctx, `bullets.${i}`)}>${esc(t)}</div></div>`).join("")
  return chrome(sl, ctx) +
    `<div class="body"><div class="grid" style="grid-template-columns:repeat(${gridCols(items.length)},1fr)">${cells}</div></div>`
}

const h_three: Builder = (sl, ctx) => {
  let cs = withAny(sl, 3)
  if (cs.length < 2) {
    const alt = nonEmpty(sl.bullets).slice(0, 3).map(b => ({ title: "", bullets: [b] }))
    if (alt.length) cs = alt
  }
  const cells = cs.map((c, i) => {
    const a = cols3[i % 3]
    const ch = c.title ? `<div class="ch"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div>` : ""
    return `<div class="col"><div class="top" style="background:${a}"></div>` +
      `<div class="cn" style="color:${a}">${pad2(i + 1)}</div>${ch}` +
      bullets(c.bullets, ctx, `columns.${i}.bullets`) + `</div>`
  }).join("")
  return chrome(sl, ctx) +
    `<div class="body"><div class="cols" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`
}

const h_metrics: Builder = (sl, ctx) => {
  const cs = withTitle(sl, 4)
  if (cs.length < 2) return h_content(sl, ctx)
  const cells = cs.map((c, i) =>
    `<div class="metric"><div class="top"></div><div class="val"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div>` +
    `<div class="lab"${ed(ctx, `columns.${i}.bullets.0`)}>${esc((c.bullets || [""])[0])}</div></div>`).join("")
  return chrome(sl, ctx) +
    `<div class="body"><div class="mrow" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`
}

const h_timeline: Builder = (sl, ctx) => {
  const steps = nonEmpty(sl.bullets).slice(0, 5)
  const nodes = steps.map((st, i) => {
    const txt = st.replace(/^\s*(B[ưu][ớo]c|Giai đoạn|Bước)\s*\d+\s*[:.]?\s*/, "").trim()
    return `<div class="node ${i % 2 === 0 ? "above" : "below"}"><div class="dot">${i + 1}</div>` +
      `<div class="lab"${ed(ctx, `bullets.${i}`)}>${esc(txt)}</div></div>`
  }).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="tl"><div class="line"></div>${nodes}</div></div>`
}

const h_toc: Builder = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 6).map((t, i) =>
    `<div class="it"><div class="n">${pad2(i + 1)}</div><div class="t"${ed(ctx, `bullets.${i}`)}>${esc(t)}</div></div>`).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="toc">${rows}</div></div>`
}

/** define/example/remember — cùng một thẻ nhấn, khác màu viền trái. */
const h_acard = (accent: string): Builder => (sl, ctx) =>
  chrome(sl, ctx) + `<div class="acard lft" style="--sl-accent:${accent}">${bullets(sl.bullets, ctx)}</div>`

const h_formula: Builder = (sl, ctx) => {
  // `formulaImage` nhận cả data-URI lẫn id trong `assets` — backend dùng id để deck khỏi phình
  const src = sl.formulaImage?.startsWith("data:") ? sl.formulaImage : uri(ctx, sl.formulaImage)
  // Không có ảnh công thức thì KHÔNG đổ nguyên LaTeX ra màn hình (đã gặp thật:
  // `y=\left\{\begin{array}{l}…`) — dọn thành chữ đọc được và đánh dấu để GV biết
  // mà bấm dàn lại cho ra ảnh đẹp.
  const raw = String(sl.formula || "")
  const looksTex = /\\[a-zA-Z]{2,}|\{|\}/.test(raw)
  const inner = src
    ? `<img src="${src}">`
    : `<div class="ftx${looksTex ? " ftx-tex" : ""}">${esc(looksTex ? texToText(raw) : raw)}</div>`
  const cap = sl.caption ? `<div class="fcp2"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : ""
  return chrome(sl, ctx) + `<div class="fbox">${inner}</div>${cap}`
}

const h_figure: Builder = (sl, ctx) => {
  const src = uri(ctx, sl.image?.asset)
  const cap = sl.caption
    ? `<div class="fcap" style="position:absolute;left:64px;right:64px;bottom:38px"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : ""
  return chrome(sl, ctx) + `<div class="bigfig">${src ? `<img src="${src}">` : ""}</div>${cap}`
}

const h_statement: Builder = (sl, ctx) => {
  const msg = sl.title || nonEmpty(sl.bullets)[0] || ""
  const sub = sl.subtitle ? `<div class="sub"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : ""
  return `<div class="k">${kicker(ctx)}</div><div class="msg"${ed(ctx, "title")}>${esc(msg)}</div>${sub}` + pgno(ctx)
}

const h_quote: Builder = (sl, ctx) => {
  const msg = sl.title || nonEmpty(sl.bullets)[0] || ""
  const by = sl.subtitle ? `<div class="qby"${ed(ctx, "subtitle")}>— ${esc(sl.subtitle)}</div>` : ""
  return `<div class="rail"></div><div class="qmark">&ldquo;</div>` +
    `<div class="qmsg"${ed(ctx, "title")}>${esc(msg)}</div>${by}` +
    pgno(ctx, ' style="color:var(--sl-blue-border)"')
}

const h_section: Builder = (sl, ctx) => {
  const sub = sl.subtitle ? `<div class="sec-sub"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : ""
  return `<div class="rail"></div><div class="sec-tag">${kicker(ctx)}</div>` +
    `<div class="sec-ttl"${ed(ctx, "title")}>${esc(sl.title)}</div>${sub}` +
    pgno(ctx, ' style="color:var(--sl-blue-border)"')
}

const h_table: Builder = (sl, ctx) => {
  // Từng Ô sửa được: `table.<hàng>.<cột>`. Trước đây cả bảng nguyên văn khoá cứng —
  // GV thấy sai một ô cũng không sửa được, phải dàn lại cả slide.
  const rows = (sl.table || []).map((row, r) => {
    const tag = r === 0 ? "th" : "td"
    return "<tr>" + row.map((c, i) =>
      `<${tag}${ed(ctx, `table.${r}.${i}`)}>${esc(c)}</${tag}>`).join("") + "</tr>"
  }).join("")
  return chrome(sl, ctx) + `<div class="body"><table class="dtbl">${rows}</table></div>`
}

const h_note: Builder = (sl, ctx) =>
  chrome(sl, ctx) +
  `<div class="acard" style="background:var(--sl-amber-bg);border:1px solid var(--sl-amber-bd)">${bullets(sl.bullets, ctx)}</div>`

const h_question: Builder = (sl, ctx) => {
  const q = sl.question
  const opts = (q?.options || []).map((o, i) =>
    `<li${ed(ctx, `question.options.${i}`)}>${esc(o)}</li>`).join("")
  const stem = `<div class="acard" style="top:130px;bottom:180px">` +
    `<div style="font-size:24px;font-weight:700;line-height:1.35"${ed(ctx, "question.stem")}>${esc(q?.stem)}</div>` +
    (opts ? `<ul class="bul" style="margin-top:18px">${opts}</ul>` : "") + "</div>"
  // bottom:74px — phải nằm TRÊN dòng chân trang (.foot ở bottom:30px), nếu không hai khối đè nhau
  // CHỈ hiện khi slide THẬT SỰ có ghi chú: bảo GV mở Presenter View để xem một ô trống là chỉ
  // đường vào ngõ cụt. Phải khớp `_h_question` bên `slides_html.py`.
  const note = sl.notes
    ? `<div style="position:absolute;left:64px;right:64px;bottom:74px;background:var(--sl-blue-tint);` +
      `border-radius:12px;padding:14px 20px;font-size:16px;color:var(--sl-blue-deep)">` +
      `Đáp án ở phần Ghi chú (Notes) — mở Presenter View để xem.</div>`
    : ""
  return chrome(sl, ctx) + stem + note
}

const h_steps: Builder = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 6).map((t, i) =>
    `<div class="stp"><div class="sn">${i + 1}</div>` +
    `<div class="st"${ed(ctx, `bullets.${i}`)}>${esc(stripStep(t))}</div></div>`).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="steps">${rows}</div></div>`
}

const h_bignum: Builder = (sl, ctx) => {
  const cs = withTitle(sl, 3)
  if (!cs.length) return h_content(sl, ctx)
  const cells = cs.map((c, i) =>
    `<div class="bn"><div class="bnv" style="color:${cols3[i % 3]}"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div>` +
    `<div class="bnl"${ed(ctx, `columns.${i}.bullets.0`)}>${esc((c.bullets || [""])[0])}</div></div>`).join("")
  return chrome(sl, ctx) +
    `<div class="body"><div class="bnrow" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`
}

const h_pyramid: Builder = (sl, ctx) => {
  const items = nonEmpty(sl.bullets).slice(0, 5)
  const n = Math.max(1, items.length)
  const rows = items.map((b, i) => {
    const w = n > 1 ? 46 + i * (52 / (n - 1)) : 74
    return `<div class="pyr" style="width:${Math.round(w)}%;background:${BAR_COLORS[i % 5]}"` +
      `${ed(ctx, `bullets.${i}`)}>${esc(b)}</div>`
  }).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="pyramid">${rows}</div></div>`
}

const h_funnel: Builder = (sl, ctx) => {
  const items = nonEmpty(sl.bullets).slice(0, 5)
  const n = Math.max(1, items.length)
  const rows = items.map((b, i) => {
    const w = n > 1 ? 92 - i * (52 / (n - 1)) : 74
    return `<div class="fnl" style="width:${Math.round(w)}%;background:${BAR_COLORS[i % 5]}"` +
      `${ed(ctx, `bullets.${i}`)}>${esc(b)}</div>`
  }).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="funnel">${rows}</div></div>`
}

const h_checklist: Builder = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 6).map((t, i) =>
    `<div class="ck"><span class="ckm">✓</span>` +
    `<div class="ckt"${ed(ctx, `bullets.${i}`)}>${esc(t)}</div></div>`).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="cklist">${rows}</div></div>`
}

const h_quadrant: Builder = (sl, ctx) => {
  const cs = withTitle(sl, 4)
  if (cs.length < 2) return h_content(sl, ctx)
  const cells = cs.map((c, i) =>
    `<div class="qd" style="border-top:5px solid ${cols4[i % 4]}">` +
    `<div class="qdt" style="color:${cols4[i % 4]}"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div>` +
    bullets(c.bullets, ctx, `columns.${i}.bullets`) + `</div>`).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="quad">${cells}</div></div>`
}

const h_arrow: Builder = (sl, ctx) => {
  const cells = nonEmpty(sl.bullets).slice(0, 4).map((t, i) =>
    `<div class="arw${i === 0 ? " first" : ""}" style="background:${colsArrow[i % 4]}">` +
    `<div class="arwn">BƯỚC ${i + 1}</div>` +
    `<div class="arwt"${ed(ctx, `bullets.${i}`)}>${esc(stripStep(t))}</div></div>`).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="arrow">${cells}</div></div>`
}

const h_hero: Builder = (sl, ctx) => {
  const sub = sl.subtitle ? `<div class="hsub"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : ""
  return `<div class="cover-in"><div class="hbar"></div><div class="hk">${kicker(ctx)}</div>` +
    `<div class="hbig"${ed(ctx, "title")}>${esc(sl.title)}</div>${sub}</div>` + pgno(ctx)
}

const h_gallery: Builder = (sl, ctx) => {
  const figs = (sl.images || []).filter(f => uri(ctx, f.asset)).slice(0, 4)
  if (!figs.length) return h_content(sl, ctx)
  const cells = figs.map((f, i) => {
    const cap = f.title ? `<div class="gcap"${ed(ctx, `images.${i}.title`)}>${esc(f.title)}</div>` : ""
    return `<div class="gcell"><img src="${uri(ctx, f.asset)}">${cap}</div>`
  }).join("")
  return chrome(sl, ctx) +
    `<div class="body"><div class="gal" style="grid-template-columns:repeat(${figs.length > 1 ? 2 : 1},1fr)">${cells}</div></div>`
}

const h_numbered: Builder = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 5).map((t, i) =>
    `<div class="nrow"><div class="nbig">${pad2(i + 1)}</div>` +
    `<div class="ntxt"${ed(ctx, `bullets.${i}`)}>${esc(t)}</div></div>`).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="nlist">${rows}</div></div>`
}

const h_split: Builder = (sl, ctx) => {
  const sub = sl.subtitle ? `<div class="spl-sub"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : ""
  return `<div class="split"><div class="spl-l"><div class="spl-t"${ed(ctx, "title")}>${esc(sl.title)}</div>${sub}</div>` +
    `<div class="spl-r">${bullets(sl.bullets, ctx)}</div></div>` + pgno(ctx)
}

const h_feature: Builder = (sl, ctx) => {
  const cs = withTitle(sl, 4)
  if (cs.length < 2) return h_content(sl, ctx)
  const cells = cs.map((c, i) => {
    const line = (c.bullets || [""])[0]
    const ln = line ? `<div class="ft-l"${ed(ctx, `columns.${i}.bullets.0`)}>${esc(line)}</div>` : ""
    return `<div class="ft"><div class="ft-ic" style="background:${cols4[i % 4]}">${i + 1}</div>` +
      `<div class="ft-t"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div>${ln}</div>`
  }).join("")
  return chrome(sl, ctx) +
    `<div class="body"><div class="feat" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`
}

const h_proscons: Builder = (sl, ctx) => {
  const cs = withAny(sl, 2)
  if (cs.length < 2) return h_content(sl, ctx)
  const cfg: [string, string][] = [["#0E9F6E", "✓"], ["#C70036", "✗"]]
  const cells = cs.map((c, i) => {
    const [col, mark] = cfg[i]
    return `<div class="pc" style="border-top:5px solid ${col}">` +
      `<div class="pc-h"><span class="pc-m" style="background:${col}">${mark}</span>` +
      `<span style="color:${col}"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</span></div>` +
      bullets(c.bullets, ctx, `columns.${i}.bullets`) + `</div>`
  }).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="pcwrap">${cells}</div></div>`
}

const h_spotlight: Builder = (sl, ctx) =>
  chrome(sl, ctx) + `<div class="body"><div class="spot"><div class="spot-ic">💡</div>` +
  `<div class="spot-body">${bullets(sl.bullets, ctx)}</div></div></div>`

const h_vtimeline: Builder = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 5).map((t, i) =>
    `<div class="vt-item"><div class="vt-dot">${i + 1}</div>` +
    `<div class="vt-txt"${ed(ctx, `bullets.${i}`)}>${esc(stripStep(t))}</div></div>`).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="vtl">${rows}</div></div>`
}

const h_twocol: Builder = (sl, ctx) => {
  if (nonEmpty(sl.bullets).length < 3) return h_content(sl, ctx)
  return chrome(sl, ctx) + `<div class="body twocol">${bullets(sl.bullets, ctx)}</div>`
}

const h_comparetable: Builder = (sl, ctx) => {
  const cs = withAny(sl, 2)
  if (cs.length < 2) return h_content(sl, ctx)
  const a = cs[0].bullets || [], b = cs[1].bullets || []
  const head = `<tr><th${ed(ctx, "columns.0.title")}>${esc(cs[0].title)}</th>` +
    `<th${ed(ctx, "columns.1.title")}>${esc(cs[1].title)}</th></tr>`
  let body = ""
  for (let r = 0; r < Math.max(a.length, b.length); r++) {
    body += `<tr><td${ed(ctx, `columns.0.bullets.${r}`)}>${esc(a[r] ?? "")}</td>` +
      `<td${ed(ctx, `columns.1.bullets.${r}`)}>${esc(b[r] ?? "")}</td></tr>`
  }
  return chrome(sl, ctx) + `<div class="body"><table class="cmptbl">${head}${body}</table></div>`
}

// ── Bố cục BỔ SUNG (đợt 2) ───────────────────────────────────────────────────
// Không tồn tại ở renderer Python — chỉ deck-kit dựng được. Cổng so ảnh vì thế
// chỉ đối chiếu 36 bố cục gốc; nhóm này kiểm bằng test riêng.

/** Dãy chỉ số lớn nằm ngang — giống `metrics` nhưng số to, nhãn dưới, có vạch màu. */
const h_kpirow: Builder = (sl, ctx) => {
  const cs = withTitle(sl, 4)
  if (cs.length < 2) return h_content(sl, ctx)
  const cells = cs.map((c, i) =>
    `<div class="kpi" style="--sl-accent:${cols4[i % 4]}">` +
    `<div class="kpi-v"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div>` +
    `<div class="kpi-bar"></div>` +
    `<div class="kpi-l"${ed(ctx, `columns.${i}.bullets.0`)}>${esc((c.bullets || [""])[0])}</div></div>`).join("")
  return chrome(sl, ctx) +
    `<div class="body"><div class="kpirow" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`
}

/** Ảnh một bên, ý bên kia. `side="l"` = ảnh trái. */
const h_imageside = (side: "l" | "r"): Builder => (sl, ctx) => {
  const f = sl.image || (sl.images || [])[0]
  const src = uri(ctx, f?.asset)
  if (!src) return h_content(sl, ctx)          // không có ảnh thì đừng để khung rỗng
  const cap = f?.title ? `<div class="fcap"${ed(ctx, "image.title")}>${esc(f.title)}</div>` : ""
  const pic = `<div class="fig"><img src="${src}">${cap}</div>`
  const txt = `<div>${bullets(sl.bullets, ctx)}</div>`
  return chrome(sl, ctx) +
    `<div class="body"><div class="imgside ${side === "l" ? "left" : "right"}">` +
    (side === "l" ? pic + txt : txt + pic) + `</div></div>`
}

/** Trích dẫn kèm ảnh + tên người nói. Thiếu ảnh vẫn chạy (chỉ mất avatar). */
const h_quoteauthor: Builder = (sl, ctx) => {
  const msg = sl.title || nonEmpty(sl.bullets)[0] || ""
  const src = uri(ctx, (sl.image || (sl.images || [])[0])?.asset)
  const av = src ? `<img class="qav" src="${src}">` : ""
  const by = sl.subtitle ? `<div class="qby"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : ""
  const role = sl.caption ? `<div class="qrole"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : ""
  return `<div class="rail"></div><div class="qmark">&ldquo;</div>` +
    `<div class="qmsg"${ed(ctx, "title")}>${esc(msg)}</div>` +
    `<div class="qauth">${av}<div>${by}${role}</div></div>` +
    pgno(ctx, ' style="color:var(--sl-blue-border)"')
}

/**
 * Mục lục có đánh dấu ĐANG Ở ĐÂU.
 *
 * Mục hiện tại đánh dấu bằng tiền tố `>` ngay trong ý (vd `"> Luyện tập"`) — dùng quy ước
 * trong TEXT chứ không thêm trường mới, để dữ liệu đi qua `apply_edits`/JSON mà không mất
 * và giáo viên sửa được ngay tại chỗ. Không đánh dấu thì mặc định mục đầu.
 */
const AGENDA_MARK = /^\s*>\s*/

const h_agenda: Builder = (sl, ctx) => {
  const raw = nonEmpty(sl.bullets).slice(0, 7)
  let cur = raw.findIndex(t => AGENDA_MARK.test(t))
  if (cur < 0) cur = 0
  const rows = raw.map((t, i) => {
    const st = i < cur ? "done" : i === cur ? "now" : "next"
    const mark = i < cur ? "✓" : pad2(i + 1)
    return `<div class="ag-it ${st}"><div class="ag-n">${mark}</div>` +
      `<div class="ag-t"${ed(ctx, `bullets.${i}`)}>${esc(t.replace(AGENDA_MARK, ""))}</div></div>`
  }).join("")
  return chrome(sl, ctx) + `<div class="body"><div class="agenda">${rows}</div></div>`
}

/** So sánh 3 cột có tiêu đề màu — khác `three` ở chỗ tiêu đề là dải màu đặc. */
const h_compare3: Builder = (sl, ctx) => {
  const cs = withAny(sl, 3)
  if (cs.length < 2) return h_content(sl, ctx)
  const cells = cs.map((c, i) => {
    const a = cols3[i % 3]
    return `<div class="c3"><div class="c3-h" style="background:${a}"${ed(ctx, `columns.${i}.title`)}>` +
      `${esc(c.title)}</div><div class="c3-b">` +
      bullets(c.bullets, ctx, `columns.${i}.bullets`) + `</div></div>`
  }).join("")
  return chrome(sl, ctx) +
    `<div class="body"><div class="c3row" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`
}

/** Khung trắng — chỉ tiêu đề + vùng ý trống để GV tự dựng. */
const h_blank: Builder = (sl, ctx) =>
  chrome(sl, ctx) + `<div class="body blankbody">${bullets(sl.bullets, ctx)}</div>`


/**
 * Bảng RỘNG — bảng biến thiên (`x | −∞ | −1 | 0 | +∞` × `y′` × `y`).
 *
 * 9/12 bảng trong dữ liệu thật là loại này (6–10 cột). `h_table` dùng `table-layout:fixed`
 * nên bảng co dúm ở góc trái, chừa 2/3 slide trống — chiếu xa gần như không đọc được.
 * Bố cục này trải hết bề ngang, cột đều nhau, hàng đầu là mốc x.
 *
 * Hàng LỆCH SỐ CỘT là bình thường ở bảng biến thiên (ô dấu nằm giữa hai mốc) — phải đệm
 * cho đủ, không thì bảng vỡ so le.
 */
const h_tablewide: Builder = (sl, ctx) => {
  const rows = (sl.table || []).map(r => r.map(c => String(c ?? "")))
  if (!rows.length) return h_content(sl, ctx)
  const nc = Math.max(...rows.map(r => r.length))
  // Bảng biến thiên hàng NÀO CŨNG lệch số ô (ô dấu nằm giữa hai mốc), nên đệm bằng ô rỗng
  // sẽ đẩy cả hàng lệch sang trái. Hàng thiếu ô thì cho ô CUỐI trải nốt phần dư bằng
  // `colspan` — mốc đầu/cuối vẫn thẳng cột, phần giữa giãn đều.
  const body = rows.map((row, r) => {
    const cells = row.map((v, c) => {
      const tag = r === 0 ? "th" : "td"
      const head = c === 0 ? " class=\"tw-h\"" : ""    // cột đầu là nhãn hàng (x / y′ / y)
      const span = c === row.length - 1 && row.length < nc
        ? ` colspan="${nc - row.length + 1}"` : ""
      return `<${tag}${head}${span}${ed(ctx, `table.${r}.${c}`)}>${esc(v)}</${tag}>`
    }).join("")
    return `<tr>${cells}</tr>`
  }).join("")
  const cap = sl.caption ? `<div class="tw-cap"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : ""
  return chrome(sl, ctx) +
    `<div class="body twwrap"><table class="twtbl" style="--tw-n:${nc}">${body}</table>${cap}</div>`
}

/**
 * Thẻ định nghĩa nguyên văn — `note`/`define` có ý dài TB 123, max 413 ký tự (80 slide thật).
 * Bố cục danh sách gạch đầu dòng làm chữ dài đó vỡ vụn; ở đây trình bày như một khối văn
 * bản có khung, cỡ chữ tự co theo độ dài.
 */
const h_defcard: Builder = (sl, ctx) => {
  const bs = nonEmpty(sl.bullets)
  const total = bs.reduce((n, b) => n + b.length, 0)
  // Bậc cỡ chữ theo TỔNG độ dài — tính được ở cả hai renderer, không cần đo bằng JS
  const size = total > 700 ? "s" : total > 380 ? "m" : "l"
  const paras = bs.map((b, i) =>
    `<p class="dc-p"${ed(ctx, `bullets.${i}`)}>${esc(b)}</p>`).join("")
  const src = sl.caption ? `<div class="dc-src"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : ""
  return chrome(sl, ctx) +
    `<div class="body"><div class="defcard" data-sz="${size}">${paras}${src}</div></div>`
}

/**
 * Công thức + các bước biến đổi. Dữ liệu thật hay có "giải y′ = 0 → x = …" nhiều bước;
 * `formula` chỉ vẽ được MỘT công thức, còn `steps` thì không làm nổi bật công thức gốc.
 */
const h_formulasteps: Builder = (sl, ctx) => {
  const src = sl.formulaImage?.startsWith("data:") ? sl.formulaImage : uri(ctx, sl.formulaImage)
  const raw = String(sl.formula || "")
  const looksTex = /\\[a-zA-Z]{2,}|\{|\}/.test(raw)
  const head = src
    ? `<img src="${src}">`
    : `<div class="fs-eq${looksTex ? " ftx-tex" : ""}">${esc(looksTex ? texToText(raw) : raw)}</div>`
  const steps = nonEmpty(sl.bullets).slice(0, 5).map((b, i) =>
    `<li><span class="fs-n">${i + 1}</span>` +
    `<span class="fs-t"${ed(ctx, `bullets.${i}`)}>${esc(stripStep(b))}</span></li>`).join("")
  return chrome(sl, ctx) +
    `<div class="body fswrap"><div class="fsbox">${head}</div>` +
    `<ol class="fsteps">${steps}</ol></div>`
}

export const BUILDERS: Record<string, Builder> = {
  tablewide: h_tablewide, defcard: h_defcard, formulasteps: h_formulasteps,
  kpirow: h_kpirow, imageleft: h_imageside("l"), imageright: h_imageside("r"),
  quoteauthor: h_quoteauthor, agenda: h_agenda, compare3: h_compare3, blank: h_blank,
  goals: h_goals, content: h_content, cards: h_cards, three: h_three,
  metrics: h_metrics, timeline: h_timeline, toc: h_toc, steps: h_steps,
  bignum: h_bignum, pyramid: h_pyramid, funnel: h_funnel,
  checklist: h_checklist, quadrant: h_quadrant, arrow: h_arrow, hero: h_hero, gallery: h_gallery,
  numbered: h_numbered, split: h_split, feature: h_feature, proscons: h_proscons, spotlight: h_spotlight,
  vtimeline: h_vtimeline, twocol: h_twocol, comparetable: h_comparetable,
  define: h_acard("var(--sl-navy)"), example: h_acard("var(--sl-green)"),
  remember: h_acard("var(--sl-gold)"), compare: h_three,
  formula: h_formula, figure: h_figure, table: h_table, note: h_note,
  question: h_question, statement: h_statement, quote: h_quote, section: h_section,
}

/** Bố cục full-bleed → class riêng thay cho khung chuẩn. */
export const HERO_CLASS: Record<string, string> = {
  statement: "hero dots", quote: "dk-dark", section: "dk-dark", hero: "cover", split: "split",
  quoteauthor: "dk-dark",
}
