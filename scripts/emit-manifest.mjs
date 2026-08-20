/**
 * Xuất `dist/manifest.json` + `dist/styles.css` sau khi tsup build xong.
 *
 * `manifest.json` là hợp đồng dùng chung: Python đọc file này thay vì hard-code 36 key, tài liệu
 * sinh danh mục bố cục từ nó — nên không còn cảnh 3 nơi khai lệch nhau.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dist = join(root, "dist")
mkdirSync(dist, { recursive: true })

// Nạp bản đã build (ESM) để manifest luôn khớp code thật, không phải bản chép tay
const { LAYOUTS, GROUP_ORDER } = await import(join(dist, "index.js"))
const { THEMES } = await import(join(dist, "index.js"))

writeFileSync(join(dist, "manifest.json"), JSON.stringify({
  version: 1,
  groups: GROUP_ORDER,
  layouts: LAYOUTS,
  // Kèm `tokens` để cổng `themes_test` (phía Python) đối chiếu được MÀU, không chỉ khoá.
  // Container backend không có mã nguồn TS, nên manifest là đường duy nhất nó thấy được
  // giá trị thật. Thiếu `tokens` thì cổng duyệt qua danh sách rỗng và báo đạt mà không đo gì.
  themes: THEMES.map(t => ({ key: t.key, label: t.label, dark: t.dark, tokens: t.tokens })),
}, null, 2))

// styles.css: base + edit + tất cả theme dạng [data-theme="…"] để nhúng bằng <link>
const base = readFileSync(join(root, "src/styles/base.css"), "utf8")
const edit = readFileSync(join(root, "src/styles/edit.css"), "utf8")
const themeBlocks = THEMES.map(t =>
  `[data-theme="${t.key}"]{${Object.entries(t.tokens).map(([k, v]) => `--sl-${k}:${v}`).join(";")}}`
).join("\n")
const rootBlock = `:root{${Object.entries(THEMES[0].tokens).map(([k, v]) => `--sl-${k}:${v}`).join(";")}}`
writeFileSync(join(dist, "styles.css"), [rootBlock, themeBlocks, base, edit].join("\n"))

console.log(`manifest.json: ${LAYOUTS.length} bố cục · ${THEMES.length} theme · styles.css OK`)
