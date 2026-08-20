# `DeckJson` — hợp đồng deck-kit THẬT SỰ đọc

> Sinh tay từ `src/model.ts:16-42`. Khác với [`slide-schema.md`](./slide-schema.md) — xem bảng
> ngay dưới, **nhầm hai cái này là nguồn của phần lớn hiểu lầm**.

## Có HAI hợp đồng, đừng lẫn

|  | **Slide thô** | **DeckJson** |
|---|---|---|
| Ai viết | **LLM** dàn slide | **backend** dựng ra |
| Ai đọc | `_validate` (Python) | **deck-kit** render |
| Tài liệu | [`slide-schema.md`](./slide-schema.md) | **file này** |
| Ảnh | `figure` · `figures` (id chuỗi) | `image` · `images` (object `{asset,…}`) |
| Nhắc AI vẽ ảnh | `image_prompt` *(snake_case)* | `imagePrompt` *(camelCase)* |
| Có `id`/`kicker`/`locked`? | **không** | **có** — code sinh |
| Có `table`/`question`? | **không** — LLM viết ra cũng bị bỏ | **có** — code dựng từ giáo án |

Đo trên bài thật: cùng một hoạt động, slide thô có **4** slide còn DeckJson có **7**. Ba slide
kia do `_protect`/`_assemble` chèn ở **mỗi lần đọc** (công thức/bảng/lưu ý lấy **nguyên văn giáo
án**, cộng `goals`/`question`/`remember`). **Đây không phải lỗi** — nhưng nếu tưởng hai bên là
một thì sửa slide thô xong mở ra sẽ thấy khác.

## Khung ngoài

```jsonc
{
  "version": 1,
  "title": "Bài 1. Tính đơn điệu",
  "theme": "navy-gold",          // 1 trong 12 — xem manifest.json
  "transition": "fade",
  "size": { "w": 1280, "h": 720 },
  "display": { "fontScale": 1, "density": "normal",      // tuỳ chọn
               "fontFamily": "Georgia,\"Liberation Serif\",serif" },
  "foot": "Trường THPT …",
  "assets": { "img1": "data:image/png;base64,…" },      // ảnh dùng CHUNG, tra bằng id
  "slides": [ … ]
}
```

## `display` — tuỳ chọn hiển thị cả deck

| Khoá | Kiểu | Mặc định | Ghi chú |
|---|---|---|---|
| `fontScale` | number | `1` | Hệ số cỡ chữ toàn deck, kẹp trong `[0.6, 1.6]`. Áp qua `--dk-fs`. |
| `density` | `compact` \| `normal` \| `roomy` | `normal` | Lề slide: 48 / 64 / 80 px. |
| `fontFamily` | string | *(theo theme)* | Ghi đè `--sl-font`. Bỏ trống ⇒ dùng font của theme. |

**`fontFamily` phải là NGĂN XẾP font, không phải một tên.** Slide được vẽ ở hai nơi có bộ font
khác nhau — trình duyệt người dùng và máy dựng file xuất — nên tên đầu tiên thường chỉ có ở một
bên. Ngăn xếp phải kết thúc bằng một họ chắc chắn đọc được tiếng Việt:

```json
"fontFamily": "Georgia,\"Times New Roman\",\"Liberation Serif\",\"DejaVu Serif\",serif"
```

`Liberation Sans`/`Liberation Serif` khớp thước với Arial/Times nên độ dài dòng gần như không đổi
giữa hai nơi — quan trọng vì ngưỡng tràn chữ của slide đo theo thước đó.

> `display` là trường RIÊNG, không nhồi vào `size`: `size` đã bị nhiều tầng đọc nên thêm khoá lạ
> vào đó là mời lỗi im lặng. Consumer cũ không biết `display` thì bỏ qua, không ai vỡ.

## Trường của slide

| Trường | Kiểu | Ai sinh | Ghi chú |
|---|---|---|---|
| `id` | string | **code** | `s0`,`s1`… — xem cảnh báo dưới |
| `kind` | string | LLM/code | 1 trong 46 bố cục; lạ → `content` |
| `title` · `subtitle` · `caption` | string | LLM | |
| `kicker` | string | **code** | nhãn nhỏ trên tiêu đề (`"HĐ 1.2"`) |
| `bullets` | string[] | LLM | |
| `columns` | `{title,bullets[]}[]` | LLM | bố cục nhiều cột |
| `image` · `images` | `{asset,title?,aspect?}` | **code** | `asset` = id trong `assets` |
| `formula` | string | LLM → **bị đè** bằng bản gốc | |
| `formulaImage` | string | **code** | id ảnh công thức đã render |
| `table` | string[][] | **code** | LLM viết ra cũng bị bỏ |
| `question` | `{index,stem,options}` | **code** | LLM viết ra cũng bị bỏ |
| `notes` | string | LLM + code | Presenter View, không hiện trên slide |
| `accent` | string | **GV** | màu nhấn riêng slide (hex) |
| `skipped` | bool | **GV** | ẩn khỏi chiếu/xuất |
| `locked` | bool | **code** | nội dung nguyên văn — xem dưới |
| `src` | `{act,sub,i}` | **code** | **chỉ có ở tool lesson-plan** — xem dưới |

