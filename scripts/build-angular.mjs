/**
 * Dựng bản Angular ĐÚNG CHUẨN THƯ VIỆN (partial Ivy) — chạy sau `tsup`.
 *
 * Vì sao cần
 * ----------
 * `tsup`/esbuild chỉ *bóc* decorator (`__decorateElement`), KHÔNG sinh `ɵcmp`. Angular 19 gặp
 * class thiếu `ɵcmp` sẽ báo:
 *     Component imports must be standalone components, directives, pipes, or must be NgModules.
 * Người dùng copy đúng ví dụ trong README vẫn gặp lỗi — đã có người báo thật.
 *
 * `ngc` với `compilationMode: "partial"` sinh `ɵɵngDeclareComponent`, để app chủ dịch nốt sang
 * Ivy đúng phiên bản Angular CỦA HỌ. Một bản build chạy được Angular 17 → 19+, khỏi build riêng
 * từng phiên bản.
 *
 * Hai việc script này làm sau khi `ngc` chạy
 * ------------------------------------------
 * 1. **Trỏ import về GỐC GÓI.** `ngc` phát ra cả cây nguồn (292 KB) và bản Angular `import
 *    "../mount"` — tức app sẽ nạp **BẢN SAO THỨ HAI** của thư viện: hai `mountDeck` khác nhau,
 *    CSS chèn hai lần, `DeckHandle` của bên này không dùng được ở bên kia. Đổi thành
 *    `@mvng267/deck-kit` là dùng chung đúng một bản.
 * 2. **Chỉ giữ file cần.** Sau khi trỏ về gốc gói thì cả cây kia thành rác — xoá cho gói nhẹ.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

const ROOT = join(import.meta.dirname, "..")
const NG = join(ROOT, "dist", "ng")
const OUT = join(ROOT, "dist")
const PKG = "@mvng267/deck-kit"

if (!existsSync(join(NG, "angular", "index.js"))) {
  console.error("✗ Chưa có dist/ng/angular/index.js — `ngc` chưa chạy hoặc đã lỗi.")
  process.exit(1)
}

/** `../mount` · `../model` → `@mvng267/deck-kit` (một bản duy nhất, không nhân đôi). */
function retarget(code) {
  return code.replace(/(["'])\.\.\/(mount|model|render|themes|player)(\.js)?\1/g,
                      `"${PKG}"`)
}

for (const [src, dst] of [["angular/index.js", "angular.js"],
                          ["angular/index.d.ts", "angular.d.ts"]]) {
  const from = join(NG, src)
  if (!existsSync(from)) {
    console.error(`✗ Thiếu ${src}`)
    process.exit(1)
  }
  const code = retarget(readFileSync(from, "utf8"))
  mkdirSync(dirname(join(OUT, dst)), { recursive: true })
  writeFileSync(join(OUT, dst), code, "utf8")
}

// ── Cổng kiểm: thiếu bất kỳ dấu hiệu nào dưới đây là bản Angular VÔ DỤNG ────────────
const js = readFileSync(join(OUT, "angular.js"), "utf8")
const checks = [
  ["có ɵɵngDeclareComponent (Ivy partial)", /ngDeclareComponent/.test(js)],
  ["đánh dấu isStandalone: true", /isStandalone:\s*true/.test(js)],
  ["giữ selector edm-deck", /selector:\s*"edm-deck"/.test(js)],
  ["KHÔNG còn import tương đối ../ (tránh nhân đôi thư viện)", !/from\s*["']\.\.\//.test(js)],
  ["trỏ về gốc gói", js.includes(PKG)],
]
const bad = checks.filter(([, ok]) => !ok)
for (const [name, ok] of checks) console.log(`  ${ok ? "OK  " : "HỎNG"} ${name}`)
if (bad.length) {
  console.error(`✗ Bản Angular KHÔNG dùng được (${bad.length} lỗi).`)
  process.exit(1)
}

rmSync(NG, { recursive: true, force: true })   // cây nguồn ngc phát ra → rác, xoá đi
const kb = Math.round(js.length / 1024)
console.log(`angular.js: partial Ivy OK · ${kb} KB · dùng chung một bản ${PKG}`)
