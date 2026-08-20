"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.tsx
var react_exports = {};
__export(react_exports, {
  DeckView: () => DeckView,
  mountDeck: () => mountDeck
});
module.exports = __toCommonJS(react_exports);
var import_react = require("react");

// src/model.ts
var DEFAULT_SIZE = { w: 1280, h: 720 };
function normalizeDeck(input) {
  const slides = (input.slides || []).map((s, i) => ({ ...s, id: s.id || `s${i}` }));
  const seen = /* @__PURE__ */ new Set();
  for (const s of slides) {
    while (seen.has(s.id)) s.id = `${s.id}_`;
    seen.add(s.id);
  }
  return {
    ...input,
    version: 1,
    theme: input.theme || "navy-gold",
    transition: input.transition || "fade",
    size: input.size || { ...DEFAULT_SIZE },
    assets: input.assets || {},
    slides
  };
}

// src/util/html.ts
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function escRich(s) {
  return esc(s).replace(/&lt;(\/?)(b|i|sup|sub)&gt;/g, "<$1$2>");
}
function stripStep(b) {
  return String(b || "").replace(/^\s*(B[ưu][ớo]c|Giai đoạn|Stage|Step)\s*\d+\s*[:.\-–]?\s*/, "").trim();
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
var nonEmpty = (a) => (a || []).map((x) => String(x ?? "")).filter((x) => x.trim());
function texToText(tex) {
  let t = String(tex || "");
  const MAP = [
    ["\\Leftrightarrow", "\u21D4"],
    ["\\Rightarrow", "\u21D2"],
    ["\\mathbb{R}", "\u211D"],
    ["\\forall", "\u2200"],
    ["\\exists", "\u2203"],
    ["\\infty", "\u221E"],
    ["\\left", ""],
    ["\\right", ""],
    ["\\times", "\xD7"],
    ["\\cdot", "\xB7"],
    ["\\sqrt", "\u221A"],
    ["\\leq", "\u2264"],
    ["\\geq", "\u2265"],
    ["\\neq", "\u2260"],
    ["\\le", "\u2264"],
    ["\\ge", "\u2265"],
    ["\\ne", "\u2260"],
    ["\\to", "\u2192"],
    ["\\in", "\u2208"],
    // Chữ Hy Lạp — PHẢI có, không thì luật "lệnh còn sót" bên dưới XOÁ SẠCH chúng.
    // Đo trên bài thật `9208c648`: `\Delta_{Q}=Q_{3}-Q_{1}` ra `=Q3-Q1` (công thức bắt đầu
    // bằng `=`, mất tên đại lượng) · `\alpha+\beta` ra `+` · `\theta` ra chuỗi RỖNG.
    // Mất nghĩa chứ không phải xấu. Giữ ĐỒNG BỘ với `deck_json._tex_to_text` phía Python.
    ["\\vartheta", "\u03D1"],
    ["\\varphi", "\u03C6"],
    ["\\varepsilon", "\u03B5"],
    ["\\Delta", "\u0394"],
    ["\\Gamma", "\u0393"],
    ["\\Lambda", "\u039B"],
    ["\\Omega", "\u03A9"],
    ["\\Sigma", "\u03A3"],
    ["\\Theta", "\u0398"],
    ["\\Phi", "\u03A6"],
    ["\\Psi", "\u03A8"],
    ["\\Pi", "\u03A0"],
    ["\\alpha", "\u03B1"],
    ["\\beta", "\u03B2"],
    ["\\gamma", "\u03B3"],
    ["\\delta", "\u03B4"],
    ["\\epsilon", "\u03B5"],
    ["\\zeta", "\u03B6"],
    ["\\eta", "\u03B7"],
    ["\\theta", "\u03B8"],
    ["\\iota", "\u03B9"],
    ["\\kappa", "\u03BA"],
    ["\\lambda", "\u03BB"],
    ["\\mu", "\u03BC"],
    ["\\nu", "\u03BD"],
    ["\\xi", "\u03BE"],
    ["\\rho", "\u03C1"],
    ["\\sigma", "\u03C3"],
    ["\\tau", "\u03C4"],
    ["\\upsilon", "\u03C5"],
    ["\\phi", "\u03C6"],
    ["\\chi", "\u03C7"],
    ["\\psi", "\u03C8"],
    ["\\omega", "\u03C9"],
    ["\\pi", "\u03C0"]
  ];
  for (const [a, b] of MAP) t = t.split(a).join(b);
  t = t.replace(/_\{([^{}]*)\}/g, "$1").replace(/\^\{([^{}]*)\}/g, "^$1");
  t = t.replace(/\\text\{([^{}]*)\}/g, "$1");
  for (let i = 0; i < 3; i++) {
    const next = t.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "($1)/($2)");
    if (next === t) break;
    t = next;
  }
  t = t.replace(/\\begin\{[a-z]*\}(\{[^{}]*\})?/gi, "").replace(/\\end\{[a-z]*\}/gi, "");
  t = t.replace(/\\\\/g, " ; ");
  t = t.replace(/\\[a-zA-Z]+/g, "");
  t = t.replace(/\\([{}[\]|,;!\s])/g, "$1").replace(/\\+/g, "");
  return t.replace(/[{}$]/g, "").replace(/\s+/g, " ").trim();
}

