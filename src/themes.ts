/**
 * 12 theme dựng sẵn — mỗi theme là một bộ CSS-variable `--sl-*`.
 * Sinh 1:1 từ `slide_themes.THEMES` phía Python; đổi theme KHÔNG đụng template layout.
 */
export type Theme = { key: string; label: string; dark: boolean; tokens: Record<string, string> }

export const THEMES: Theme[] = [
  { key: "navy-gold", label: "Navy · Vàng", dark: false,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 620px at 82% -12%,#eef3fd,#ffffff 62%)", "bg2": "linear-gradient(160deg,#f6f8fc,#eef2fb)", "ink": "#1C274C", "navy": "#2B4182", "navy2": "#0F2977", "gold": "#FFB000", "blue": "#2684FC", "blue-pale": "#8FA9E8", "blue-border": "#BEDBFF", "blue-deep": "#1C398E", "blue-tint": "#EEF6FF", "green": "#0E9F6E", "muted": "#6B7280", "border": "#E6E9F0", "card": "#ffffff", "rail": "#2B4182", "dot": "#C7D8Fb", "amber-bg": "#FFF7E6", "amber-bd": "#FFE2A8"} },
  { key: "blue-green", label: "Xanh lục học thuật", dark: false,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 620px at 82% -12%,#e6f7f2,#ffffff 62%)", "bg2": "linear-gradient(160deg,#eefaf6,#e3f3ee)", "ink": "#0F2E29", "navy": "#0B6E5A", "navy2": "#064E45", "gold": "#12B886", "blue": "#0CA678", "blue-pale": "#8FD3C2", "blue-border": "#B2E5D8", "blue-deep": "#0B5A48", "blue-tint": "#E9F8F3", "green": "#0B7285", "muted": "#5C6B68", "border": "#DCEDE8", "card": "#ffffff", "rail": "#0B6E5A", "dot": "#BEE7DB", "amber-bg": "#FFF4E6", "amber-bd": "#FFDFB0"} },
  { key: "cream-editorial", label: "Kem cổ điển", dark: false,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 620px at 82% -12%,#f7f0e6,#FAF7F2 60%)", "bg2": "linear-gradient(160deg,#faf6ef,#f3ece0)", "ink": "#2A2118", "navy": "#3A2E22", "navy2": "#241C14", "gold": "#C2410C", "blue": "#B45309", "blue-pale": "#D9BFA6", "blue-border": "#EAD9C4", "blue-deep": "#7C3A12", "blue-tint": "#F6ECE0", "green": "#4D7C0F", "muted": "#7A6C5A", "border": "#E7DCCB", "card": "#FFFDF9", "rail": "#3A2E22", "dot": "#E3D2BC", "amber-bg": "#FBF1E2", "amber-bd": "#EAD3B4","font-display": "Georgia,\"DejaVu Serif\",\"Liberation Serif\",\"Times New Roman\",serif"} },
  { key: "dark-modern", label: "Tối hiện đại", dark: true,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 700px at 78% -10%,#1b2440,#0f1526 62%)", "bg2": "linear-gradient(160deg,#141b30,#0f1424)", "ink": "#E6ECF7", "navy": "#EAF0FF", "navy2": "#0B1120", "gold": "#FBBF24", "blue": "#60A5FA", "blue-pale": "#5A6B93", "blue-border": "#324063", "blue-deep": "#93C5FD", "blue-tint": "#1B2540", "green": "#34D399", "muted": "#9AA6C0", "border": "#28324f", "card": "#161d33", "rail": "#FBBF24", "dot": "#33406a", "amber-bg": "#2A2410", "amber-bd": "#4A3F17"} },
  { key: "purple-tech", label: "Tím công nghệ", dark: false,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1100px 640px at 80% -12%,#efeafe,#ffffff 62%)", "bg2": "linear-gradient(160deg,#f2eefe,#eae3fb)", "ink": "#241C3A", "navy": "#5B3FC4", "navy2": "#3B2A86", "gold": "#12B886", "blue": "#7C5CFC", "blue-pale": "#B9A6F2", "blue-border": "#DCD0FB", "blue-deep": "#4B32A8", "blue-tint": "#F2EEFE", "green": "#0CA678", "muted": "#6B6480", "border": "#E7E1F5", "card": "#ffffff", "rail": "#5B3FC4", "dot": "#D8CBF7", "amber-bg": "#F4EEFE", "amber-bd": "#DCCFF7"} },
  { key: "black-gold", label: "Đen · Vàng", dark: true,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 700px at 78% -10%,#242017,#141109 64%)", "bg2": "linear-gradient(160deg,#1c1810,#12100a)", "ink": "#F3ECD8", "navy": "#F7E7B0", "navy2": "#0E0C07", "gold": "#E7B008", "blue": "#8AB4D8", "blue-pale": "#7A6A3E", "blue-border": "#4A3F1E", "blue-deep": "#F1D579", "blue-tint": "#241E10", "green": "#C9A227", "muted": "#B6A882", "border": "#3A3117", "card": "#1c1810", "rail": "#E7B008", "dot": "#4A3F1E", "amber-bg": "#241E10", "amber-bd": "#4A3F1E"} },
  { key: "deep-blue", label: "Xanh biển tạp chí", dark: true,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 720px at 78% -10%,#122a63,#0a1738 64%)", "bg2": "linear-gradient(160deg,#0f2352,#0a1838)", "ink": "#E8EEFB", "navy": "#EAF1FF", "navy2": "#081026", "gold": "#54C7EC", "blue": "#5B9DF9", "blue-pale": "#5C74A8", "blue-border": "#2C3E6E", "blue-deep": "#A7C6FF", "blue-tint": "#14264f", "green": "#3DD7C0", "muted": "#9FB0D4", "border": "#243761", "card": "#122a5c", "rail": "#54C7EC", "dot": "#2C3E6E", "amber-bg": "#242010", "amber-bd": "#4A3F1E","font-display": "Georgia,\"DejaVu Serif\",\"Liberation Serif\",\"Times New Roman\",serif"} },
  { key: "light-neu", label: "Xanh nhẹ", dark: false,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 620px at 82% -12%,#eef1f7,#f7f9fc 62%)", "bg2": "linear-gradient(160deg,#f2f5fa,#e9edf5)", "ink": "#28304A", "navy": "#3A4A72", "navy2": "#222A44", "gold": "#E0A800", "blue": "#5B8DEF", "blue-pale": "#A9C0F0", "blue-border": "#CDD9F2", "blue-deep": "#3A5FB0", "blue-tint": "#EEF3FD", "green": "#46B083", "muted": "#6B7488", "border": "#E3E8F2", "card": "#ffffff", "rail": "#5B8DEF", "dot": "#CDD9F2", "amber-bg": "#EEF3FD", "amber-bd": "#CDD9F2"} },
  { key: "coral-warm", label: "Cam san hô", dark: false,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 620px at 82% -12%,#fdeee9,#fffaf8 62%)", "bg2": "linear-gradient(160deg,#fdf0ec,#f9e6df)", "ink": "#3A241F", "navy": "#7A3B2E", "navy2": "#3A1C15", "gold": "#E8503A", "blue": "#2E8B8B", "blue-pale": "#F0A99B", "blue-border": "#F5D3CA", "blue-deep": "#B83A28", "blue-tint": "#FDEFEB", "green": "#46B083", "muted": "#7A6A63", "border": "#F0E2DB", "card": "#FFFDFB", "rail": "#E8503A", "dot": "#F5D3CA", "amber-bg": "#FDEFEB", "amber-bd": "#F5D3CA"} },
  { key: "emerald-fresh", label: "Ngọc lục bảo", dark: false,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 620px at 82% -12%,#e6f6f0,#f7fdfb 62%)", "bg2": "linear-gradient(160deg,#eefaf5,#e3f4ee)", "ink": "#173A30", "navy": "#0F6E52", "navy2": "#0A4A38", "gold": "#12B886", "blue": "#0CA678", "blue-pale": "#8FD3C0", "blue-border": "#B8E6D8", "blue-deep": "#0B7A5C", "blue-tint": "#E9F8F2", "green": "#0B8F6E", "muted": "#5C6B64", "border": "#DCEEE7", "card": "#ffffff", "rail": "#12B886", "dot": "#BFE6DA", "amber-bg": "#EEF9F4", "amber-bd": "#BFE6DA"} },
  { key: "slate-pro", label: "Xám thép", dark: false,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 620px at 82% -12%,#eef1f5,#f8fafc 62%)", "bg2": "linear-gradient(160deg,#eef1f6,#e4e9f0)", "ink": "#1F2937", "navy": "#334155", "navy2": "#1E293B", "gold": "#D97706", "blue": "#0EA5E9", "blue-pale": "#93C5E8", "blue-border": "#CBD8E6", "blue-deep": "#0369A1", "blue-tint": "#EEF6FC", "green": "#059669", "muted": "#64748B", "border": "#E2E8F0", "card": "#ffffff", "rail": "#334155", "dot": "#CBD8E6", "amber-bg": "#FEF6E6", "amber-bd": "#F5E2B8"} },
  { key: "rose-elegant", label: "Hồng thanh lịch", dark: false,
    tokens: {"font": "\"Inter\",-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif", "bg": "radial-gradient(1200px 620px at 82% -12%,#fbecf3,#fffafd 62%)", "bg2": "linear-gradient(160deg,#faedf3,#f4e0ea)", "ink": "#3A1F2E", "navy": "#7A2E56", "navy2": "#4A1C34", "gold": "#E0518A", "blue": "#C2185B", "blue-pale": "#EAA3C2", "blue-border": "#F2CFDF", "blue-deep": "#A01050", "blue-tint": "#FBEEF4", "green": "#0E9F6E", "muted": "#7A6470", "border": "#F0DCE6", "card": "#ffffff", "rail": "#C2185B", "dot": "#F2CFDF", "amber-bg": "#FBEEF4", "amber-bd": "#F2CFDF"} },
]

export const THEME_BY_KEY: Record<string, Theme> = Object.fromEntries(THEMES.map(t => [t.key, t]))
export const DEFAULT_THEME = "navy-gold"

/** Khối `:root{--sl-…}` cho theme — dùng khi xuất HTML tự chứa. */
export function themeCss(name: string, selector = ":root"): string {
  const t = THEME_BY_KEY[name] || THEME_BY_KEY[DEFAULT_THEME]
  const body = Object.entries(t.tokens).map(([k, v]) => `--sl-${k}:${v}`).join(";")
  return `${selector}{${body}}`
}

/** Áp theme lên một phần tử (mount trong DOM chung, không cần đụng :root). */
export function applyTheme(el: HTMLElement, name: string): void {
  const t = THEME_BY_KEY[name] || THEME_BY_KEY[DEFAULT_THEME]
  for (const [k, v] of Object.entries(t.tokens)) el.style.setProperty(`--sl-${k}`, v)
  el.dataset.theme = t.key
  el.dataset.dark = t.dark ? "1" : "0"
}
