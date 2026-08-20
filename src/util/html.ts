/** Escape HTML — tương đương `html.escape(s, quote=True)` của Python (kể cả `'` → `&#x27;`). */
export function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

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
export function escRich(s: unknown): string {
  return esc(s).replace(/&lt;(\/?)(b|i|sup|sub)&gt;/g, "<$1$2>")
}

/** Bỏ tiền tố "Bước 1:" / "Giai đoạn 2 -" … đầu câu (khớp `_strip_step` phía Python). */
export function stripStep(b: string): string {
  return String(b || "").replace(/^\s*(B[ưu][ớo]c|Giai đoạn|Stage|Step)\s*\d+\s*[:.\-–]?\s*/, "").trim()
}

/** Số 2 chữ số: 1 → "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

export const nonEmpty = (a?: unknown[]): string[] =>
  (a || []).map(x => String(x ?? "")).filter(x => x.trim())

/**
 * LaTeX → chữ đọc được (gần đúng). Dùng khi KHÔNG có ảnh công thức.
 *
 * Không có bước này thì slide đổ nguyên mã nguồn ra màn hình — đã gặp thật ở bài
 * d0e71b8f: `y=\left\{\begin{array}{l}-x \text{ nếu } x<-1 …`. Thà hiện công thức
 * dạng chữ đã dọn còn hơn hiện mã.
 *
 * Bản song song ở Python: `deck_json._tex_to_text` (giữ hai bên khớp nhau).
 */
export function texToText(tex: string): string {
  let t = String(tex || "")
  // THỨ TỰ QUAN TRỌNG: lệnh DÀI thay trước lệnh ngắn trùng tiền tố, không thì
  // `\left` bị `\le` ăn mất đầu thành `f≤ft(`.
  const MAP: Array<[string, string]> = [
    ["\\Leftrightarrow", "⇔"], ["\\Rightarrow", "⇒"], ["\\mathbb{R}", "ℝ"],
    ["\\forall", "∀"], ["\\exists", "∃"], ["\\infty", "∞"],
    ["\\left", ""], ["\\right", ""], ["\\times", "×"], ["\\cdot", "·"],
    ["\\sqrt", "√"], ["\\leq", "≤"], ["\\geq", "≥"], ["\\neq", "≠"],
    ["\\le", "≤"], ["\\ge", "≥"], ["\\ne", "≠"], ["\\to", "→"], ["\\in", "∈"],
    // Chữ Hy Lạp — PHẢI có, không thì luật "lệnh còn sót" bên dưới XOÁ SẠCH chúng.
    // Đo trên bài thật `9208c648`: `\Delta_{Q}=Q_{3}-Q_{1}` ra `=Q3-Q1` (công thức bắt đầu
    // bằng `=`, mất tên đại lượng) · `\alpha+\beta` ra `+` · `\theta` ra chuỗi RỖNG.
    // Mất nghĩa chứ không phải xấu. Giữ ĐỒNG BỘ với `deck_json._tex_to_text` phía Python.
    ["\\vartheta", "ϑ"], ["\\varphi", "φ"], ["\\varepsilon", "ε"],
    ["\\Delta", "Δ"], ["\\Gamma", "Γ"], ["\\Lambda", "Λ"], ["\\Omega", "Ω"],
    ["\\Sigma", "Σ"], ["\\Theta", "Θ"], ["\\Phi", "Φ"], ["\\Psi", "Ψ"], ["\\Pi", "Π"],
    ["\\alpha", "α"], ["\\beta", "β"], ["\\gamma", "γ"], ["\\delta", "δ"],
    ["\\epsilon", "ε"], ["\\zeta", "ζ"], ["\\eta", "η"], ["\\theta", "θ"],
    ["\\iota", "ι"], ["\\kappa", "κ"], ["\\lambda", "λ"], ["\\mu", "μ"],
    ["\\nu", "ν"], ["\\xi", "ξ"], ["\\rho", "ρ"], ["\\sigma", "σ"], ["\\tau", "τ"],
    ["\\upsilon", "υ"], ["\\phi", "φ"], ["\\chi", "χ"], ["\\psi", "ψ"],
    ["\\omega", "ω"], ["\\pi", "π"],
  ]
  for (const [a, b] of MAP) t = t.split(a).join(b)

  // Gỡ `_{…}`/`^{…}` TRƯỚC phân số: `\dfrac{x^{2}-1}{x+2}` có ngoặc LỒNG mà mẫu
  // `[^{}]*` không khớp được → phân số MẤT DẤU CHIA (sai nghĩa toán, không chỉ xấu).
  t = t.replace(/_\{([^{}]*)\}/g, "$1").replace(/\^\{([^{}]*)\}/g, "^$1")
  t = t.replace(/\\text\{([^{}]*)\}/g, "$1")
  for (let i = 0; i < 3; i++) {                       // phân số lồng vài tầng
    const next = t.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "($1)/($2)")
    if (next === t) break
    t = next
  }
  // xuống dòng của môi trường array/cases → dấu chấm phẩy cho gọn một dòng
  t = t.replace(/\\begin\{[a-z]*\}(\{[^{}]*\})?/gi, "").replace(/\\end\{[a-z]*\}/gi, "")
  t = t.replace(/\\\\/g, " ; ")
  t = t.replace(/\\[a-zA-Z]+/g, "")                   // lệnh còn sót
  // `\{` `\}` `\,` `\;` là ngoặc/khoảng trắng ESCAPE — bỏ dấu `\` thừa, không thì
  // ra `y=\-x` (thấy thật khi dựng `\left\{…`).
  t = t.replace(/\\([{}[\]|,;!\s])/g, "$1").replace(/\\+/g, "")
  return t.replace(/[{}$]/g, "").replace(/\s+/g, " ").trim()
}
