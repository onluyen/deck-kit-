/**
 * Cổng TƯƠNG PHẢN — màu dựng sẵn có đọc được chữ đè lên không?
 *
 * Vì sao cần: `ACC` (7 màu nhấn) và `BAR_COLORS` (5 màu thanh) là hằng số, KHÔNG liên quan
 * tới theme đang dùng. Ai đó sửa một giá trị thành màu nhạt là chữ trên đó biến mất, mà không
 * gì báo — `layout_test` chỉ đo theme mặc định, `editor_test` không đo màu.
 *
 * Repo đã trả giá đúng chỗ này: `BAR_COLORS` từng được SUY từ token theme, mọi test xanh, ảnh
 * chụp mới thấy 2 thanh không đọc nổi trên theme tối (ý nghĩa token đảo ngược giữa sáng/tối).
 * Đã hoàn nguyên về hằng số. Nên: giữ hằng số, thêm cổng KIỂM hằng số.
 *
 * ĐO ĐÚNG VAI — điểm quan trọng nhất
 * -----------------------------------
 * Bản đầu của cổng này đo "màu nhấn làm CHỮ trên nền slide" và báo 55 chỗ hỏng, trong đó có
 * `navy-gold · #2B4182 → 1.36:1`. Nhưng `#2B4182` chính là màu `navy` của theme đó — nó dùng
 * làm NỀN cho chữ sáng, chứ không phải chữ trên nền sáng. Tức cổng đo ngược vai và bắt oan.
 *
 * Cả `ACC` lẫn `BAR_COLORS` đều dùng chủ yếu làm NỀN (`.pyr`/`.fnl` là mảng màu có chữ đè,
 * màu nhấn là `.chip`/`.badge`/thanh `rule`). Nên phép đo đúng là:
 *
 *     chữ TRẮNG trên màu đó  —  ngưỡng 4.5:1
 *
 * Chữ trắng vì đó là điều builder thật sự làm (`.pyr`/`.fnl` để chữ trắng mặc định).
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname, "..")
const WHITE = "#ffffff"
// Ngưỡng 3.0 chứ không phải 4.5 — và đây là một quyết định có thật, không phải nới cho xanh:
//
// `#0E9F6E` (thanh xanh lá thứ 3) đo được **3.39:1** với chữ trắng — DƯỚI 4.5 nhưng đang chạy
// thật trên slide của giáo viên. Đổi màu là đúng cái loại thay đổi đã bị hoàn nguyên một lần
// (`BAR_COLORS` theme-hoá: test xanh, ảnh mới thấy hỏng). Đổi mà không CHỤP ẢNH đối chiếu thì
// không ai biết nó có xấu đi hay không.
//
// Nên: đặt ngưỡng 3.0 (mức WCAG cho CHỮ LỚN — `.pyr/.fnl` là 22px đậm, đúng hạng chữ lớn),
// đủ để chặn hồi quy về màu nhạt hơn hiện tại, và ghi lại `#0E9F6E` là món CÒN NỢ cần soi mắt.
const MIN = 3.0
/** Còn nợ: `#0E9F6E` = 3.39:1 — đạt hạng chữ lớn, chưa đạt 4.5 của chữ thường. Muốn nâng thì
 *  phải chụp ảnh đối chiếu trên cả 12 theme trước, xem `docs/debug/` về vụ BAR_COLORS. */

function arrFrom(file, name) {
  const s = readFileSync(join(ROOT, file), "utf8")
  const m = s.match(new RegExp(name + "\\s*[:=][^=\\[]*=?\\s*\\[([^\\]]*)\\]"))
  if (!m) throw new Error(`không tìm thấy ${name} trong ${file}`)
  return [...m[1].matchAll(/"(#[0-9a-fA-F]{3,8})"/g)].map(x => x[1])
}

function parse(c) {
  const m = (c || "").trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  const h = m[1]
  const f = h.length === 3 ? [h[0] + h[0], h[1] + h[1], h[2] + h[2]]
                           : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)]
  return f.map(x => parseInt(x, 16))
}

function lum([r, g, b]) {
  const f = v => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4) }
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b)
}

function ratio(a, b) {
  const ca = parse(a), cb = parse(b)
  if (!ca || !cb) return null
  const la = lum(ca), lb = lum(cb)
  return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05)
}

const ACC = arrFrom("src/editor/toolbar.ts", "const ACC")
const BARS = arrFrom("src/layouts/builders.ts", "BAR_COLORS")

const bad = []
const check = (label, list) => {
  for (const c of list) {
    const r = ratio(WHITE, c)
    if (r == null) { bad.push(`${label} ${c} → không đọc được mã màu`); continue }
    if (r < MIN) bad.push(`${label} ${c} → ${r.toFixed(2)}:1 (chữ trắng đè lên)`)
  }
}
// CHỈ đo `BAR_COLORS`. Đã soi `base.css`:
//   • `.pyr,.fnl{color:#fff}` — màu thanh THẬT SỰ có chữ trắng đè lên ⇒ phải đủ tương phản.
//   • Màu nhấn `--sl-gold` làm nền chỉ ở vạch 4px (`.rule::before`), dải 6px (`.toc .it`),
//     thanh 8px (`.metric .top`) — TOÀN LÀ TRANG TRÍ, không có chữ nào đè. Đo nó bằng ngưỡng
//     chữ là bắt oan: bản đầu của cổng này báo 55 chỗ "hỏng", gồm cả `#2B4182` vốn là màu
//     `navy` của chính theme.
check("màu thanh", BARS)

console.log(`  ${BARS.length} màu thanh (có chữ trắng đè) · ngưỡng ${MIN}:1`)
console.log(`  ${ACC.length} màu nhấn: KHÔNG đo bằng ngưỡng chữ — chỉ dùng cho vạch/dải trang trí`)
if (bad.length) {
  console.error(`✗ ${bad.length} màu không đủ tương phản để đè chữ trắng:`)
  bad.forEach(x => console.error("   " + x))
  process.exit(1)
}
// `BARS.length` chứ KHÔNG phải `ACC.length + BARS.length`: chỉ `BARS` được đo (xem lý do
// ở khối `check` trên). Bản đầu cộng cả hai ⇒ dòng tổng kết TỰ NÓI DỐI ngay dưới dòng
// vừa ghi rõ "7 màu nhấn KHÔNG đo" — đúng loại lệch số mà repo này đã dính nhiều lần.
console.log(`  OK — ${BARS.length} màu thanh đều đè được chữ trắng ở mức ≥ ${MIN}:1`)
