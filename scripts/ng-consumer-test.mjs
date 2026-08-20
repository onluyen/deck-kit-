/**
 * Cổng NGƯỜI DÙNG ANGULAR — app tiêu dùng có `imports: [DeckViewerComponent]` được không?
 *
 * Vì sao cần: mọi cổng khác chỉ soi CHÍNH thư viện. Lỗi này nằm ở CHỖ NỐI — gói build đúng cú
 * pháp TypeScript nhưng thiếu `ɵcmp`, nên Angular từ chối. Có người dùng thật copy đúng ví dụ
 * trong README mà vẫn gặp:
 *     NG2012: Component imports must be standalone components, directives, pipes, or must be NgModules.
 *
 * Cổng này biên dịch một app Angular NHỎ dùng đúng cách README hướng dẫn. Đã thử tiêm lại bản
 * build cũ (tsup): cổng kêu đúng NG2012 — tức nó bắt được thật, không phải phép đo trang trí.
 *
 * Dựng thử BA kiểu `moduleResolution`, vì người dùng không ai giống ai:
 *   bundler  — Angular CLI 16+ mặc định
 *   node     — node10, kiểu cũ; BỎ QUA `exports` nên sống nhờ `typesVersions`
 *   nodenext — kiểu chuẩn mới; phân biệt ESM/CJS, cần `types` lồng trong từng điều kiện
 * Trước đây cổng chỉ thử `bundler`, nên gói hỏng với `node` mà không ai biết: người dùng
 * `import` vào là ăn TS2307 dù `dist/` có đủ file.
 */
import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname, "..")
const REPO = join(ROOT, "..", "..")
const ngc = join(REPO, "node_modules", ".bin", "ngc")

if (!existsSync(ngc)) {
  console.log("  BỎ QUA — chưa cài @angular/compiler-cli (npm i -D -w @mvng267/deck-kit @angular/compiler-cli)")
  process.exit(0)
}

const VARIANTS = [
  ["bundler", "tsconfig.json"],
  ["node", "tsconfig.node.json"],
  ["nodenext", "tsconfig.node16.json"],
]

const failed = []
for (const [label, cfg] of VARIANTS) {
  try {
    execFileSync(ngc, ["-p", join(ROOT, "scripts", "ngtest", cfg)], { cwd: REPO, stdio: "pipe" })
  } catch (e) {
    failed.push([label, `${e.stdout || ""}${e.stderr || ""}`])
  }
}

if (failed.length) {
  console.error(`✗ App Angular tiêu dùng KHÔNG biên dịch được ở ${failed.length}/${VARIANTS.length} kiểu moduleResolution:`)
  for (const [label, out] of failed) {
    console.error(`\n  ── moduleResolution: ${label} ──`)
    console.error(out.split("\n").slice(0, 8).join("\n"))
  }
  process.exit(1)
}
console.log(`app Angular tiêu dùng biên dịch SẠCH ở cả ${VARIANTS.length} kiểu moduleResolution (${VARIANTS.map(v => v[0]).join(" · ")})`)
