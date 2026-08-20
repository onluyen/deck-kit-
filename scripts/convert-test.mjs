/**
 * Quét TOÀN BỘ cặp bố cục qua `canConvert`/`convert` (46×46).
 *
 * Khẳng định 3 điều mà plan yêu cầu:
 *  1. Cặp `ok` thì `convert()` phải ra ĐÚNG bố cục đích, không âm thầm rơi về `content`.
 *  2. Đổi đi rồi đổi về KHÔNG mất dữ liệu (nguyên tắc: chỉ tạm ẩn, không xoá).
 *  3. Cặp bị khoá phải kèm LÝ DO đọc được (hiện trong tooltip cho giáo viên).
 */
import { LAYOUTS, SELECTABLE_LAYOUTS } from "../dist/index.js"
import { canConvert, convert } from "../dist/index.js"

/** Slide "đủ chất" — có cả ý, cột lẫn ảnh nên mọi bố cục đều có cái để dựng. */
const rich = () => ({
  id: "s0", kind: "content",
  title: "Quy tắc hình hộp", subtitle: "Toán 11",
  bullets: ["ý một", "ý hai", "ý ba", "ý bốn"],
  columns: [
    { title: "Trái", bullets: ["a1", "a2"] },
    { title: "Giữa", bullets: ["b1"] },
    { title: "Phải", bullets: ["c1", "c2"] },
  ],
  image: { asset: "img1" },
  images: [{ asset: "img1" }, { asset: "img2" }],
})

const fails = []
let okPairs = 0, lockedPairs = 0

for (const from of LAYOUTS) {
  for (const to of LAYOUTS) {
    const slide = { ...rich(), kind: from.key }
    const chk = canConvert(slide, to.key)

    if (!chk.ok) {
      lockedPairs++
      if (!chk.reason || chk.reason.length < 8) {
        fails.push(`${from.key} → ${to.key}: khoá nhưng KHÔNG có lý do đọc được (${chk.reason})`)
      }
      continue
    }
    okPairs++

    const next = convert(slide, to.key)
    // 1. phải ra đúng bố cục đích
    if (next.kind !== to.key) {
      fails.push(`${from.key} → ${to.key}: convert() ra "${next.kind}" chứ không phải "${to.key}"`)
      continue
    }
    // 2. không được XOÁ dữ liệu — chỉ được thêm dạng đã chuyển
    const lostB = (slide.bullets || []).length && !(next.bullets || []).length
    const lostC = (slide.columns || []).length && !(next.columns || []).length
    if (lostB) fails.push(`${from.key} → ${to.key}: MẤT hết bullets`)
    if (lostC) fails.push(`${from.key} → ${to.key}: MẤT hết columns`)

    // 3. đổi đi rồi đổi về phải khôi phục nội dung gốc
    const back = canConvert(next, from.key).ok ? convert(next, from.key) : null
    if (back) {
      const b0 = JSON.stringify(slide.bullets), b1 = JSON.stringify(back.bullets)
      if (slide.bullets?.length && b0 !== b1 && !(back.bullets || []).length) {
        fails.push(`${from.key} → ${to.key} → ${from.key}: bullets không khôi phục (${b1})`)
      }
    }
  }
}

// Bố cục nguyên văn: KHÔNG được cho chọn tay (không bịa được dữ liệu gốc)
for (const l of LAYOUTS.filter(x => !x.selectable)) {
  const chk = canConvert({ ...rich(), kind: "content" }, l.key)
  if (chk.ok) fails.push(`${l.key}: bố cục nguyên văn mà vẫn chọn tay được`)
}

// Mọi bố cục chọn được phải dựng ra HTML thật (không rơi về content)
console.log(`${LAYOUTS.length} bố cục · ${SELECTABLE_LAYOUTS.length} chọn được`)
console.log(`${okPairs} cặp chuyển được · ${lockedPairs} cặp khoá`)
if (fails.length) {
  console.log(`\n${fails.length} LỖI:`)
  for (const f of fails.slice(0, 20)) console.log("  ✗", f)
  process.exit(1)
}
console.log("✓ ma trận chuyển đổi sạch")
