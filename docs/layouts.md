# Danh mục bố cục

> **File này SINH TỰ ĐỘNG** từ `src/layouts/manifest.ts` — đừng sửa tay.
> Chạy lại: `npm run docs -w @mvng267/deck-kit`

Tổng 46 bố cục · 41 bố cục giáo viên
chọn tay được · 12 theme.

**Cột "Cần"** = dữ liệu tối thiểu để bố cục mở khoá trong bộ chọn. Thiếu thì ô bị khoá
kèm lý do, hoặc thư viện tự chuyển dạng dữ liệu cho khớp (ý ⇄ cột).

**Cột "Hiển thị"** = trường nào của slide thực sự được vẽ ra. Trường không nằm trong đây
vẫn được GIỮ trong dữ liệu, chỉ là tạm không hiện.


## Cơ bản

| `kind` | Tên | Dạng dữ liệu | Cần | Hiển thị |
|---|---|---|---|---|
| `content` | Nội dung | Danh sách | — | title, bullets, image |
| `twocol` | Hai cột | Danh sách | ≥3 ý | title, bullets |
| `cards` | Thẻ lưới | Danh sách | ≥2 ý | title, bullets |
| `numbered` | Đánh số | Danh sách | ≥1 ý | title, bullets |
| `checklist` | Danh sách ✓ | Danh sách | ≥1 ý | title, bullets |
| `toc` | Mục lục | Danh sách | ≥1 ý | title, bullets |
| `agenda` | Mục lục có mốc | Danh sách | ≥2 ý | title, bullets |
| `blank` | Khung trắng | Danh sách | — | title, bullets |
| `goals` | Mục tiêu | Danh sách | — | title, bullets |
| `remember` | Ghi nhớ | Danh sách | — | title, bullets |

## Số liệu

| `kind` | Tên | Dạng dữ liệu | Cần | Hiển thị |
|---|---|---|---|---|
| `bignum` | Số lớn | Cột | ≥1 cột có tiêu đề | title, columns |
| `metrics` | Thẻ số | Cột | ≥2 cột có tiêu đề | title, columns |
| `kpirow` | Dãy chỉ số | Cột | ≥2 cột có tiêu đề | title, columns |

## So sánh

| `kind` | Tên | Dạng dữ liệu | Cần | Hiển thị |
|---|---|---|---|---|
| `three` | Ba cột | Cột | ≥2 cột | title, columns |
| `compare3` | So sánh 3 cột | Cột | ≥2 cột có tiêu đề | title, columns |
| `compare` | So sánh | Cột | ≥2 cột | title, columns |
| `proscons` | Ưu / Nhược | Cột | ≥2 cột | title, columns |
| `quadrant` | Ma trận 2×2 | Cột | ≥2 cột | title, columns |
| `comparetable` | Bảng so sánh | Cột | ≥2 cột | title, columns |
| `tablewide` | Bảng rộng | Nguyên văn | — | title, table |
| `feature` | Đặc điểm | Cột | ≥2 cột | title, columns |

## Quy trình

| `kind` | Tên | Dạng dữ liệu | Cần | Hiển thị |
|---|---|---|---|---|
| `steps` | Các bước | Danh sách | ≥1 ý | title, bullets |
| `arrow` | Mũi tên | Danh sách | ≥1 ý | title, bullets |
| `timeline` | Dòng thời gian | Danh sách | ≥1 ý | title, bullets |
| `vtimeline` | Mốc dọc | Danh sách | ≥1 ý | title, bullets |
| `pyramid` | Kim tự tháp | Danh sách | ≥2 ý | title, bullets |
| `funnel` | Phễu | Danh sách | ≥2 ý | title, bullets |
| `formulasteps` | Công thức + các bước | Danh sách | ≥1 ý | title, bullets, formula |

## Nhấn mạnh

| `kind` | Tên | Dạng dữ liệu | Cần | Hiển thị |
|---|---|---|---|---|
| `define` | Định nghĩa | Danh sách | — | title, bullets |
| `example` | Ví dụ | Danh sách | — | title, bullets |
| `defcard` | Thẻ định nghĩa | Danh sách | ≥1 ý | title, bullets |
| `statement` | Câu chốt | Tiêu đề | — | title, subtitle |
| `spotlight` | Điểm nhấn | Danh sách | ≥1 ý | title, bullets |
| `quote` | Trích dẫn | Tiêu đề | — | title, subtitle |
| `quoteauthor` | Trích dẫn có tác giả | Tiêu đề | — | title, subtitle, image |

## Đặc biệt

| `kind` | Tên | Dạng dữ liệu | Cần | Hiển thị |
|---|---|---|---|---|
| `hero` | Bìa lớn | Tiêu đề | — | title, subtitle |
| `split` | Chia đôi | Tiêu đề | — | title, subtitle, bullets |
| `section` | Mở phần | Tiêu đề | — | title, subtitle |
| `gallery` | Lưới ảnh | Ảnh | ≥2 ảnh | title, images |
| `imageleft` | Ảnh trái | Ảnh | ≥1 ảnh | title, bullets, image |
| `imageright` | Ảnh phải | Ảnh | ≥1 ảnh | title, bullets, image |

## Nguyên văn

> 🔒 Nhóm này **không cho chọn tay** — nội dung lấy đúng từ giáo án gốc.
> Cho đổi sang thì AI hoặc giáo viên sẽ vô tình bịa ra dữ liệu không có trong nguồn.

| `kind` | Tên | Dạng dữ liệu | Cần | Hiển thị |
|---|---|---|---|---|
| `formula` | Công thức 🔒 | Nguyên văn | — | title, formula |
| `figure` | Hình 🔒 | Nguyên văn | — | title, image |
| `table` | Bảng 🔒 | Nguyên văn | — | title, table |
| `note` | Lưu ý 🔒 | Nguyên văn | — | title, bullets |
| `question` | Câu hỏi 🔒 | Nguyên văn | — | title, question |

## Theme

| Khoá | Tên |
|---|---|
| `navy-gold` | Navy · Vàng |
| `blue-green` | Xanh lục học thuật |
| `cream-editorial` | Kem cổ điển |
| `dark-modern` | Tối hiện đại |
| `purple-tech` | Tím công nghệ |
| `black-gold` | Đen · Vàng |
| `deep-blue` | Xanh biển tạp chí |
| `light-neu` | Xanh nhẹ |
| `coral-warm` | Cam san hô |
| `emerald-fresh` | Ngọc lục bảo |
| `slate-pro` | Xám thép |
| `rose-elegant` | Hồng thanh lịch |
