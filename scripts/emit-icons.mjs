/**
 * Trích icon Hugeicons → `src/ui/icons.ts` (SVG thuần, KHÔNG kéo React vào).
 *
 * Vì sao không import thẳng `@hugeicons/react`: deck-kit phải chạy được ở Angular và
 * JavaScript thuần. Hugeicons xuất dữ liệu path dạng mảng nên nhúng sẵn được ~15 icon
 * cần dùng, bundle không phình mà vẫn ĐÚNG BỘ ICON của app (app dùng Hugeicons).
 *
 * Chạy: `node scripts/emit-icons.mjs` (đã gắn vào `npm run build`).
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import * as HI from "@hugeicons/core-free-icons"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..")

/** Tên hiển thị → tên icon trong Hugeicons. Chỉ lấy đúng thứ dùng, không lấy cả bộ. */
const WANT = {
  save: "FloppyDiskIcon",
  add: "PlusSignIcon",
  present: "PlayIcon",
  layout: "DashboardSquare02Icon",
  palette: "PaintBoardIcon",
  image: "Image02Icon",
  note: "StickyNote01Icon",
  duplicate: "Copy01Icon",
  hide: "ViewOffSlashIcon",
  show: "ViewIcon",
  trash: "Delete02Icon",
  reset: "ArrowReloadHorizontalIcon",
  close: "Cancel01Icon",
  search: "Search01Icon",
  lock: "SquareLock01Icon",
  warn: "Alert02Icon",
  drag: "DragDropVerticalIcon",
  regen: "MagicWand01Icon",
  check: "Tick02Icon",
  chevron: "ArrowDown01Icon",
}

/** `[["path",{d:"…"}], …]` → chuỗi các thẻ SVG con. */
function toInner(nodes) {
  return (nodes || []).map(([tag, attrs]) => {
    const a = Object.entries(attrs || {})
      .filter(([k]) => k !== "key")
      .map(([k, v]) => `${k}="${String(v).replace(/"/g, "&quot;")}"`)
      .join(" ")
    return `<${tag} ${a}/>`
  }).join("")
}

const out = {}
const missing = []
for (const [name, hugeName] of Object.entries(WANT)) {
  const data = HI[hugeName]
  if (!Array.isArray(data)) { missing.push(`${name} (${hugeName})`); continue }
  out[name] = toInner(data)
}
if (missing.length) {
  console.error("THIẾU icon:", missing.join(", "))
  process.exit(1)
}

const ts = `/**
 * Icon SVG — SINH TỰ ĐỘNG từ Hugeicons bởi \`scripts/emit-icons.mjs\`. Đừng sửa tay.
 *
 * Nhúng path thẳng vào chuỗi để thư viện không phụ thuộc React/Angular. Icon kế thừa
 * màu chữ qua \`stroke="currentColor"\` nên tự khớp theme sáng/tối.
 */
const PATHS: Record<string, string> = ${JSON.stringify(out, null, 2)}

export type IconName = keyof typeof PATHS

/** \`<svg>\` 24×24 nét mảnh, ăn theo \`currentColor\` và cỡ chữ (1em). */
export function icon(name: string, cls = ""): string {
  const inner = PATHS[name]
  if (!inner) return ""
  return \`<svg class="dk-i \${cls}" viewBox="0 0 24 24" width="1em" height="1em" \` +
    \`fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" \` +
    \`stroke-linejoin="round" aria-hidden="true">\${inner}</svg>\`
}
`
mkdirSync(join(root, "src/ui"), { recursive: true })
writeFileSync(join(root, "src/ui/icons.ts"), ts, "utf8")
console.log(`icons.ts: ${Object.keys(out).length} icon Hugeicons`)
