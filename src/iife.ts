/**
 * Điểm vào cho `<script src="deck-kit.iife.js">` — dùng bởi:
 *  1. "route shell" của backend (Playwright mở để chụp nền khi xuất .pptx, và nút "Mở tab"),
 *  2. tool `pptx_html` (.pptx → HTML) — cần `attachLegacyPlayer` giữ giao thức postMessage cũ.
 */
import { mountDeck } from "./mount"

export { mountDeck, toStandaloneHtml, diffDeck } from "./mount"
export { attachPlayer, attachLegacyPlayer } from "./player"
export { renderSections, renderStage, deckCss, renderSlide } from "./render"
export { normalizeDeck } from "./model"
export { THEMES, THEME_BY_KEY, themeCss, applyTheme } from "./themes"
export { LAYOUTS, LAYOUT_BY_KEY, SELECTABLE_LAYOUTS, GROUP_ORDER } from "./layouts/manifest"
export { canConvert, convert } from "./layouts/convert"

/**
 * Tự dựng deck từ `<script id="deck-json" type="application/json">` — shell chỉ cần 1 dòng.
 *
 * JSON hỏng thì phải HIỆN RA. Bản đầu `JSON.parse` để trần: dữ liệu cụt là `SyntaxError` không
 * ai bắt, deck không mount, trang trắng trơn — không thẻ báo lỗi, không log, người xem không
 * biết vì sao. Thà hiện một dòng đọc được còn hơn im lặng.
 */
export function bootFromScriptTag(mountId = "deck", jsonId = "deck-json"): void {
  const host = document.getElementById(mountId)
  const raw = document.getElementById(jsonId)?.textContent
  if (!host || !raw) return
  let deck: any
  try {
    deck = JSON.parse(raw)
  } catch (e) {
    host.textContent = `Không đọc được dữ liệu slide (JSON hỏng): ${(e as Error).message}`
    return
  }
  const handle = mountDeck(host, deck, { edit: new URLSearchParams(location.search).get("edit") === "1" })
  ;(window as any).__deckHandle = handle
}
