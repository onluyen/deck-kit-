/**
 * Tương phản WCAG cho màu nhấn slide.
 *
 * Vì sao cần: ô `<input type="color">` cho giáo viên chọn màu BẤT KỲ mà không phản hồi gì.
 * Chọn vàng nhạt trên nền sáng là `.kick`/`.qmark` biến mất, không có gì báo.
 *
 * Vì sao CẢNH BÁO chứ không CHẶN: màu nhấn có lúc chỉ để trang trí (thanh `rule::before`),
 * lúc đó tương phản không quan trọng. Chặn là phủ nhận phán đoán của giáo viên; cảnh báo là
 * đưa thông tin rồi để họ quyết.
 *
 * ⚠️ KHÔNG dùng file này để SUY màu tự động. Repo đã thử và đã hoàn nguyên
 * (`builders.ts` — `BAR_COLORS`): ý nghĩa token đảo ngược giữa theme sáng và tối, suy màu
 * từ token cho ra kết quả không đọc nổi mà mọi test vẫn xanh. Đây chỉ để ĐO màu đã có.
 */

/** `#rgb` · `#rrggbb` · `rgb(r,g,b)` → [r,g,b]; không đọc được thì `null`. */
export function parseColor(c: string): [number, number, number] | null {
  const s = (c || "").trim()
  if (!s) return null
  const m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (m) {
    const h = m[1]
    const f = h.length === 3
      ? [h[0] + h[0], h[1] + h[1], h[2] + h[2]]
      : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)]
    return [parseInt(f[0], 16), parseInt(f[1], 16), parseInt(f[2], 16)]
  }
  const r = s.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i)
  if (r) return [+r[1], +r[2], +r[3]]
  return null
}

/** Độ chói tương đối theo WCAG 2.x. */
function luminance([r, g, b]: [number, number, number]): number {
  const f = (v: number) => {
    const x = v / 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

/** Tỉ số tương phản giữa hai màu (1 → 21). Màu không đọc được → `null`. */
export function contrast(a: string, b: string): number | null {
  const ca = parseColor(a), cb = parseColor(b)
  if (!ca || !cb) return null
  const la = luminance(ca), lb = luminance(cb)
  const hi = Math.max(la, lb), lo = Math.min(la, lb)
  return (hi + 0.05) / (lo + 0.05)
}

export type AccentCheck = {
  /** Vai làm CHỮ: màu nhấn trên nền slide. */
  asText: number | null
  /** Vai làm NỀN: chữ `--sl-navy2` nằm trên màu nhấn. */
  asBg: number | null
  /** Vai tệ hơn. */
  worst: number | null
  /** `true` nếu vai tệ hơn dưới 4.5:1 (ngưỡng AA cho chữ thường). */
  low: boolean
}

/**
 * Đo màu nhấn ở CẢ HAI vai nó đang gánh trong `base.css`:
 *
 *   • màu CHỮ trên `--sl-bg`     (`.kick`, `.qmark`, số thứ tự…)
 *   • màu NỀN cho chữ `--sl-navy2` (`.chip`, `.badge`, ô nhấn…)
 *
 * Một token gánh hai vai vốn đã ở mép an toàn — nên phải đo cả hai rồi lấy vai tệ hơn, chứ
 * đo mỗi vai chữ là bỏ sót đúng nửa số cách làm slide không đọc được.
 */
export function checkAccent(accent: string, bg: string, fg: string): AccentCheck {
  const asText = contrast(accent, bg)
  const asBg = contrast(fg, accent)
  const vals = [asText, asBg].filter((x): x is number => x != null)
  const worst = vals.length ? Math.min(...vals) : null
  return { asText, asBg, worst, low: worst != null && worst < 4.5 }
}
