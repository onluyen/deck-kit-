/**
 * `node scripts/render-json.mjs deck.json out.html [--edit]`
 *
 * Dựng file HTML tự chứa từ một `DeckJson` — dùng cho cổng so ảnh với renderer Python và để
 * kiểm nhanh một deck bất kỳ mà không cần dựng cả app.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const [src, out] = process.argv.slice(2)
if (!src || !out) {
  console.error("dùng: node scripts/render-json.mjs <deck.json> <out.html> [--edit]")
  process.exit(1)
}
const edit = process.argv.includes("--edit")

const { renderStage, deckCss, normalizeDeck } = await import(join(here, "../dist/index.js"))
const deck = normalizeDeck(JSON.parse(readFileSync(src, "utf8")))

// Player tối giản: đủ để Playwright gọi `__deck.show(i)` khi chụp từng slide
const player = `
var S=[].slice.call(document.querySelectorAll('#scaler > .slide')),cur=0;
function show(i){cur=Math.max(0,Math.min(S.length-1,i));S.forEach(function(s,k){s.classList.toggle('active',k===cur)});
var c=document.getElementById('cnt');if(c)c.textContent=(cur+1)+' / '+S.length;}
window.__deck={show:show,cur:function(){return cur}};show(0);`

writeFileSync(out,
  '<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">' +
  `<title>${(deck.title || "Deck").replace(/[<>&]/g, "")}</title>` +
  `<style>${deckCss(deck, { edit })}</style></head><body${edit ? ' class="lp-edit"' : ""}>` +
  renderStage(deck, { edit }) +
  `<script>${player}</script></body></html>`)

console.log(`${out} · ${deck.slides.length} slide`)
