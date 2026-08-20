# Hợp đồng JSON cho slide

> **Sinh tự động** từ `src/layouts/manifest.ts` — đừng sửa tay, chạy `npm run build`.
> Dùng file này làm nguồn khi viết prompt cho LLM dàn slide.
>
> ⚠️ **Đây KHÔNG phải thứ deck-kit render.** File này tả **slide thô do LLM viết**. Thứ deck-kit
> thật sự đọc là `DeckJson` — tên trường khác (`figure` → `image`, `image_prompt` →
> `imagePrompt`) và có thêm `id`/`kicker`/`locked`/`table`/`question` do code sinh. Xem
> [`deck-json.md`](./deck-json.md). Đo thật: cùng một hoạt động, thô **4 slide** ⇄ DeckJson
> **7 slide**.

## Khung ngoài

LLM trả về DUY NHẤT một object, không kèm giải thích, không kèm ```:

```json
{"slides":[ {"kind":"…", …}, … ]}
```

## Trường dùng chung

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `kind` | string | Bắt buộc. Không thuộc danh sách dưới → bị ép về `content`. |
| `title` | string | Hầu như bố cục nào cũng dùng. |
| `subtitle` | string | Chỉ vài bố cục đọc (xem bảng). |
| `bullets` | string[] | Ý ngắn. |
| `columns` | `{title, bullets[]}[]` | Bố cục nhiều cột. |
| `figure` | string | ID ảnh có trong "HÌNH CÓ THỂ DÙNG". Mỗi ảnh dùng tối đa 1 lần. |
| `figures` | string[] | Chỉ `gallery`. |
| `formula` | string | Chữ thường, KHÔNG LaTeX. |
| `caption` | string | Chú thích — ý nghĩa tuỳ bố cục (xem cột "Trường phụ"). |
| `image_prompt` | string | Tiếng Anh. Tối đa 3 slide/hoạt động. Cấm vẽ hình toán chính xác. |
| `notes` | string | Ghi chú người trình bày, KHÔNG hiện trên slide. |

## Bố cục theo nhóm

`AI` = LLM được phép sinh · `GV` = giáo viên chọn tay được (bố cục chỉ có `GV` là do CODE chèn nguyên văn từ giáo án).

### Cơ bản

| `kind` | Tên | AI | Trường đọc | Điều kiện | Ngưỡng vừa vặn | Trường phụ |
|---|---|---|---|---|---|---|
| `content` | Nội dung | ✓ | `title`<br>`bullets[]`<br>`figure` (id trong HÌNH CÓ THỂ DÙNG) hoặc `image_prompt` | — | — | `image_prompt` — xin AI vẽ ảnh (chỉ khi KHÔNG có `figure`) |
| `twocol` | Hai cột | ✓ | `title`<br>`bullets[]` | ≥ 3 ý | — | — |
| `cards` | Thẻ lưới | ✓ | `title`<br>`bullets[]` | ≥ 2 ý | mỗi ý ≤ 60 · ≤ 6 ý | — |
| `numbered` | Đánh số | ✓ | `title`<br>`bullets[]` | ≥ 1 ý | — | — |
| `checklist` | Danh sách ✓ | ✓ | `title`<br>`bullets[]` | ≥ 1 ý | — | — |
| `toc` | Mục lục | ✓ | `title`<br>`bullets[]` | ≥ 1 ý | — | — |
| `agenda` | Mục lục có mốc | ✓ | `title`<br>`bullets[]` | ≥ 2 ý | — | — |
| `blank` | Khung trắng | — | `title`<br>`bullets[]` | — | — | — |
| `goals` | Mục tiêu | ✓ | `title`<br>`bullets[]` | — | — | — |
| `remember` | Ghi nhớ | ✓ | `title`<br>`bullets[]` | — | — | — |

### Số liệu

| `kind` | Tên | AI | Trường đọc | Điều kiện | Ngưỡng vừa vặn | Trường phụ |
|---|---|---|---|---|---|---|
| `bignum` | Số lớn | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 1 cột CÓ title | title ≤ 60 ký tự · title cột ≤ 18 · ≤ 3 cột | — |
| `metrics` | Thẻ số | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 2 cột CÓ title | title ≤ 60 ký tự · title cột ≤ 22 · ≤ 4 cột | — |
| `kpirow` | Dãy chỉ số | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 2 cột CÓ title | title ≤ 60 ký tự · title cột ≤ 18 · ≤ 4 cột | — |

### So sánh

| `kind` | Tên | AI | Trường đọc | Điều kiện | Ngưỡng vừa vặn | Trường phụ |
|---|---|---|---|---|---|---|
| `three` | Ba cột | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 2 cột | title cột ≤ 40 · ≤ 3 cột | — |
| `compare3` | So sánh 3 cột | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 2 cột CÓ title | title cột ≤ 40 · ≤ 3 cột | — |
| `compare` | So sánh | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 2 cột | title cột ≤ 40 · ≤ 2 cột | — |
| `proscons` | Ưu / Nhược | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 2 cột | ≤ 2 cột | — |
| `quadrant` | Ma trận 2×2 | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 2 cột | ≤ 4 cột | — |
| `comparetable` | Bảng so sánh | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 2 cột | ≤ 2 cột | — |
| `tablewide` | Bảng rộng | — | `title`<br>`rows[][]` — CODE tự chèn từ giáo án, LLM không sinh | — | — | `caption` — chú thích dưới bảng |
| `feature` | Đặc điểm | ✓ | `title`<br>`columns[]` = `[{title, bullets[]}]` | ≥ 2 cột | ≤ 4 cột | — |

### Quy trình

| `kind` | Tên | AI | Trường đọc | Điều kiện | Ngưỡng vừa vặn | Trường phụ |
|---|---|---|---|---|---|---|
| `steps` | Các bước | ✓ | `title`<br>`bullets[]` | ≥ 1 ý | — | — |
| `arrow` | Mũi tên | ✓ | `title`<br>`bullets[]` | ≥ 1 ý | mỗi ý ≤ 40 · ≤ 4 ý | — |
| `timeline` | Dòng thời gian | ✓ | `title`<br>`bullets[]` | ≥ 1 ý | mỗi ý ≤ 48 · ≤ 5 ý | — |
| `vtimeline` | Mốc dọc | ✓ | `title`<br>`bullets[]` | ≥ 1 ý | — | — |
| `pyramid` | Kim tự tháp | ✓ | `title`<br>`bullets[]` | ≥ 2 ý | mỗi ý ≤ 48 · ≤ 5 ý | — |
| `funnel` | Phễu | ✓ | `title`<br>`bullets[]` | ≥ 2 ý | mỗi ý ≤ 48 · ≤ 5 ý | — |
| `formulasteps` | Công thức + các bước | ✓ | `title`<br>`bullets[]`<br>`formula` | ≥ 1 ý | mỗi ý ≤ 70 · ≤ 5 ý | — |

### Nhấn mạnh

| `kind` | Tên | AI | Trường đọc | Điều kiện | Ngưỡng vừa vặn | Trường phụ |
|---|---|---|---|---|---|---|
| `define` | Định nghĩa | ✓ | `title`<br>`bullets[]` | — | — | — |
| `example` | Ví dụ | ✓ | `title`<br>`bullets[]` | — | — | — |
| `defcard` | Thẻ định nghĩa | ✓ | `title`<br>`bullets[]` | ≥ 1 ý | — | `caption` — nguồn (vd `Nguồn: SGK Toán 12`) |
| `statement` | Câu chốt | ✓ | `title`<br>`subtitle` | — | title ≤ 120 ký tự | — |
| `spotlight` | Điểm nhấn | ✓ | `title`<br>`bullets[]` | ≥ 1 ý | — | — |
| `quote` | Trích dẫn | ✓ | `title`<br>`subtitle` | — | title ≤ 120 ký tự | — |
| `quoteauthor` | Trích dẫn có tác giả | ✓ | `title`<br>`subtitle`<br>`figure` (id trong HÌNH CÓ THỂ DÙNG) hoặc `image_prompt` | — | title ≤ 120 ký tự | `subtitle` — TÊN tác giả<br>`caption` — chức danh/nguồn |

### Đặc biệt

| `kind` | Tên | AI | Trường đọc | Điều kiện | Ngưỡng vừa vặn | Trường phụ |
|---|---|---|---|---|---|---|
| `hero` | Bìa lớn | ✓ | `title`<br>`subtitle` | — | title ≤ 70 ký tự | — |
| `split` | Chia đôi | ✓ | `title`<br>`subtitle`<br>`bullets[]` | — | — | — |
| `section` | Mở phần | ✓ | `title`<br>`subtitle` | — | title ≤ 90 ký tự | — |
| `gallery` | Lưới ảnh | ✓ | `title`<br>`figures[]` (nhiều id) | ≥ 2 ảnh | — | — |
| `imageleft` | Ảnh trái | ✓ | `title`<br>`bullets[]`<br>`figure` (id trong HÌNH CÓ THỂ DÙNG) hoặc `image_prompt` | ≥ 1 ảnh | — | `image_prompt` — xin AI vẽ ảnh |
| `imageright` | Ảnh phải | ✓ | `title`<br>`bullets[]`<br>`figure` (id trong HÌNH CÓ THỂ DÙNG) hoặc `image_prompt` | ≥ 1 ảnh | — | `image_prompt` — xin AI vẽ ảnh |

## Bẫy đã gặp thật

- **Không đủ `needs` thì builder RƠI VỀ `content`** — không báo lỗi, chỉ ra slide sai bố cục.
  Vd `metrics` cần ≥ 2 cột CÓ `title`; cột chỉ có `bullets` không tính.
- **`quoteauthor` đọc CẢ `subtitle` lẫn `caption`** — thiếu `subtitle` là mất tên người nói.
- **Vượt "ngưỡng vừa vặn" thì vẫn dựng được** nhưng chữ bị thu nhỏ/cắt. Đây là ngưỡng ĐỀ NGHỊ
  cho prompt, không phải điều kiện chặn.
- **`table`/`note`/`question`/`tablewide` do CODE chèn nguyên văn** từ giáo án. LLM sinh ra
  cũng bị bỏ — và tệ hơn là bỏ IM LẶNG.
- **`image_prompt` cấm dùng cho hình toán chính xác** (đồ thị, mặt phẳng toạ độ, bảng biến
  thiên, dựng hình) — AI vẽ sai. Code chặn sẵn bằng `_MATH_DENY`.
