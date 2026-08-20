/**
 * CSS được nhúng thành CHUỖI (tsup `loader: { ".css": "text" }`).
 *
 * Phải là chuỗi chứ không phải side-effect import: `toHTML()` cần ghép CSS vào file HTML tự chứa,
 * và backend cần lấy CSS ra để dựng deck khi xuất .pptx — cả hai đều không có `<link>` để trỏ tới.
 */
import baseCss from "./base.css"
import tokensCss from "./tokens.css"
import editCss from "./edit.css"
import printCss from "./print.css"

export const BASE_CSS: string = baseCss
/** Token phải đứng TRƯỚC `edit.css` — các luật bên dưới đọc biến `--dk-*` khai ở đây. */
export const EDIT_CSS: string = tokensCss + editCss
/**
 * CSS in/lưu PDF — CHỈ dùng cho file HTML tự chứa, không nạp trong app.
 *
 * Phải ghép NGOÀI `@layer deck-kit`: luật in cần thắng luật màn hình (`#scaler>.slide` có
 * độ ưu tiên id+class), mà CSS không-layer luôn thắng CSS trong layer.
 */
export const PRINT_CSS: string = printCss
