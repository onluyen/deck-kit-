/**
 * Chặn publish khi `dist/` chưa dựng hoặc dựng thiếu.
 *
 * `files` trong package.json chỉ đóng gói `dist/` — quên `npm run build` thì npm vẫn publish
 * BÌNH THƯỜNG, ra một package rỗng, không báo lỗi gì. Người cài mới phát hiện, mà lúc đó
 * version đã bị chiếm: npm KHÔNG cho publish đè cùng số version.
 *
 * Chạy tự động qua `prepublishOnly`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const die = m => {
  console.error(`\n✗ KHÔNG publish được: ${m}\n\n  Chạy:  npm run build -w @mvng267/deck-kit\n`)
  process.exit(1)
}

// File BẮT BUỘC phải có — khớp `exports` trong package.json; thiếu cái nào là người cài
// `import` vào sẽ vỡ.
// `.d.cts` cũng BẮT BUỘC: `exports` trỏ `require` → `index.d.cts`/`react.d.cts` để người dùng
// `moduleResolution: nodenext` + CommonJS không dính TS1479. Thiếu là họ vỡ, mình không thấy.
const MUST = [
  "dist/index.js", "dist/index.cjs", "dist/index.d.ts", "dist/index.d.cts",
  "dist/react.js", "dist/react.cjs", "dist/react.d.ts", "dist/react.d.cts",
  "dist/angular.js", "dist/angular.d.ts",
  "dist/deck-kit.global.js", "dist/styles.css", "dist/manifest.json",
]
const missing = MUST.filter(f => !existsSync(join(root, f)))
if (missing.length) die(`thiếu ${missing.length} file trong dist/:\n    ${missing.join("\n    ")}`)

// File tồn tại nhưng rỗng/cụt cũng nguy hiểm y như thiếu.
for (const f of MUST) {
  const n = statSync(join(root, f)).size
  if (n < 100) die(`\`${f}\` chỉ có ${n} byte — bản dựng hỏng`)
}

// manifest phải đọc được và có bố cục — đây là nguồn sự thật cho picker/docs/prompt.
let manifest
try {
  manifest = JSON.parse(readFileSync(join(root, "dist/manifest.json"), "utf8"))
} catch (e) {
  die(`\`dist/manifest.json\` không phải JSON hợp lệ (${e.message})`)
}
if (!manifest.layouts?.length) die("`dist/manifest.json` không có bố cục nào")

// dist cũ hơn src = quên dựng lại sau khi sửa code. Đây là ca hay gặp NHẤT.
const newest = p => {
  let t = 0
  const walk = d => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const f = join(d, e.name)
      if (e.isDirectory()) walk(f)
      else t = Math.max(t, statSync(f).mtimeMs)
    }
  }
  walk(p)
  return t
}
try {
  const src = newest(join(root, "src"))
  const built = statSync(join(root, "dist/index.js")).mtimeMs
  if (src > built) {
    die(`\`src/\` mới hơn \`dist/\` — có sửa code mà chưa dựng lại`)
  }
} catch {
  // Không so được mtime thì bỏ qua — các phép kiểm trên đã đủ chặn ca nặng.
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
console.log(`✓ dist/ đầy đủ — ${pkg.name}@${pkg.version} · ${manifest.layouts.length} bố cục`)