// src/layouts/builders.ts
function ed(ctx, path) {
  return ctx?.edit ? ` contenteditable="true" data-e="${ctx.idx ?? 0}.${path}"` : "";
}
function uri(ctx, asset) {
  return asset && ctx.assets?.[asset] || "";
}
function bullets(items, ctx, base = "bullets") {
  const bs = nonEmpty(items);
  if (!ctx?.edit) return `<ul class="bul">${bs.map((b) => `<li>${escRich(b)}</li>`).join("")}</ul>`;
  const idx = ctx.idx ?? 0;
  const lis = bs.map((b, j) => `<li><span contenteditable="true" data-e="${idx}.${base}.${j}">${escRich(b)}</span><button class="edx" title="Xo\xE1 \xFD">\xD7</button></li>`).join("");
  return `<ul class="bul" data-base="${idx}.${base}">${lis}</ul><button class="edadd" data-base="${idx}.${base}">+ \xFD</button>`;
}
var kicker = (ctx) => esc(ctx.kicker || "");
var pgno = (ctx, style = "") => `<div class="pgno"${style}>${ctx.page ?? ""}/${ctx.total ?? ""}</div>`;
function chrome(sl, ctx) {
  return `<div class="hd"><div class="kick">${kicker(ctx)}</div><div class="ttl"${ed(ctx, "title")}>${esc(sl.title)}</div></div><div class="rule"></div><div class="foot">${esc(ctx.foot || "")}</div>` + pgno(ctx);
}
var gridCols = (n) => n >= 5 ? 3 : n >= 2 ? 2 : 1;
var cols4 = ["var(--sl-blue)", "var(--sl-gold)", "var(--sl-green)", "var(--sl-navy)"];
var cols3 = ["var(--sl-blue)", "var(--sl-gold)", "var(--sl-green)"];
var colsArrow = ["var(--sl-blue)", "var(--sl-navy)", "var(--sl-gold)", "var(--sl-green)"];
var BAR_COLORS = ["#2B4182", "#2563EB", "#0E9F6E", "#7C3AED", "#B45309"];
var withTitle = (sl, n) => (sl.columns || []).filter((c) => String(c?.title || "").trim()).slice(0, n);
var withAny = (sl, n) => (sl.columns || []).filter((c) => c?.title || (c?.bullets || []).length).slice(0, n);
var h_content = (sl, ctx) => {
  const src = uri(ctx, sl.image?.asset);
  if (src) {
    const cap = sl.image?.title ? `<div class="fcap"${ed(ctx, "image.title")}>${esc(sl.image.title)}</div>` : "";
    return chrome(sl, ctx) + `<div class="body"><div class="two"><div>${bullets(sl.bullets, ctx)}</div><div class="fig"><img src="${src}">${cap}</div></div></div>`;
  }
  return chrome(sl, ctx) + `<div class="body">${bullets(sl.bullets, ctx)}</div>`;
};
var h_goals = (sl, ctx) => chrome(sl, ctx) + `<div class="body">${bullets(sl.bullets, ctx)}</div>`;
var h_cards = (sl, ctx) => {
  const items = nonEmpty(sl.bullets).slice(0, 6);
  const cells = items.map((t, i) => `<div><div class="card-n">${pad2(i + 1)}</div><div class="bar"></div><div class="card-t"${ed(ctx, `bullets.${i}`)}>${esc(t)}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="grid" style="grid-template-columns:repeat(${gridCols(items.length)},1fr)">${cells}</div></div>`;
};
var h_three = (sl, ctx) => {
  let cs = withAny(sl, 3);
  if (cs.length < 2) {
    const alt = nonEmpty(sl.bullets).slice(0, 3).map((b) => ({ title: "", bullets: [b] }));
    if (alt.length) cs = alt;
  }
  const cells = cs.map((c, i) => {
    const a = cols3[i % 3];
    const ch = c.title ? `<div class="ch"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div>` : "";
    return `<div class="col"><div class="top" style="background:${a}"></div><div class="cn" style="color:${a}">${pad2(i + 1)}</div>${ch}` + bullets(c.bullets, ctx, `columns.${i}.bullets`) + `</div>`;
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="cols" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`;
};
var h_metrics = (sl, ctx) => {
  const cs = withTitle(sl, 4);
  if (cs.length < 2) return h_content(sl, ctx);
  const cells = cs.map((c, i) => `<div class="metric"><div class="top"></div><div class="val"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div><div class="lab"${ed(ctx, `columns.${i}.bullets.0`)}>${esc((c.bullets || [""])[0])}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="mrow" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`;
};
var h_timeline = (sl, ctx) => {
  const steps = nonEmpty(sl.bullets).slice(0, 5);
  const nodes = steps.map((st, i) => {
    const txt = st.replace(/^\s*(B[ưu][ớo]c|Giai đoạn|Bước)\s*\d+\s*[:.]?\s*/, "").trim();
    return `<div class="node ${i % 2 === 0 ? "above" : "below"}"><div class="dot">${i + 1}</div><div class="lab"${ed(ctx, `bullets.${i}`)}>${esc(txt)}</div></div>`;
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="tl"><div class="line"></div>${nodes}</div></div>`;
};
var h_toc = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 6).map((t, i) => `<div class="it"><div class="n">${pad2(i + 1)}</div><div class="t"${ed(ctx, `bullets.${i}`)}>${esc(t)}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="toc">${rows}</div></div>`;
};
var h_acard = (accent) => (sl, ctx) => chrome(sl, ctx) + `<div class="acard lft" style="--sl-accent:${accent}">${bullets(sl.bullets, ctx)}</div>`;
var h_formula = (sl, ctx) => {
  const src = sl.formulaImage?.startsWith("data:") ? sl.formulaImage : uri(ctx, sl.formulaImage);
  const raw = String(sl.formula || "");
  const looksTex = /\\[a-zA-Z]{2,}|\{|\}/.test(raw);
  const inner = src ? `<img src="${src}">` : `<div class="ftx${looksTex ? " ftx-tex" : ""}">${esc(looksTex ? texToText(raw) : raw)}</div>`;
  const cap = sl.caption ? `<div class="fcp2"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : "";
  return chrome(sl, ctx) + `<div class="fbox">${inner}</div>${cap}`;
};
var h_figure = (sl, ctx) => {
  const src = uri(ctx, sl.image?.asset);
  const cap = sl.caption ? `<div class="fcap" style="position:absolute;left:64px;right:64px;bottom:38px"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : "";
  return chrome(sl, ctx) + `<div class="bigfig">${src ? `<img src="${src}">` : ""}</div>${cap}`;
};
var h_statement = (sl, ctx) => {
  const msg = sl.title || nonEmpty(sl.bullets)[0] || "";
  const sub = sl.subtitle ? `<div class="sub"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : "";
  return `<div class="k">${kicker(ctx)}</div><div class="msg"${ed(ctx, "title")}>${esc(msg)}</div>${sub}` + pgno(ctx);
};
var h_quote = (sl, ctx) => {
  const msg = sl.title || nonEmpty(sl.bullets)[0] || "";
  const by = sl.subtitle ? `<div class="qby"${ed(ctx, "subtitle")}>\u2014 ${esc(sl.subtitle)}</div>` : "";
  return `<div class="rail"></div><div class="qmark">&ldquo;</div><div class="qmsg"${ed(ctx, "title")}>${esc(msg)}</div>${by}` + pgno(ctx, ' style="color:var(--sl-blue-border)"');
};
var h_section = (sl, ctx) => {
  const sub = sl.subtitle ? `<div class="sec-sub"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : "";
  return `<div class="rail"></div><div class="sec-tag">${kicker(ctx)}</div><div class="sec-ttl"${ed(ctx, "title")}>${esc(sl.title)}</div>${sub}` + pgno(ctx, ' style="color:var(--sl-blue-border)"');
};
var h_table = (sl, ctx) => {
  const rows = (sl.table || []).map((row, r) => {
    const tag = r === 0 ? "th" : "td";
    return "<tr>" + row.map((c, i) => `<${tag}${ed(ctx, `table.${r}.${i}`)}>${esc(c)}</${tag}>`).join("") + "</tr>";
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><table class="dtbl">${rows}</table></div>`;
};
var h_note = (sl, ctx) => chrome(sl, ctx) + `<div class="acard" style="background:var(--sl-amber-bg);border:1px solid var(--sl-amber-bd)">${bullets(sl.bullets, ctx)}</div>`;
var h_question = (sl, ctx) => {
  const q = sl.question;
  const opts = (q?.options || []).map((o, i) => `<li${ed(ctx, `question.options.${i}`)}>${esc(o)}</li>`).join("");
  const stem = `<div class="acard" style="top:130px;bottom:180px"><div style="font-size:24px;font-weight:700;line-height:1.35"${ed(ctx, "question.stem")}>${esc(q?.stem)}</div>` + (opts ? `<ul class="bul" style="margin-top:18px">${opts}</ul>` : "") + "</div>";
  const note = sl.notes ? `<div style="position:absolute;left:64px;right:64px;bottom:74px;background:var(--sl-blue-tint);border-radius:12px;padding:14px 20px;font-size:16px;color:var(--sl-blue-deep)">\u0110\xE1p \xE1n \u1EDF ph\u1EA7n Ghi ch\xFA (Notes) \u2014 m\u1EDF Presenter View \u0111\u1EC3 xem.</div>` : "";
  return chrome(sl, ctx) + stem + note;
};
var h_steps = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 6).map((t, i) => `<div class="stp"><div class="sn">${i + 1}</div><div class="st"${ed(ctx, `bullets.${i}`)}>${esc(stripStep(t))}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="steps">${rows}</div></div>`;
};
var h_bignum = (sl, ctx) => {
  const cs = withTitle(sl, 3);
  if (!cs.length) return h_content(sl, ctx);
  const cells = cs.map((c, i) => `<div class="bn"><div class="bnv" style="color:${cols3[i % 3]}"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div><div class="bnl"${ed(ctx, `columns.${i}.bullets.0`)}>${esc((c.bullets || [""])[0])}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="bnrow" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`;
};
var h_pyramid = (sl, ctx) => {
  const items = nonEmpty(sl.bullets).slice(0, 5);
  const n = Math.max(1, items.length);
  const rows = items.map((b, i) => {
    const w = n > 1 ? 46 + i * (52 / (n - 1)) : 74;
    return `<div class="pyr" style="width:${Math.round(w)}%;background:${BAR_COLORS[i % 5]}"${ed(ctx, `bullets.${i}`)}>${esc(b)}</div>`;
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="pyramid">${rows}</div></div>`;
};
var h_funnel = (sl, ctx) => {
  const items = nonEmpty(sl.bullets).slice(0, 5);
  const n = Math.max(1, items.length);
  const rows = items.map((b, i) => {
    const w = n > 1 ? 92 - i * (52 / (n - 1)) : 74;
    return `<div class="fnl" style="width:${Math.round(w)}%;background:${BAR_COLORS[i % 5]}"${ed(ctx, `bullets.${i}`)}>${esc(b)}</div>`;
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="funnel">${rows}</div></div>`;
};
var h_checklist = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 6).map((t, i) => `<div class="ck"><span class="ckm">\u2713</span><div class="ckt"${ed(ctx, `bullets.${i}`)}>${esc(t)}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="cklist">${rows}</div></div>`;
};
var h_quadrant = (sl, ctx) => {
  const cs = withTitle(sl, 4);
  if (cs.length < 2) return h_content(sl, ctx);
  const cells = cs.map((c, i) => `<div class="qd" style="border-top:5px solid ${cols4[i % 4]}"><div class="qdt" style="color:${cols4[i % 4]}"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div>` + bullets(c.bullets, ctx, `columns.${i}.bullets`) + `</div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="quad">${cells}</div></div>`;
};
var h_arrow = (sl, ctx) => {
  const cells = nonEmpty(sl.bullets).slice(0, 4).map((t, i) => `<div class="arw${i === 0 ? " first" : ""}" style="background:${colsArrow[i % 4]}"><div class="arwn">B\u01AF\u1EDAC ${i + 1}</div><div class="arwt"${ed(ctx, `bullets.${i}`)}>${esc(stripStep(t))}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="arrow">${cells}</div></div>`;
};
var h_hero = (sl, ctx) => {
  const sub = sl.subtitle ? `<div class="hsub"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : "";
  return `<div class="cover-in"><div class="hbar"></div><div class="hk">${kicker(ctx)}</div><div class="hbig"${ed(ctx, "title")}>${esc(sl.title)}</div>${sub}</div>` + pgno(ctx);
};
var h_gallery = (sl, ctx) => {
  const figs = (sl.images || []).filter((f) => uri(ctx, f.asset)).slice(0, 4);
  if (!figs.length) return h_content(sl, ctx);
  const cells = figs.map((f, i) => {
    const cap = f.title ? `<div class="gcap"${ed(ctx, `images.${i}.title`)}>${esc(f.title)}</div>` : "";
    return `<div class="gcell"><img src="${uri(ctx, f.asset)}">${cap}</div>`;
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="gal" style="grid-template-columns:repeat(${figs.length > 1 ? 2 : 1},1fr)">${cells}</div></div>`;
};
var h_numbered = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 5).map((t, i) => `<div class="nrow"><div class="nbig">${pad2(i + 1)}</div><div class="ntxt"${ed(ctx, `bullets.${i}`)}>${esc(t)}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="nlist">${rows}</div></div>`;
};
var h_split = (sl, ctx) => {
  const sub = sl.subtitle ? `<div class="spl-sub"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : "";
  return `<div class="split"><div class="spl-l"><div class="spl-t"${ed(ctx, "title")}>${esc(sl.title)}</div>${sub}</div><div class="spl-r">${bullets(sl.bullets, ctx)}</div></div>` + pgno(ctx);
};
var h_feature = (sl, ctx) => {
  const cs = withTitle(sl, 4);
  if (cs.length < 2) return h_content(sl, ctx);
  const cells = cs.map((c, i) => {
    const line = (c.bullets || [""])[0];
    const ln = line ? `<div class="ft-l"${ed(ctx, `columns.${i}.bullets.0`)}>${esc(line)}</div>` : "";
    return `<div class="ft"><div class="ft-ic" style="background:${cols4[i % 4]}">${i + 1}</div><div class="ft-t"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div>${ln}</div>`;
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="feat" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`;
};
var h_proscons = (sl, ctx) => {
  const cs = withAny(sl, 2);
  if (cs.length < 2) return h_content(sl, ctx);
  const cfg = [["#0E9F6E", "\u2713"], ["#C70036", "\u2717"]];
  const cells = cs.map((c, i) => {
    const [col, mark] = cfg[i];
    return `<div class="pc" style="border-top:5px solid ${col}"><div class="pc-h"><span class="pc-m" style="background:${col}">${mark}</span><span style="color:${col}"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</span></div>` + bullets(c.bullets, ctx, `columns.${i}.bullets`) + `</div>`;
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="pcwrap">${cells}</div></div>`;
};
var h_spotlight = (sl, ctx) => chrome(sl, ctx) + `<div class="body"><div class="spot"><div class="spot-ic">\u{1F4A1}</div><div class="spot-body">${bullets(sl.bullets, ctx)}</div></div></div>`;
var h_vtimeline = (sl, ctx) => {
  const rows = nonEmpty(sl.bullets).slice(0, 5).map((t, i) => `<div class="vt-item"><div class="vt-dot">${i + 1}</div><div class="vt-txt"${ed(ctx, `bullets.${i}`)}>${esc(stripStep(t))}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="vtl">${rows}</div></div>`;
};
var h_twocol = (sl, ctx) => {
  if (nonEmpty(sl.bullets).length < 3) return h_content(sl, ctx);
  return chrome(sl, ctx) + `<div class="body twocol">${bullets(sl.bullets, ctx)}</div>`;
};
var h_comparetable = (sl, ctx) => {
  const cs = withAny(sl, 2);
  if (cs.length < 2) return h_content(sl, ctx);
  const a = cs[0].bullets || [], b = cs[1].bullets || [];
  const head = `<tr><th${ed(ctx, "columns.0.title")}>${esc(cs[0].title)}</th><th${ed(ctx, "columns.1.title")}>${esc(cs[1].title)}</th></tr>`;
  let body = "";
  for (let r = 0; r < Math.max(a.length, b.length); r++) {
    body += `<tr><td${ed(ctx, `columns.0.bullets.${r}`)}>${esc(a[r] ?? "")}</td><td${ed(ctx, `columns.1.bullets.${r}`)}>${esc(b[r] ?? "")}</td></tr>`;
  }
  return chrome(sl, ctx) + `<div class="body"><table class="cmptbl">${head}${body}</table></div>`;
};
var h_kpirow = (sl, ctx) => {
  const cs = withTitle(sl, 4);
  if (cs.length < 2) return h_content(sl, ctx);
  const cells = cs.map((c, i) => `<div class="kpi" style="--sl-accent:${cols4[i % 4]}"><div class="kpi-v"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div><div class="kpi-bar"></div><div class="kpi-l"${ed(ctx, `columns.${i}.bullets.0`)}>${esc((c.bullets || [""])[0])}</div></div>`).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="kpirow" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`;
};
var h_imageside = (side) => (sl, ctx) => {
  const f = sl.image || (sl.images || [])[0];
  const src = uri(ctx, f?.asset);
  if (!src) return h_content(sl, ctx);
  const cap = f?.title ? `<div class="fcap"${ed(ctx, "image.title")}>${esc(f.title)}</div>` : "";
  const pic = `<div class="fig"><img src="${src}">${cap}</div>`;
  const txt = `<div>${bullets(sl.bullets, ctx)}</div>`;
  return chrome(sl, ctx) + `<div class="body"><div class="imgside ${side === "l" ? "left" : "right"}">` + (side === "l" ? pic + txt : txt + pic) + `</div></div>`;
};
var h_quoteauthor = (sl, ctx) => {
  const msg = sl.title || nonEmpty(sl.bullets)[0] || "";
  const src = uri(ctx, (sl.image || (sl.images || [])[0])?.asset);
  const av = src ? `<img class="qav" src="${src}">` : "";
  const by = sl.subtitle ? `<div class="qby"${ed(ctx, "subtitle")}>${esc(sl.subtitle)}</div>` : "";
  const role = sl.caption ? `<div class="qrole"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : "";
  return `<div class="rail"></div><div class="qmark">&ldquo;</div><div class="qmsg"${ed(ctx, "title")}>${esc(msg)}</div><div class="qauth">${av}<div>${by}${role}</div></div>` + pgno(ctx, ' style="color:var(--sl-blue-border)"');
};
var AGENDA_MARK = /^\s*>\s*/;
var h_agenda = (sl, ctx) => {
  const raw = nonEmpty(sl.bullets).slice(0, 7);
  let cur = raw.findIndex((t) => AGENDA_MARK.test(t));
  if (cur < 0) cur = 0;
  const rows = raw.map((t, i) => {
    const st = i < cur ? "done" : i === cur ? "now" : "next";
    const mark = i < cur ? "\u2713" : pad2(i + 1);
    return `<div class="ag-it ${st}"><div class="ag-n">${mark}</div><div class="ag-t"${ed(ctx, `bullets.${i}`)}>${esc(t.replace(AGENDA_MARK, ""))}</div></div>`;
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="agenda">${rows}</div></div>`;
};
var h_compare3 = (sl, ctx) => {
  const cs = withAny(sl, 3);
  if (cs.length < 2) return h_content(sl, ctx);
  const cells = cs.map((c, i) => {
    const a = cols3[i % 3];
    return `<div class="c3"><div class="c3-h" style="background:${a}"${ed(ctx, `columns.${i}.title`)}>${esc(c.title)}</div><div class="c3-b">` + bullets(c.bullets, ctx, `columns.${i}.bullets`) + `</div></div>`;
  }).join("");
  return chrome(sl, ctx) + `<div class="body"><div class="c3row" style="grid-template-columns:repeat(${cs.length},1fr)">${cells}</div></div>`;
};
var h_blank = (sl, ctx) => chrome(sl, ctx) + `<div class="body blankbody">${bullets(sl.bullets, ctx)}</div>`;
var h_tablewide = (sl, ctx) => {
  const rows = (sl.table || []).map((r) => r.map((c) => String(c ?? "")));
  if (!rows.length) return h_content(sl, ctx);
  const nc = Math.max(...rows.map((r) => r.length));
  const body = rows.map((row, r) => {
    const cells = row.map((v, c) => {
      const tag = r === 0 ? "th" : "td";
      const head = c === 0 ? ' class="tw-h"' : "";
      const span = c === row.length - 1 && row.length < nc ? ` colspan="${nc - row.length + 1}"` : "";
      return `<${tag}${head}${span}${ed(ctx, `table.${r}.${c}`)}>${esc(v)}</${tag}>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
  const cap = sl.caption ? `<div class="tw-cap"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : "";
  return chrome(sl, ctx) + `<div class="body twwrap"><table class="twtbl" style="--tw-n:${nc}">${body}</table>${cap}</div>`;
};
var h_defcard = (sl, ctx) => {
  const bs = nonEmpty(sl.bullets);
  const total = bs.reduce((n, b) => n + b.length, 0);
  const size = total > 700 ? "s" : total > 380 ? "m" : "l";
  const paras = bs.map((b, i) => `<p class="dc-p"${ed(ctx, `bullets.${i}`)}>${esc(b)}</p>`).join("");
  const src = sl.caption ? `<div class="dc-src"${ed(ctx, "caption")}>${esc(sl.caption)}</div>` : "";
  return chrome(sl, ctx) + `<div class="body"><div class="defcard" data-sz="${size}">${paras}${src}</div></div>`;
};
var h_formulasteps = (sl, ctx) => {
  const src = sl.formulaImage?.startsWith("data:") ? sl.formulaImage : uri(ctx, sl.formulaImage);
  const raw = String(sl.formula || "");
  const looksTex = /\\[a-zA-Z]{2,}|\{|\}/.test(raw);
  const head = src ? `<img src="${src}">` : `<div class="fs-eq${looksTex ? " ftx-tex" : ""}">${esc(looksTex ? texToText(raw) : raw)}</div>`;
  const steps = nonEmpty(sl.bullets).slice(0, 5).map((b, i) => `<li><span class="fs-n">${i + 1}</span><span class="fs-t"${ed(ctx, `bullets.${i}`)}>${esc(stripStep(b))}</span></li>`).join("");
  return chrome(sl, ctx) + `<div class="body fswrap"><div class="fsbox">${head}</div><ol class="fsteps">${steps}</ol></div>`;
};
var BUILDERS = {
  tablewide: h_tablewide,
  defcard: h_defcard,
  formulasteps: h_formulasteps,
  kpirow: h_kpirow,
  imageleft: h_imageside("l"),
  imageright: h_imageside("r"),
  quoteauthor: h_quoteauthor,
  agenda: h_agenda,
  compare3: h_compare3,
  blank: h_blank,
  goals: h_goals,
  content: h_content,
  cards: h_cards,
  three: h_three,
  metrics: h_metrics,
  timeline: h_timeline,
  toc: h_toc,
  steps: h_steps,
  bignum: h_bignum,
  pyramid: h_pyramid,
  funnel: h_funnel,
  checklist: h_checklist,
  quadrant: h_quadrant,
  arrow: h_arrow,
  hero: h_hero,
  gallery: h_gallery,
  numbered: h_numbered,
  split: h_split,
  feature: h_feature,
  proscons: h_proscons,
  spotlight: h_spotlight,
  vtimeline: h_vtimeline,
  twocol: h_twocol,
  comparetable: h_comparetable,
  define: h_acard("var(--sl-navy)"),
  example: h_acard("var(--sl-green)"),
  remember: h_acard("var(--sl-gold)"),
  compare: h_three,
  formula: h_formula,
  figure: h_figure,
  table: h_table,
  note: h_note,
  question: h_question,
  statement: h_statement,
  quote: h_quote,
  section: h_section
};
var HERO_CLASS = {
  statement: "hero dots",
  quote: "dk-dark",
  section: "dk-dark",
  hero: "cover",
  split: "split",
  quoteauthor: "dk-dark"
};

// src/themes.ts
var THEMES = [
  {
    key: "navy-gold",
    label: "Navy \xB7 V\xE0ng",
    dark: false,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 620px at 82% -12%,#eef3fd,#ffffff 62%)", "bg2": "linear-gradient(160deg,#f6f8fc,#eef2fb)", "ink": "#1C274C", "navy": "#2B4182", "navy2": "#0F2977", "gold": "#FFB000", "blue": "#2684FC", "blue-pale": "#8FA9E8", "blue-border": "#BEDBFF", "blue-deep": "#1C398E", "blue-tint": "#EEF6FF", "green": "#0E9F6E", "muted": "#6B7280", "border": "#E6E9F0", "card": "#ffffff", "rail": "#2B4182", "dot": "#C7D8Fb", "amber-bg": "#FFF7E6", "amber-bd": "#FFE2A8" }
  },
  {
    key: "blue-green",
    label: "Xanh l\u1EE5c h\u1ECDc thu\u1EADt",
    dark: false,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 620px at 82% -12%,#e6f7f2,#ffffff 62%)", "bg2": "linear-gradient(160deg,#eefaf6,#e3f3ee)", "ink": "#0F2E29", "navy": "#0B6E5A", "navy2": "#064E45", "gold": "#12B886", "blue": "#0CA678", "blue-pale": "#8FD3C2", "blue-border": "#B2E5D8", "blue-deep": "#0B5A48", "blue-tint": "#E9F8F3", "green": "#0B7285", "muted": "#5C6B68", "border": "#DCEDE8", "card": "#ffffff", "rail": "#0B6E5A", "dot": "#BEE7DB", "amber-bg": "#FFF4E6", "amber-bd": "#FFDFB0" }
  },
  {
    key: "cream-editorial",
    label: "Kem c\u1ED5 \u0111i\u1EC3n",
    dark: false,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 620px at 82% -12%,#f7f0e6,#FAF7F2 60%)", "bg2": "linear-gradient(160deg,#faf6ef,#f3ece0)", "ink": "#2A2118", "navy": "#3A2E22", "navy2": "#241C14", "gold": "#C2410C", "blue": "#B45309", "blue-pale": "#D9BFA6", "blue-border": "#EAD9C4", "blue-deep": "#7C3A12", "blue-tint": "#F6ECE0", "green": "#4D7C0F", "muted": "#7A6C5A", "border": "#E7DCCB", "card": "#FFFDF9", "rail": "#3A2E22", "dot": "#E3D2BC", "amber-bg": "#FBF1E2", "amber-bd": "#EAD3B4", "font-display": 'Georgia,"DejaVu Serif","Liberation Serif","Times New Roman",serif' }
  },
  {
    key: "dark-modern",
    label: "T\u1ED1i hi\u1EC7n \u0111\u1EA1i",
    dark: true,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 700px at 78% -10%,#1b2440,#0f1526 62%)", "bg2": "linear-gradient(160deg,#141b30,#0f1424)", "ink": "#E6ECF7", "navy": "#EAF0FF", "navy2": "#0B1120", "gold": "#FBBF24", "blue": "#60A5FA", "blue-pale": "#5A6B93", "blue-border": "#324063", "blue-deep": "#93C5FD", "blue-tint": "#1B2540", "green": "#34D399", "muted": "#9AA6C0", "border": "#28324f", "card": "#161d33", "rail": "#FBBF24", "dot": "#33406a", "amber-bg": "#2A2410", "amber-bd": "#4A3F17" }
  },
  {
    key: "purple-tech",
    label: "T\xEDm c\xF4ng ngh\u1EC7",
    dark: false,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1100px 640px at 80% -12%,#efeafe,#ffffff 62%)", "bg2": "linear-gradient(160deg,#f2eefe,#eae3fb)", "ink": "#241C3A", "navy": "#5B3FC4", "navy2": "#3B2A86", "gold": "#12B886", "blue": "#7C5CFC", "blue-pale": "#B9A6F2", "blue-border": "#DCD0FB", "blue-deep": "#4B32A8", "blue-tint": "#F2EEFE", "green": "#0CA678", "muted": "#6B6480", "border": "#E7E1F5", "card": "#ffffff", "rail": "#5B3FC4", "dot": "#D8CBF7", "amber-bg": "#F4EEFE", "amber-bd": "#DCCFF7" }
  },
  {
    key: "black-gold",
    label: "\u0110en \xB7 V\xE0ng",
    dark: true,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 700px at 78% -10%,#242017,#141109 64%)", "bg2": "linear-gradient(160deg,#1c1810,#12100a)", "ink": "#F3ECD8", "navy": "#F7E7B0", "navy2": "#0E0C07", "gold": "#E7B008", "blue": "#8AB4D8", "blue-pale": "#7A6A3E", "blue-border": "#4A3F1E", "blue-deep": "#F1D579", "blue-tint": "#241E10", "green": "#C9A227", "muted": "#B6A882", "border": "#3A3117", "card": "#1c1810", "rail": "#E7B008", "dot": "#4A3F1E", "amber-bg": "#241E10", "amber-bd": "#4A3F1E" }
  },
  {
    key: "deep-blue",
    label: "Xanh bi\u1EC3n t\u1EA1p ch\xED",
    dark: true,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 720px at 78% -10%,#122a63,#0a1738 64%)", "bg2": "linear-gradient(160deg,#0f2352,#0a1838)", "ink": "#E8EEFB", "navy": "#EAF1FF", "navy2": "#081026", "gold": "#54C7EC", "blue": "#5B9DF9", "blue-pale": "#5C74A8", "blue-border": "#2C3E6E", "blue-deep": "#A7C6FF", "blue-tint": "#14264f", "green": "#3DD7C0", "muted": "#9FB0D4", "border": "#243761", "card": "#122a5c", "rail": "#54C7EC", "dot": "#2C3E6E", "amber-bg": "#242010", "amber-bd": "#4A3F1E", "font-display": 'Georgia,"DejaVu Serif","Liberation Serif","Times New Roman",serif' }
  },
  {
    key: "light-neu",
    label: "Xanh nh\u1EB9",
    dark: false,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 620px at 82% -12%,#eef1f7,#f7f9fc 62%)", "bg2": "linear-gradient(160deg,#f2f5fa,#e9edf5)", "ink": "#28304A", "navy": "#3A4A72", "navy2": "#222A44", "gold": "#E0A800", "blue": "#5B8DEF", "blue-pale": "#A9C0F0", "blue-border": "#CDD9F2", "blue-deep": "#3A5FB0", "blue-tint": "#EEF3FD", "green": "#46B083", "muted": "#6B7488", "border": "#E3E8F2", "card": "#ffffff", "rail": "#5B8DEF", "dot": "#CDD9F2", "amber-bg": "#EEF3FD", "amber-bd": "#CDD9F2" }
  },
  {
    key: "coral-warm",
    label: "Cam san h\xF4",
    dark: false,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 620px at 82% -12%,#fdeee9,#fffaf8 62%)", "bg2": "linear-gradient(160deg,#fdf0ec,#f9e6df)", "ink": "#3A241F", "navy": "#7A3B2E", "navy2": "#3A1C15", "gold": "#E8503A", "blue": "#2E8B8B", "blue-pale": "#F0A99B", "blue-border": "#F5D3CA", "blue-deep": "#B83A28", "blue-tint": "#FDEFEB", "green": "#46B083", "muted": "#7A6A63", "border": "#F0E2DB", "card": "#FFFDFB", "rail": "#E8503A", "dot": "#F5D3CA", "amber-bg": "#FDEFEB", "amber-bd": "#F5D3CA" }
  },
  {
    key: "emerald-fresh",
    label: "Ng\u1ECDc l\u1EE5c b\u1EA3o",
    dark: false,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 620px at 82% -12%,#e6f6f0,#f7fdfb 62%)", "bg2": "linear-gradient(160deg,#eefaf5,#e3f4ee)", "ink": "#173A30", "navy": "#0F6E52", "navy2": "#0A4A38", "gold": "#12B886", "blue": "#0CA678", "blue-pale": "#8FD3C0", "blue-border": "#B8E6D8", "blue-deep": "#0B7A5C", "blue-tint": "#E9F8F2", "green": "#0B8F6E", "muted": "#5C6B64", "border": "#DCEEE7", "card": "#ffffff", "rail": "#12B886", "dot": "#BFE6DA", "amber-bg": "#EEF9F4", "amber-bd": "#BFE6DA" }
  },
  {
    key: "slate-pro",
    label: "X\xE1m th\xE9p",
    dark: false,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 620px at 82% -12%,#eef1f5,#f8fafc 62%)", "bg2": "linear-gradient(160deg,#eef1f6,#e4e9f0)", "ink": "#1F2937", "navy": "#334155", "navy2": "#1E293B", "gold": "#D97706", "blue": "#0EA5E9", "blue-pale": "#93C5E8", "blue-border": "#CBD8E6", "blue-deep": "#0369A1", "blue-tint": "#EEF6FC", "green": "#059669", "muted": "#64748B", "border": "#E2E8F0", "card": "#ffffff", "rail": "#334155", "dot": "#CBD8E6", "amber-bg": "#FEF6E6", "amber-bd": "#F5E2B8" }
  },
  {
    key: "rose-elegant",
    label: "H\u1ED3ng thanh l\u1ECBch",
    dark: false,
    tokens: { "font": '"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', "bg": "radial-gradient(1200px 620px at 82% -12%,#fbecf3,#fffafd 62%)", "bg2": "linear-gradient(160deg,#faedf3,#f4e0ea)", "ink": "#3A1F2E", "navy": "#7A2E56", "navy2": "#4A1C34", "gold": "#E0518A", "blue": "#C2185B", "blue-pale": "#EAA3C2", "blue-border": "#F2CFDF", "blue-deep": "#A01050", "blue-tint": "#FBEEF4", "green": "#0E9F6E", "muted": "#7A6470", "border": "#F0DCE6", "card": "#ffffff", "rail": "#C2185B", "dot": "#F2CFDF", "amber-bg": "#FBEEF4", "amber-bd": "#F2CFDF" }
  }
];
var THEME_BY_KEY = Object.fromEntries(THEMES.map((t) => [t.key, t]));
var DEFAULT_THEME = "navy-gold";
function themeCss(name, selector = ":root") {
  const t = THEME_BY_KEY[name] || THEME_BY_KEY[DEFAULT_THEME];
  const body = Object.entries(t.tokens).map(([k, v]) => `--sl-${k}:${v}`).join(";");
  return `${selector}{${body}}`;
}
function applyTheme(el, name) {
  const t = THEME_BY_KEY[name] || THEME_BY_KEY[DEFAULT_THEME];
  for (const [k, v] of Object.entries(t.tokens)) el.style.setProperty(`--sl-${k}`, v);
  el.dataset.theme = t.key;
  el.dataset.dark = t.dark ? "1" : "0";
}

// src/styles/base.css
var base_default = '/* \u2550\u2550 PH\u1EA0M VI \u2014 deck-kit d\xF9ng CHUNG document v\u1EDBi app, n\xEAn KH\xD4NG \u0111\u01B0\u1EE3c khai selector tr\u1EA7n \u2550\u2550\u2550\n   \u0110\xE3 \u0111o trong tr\xECnh duy\u1EC7t th\u1EADt: b\u1EA3n c\u0169 gi\u1EBFt scroll to\xE0n trang app, \u0111\u1ED5i m\xE0u m\u1ECDi <b> c\u1EE7a app,\n   v\xE0 ghi n\u1EC1n t\u1ED1i l\xEAn <body>. Nguy\xEAn nh\xE2n: `html,body{}` + `*{}` l\xE0 selector TR\u1EA6N.\n   `@layer` KH\xD4NG c\u1EE9u \u0111\u01B0\u1EE3c \u2014 layer khai sau lu\xF4n th\u1EAFng, m\xE0 layer c\u1EE7a deck-kit sinh l\xFAc mount\n   n\xEAn lu\xF4n \u0111\u1EE9ng cu\u1ED1i. Ch\u1EC9 c\xF3 PH\u1EA0M VI m\u1EDBi ch\u1EB7n \u0111\u01B0\u1EE3c.\n   `.dk-root` l\xE0 khung deck (mount.ts t\u1EF1 g\u1EAFn). Trang deck \u0110\u1ED8C L\u1EACP t\u1EF1 khai html,body ri\xEAng\n   (deck_shell.py) n\xEAn kh\xF4ng m\u1EA5t g\xEC. */\n.dk-root,.dk-root *{margin:0;padding:0;box-sizing:border-box}\n.dk-root{position:relative;height:100%;overflow:hidden;font-family:var(--sl-font);\n background:radial-gradient(1100px 650px at 50% 26%,#2b303c,#12141b 80%);\n /* H\u1EC7 s\u1ED1 c\u1EE1 ch\u1EEF to\xE0n deck \u2014 GV ch\u1EC9nh \u1EDF menu Hi\u1EC3n th\u1ECB. 1 = nh\u01B0 thi\u1EBFt k\u1EBF g\u1ED1c.\n    Nh\xE2n v\xE0o T\u1EEANG khai b\xE1o `font-size` ch\u1EE9 KH\xD4NG d\xF9ng `transform:scale`/`zoom`:\n    `deck_to_pptx` \u0111\u1ECDc `getBoundingClientRect()` \u0111\u1EC3 \u0111\u1EB7t textbox v\xE0 `getComputedStyle().fontSize`\n    \u0111\u1EC3 l\u1EA5y c\u1EE1 ch\u1EEF \u2014 transform l\xE0m hai th\u1EE9 \u0111\xF3 l\u1EC7ch nhau \u21D2 .pptx \u0111\u1EB7t ch\u1EEF sai ch\u1ED7.\n    Nh\xE2n th\u1EB3ng th\xEC .pptx t\u1EF1 kh\u1EDBp, kh\xF4ng ph\u1EA3i s\u1EEDa m\u1ED9t d\xF2ng Python n\xE0o. */\n --dk-fs:1}\n.stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}\n/* flex:none \u2014 KH\xD4NG cho flex co khung 1280\xD7720 khi panel h\u1EB9p (bug m\xE9o slide th\xE0nh g\u1EA7n vu\xF4ng);\n   fit() s\u1EBD scale \u0111\u1ED3ng \u0111\u1EC1u n\xEAn slide lu\xF4n gi\u1EEF 16:9. */\n.scaler{position:relative;transform-origin:center center;flex:none}\n#scaler>.slide{position:absolute;inset:0;display:none;overflow:hidden;border-radius:14px;\n box-shadow:0 30px 80px rgba(0,0,0,.55),0 3px 12px rgba(0,0,0,.4);\n background:var(--sl-bg);color:var(--sl-ink);font-family:var(--sl-font)}\n#scaler>.slide.active{display:block;animation:sf .32s ease}\n@keyframes sf{from{opacity:0;transform:scale(.99)}to{opacity:1;transform:none}}\n/* Hi\u1EC7u \u1EE9ng chuy\u1EC3n slide (data-tr tr\xEAn #scaler) \u2014 fade l\xE0 m\u1EB7c \u0111\u1ECBnh (sf) */\n#scaler[data-tr="none"]>.slide.active{animation:none}\n#scaler[data-tr="slide"]>.slide.active{animation:trSlide .38s cubic-bezier(.22,.61,.36,1)}\n@keyframes trSlide{from{opacity:0;transform:translateX(48px)}to{opacity:1;transform:none}}\n#scaler[data-tr="slideup"]>.slide.active{animation:trUp .38s cubic-bezier(.22,.61,.36,1)}\n@keyframes trUp{from{opacity:0;transform:translateY(44px)}to{opacity:1;transform:none}}\n#scaler[data-tr="zoom"]>.slide.active{animation:trZoom .34s ease}\n@keyframes trZoom{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}\n#scaler[data-tr="flip"]>.slide.active{animation:trFlip .5s ease}\n@keyframes trFlip{from{opacity:0;transform:perspective(1200px) rotateY(30deg)}to{opacity:1;transform:none}}\n\n/* \u2550\u2550 THANG THI\u1EBET K\u1EBE cho SLIDE \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   Tr\u01B0\u1EDBc \u0111\xE2y 9 gi\xE1 tr\u1ECB box-shadow m\u1ED9t-l\u1EA7n v\xE0 8 b\xE1n k\xEDnh, g\xE1n ng\u1EABu nhi\xEAn: hai th\u1EBB c\u1EA1nh nhau\n   trong c\xF9ng m\u1ED9t deck c\xF3 \u0111\u1ED9 n\u1ED5i kh\xE1c nhau m\xE0 kh\xF4ng v\xEC l\xFD do g\xEC \u2014 nh\xECn ra ngay l\xE0 c\u1EA9u th\u1EA3 d\xF9\n   kh\xF4ng gi\xE1 tr\u1ECB n\xE0o sai.\n\n   C\u1ED0 \xDD t\xE1ch kh\u1ECFi `--dk-*` trong `tokens.css` (thang c\u1EE7a khung TR\xCCNH S\u1EECA): g\u1ED9p hai h\u1EC7 l\u1EA1i l\xE0\n   bu\u1ED9c giao di\u1EC7n slide ph\u1EA3i \u0111\u1ED5i theo giao di\u1EC7n tr\xECnh s\u1EEDa. */\n/* `--pad` l\u1EA5y t\u1EEB `.dk-root` n\u1EBFu c\xF3 (menu Hi\u1EC3n th\u1ECB \u0111\u1EB7t), kh\xF4ng th\xEC 64px g\u1ED1c.\n   KH\xD4NG khai th\u1EB3ng `--pad:64px` \u1EDF \u0111\xE2y: bi\u1EBFn khai tr\xEAn ph\u1EA7n t\u1EED con lu\xF4n th\u1EAFng bi\u1EBFn k\u1EBF th\u1EEBa,\n   n\xEAn m\u1EADt \u0111\u1ED9 ch\u1ECDn \u1EDF khung deck s\u1EBD v\xF4 t\xE1c d\u1EE5ng \u2014 \u0111\xFAng c\xE1i b\u1EABy \u0111\xE3 d\xEDnh \u1EDF `.spl-r`. */\n.slide{--pad:var(--dk-pad,64px);\n --sl-sh-sm:0 8px 24px rgba(20,30,70,.07);      /* th\u1EBB nh\u1ECF, danh s\xE1ch */\n --sl-sh-md:0 12px 34px rgba(20,30,70,.10);     /* th\u1EBB n\u1ED9i dung ch\xEDnh */\n --sl-sh-lg:0 16px 44px rgba(20,30,70,.10);     /* kh\u1ED1i nh\u1EA5n, th\u1EBB s\u1ED1 */\n --sl-r-sm:14px; --sl-r-md:18px; --sl-r-lg:22px}\n.slide.chrome::before{content:"";position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--sl-rail)}\n.slide.dots::after{content:"";position:absolute;right:56px;bottom:52px;width:150px;height:118px;\n background-image:radial-gradient(circle,var(--sl-dot) 2px,transparent 2px);background-size:20px 20px;opacity:.7}\n\n.hd{position:absolute;left:var(--pad);top:44px;right:var(--pad)}\n.kick{font-size:calc(15px * var(--dk-fs,1));font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--sl-gold)}\n/* `--sl-font-display` ch\u1EC9 c\xF3 \u1EDF theme "t\u1EA1p ch\xED"/"c\u1ED5 \u0111i\u1EC3n"; theme kh\xE1c kh\xF4ng khai th\xEC\n   `var(\u2026, var(--sl-font))` t\u1EF1 v\u1EC1 font th\xE2n \u2014 kh\xF4ng c\u1EA7n khai l\u1EA1i \u1EDF 10 theme c\xF2n l\u1EA1i.\n   CH\u1EC8 \xE1p cho TI\xCAU \u0110\u1EC0: ch\u1EEF th\xE2n gi\u1EEF sans \u0111\u1EC3 \u0111\u1ECDc r\xF5 tr\xEAn m\xE1y chi\u1EBFu. */\n.ttl{font-family:var(--sl-font-display,var(--sl-font));\n font-size:calc(var(--ttl-size,38px) * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);line-height:1.08;margin-top:6px;letter-spacing:-.01em;\n display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}\n/* Ti\xEAu \u0111\u1EC1 d\xE0i ph\u1EA3i \u0111\u01B0\u1EE3c CH\u1EEAA CH\u1ED6, kh\xF4ng th\xEC n\xF3 \u0111\xE8 l\xEAn n\u1ED9i dung (l\u1ED7i th\u1EA5y r\xF5 \u1EDF table/question/cards).\n   B\u1EADc t\xEDnh theo s\u1ED1 k\xFD t\u1EF1 \u2014 c\u1EA3 renderer Python l\u1EABn TS \u0111\u1EC1u suy ra \u0111\u01B0\u1EE3c, kh\xF4ng c\u1EA7n \u0111o b\u1EB1ng JS. */\n.slide[data-tt="2"]{--ttl-size:33px;--rule-y:158px}\n.slide[data-tt="3"]{--ttl-size:28px;--rule-y:190px}\n.rule{position:absolute;left:var(--pad);top:var(--rule-y,120px);height:2px;width:calc(100% - 2*var(--pad));background:var(--sl-border)}\n.rule::before{content:"";position:absolute;left:0;top:-1px;width:96px;height:4px;background:var(--sl-gold)}\n.pgno{position:absolute;right:var(--pad);bottom:30px;font-size:calc(13px * var(--dk-fs,1));color:var(--sl-muted);font-variant-numeric:tabular-nums}\n.foot{position:absolute;left:var(--pad);bottom:30px;font-size:calc(12px * var(--dk-fs,1));color:var(--sl-muted);max-width:70%;\n white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n\n/* `overflow:hidden` l\xE0 CH\u1ED0T CH\u1EB6N cu\u1ED1i: n\u1ED9i dung qu\xE1 d\xE0i th\xEC b\u1ECB c\u1EAFt g\u1ECDn trong khung slide,\n   KH\xD4NG \u0111\u01B0\u1EE3c tr\xE0n \u0111\xE8 l\xEAn ch\xE2n trang/s\u1ED1 trang hay l\xF2i ra ngo\xE0i m\xE9p (l\u1ED7i n\xE0y \u1EA3nh ch\u1EE5p so-pixel\n   kh\xF4ng b\u1EAFt \u0111\u01B0\u1EE3c v\xEC c\u1EA3 hai renderer c\xF9ng tr\xE0n gi\u1ED1ng nhau). C\xE1c b\u1EADc `--bul-size`/`--tt` b\xEAn\n   d\u01B0\u1EDBi lo ph\u1EA7n thu nh\u1ECF cho v\u1EEBa; \u0111\xE2y ch\u1EC9 ch\u1EB7n tr\u01B0\u1EDDng h\u1EE3p thu h\u1EBFt c\u1EE1 v\u1EABn d\xE0i. */\n.body{position:absolute;left:var(--pad);top:calc(var(--rule-y,120px) + 32px);right:var(--pad);bottom:80px;\n overflow:hidden}\nul.bul{list-style:none}\nul.bul li{position:relative;padding-left:30px;font-size:calc(var(--bul-size,26px) * var(--dk-fs,1));line-height:1.4;color:var(--sl-ink);margin:var(--bul-gap,14px) 0}\nul.bul li::before{content:"";position:absolute;left:2px;top:.62em;width:9px;height:9px;border-radius:50%;background:var(--sl-blue)}\n/* Nhi\u1EC1u \xFD th\xEC thu nh\u1ECF d\u1EA7n cho v\u1EEBa khung \u2014 tr\u01B0\u1EDBc \u0111\xE2y \xFD th\u1EE9 7\u20138 tr\xE0n xu\u1ED1ng \u0111\xE8 ch\xE2n trang.\n   `data-nb` \u0111\xE3 c\xF3 s\u1EB5n tr\xEAn m\u1ED7i <section> n\xEAn kh\xF4ng ph\u1EA3i \u0111\u1ED5i renderer. */\n.slide[data-nb="6"]{--bul-size:23px;--bul-gap:11px}\n.slide[data-nb="7"]{--bul-size:21px;--bul-gap:9px}\n.slide[data-nb="8"]{--bul-size:20px;--bul-gap:8px}\n.slide[data-nb="9"],.slide[data-nb="10"],.slide[data-nb="11"],.slide[data-nb="12"]{--bul-size:19px;--bul-gap:6px}\n/* split c\xF3 n\u1EEDa slide b\xEAn ph\u1EA3i r\u1ED9ng r\xE3i h\u01A1n n\xEAn ch\u1EEF to h\u01A1n m\u1EB7c \u0111\u1ECBnh \u2014 nh\u01B0ng CH\u1EC8 khi \xEDt \xFD;\n   t\u1EEB 6 \xFD tr\u1EDF l\xEAn n\xF3 theo thang chung \u1EDF tr\xEAn \u0111\u1EC3 kh\xF4ng tr\xE0n. */\n.split{--bul-size:22px}\n.slide[data-nb="6"] .split,.slide[data-nb="7"] .split,.slide[data-nb="8"] .split,\n.slide[data-nb="9"] .split,.slide[data-nb="10"] .split,\n.slide[data-nb="11"] .split,.slide[data-nb="12"] .split{--bul-size:inherit}\n.slide b,.slide strong{color:var(--sl-navy);font-weight:800}\n\n/* table: b\u1EA3ng d\u1EEF li\u1EC7u nguy\xEAn v\u0103n t\u1EEB gi\xE1o \xE1n. Tr\u01B0\u1EDBc \u0111\xE2y KH\xD4NG c\xF3 CSS n\xE0o \u2192 b\u1EA3ng co d\xFAm \u1EDF g\xF3c. */\n.dtbl{width:100%;border-collapse:collapse;font-size:calc(20px * var(--dk-fs,1));table-layout:fixed}\n.dtbl th,.dtbl td{border:1px solid var(--sl-border);padding:12px 16px;text-align:left;color:var(--sl-ink);\n vertical-align:top;overflow-wrap:anywhere}\n.dtbl th{background:var(--sl-navy);color:#fff;font-weight:800;font-size:calc(21px * var(--dk-fs,1))}\n.dtbl tr:nth-child(even) td{background:var(--sl-bg2)}\n\n/* content 2 c\u1ED9t (ch\u1EEF + \u1EA3nh) */\n.two{display:grid;grid-template-columns:1fr 460px;gap:40px;height:100%}\n.two .fig{align-self:center;background:var(--sl-card);border:1px solid var(--sl-border);border-radius:18px;\n padding:16px;box-shadow:var(--sl-sh-md)}\n.two .fig img{width:100%;height:auto;display:block;border-radius:10px}\n.fcap{margin-top:10px;font-size:calc(15px * var(--dk-fs,1));color:var(--sl-muted);text-align:center;font-style:italic}\n\n/* cards: l\u01B0\u1EDBi th\u1EBB s\u1ED1 l\u1EDBn */\n.grid{display:grid;gap:26px 30px;height:100%}\n.card-n{font-size:calc(46px * var(--dk-fs,1));font-weight:800;color:var(--sl-blue-pale);line-height:1}\n.card-n+.bar{width:96px;height:4px;background:var(--sl-gold);margin:10px 0 12px}\n.card-t{font-size:calc(22px * var(--dk-fs,1));line-height:1.32;color:var(--sl-ink)}\n\n/* three: 3 th\u1EBB */\n.cols{display:grid;gap:24px;height:100%}\n.col{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:18px;padding:26px 24px;\n box-shadow:var(--sl-sh-md);position:relative;overflow:hidden}\n.col .top{position:absolute;left:0;top:0;right:0;height:8px}\n.col .cn{font-size:calc(30px * var(--dk-fs,1));font-weight:800;margin-top:8px}\n.col .ch{font-size:calc(22px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);margin:8px 0 14px}\n.col ul.bul li{font-size:calc(21px * var(--dk-fs,1));margin:11px 0}\n\n/* metrics: th\u1EBB s\u1ED1 */\n.mrow{display:grid;gap:24px;align-items:stretch;height:100%;padding:20px 0}\n.metric{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:20px;padding:30px 20px;\n text-align:center;box-shadow:var(--sl-sh-lg);position:relative;overflow:hidden;\n display:flex;flex-direction:column;justify-content:center}\n.metric .top{position:absolute;left:0;top:0;right:0;height:8px;background:var(--sl-gold)}\n.metric .val{font-size:calc(58px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);line-height:1.05}\n.metric .lab{font-size:calc(19px * var(--dk-fs,1));color:var(--sl-muted);margin-top:14px;line-height:1.3}\n\n/* timeline ngang */\n.tl{position:relative;height:100%;display:flex;align-items:center}\n.tl .line{position:absolute;left:0;right:0;top:50%;height:3px;background:var(--sl-border)}\n.tl .node{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;text-align:center}\n.tl .dot{width:56px;height:56px;border-radius:50%;background:var(--sl-navy);color:#fff;display:flex;\n align-items:center;justify-content:center;font-size:calc(22px * var(--dk-fs,1));font-weight:800;z-index:2;box-shadow:0 8px 20px rgba(20,30,70,.25)}\n.tl .lab{position:absolute;width:88%;font-size:calc(18px * var(--dk-fs,1));line-height:1.3;color:var(--sl-ink)}\n.tl .above .lab{bottom:64px}.tl .below .lab{top:64px}\n\n/* toc: danh s\xE1ch \u0111\xE1nh s\u1ED1 */\n.toc{display:flex;flex-direction:column;gap:16px;height:100%;justify-content:center}\n.toc .it{display:flex;align-items:center;gap:22px;background:var(--sl-card);border:1px solid var(--sl-border);\n border-radius:14px;padding:16px 22px;box-shadow:var(--sl-sh-sm);position:relative}\n.toc .it::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--sl-gold);border-radius:14px 0 0 14px}\n.toc .n{font-size:calc(30px * var(--dk-fs,1));font-weight:800;color:var(--sl-blue-pale);min-width:52px}\n.toc .t{font-size:calc(24px * var(--dk-fs,1));font-weight:700;color:var(--sl-ink)}\n\n/* steps: quy tr\xECnh d\u1ECDc (s\u1ED1 + vi\u1EC7c) */\n.steps{display:flex;flex-direction:column;gap:16px;height:100%;justify-content:center}\n.stp{display:flex;align-items:center;gap:22px;background:var(--sl-card);border:1px solid var(--sl-border);\n border-radius:14px;padding:15px 24px;box-shadow:var(--sl-sh-sm)}\n.stp .sn{flex:none;width:46px;height:46px;border-radius:50%;background:var(--sl-gold);color:var(--sl-navy2);\n font-weight:800;font-size:calc(22px * var(--dk-fs,1));display:flex;align-items:center;justify-content:center}\n.stp .st{font-size:calc(23px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);line-height:1.3}\n\n/* bignum: 1\u20133 con s\u1ED1 hero */\n.bnrow{display:grid;gap:30px;height:100%;align-items:center}\n.bn{text-align:center;background:var(--sl-card);border:1px solid var(--sl-border);border-radius:22px;\n padding:36px 22px;box-shadow:var(--sl-sh-lg)}\n.bnv{font-size:calc(98px * var(--dk-fs,1));font-weight:900;line-height:1;letter-spacing:-.02em}\n.bnl{margin-top:14px;font-size:calc(23px * var(--dk-fs,1));font-weight:600;color:var(--sl-muted);line-height:1.3}\n\n/* pyramid / funnel: t\u1EA7ng b\u1EADc m\xE0u */\n.pyramid,.funnel{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;height:100%}\n.pyr,.fnl{color:#fff;font-weight:700;font-size:calc(22px * var(--dk-fs,1));line-height:1.25;text-align:center;padding:16px 26px;\n border-radius:14px;box-shadow:var(--sl-sh-md);display:flex;align-items:center;justify-content:center;\n max-width:100%;overflow:hidden}\n\n/* checklist: \u2713 trong v\xF2ng tr\xF2n */\n.cklist{display:flex;flex-direction:column;gap:14px;height:100%;justify-content:center}\n.ck{display:flex;align-items:center;gap:18px}\n.ckm{flex:none;width:38px;height:38px;border-radius:50%;background:var(--sl-green);color:#fff;font-weight:800;font-size:calc(20px * var(--dk-fs,1));display:flex;align-items:center;justify-content:center}\n.ckt{font-size:calc(23px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);line-height:1.3}\n\n/* quadrant: ma tr\u1EADn 2\xD72 */\n.quad{display:grid;grid-template-columns:1fr 1fr;gap:20px;height:100%}\n.qd{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:16px;padding:20px 24px;box-shadow:var(--sl-sh-sm);overflow:auto}\n.qdt{font-size:calc(22px * var(--dk-fs,1));font-weight:800;margin-bottom:8px}\n.qd ul.bul li{font-size:calc(18px * var(--dk-fs,1));margin:5px 0}\n\n/* arrow: m\u0169i t\xEAn ngang (chevron) */\n.arrow{display:flex;gap:5px;align-items:stretch;height:100%;padding:44px 0}\n.arw{flex:1;color:#fff;padding:20px 24px 20px 46px;display:flex;flex-direction:column;justify-content:center;overflow:hidden;\n clip-path:polygon(0 0,calc(100% - 26px) 0,100% 50%,calc(100% - 26px) 100%,0 100%,26px 50%)}\n.arw.first{clip-path:polygon(0 0,calc(100% - 26px) 0,100% 50%,calc(100% - 26px) 100%,0 100%);border-radius:12px 0 0 12px;padding-left:28px}\n.arwn{font-size:calc(13px * var(--dk-fs,1));font-weight:800;letter-spacing:.05em;opacity:.9}\n.arwt{font-size:calc(19px * var(--dk-fs,1));font-weight:700;margin-top:6px;line-height:1.25}\n\n/* cover: b\xECa s\xE1ng, ti\xEAu \u0111\u1EC1 r\u1EA5t l\u1EDBn */\n/* `display:flex` CH\u1EC8 khi slide \u0111ang hi\u1EC7n. Tr\u01B0\u1EDBc \u0111\xE2y khai tr\u1EA7n `#scaler>.slide.cover{display:flex}`\n   \u2014 c\xF9ng specificity v\u1EDBi `.slide.active{display:block}` nh\u01B0ng \u0111\u1EE9ng SAU n\xEAn th\u1EAFng, khi\u1EBFn slide\n   `cover` KH\xD4NG \u1EDF v\u1ECB tr\xED \u0111\u1EA7u lu\xF4n hi\u1EC7n \u0111\xE8 l\xEAn slide \u0111ang xem. Ch\u01B0a GV n\xE0o g\u1EB7p (0/71 deck th\u1EADt\n   c\xF3 cover \u1EDF gi\u1EEFa) nh\u01B0ng \u0111\u1ED5i b\u1ED1 c\u1EE5c m\u1ED9t slide th\xE0nh "B\xECa" l\xE0 d\u1EF1ng ra ngay. */\n#scaler>.slide.cover{align-items:center;background:var(--sl-bg2);padding:0 var(--pad)}\n#scaler>.slide.cover.active,.slide.cover{display:flex;align-items:center;background:var(--sl-bg2);padding:0 var(--pad)}\n.cover-in{max-width:960px}\n.cover .hbar{width:74px;height:6px;background:var(--sl-gold);border-radius:3px;margin-bottom:22px}\n.cover .hk{font-size:calc(18px * var(--dk-fs,1));font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--sl-blue)}\n.cover .hbig{font-size:calc(72px * var(--dk-fs,1));line-height:1.05;font-weight:900;color:var(--sl-ink);margin-top:12px;letter-spacing:-.02em}\n.cover .hsub{font-size:calc(26px * var(--dk-fs,1));color:var(--sl-muted);margin-top:22px;line-height:1.35;max-width:760px}\n\n/* gallery: l\u01B0\u1EDBi \u1EA3nh */\n.gal{display:grid;gap:16px;height:100%}\n.gcell{position:relative;border-radius:14px;overflow:hidden;background:var(--sl-muted);border:1px solid var(--sl-border);box-shadow:var(--sl-sh-sm)}\n.gcell img{width:100%;height:100%;object-fit:cover;display:block}\n.gcap{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(transparent,rgba(0,0,0,.6));color:#fff;font-size:calc(14px * var(--dk-fs,1));font-weight:600;padding:14px 12px 8px}\n\n/* numbered: \u0111\xE1nh s\u1ED1 l\u1EDBn */\n.nlist{display:flex;flex-direction:column;gap:16px;height:100%;justify-content:center}\n.nrow{display:flex;align-items:center;gap:24px}\n.nbig{font-size:calc(52px * var(--dk-fs,1));font-weight:900;color:var(--sl-gold);min-width:82px;line-height:1;letter-spacing:-.02em}\n.ntxt{font-size:calc(24px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);line-height:1.3}\n\n/* split: panel m\xE0u tr\xE1i + n\u1ED9i dung ph\u1EA3i (full-bleed) */\n.slide.split{padding:0}\n.split{display:flex;height:100%;width:100%}\n.spl-l{width:42%;background:linear-gradient(155deg,var(--sl-navy),var(--sl-navy2));color:#fff;padding:var(--pad);display:flex;flex-direction:column;justify-content:center}\n.spl-t{font-family:var(--sl-font-display,var(--sl-font));font-size:calc(46px * var(--dk-fs,1));font-weight:900;line-height:1.08}\n.spl-sub{font-size:calc(20px * var(--dk-fs,1));opacity:.85;margin-top:18px;line-height:1.4}\n/* `.spl-r` KH\xD4NG \u0111\u01B0\u1EE3c khai `--bul-size` (d\xF9 \u1EDF khung hay \u1EDF `li`): bi\u1EBFn khai tr\xEAn ph\u1EA7n t\u1EED con\n   lu\xF4n th\u1EAFng bi\u1EBFn k\u1EBF th\u1EEBa t\u1EEB `.slide[data-nb=\u2026]`, n\xEAn thang thu nh\u1ECF theo s\u1ED1 \xFD s\u1EBD v\xF4 t\xE1c d\u1EE5ng\n   v\xE0 split 8-10 \xFD tr\xE0n ra ngo\xE0i. `.spl-r` l\u1EA1i n\u1EB1m NGO\xC0I `.body` n\xEAn c\u0169ng kh\xF4ng c\xF3 ch\u1ED1t\n   `overflow:hidden` c\u1EE7a `.body` \u2014 ph\u1EA3i t\u1EF1 khai.\n   C\u1EE1 m\u1EB7c \u0111\u1ECBnh 22px c\u1EE7a split \u0111\u1EB7t \u1EDF thang `data-nb` ph\xEDa d\u01B0\u1EDBi (b\u1EADc "\xEDt \xFD"). */\n.spl-r{flex:1;padding:var(--pad);display:flex;flex-direction:column;justify-content:center;\n min-height:0;overflow:hidden}\n\n/* feature: th\u1EBB t\xEDnh n\u0103ng l\u1EDBn (v\xF2ng s\u1ED1) */\n.feat{display:grid;gap:22px;height:100%;align-items:center}\n.ft{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:18px;padding:28px 24px;box-shadow:var(--sl-sh-sm);text-align:center}\n.ft-ic{width:56px;height:56px;border-radius:16px;color:#fff;font-size:calc(26px * var(--dk-fs,1));font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}\n.ft-t{font-size:calc(22px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy)}\n.ft-l{font-size:calc(16px * var(--dk-fs,1));color:var(--sl-muted);margin-top:8px;line-height:1.4}\n\n/* proscons: \u01B0u (xanh) / nh\u01B0\u1EE3c (\u0111\u1ECF) */\n.pcwrap{display:grid;grid-template-columns:1fr 1fr;gap:24px;height:100%}\n/* `overflow:hidden` ch\u1EE9 KH\xD4NG `auto`: slide \u0111em \u0111i chi\u1EBFu/ch\u1EE5p \u1EA3nh kh\xF4ng c\xF3 thanh cu\u1ED9n,\n   `auto` ch\u1EC9 khi\u1EBFn ch\u1EEF th\u1EEBa tr\xE0n ra ngo\xE0i th\u1EBB. Anh em `.qd` \u0111\xE3 s\u1EEDa, `.pc` b\u1ECB b\u1ECF s\xF3t. */\n.pc{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:16px;padding:20px 24px;box-shadow:var(--sl-sh-sm);overflow:hidden;min-height:0;display:flex;flex-direction:column}\n.pc ul.bul{min-height:0;overflow:hidden}\n.pc-h{display:flex;align-items:center;gap:11px;font-size:calc(22px * var(--dk-fs,1));font-weight:800;margin-bottom:12px}\n.pc-m{flex:none;width:30px;height:30px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:calc(16px * var(--dk-fs,1))}\n.pc ul.bul li{font-size:calc(19px * var(--dk-fs,1));margin:6px 0}\n\n/* spotlight: h\u1ED9p nh\u1EA5n c\xF3 bi\u1EC3u t\u01B0\u1EE3ng */\n/* KHAI B\xC1O DUY NH\u1EA4T \u2014 tr\u01B0\u1EDBc \u0111\xE2y khai 2 ch\u1ED7 v\u1EDBi tr\u1EE5c ng\u01B0\u1EE3c nhau (`row` \u1EDF \u0111\xE2y,\n   `column` \u1EDF kh\u1ED1i ch\u1ED1ng tr\xE0n) n\xEAn b\u1ED1 c\u1EE5c "bi\u1EC3u t\u01B0\u1EE3ng b\xEAn tr\xE1i ch\u1EEF" ch\u01B0a bao gi\u1EDD ch\u1EA1y.\n   Gi\u1EEF `column` v\xEC \u0111\xF3 l\xE0 b\u1EA3n \u0111ang hi\u1EC3n th\u1ECB v\xE0 m\u1ECDi \u1EA3nh m\u1ED1c test l\u1EA5y theo n\xF3. */\n.spot{display:flex;flex-direction:column;align-items:center;gap:28px;background:var(--sl-amber-bg);border:2px solid var(--sl-amber-bd);border-radius:20px;padding:32px 44px;height:100%;min-height:0;overflow:hidden;box-shadow:var(--sl-sh-lg)}\n.spot-ic{font-size:calc(60px * var(--dk-fs,1));flex:none}\n.spot-body{flex:1}\n.spot-body ul.bul li{font-size:calc(26px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);margin:8px 0;line-height:1.35}\n\n/* vtimeline: m\u1ED1c th\u1EDDi gian d\u1ECDc */\n.vtl{position:relative;padding-left:44px;height:100%;display:flex;flex-direction:column;justify-content:center;gap:18px}\n.vtl::before{content:"";position:absolute;left:18px;top:14px;bottom:14px;width:2px;background:var(--sl-border)}\n.vt-item{display:flex;align-items:center;gap:18px;position:relative}\n.vt-dot{position:absolute;left:-44px;width:37px;height:37px;border-radius:50%;background:var(--sl-gold);color:var(--sl-navy2);font-weight:800;font-size:calc(18px * var(--dk-fs,1));display:flex;align-items:center;justify-content:center;flex:none}\n.vt-txt{font-size:calc(23px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);line-height:1.3}\n\n/* twocol: 2 c\u1ED9t n\u1ED9i dung */\n.body.twocol .bul{column-count:2;column-gap:48px}\n.body.twocol .bul li{break-inside:avoid}\n\n/* comparetable: b\u1EA3ng so s\xE1nh k\u1EBB \xF4 */\n.cmptbl{width:100%;border-collapse:collapse;font-size:calc(20px * var(--dk-fs,1))}\n.cmptbl th,.cmptbl td{border:1px solid var(--sl-border);padding:13px 18px;text-align:left;color:var(--sl-ink)}\n.cmptbl th{background:var(--sl-navy);color:#fff;font-weight:800;font-size:calc(21px * var(--dk-fs,1))}\n.cmptbl tr:nth-child(even) td{background:var(--sl-bg2)}\n\n/* define/example/remember: card vi\u1EC1n accent */\n/* `top` ph\u1EA3i b\xE1m `--rule-y` ch\u1EE9 kh\xF4ng \u0111\xF3ng c\u1EE9ng 152px: ti\xEAu \u0111\u1EC1 3 d\xF2ng \u0111\u1EA9y `--rule-y` l\xEAn\n   190px, th\u1EBB \u0111\u1EE9ng y\xEAn \u1EDF 152px s\u1EBD \u0110\xC8 l\xEAn ti\xEAu \u0111\u1EC1 v\xE0 \u0111\u01B0\u1EDDng k\u1EBB. C\xF4ng th\u1EE9c n\xE0y ra \u0111\xFAng 152px \u1EDF\n   ti\xEAu \u0111\u1EC1 1 d\xF2ng n\xEAn slide th\u01B0\u1EDDng kh\xF4ng \u0111\u1ED5i m\u1ED9t pixel n\xE0o. */\n.acard{position:absolute;left:var(--pad);top:calc(var(--rule-y,120px) + 32px);right:var(--pad);bottom:64px;background:var(--sl-card);\n border-radius:18px;border:1px solid var(--sl-border);padding:34px 40px;box-shadow:var(--sl-sh-lg);overflow:auto}\n.acard.lft{border-left:8px solid var(--sl-accent)}\n\n/* formula */\n.fbox{position:absolute;left:120px;right:120px;top:calc(var(--rule-y,120px) + 120px);min-height:190px;background:var(--sl-card);\n border:1.5px dashed var(--sl-blue-border);border-radius:18px;display:flex;align-items:center;justify-content:center;padding:24px}\n.fbox img{max-width:88%;max-height:150px}\n.fbox .ftx{font-size:calc(38px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);text-align:center;line-height:1.25}\n.fcp2{position:absolute;left:120px;right:120px;top:calc(var(--rule-y,120px) + 350px);text-align:center;color:var(--sl-muted);font-size:calc(16px * var(--dk-fs,1))}\n/* C\xF4ng th\u1EE9c CH\u01AFA render \u0111\u01B0\u1EE3c th\xE0nh \u1EA3nh: hi\u1EC7n ch\u1EEF \u0111\xE3 d\u1ECDn, c\u1EE1 nh\u1ECF h\u01A1n + b\xE1o cho GV bi\u1EBFt\n   \u0111\u1EC3 b\u1EA5m d\xE0n l\u1EA1i. Kh\xF4ng \u0111\xE1nh d\u1EA5u th\xEC GV t\u01B0\u1EDFng c\xF4ng th\u1EE9c v\u1ED1n x\u1EA5u nh\u01B0 v\u1EADy. */\n.fbox .ftx.ftx-tex{font-size:calc(26px * var(--dk-fs,1));font-weight:700;overflow-wrap:anywhere;\n display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}\n.fbox .ftx.ftx-tex::after{content:"c\xF4ng th\u1EE9c ch\u01B0a d\u1EF1ng \u0111\u01B0\u1EE3c \u1EA3nh \u2014 b\u1EA5m D\xE0n l\u1EA1i slide";\n display:block;margin-top:14px;font-size:calc(13px * var(--dk-fs,1));font-weight:600;color:var(--sl-muted)}\n\n/* figure l\u1EDBn */\n.bigfig{position:absolute;left:var(--pad);top:calc(var(--rule-y,120px) + 32px);right:var(--pad);bottom:74px;display:flex;\n align-items:center;justify-content:center;background:var(--sl-card);border-radius:18px;border:1px solid var(--sl-border);overflow:hidden;box-shadow:var(--sl-sh-md)}\n.bigfig img{max-width:100%;max-height:100%;object-fit:contain}\n\n/* full-bleed: statement / quote / section */\n#scaler>.slide.hero,.slide.hero{background:var(--sl-bg2)}\n.hero .k{position:absolute;left:96px;top:150px;font-size:calc(15px * var(--dk-fs,1));font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--sl-gold)}\n.hero .k::after{content:"";display:block;width:120px;height:4px;background:var(--sl-gold);margin-top:12px}\n.hero .msg{position:absolute;left:96px;right:120px;top:210px;font-size:calc(48px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);line-height:1.14;letter-spacing:-.01em}\n.hero .sub{position:absolute;left:96px;right:140px;top:520px;font-size:calc(20px * var(--dk-fs,1));color:var(--sl-muted);line-height:1.35}\n\n/* Ph\u1EA3i b\xE1m `#scaler>` \u2014 lu\u1EADt n\u1EC1n chung `#scaler>.slide` c\xF3 \u0110\u1ED8 \u01AFU TI\xCAN cao h\u01A1n (id+class)\n   n\xEAn `.slide.dark` \u0111\u01A1n thu\u1EA7n b\u1ECB \u0111\xE8, slide t\u1ED1i ho\xE1 ra n\u1EC1n TR\u1EAENG v\xE0 ch\u1EEF tr\u1EAFng bi\u1EBFn m\u1EA5t. */\n#scaler>.slide.dk-dark,.slide.dk-dark{background:linear-gradient(135deg,var(--sl-navy),var(--sl-navy2))}\n.dk-dark .rail{position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--sl-gold)}\n.qmark{position:absolute;left:88px;top:104px;font-size:calc(150px * var(--dk-fs,1));font-weight:800;color:var(--sl-gold);line-height:.7;font-family:Georgia,serif}\n.qmsg{position:absolute;left:100px;right:120px;top:250px;font-size:calc(42px * var(--dk-fs,1));font-weight:800;color:#fff;line-height:1.24}\n.qby{position:absolute;left:100px;top:560px;font-size:calc(19px * var(--dk-fs,1));color:var(--sl-blue-border)}\n.sec-tag{position:absolute;left:110px;top:250px;font-size:calc(16px * var(--dk-fs,1));font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--sl-gold)}\n.sec-ttl{position:absolute;left:110px;right:120px;top:290px;font-size:calc(52px * var(--dk-fs,1));font-weight:800;color:#fff;line-height:1.12}\n.sec-sub{position:absolute;left:110px;right:140px;top:460px;font-size:calc(20px * var(--dk-fs,1));color:var(--sl-blue-border);line-height:1.4}\n\n/* nav pill + progress (nh\u01B0 player pptx) */\n/* `absolute` ch\u1EE9 KH\xD4NG `fixed`: fixed neo v\xE0o viewport \u21D2 nav tho\xE1t kh\u1ECFi panel, n\u1ED5i \u0111\xE8 UI\n   app. `mount.ts` \u0111\xE3 \u0111\u1EB7t host `position:relative` n\xEAn absolute neo \u0111\xFAng khung deck. */\n.nav{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;\n background:rgba(18,20,27,.72);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.08);color:#fff;\n padding:8px 14px;border-radius:999px;font-size:calc(14px * var(--dk-fs,1));z-index:20;box-shadow:0 8px 30px rgba(0,0,0,.45)}\n.nav button{background:rgba(255,255,255,.12);border:0;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:calc(17px * var(--dk-fs,1))}\n.nav button:hover{background:rgba(255,255,255,.28)}\n.nav .counter{min-width:70px;text-align:center;font-variant-numeric:tabular-nums}\n#sprog{position:absolute;left:0;bottom:0;height:3px;width:0;z-index:21;background:linear-gradient(90deg,var(--sl-blue),var(--sl-gold));transition:width .25s}\n\n/* \u2550\u2550 B\u1ED1 c\u1EE5c b\u1ED5 sung (\u0111\u1EE3t 2) \u2014 kh\xF4ng c\xF3 \u1EDF renderer Python \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n\n/* D\xE3y ch\u1EC9 s\u1ED1: s\u1ED1 to, v\u1EA1ch m\xE0u, nh\xE3n d\u01B0\u1EDBi */\n.kpirow{display:grid;gap:26px;align-items:stretch;height:100%;padding:24px 0}\n.kpi{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;\n background:var(--sl-card);border:1px solid var(--sl-border);border-radius:20px;padding:26px 18px;box-shadow:var(--sl-sh-sm)}\n.kpi-v{font-size:calc(64px * var(--dk-fs,1));font-weight:800;color:var(--sl-accent);line-height:1;overflow-wrap:anywhere}\n.kpi-bar{width:52px;height:5px;border-radius:3px;background:var(--sl-accent);margin:16px 0 14px}\n.kpi-l{font-size:calc(19px * var(--dk-fs,1));color:var(--sl-muted);line-height:1.35}\n\n/* \u1EA2nh m\u1ED9t b\xEAn, \xFD b\xEAn kia. `left`/`right` ch\u1EC9 \u0111\u1ED5i T\u1EC8 L\u1EC6 C\u1ED8T \u2014 th\u1EE9 t\u1EF1 DOM \u0111\xE3 \u0111\xFAng\n   s\u1EB5n n\xEAn tr\xECnh \u0111\u1ECDc m\xE0n h\xECnh v\xE0 b\u1EA3n .pptx kh\xF4ng b\u1ECB \u0111\u1EA3o. */\n.imgside{display:grid;gap:40px;height:100%;align-items:center}\n.imgside.left{grid-template-columns:460px 1fr}\n.imgside.right{grid-template-columns:1fr 460px}\n.imgside .fig{align-self:center;background:var(--sl-card);border:1px solid var(--sl-border);\n border-radius:18px;padding:16px;box-shadow:var(--sl-sh-md)}\n.imgside .fig img{width:100%;height:auto;display:block;border-radius:10px;max-height:420px;object-fit:contain}\n\n/* Tr\xEDch d\u1EABn c\xF3 t\xE1c gi\u1EA3 \u2014 d\xF9ng l\u1EA1i .qmark/.qmsg c\u1EE7a `quote`.\n   `.qby` c\u1EE7a `quote` l\xE0 position:absolute (top:560px); l\u1ED3ng v\xE0o .qauth th\xEC hai to\u1EA1 \u0111\u1ED9\n   C\u1ED8NG D\u1ED2N v\xE0 t\xEAn t\xE1c gi\u1EA3 v\u0103ng ra ngo\xE0i slide \u2192 ph\u1EA3i tr\u1EA3 n\xF3 v\u1EC1 d\xF2ng th\u01B0\u1EDDng. */\n.qauth{position:absolute;left:100px;bottom:96px;right:120px;\n display:flex;align-items:center;gap:16px}\n.qauth .qby{position:static;top:auto;left:auto;font-size:calc(21px * var(--dk-fs,1));font-weight:700;color:#fff}\n.qav{width:64px;height:64px;border-radius:50%;object-fit:cover;flex-shrink:0;\n border:2px solid var(--sl-gold)}\n.qrole{font-size:calc(16px * var(--dk-fs,1));color:var(--sl-blue-border);margin-top:2px}\n\n/* M\u1EE5c l\u1EE5c c\xF3 m\u1ED1c: \u0111\xE3 qua / \u0111ang \u1EDF / s\u1EAFp t\u1EDBi */\n.agenda{display:flex;flex-direction:column;gap:12px;height:100%;justify-content:center}\n.ag-it{display:flex;align-items:center;gap:20px;border-radius:14px;padding:12px 20px;\n border:1px solid var(--sl-border);background:var(--sl-card);box-shadow:var(--sl-sh-sm)}\n.ag-n{width:38px;height:38px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;\n justify-content:center;font-weight:800;font-size:calc(16px * var(--dk-fs,1));background:var(--sl-bg2);color:var(--sl-muted)}\n.ag-t{font-size:calc(21px * var(--dk-fs,1));color:var(--sl-ink);line-height:1.3}\n.ag-it.done{opacity:.5}\n.ag-it.done .ag-n{background:var(--sl-green);color:#fff}\n/* M\u1EE5c \u0110ANG \u1EDF: vi\u1EC1n \u0111\u1EADm + n\u1EC1n nh\u1EA5n \u0111\u1EC3 nh\xECn ph\xE1t th\u1EA5y ngay \u0111ang d\u1EA1y t\u1EDBi \u0111\xE2u */\n.ag-it.now{border-color:var(--sl-gold);border-width:2px;background:var(--sl-bg2);\n box-shadow:0 4px 16px rgba(0,0,0,.08)}\n.ag-it.now .ag-n{background:var(--sl-gold);color:var(--sl-navy)}\n.ag-it.now .ag-t{font-weight:700}\n\n/* So s\xE1nh 3 c\u1ED9t: ti\xEAu \u0111\u1EC1 l\xE0 d\u1EA3i m\xE0u \u0111\u1EB7c (kh\xE1c `three` ch\u1EC9 c\xF3 v\u1EA1ch m\u1EA3nh) */\n.c3row{display:grid;gap:22px;height:100%;align-items:stretch;padding:8px 0}\n.c3{display:flex;flex-direction:column;border-radius:16px;overflow:hidden;\n border:1px solid var(--sl-border);background:var(--sl-card);box-shadow:var(--sl-sh-md)}\n.c3-h{padding:14px 18px;color:#fff;font-weight:800;font-size:calc(21px * var(--dk-fs,1));line-height:1.25;\n overflow-wrap:anywhere}\n.c3-b{flex:1;padding:16px 18px}\n.c3-b ul.bul li{font-size:calc(19px * var(--dk-fs,1));margin:9px 0}\n\n/* Khung tr\u1EAFng: v\xF9ng n\u1ED9i dung c\xF3 vi\u1EC1n \u0111\u1EE9t cho GV bi\u1EBFt ch\u1ED7 t\u1EF1 d\u1EF1ng */\n.blankbody{border:2px dashed var(--sl-border);border-radius:16px;padding:24px}\n\n/* \u2550\u2550 Ch\u1ED1ng TR\xC0N khi n\u1ED9i dung qu\xE1 d\xE0i (m\u1EE9c "over") \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   C\xE1c con s\u1ED1/nh\xE3n c\u1EE1 l\u1EDBn \u0111\u01B0\u1EE3c \u0111\u1EB7t c\u1EE9ng theo px n\xEAn g\u1EB7p ch\u1EEF d\xE0i l\xE0 v\u1EE1 khung.\n   D\xF9ng `clamp()` theo chi\u1EC1u r\u1ED9ng \xF4 + c\u1EAFt s\u1ED1 d\xF2ng, thay v\xEC \u0111\u1EC3 tr\xE0n ra ngo\xE0i. */\n\n/* S\u1ED1 l\u1EDBn / ch\u1EC9 s\u1ED1: co theo b\u1EC1 ngang \xF4, t\u1ED1i \u0111a 3 d\xF2ng */\n.bnv{font-size:calc((clamp(34px,7vw,98px)) * var(--dk-fs,1));overflow-wrap:anywhere;\n display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}\n.bnl,.kpi-l,.metric .lab{overflow-wrap:anywhere;\n display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}\n.kpi-v{font-size:calc((clamp(28px,5vw,64px)) * var(--dk-fs,1));\n display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}\n.metric .val{font-size:calc((clamp(28px,4.6vw,58px)) * var(--dk-fs,1));overflow-wrap:anywhere;\n display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}\n.bn,.kpi,.metric{overflow:hidden}\n\n/* C\u1ED9t (three/compare/compare3/quadrant/feature) v\xE0 c\xE1c danh s\xE1ch trong c\u1ED9t:\n   \xF4 c\u1ED9t t\u1EF1 cu\u1ED9n-\u1EA9n ph\u1EA7n th\u1EEBa thay v\xEC \u0111\u1EA9y ch\u1EEF xu\u1ED1ng d\u01B0\u1EDBi ch\xE2n trang. */\n.cols .col,.c3,.c3-b{overflow:hidden}\n.cols .col ul.bul,.c3-b ul.bul{overflow:hidden}\n\n/* `.dtbl` C\u0168NG kh\xF4ng \u0111\u01B0\u1EE3c `display:block` \u2014 xem ghi ch\xFA \u1EDF kh\u1ED1i .cmptbl ph\xEDa d\u01B0\u1EDBi.\n   Tr\u01B0\u1EDBc \u0111\xE2y d\xF2ng n\xE0y \u0111\u1EB7t `display:block`, gi\u1EBFt `table-layout:fixed` \u1EDF khai b\xE1o g\u1ED1c: \u0111o th\u1EADt\n   3 c\u1ED9t ra 112/468/147px thay v\xEC ~362 \u0111\u1EC1u nhau. N\u1EB7ng h\u01A1n `.cmptbl` v\xEC `table` l\xE0 b\u1ED1 c\u1EE5c\n   KH\xD4NG cho ch\u1ECDn tay \u21D2 gi\xE1o vi\xEAn kh\xF4ng tho\xE1t \u0111\u01B0\u1EE3c. Ph\u1EA7n c\u1EAFt \u0111\xE3 c\xF3 `.body` lo. */\n\n/* M\u1EE5c l\u1EE5c c\xF3 m\u1ED1c / c\xE1c b\u01B0\u1EDBc / \u0111i\u1EC3m nh\u1EA5n: nhi\u1EC1u m\u1EE5c th\xEC thu g\u1ECDn d\xF2ng */\n.agenda,.toc{overflow:hidden}\n.agenda .ag-t,.toc .t{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}\n\n/* \u2500\u2500 Ch\u1ED1ng tr\xE0n: m\u1ED9t lu\u1EADt chung thay v\xEC v\xE1 theo t\u1EEBng t\xEAn class \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n   M\u1ECDi v\xF9ng n\u1ED9i dung c\u1EE7a slide \u0111\u1EC1u n\u1EB1m trong `.body` (\u0111\xE3 `overflow:hidden`). V\u1EA5n \u0111\u1EC1 c\xF2n l\u1EA1i\n   l\xE0 c\xE1c L\u1EDAP GI\u1EEEA cao h\u01A1n khung cha n\xEAn \u0111\u1EA9y ch\u1EEF xu\u1ED1ng d\u01B0\u1EDBi ch\xE2n trang tr\u01B0\u1EDBc khi b\u1ECB c\u1EAFt.\n   Cho t\u1EA5t c\u1EA3 ch\xFAng `min-height:0` + `overflow:hidden` \u2014 trong flex/grid, m\u1EB7c \u0111\u1ECBnh\n   `min-height:auto` KH\xD4NG cho con co l\u1EA1i, \u0111\xF3 ch\xEDnh l\xE0 l\xFD do ch\u1EEF tr\xE0n ra ngo\xE0i. */\n.body>*,.body>*>*{min-height:0}\n.cols,.grid,.mrow,.kpirow,.c3row,.quad,.steps,.spot,.agenda,.toc,.gal,.two,.imgside{\n max-height:100%;overflow:hidden}\n/* \xD4 con c\u1EE7a c\xE1c l\u01B0\u1EDBi tr\xEAn: t\u1EF1 c\u1EAFt ph\u1EA7n th\u1EEBa, kh\xF4ng \u0111\u1EA9y ra ngo\xE0i */\n.col,.qd,.c3,.kpi,.metric,.gcell,.spot-body,.stp{min-height:0;overflow:hidden}\n/* Danh s\xE1ch n\u1EB1m TRONG \xF4: `data-nb` \u0111\u1EBFm \xFD c\u1EE7a c\u1EA3 slide n\xEAn b\u1EADc thu nh\u1ECF kh\xF4ng v\u1EDBi t\u1EDBi \u0111\xE2y */\n.col ul.bul,.qd ul.bul,.c3-b ul.bul,.spot-body ul.bul{min-height:0;overflow:hidden}\n.col ul.bul li,.qd ul.bul li,.c3-b ul.bul li{font-size:calc(19px * var(--dk-fs,1));margin:8px 0}\n/* C\u1ED9t nhi\u1EC1u \xFD th\xEC thu nh\u1ECF th\xEAm \u2014 n\u1EBFu kh\xF4ng, \xFD cu\u1ED1i b\u1ECB C\u1EAET NGANG CH\u1EEE (x\u1EA5u, kh\xF3 \u0111\u1ECDc).\n   `data-nb` l\xE0 t\u1ED5ng \xFD c\u1EE7a slide; v\u1EDBi b\u1ED1 c\u1EE5c c\u1ED9t, \xFD \u0111\u01B0\u1EE3c chia \u0111\u1EC1u n\xEAn v\u1EABn suy ra \u0111\u01B0\u1EE3c \u0111\u1ED9 d\xE0y. */\n.slide[data-nb="6"] .col ul.bul li,.slide[data-nb="6"] .qd ul.bul li,.slide[data-nb="6"] .c3-b ul.bul li{font-size:calc(17px * var(--dk-fs,1));margin:6px 0}\n.slide[data-nb="7"] .col ul.bul li,.slide[data-nb="7"] .qd ul.bul li,.slide[data-nb="7"] .c3-b ul.bul li{font-size:calc(16px * var(--dk-fs,1));margin:5px 0}\n.slide[data-nb="8"] .col ul.bul li,.slide[data-nb="8"] .qd ul.bul li,.slide[data-nb="8"] .c3-b ul.bul li{font-size:calc(15px * var(--dk-fs,1));margin:4px 0}\n.slide[data-nb="9"] .col ul.bul li,.slide[data-nb="10"] .col ul.bul li,\n.slide[data-nb="11"] .col ul.bul li,.slide[data-nb="12"] .col ul.bul li,\n.slide[data-nb="9"] .qd ul.bul li,.slide[data-nb="10"] .qd ul.bul li,\n.slide[data-nb="9"] .c3-b ul.bul li,.slide[data-nb="10"] .c3-b ul.bul li{font-size:calc(14px * var(--dk-fs,1));margin:3px 0}\n/* Ti\xEAu \u0111\u1EC1 c\u1ED9t c\u0169ng ph\u1EA3i nh\u01B0\u1EDDng ch\u1ED7 khi \xFD nhi\u1EC1u */\n.slide[data-nb="7"] .col .ch,.slide[data-nb="8"] .col .ch,.slide[data-nb="9"] .col .ch{font-size:calc(18px * var(--dk-fs,1));margin:6px 0 8px}\n.slide[data-nb="7"] .col .cn,.slide[data-nb="8"] .col .cn,.slide[data-nb="9"] .col .cn{font-size:calc(24px * var(--dk-fs,1))}\n/* \xDD b\u1ECB c\u1EAFt d\u1EDF dang th\xEC th\xE0 c\u1EAFt TR\u1ECCN D\xD2NG c\xF2n h\u01A1n c\u1EAFt ngang ch\u1EEF */\n.col ul.bul li,.qd ul.bul li,.c3-b ul.bul li{display:-webkit-box;-webkit-box-orient:vertical;\n -webkit-line-clamp:3;overflow:hidden}\n/* quadrant / spotlight / comparetable: 3 ch\u1ED7 cu\u1ED1i c\xF2n tr\xE0n \u1EDF m\u1EE9c "over".\n   C\xF9ng m\u1ED9t c\xE1ch ch\u1EEFa: cho khung con co \u0111\u01B0\u1EE3c (min-height:0) r\u1ED3i c\u1EAFt ph\u1EA7n th\u1EEBa. */\n.quad{display:grid;height:100%;min-height:0;overflow:hidden}\n.qd{min-height:0;overflow:hidden;display:flex;flex-direction:column}\n.qd ul.bul{min-height:0;overflow:hidden}\n.spot-body{min-height:0;overflow:hidden;flex:1 1 auto}\n.spot-body ul.bul{min-height:0;overflow:hidden}\n.slide[data-nb="7"] .spot-body ul.bul li,.slide[data-nb="8"] .spot-body ul.bul li{font-size:calc(19px * var(--dk-fs,1));margin:7px 0}\n/* B\u1EA3ng so s\xE1nh \u2014 KHAI B\xC1O DUY NH\u1EA4T (tr\u01B0\u1EDBc kia 4 ch\u1ED7 khai m\xE2u thu\u1EABn nhau).\n   TUY\u1EC6T \u0110\u1ED0I kh\xF4ng th\xEAm `display:block`: `table-layout:fixed` CH\u1EC8 c\xF3 t\xE1c d\u1EE5ng tr\xEAn\n   display:table, n\xEAn block l\xE0m ch\u1EBFt lu\xF4n vi\u1EC7c chia c\u1ED9t \u0111\u1EC1u. \u0110\xE3 \u0111o th\u1EADt: m\u1ED9t \xF4 d\xE0i\n   khi\u1EBFn 2 c\u1ED9t th\xE0nh 1009px / 142px thay v\xEC 576/576 \u2014 hai c\u1ED9t "so s\xE1nh" h\u1EBFt so s\xE1nh\n   \u0111\u01B0\u1EE3c, ti\xEAu \u0111\u1EC1 c\u1ED9t h\u1EB9p c\xF2n b\u1ECB ng\u1EAFt gi\u1EEFa ch\u1EEBng.\n   C\u1EAFt ph\u1EA7n th\u1EEBa \u0111\xE3 c\xF3 `.body` (absolute, overflow \u1EA9n) lo; <table> kh\xF4ng nh\u1EADn\n   max-height n\xEAn \u0111\u1EEBng c\u1ED1 \xE9p \u1EDF \u0111\xE2y. Gi\u1EEF <table> th\u1EADt \u0111\u1EC3 .pptx tr\xEDch \u0111\xFAng \xF4. */\n.cmptbl{table-layout:fixed;width:100%;border-collapse:collapse}\n.cmptbl td,.cmptbl th{overflow-wrap:anywhere;vertical-align:top}\n.slide[data-nb="7"] .cmptbl,.slide[data-nb="8"] .cmptbl,\n.slide[data-nb="9"] .cmptbl,.slide[data-nb="10"] .cmptbl{font-size:calc(16px * var(--dk-fs,1))}\n.slide[data-nb="7"] .cmptbl td,.slide[data-nb="8"] .cmptbl td{padding:6px 12px}\n\n/* \u2550\u2550 B\u1ED1 c\u1EE5c \u0111\u1EE3t 3 \u2014 theo nhu c\u1EA7u TH\u1EACT c\u1EE7a b\xE0i To\xE1n \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n\n/* B\u1EA3ng R\u1ED8NG (b\u1EA3ng bi\u1EBFn thi\xEAn): tr\u1EA3i h\u1EBFt b\u1EC1 ngang, c\u1ED9t \u0111\u1EC1u nhau.\n   `h_table` \u0111\u1EC3 `table-layout:fixed` + width auto n\xEAn b\u1EA3ng 10 c\u1ED9t co d\xFAm \u1EDF g\xF3c tr\xE1i,\n   ch\u1EEBa 2/3 slide tr\u1ED1ng \u2014 chi\u1EBFu xa g\u1EA7n nh\u01B0 kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c. */\n/* `.body` cao h\u1EBFt ph\u1EA7n th\xE2n slide, n\xEAn kh\u1ED1i con ph\u1EA3i T\u1EF0 C\u0102N GI\u1EEEA \u2014 kh\xF4ng th\xEC b\u1EA3ng/th\u1EBB\n   d\xEDnh m\xE9p tr\xEAn, ch\u1EEBa 40% slide tr\u1ED1ng (\u0111\xE3 th\u1EA5y tr\xEAn \u1EA3nh ch\u1EE5p b\u1EA3ng bi\u1EBFn thi\xEAn 6 c\u1ED9t). */\n.body.twwrap,.body.fswrap{display:flex;flex-direction:column;justify-content:center}\n.twtbl{width:100%;border-collapse:collapse;table-layout:fixed;\n font-size:calc((clamp(13px,calc(150px / var(--tw-n, 6)),26px)) * var(--dk-fs,1))}\n.twtbl th,.twtbl td{border:1px solid var(--sl-border);padding:10px 6px;text-align:center;\n color:var(--sl-ink);vertical-align:middle;overflow-wrap:anywhere;line-height:1.35}\n.twtbl th{background:var(--sl-navy);color:#fff;font-weight:800}\n/* C\u1ED9t \u0111\u1EA7u l\xE0 NH\xC3N H\xC0NG (x \xB7 y\u2032 \xB7 y) \u2014 t\xF4 n\u1EC1n cho m\u1EAFt b\xE1m \u0111\u01B0\u1EE3c khi \u0111\u1ECDc ngang */\n.twtbl .tw-h{background:var(--sl-bg2);font-weight:800;color:var(--sl-navy);text-align:right;\n padding-right:12px;width:var(--tw-lab,84px)}\n.twtbl tr:nth-child(even) td:not(.tw-h){background:var(--sl-bg2)}\n.tw-cap{margin-top:14px;font-size:calc(15px * var(--dk-fs,1));color:var(--sl-muted);text-align:center;font-style:italic}\n\n/* Th\u1EBB \u0111\u1ECBnh ngh\u0129a \u2014 ch\u1EEF d\xE0i tr\xECnh b\xE0y th\xE0nh \u0111o\u1EA1n v\u0103n c\xF3 khung, c\u1EE1 t\u1EF1 co theo \u0111\u1ED9 d\xE0i. */\n.defcard{background:var(--sl-card);border:1px solid var(--sl-border);\n border-left:6px solid var(--sl-navy);border-radius:14px;padding:26px 30px;height:100%;\n overflow:hidden;display:flex;flex-direction:column;gap:14px;justify-content:center;box-shadow:var(--sl-sh-lg)}\n.dc-p{color:var(--sl-ink);line-height:1.55;overflow-wrap:anywhere}\n.defcard[data-sz="l"] .dc-p{font-size:calc(26px * var(--dk-fs,1))}\n.defcard[data-sz="m"] .dc-p{font-size:calc(21px * var(--dk-fs,1));line-height:1.5}\n.defcard[data-sz="s"] .dc-p{font-size:calc(17px * var(--dk-fs,1));line-height:1.45}\n.dc-src{margin-top:auto;padding-top:12px;border-top:1px solid var(--sl-border);\n font-size:calc(14px * var(--dk-fs,1));color:var(--sl-muted);font-style:italic}\n\n/* C\xF4ng th\u1EE9c + c\xE1c b\u01B0\u1EDBc bi\u1EBFn \u0111\u1ED5i */\n.fsbox{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:14px;\n padding:18px 22px;text-align:center;margin-bottom:16px;box-shadow:var(--sl-sh-sm)}\n.fsbox img{max-width:80%;max-height:110px}\n.fs-eq{font-size:calc(30px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);line-height:1.3;overflow-wrap:anywhere}\n.fsteps{list-style:none;display:flex;flex-direction:column;gap:10px;overflow:hidden}\n.fsteps li{display:flex;align-items:flex-start;gap:14px}\n.fs-n{flex:none;width:26px;height:26px;border-radius:50%;background:var(--sl-blue);color:#fff;\n display:flex;align-items:center;justify-content:center;font-size:calc(14px * var(--dk-fs,1));font-weight:800;margin-top:2px}\n.fs-t{font-size:calc(20px * var(--dk-fs,1));line-height:1.4;color:var(--sl-ink);overflow-wrap:anywhere}\n';

// src/styles/tokens.css
var tokens_default = '/**\n * Token giao di\u1EC7n TR\xCCNH S\u1EECA \u2014 theo thang ReUI/shadcn c\u1EE7a app.\n *\n * V\xEC sao CSS thu\u1EA7n ch\u1EE9 kh\xF4ng Tailwind: deck-kit ph\u1EA3i ch\u1EA1y \u0111\u01B0\u1EE3c \u1EDF Angular v\xE0 JS thu\u1EA7n,\n * k\xE9o Tailwind/Radix v\xE0o l\xE0 ph\xE1 m\u1EA5t t\xEDnh \u0111\u1ED9c l\u1EADp \u0111\xF3. N\xEAn b\u1EAFt ch\u01B0\u1EDBc THANG \u0110O c\u1EE7a ReUI\n * (kho\u1EA3ng c\xE1ch 4px, b\xE1n k\xEDnh 6/8/10/12, c\u1EE1 control 32/36) b\u1EB1ng bi\u1EBFn CSS.\n *\n * Ch\u1EC9 \xE1p cho ph\u1EA7n CHROME c\u1EE7a tr\xECnh s\u1EEDa (`.dk-*`). B\u1EA3n th\xE2n slide v\u1EABn d\xF9ng token `--sl-*`\n * c\u1EE7a theme deck \u2014 hai h\u1EC7 t\xE1ch b\u1EA1ch \u0111\u1EC3 \u0111\u1ED5i theme slide kh\xF4ng k\xE9o theo \u0111\u1ED5i giao di\u1EC7n s\u1EEDa.\n */\n.lp-edit {\n  /* B\xE1n k\xEDnh \u2014 thang ReUI */\n  --dk-r-sm: 6px;\n  --dk-r: 8px;\n  --dk-r-md: 10px;\n  --dk-r-lg: 12px;\n\n  /* Kho\u1EA3ng c\xE1ch \u2014 b\u1ED9i s\u1ED1 4px */\n  --dk-1: 4px;\n  --dk-2: 8px;\n  --dk-3: 12px;\n  --dk-4: 16px;\n  --dk-6: 24px;\n\n  /* C\u1EE1 control chu\u1EA9n: 32 (nh\u1ECF) \xB7 36 (m\u1EB7c \u0111\u1ECBnh) \u2014 v\xF9ng b\u1EA5m kh\xF4ng d\u01B0\u1EDBi 32px */\n  --dk-h-sm: 32px;\n  --dk-h: 36px;\n\n  /* M\xE0u \u2014 n\u1EC1n t\u1ED1i cho chrome, t\xE1ch h\u1EB3n v\u1EDBi n\u1EC1n slide \u0111\u1EC3 m\u1EAFt ph\xE2n bi\u1EC7t v\xF9ng l\xE0m vi\u1EC7c */\n  --dk-bg: #0f1117;\n  --dk-bg-2: #171a22;\n  --dk-bg-3: #1f242e;\n  --dk-fg: #e7ebf5;\n  --dk-fg-2: #9aa6c0;\n  --dk-fg-3: #6c7893;\n  --dk-border: rgba(255, 255, 255, .09);\n  --dk-border-2: rgba(255, 255, 255, .16);\n\n  /* Nh\u1EA5n/c\u1EA3nh b\xE1o \u2014 d\xF9ng chung v\u1EDBi `--sl-gold` c\u1EE7a theme \u0111\u1EC3 hai b\xEAn kh\xF4ng ch\u1ECFi nhau */\n  --dk-accent: var(--sl-gold, #e0a23a);\n  --dk-accent-fg: #1c274c;\n  --dk-danger: #f0736a;\n  --dk-danger-bg: #3a1d1d;\n  --dk-ok: #7fd18a;\n  --dk-warn: #e8b339;\n\n  --dk-shadow: 0 4px 14px rgba(0, 0, 0, .35);\n  --dk-shadow-lg: 0 18px 48px rgba(0, 0, 0, .5);\n  --dk-ring: 0 0 0 3px rgba(224, 162, 58, .28);\n\n  --dk-font: var(--sl-font, system-ui, -apple-system, "Segoe UI", sans-serif);\n}\n\n/* Icon SVG nh\xFAng \u2014 \u0103n theo c\u1EE1 ch\u1EEF v\xE0 m\xE0u ch\u1EEF c\u1EE7a n\xFAt ch\u1EE9a n\xF3. */\n.dk-i {\n  flex: none;\n  vertical-align: -.15em;\n}\n';

// src/styles/edit.css
var edit_default = '/* `absolute` ch\u1EE9 KH\xD4NG `fixed`: b\u1EA3n c\u0169 lu\xF4n n\u1EB1m trong iframe n\xEAn "c\u1EEDa s\u1ED5" ch\xEDnh l\xE0 khung\n   deck. Mount th\u1EB3ng v\xE0o panel c\u1EE7a app th\xEC `fixed` khi\u1EBFn rail/console/thanh tr\u1EA1ng th\xE1i b\xE1m\n   M\xC0N H\xCCNH \u2014 \u0111\xE8 l\xEAn menu app v\xE0 tr\xE0n ra ngo\xE0i panel. Ph\u1EA7n t\u1EED ch\u1EE9a \u0111\xE3 `position:relative`\n   (mountDeck \u0111\u1EB7t), n\xEAn `absolute` neo \u0111\xFAng v\xE0o khung deck. */\n\n[contenteditable]{outline:1px dashed rgba(38,132,252,.55);outline-offset:3px;border-radius:3px;cursor:text}\n[contenteditable]:hover{background:rgba(38,132,252,.05)}\n[contenteditable]:focus{outline:2px solid var(--sl-blue);background:rgba(38,132,252,.08)}\nul.bul li{list-style:none}\n.edx{margin-left:10px;background:transparent;border:0;color:#c0392b;font-size:20px;line-height:1;cursor:pointer;opacity:.45;vertical-align:middle}\n.edx:hover{opacity:1}\n.edadd{margin-top:10px;background:transparent;border:1px dashed var(--sl-blue-border);color:var(--sl-blue);border-radius:8px;padding:4px 14px;font-size:15px;cursor:pointer;font-weight:700}\n.edadd:hover{background:rgba(38,132,252,.08)}\n\n/* Thumbnail rail tr\xE1i (k\xE9o-th\u1EA3 s\u1EAFp x\u1EBFp, nh\xE2n b\u1EA3n, xo\xE1) + console ph\u1EA3i.\n   `.lp-edit` n\u1EB1m tr\xEAn <body> \u1EDF b\u1EA3n Python, tr\xEAn ph\u1EA7n t\u1EED host \u1EDF b\u1EA3n th\u01B0 vi\u1EC7n \u2014 b\u1EAFt c\u1EA3 hai. */\n\n/* n\xFAt m\u1EDF b\u1ED9 ch\u1ECDn b\u1ED1 c\u1EE5c + popup picker tr\u1EF1c quan */\n\n/* z-index 200: picker g\u1EAFn th\u1EB3ng v\xE0o <body> n\xEAn n\xF3 n\u1EB1m \u1EDF NG\u1EEE C\u1EA2NH X\u1EBEP CH\u1ED2NG G\u1ED0C, ph\u1EA3i so\n   v\u1EDBi c\xE1c l\u1EDBp ph\u1EE7 c\u1EE7a app ch\u1EE7 ch\u1EE9 kh\xF4ng ph\u1EA3i v\u1EDBi `.dk-toolbar` (z-30) b\xEAn trong deck. App\n   lesson-plan c\xF3 MediaPicker z-100, PreviewModal z-120, JsonModal z-130 \u2014 \u0111\u1EC3 40 th\xEC m\u1EDF picker\n   b\u1ED1 c\u1EE5c trong l\xFAc m\u1ED9t trong ba l\u1EDBp \u0111\xF3 \u0111ang m\u1EDF l\xE0 picker CHUI XU\u1ED0NG D\u01AF\u1EDAI: th\u1EA5y m\u1EDD m\u1EDD m\xE0 b\u1EA5m\n   kh\xF4ng \u0111\u01B0\u1EE3c. 200 \u0111\u1EC3 c\xF2n ch\u1ED7 tr\u1ED1ng ph\xEDa d\u01B0\u1EDBi cho l\u1EDBp m\u1EDBi c\u1EE7a app ch\u1EE7. */\n#lp-picker{position:fixed;inset:0;z-index:200;background:rgba(10,12,18,.55);display:none;align-items:center;justify-content:center}\n#lp-picker.show{display:flex}\n.pk-box{background:#fff;border-radius:18px;width:min(760px,92vw);max-height:86vh;display:flex;flex-direction:column;box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden}\n.pk-hd{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid #e6e9f0;font-weight:800;font-size:16px;color:#1C274C}\n.pk-x{background:transparent;border:0;font-size:19px;cursor:pointer;color:#6b7280;line-height:1}\n.pk-body{padding:8px 22px 22px;overflow-y:auto}\n.pk-g{font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#9aa6c0;margin:16px 0 9px}\n.pk-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}\n.pk-tile{display:flex;flex-direction:column;align-items:center;gap:7px;padding:15px 8px;border:2px solid #e6e9f0;border-radius:12px;background:#fff;cursor:pointer;transition:border-color .12s,background .12s}\n.pk-tile:hover{border-color:#8FA9E8;background:#f6f8fc}\n.pk-tile.on{border-color:#2B4182;background:#eef3fd}\n.pk-lb{font-size:12px;font-weight:600;color:#1C274C;text-align:center;line-height:1.2}\n.pk-tile.off{opacity:.4;cursor:not-allowed;background:#f7f8fb;position:relative}\n.pk-tile.off:hover{border-color:#e6e9f0;background:#f7f8fb}\n.pk-lock{position:absolute;top:6px;right:8px;font-size:12px}\n/* mini-preview s\u01A1 \u0111\u1ED3 b\u1ED1 c\u1EE5c trong tile */\n/* \xD4 xem tr\u01B0\u1EDBc = slide TH\u1EACT 1280x720 thu nh\u1ECF. Tr\u01B0\u1EDBc \u0111\xE2y l\xE0 s\u01A1 \u0111\u1ED3 v\u1EBD tay (.mp-*): 38 case\n   cho 41 b\u1ED1 c\u1EE5c, 3 b\u1ED1 c\u1EE5c r\u01A1i v\xE0o icon chung, v\xE0 kh\xF4ng c\xE1i n\xE0o gi\u1ED1ng th\u1EE9 b\u1EA5m xong s\u1EBD\n   nh\u1EADn. Gi\u1EDD nh\xFAng \u0111\xFAng \u0111\u1EA7u ra c\u1EE7a `renderSlide`. T\u1EC9 l\u1EC7 76/1280 = .0594 */\n.pk-mini{width:76px;height:46px;border-radius:6px;background:#f3f5fa;border:1px solid #e0e5f0;overflow:hidden;flex:none;display:block;position:relative}\n.pk-mini>.slide{width:1280px;height:720px;position:absolute;left:0;top:0;transform:scale(.0594);transform-origin:0 0;pointer-events:none;margin:0;border-radius:0}\n/* Thumbnail rail tr\xE1i */\n/* Preview tr\xE1i \u2014 b\u1EAFt \u0111\u1EA7u D\u01AF\u1EDAI thanh c\xF4ng c\u1EE5 (`top:0` th\xEC b\u1ECB thanh che m\u1EA5t thumbnail \u0111\u1EA7u). */\n#lp-rail{position:absolute;left:0;top:var(--dk-h-bar,52px);bottom:0;width:150px;z-index:28;\n background:var(--dk-bg);border-right:1px solid var(--dk-border);\n overflow-y:auto;overflow-x:hidden;padding:var(--dk-2) var(--dk-2) 40px;\n display:flex;flex-direction:column;gap:var(--dk-2);scrollbar-width:thin}\n#lp-rail::-webkit-scrollbar{width:7px}#lp-rail::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:4px}\n.rail-it{position:relative;border-radius:9px;cursor:grab;border:2px solid transparent;background:#0c0e14}\n.rail-it.on{border-color:var(--sl-gold)}\n.rail-it.drag{opacity:.4}\n.rail-thumb{position:relative;width:150px;height:85px;overflow:hidden;border-radius:7px;background:var(--sl-bg2);pointer-events:none}\n.rail-thumb>.slide{position:absolute;top:0;left:0;display:block!important;width:1280px;height:720px;\n transform:scale(.1172);transform-origin:top left;background:var(--sl-bg);color:var(--sl-ink);overflow:hidden;box-shadow:none;border-radius:0;animation:none}\n.rail-num{position:absolute;left:5px;top:4px;background:rgba(0,0,0,.66);color:#fff;font-size:11px;font-weight:800;padding:1px 7px;border-radius:9px;line-height:1.5}\n.rail-del,.rail-dup{position:absolute;top:4px;width:22px;height:22px;border-radius:6px;border:0;color:#fff;font-size:12px;cursor:pointer;opacity:0;transition:opacity .12s;display:flex;align-items:center;justify-content:center;padding:0;line-height:1}\n.rail-del{right:5px;background:rgba(192,57,43,.94)}\n.rail-dup{right:31px;background:rgba(38,132,252,.94)}\n.rail-it:hover .rail-del,.rail-it:hover .rail-dup{opacity:1}\n.rail-it.skip{opacity:.5}\n.rail-it.skip .rail-thumb{filter:grayscale(1)}\n.rail-it.skip .rail-num::after{content:" \xB7\u1EA8N";color:#ff8a80}\n/* slide \u1EA9n (skip) \u2014 edit mode hi\u1EC7n m\u1EDD */\n#scaler>.slide.active.skipped{opacity:.45}\n/* Tr\xECnh chi\u1EBFu (present): \u1EA9n m\u1ECDi c\xF4ng c\u1EE5, slide to\xE0n khung */\n.lp-present #lp-rail,.lp-present .dk-toolbar,.lp-present .dk-pop{display:none!important}\n.lp-present .stage{left:0!important;right:0!important}\n\n/* \u2550\u2550 L\xE0m \u0111\u1EB9p tr\xECnh s\u1EEDa (P0.4) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n\n/* \xD4 t\xECm b\u1ED1 c\u1EE5c trong picker \u2014 38 b\u1ED1 c\u1EE5c th\xEC cu\u1ED9n tay qu\xE1 ch\u1EADm */\n.pk-q{flex:1;margin:0 14px;min-width:0;font-family:inherit;font-size:14px;padding:8px 12px;\n border:1px solid #d8dee9;border-radius:9px;background:#f7f9fc;color:#1C274C;outline:none}\n.pk-q:focus{border-color:var(--sl-blue,#2684fc);background:#fff;\n box-shadow:0 0 0 3px rgba(38,132,252,.14)}\n.pk-q::placeholder{color:#9aa6c0}\n.pk-none{padding:34px 22px;text-align:center;color:#8894ab;font-size:14px}\n/* `.pk-tile{display:flex}` \u0110\xC8 thu\u1ED9c t\xEDnh `hidden` (display m\u1EB7c \u0111\u1ECBnh c\u1EE7a hidden ch\u1EC9 l\xE0\n   `display:none` \u1EDF t\u1EA7ng user-agent) \u2192 l\u1ECDc xong \xF4 v\u1EABn hi\u1EC7n. Ph\u1EA3i ch\u1EB7n t\u01B0\u1EDDng minh. */\n.pk-tile[hidden],.pk-grid[hidden],.pk-g[hidden],.pk-none[hidden]{display:none!important}\n/* Ti\xEAu \u0111\u1EC1 nh\xF3m D\xCDNH khi cu\u1ED9n \u2014 cu\u1ED9n gi\u1EEFa danh s\xE1ch d\xE0i v\u1EABn bi\u1EBFt \u0111ang \u1EDF nh\xF3m n\xE0o */\n.pk-g{position:sticky;top:0;z-index:2;background:#fff}\n/* \xD4 \u0111ang r\xEA chu\u1ED9t: n\u1ED5i l\xEAn \u0111\u1EC3 bi\u1EBFt m\xECnh \u0111ang xem tr\u01B0\u1EDBc b\u1ED1 c\u1EE5c n\xE0o */\n.pk-tile:not([disabled]):hover{border-color:var(--sl-blue,#2684fc);\n box-shadow:0 6px 18px rgba(38,132,252,.18);transform:translateY(-1px)}\n.pk-tile{transition:transform .12s,box-shadow .12s,border-color .12s}\n/* Slide \u0111ang \u0111\u01B0\u1EE3c XEM TR\u01AF\u1EDAC (r\xEA chu\u1ED9t \u1EDF picker) \u2014 vi\u1EC1n nh\u1EA5n cho bi\u1EBFt ch\u01B0a ch\u1ED1t */\n\n/* Console ph\u1EA3i: chia nh\xF3m c\xF3 ti\xEAu \u0111\u1EC1, n\xFAt nguy hi\u1EC3m t\xE1ch xu\u1ED1ng cu\u1ED1i */\n\n text-transform:uppercase;color:#6c7893;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.07)}\n\n/* D\u1EA5u th\u1EDDi gian l\u01B0u \u2014 thay cho ch\u1EEF nh\u1EA5p nh\xE1y kh\xF4ng r\xF5 \u0111\xE3 l\u01B0u l\xFAc n\xE0o */\n\n/* L\u01AFU H\u1ECENG ph\u1EA3i N\u1ED4I B\u1EACT: gi\xE1o vi\xEAn b\u1ECF l\u1EE1 d\xF2ng n\xE0y l\xE0 g\xF5 ti\u1EBFp r\u1ED3i m\u1EA5t tr\u1EAFng c\xF4ng. */\n\n\n/* T\xF4n tr\u1ECDng ng\u01B0\u1EDDi d\xF9ng t\u1EAFt hi\u1EC7u \u1EE9ng chuy\u1EC3n \u0111\u1ED9ng */\n@media (prefers-reduced-motion:reduce){\n  .pk-tile,.rail-it,.rail-del,.rail-dup{transition:none}\n  #scaler>.slide.active{animation:none}\n}\n\n/* \xD4 b\u1ED1 c\u1EE5c \u0110\u1ED4I \u0110\u01AF\u1EE2C nh\u01B0ng ch\u1EEF h\u01A1i d\xE0i \u2014 c\u1EA3nh b\xE1o V\xC0NG, kh\xE1c h\u1EB3n \xF4 kho\xE1 (m\u1EDD + \u{1F512}).\n   V\u1EABn b\u1EA5m \u0111\u01B0\u1EE3c: GV c\xF3 th\u1EC3 \u0111\u1ECBnh r\xFAt g\u1ECDn ch\u1EEF ngay sau khi \u0111\u1ED5i. */\n.pk-tile.tight{border-color:#e8b339;background:#fffdf5}\n.pk-tile.tight:hover{border-color:#d99b1f;background:#fff9e8}\n.pk-tight{position:absolute;top:6px;right:8px;font-size:9.5px;font-weight:800;\n background:#e8b339;color:#4a3608;padding:1px 5px;border-radius:5px;line-height:1.5}\n.pk-tile{position:relative}\n\n/* \u2550\u2550 Thanh c\xF4ng c\u1EE5 TR\xCAN + preview TR\xC1I (thay 3 c\u1ED9t c\u0169) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   Slide r\u1ED9ng 682px thay v\xEC 406px tr\xEAn c\xF9ng m\u1ED9t panel \u2014 g\u1EA5p 1,7 l\u1EA7n. */\n.lp-edit .stage{left:150px;right:0;top:var(--dk-h-bar,52px)}\n.dk-toolbar{position:absolute;left:0;right:0;top:0;height:var(--dk-h-bar,52px);z-index:30;\n display:flex;align-items:center;gap:var(--dk-3);padding:0 var(--dk-3);\n background:var(--dk-bg);border-bottom:1px solid var(--dk-border);\n font-family:var(--dk-font);color:var(--dk-fg);font-size:13px;\n overflow-x:auto;overflow-y:visible;scrollbar-width:thin}\n/* Nh\xF3m n\xFAt, ng\u0103n b\u1EB1ng v\u1EA1ch d\u1ECDc \u2014 m\u1EAFt ph\xE2n bi\u1EC7t \u0111\u01B0\u1EE3c "l\u01B0u" / "thu\u1ED9c t\xEDnh" / "thao t\xE1c" */\n.dk-grp{display:flex;align-items:center;gap:var(--dk-1);flex:none;\n padding-right:var(--dk-3);border-right:1px solid var(--dk-border)}\n.dk-grp:last-child{border-right:0;padding-right:0}\n.dk-grp.dk-right{margin-left:auto}\n\n.dk-btn{display:inline-flex;align-items:center;gap:6px;height:var(--dk-h-sm);\n padding:0 10px;border:1px solid transparent;border-radius:var(--dk-r);\n background:transparent;color:var(--dk-fg);font:inherit;font-weight:600;cursor:pointer;\n white-space:nowrap;transition:background .12s,border-color .12s}\n/* N\xFAt \u0111\u1ECBnh d\u1EA1ng ch\u1EEF: nh\xE3n l\xE0 CH\u1EEE (B/I/x\xB2/x\u2082) ch\u1EE9 kh\xF4ng ph\u1EA3i icon \u2014 quy \u01B0\u1EDBc ai c\u0169ng \u0111\u1ECDc \u0111\u01B0\u1EE3c.\n   C\u1EE1 c\u1ED1 \u0111\u1ECBnh cho 4 n\xFAt b\u1EB1ng nhau, ch\u1EEF \u1EDF gi\u1EEFa. */\n.dk-fmt{min-width:34px;justify-content:center;font-family:Georgia,"Times New Roman",serif;font-size:15px}\n.dk-fmt b{font-weight:800}\n.dk-fmt i{font-style:italic}\n/* \u0110\u1EA9y sup/sub xa h\u01A1n m\u1EB7c \u0111\u1ECBnh: \u1EDF c\u1EE1 n\xFAt nh\u1ECF, `vertical-align:super|sub` g\u1ED1c l\u1EC7ch qu\xE1 \xEDt\n   n\xEAn hai n\xFAt x\xB2 v\xE0 x\u2082 nh\xECn GI\u1ED0NG H\u1EC6T nhau (\u0111\xE3 th\u1EA5y tr\xEAn \u1EA3nh ch\u1EE5p). */\n/* D\u1ECBch sup/sub b\u1EB1ng `position:relative` + `top` \u2014 `vertical-align` g\u1ED1c l\u1EC7ch qu\xE1 \xEDt n\xEAn trong\n   n\xFAt nh\u1ECF (flex, c\u0103n gi\u1EEFa) hai n\xFAt x\xB2 v\xE0 x\u2082 nh\xECn GI\u1ED0NG H\u1EC6T nhau. \u0110\xE3 ki\u1EC3m b\u1EB1ng \u1EA3nh ch\u1EE5p. */\n.dk-fmt sup,.dk-fmt sub{font-size:11px;font-weight:700;position:relative;vertical-align:baseline}\n.dk-fmt sup{top:-5px}\n.dk-fmt sub{top:4px}\n/* \xD4 m\xE0u t\u1EF1 do d\u01B0\u1EDBi 7 swatch g\u1EE3i \xFD */\n.dk-pick{display:flex;align-items:center;gap:8px;margin-top:8px;padding-top:8px;\n border-top:1px solid var(--dk-border);font-size:12.5px;color:var(--dk-fg-2);cursor:pointer}\n.dk-pick input[type=color]{width:30px;height:24px;padding:0;border:1px solid var(--dk-border);\n border-radius:6px;background:none;cursor:pointer}\n.dk-btn:hover{background:var(--dk-bg-3)}\n.dk-btn:focus-visible{outline:none;box-shadow:var(--dk-ring)}\n.dk-btn[disabled]{opacity:.4;cursor:not-allowed}\n.dk-btn.primary{background:var(--dk-accent);color:var(--dk-accent-fg);border-color:transparent}\n.dk-btn.primary:hover{filter:brightness(1.06)}\n.dk-btn.danger{color:var(--dk-danger)}\n.dk-btn.danger:hover{background:var(--dk-danger-bg)}\n.dk-btn.danger-ghost{color:var(--dk-fg-2)}\n.dk-btn.ghost{color:var(--dk-fg-2);padding:0 8px}\n.dk-caret{opacity:.5;margin-left:-2px}\n.dk-lb{line-height:1}\n/* Panel h\u1EB9p: gi\u1EA5u ch\u1EEF, gi\u1EEF icon. D\xF9ng CONTAINER QUERY ch\u1EE9 kh\xF4ng `@media` \u2014 media \u0111o\n   C\u1EECA S\u1ED4, m\xE0 deck n\u1EB1m trong panel h\u1EB9p gi\u1EEFa m\xE0n h\xECnh r\u1ED9ng th\xEC \u0111o c\u1EEDa s\u1ED5 l\xE0 sai h\u1EB3n\n   (m\xE0n 1920 nh\u01B0ng panel ch\u1EC9 730px v\u1EABn ph\u1EA3i r\xFAt g\u1ECDn). */\n.dk-toolbar{container-type:inline-size;container-name:dktb}\n/* V\u1EEBa: \u0111\u1EE7 ch\u1ED7 cho m\u1ECDi nh\xE3n */\n@container dktb (max-width:980px){\n  /* Nh\xE3n c\u1EE7a nh\xF3m THAO T\xC1C r\xFAt tr\u01B0\u1EDBc \u2014 icon c\xE1c n\xFAt n\xE0y (\uFF0B \u29C9 \u{1F441} \u{1F5D1}) \u0111\xE3 \u0111\u1EE7 r\xF5 ngh\u0129a,\n     trong khi "B\u1ED1 c\u1EE5c"/"M\xE0u"/"Ghi ch\xFA" m\u1EA5t ch\u1EEF l\xE0 kh\xF3 \u0111o\xE1n h\u01A1n nhi\u1EC1u. */\n  #dk-add .dk-lb,#dk-dup .dk-lb,#dk-skip .dk-lb,#dk-del .dk-lb,#dk-present .dk-lb{display:none}\n}\n@container dktb (max-width:720px){\n  .dk-btn .dk-lb{display:none}\n  .dk-btn#dk-layout .dk-lb{display:inline}   /* tr\u1EEB t\xEAn b\u1ED1 c\u1EE5c: \u0111\xF3 l\xE0 TH\xD4NG TIN, kh\xF4ng ph\u1EA3i nh\xE3n n\xFAt */\n  .dk-pos{display:none}\n}\n/* Tr\xECnh duy\u1EC7t ch\u01B0a c\xF3 container query \u2192 l\xF9i v\u1EC1 \u0111o c\u1EEDa s\u1ED5 (v\u1EABn h\u01A1n kh\xF4ng c\xF3 g\xEC) */\n@supports not (container-type: inline-size){\n  @media (max-width:900px){ .dk-btn .dk-lb{display:none} .dk-btn#dk-layout .dk-lb{display:inline} }\n}\n\n.dk-status{font-size:12px;color:var(--dk-fg-2);white-space:nowrap;padding-left:var(--dk-2)}\n.dk-status.ed-saved{color:var(--dk-ok);font-weight:700}\n.dk-status.ed-dirty{color:var(--dk-warn)}\n.dk-status.ed-error{color:#fff;font-weight:800;background:#c0392b;padding:3px 10px;border-radius:var(--dk-r-sm)}\n.dk-pos{font-size:12px;color:var(--dk-fg-2);font-variant-numeric:tabular-nums;padding:0 var(--dk-2)}\n.dk-pos-sep{opacity:.45;margin:0 2px}\n\n/* Popover \u2014 CSS thu\u1EA7n, kh\xF4ng Radix (gi\u1EEF t\xEDnh \u0111\u1ED9c l\u1EADp cho Angular) */\n.dk-pop{position:absolute;z-index:40;min-width:210px;max-width:min(360px,90vw);\n background:var(--dk-bg-2);border:1px solid var(--dk-border-2);border-radius:var(--dk-r-md);\n box-shadow:var(--dk-shadow-lg);padding:var(--dk-3);display:flex;flex-direction:column;gap:var(--dk-2)}\n.dk-pop-t{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--dk-fg-3)}\n.dk-pop-hint{font-size:11.5px;color:var(--dk-fg-2);line-height:1.45}\n.dk-sw{display:flex;flex-wrap:wrap;gap:var(--dk-2)}\n.dk-swatch{width:28px;height:28px;border-radius:var(--dk-r-sm);border:2px solid transparent;\n cursor:pointer;padding:0;box-shadow:0 2px 6px rgba(0,0,0,.35)}\n.dk-swatch.on{border-color:#fff;box-shadow:0 0 0 2px var(--dk-accent)}\n.dk-swatch.reset{background:var(--dk-bg-3);color:var(--dk-fg-2);display:flex;\n align-items:center;justify-content:center;font-size:13px}\n.dk-ta{width:100%;background:var(--dk-bg);color:var(--dk-fg);border:1px solid var(--dk-border-2);\n border-radius:var(--dk-r);padding:8px 10px;font:inherit;font-size:12.5px;line-height:1.5;resize:vertical}\n.dk-ta:focus{outline:none;border-color:var(--dk-accent);box-shadow:var(--dk-ring)}\n.dk-w{width:100%;justify-content:center}\n\n/* `flex:none` \u2014 thi\u1EBFu l\xE0 flex-column \xC9P thumbnail co l\u1EA1i r\u1ED3i tr\xE0n kh\u1ECFi m\xE0n h\xECnh\n   (\u0111\xE3 g\u1EB7p th\u1EADt: thumbnail th\u1EE9 10 l\xF2i ra ngo\xE0i, kh\xF4ng cu\u1ED9n t\u1EDBi \u0111\u01B0\u1EE3c). */\n.rail-it{flex:none;aspect-ratio:16/9}\n.rail-thumb{width:100%;height:100%}\n.rail-dup,.rail-del{display:flex;align-items:center;justify-content:center;font-size:11px}\n\n/* V\xF9ng slide ph\u1EA3i TR\u1EEA \u0111\xFAng chi\u1EC1u cao thanh c\xF4ng c\u1EE5, kh\xF4ng th\xEC slide l\u1EC7ch xu\u1ED1ng d\u01B0\u1EDBi\n   (thanh chi\u1EBFm 52px m\xE0 `.stage` v\u1EABn t\xEDnh t\u1EEB \u0111\u1EC9nh). */\n.lp-edit .stage{top:var(--dk-h-bar,52px);height:auto;bottom:0}\n/* Thanh \u0111i\u1EC1u h\u01B0\u1EDBng c\u0169 (\u2039 \u203A \u26F6) tr\xF9ng ch\u1EE9c n\u0103ng v\u1EDBi thumbnail + thanh c\xF4ng c\u1EE5 \u2192 \u1EA9n khi S\u1EECA,\n   gi\u1EEF nguy\xEAn khi ch\u1EC9 XEM. */\n.lp-edit .nav,.lp-edit #sprog{display:none}\n/* Thanh c\xF4ng c\u1EE5 h\u1EB9p: cho cu\u1ED9n ngang v\xE0 gi\u1EEF nh\xF3m cu\u1ED1i lu\xF4n th\u1EA5y \u0111\u01B0\u1EE3c */\n.dk-toolbar{scroll-padding-right:var(--dk-3)}\n.dk-toolbar::-webkit-scrollbar{height:6px}\n.dk-toolbar::-webkit-scrollbar-thumb{background:var(--dk-border-2);border-radius:3px}\n\n/* Ph\u1EA3i \u0111\u1EB7t SAU lu\u1EADt `.dk-toolbar` \u2014 c\xF9ng \u0111\u1ED9 \u01B0u ti\xEAn th\xEC lu\u1EADt \u0111\u1EE9ng sau th\u1EAFng, \u0111\u1EC3 tr\u01B0\u1EDBc\n   l\xE0 n\u1EC1n c\u1EA3nh b\xE1o kh\xF4ng bao gi\u1EDD hi\u1EC7n (\u0111\xE3 v\u1EA5p: test \u0111\u1ECF m\xE0 m\u1EAFt th\u01B0\u1EDDng kh\xF4ng nh\u1EADn ra). */\n.dk-toolbar:has(.ed-error){background:var(--dk-danger-bg);border-bottom-color:#7a3030}\n\n/* Ti\xEAu \u0111\u1EC1 nh\xF3m trong rail \u2014 suy t\u1EEB slide `section`/`hero` (m\u1ED1c m\u1EDF \u0111\u1EA7u m\u1ED7i ti\u1EBFt).\n   D\xEDnh tr\xEAn \u0111\u1EA7u khi cu\u1ED9n: b\xE0i 156 slide th\xEC ph\u1EA3i lu\xF4n bi\u1EBFt \u0111ang \u1EDF ti\u1EBFt n\xE0o. */\n.rail-g{position:sticky;top:-4px;z-index:2;font-size:10.5px;font-weight:800;letter-spacing:.04em;\n  text-transform:uppercase;color:#9aa6c0;background:var(--dk-bg);padding:7px 4px 5px;\n  border-bottom:1px solid var(--dk-border);margin:6px 0 0;\n  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.rail-g:first-child{margin-top:0}\n.rail-it[hidden],.rail-g[hidden]{display:none}\n/* Tu\u1EF3 ch\u1ECDn trong popover l\u1ECDc */\n.dk-fopt{display:block;width:100%;text-align:left;background:none;border:0;border-radius:7px;\n  padding:7px 9px;cursor:pointer;color:inherit}\n.dk-fopt:hover{background:var(--dk-hover,rgba(255,255,255,.07))}\n.dk-fopt.on{background:var(--dk-accent);color:#111}\n.dk-fopt b{display:block;font-size:12.5px;font-weight:700}\n.dk-fopt span{display:block;font-size:11px;opacity:.7}\n.dk-btn.on{background:var(--dk-accent);color:#111}\n/* C\u1EA3nh b\xE1o t\u01B0\u01A1ng ph\u1EA3n trong popover m\xE0u \u2014 C\u1EA2NH B\xC1O, kh\xF4ng ch\u1EB7n: m\xE0u nh\u1EA5n c\xF3 l\xFAc ch\u1EC9 \u0111\u1EC3\n   trang tr\xED, ch\u1EB7n l\xE0 ph\u1EE7 nh\u1EADn ph\xE1n \u0111o\xE1n c\u1EE7a gi\xE1o vi\xEAn. */\n.dk-warn{margin-top:8px;padding:7px 9px;border-radius:7px;font-size:11.5px;line-height:1.45;\n  background:#3a2d10;color:#f6d98a;border:1px solid #6b5320}\n.dk-warn[hidden]{display:none}\n';

// src/styles/print.css
var print_default = '/* \u2550\u2550 IN / L\u01AFU PDF \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   Ch\u1EC9 n\u1EA1p v\xE0o file HTML t\u1EF1 ch\u1EE9a (`toStandaloneHtml`) \u2014 KH\xD4NG n\u1EA1p trong app.\n   V\xEC sao: panel Slide n\u1EB1m l\u1ECDt gi\u1EEFa giao di\u1EC7n app; in t\u1EEB \u0111\xF3 th\xEC tr\xECnh duy\u1EC7t k\xE9o theo c\u1EA3\n   sidebar, thanh c\xF4ng c\u1EE5, menu. B\u1EA3n HTML t\u1EF1 ch\u1EE9a ch\u1EC9 c\xF3 deck n\xEAn in ra \u0111\xFAng th\u1EE9 GV mu\u1ED1n.\n\n   Tr\xEAn m\xE0n h\xECnh, 46 b\u1ED1 c\u1EE5c x\u1EBFp CH\u1ED2NG l\xEAn nhau: `#scaler>.slide{position:absolute;inset:0;\n   display:none}` v\xE0 ch\u1EC9 `.active` m\u1EDBi `display:block`. In th\u1EB3ng ra \u0111\u01B0\u1EE3c \u0110\xDANG M\u1ED8T slide.\n   N\xEAn kh\u1ED1i `@media print` d\u01B0\u1EDBi \u0111\xE2y ph\u1EA3i th\xE1o c\u1EA3 ba th\u1EE9: ch\u1ED3ng l\u1EDBp, \u1EA9n/hi\u1EC7n, v\xE0\n   `transform:scale()` m\xE0 player \u0111\u1EB7t l\xEAn `#scaler` \u0111\u1EC3 v\u1EEBa khung tr\xECnh duy\u1EC7t.\n\n   KH\xD4NG d\xF9ng `transform:scale` \u0111\u1EC3 \xE9p slide v\u1EEBa kh\u1ED5 gi\u1EA5y: c\xF9ng l\xFD do \u0111\xE3 ghi \u1EDF `--dk-fs`\n   trong base.css \u2014 n\xF3 l\xE0m h\u1ED9p bao l\u1EC7ch c\u1EE1 ch\u1EEF. \u1EDE \u0111\xE2y d\xF9ng `@page{size:landscape}` + k\xEDch\n   th\u01B0\u1EDBc th\u1EADt, \u0111\u1EC3 tr\xECnh duy\u1EC7t t\u1EF1 thu cho v\u1EEBa m\xE9p gi\u1EA5y. */\n@media print {\n  /* Kh\u1ED5 \u0111\xFAng b\u1EB1ng slide, l\u1EC1 0 \u2014 slide 16:9 t\u1EF1 n\xF3 \u0111\xE3 c\xF3 l\u1EC1 trong (`--pad`), th\xEAm l\u1EC1 gi\u1EA5y l\xE0\n     th\u1EEBa v\xE0 l\xE0m slide co l\u1EA1i gi\u1EEFa trang tr\u1EAFng.\n\n     \u26A0\uFE0F KH\xD4NG th\xEAm t\u1EEB kho\xE1 `landscape` sau k\xEDch th\u01B0\u1EDBc. `size: <length> <length> landscape` l\xE0\n     CSS SAI: `landscape` ch\u1EC9 \u0111i k\xE8m kh\u1ED5 C\xD3 T\xCAN (A4, Letter\u2026). Chrome b\u1ECF nguy\xEAn khai b\xE1o r\u1ED3i\n     r\u01A1i v\u1EC1 Letter D\u1ECCC \u2014 \u0111o \u0111\u01B0\u1EE3c 612\xD7792pt, slide b\u1ECB c\u1EAFt m\u1EA5t n\u1EEDa. Ghi k\xEDch th\u01B0\u1EDBc t\u01B0\u1EDDng minh\n     l\xE0 \u0111\xE3 ngang r\u1ED3i (1280>720). \u0110o sau khi s\u1EEDa: 960\xD7540pt = \u0111\xFAng 1280\xD7720px \u1EDF 72dpi. */\n  @page { size: 1280px 720px; margin: 0; }\n\n  html, body { width: auto; height: auto; overflow: visible; background: #fff; }\n\n  /* N\u1EC1n t\u1ED1i c\u1EE7a khung deck (radial-gradient) t\u1ED1n m\u1EF1c m\xE0 kh\xF4ng mang th\xF4ng tin.\n\n     `!important` \u1EDF `height`/`overflow` l\xE0 B\u1EAET BU\u1ED8C, kh\xF4ng ph\u1EA3i cho ti\u1EC7n: app ch\u1EE7 nh\xE0 \u0111\u1EB7t\n     k\xEDch th\u01B0\u1EDBc khung b\u1EB1ng style INLINE (`<div id="deck" style="height:100vh">`) v\xE0 `mountDeck`\n     t\u1EF1 th\xEAm `overflow:hidden` c\u0169ng inline. Inline th\u1EAFng m\u1ECDi selector, n\xEAn kh\xF4ng c\xF3\n     `!important` th\xEC khung v\u1EABn cao 900px trong khi c\xE1c slide x\u1EBFp d\u1ECDc t\u1EDBi 6480px \u21D2 b\u1ECB C\u1EAET c\xF2n\n     **\u0111\xFAng 1 trang**. \u0110\xE3 \u0111o: 1 trang thay v\xEC 9. */\n  .dk-root {\n    height: auto !important; overflow: visible !important;\n    background: #fff;\n    position: static;\n  }\n\n  /* Th\xE1o l\u1EDBp c\u0103n gi\u1EEFa + th\xE1o scale c\u1EE7a player. `!important` l\xE0 c\u1EA7n thi\u1EBFt \u1EDF \u0111\xE2y: `transform`\n     do JS \u0111\u1EB7t inline (`sc.style.transform`), specificity th\u01B0\u1EDDng kh\xF4ng th\u1EAFng \u0111\u01B0\u1EE3c. */\n  .stage { position: static; display: block; }\n  .scaler {\n    width: auto !important; height: auto !important;\n    transform: none !important;\n  }\n\n  /* M\u1ED6I SLIDE M\u1ED8T TRANG. \u0110\xE2y l\xE0 ph\u1EA7n ch\xEDnh:\n       \u2022 absolute \u2192 RELATIVE: th\xF4i ch\u1ED3ng l\xEAn nhau nh\u01B0ng V\u1EAAN l\xE0 containing block\n       \u2022 display:block cho M\u1ECCI slide, k\u1EC3 c\u1EA3 kh\xF4ng .active\n       \u2022 break-after: m\u1ED7i slide chi\u1EBFm tr\u1ECDn m\u1ED9t trang gi\u1EA5y\n       \u2022 break-inside:avoid: c\u1EA5m c\u1EAFt \u0111\xF4i m\u1ED9t slide qua hai trang\n\n     \u26A0\uFE0F PH\u1EA2I l\xE0 `relative`, KH\xD4NG \u0111\u01B0\u1EE3c `static`. 37 lu\u1EADt trong `base.css` d\xF9ng\n     `position:absolute` (`.hd`, `.hero .msg`, `.foot`\u2026) v\xE0 neo v\xE0o `.slide` v\xEC slide v\u1ED1n\n     `absolute`. \u0110\u1ED5i slide th\xE0nh `static` l\xE0 **xo\xE1 containing block** \u21D2 ch\xFAng nh\u1EA3y l\xEAn neo v\xE0o\n     `#scaler` \u21D2 ti\xEAu \u0111\u1EC1 c\u1EE7a C\u1EA2 9 SLIDE ch\u1ED3ng l\xEAn nhau \u1EDF \u0111\u1EA7u trang 1. \u0110\xE3 in ra gi\u1EA5y th\u1EA5y t\u1EADn\n     m\u1EAFt; `relative` v\u1EEBa v\xE0o \u0111\u01B0\u1EE3c lu\u1ED3ng th\u01B0\u1EDDng v\u1EEBa gi\u1EEF nguy\xEAn m\u1ED1c neo. */\n  #scaler > .slide {\n    position: relative !important;\n    display: block !important;\n    width: 1280px; height: 720px;\n    margin: 0;\n    border-radius: 0;\n    box-shadow: none;\n    break-inside: avoid; page-break-inside: avoid;\n    break-after: page;  page-break-after: always;\n    /* B\u1ECF hi\u1EC7u \u1EE9ng chuy\u1EC3n \u2014 animation l\xFAc in cho ra slide m\u1EDD ho\u1EB7c l\u1EC7ch. */\n    animation: none !important;\n  }\n  #scaler > .slide:last-child { break-after: auto; page-break-after: auto; }\n\n  /* Slide GV \u0111\xE3 t\u1EAFt (b\u1ECF qua) th\xEC kh\xF4ng in ra gi\u1EA5y \u2014 c\xF9ng ngh\u0129a v\u1EDBi l\xFAc tr\xECnh chi\u1EBFu. */\n  #scaler > .slide.skipped { display: none !important; }\n\n  /* N\u1EC1n m\xE0u/\u1EA3nh c\u1EE7a slide PH\u1EA2I \u0111\u01B0\u1EE3c in. M\u1EB7c \u0111\u1ECBnh tr\xECnh duy\u1EC7t b\u1ECF n\u1EC1n \u0111\u1EC3 ti\u1EBFt ki\u1EC7m m\u1EF1c, m\xE0\n     slide t\u1ED1i (`.dk-dark`) m\u1EA5t n\u1EC1n th\xEC th\xE0nh ch\u1EEF tr\u1EAFng tr\xEAn gi\u1EA5y tr\u1EAFng \u2014 kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c g\xEC. */\n  #scaler > .slide, #scaler > .slide * {\n    -webkit-print-color-adjust: exact;\n    print-color-adjust: exact;\n  }\n\n  /* \u0110i\u1EC1u khi\u1EC3n ch\u1EC9 c\xF3 ngh\u0129a tr\xEAn m\xE0n h\xECnh. T\xEAn l\u1EA5y t\u1EEB `renderStage`/`renderEditChrome`:\n     nav + thanh ti\u1EBFn \u0111\u1ED9, v\xE0 chrome c\u1EE7a tr\xECnh s\u1EEDa n\u1EBFu ai \u0111\xF3 in l\xFAc \u0111ang b\u1EADt `edit`. */\n  .nav, #sprog, .dk-toolbar, #lp-rail, #lp-picker { display: none !important; }\n}\n';

// src/styles/index.ts
var BASE_CSS = base_default;
var EDIT_CSS = tokens_default + edit_default;
var PRINT_CSS = print_default;

// src/render.ts
function renderSlide(sl, ctx) {
  const kind = BUILDERS[sl.kind] ? sl.kind : "content";
  const fn = BUILDERS[kind];
  const cls = HERO_CLASS[kind] ? `slide ${HERO_CLASS[kind]}` : "slide chrome dots";
  const active = (ctx.pos ?? ctx.idx) === 0 ? " active" : "";
  const bar = ctx.edit && sl.imagePrompt ? '<span class="edregen" hidden></span>' : "";
  const newattr = ctx.isNew ? ' data-new="1"' : "";
  const sk = sl.skipped ? " skipped" : "";
  const styleattr = sl.accent ? ` style="--sl-gold:${sl.accent};--sl-rail:${sl.accent}"` : "";
  const notes = sl.notes ? ` data-notes="${esc(sl.notes)}"` : "";
  const t = (sl.title || sl.subtitle || nonEmpty(sl.bullets)[0] || kind).trim();
  const titleAttr = t ? ` data-title="${esc(t.slice(0, 180))}"` : "";
  const cs = sl.columns || [];
  const caps = ` data-nb="${nonEmpty(sl.bullets).length}" data-nc="${cs.length}" data-nct="${cs.filter((c) => c?.title).length}" data-nf="${(sl.images || []).length + (sl.image ? 1 : 0)}"`;
  const lock = sl.locked ? ' data-locked="1"' : "";
  const tt = titleBucket(sl.title);
  const ttAttr = tt > 1 ? ` data-tt="${tt}"` : "";
  return `<section class="${cls}${active}${sk}" data-index="${ctx.idx}" data-id="${esc(sl.id)}" data-kind="${esc(kind)}"${newattr}${styleattr}${notes}${titleAttr}${caps}${lock}${ttAttr}>${bar}${fn(sl, ctx)}</section>`;
}
function titleBucket(title) {
  const n = (title || "").trim().length;
  return n <= 46 ? 1 : n <= 92 ? 2 : 3;
}
function renderSections(deck, opts = {}) {
  const d = normalizeDeck(deck);
  const total = d.slides.length;
  const out = d.slides.map((sl, pos) => renderSlide(sl, {
    idx: pos,
    pos,
    edit: opts.edit,
    assets: d.assets,
    kicker: sl.kicker || "",
    foot: opts.foot ?? d.foot ?? "",
    page: pos + 1,
    total
  }));
  if (!out.length) {
    out.push('<section class="slide chrome active" data-index="0"><div class="hd"><div class="ttl">Ch\u01B0a c\xF3 slide</div></div></section>');
  }
  return out.join("");
}
function renderEditChrome() {
  return '<div id="dk-toolbar" class="dk-toolbar"></div><aside id="lp-rail"></aside>';
}
function renderStage(deck, opts = {}) {
  const d = normalizeDeck(deck);
  const { w, h } = d.size || DEFAULT_SIZE;
  return (opts.edit ? renderEditChrome() : "") + `<div class="stage"><div class="scaler" id="scaler" data-tr="${esc(d.transition)}" style="width:${w}px;height:${h}px">${renderSections(d, opts)}</div></div><div class="nav"><button id="prev">\u2039</button><span class="counter" id="cnt">1 / 1</span><button id="next">\u203A</button><button id="fs">\u26F6</button></div><div id="sprog"></div>`;
}
function deckCss(deck, opts = {}) {
  const css = BASE_CSS + themeCss(deck.theme || DEFAULT_THEME, ".dk-root") + (opts.edit ? EDIT_CSS : "");
  return `@layer deck-kit {
${css}
}
${PRINT_CSS}`;
}

// src/player.ts
function attachPlayer(root, opts = {}) {
  const W = opts.w || 1280, H = opts.h || 720;
  const q = (sel) => root.querySelector(sel);
  const sc = q("#scaler");
  let S = [];
  let cur = 0;
  const collect2 = () => {
    S = Array.from(root.querySelectorAll("#scaler > .slide"));
  };
  function fit() {
    if (!sc) return;
    const stage = q(".stage");
    const box = stage?.getBoundingClientRect();
    let aw = box?.width || 0;
    let ah = box?.height || 0;
    if (aw < 2 || ah < 2) {
      const reserved = opts.reserve ? opts.reserve() : (q("#lp-rail")?.offsetWidth || 0) + (q("#lp-side")?.offsetWidth || 0);
      aw = innerWidth - reserved;
      ah = innerHeight;
    }
    const s = Math.min((aw - 48) / W, (ah - 96) / H);
    if (s > 0) sc.style.transform = `scale(${s})`;
  }
  function show(i) {
    if (!S.length) return;
    cur = Math.max(0, Math.min(S.length - 1, i));
    S.forEach((s, k) => s.classList.toggle("active", k === cur));
    const cnt = q("#cnt");
    if (cnt) cnt.textContent = `${cur + 1} / ${S.length}`;
    const p = q("#sprog");
    if (p) p.style.width = `${(cur + 1) / S.length * 100}%`;
    opts.onSlideChange?.(cur, S.length);
  }
  function fullscreen() {
    const el = root instanceof Document ? root.documentElement : root;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }
  const onResize = () => fit();
  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      show(cur + 1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      show(cur - 1);
      e.preventDefault();
    } else if (e.key === "Home") show(0);
    else if (e.key === "End") show(S.length - 1);
    else if (e.key === "f" || e.key === "F") fullscreen();
  };
  addEventListener("resize", onResize);
  let ro = null;
  const stageEl = q(".stage");
  if (stageEl && typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => fit());
    ro.observe(stageEl);
  }
  if (opts.keyboard !== false) addEventListener("keydown", onKey);
  const prev = q("#prev"), next = q("#next"), fsb = q("#fs");
  const goPrev = () => show(cur - 1), goNext = () => show(cur + 1);
  prev?.addEventListener("click", goPrev);
  next?.addEventListener("click", goNext);
  fsb?.addEventListener("click", fullscreen);
  collect2();
  fit();
  show(0);
  return {
    show,
    next: goNext,
    prev: goPrev,
    cur: () => cur,
    count: () => S.length,
    fit,
    fullscreen,
    refresh() {
      collect2();
      if (cur >= S.length) cur = S.length - 1;
      show(cur);
    },
    destroy() {
      removeEventListener("resize", onResize);
      ro?.disconnect();
      ro = null;
      removeEventListener("keydown", onKey);
      prev?.removeEventListener("click", goPrev);
      next?.removeEventListener("click", goNext);
      fsb?.removeEventListener("click", fullscreen);
    }
  };
}

// src/layouts/manifest.ts
var LAYOUTS = [
  // ── Cơ bản (danh sách) ────────────────────────────────────────────────────
  { key: "content", label: "N\u1ED9i dung", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, renders: ["title", "bullets", "image"] },
  { key: "twocol", label: "Hai c\u1ED9t", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, needs: { bullets: 3 }, renders: ["title", "bullets"] },
  { key: "cards", label: "Th\u1EBB l\u01B0\u1EDBi", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, needs: { bullets: 2 }, fits: { bullet: 60, bulletCount: 6 }, renders: ["title", "bullets"] },
  { key: "numbered", label: "\u0110\xE1nh s\u1ED1", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "checklist", label: "Danh s\xE1ch \u2713", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "toc", label: "M\u1EE5c l\u1EE5c", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "agenda", label: "M\u1EE5c l\u1EE5c c\xF3 m\u1ED1c", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, needs: { bullets: 2 }, renders: ["title", "bullets"] },
  { key: "blank", label: "Khung tr\u1EAFng", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, renders: ["title", "bullets"] },
  { key: "goals", label: "M\u1EE5c ti\xEAu", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, renders: ["title", "bullets"] },
  { key: "remember", label: "Ghi nh\u1EDB", group: "C\u01A1 b\u1EA3n", shape: "list", selectable: true, renders: ["title", "bullets"] },
  { key: "define", label: "\u0110\u1ECBnh ngh\u0129a", group: "Nh\u1EA5n m\u1EA1nh", shape: "list", selectable: true, renders: ["title", "bullets"] },
  { key: "example", label: "V\xED d\u1EE5", group: "Nh\u1EA5n m\u1EA1nh", shape: "list", selectable: true, renders: ["title", "bullets"] },
  // note/define có ý dài TB 123, max 413 ký tự (80 slide thật, đo ~07/2026) — gạch đầu dòng
  // làm vỡ vụn.
  { key: "defcard", label: "Th\u1EBB \u0111\u1ECBnh ngh\u0129a", group: "Nh\u1EA5n m\u1EA1nh", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  // ── Số liệu / So sánh (cột) ───────────────────────────────────────────────
  { key: "bignum", label: "S\u1ED1 l\u1EDBn", group: "S\u1ED1 li\u1EC7u", shape: "columns", selectable: true, needs: { columnsWithTitle: 1 }, maxColumns: 3, fits: { title: 60, colTitle: 18 }, renders: ["title", "columns"] },
  { key: "metrics", label: "Th\u1EBB s\u1ED1", group: "S\u1ED1 li\u1EC7u", shape: "columns", selectable: true, needs: { columnsWithTitle: 2 }, maxColumns: 4, fits: { title: 60, colTitle: 22 }, renders: ["title", "columns"] },
  { key: "kpirow", label: "D\xE3y ch\u1EC9 s\u1ED1", group: "S\u1ED1 li\u1EC7u", shape: "columns", selectable: true, needs: { columnsWithTitle: 2 }, maxColumns: 4, fits: { title: 60, colTitle: 18 }, renders: ["title", "columns"] },
  { key: "three", label: "Ba c\u1ED9t", group: "So s\xE1nh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 3, fits: { colTitle: 40 }, renders: ["title", "columns"] },
  { key: "compare3", label: "So s\xE1nh 3 c\u1ED9t", group: "So s\xE1nh", shape: "columns", selectable: true, needs: { columnsWithTitle: 2 }, maxColumns: 3, fits: { colTitle: 40 }, renders: ["title", "columns"] },
  { key: "compare", label: "So s\xE1nh", group: "So s\xE1nh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 2, fits: { colTitle: 40 }, renders: ["title", "columns"] },
  { key: "proscons", label: "\u01AFu / Nh\u01B0\u1EE3c", group: "So s\xE1nh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 2, renders: ["title", "columns"] },
  { key: "quadrant", label: "Ma tr\u1EADn 2\xD72", group: "So s\xE1nh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 4, renders: ["title", "columns"] },
  { key: "comparetable", label: "B\u1EA3ng so s\xE1nh", group: "So s\xE1nh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 2, renders: ["title", "columns"] },
  // Bảng biến thiên: 9/12 bảng trong dữ liệu thật (đo ~07/2026) là loại RỘNG 6–10 cột mà `comparetable`
  // (tối đa 2 cột) và `table` (co dúm ở góc) đều không kham nổi.
  { key: "tablewide", label: "B\u1EA3ng r\u1ED9ng", group: "So s\xE1nh", shape: "verbatim", selectable: true, renders: ["title", "table"] },
  { key: "feature", label: "\u0110\u1EB7c \u0111i\u1EC3m", group: "So s\xE1nh", shape: "columns", selectable: true, needs: { columns: 2 }, maxColumns: 4, renders: ["title", "columns"] },
  // ── Quy trình (danh sách có thứ tự) ───────────────────────────────────────
  { key: "steps", label: "C\xE1c b\u01B0\u1EDBc", group: "Quy tr\xECnh", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "arrow", label: "M\u0169i t\xEAn", group: "Quy tr\xECnh", shape: "list", selectable: true, needs: { bullets: 1 }, fits: { bullet: 40, bulletCount: 4 }, renders: ["title", "bullets"] },
  { key: "timeline", label: "D\xF2ng th\u1EDDi gian", group: "Quy tr\xECnh", shape: "list", selectable: true, needs: { bullets: 1 }, fits: { bullet: 48, bulletCount: 5 }, renders: ["title", "bullets"] },
  { key: "vtimeline", label: "M\u1ED1c d\u1ECDc", group: "Quy tr\xECnh", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "pyramid", label: "Kim t\u1EF1 th\xE1p", group: "Quy tr\xECnh", shape: "list", selectable: true, needs: { bullets: 2 }, fits: { bullet: 48, bulletCount: 5 }, renders: ["title", "bullets"] },
  { key: "funnel", label: "Ph\u1EC5u", group: "Quy tr\xECnh", shape: "list", selectable: true, needs: { bullets: 2 }, fits: { bullet: 48, bulletCount: 5 }, renders: ["title", "bullets"] },
  // ── Nhấn mạnh (tiêu đề lớn) ───────────────────────────────────────────────
  { key: "statement", label: "C\xE2u ch\u1ED1t", group: "Nh\u1EA5n m\u1EA1nh", shape: "headline", selectable: true, hero: true, fits: { title: 120 }, renders: ["title", "subtitle"] },
  { key: "spotlight", label: "\u0110i\u1EC3m nh\u1EA5n", group: "Nh\u1EA5n m\u1EA1nh", shape: "list", selectable: true, needs: { bullets: 1 }, renders: ["title", "bullets"] },
  { key: "quote", label: "Tr\xEDch d\u1EABn", group: "Nh\u1EA5n m\u1EA1nh", shape: "headline", selectable: true, hero: true, fits: { title: 120 }, renders: ["title", "subtitle"] },
  { key: "quoteauthor", label: "Tr\xEDch d\u1EABn c\xF3 t\xE1c gi\u1EA3", group: "Nh\u1EA5n m\u1EA1nh", shape: "headline", selectable: true, hero: true, fits: { title: 120 }, renders: ["title", "subtitle", "image"] },
  // ── Đặc biệt ──────────────────────────────────────────────────────────────
  { key: "hero", label: "B\xECa l\u1EDBn", group: "\u0110\u1EB7c bi\u1EC7t", shape: "headline", selectable: true, hero: true, fits: { title: 70 }, renders: ["title", "subtitle"] },
  { key: "split", label: "Chia \u0111\xF4i", group: "\u0110\u1EB7c bi\u1EC7t", shape: "headline", selectable: true, hero: true, renders: ["title", "subtitle", "bullets"] },
  { key: "section", label: "M\u1EDF ph\u1EA7n", group: "\u0110\u1EB7c bi\u1EC7t", shape: "headline", selectable: true, hero: true, fits: { title: 90 }, renders: ["title", "subtitle"] },
  { key: "gallery", label: "L\u01B0\u1EDBi \u1EA3nh", group: "\u0110\u1EB7c bi\u1EC7t", shape: "media", selectable: true, needs: { images: 2 }, renders: ["title", "images"] },
  { key: "imageleft", label: "\u1EA2nh tr\xE1i", group: "\u0110\u1EB7c bi\u1EC7t", shape: "media", selectable: true, needs: { images: 1 }, renders: ["title", "bullets", "image"] },
  { key: "imageright", label: "\u1EA2nh ph\u1EA3i", group: "\u0110\u1EB7c bi\u1EC7t", shape: "media", selectable: true, needs: { images: 1 }, renders: ["title", "bullets", "image"] },
  // ── Nguyên văn: KHÔNG cho chọn (dữ liệu lấy đúng từ giáo án, không bịa được) ──
  { key: "formula", label: "C\xF4ng th\u1EE9c", group: "Nguy\xEAn v\u0103n", shape: "verbatim", selectable: false, renders: ["title", "formula"] },
  { key: "figure", label: "H\xECnh", group: "Nguy\xEAn v\u0103n", shape: "verbatim", selectable: false, renders: ["title", "image"] },
  { key: "table", label: "B\u1EA3ng", group: "Nguy\xEAn v\u0103n", shape: "verbatim", selectable: false, renders: ["title", "table"] },
  { key: "formulasteps", label: "C\xF4ng th\u1EE9c + c\xE1c b\u01B0\u1EDBc", group: "Quy tr\xECnh", shape: "list", selectable: true, needs: { bullets: 1 }, fits: { bullet: 70, bulletCount: 5 }, renders: ["title", "bullets", "formula"] },
  { key: "note", label: "L\u01B0u \xFD", group: "Nguy\xEAn v\u0103n", shape: "verbatim", selectable: false, renders: ["title", "bullets"] },
  { key: "question", label: "C\xE2u h\u1ECFi", group: "Nguy\xEAn v\u0103n", shape: "verbatim", selectable: false, renders: ["title", "question"] }
];
var LAYOUT_BY_KEY = Object.fromEntries(LAYOUTS.map((l) => [l.key, l]));
var LAYOUT_KEYS = LAYOUTS.map((l) => l.key);
var SELECTABLE_LAYOUTS = LAYOUTS.filter((l) => l.selectable);
var GROUP_ORDER = ["C\u01A1 b\u1EA3n", "S\u1ED1 li\u1EC7u", "So s\xE1nh", "Quy tr\xECnh", "Nh\u1EA5n m\u1EA1nh", "\u0110\u1EB7c bi\u1EC7t"];

// src/layouts/convert.ts
var nonEmpty2 = (a) => (a || []).filter((x) => String(x || "").trim()).length;
var colCount = (c) => (c || []).length;
var colWithTitle = (c) => (c || []).filter((x) => String(x?.title || "").trim()).length;
var imgCount = (s) => (s.images || []).length + (s.image ? 1 : 0);
function canConvert(slide, to) {
  const def = LAYOUT_BY_KEY[to];
  if (!def) return { ok: false, reason: "B\u1ED1 c\u1EE5c kh\xF4ng t\u1ED3n t\u1EA1i" };
  if (!def.selectable) return { ok: false, reason: "B\u1ED1 c\u1EE5c d\xE0nh cho n\u1ED9i dung nguy\xEAn v\u0103n, kh\xF4ng ch\u1ECDn tay \u0111\u01B0\u1EE3c" };
  if (slide.locked) return { ok: false, reason: "Slide n\u1ED9i dung nguy\xEAn v\u0103n \u2014 kh\xF4ng \u0111\u1ED5i b\u1ED1 c\u1EE5c" };
  const nb = nonEmpty2(slide.bullets);
  const nc = colCount(slide.columns);
  const nct = colWithTitle(slide.columns);
  const need = def.needs || {};
  let transform;
  if (need.images && imgCount(slide) < need.images) {
    return { ok: false, reason: `C\u1EA7n \xEDt nh\u1EA5t ${need.images} \u1EA3nh trong slide (hi\u1EC7n ${imgCount(slide)})` };
  }
  if (need.columns || need.columnsWithTitle) {
    const want = Math.max(need.columns || 0, need.columnsWithTitle || 0);
    const have = need.columnsWithTitle ? Math.max(nc, nct) : nc;
    if (have < want) {
      if (nb >= Math.min(2, want)) transform = "bulletsToColumns";
      else return { ok: false, reason: `C\u1EA7n \u2265${want} c\u1ED9t, ho\u1EB7c \u22652 \xFD \u0111\u1EC3 t\xE1ch th\xE0nh c\u1ED9t (hi\u1EC7n ${nb} \xFD)` };
    }
  }
  if (need.bullets && nb < need.bullets) {
    if (nc > 0) transform = "columnsToBullets";
    else return { ok: false, reason: `C\u1EA7n \xEDt nh\u1EA5t ${need.bullets} \xFD (hi\u1EC7n ${nb})` };
  }
  let willHide = 0;
  if (!def.renders.includes("bullets") && transform !== "bulletsToColumns") willHide += nb;
  if (!def.renders.includes("columns") && transform !== "columnsToBullets") willHide += nc;
  const fitWarning = checkFit(slide, def, transform);
  return {
    ok: true,
    willHide: willHide || void 0,
    transform,
    fitWarning: fitWarning.length ? fitWarning : void 0
  };
}
function checkFit(slide, def, transform) {
  const f = def.fits;
  if (!f) return [];
  const out = [];
  const title = String(slide.title || "").trim();
  if (f.title && title.length > f.title) {
    out.push(`Ti\xEAu \u0111\u1EC1 ${title.length} k\xFD t\u1EF1 \u2014 b\u1ED1 c\u1EE5c "${def.label}" h\u1EE3p v\u1EDBi ti\xEAu \u0111\u1EC1 d\u01B0\u1EDBi ${f.title}`);
  }
  const bs = (slide.bullets || []).map((b) => String(b || "")).filter((b) => b.trim());
  if (f.bulletCount && bs.length > f.bulletCount) {
    out.push(`${bs.length} \xFD \u2014 b\u1ED1 c\u1EE5c "${def.label}" v\u1EBD \u0111\u1EB9p nh\u1EA5t v\u1EDBi t\u1ED1i \u0111a ${f.bulletCount} \xFD`);
  }
  if (f.bullet) {
    const longest = bs.reduce((m, b) => Math.max(m, b.length), 0);
    if (longest > f.bullet) {
      out.push(`\xDD d\xE0i nh\u1EA5t ${longest} k\xFD t\u1EF1 \u2014 b\u1ED1 c\u1EE5c "${def.label}" h\u1EE3p v\u1EDBi \xFD ng\u1EAFn d\u01B0\u1EDBi ${f.bullet}`);
    }
  }
  if (f.colTitle) {
    const labels = transform === "bulletsToColumns" ? bs.slice(0, def.maxColumns ?? 4) : (slide.columns || []).map((c) => String(c?.title || ""));
    const longest = labels.reduce((m, t) => Math.max(m, t.length), 0);
    if (longest > f.colTitle) {
      out.push(`Nh\xE3n c\u1ED9t d\xE0i ${longest} k\xFD t\u1EF1 \u2014 b\u1ED1 c\u1EE5c "${def.label}" h\u1EE3p v\u1EDBi nh\xE3n d\u01B0\u1EDBi ${f.colTitle}`);
    }
  }
  return out;
}
function bulletsToColumns(bullets2, to) {
  const bs = bullets2.filter((b) => String(b || "").trim());
  if (!bs.length) return [];
  if (to === "proscons" || to === "comparetable") {
    const half = Math.ceil(bs.length / 2);
    return [
      { title: to === "proscons" ? "\u01AFu \u0111i\u1EC3m" : "C\u1ED9t 1", bullets: bs.slice(0, half) },
      { title: to === "proscons" ? "Nh\u01B0\u1EE3c \u0111i\u1EC3m" : "C\u1ED9t 2", bullets: bs.slice(half) }
    ];
  }
  const cap = LAYOUT_BY_KEY[to]?.maxColumns ?? 4;
  return bs.slice(0, cap).map((b) => ({ title: b, bullets: [] }));
}
function columnsToBullets(columns) {
  const out = [];
  for (const c of columns || []) {
    if (String(c?.title || "").trim()) out.push(c.title.trim());
    for (const b of c?.bullets || []) if (String(b || "").trim()) out.push(b);
  }
  return out.slice(0, 12);
}
function convert(slide, to) {
  const chk = canConvert(slide, to);
  if (!chk.ok) return slide;
  const next = { ...slide, kind: to };
  if (chk.transform === "bulletsToColumns") next.columns = bulletsToColumns(slide.bullets || [], to);
  if (chk.transform === "columnsToBullets") next.bullets = columnsToBullets(slide.columns || []);
  return next;
}

// src/ui/icons.ts
var PATHS = {
  "save": '<path d="M8 22V19C8 17.1144 8 16.1716 8.58579 15.5858C9.17157 15 10.1144 15 12 15C13.8856 15 14.8284 15 15.4142 15.5858C16 16.1716 16 17.1144 16 19V22" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M10 7H14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M3 11.8584C3 7.28199 3 4.99376 4.38674 3.54394C4.43797 3.49038 4.49038 3.43797 4.54394 3.38674C5.99376 2 8.28199 2 12.8584 2C13.943 2 14.4655 2.00376 14.9628 2.18936C15.4417 2.3681 15.8429 2.70239 16.6452 3.37099L18.8411 5.20092C19.9027 6.08561 20.4335 6.52795 20.7168 7.13266C21 7.73737 21 8.42833 21 9.81025V13C21 16.7497 21 18.6246 20.0451 19.9389C19.7367 20.3634 19.3634 20.7367 18.9389 21.0451C17.6246 22 15.7497 22 12 22C8.25027 22 6.3754 22 5.06107 21.0451C4.6366 20.7367 4.26331 20.3634 3.95491 19.9389C3 18.6246 3 16.7497 3 13V11.8584Z" stroke="currentColor" strokeWidth="1.5"/>',
  "add": '<path d="M12 4V20M20 12H4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "present": '<path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>',
  "layout": '<path d="M10.5 8.75V6.75C10.5 5.10626 10.5 4.28439 10.046 3.73121C9.96291 3.62995 9.87005 3.53709 9.76879 3.45398C9.21561 3 8.39374 3 6.75 3C5.10626 3 4.28439 3 3.73121 3.45398C3.62995 3.53709 3.53709 3.62995 3.45398 3.73121C3 4.28439 3 5.10626 3 6.75V8.75C3 10.3937 3 11.2156 3.45398 11.7688C3.53709 11.8701 3.62995 11.9629 3.73121 12.046C4.28439 12.5 5.10626 12.5 6.75 12.5C8.39374 12.5 9.21561 12.5 9.76879 12.046C9.87005 11.9629 9.96291 11.8701 10.046 11.7688C10.5 11.2156 10.5 10.3937 10.5 8.75Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M7.75 15.5H5.75C5.05222 15.5 4.70333 15.5 4.41943 15.5861C3.78023 15.78 3.28002 16.2802 3.08612 16.9194C3 17.2033 3 17.5522 3 18.25C3 18.9478 3 19.2967 3.08612 19.5806C3.28002 20.2198 3.78023 20.72 4.41943 20.9139C4.70333 21 5.05222 21 5.75 21H7.75C8.44778 21 8.79667 21 9.08057 20.9139C9.71977 20.72 10.22 20.2198 10.4139 19.5806C10.5 19.2967 10.5 18.9478 10.5 18.25C10.5 17.5522 10.5 17.2033 10.4139 16.9194C10.22 16.2802 9.71977 15.78 9.08057 15.5861C8.79667 15.5 8.44778 15.5 7.75 15.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M21 17.25V15.25C21 13.6063 21 12.7844 20.546 12.2312C20.4629 12.1299 20.3701 12.0371 20.2688 11.954C19.7156 11.5 18.8937 11.5 17.25 11.5C15.6063 11.5 14.7844 11.5 14.2312 11.954C14.1299 12.0371 14.0371 12.1299 13.954 12.2312C13.5 12.7844 13.5 13.6063 13.5 15.25V17.25C13.5 18.8937 13.5 19.7156 13.954 20.2688C14.0371 20.3701 14.1299 20.4629 14.2312 20.546C14.7844 21 15.6063 21 17.25 21C18.8937 21 19.7156 21 20.2688 20.546C20.3701 20.4629 20.4629 20.3701 20.546 20.2688C21 19.7156 21 18.8937 21 17.25Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M18.25 3H16.25C15.5522 3 15.2033 3 14.9194 3.08612C14.2802 3.28002 13.78 3.78023 13.5861 4.41943C13.5 4.70333 13.5 5.05222 13.5 5.75C13.5 6.44778 13.5 6.79667 13.5861 7.08057C13.78 7.71977 14.2802 8.21998 14.9194 8.41388C15.2033 8.5 15.5522 8.5 16.25 8.5H18.25C18.9478 8.5 19.2967 8.5 19.5806 8.41388C20.2198 8.21998 20.72 7.71977 20.9139 7.08057C21 6.79667 21 6.44778 21 5.75C21 5.05222 21 4.70333 20.9139 4.41943C20.72 3.78023 20.2198 3.28002 19.5806 3.08612C19.2967 3 18.9478 3 18.25 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>',
  "palette": '<path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.8417 22 14 22.1163 14 21C14 20.391 13.6832 19.9212 13.3686 19.4544C12.9082 18.7715 12.4523 18.0953 13 17C13.6667 15.6667 14.7778 15.6667 16.4815 15.6667C17.3334 15.6667 18.3334 15.6667 19.5 15.5C21.601 15.1999 22 13.9084 22 12Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="9.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="16.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7.125 15H7M7.25 15C7.25 15.1381 7.13807 15.25 7 15.25C6.86193 15.25 6.75 15.1381 6.75 15C6.75 14.8619 6.86193 14.75 7 14.75C7.13807 14.75 7.25 14.8619 7.25 15Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "image": '<path d="M3 16L7.46967 11.5303C7.80923 11.1908 8.26978 11 8.75 11C9.23022 11 9.69077 11.1908 10.0303 11.5303L14 15.5M15.5 17L14 15.5M21 16L18.5303 13.5303C18.1908 13.1908 17.7302 13 17.25 13C16.7698 13 16.3092 13.1908 15.9697 13.5303L14 15.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M15.5 8C15.7761 8 16 7.77614 16 7.5C16 7.22386 15.7761 7 15.5 7M15.5 8C15.2239 8 15 7.77614 15 7.5C15 7.22386 15.2239 7 15.5 7M15.5 8V7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M3.69797 19.7472C2.5 18.3446 2.5 16.2297 2.5 12C2.5 7.77027 2.5 5.6554 3.69797 4.25276C3.86808 4.05358 4.05358 3.86808 4.25276 3.69797C5.6554 2.5 7.77027 2.5 12 2.5C16.2297 2.5 18.3446 2.5 19.7472 3.69797C19.9464 3.86808 20.1319 4.05358 20.302 4.25276C21.5 5.6554 21.5 7.77027 21.5 12C21.5 16.2297 21.5 18.3446 20.302 19.7472C20.1319 19.9464 19.9464 20.1319 19.7472 20.302C18.3446 21.5 16.2297 21.5 12 21.5C7.77027 21.5 5.6554 21.5 4.25276 20.302C4.05358 20.1319 3.86808 19.9464 3.69797 19.7472Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "note": '<path d="M12.5 5H11.5C7.72876 5 5.84315 5 4.67157 6.17157C3.5 7.34315 3.5 9.22876 3.5 13V14C3.5 17.7712 3.5 19.6569 4.67157 20.8284C5.84315 22 7.72876 22 11.5 22L12.5 22C16.2712 22 18.1569 22 19.3284 20.8284C20.5 19.6569 20.5 17.7712 20.5 14V13C20.5 9.22876 20.5 7.34315 19.3284 6.17157C18.1569 5 16.2712 5 12.5 5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M11 7.5C11 8.32843 11.6716 9 12.5 9C13.3284 9 14 8.32843 14 7.5V4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4V5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M7.5 17.5H12.5M7.5 13.5H16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "duplicate": '<path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "hide": '<path d="M19.439 15.439C20.3636 14.5212 21.0775 13.6091 21.544 12.955C21.848 12.5287 22 12.3155 22 12C22 11.6845 21.848 11.4713 21.544 11.045C20.1779 9.12944 16.6892 5 12 5C11.0922 5 10.2294 5.15476 9.41827 5.41827M6.74742 6.74742C4.73118 8.1072 3.24215 9.94266 2.45604 11.045C2.15201 11.4713 2 11.6845 2 12C2 12.3155 2.15201 12.5287 2.45604 12.955C3.8221 14.8706 7.31078 19 12 19C13.9908 19 15.7651 18.2557 17.2526 17.2526" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M9.85786 10C9.32783 10.53 9 11.2623 9 12.0711C9 13.6887 10.3113 15 11.9289 15C12.7377 15 13.47 14.6722 14 14.1421" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/><path d="M3 3L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "show": '<path d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z" stroke="currentColor" strokeWidth="1.5"/><path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" stroke="currentColor" strokeWidth="1.5"/>',
  "trash": '<path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/>',
  "reset": '<path d="M20.5 5.5H9.5C5.78672 5.5 3 8.18503 3 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M3.5 18.5H14.5C18.2133 18.5 21 15.815 21 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M18.5 3C18.5 3 21 4.84122 21 5.50002C21 6.15882 18.5 8 18.5 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M5.49998 16C5.49998 16 3.00001 17.8412 3 18.5C2.99999 19.1588 5.5 21 5.5 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "close": '<path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "search": '<path d="M17 17L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "lock": '<path d="M4.26781 18.8447C4.49269 20.515 5.87613 21.8235 7.55966 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.879 17.7547 20 16.6376 20 15.5C20 14.3624 19.879 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55966 9.09909C5.87613 9.17649 4.49269 10.485 4.26781 12.1553C4.12104 13.2453 4 14.3624 4 15.5C4 16.6376 4.12104 17.7547 4.26781 18.8447Z" stroke="currentColor" strokeWidth="1.5"/><path d="M7.5 9V6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5V9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M12.125 15.5H12M12.25 15.5C12.25 15.6381 12.1381 15.75 12 15.75C11.8619 15.75 11.75 15.6381 11.75 15.5C11.75 15.3619 11.8619 15.25 12 15.25C12.1381 15.25 12.25 15.3619 12.25 15.5Z" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/>',
  "warn": '<path d="M13.9248 21H10.0752C5.44476 21 3.12955 21 2.27636 19.4939C1.42317 17.9879 2.60736 15.9914 4.97574 11.9985L6.90057 8.75333C9.17559 4.91778 10.3131 3 12 3C13.6869 3 14.8244 4.91777 17.0994 8.75332L19.0243 11.9985C21.3926 15.9914 22.5768 17.9879 21.7236 19.4939C20.8704 21 18.5552 21 13.9248 21Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M12 9V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M12.125 16.75H12M12.25 16.75C12.25 16.8881 12.1381 17 12 17C11.8619 17 11.75 16.8881 11.75 16.75C11.75 16.6119 11.8619 16.5 12 16.5C12.1381 16.5 12.25 16.6119 12.25 16.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "drag": '<path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "regen": '<path d="M13.9258 12.7775L11.7775 10.6292C11.4847 10.3364 11.3383 10.19 11.1803 10.1117C10.8798 9.96277 10.527 9.96277 10.2264 10.1117C10.0685 10.19 9.92207 10.3364 9.62923 10.6292C9.33638 10.9221 9.18996 11.0685 9.11169 11.2264C8.96277 11.527 8.96277 11.8798 9.11169 12.1803C9.18996 12.3383 9.33638 12.4847 9.62923 12.7775L11.7775 14.9258M13.9258 12.7775L20.3708 19.2225C20.6636 19.5153 20.81 19.6617 20.8883 19.8197C21.0372 20.1202 21.0372 20.473 20.8883 20.7736C20.81 20.9315 20.6636 21.0779 20.3708 21.3708C20.0779 21.6636 19.9315 21.81 19.7736 21.8883C19.473 22.0372 19.1202 22.0372 18.8197 21.8883C18.6617 21.81 18.5153 21.6636 18.2225 21.3708L11.7775 14.9258M13.9258 12.7775L11.7775 14.9258" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M17 2L17.2948 2.7966C17.6813 3.84117 17.8746 4.36345 18.2556 4.74445C18.6366 5.12545 19.1588 5.31871 20.2034 5.70523L21 6L20.2034 6.29477C19.1588 6.68129 18.6366 6.87456 18.2556 7.25555C17.8746 7.63655 17.6813 8.15883 17.2948 9.2034L17 10L16.7052 9.2034C16.3187 8.15884 16.1254 7.63655 15.7444 7.25555C15.3634 6.87455 14.8412 6.68129 13.7966 6.29477L13 6L13.7966 5.70523C14.8412 5.31871 15.3634 5.12545 15.7444 4.74445C16.1254 4.36345 16.3187 3.84117 16.7052 2.7966L17 2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M6 4L6.22108 4.59745C6.51097 5.38087 6.65592 5.77259 6.94167 6.05834C7.22741 6.34408 7.61913 6.48903 8.40255 6.77892L9 7L8.40255 7.22108C7.61913 7.51097 7.22741 7.65592 6.94166 7.94167C6.65592 8.22741 6.51097 8.61913 6.22108 9.40255L6 10L5.77892 9.40255C5.48903 8.61913 5.34408 8.22741 5.05833 7.94167C4.77259 7.65592 4.38087 7.51097 3.59745 7.22108L3 7L3.59745 6.77892C4.38087 6.48903 4.77259 6.34408 5.05833 6.05833C5.34408 5.77259 5.48903 5.38087 5.77892 4.59745L6 4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>',
  "check": '<path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',
  "chevron": '<path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>'
};
function icon(name, cls = "") {
  const inner = PATHS[name];
  if (!inner) return "";
  return `<svg class="dk-i ${cls}" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

// src/editor/rail.ts
var dragSource = null;
function countClone() {
  if (typeof window !== "undefined") window.__dkRailClones = (window.__dkRailClones || 0) + 1;
}
function sig(sec) {
  return (sec.dataset.kind || "") + "|" + (sec.classList.contains("skipped") ? "1" : "0") + "|" + (sec.getAttribute("style") || "") + "|" + sec.innerHTML.length + "|" + sec.innerHTML;
}
var tmpSeq = 0;
function sidOf(sec) {
  let s = sec.dataset.railSid;
  if (!s) {
    s = sec.dataset.id || `tmp${++tmpSeq}`;
    sec.dataset.railSid = s;
  }
  return s;
}
function groupTitle(sec) {
  const k = sec.dataset.kind || "";
  if (k !== "section" && k !== "hero") return null;
  const t = sec.querySelector(".sec-ttl,.hbig");
  const s = (t?.textContent || sec.dataset.title || "").trim();
  return s || null;
}
var railFilter = "";
function buildRail(root, opts) {
  const rail = root.querySelector("#lp-rail") || document.getElementById("lp-rail");
  if (!rail) return;
  const secs = Array.from(root.querySelectorAll("#scaler > .slide"));
  const old = /* @__PURE__ */ new Map();
  rail.querySelectorAll(".rail-it").forEach((it) => {
    const s = it.dataset.sid;
    if (s) old.set(s, it);
  });
  const wanted = [];
  secs.forEach((sec, i) => {
    const sid = sidOf(sec);
    let it = old.get(sid);
    if (it) {
      old.delete(sid);
      const s = sig(sec);
      if (it.dataset.sig !== s) {
        const t = it.querySelector(".rail-thumb");
        if (t) t.replaceWith(railThumb(sec));
        it.dataset.sig = s;
      }
    } else {
      it = document.createElement("div");
      it.dataset.sid = sid;
      it.draggable = true;
      it.appendChild(railThumb(sec));
      it.dataset.sig = sig(sec);
      const n = document.createElement("span");
      n.className = "rail-num";
      it.appendChild(n);
      const du = document.createElement("button");
      du.className = "rail-dup";
      du.title = "Nh\xE2n b\u1EA3n";
      du.innerHTML = icon("duplicate");
      it.appendChild(du);
      const dl = document.createElement("button");
      dl.className = "rail-del";
      dl.title = "Xo\xE1 slide";
      dl.innerHTML = icon("trash");
      it.appendChild(dl);
    }
    it.className = "rail-it" + (sec.classList.contains("active") ? " on" : "") + (sec.classList.contains("skipped") ? " skip" : "");
    if (sec.dataset.locked === "1") it.dataset.locked = "1";
    else delete it.dataset.locked;
    const num = it.querySelector(".rail-num");
    if (num) num.textContent = String(i + 1);
    wire(it, sec, i, opts);
    wanted.push(it);
  });
  old.forEach((it) => it.remove());
  rail.querySelectorAll(".rail-g").forEach((g) => g.remove());
  const seq = [];
  secs.forEach((sec, i) => {
    const gt = groupTitle(sec);
    if (gt) {
      const g = document.createElement("div");
      g.className = "rail-g";
      g.textContent = gt;
      g.title = gt;
      seq.push(g);
    }
    seq.push(wanted[i]);
  });
  seq.forEach((n, i) => {
    if (rail.children[i] !== n) rail.insertBefore(n, rail.children[i] || null);
  });
  applyFilter(rail);
}
function applyFilter(rail) {
  const f = railFilter;
  rail.querySelectorAll(".rail-it").forEach((it) => {
    const hide = f === "skip" && !it.classList.contains("skip") || f === "lock" && it.dataset.locked !== "1";
    it.hidden = hide;
  });
  rail.querySelectorAll(".rail-g").forEach((g) => {
    let n = g.nextElementSibling;
    let any = false;
    while (n && !n.classList.contains("rail-g")) {
      if (n.classList.contains("rail-it") && !n.hidden) {
        any = true;
        break;
      }
      n = n.nextElementSibling;
    }
    g.hidden = !any;
  });
}
function setRailFilter(root, f) {
  railFilter = f;
  const rail = root.querySelector("#lp-rail") || document.getElementById("lp-rail");
  if (rail) applyFilter(rail);
}
function getRailFilter() {
  return railFilter;
}
function wire(it, sec, i, opts) {
  const du = it.querySelector(".rail-dup");
  const dl = it.querySelector(".rail-del");
  it.onclick = (ev) => {
    if (ev.target === du || ev.target === dl) return;
    opts.onGoto(i);
  };
  it.ondragstart = () => {
    dragSource = sec;
    it.classList.add("drag");
  };
  it.ondragend = () => it.classList.remove("drag");
  it.ondragover = (ev) => ev.preventDefault();
  it.ondrop = (ev) => {
    ev.preventDefault();
    if (!dragSource || dragSource === sec) return;
    const dpar = dragSource.parentNode;
    const dref = dragSource.nextSibling;
    const r = it.getBoundingClientRect();
    const after = ev.clientY - r.top > r.height / 2;
    sec.parentNode.insertBefore(dragSource, after ? sec.nextSibling : sec);
    const moved = dragSource;
    opts.pushUndo(() => {
      dpar.insertBefore(moved, dref);
    });
    dragSource = null;
    opts.onSync("\u0110\xE3 \u0111\u1ED5i th\u1EE9 t\u1EF1 \u2014 Ctrl+Z \u0111\u1EC3 ho\xE0n t\xE1c");
  };
  if (du) du.onclick = (ev) => {
    ev.stopPropagation();
    opts.onDup(sec);
  };
  if (dl) dl.onclick = (ev) => {
    ev.stopPropagation();
    opts.onDel(sec);
  };
}
function railSetActive(root, index) {
  const rail = root.querySelector("#lp-rail") || document.getElementById("lp-rail");
  if (!rail) return;
  const items = rail.querySelectorAll(".rail-it");
  items.forEach((it, i) => it.classList.toggle("on", i === index));
  const cur = items[index];
  if (cur && typeof cur.scrollIntoView === "function") {
    cur.scrollIntoView({ block: "nearest" });
  }
}
function railThumb(sec) {
  countClone();
  const t = document.createElement("div");
  t.className = "rail-thumb";
  const c = sec.cloneNode(true);
  c.classList.remove("active");
  c.removeAttribute("data-index");
  c.removeAttribute("data-id");
  c.removeAttribute("data-new");
  c.removeAttribute("data-rail-sid");
  const sb = c.querySelector(".slidebar");
  if (sb) sb.remove();
  c.querySelectorAll("[data-e]").forEach((e) => e.removeAttribute("data-e"));
  c.querySelectorAll("[contenteditable]").forEach((e) => e.setAttribute("contenteditable", "false"));
  t.appendChild(c);
  return t;
}

// src/editor/picker.ts
var pickerIO = null;
function openPicker(idx, current, sec, opts) {
  let pk = document.getElementById("lp-picker");
  if (!pk) {
    pk = document.createElement("div");
    pk.id = "lp-picker";
    document.body.appendChild(pk);
  }
  const nb = +(sec.dataset.nb || 0);
  const nc = +(sec.dataset.nc || 0);
  const nct = +(sec.dataset.nct || 0);
  const nf = +(sec.dataset.nf || 0);
  const txt = (sel) => Array.from(sec.querySelectorAll(sel)).map((e) => (e.innerText || "").replace(/\s+/g, " ").trim()).filter(Boolean);
  const marked = txt("[data-e*='.bullets.']");
  const realBullets = marked.length ? marked : txt("ul.bul li");
  const realColTitles = txt("[data-e$='.title'][data-e*='.columns.'], .col .ch, .c3-h, .metric .val, .kpi-v");
  const slide = {
    id: sec.dataset.id || String(idx),
    kind: sec.dataset.kind || "content",
    title: (sec.querySelector(".ttl,.msg,.qmsg,.sec-ttl,.hbig")?.innerText || "").trim(),
    bullets: realBullets.length ? realBullets : Array.from({ length: nb }, (_, i) => `\xFD ${i + 1}`),
    columns: (realColTitles.length ? realColTitles : Array.from({ length: nc }, (_, i) => i < nct ? `c\u1ED9t ${i + 1}` : "")).map((t) => ({ title: t, bullets: [] })),
    images: Array.from({ length: nf }, (_, i) => ({ asset: `pv${i}` })),
    locked: sec.dataset.locked === "1"
  };
  const GREY = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="5"><rect width="8" height="5" fill="%23c7cede"/></svg>'
  );
  const domSrc = Array.from(sec.querySelectorAll("img")).map((im) => im.getAttribute("src") || "").filter(Boolean);
  const pvAssets = {};
  for (let i = 0; i < Math.max(nf, 4); i++) pvAssets[`pv${i}`] = domSrc[i] || GREY;
  let h = '<div class="pk-box"><div class="pk-hd">Ch\u1ECDn b\u1ED1 c\u1EE5c slide<input id="pk-q" class="pk-q" type="search" placeholder="T\xECm b\u1ED1 c\u1EE5c\u2026 (g\xF5 t\xEAn)" autocomplete="off"><button class="pk-x" title="\u0110\xF3ng">\u2715</button></div><div class="pk-body">';
  GROUP_ORDER.forEach((g) => {
    const items = SELECTABLE_LAYOUTS.filter((l) => l.group === g);
    if (!items.length) return;
    h += `<div class="pk-g" data-g="${g}">${g}</div><div class="pk-grid" data-g="${g}">`;
    items.forEach((o) => {
      const chk = canConvert(slide, o.key);
      const lk = chk.ok ? "" : chk.reason || "Kh\xF4ng \u0111\u1EE7 d\u1EEF li\u1EC7u";
      const warn = chk.ok && chk.willHide ? ` data-hide="${chk.willHide}"` : "";
      const fit = chk.fitWarning || [];
      const tip = !chk.ok ? lk : fit.join(" \xB7 ");
      h += `<button class="pk-tile${o.key === current ? " on" : ""}${!chk.ok ? " off" : ""}${chk.ok && fit.length ? " tight" : ""}" data-k="${o.key}" data-s="${norm(o.label + " " + o.key + " " + o.group)}"${!chk.ok ? " disabled" : ""}${tip ? ` title="${esc(tip)}"` : ""}${warn}><span class="pk-mini" data-pv="1"></span><span class="pk-lb">${o.label}</span>` + (!chk.ok ? '<span class="pk-lock">\u{1F512}</span>' : "") + (chk.willHide ? `<span class="pk-warn">\u26A0 \u1EA8n ${chk.willHide}</span>` : "") + (chk.ok && fit.length ? '<span class="pk-tight">Ch\u1EEF h\u01A1i d\xE0i</span>' : "") + `</button>`;
    });
    h += "</div>";
  });
  h += '<div class="pk-none" hidden>Kh\xF4ng c\xF3 b\u1ED1 c\u1EE5c n\xE0o kh\u1EDBp</div></div></div>';
  pk.innerHTML = h;
  pk.classList.add("show");
  pk.querySelector(".pk-x").addEventListener("click", () => closePicker());
  pk.onclick = (e) => {
    if (e.target === pk) closePicker();
  };
  const tiles = Array.from(pk.querySelectorAll(".pk-tile"));
  const cache = /* @__PURE__ */ new Map();
  const paintTile = (b) => {
    const box = b.querySelector(".pk-mini[data-pv]");
    if (!box || box.dataset.done) return;
    const k = b.getAttribute("data-k");
    let html = cache.get(k);
    if (html == null) {
      const def = LAYOUT_BY_KEY[k];
      const rn = def?.renders || [];
      let src = { ...convert(slide, k), kind: k };
      if (rn.includes("images") && !(src.images || []).length) {
        src = { ...src, images: [{ asset: "pv0" }, { asset: "pv1" }, { asset: "pv2" }] };
      }
      if (rn.includes("image") && !src.image) {
        src = { ...src, image: { asset: "pv0" } };
      }
      html = renderSlide(src, { idx: 0, pos: 1, foot: "", assets: pvAssets });
      cache.set(k, html);
    }
    box.innerHTML = html;
    box.dataset.done = "1";
  };
  if (typeof IntersectionObserver === "function") {
    pickerIO?.disconnect();
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          paintTile(e.target);
          io.unobserve(e.target);
        }
      });
    }, { root: pk.querySelector(".pk-body"), rootMargin: "160px" });
    pickerIO = io;
    tiles.forEach((b) => io.observe(b));
  } else {
    tiles.forEach(paintTile);
  }
  tiles.forEach((b) => {
    b.onclick = () => {
      if (b.disabled) return;
      opts.onSelect(b.getAttribute("data-k"), idx, sec);
      closePicker();
    };
    b.onmouseenter = () => paintTile(b);
    b.onfocus = () => paintTile(b);
  });
  const q = pk.querySelector("#pk-q");
  const none = pk.querySelector(".pk-none");
  if (q) {
    const filter = () => {
      const s = norm(q.value);
      let shown = 0;
      tiles.forEach((b) => {
        const hit = !s || (b.getAttribute("data-s") || "").includes(s);
        b.hidden = !hit;
        if (hit) shown++;
      });
      pk.querySelectorAll(".pk-grid").forEach((grid) => {
        const any = Array.from(grid.querySelectorAll(".pk-tile")).some((t) => !t.hidden);
        grid.hidden = !any;
        const head = pk.querySelector(`.pk-g[data-g="${grid.dataset.g}"]`);
        if (head) head.hidden = !any;
      });
      if (none) none.hidden = shown > 0;
    };
    q.oninput = filter;
    q.onkeydown = (e) => {
      if (e.key === "Escape") {
        if (q.value) {
          q.value = "";
          filter();
        } else closePicker();
        e.stopPropagation();
      }
      if (e.key === "Enter") {
        const first = tiles.find((t) => !t.hidden && !t.disabled);
        if (first) first.click();
      }
    };
    setTimeout(() => q.focus(), 30);
  }
  pk.onkeydown = (e) => {
    if (e.key === "Escape") closePicker();
  };
}
function norm(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\u0111/g, "d");
}
function closePicker() {
  const pk = document.getElementById("lp-picker");
  if (pk) pk.classList.remove("show");
  pickerIO?.disconnect();
  pickerIO = null;
}

// src/util/contrast.ts
function parseColor(c) {
  const s = (c || "").trim();
  if (!s) return null;
  const m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    const h = m[1];
    const f = h.length === 3 ? [h[0] + h[0], h[1] + h[1], h[2] + h[2]] : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];
    return [parseInt(f[0], 16), parseInt(f[1], 16), parseInt(f[2], 16)];
  }
  const r = s.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (r) return [+r[1], +r[2], +r[3]];
  return null;
}
function luminance([r, g, b]) {
  const f = (v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a, b) {
  const ca = parseColor(a), cb = parseColor(b);
  if (!ca || !cb) return null;
  const la = luminance(ca), lb = luminance(cb);
  const hi = Math.max(la, lb), lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}
function checkAccent(accent, bg, fg) {
  const asText = contrast(accent, bg);
  const asBg = contrast(fg, accent);
  const vals = [asText, asBg].filter((x) => x != null);
  const worst = vals.length ? Math.min(...vals) : null;
  return { asText, asBg, worst, low: worst != null && worst < 4.5 };
}

// src/editor/toolbar.ts
var ACC = ["#5b8def", "#46b083", "#e0a23a", "#e8503a", "#7a5ae0", "#2B4182", "#0E9F6E"];
function fmtBtn(cmd, label, title) {
  return `<button class="dk-btn dk-fmt" data-cmd="${cmd}" title="${esc(title)}" tabindex="-1">${label}</button>`;
}
var btn = (id, ic, label, title, cls = "") => `<button id="${id}" class="dk-btn ${cls}" title="${esc(title)}">${icon(ic)}<span class="dk-lb">${esc(label)}</span></button>`;
function buildToolbar(root, state, opts) {
  const bar = root.querySelector("#dk-toolbar");
  if (!bar) return;
  const sec = root.querySelector("#scaler > .slide.active") || root.querySelector("#scaler > .slide");
  if (!sec) {
    bar.innerHTML = "";
    return;
  }
  const idx = +(sec.dataset.index || 0);
  const kind = sec.dataset.kind || "content";
  const secs = root.querySelectorAll("#scaler > .slide");
  const pos = Array.from(secs).indexOf(sec);
  const def = LAYOUT_BY_KEY[kind];
  const skipped = sec.classList.contains("skipped");
  const locked = sec.dataset.locked === "1";
  const takesImage = !!def?.renders.some((r) => r === "image" || r === "images");
  const hasImg = !!sec.querySelector(".two img,.bigfig img,.fig img,.gcell img,.qav");
  const canRegen = !!sec.querySelector(".edregen");
  let h = "";
  h += '<div class="dk-grp">';
  h += btn("dk-save", "save", "L\u01B0u", "L\u01B0u ngay (Ctrl+S)", "primary");
  h += '<span id="edmsg" class="dk-status"></span>';
  h += "</div>";
  h += '<div class="dk-grp">';
  h += `<button id="dk-layout" class="dk-btn" title="\u0110\u1ED5i b\u1ED1 c\u1EE5c \u2014 c\xF3 \xF4 t\xECm ki\u1EBFm, r\xEA chu\u1ED9t \u0111\u1EC3 xem tr\u01B0\u1EDBc"${locked ? " disabled" : ""}>${icon("layout")}<span class="dk-lb">${esc(def?.label || kind)}</span>${icon("chevron", "dk-caret")}</button>`;
  h += `<button id="dk-color" class="dk-btn" title="M\xE0u nh\u1EA5n c\u1EE7a slide n\xE0y">${icon("palette")}<span class="dk-lb">M\xE0u</span>${icon("chevron", "dk-caret")}</button>`;
  if (takesImage) {
    h += btn("dk-img", "image", hasImg ? "\u0110\u1ED5i \u1EA3nh" : "Th\xEAm \u1EA3nh", "Ch\u1ECDn \u1EA3nh minh ho\u1EA1 cho slide");
    if (hasImg) h += btn("dk-imgx", "trash", "G\u1EE1 \u1EA3nh", "G\u1EE1 \u1EA3nh kh\u1ECFi slide", "danger-ghost");
  }
  if (canRegen) h += btn("dk-regen", "regen", "V\u1EBD l\u1EA1i \u1EA3nh", "V\u1EBD l\u1EA1i \u1EA3nh b\u1EB1ng AI (~1 ph\xFAt)");
  h += btn("dk-notes", "note", "Ghi ch\xFA", "Ghi ch\xFA/\u0111\xE1p \xE1n cho Presenter View (kh\xF4ng hi\u1EC7n tr\xEAn slide)");
  h += "</div>";
  h += '<div class="dk-grp" id="dk-fmt-grp">';
  h += fmtBtn("bold", "<b>B</b>", "\u0110\u1EADm (Ctrl+B)");
  h += fmtBtn("italic", "<i>I</i>", "Nghi\xEAng (Ctrl+I)");
  h += fmtBtn("superscript", "x<sup>2</sup>", "S\u1ED1 m\u0169 \u2014 x\xB2");
  h += fmtBtn("subscript", "x<sub>2</sub>", "Ch\u1EC9 s\u1ED1 d\u01B0\u1EDBi \u2014 x\u2082");
  h += "</div>";
  h += '<div class="dk-grp">';
  h += btn("dk-add", "add", "Th\xEAm", "Th\xEAm slide tr\u1ED1ng sau slide n\xE0y");
  h += btn("dk-dup", "duplicate", "Nh\xE2n b\u1EA3n", "T\u1EA1o b\u1EA3n sao ngay d\u01B0\u1EDBi slide n\xE0y");
  h += btn(
    "dk-skip",
    skipped ? "show" : "hide",
    skipped ? "B\u1ECF \u1EA9n" : "\u1EA8n",
    skipped ? "Cho slide hi\u1EC7n l\u1EA1i khi tr\xECnh chi\u1EBFu" : "\u1EA8n kh\u1ECFi tr\xECnh chi\u1EBFu v\xE0 b\u1EA3n xu\u1EA5t"
  );
  h += btn("dk-del", "trash", "Xo\xE1", "Xo\xE1 slide (Ctrl+Z \u0111\u1EC3 l\u1EA5y l\u1EA1i)", "danger");
  h += "</div>";
  const rf = getRailFilter();
  h += '<div class="dk-grp" id="dk-filter-grp">';
  h += `<button id="dk-filter" class="dk-btn${rf ? " on" : ""}" title="L\u1ECDc danh s\xE1ch slide b\xEAn tr\xE1i">${icon("hide")}<span class="dk-lb">${rf === "skip" ? "\u0110ang \u1EA9n" : rf === "lock" ? "Nguy\xEAn v\u0103n" : "L\u1ECDc"}</span>${icon("chevron", "dk-caret")}</button>`;
  h += "</div>";
  h += '<div class="dk-grp dk-right">';
  h += `<span class="dk-pos">${pos + 1}<span class="dk-pos-sep">/</span>${secs.length}</span>`;
  h += btn("dk-present", "present", "Tr\xECnh chi\u1EBFu", "Tr\xECnh chi\u1EBFu to\xE0n m\xE0n h\xECnh (Esc \u0111\u1EC3 tho\xE1t)");
  h += `<button id="dk-reset" class="dk-btn ghost" title="\u0110\u1EB7t l\u1EA1i slide v\u1EC1 b\u1EA3n AI d\xE0n ban \u0111\u1EA7u">${icon("reset")}</button>`;
  h += "</div>";
  bar.innerHTML = h;
  wire2(root, bar, sec, idx, kind, state, opts);
}
function wire2(root, bar, sec, idx, kind, state, opts) {
  const on = (id, fn) => {
    const el = bar.querySelector("#" + id);
    if (el) el.onclick = fn;
  };
  bar.querySelectorAll(".dk-fmt").forEach((b2) => {
    b2.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
      const sel = root.getRootNode().getSelection?.() || window.getSelection();
      const node = sel?.anchorNode;
      const host = node && (node.nodeType === 1 ? node : node.parentElement);
      if (!host?.closest("[contenteditable='true']")) {
        opts.onMsg("B\xF4i \u0111en ch\u1EEF tr\xEAn slide tr\u01B0\u1EDBc r\u1ED3i m\u1EDBi b\u1EA5m \u0111\u1ECBnh d\u1EA1ng");
        return;
      }
      document.execCommand(b2.dataset.cmd || "bold");
      opts.onSave(false);
    });
  });
  on("dk-save", () => opts.onSave(false));
  on("dk-add", () => opts.onAddSlide());
  on("dk-dup", () => opts.onDup(sec));
  on("dk-del", () => opts.onDel(sec));
  on("dk-present", () => opts.onPresent());
  on("dk-reset", () => opts.onReset?.());
  on("dk-layout", () => openPicker(idx, kind, sec, {
    onSelect: (k, i, s) => {
      const note = opts.onAdapt(k, i, s);
      state.kinds[i] = k;
      if (note) opts.onMsg(note);
      opts.onSave(true);
    }
  }));
  on("dk-skip", () => {
    const nowSkipped = sec.classList.toggle("skipped");
    if (nowSkipped) state.skipped[idx] = true;
    else delete state.skipped[idx];
    opts.onSync();
    opts.scheduleSave(nowSkipped ? "\u0110\xE3 \u1EA9n slide kh\u1ECFi tr\xECnh chi\u1EBFu" : "\u0110\xE3 b\u1ECF \u1EA9n slide");
  });
  on("dk-color", (e) => {
    const cur = (sec.style.getPropertyValue("--sl-gold") || "").trim().toLowerCase();
    popover(
      bar,
      e.currentTarget,
      '<div class="dk-pop-t">M\xE0u nh\u1EA5n slide</div><div class="dk-sw">' + ACC.map((c) => `<button class="dk-swatch${c.toLowerCase() === cur ? " on" : ""}" data-c="${c}" style="background:${c}" title="${c}"></button>`).join("") + `<button class="dk-swatch reset" data-c="" title="Theo m\xE0u theme">${icon("reset")}</button></div><label class="dk-pick"><input type="color" id="dk-pick" value="${cur || "#2b4182"}"><span>M\xE0u kh\xE1c\u2026</span></label><div class="dk-warn" id="dk-cwarn" hidden></div>`,
      (pop) => {
        const warnBox = pop.querySelector("#dk-cwarn");
        const cs = getComputedStyle(sec);
        const showWarn = (c) => {
          if (!warnBox) return;
          if (!c) {
            warnBox.hidden = true;
            return;
          }
          const r = checkAccent(
            c,
            cs.getPropertyValue("--sl-bg") || "#ffffff",
            cs.getPropertyValue("--sl-navy2") || "#0f2977"
          );
          if (r.low && r.worst != null) {
            warnBox.hidden = false;
            warnBox.textContent = `\u26A0 T\u01B0\u01A1ng ph\u1EA3n th\u1EA5p (${r.worst.toFixed(1)}:1 \u2014 n\xEAn \u2265 4,5:1). Ch\u1EEF d\xF9ng m\xE0u n\xE0y c\xF3 th\u1EC3 kh\xF3 \u0111\u1ECDc. V\u1EABn d\xF9ng \u0111\u01B0\u1EE3c n\u1EBFu ch\u1EC9 \u0111\u1EC3 trang tr\xED.`;
          } else {
            warnBox.hidden = true;
          }
        };
        showWarn(cur);
        const pick = pop.querySelector("#dk-pick");
        if (pick) {
          const apply = (c, save) => {
            const prev = sec.style.getPropertyValue("--sl-gold");
            state.accents[idx] = c;
            sec.style.setProperty("--sl-gold", c);
            sec.style.setProperty("--sl-rail", c);
            if (!save) return;
            opts.pushUndo(() => {
              if (prev) {
                sec.style.setProperty("--sl-gold", prev);
                sec.style.setProperty("--sl-rail", prev);
                state.accents[idx] = prev;
              } else {
                sec.style.removeProperty("--sl-gold");
                sec.style.removeProperty("--sl-rail");
                state.accents[idx] = "";
              }
              opts.onSave(false);
            });
            opts.onSave(false);
          };
          pick.oninput = () => {
            apply(pick.value, false);
            showWarn(pick.value);
          };
          pick.onchange = () => apply(pick.value, true);
        }
        pop.querySelectorAll(".dk-swatch").forEach((b) => {
          b.onclick = () => {
            const c = b.getAttribute("data-c") || "";
            showWarn(c);
            const prev = sec.style.getPropertyValue("--sl-gold");
            state.accents[idx] = c;
            if (c) {
              sec.style.setProperty("--sl-gold", c);
              sec.style.setProperty("--sl-rail", c);
            } else {
              sec.style.removeProperty("--sl-gold");
              sec.style.removeProperty("--sl-rail");
            }
            opts.pushUndo(() => {
              if (prev) {
                sec.style.setProperty("--sl-gold", prev);
                sec.style.setProperty("--sl-rail", prev);
                state.accents[idx] = prev;
              } else {
                sec.style.removeProperty("--sl-gold");
                sec.style.removeProperty("--sl-rail");
                delete state.accents[idx];
              }
            });
            closePop();
            opts.onSync();
            opts.scheduleSave("\u0110\xE3 \u0111\u1ED5i m\xE0u nh\u1EA5n");
          };
        });
      }
    );
  });
  on("dk-filter", (e) => {
    const cur = getRailFilter();
    const opt = (v, lb, hint) => `<button class="dk-fopt${cur === v ? " on" : ""}" data-f="${v}"><b>${esc(lb)}</b><span>${esc(hint)}</span></button>`;
    popover(
      bar,
      e.currentTarget,
      '<div class="dk-pop-t">Hi\u1EC7n slide n\xE0o \u1EDF c\u1ED9t tr\xE1i</div>' + opt("", "T\u1EA5t c\u1EA3", "to\xE0n b\u1ED9 slide c\u1EE7a b\xE0i") + opt("skip", "Ch\u1EC9 slide \u0111ang \u1EA9n", "slide kh\xF4ng tr\xECnh chi\u1EBFu/xu\u1EA5t") + opt("lock", "Ch\u1EC9 slide nguy\xEAn v\u0103n", "l\u1EA5y t\u1EEB gi\xE1o \xE1n \u2014 s\u1EEDa kh\xF4ng \u0103n"),
      (pop) => {
        pop.querySelectorAll(".dk-fopt").forEach((b) => {
          b.onclick = () => {
            setRailFilter(root, b.getAttribute("data-f") || "");
            closePop();
            opts.onSync();
          };
        });
      }
    );
  });
  on("dk-notes", (e) => {
    const cur = sec.dataset.notes || "";
    popover(
      bar,
      e.currentTarget,
      `<div class="dk-pop-t">Ghi ch\xFA / \u0111\xE1p \xE1n</div><div class="dk-pop-hint">Kh\xF4ng hi\u1EC7n tr\xEAn slide \u2014 ch\u1EC9 v\xE0o ph\u1EA7n Notes khi xu\u1EA5t .pptx (m\u1EDF Presenter View \u0111\u1EC3 xem).</div><textarea id="dk-notes-ta" class="dk-ta" rows="6" placeholder="V\xED d\u1EE5: \u0110\xC1P \xC1N A \u2014 v\xEC \u2026">${esc(cur)}</textarea><button id="dk-notes-ok" class="dk-btn primary dk-w">L\u01B0u ghi ch\xFA</button>`,
      (pop) => {
        const ta = pop.querySelector("#dk-notes-ta");
        ta?.focus();
        const save = () => {
          const v = ta?.value || "";
          if (v === (sec.dataset.notes || "")) return false;
          sec.dataset.notes = v;
          opts.onNotes?.(idx, v);
          return true;
        };
        popOnClose = () => {
          if (save()) opts.scheduleSave("\u0110\xE3 s\u1EEDa ghi ch\xFA");
        };
        const okBtn = pop.querySelector("#dk-notes-ok");
        if (okBtn) okBtn.onclick = () => {
          const changed = save();
          closePop();
          if (changed) opts.scheduleSave("\u0110\xE3 s\u1EEDa ghi ch\xFA");
        };
      }
    );
  });
  on("dk-img", () => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = () => {
      const f = inp.files?.[0];
      if (!f) return;
      opts.onMsg("\u0110ang x\u1EED l\xFD \u1EA3nh\u2026");
      compressImg(f, (durl) => {
        opts.onRequestImage?.(idx, durl);
        opts.onMsg("\u0110\xE3 g\u1EEDi \u1EA3nh cho h\u1EC7 th\u1ED1ng x\u1EED l\xFD");
      });
    };
    inp.click();
  });
  on("dk-imgx", () => {
    opts.onRequestImage?.(idx, null);
    opts.onMsg("\u0110\xE3 y\xEAu c\u1EA7u g\u1EE1 \u1EA3nh");
  });
  on("dk-regen", () => {
    const np = window.prompt("M\xF4 t\u1EA3 \u1EA3nh m\u1EDBi (b\u1ECF tr\u1ED1ng = v\u1EBD l\u1EA1i theo m\xF4 t\u1EA3 c\u0169):", "");
    if (np !== null) {
      opts.onRequestRegenImage?.(idx, (np || "").trim());
      opts.onMsg("\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u v\u1EBD l\u1EA1i \u1EA3nh");
    }
  });
}
var popEl = null;
var popOff = null;
var popOnClose = null;
function closePop() {
  const done = popOnClose;
  popOnClose = null;
  try {
    done?.();
  } catch {
  }
  popEl?.remove();
  popEl = null;
  popOff?.();
  popOff = null;
}
function popover(bar, anchor, html, init) {
  const same = popEl?.dataset.for === anchor.id;
  closePop();
  if (same) return;
  const el = document.createElement("div");
  el.className = "dk-pop";
  el.dataset.for = anchor.id;
  el.innerHTML = html;
  const host = bar.closest(".dk-root") || bar.parentElement || bar;
  host.appendChild(el);
  const a = anchor.getBoundingClientRect();
  const b = bar.getBoundingClientRect();
  const h = host.getBoundingClientRect();
  el.style.top = `${a.bottom - h.top + 6}px`;
  el.style.left = `${Math.max(4, Math.min(a.left - h.left, b.right - h.left - el.offsetWidth - 4))}px`;
  popEl = el;
  init?.(el);
  const nativeDialogOpen = () => {
    const a2 = document.activeElement;
    return !!a2 && a2.tagName === "INPUT" && (a2.type === "color" || a2.type === "file") && el.contains(a2);
  };
  const onDoc = (ev) => {
    if (nativeDialogOpen()) return;
    if (!el.contains(ev.target) && !anchor.contains(ev.target)) closePop();
  };
  const onKey = (ev) => {
    if (ev.key === "Escape") closePop();
  };
  setTimeout(() => document.addEventListener("mousedown", onDoc), 0);
  document.addEventListener("keydown", onKey);
  popOff = () => {
    document.removeEventListener("mousedown", onDoc);
    document.removeEventListener("keydown", onKey);
  };
}
function compressImg(file, cb) {
  const rd = new FileReader();
  rd.onload = () => {
    const img = new Image();
    img.onload = () => {
      const mx = 1400;
      let w = img.width, h = img.height;
      if (w > mx || h > mx) {
        const r = Math.min(mx / w, mx / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      cv.getContext("2d").drawImage(img, 0, 0, w, h);
      try {
        cb(cv.toDataURL("image/webp", 0.82));
      } catch {
        cb(cv.toDataURL("image/png"));
      }
    };
    img.src = rd.result;
  };
  rd.readAsDataURL(file);
}

// src/editor/collect.ts
function richText(el) {
  const walk = (n) => {
    if (n.nodeType === 3) return n.textContent || "";
    if (n.nodeType !== 1) return "";
    const e = n;
    const kids = Array.from(e.childNodes).map(walk).join("");
    const tag = e.tagName.toLowerCase();
    if (tag === "b" || tag === "strong") return `<b>${kids}</b>`;
    if (tag === "i" || tag === "em") return `<i>${kids}</i>`;
    if (tag === "sup" || tag === "sub") return `<${tag}>${kids}</${tag}>`;
    if (tag === "br") return " ";
    if (tag === "button") return "";
    return kids;
  };
  return walk(el).replace(/\s+/g, " ").trim();
}
function collect(root, state) {
  const e = {};
  root.querySelectorAll("#scaler > .slide[data-index]").forEach((sec) => {
    if (sec.dataset.new) return;
    const idx = sec.dataset.index;
    sec.querySelectorAll("[data-e]").forEach((el) => {
      const p = (el.getAttribute("data-e") || "").split(".");
      const v = richText(el);
      const o = e[idx] = e[idx] || {};
      const f = p[1];
      if (f === "bullets") {
        ;
        (o.bullets = o.bullets || []).push(v);
      } else if (f === "columns") {
        const ci = +p[2];
        o.columns = o.columns || [];
        const col = o.columns[ci] = o.columns[ci] || { title: "", bullets: [] };
        if (p[3] === "title") col.title = v;
        else col.bullets.push(v);
      } else if (f === "table") {
        const r = +p[2], c = +p[3];
        o.table = o.table || [];
        o.table[r] = o.table[r] || [];
        o.table[r][c] = v;
      } else if (f === "question") {
        o.question = o.question || {};
        if (p[2] === "stem") o.question.stem = v;
        else if (p[2] === "options") (o.question.options = o.question.options || [])[+p[3]] = v;
      } else if (f === "image" && p[2] === "title") {
        o.image_title = v;
      } else if (f === "images" && p[3] === "title") {
        ;
        (o.images_title = o.images_title || [])[+p[2]] = v;
      } else {
        o[f] = v;
      }
    });
  });
  Object.keys(state.kinds).forEach((i) => {
    e[i] = e[i] || {};
    e[i].kind = state.kinds[i];
  });
  Object.keys(state.accents).forEach((i) => {
    e[i] = e[i] || {};
    e[i].accent = state.accents[i];
  });
  Object.keys(state.columns).forEach((i) => {
    e[i] = e[i] || {};
    e[i].columns = state.columns[i];
  });
  Object.keys(state.bullets).forEach((i) => {
    e[i] = e[i] || {};
    e[i].bullets = state.bullets[i];
  });
  const _sk = [];
  Object.keys(state.skipped).forEach((i) => {
    if (state.skipped[i]) _sk.push(+i);
  });
  e.skipped = _sk;
  const st = [];
  root.querySelectorAll("#scaler > .slide").forEach((sec) => {
    if (sec.dataset.new) {
      st.push({ new: readNew(sec) });
    } else if (sec.dataset.index != null) {
      st.push({ ref: +sec.dataset.index });
    }
  });
  e.structure = st;
  return e;
}
function readNew(sec) {
  const o = { kind: sec.dataset.kind || "content", title: "", subtitle: "", bullets: [], columns: [] };
  sec.querySelectorAll("[data-e]").forEach((el) => {
    const p = (el.getAttribute("data-e") || "").split(".");
    const f = p[1];
    const v = richText(el);
    if (f === "title") o.title = v;
    else if (f === "subtitle") o.subtitle = v;
    else if (f === "bullets") {
      if (v) o.bullets.push(v);
    } else if (f === "columns") {
      const ci = +p[2];
      o.columns[ci] = o.columns[ci] || { title: "", bullets: [] };
      if (p[3] === "title") o.columns[ci].title = v;
      else if (v) o.columns[ci].bullets.push(v);
    }
  });
  if (!o.columns.length) delete o.columns;
  if (!o.subtitle) delete o.subtitle;
  return o;
}

// src/editor/index.ts
function newEditorState() {
  return { kinds: {}, accents: {}, skipped: {}, columns: {}, bullets: {} };
}
function readText(el) {
  return (el.innerText || "").replace(/\s+/g, " ").trim();
}
function readBul(sec) {
  const out = [];
  sec.querySelectorAll("[data-e]").forEach((el) => {
    const p = (el.getAttribute("data-e") || "").split(".");
    if (p[1] === "bullets") {
      const v = readText(el);
      if (v) out.push(v);
    }
  });
  return out;
}
function readCols(sec) {
  const m = {};
  sec.querySelectorAll("[data-e]").forEach((el) => {
    const p = (el.getAttribute("data-e") || "").split(".");
    if (p[1] !== "columns") return;
    const i = +p[2];
    const v = readText(el);
    m[i] = m[i] || { title: "", bullets: [] };
    if (p[3] === "title") m[i].title = v;
    else if (v) m[i].bullets.push(v);
  });
  return Object.keys(m).sort((a, b) => +a - +b).map((k) => m[+k]);
}
function toCols(k, bs) {
  if (!bs.length) return [];
  if (k === "proscons" || k === "comparetable") {
    const h = Math.ceil(bs.length / 2);
    return [
      { title: k === "proscons" ? "\u01AFu \u0111i\u1EC3m" : "C\u1ED9t 1", bullets: bs.slice(0, h) },
      { title: k === "proscons" ? "Nh\u01B0\u1EE3c \u0111i\u1EC3m" : "C\u1ED9t 2", bullets: bs.slice(h) }
    ];
  }
  const cap = k === "bignum" || k === "three" || k === "compare" ? 3 : 4;
  return bs.slice(0, cap).map((b) => ({ title: b, bullets: [] }));
}
function colsToBul(cs) {
  const fl = [];
  cs.forEach((c) => {
    if (c.title) fl.push(c.title);
    c.bullets.forEach((b) => fl.push(b));
  });
  return fl.slice(0, 12);
}
function newSlideHTML() {
  return '<div class="slidebar"><button class="edmv" data-d="-1" title="Chuy\u1EC3n l\xEAn">\u25B2</button><button class="edmv" data-d="1" title="Chuy\u1EC3n xu\u1ED1ng">\u25BC</button><button class="eddel" title="Xo\xE1 slide n\xE0y">\u2715</button></div><div class="hd"><div class="kick"></div><div class="ttl" contenteditable="true" data-e="n.title">Ti\xEAu \u0111\u1EC1 slide m\u1EDBi</div></div><div class="rule"></div><div class="foot"></div><div class="pgno"></div><div class="body"><ul class="bul" data-base="n.bullets"><li><span contenteditable="true" data-e="n.bullets.0">N\u1ED9i dung\u2026</span><button class="edx" title="Xo\xE1 \xFD">\xD7</button></li></ul><button class="edadd" data-base="n.bullets">+ \xFD</button></div>';
}

// src/mount.ts
var DENSITY = { compact: "48px", normal: "64px", roomy: "80px" };
function applyDisplay(el, d) {
  const fs = Number(d?.fontScale);
  el.style.setProperty("--dk-fs", String(Number.isFinite(fs) ? Math.min(1.6, Math.max(0.6, fs)) : 1));
  const ff = String(d?.fontFamily || "").trim();
  if (ff) el.style.setProperty("--sl-font", ff);
  else el.style.removeProperty("--sl-font");
  const pad = DENSITY[d?.density || ""];
  if (pad) el.style.setProperty("--dk-pad", pad);
  else el.style.removeProperty("--dk-pad");
}
function mountDeck(el, input, opts = {}) {
  let deck = normalizeDeck(input);
  if (opts.theme) deck.theme = opts.theme;
  if (opts.transition) deck.transition = opts.transition;
  const base = normalizeDeck(JSON.parse(JSON.stringify(input)));
  let edit = !!opts.edit;
  const listeners = /* @__PURE__ */ new Map();
  const undoStack = [];
  const redoStack = [];
  let player = null;
  let saveTimer = null;
  let styleEl = null;
  const editorState = newEditorState();
  const editorUndoStack = [];
  const emit = (ev, p) => listeners.get(ev)?.forEach((fn) => {
    try {
      fn(p);
    } catch {
      if (edit) msg(`\u26A0 App ch\u1EE7 b\xE1o l\u1ED7i khi x\u1EED l\xFD "${ev}"`, "ed-error");
    }
  });
  function paint() {
    const keep = player?.cur() ?? 0;
    el.innerHTML = renderStage(deck, { edit, foot: opts.foot });
    if (!styleEl) {
      styleEl = document.createElement("style");
      el.prepend(styleEl);
    } else {
      el.prepend(styleEl);
    }
    styleEl.textContent = deckCss(deck, { edit });
    applyTheme(el, deck.theme || DEFAULT_THEME);
    el.classList.toggle("lp-edit", edit);
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    el.style.overflow = el.style.overflow || "hidden";
    el.classList.add("dk-root");
    applyDisplay(el, deck.display);
    player?.destroy();
    player = attachPlayer(el, {
      w: deck.size?.w,
      h: deck.size?.h,
      keyboard: opts.keyboard,
      onSlideChange: (i, total) => {
        emit("slideChange", { index: i, total });
        if (edit) {
          railSetActive(el, i);
          syncToolbar();
        }
      }
    });
    player.show(Math.min(keep, deck.slides.length - 1));
    if (edit) {
      attachEditorHandlers();
      syncEditor();
    }
  }
  function pushUndo() {
    undoStack.push(JSON.stringify(deck));
    if (undoStack.length > 60) undoStack.shift();
    redoStack.length = 0;
  }
  function pushEditorUndo(fn) {
    editorUndoStack.push(fn);
    if (editorUndoStack.length > 80) editorUndoStack.shift();
  }
  function undoEditorStep() {
    const f = editorUndoStack.pop();
    if (!f) return false;
    try {
      f();
    } catch {
    }
    player?.refresh();
    syncEditor();
    return true;
  }
  function changed(repaint = true) {
    if (repaint) paint();
    emit("change", deck);
    if (opts.autoSaveMs !== 0) {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => emit("save", handle.getPatch()), opts.autoSaveMs ?? 1200);
    }
  }
  function msg(t, cls = "") {
    const m = el.querySelector("#edmsg");
    if (!m) return;
    m.textContent = t;
    m.className = cls ? `dk-status ${cls}` : "dk-status";
  }
  const clock = () => (/* @__PURE__ */ new Date()).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  let lastNote = "";
  function scheduleSave(note) {
    clearTimeout(saveTimer);
    lastNote = note || "";
    msg(note || "C\xF3 thay \u0111\u1ED5i ch\u01B0a l\u01B0u\u2026", "ed-dirty");
    saveTimer = setTimeout(() => {
      msg(lastNote ? `${lastNote} \xB7 \u0110ang l\u01B0u\u2026` : "\u0110ang l\u01B0u\u2026", "ed-dirty");
      emit("save", collect(el, editorState));
    }, opts.autoSaveMs ?? 1200);
  }
  function syncEditor() {
    if (!edit) return;
    buildRail(el, {
      // Rail báo việc vừa làm qua `note` để lời nhắc hoàn tác không bị câu chung
      // chung của `scheduleSave` ghi đè ngay sau đó.
      onSync: (note) => {
        player?.refresh();
        syncEditor();
        scheduleSave(note);
      },
      onMsg: msg,
      pushUndo: pushEditorUndo,
      onGoto: (i) => player?.show(i),
      onDup: dupSlideFromDOM,
      onDel: delSlideFromDOM
    });
    syncToolbar();
  }
  function syncToolbar() {
    if (!edit) return;
    buildToolbar(el, editorState, {
      onMsg: msg,
      onSave: (reload) => {
        clearTimeout(saveTimer);
        msg(reload ? "\u0110ang \u0111\u1ED5i b\u1ED1 c\u1EE5c\u2026" : "\u0110ang l\u01B0u\u2026", "ed-dirty");
        emit("save", collect(el, editorState));
        if (reload) setTimeout(() => paint(), 100);
      },
      onRequestImage: (idx, dataUrl) => emit("requestImage", { index: idx, dataUrl }),
      onRequestRegenImage: (idx, prompt) => emit("requestRegenImage", { index: idx, prompt }),
      onReset: () => emit("reset"),
      pushUndo: pushEditorUndo,
      scheduleSave,
      onAddSlide: addSlide,
      onPresent: () => handle.present(!el.classList.contains("lp-present")),
      onDup: dupSlideFromDOM,
      onDel: delSlideFromDOM,
      onSync: syncEditor,
      // Đọc từ DOM chứ không từ `deck.slides` — DOM mới là bản GV vừa gõ (chưa lưu).
      onAdapt: (k, idx, sec) => {
        const slide = deck.slides[idx];
        if (!slide) return "";
        const chk = canConvert(slide, k);
        if (!chk.ok) return "";
        if (chk.transform === "bulletsToColumns") {
          const bs = readBul(sec);
          if (bs.length) {
            editorState.columns[idx] = toCols(k, bs);
            return "\u0110\xE3 t\xE1ch \xFD th\xE0nh c\u1ED9t cho b\u1ED1 c\u1EE5c m\u1EDBi";
          }
        }
        if (chk.transform === "columnsToBullets") {
          const fl = colsToBul(readCols(sec));
          if (fl.length) {
            editorState.bullets[idx] = fl;
            return "\u0110\xE3 g\u1ED9p c\u1ED9t th\xE0nh c\xE1c \xFD";
          }
        }
        if (chk.willHide) {
          return `B\u1ED1 c\u1EE5c m\u1EDBi kh\xF4ng v\u1EBD ${chk.willHide} ph\u1EA7n n\u1ED9i dung \u2014 d\u1EEF li\u1EC7u v\u1EABn c\xF2n, \u0111\u1ED5i l\u1EA1i l\xE0 th\u1EA5y`;
        }
        return "";
      }
    });
  }
  let onDocKey = null;
  let editorBound = false;
  function attachEditorHandlers() {
    el.querySelector("#edreset")?.addEventListener("click", () => emit("reset"));
    if (editorBound) return;
    editorBound = true;
    el.addEventListener("click", (ev) => {
      const t = ev.target;
      if (!t.classList) return;
      if (t.classList.contains("edx")) {
        const li = t.closest("li");
        if (li) {
          const par = li.parentNode;
          const ref = li.nextSibling;
          li.remove();
          pushEditorUndo(() => par?.insertBefore(li, ref));
        }
        scheduleSave();
        ev.preventDefault();
      } else if (t.classList.contains("eddel")) {
        const s = t.closest(".slide");
        if (s) delSlideFromDOM(s);
        ev.preventDefault();
        ev.stopPropagation();
      } else if (t.classList.contains("edmv")) {
        const sm = t.closest(".slide");
        const d = +(t.getAttribute("data-d") || 0);
        const sib = d < 0 ? sm.previousElementSibling : sm.nextElementSibling;
        if (sm && sib && sib.classList.contains("slide")) {
          const par = sm.parentNode;
          const ref = sm.nextSibling;
          if (d < 0) par.insertBefore(sm, sib);
          else par.insertBefore(sib, sm);
          pushEditorUndo(() => par.insertBefore(sm, ref));
          player?.refresh();
          syncEditor();
          scheduleSave("\u0110\xE3 \u0111\u1ED5i th\u1EE9 t\u1EF1 \u2014 Ctrl+Z \u0111\u1EC3 ho\xE0n t\xE1c");
        }
        ev.preventDefault();
        ev.stopPropagation();
      } else if (t.classList.contains("edadd")) {
        const base2 = t.getAttribute("data-base") || "";
        const ul = t.previousElementSibling;
        if (ul && ul.classList.contains("bul")) {
          const li = document.createElement("li");
          li.innerHTML = `<span contenteditable="true" data-e="${base2}.x">\xDD m\u1EDBi</span><button class="edx" title="Xo\xE1 \xFD">\xD7</button>`;
          ul.appendChild(li);
          pushEditorUndo(() => li.remove());
          focusEnd(li.querySelector("span"));
          scheduleSave();
        }
        ev.preventDefault();
      }
    }, true);
    el.addEventListener("input", (ev) => {
      if (ev.target?.isContentEditable) scheduleSave();
    }, true);
    el.addEventListener("focusin", (ev) => {
      const t = ev.target;
      if (t?.isContentEditable) t.setAttribute("data-prev", t.innerHTML);
    }, true);
    el.addEventListener("focusout", (ev) => {
      const t = ev.target;
      if (!t?.isContentEditable) return;
      const pv = t.getAttribute("data-prev");
      if (pv != null && pv !== t.innerHTML) pushEditorUndo(() => {
        t.innerHTML = pv;
      });
      t.removeAttribute("data-prev");
    }, true);
    el.addEventListener("keydown", (ev) => {
      if (!(ev.ctrlKey || ev.metaKey) || ev.key !== "s" && ev.key !== "S") return;
      clearTimeout(saveTimer);
      msg("\u0110ang l\u01B0u\u2026", "ed-dirty");
      emit("save", collect(el, editorState));
      ev.preventDefault();
      ev.stopPropagation();
    }, true);
    onDocKey = (ev) => {
      const isMove = ev.altKey && (ev.key === "ArrowUp" || ev.key === "ArrowDown");
      const isUndo = (ev.ctrlKey || ev.metaKey) && (ev.key === "z" || ev.key === "Z");
      if (!isMove && !isUndo) return;
      if (!edit || !document.body.contains(el)) return;
      const a = document.activeElement;
      if (a && a !== document.body && !el.contains(a)) return;
      if (ev.key === "z" || ev.key === "Z") {
        if (!undoEditorStep()) {
          msg("Ch\u01B0a c\xF3 thao t\xE1c n\xE0o \u0111\u1EC3 ho\xE0n t\xE1c");
          ev.preventDefault();
          return;
        }
        msg("\u0110\xE3 ho\xE0n t\xE1c thao t\xE1c v\u1EEBa r\u1ED3i");
        ev.preventDefault();
        ev.stopPropagation();
        return;
      }
      const sec = el.querySelector("#scaler > .slide.active");
      if (!sec || !sec.parentNode) return;
      const up = ev.key === "ArrowUp";
      const sib = up ? sec.previousElementSibling : sec.nextElementSibling;
      if (!sib) return;
      const par = sec.parentNode;
      const back = sec.nextSibling;
      if (up) par.insertBefore(sec, sib);
      else par.insertBefore(sec, sib.nextSibling);
      pushEditorUndo(() => {
        par.insertBefore(sec, back);
      });
      player?.refresh();
      syncEditor();
      scheduleSave(`\u0110\xE3 chuy\u1EC3n slide ${up ? "l\xEAn" : "xu\u1ED1ng"} \u2014 Ctrl+Z \u0111\u1EC3 ho\xE0n t\xE1c`);
      ev.preventDefault();
      ev.stopPropagation();
    };
    document.addEventListener("keydown", onDocKey, true);
  }
  function addSlide() {
    const sc = el.querySelector("#scaler");
    if (!sc) return;
    const a = el.querySelector("#scaler > .slide.active");
    const sec = document.createElement("section");
    sec.className = "slide chrome dots";
    sec.setAttribute("data-new", "1");
    sec.setAttribute("data-kind", "content");
    sec.setAttribute("data-nb", "1");
    sec.innerHTML = newSlideHTML();
    if (a?.nextSibling) sc.insertBefore(sec, a.nextSibling);
    else sc.appendChild(sec);
    pushEditorUndo(() => {
      sec.remove();
      player?.refresh();
    });
    player?.refresh();
    const pos = Array.from(el.querySelectorAll("#scaler > .slide")).indexOf(sec);
    if (pos >= 0) player?.show(pos);
    syncEditor();
    focusEnd(sec.querySelector(".ttl"));
    msg("\u0110\xE3 th\xEAm slide m\u1EDBi \xB7 s\u1EEDa n\u1ED9i dung r\u1ED3i L\u01B0u");
  }
  function focusEnd(sp) {
    if (!sp) return;
    sp.focus();
    const r = document.createRange();
    r.selectNodeContents(sp);
    const s = getSelection();
    if (!s) return;
    s.removeAllRanges();
    s.addRange(r);
  }
  function dupSlideFromDOM(sec) {
    const c = sec.cloneNode(true);
    c.setAttribute("data-new", "1");
    c.removeAttribute("data-index");
    c.classList.remove("active");
    sec.parentNode.insertBefore(c, sec.nextSibling);
    pushEditorUndo(() => c.remove());
    player?.refresh();
    syncEditor();
    scheduleSave("\u0110\xE3 nh\xE2n b\u1EA3n slide \u2014 Ctrl+Z \u0111\u1EC3 b\u1ECF");
  }
  function delSlideFromDOM(sec) {
    const all = el.querySelectorAll("#scaler > .slide");
    if (all.length <= 1) {
      msg("Kh\xF4ng xo\xE1 \u0111\u01B0\u1EE3c: deck ph\u1EA3i c\xF2n \xEDt nh\u1EA5t 1 slide", "ed-error");
      return;
    }
    const wa = sec.classList.contains("active");
    const nx = sec.nextElementSibling || sec.previousElementSibling;
    const par = sec.parentNode;
    const ref = sec.nextSibling;
    sec.remove();
    pushEditorUndo(() => {
      par.insertBefore(sec, ref);
      player?.refresh();
      const back = Array.from(el.querySelectorAll("#scaler > .slide")).indexOf(sec);
      if (back >= 0) player?.show(back);
    });
    player?.refresh();
    if (wa && nx) {
      const pos = Array.from(el.querySelectorAll("#scaler > .slide")).indexOf(nx);
      if (pos >= 0) player?.show(pos);
    }
    syncEditor();
    scheduleSave("\u0110\xE3 xo\xE1 slide \u2014 Ctrl+Z \u0111\u1EC3 l\u1EA5y l\u1EA1i");
  }
  const handle = {
    goto: (i) => player?.show(i),
    next: () => player?.next(),
    prev: () => player?.prev(),
    current: () => player?.cur() ?? 0,
    count: () => deck.slides.length,
    present(on) {
      el.classList.toggle("lp-present", on);
      if (on) player?.fullscreen();
      else if (document.fullscreenElement) document.exitFullscreen();
    },
    fit: () => player?.fit(),
    setEditMode(on) {
      edit = on;
      paint();
    },
    setTheme(k) {
      pushUndo();
      deck.theme = k;
      changed();
    },
    setTransition(k) {
      pushUndo();
      deck.transition = k;
      changed();
    },
    undo() {
      if (edit) {
        if (undoEditorStep()) msg("\u0110\xE3 ho\xE0n t\xE1c thao t\xE1c v\u1EEBa r\u1ED3i");
        return;
      }
      const prev = undoStack.pop();
      if (!prev) return;
      redoStack.push(JSON.stringify(deck));
      deck = JSON.parse(prev);
      changed();
    },
    redo() {
      if (edit) return;
      const nxt = redoStack.pop();
      if (!nxt) return;
      undoStack.push(JSON.stringify(deck));
      deck = JSON.parse(nxt);
      changed();
    },
    getDeck: () => JSON.parse(JSON.stringify(deck)),
    getPatch: () => diffDeck(base, deck),
    setDeck(d) {
      pushUndo();
      deck = normalizeDeck(d);
      changed();
    },
    canSetKind(idx, kind) {
      return canConvert(deck.slides[idx], kind);
    },
    setKind(idx, kind) {
      const sl = deck.slides[idx];
      if (!sl || !canConvert(sl, kind).ok) return false;
      pushUndo();
      deck.slides[idx] = convert(sl, kind);
      changed();
      return true;
    },
    toHTML() {
      return toStandaloneHtml(deck, opts.foot);
    },
    setSaveState(state, detail) {
      if (state === "saving") return msg("\u0110ang l\u01B0u\u2026", "ed-dirty");
      if (state === "saved") {
        lastNote = "";
        return msg(`\u2713 \u0110\xE3 l\u01B0u ${clock()}`, "ed-saved");
      }
      if (state === "dirty") return msg("C\xF3 thay \u0111\u1ED5i ch\u01B0a l\u01B0u\u2026", "ed-dirty");
      msg(`\u26A0 L\u01AFU H\u1ECENG${detail ? ` \u2014 ${detail}` : ""} \xB7 Ctrl+S \u0111\u1EC3 th\u1EED l\u1EA1i`, "ed-error");
    },
    on(ev, fn) {
      if (!listeners.has(ev)) listeners.set(ev, /* @__PURE__ */ new Set());
      listeners.get(ev).add(fn);
      return () => listeners.get(ev)?.delete(fn);
    },
    destroy() {
      clearTimeout(saveTimer);
      if (onDocKey) {
        document.removeEventListener("keydown", onDocKey, true);
        onDocKey = null;
      }
      player?.destroy();
      listeners.clear();
      el.innerHTML = "";
      styleEl = null;
    }
  };
  paint();
  emit("ready", { count: deck.slides.length });
  return handle;
}
function diffDeck(base, cur) {
  const byId = new Map(base.slides.map((s) => [s.id, s]));
  const slides = {};
  const added = [];
  for (const s of cur.slides) {
    const b = byId.get(s.id);
    if (!b) {
      added.push(s);
      continue;
    }
    const patch = {};
    for (const k of Object.keys(s)) {
      if (k === "id") continue;
      if (JSON.stringify(s[k]) !== JSON.stringify(b[k])) patch[k] = s[k];
    }
    if (Object.keys(patch).length) slides[s.id] = patch;
  }
  const curIds = new Set(cur.slides.map((s) => s.id));
  return {
    slides,
    added,
    order: cur.slides.map((s) => s.id),
    removed: base.slides.filter((s) => !curIds.has(s.id)).map((s) => s.id),
    skipped: cur.slides.filter((s) => s.skipped).map((s) => s.id)
  };
}
function toStandaloneHtml(deck, foot) {
  const d = normalizeDeck(deck);
  const title = d.title || "B\xE0i gi\u1EA3ng";
  const shell = "html,body{margin:0;height:100%;background:#0d0f14;overflow:hidden}";
  const t = THEME_BY_KEY[d.theme || DEFAULT_THEME] || THEME_BY_KEY[DEFAULT_THEME];
  const tok = Object.entries(t.tokens).map(([k, v]) => `--sl-${k}:${String(v).replace(/[;"<>]/g, "")}`).join(";");
  const fsv = Number(d.display?.fontScale);
  const fs = Number.isFinite(fsv) ? Math.min(1.6, Math.max(0.6, fsv)) : 1;
  const pad = DENSITY[d.display?.density || ""];
  const disp = `--dk-fs:${fs}` + (pad ? `;--dk-pad:${pad}` : "");
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title.replace(/[<>&]/g, "")}</title><style>${shell}${deckCss(d)}</style></head><body><div class="dk-root" data-theme="${esc(t.key)}" data-dark="${t.dark ? 1 : 0}" style="height:100%;${tok};${disp}">` + renderStage(d, { foot }) + `</div><script>(${bootstrapPlayer.toString()})(${d.size?.w || 1280},${d.size?.h || 720})</script></body></html>`;
}
function bootstrapPlayer(W, H) {
  const S = Array.from(document.querySelectorAll("#scaler > .slide"));
  const sc = document.getElementById("scaler");
  let cur = 0;
  const fit = () => {
    const s = Math.min((innerWidth - 48) / W, (innerHeight - 96) / H);
    if (s > 0) sc.style.transform = `scale(${s})`;
  };
  const show = (i) => {
    cur = Math.max(0, Math.min(S.length - 1, i));
    S.forEach((s, k) => s.classList.toggle("active", k === cur));
    const c = document.getElementById("cnt");
    if (c) c.textContent = `${cur + 1} / ${S.length}`;
    const p = document.getElementById("sprog");
    if (p) p.style.width = `${(cur + 1) / S.length * 100}%`;
  };
  addEventListener("resize", fit);
  addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      show(cur + 1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      show(cur - 1);
      e.preventDefault();
    } else if (e.key === "Home") show(0);
    else if (e.key === "End") show(S.length - 1);
    else if (e.key === "f" || e.key === "F") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  });
  document.getElementById("prev").onclick = () => show(cur - 1);
  document.getElementById("next").onclick = () => show(cur + 1);
  const fb = document.getElementById("fs");
  if (fb) fb.onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  const nav = document.querySelector(".nav");
  if (nav) {
    const pb = document.createElement("button");
    pb.textContent = "\u2399";
    pb.title = "In / L\u01B0u PDF (Ctrl+P)";
    pb.onclick = () => print();
    nav.appendChild(pb);
  }
  fit();
  show(0);
}

// src/react/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var DeckView = (0, import_react.forwardRef)(function DeckView2(props, ref) {
  const hostRef = (0, import_react.useRef)(null);
  const handleRef = (0, import_react.useRef)(null);
  const cb = (0, import_react.useRef)(props);
  cb.current = props;
  (0, import_react.useEffect)(() => {
    if (!hostRef.current) return;
    const h = mountDeck(hostRef.current, props.deck, {
      edit: props.edit,
      theme: props.theme,
      transition: props.transition,
      foot: props.foot,
      autoSaveMs: props.autoSaveMs,
      keyboard: props.keyboard
    });
    handleRef.current = h;
    h.on("ready", (p) => cb.current.onReady?.(p));
    h.on("change", (p) => cb.current.onChange?.(p));
    h.on("save", (p) => cb.current.onSave?.(p));
    h.on("slideChange", (p) => cb.current.onSlideChange?.(p));
    h.on("requestImage", (p) => cb.current.onRequestImage?.(p));
    h.on("requestRegenImage", (p) => cb.current.onRequestRegenImage?.(p));
    h.on("reset", () => cb.current.onReset?.());
    return () => {
      h.destroy();
      handleRef.current = null;
    };
  }, [props.deck]);
  (0, import_react.useEffect)(() => {
    handleRef.current?.setEditMode(!!props.edit);
  }, [props.edit]);
  (0, import_react.useEffect)(() => {
    if (props.theme) handleRef.current?.setTheme(props.theme);
  }, [props.theme]);
  (0, import_react.useEffect)(() => {
    if (props.transition) handleRef.current?.setTransition(props.transition);
  }, [props.transition]);
  (0, import_react.useImperativeHandle)(ref, () => handleRef.current);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      ref: hostRef,
      className: props.className,
      style: { position: "relative", width: "100%", height: "100%", ...props.style }
    }
  );
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeckView,
  mountDeck
});
//# sourceMappingURL=react.cjs.map