## ⚠️ `id` KHÔNG bền như tên gọi

`model.ts` ghi *"Bền qua mọi thao tác sửa"* — **đo lại thì không đúng với deck cả bài**:

- `id` là **vị trí**: `s0…s155`. Chèn/xoá một slide là **mọi id sau đó đổi hết**.
- Deck **một tiết** cũng bắt đầu từ `s0` ⇒ **trùng id với deck cả bài mà trỏ slide khác**.

Chỉ ở chế độ `edit` của một hoạt động thì `id` mới lấy theo `_oidx` (bền). Đừng dùng `id` làm
khoá lưu.

## `src` — mốc truy nguyên (tool lesson-plan)

```jsonc
{ "id": "s12", "kind": "content", "kicker": "HĐ 1.2",
  "src": { "act": "a1", "sub": "1.2", "i": 3 } }
```

- `act` = tiết · `sub` = hoạt động nhỏ · `i` = **chỉ số trong hoạt động đó**
- `src.i` **bền**: thêm/bớt slide ở tiết khác không làm nó đổi
- **Bìa và slide ngăn cách KHÔNG có `src`** (do code sinh, không thuộc hoạt động nào) — đường
  ghi ngược dựa vào đúng điểm đó để bỏ qua chúng

Đường ghi (`PUT …/deck-model/_all_`) neo bằng `src`, **không đoán theo vị trí** — đoán sai là
ghi đè nhầm hoạt động của giáo viên, hỏng im lặng.

## `locked` — nội dung lấy nguyên văn giáo án

`true` với `formula` · `figure` · `table` · `note` · `question` (đo trên bài thật: **57/156
slide**, gồm **24 slide đáp án**). Code dựng lại chúng từ giáo án ở **mỗi lần đọc**, để AI không
viết lệch.

> **Hiện chưa sửa được nội dung `locked`.** `_apply_patch` không nhận `formula`/`table`/
> `question`, nên ghi vào cũng không ăn; và `_protect` sẽ dựng lại từ giáo án ở lần đọc sau.
> Đây là **giới hạn có chủ đích** (giữ đáp án khớp bản gốc), không phải bug — nhưng cũng chưa
> có đường cho GV sửa khi họ thật sự cần. Xem *Còn nợ*.

## Lấy / ghi (tool lesson-plan)

```bash
# ĐỌC — mặc định bỏ data-URI ảnh: 693 KB → 57 KB (ảnh chiếm 92%)
GET  /api/lesson-plan/jobs/{job}/deck-model/_all_?assets=0
GET  /api/lesson-plan/jobs/{job}/deck-model/_all_          # bản TỰ CHỨA, cho xuất file

# GHI — nhận đúng thứ vừa GET ra
PUT  /api/lesson-plan/jobs/{job}/deck-model/_all_
```

Đường ghi **không bao giờ TỰ Ý xoá** override sẵn có. Từng làm ngược (xoá override "trùng bản
AI" cho sạch) và **mất 39/80 chỗ giáo viên đã sửa** — chúng trùng bản AI *lúc này*, nhưng dàn
lại bằng AI là nội dung đổi, override chính là thứ giữ ý GV.

**Ngoại lệ đúng đắn — hoàn tác.** Gửi lên một trường bằng **đúng bản gốc** thì override của
trường đó **được gỡ**. Đây là GV chủ động hoàn tác, không phải hệ thống tự dọn. Xử lý **theo
từng trường**: cùng một slide có thể vừa hoàn tác `title` vừa giữ `bullets` đang sửa.

> Từng hỏng: bản đầu chỉ ghi khi có thay đổi, nên **hoàn tác là bất khả** — sửa đi được, sửa về
> thì kẹt, mà `PUT` vẫn trả 200. Bản vá thứ hai chỉ chạy khi slide *không còn khác gì cả* nên
> vẫn kẹt với slide nhiều override, **và cổng vẫn xanh**.

Dữ liệu vào sai → **400 kèm lý do**, đĩa không đổi.

## Còn nợ

- **Sửa nội dung `locked`** — cần `_apply_patch` nhận `formula`/`table`/`question` **trước**,
  rồi mới thêm cờ đánh dấu "đã lệch bản gốc". Thử làm bằng cờ đơn thuần thì **không ăn**, vì
  `_apply_patch` vốn không ghi mấy trường đó.
- **Thêm / xoá / đổi thứ tự slide qua đường ghi cả bài** — phải đi qua `structure`, chưa làm.
- **`id` bền** — đổi cách đánh số là đợt riêng, vì `deck_outline` và bản sửa của GV đang bám
  vào cách hiện tại.
