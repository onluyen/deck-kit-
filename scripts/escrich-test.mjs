/**
 * Cổng AN TOÀN cho `escRich` — hàm DUY NHẤT trong thư viện cố ý nhả HTML ra DOM.
 *
 * Nó giữ 4 thẻ inline (`<b> <i> <sup> <sub>`) để nội dung giáo án không mất định dạng.
 * Mọi thứ khác PHẢI bị escape. Test này chặn việc ai đó nới danh sách thẻ hoặc đổi thứ tự
 * (escape trước → mở lại sau) làm thủng.
 */
import { escRich } from "../dist/index.js"

const KEEP = [
  ["S<sub>tp</sub> = 2h", "chỉ số dưới"],
  ["x<sup>2</sup> + 1", "số mũ"],
  ["<b>Định nghĩa</b> quan trọng", "đậm"],
  ["biến <i>a</i> và <i>b</i>", "nghiêng"],
]
const BLOCK = [
  ["<script>alert(1)</script>", "script"],
  ['<img src=x onerror=alert(1)>', "img/onerror"],
  ['<b onclick="x">a</b>', "thẻ CÓ thuộc tính"],
  ["<iframe src=//evil></iframe>", "iframe"],
  ['<a href="javascript:alert(1)">x</a>', "javascript: href"],
  ["<svg/onload=alert(1)>", "svg/onload"],
  ["<B>hoa</B>", "thẻ viết HOA"],
  ["<b\t>tab</b>", "thẻ có khoảng trắng lạ"],
]
let bad = 0
for (const [inp, note] of KEEP) {
  const out = escRich(inp)
  if (!/<(b|i|sup|sub)>/.test(out)) { console.log(`✗ MẤT định dạng: ${note} · ${out}`); bad++ }
}
for (const [inp, note] of BLOCK) {
  const out = escRich(inp)
  // an toàn = không còn thẻ nào NGOÀI 4 thẻ trắng, và không còn thuộc tính
  if (/<(?!\/?(b|i|sup|sub)>)/.test(out)) { console.log(`✗ LỌT: ${note}\n   ${out}`); bad++ }
}
console.log(bad ? `\n${bad} ca HỎNG` : `\n${KEEP.length + BLOCK.length}/${KEEP.length + BLOCK.length} đạt — giữ 4 thẻ, chặn mọi thứ khác`)
process.exit(bad ? 1 : 0)
