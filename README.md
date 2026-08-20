# `@mvng267/deck-kit`

Hiển thị **và chỉnh sửa** slide bài giảng ngay trên trình duyệt, từ một file JSON.
Không cần backend, không cần Python, không dùng iframe — chạy được ở Angular, React,
Vue hay JavaScript thuần.

```ts
import { mountDeck } from "@mvng267/deck-kit"
import "@mvng267/deck-kit/styles.css"

const deck = mountDeck(document.getElementById("host")!, deckJson, { edit: true })
```

- **46 bố cục** dựng sẵn (nội dung, so sánh, quy trình, số liệu, ảnh, nhấn mạnh…)
- **12 theme** sáng/tối, hoặc tự khai token màu riêng
- Sửa tại chỗ: kéo-thả đổi thứ tự, đổi bố cục có **tự chuyển ý ⇄ cột**, undo, tự lưu
- Xuất **JSON** · **HTML một file tự chứa** · **.pptx** (qua backend của bạn)

---

## Mục lục

1. [Cài đặt](#1-cài-đặt) — ⚠️ **bắt buộc có token**, kể cả khi package công khai
2. [Bắt đầu nhanh](#2-bắt-đầu-nhanh) — vanilla · Angular · React
3. [Nhúng vào app có sẵn](#3-nhúng-vào-app-có-sẵn--css-không-đụng-nhau) — CSS không đụng nhau
4. [Tham chiếu `DeckJson`](#4-tham-chiếu-deckjson)
5. [Tham chiếu API](#5-tham-chiếu-api) — gồm định dạng chữ B · I · x² · x₂
6. [Danh mục 46 bố cục](#6-danh-mục-bố-cục)
7. [Chuyển đổi bố cục](#7-chuyển-đổi-bố-cục)
8. [Theme & tuỳ biến](#8-theme--tuỳ-biến) — màu · **cỡ chữ & mật độ lề**
9. [Xuất file](#9-xuất-file)
10. [Câu hỏi thường gặp](#10-câu-hỏi-thường-gặp)

> **Hai hợp đồng JSON, đừng lẫn:** [`docs/deck-json.md`](./docs/deck-json.md) tả thứ **deck-kit
> render**; [`docs/slide-schema.md`](./docs/slide-schema.md) tả **slide thô do LLM viết**. Tên
> trường khác nhau.

---

## 1. Cài đặt

> Mục này là bản TÓM TẮT. Bản đầy đủ (từng bước tạo token, cấu hình theo từng framework,
> bảng lỗi thường gặp): [`docs/install.md`](./docs/install.md).

> **Đọc kỹ mục này — đây là chỗ vấp nhiều nhất.**
> GitHub Packages **KHÔNG cho tải ẩn danh, kể cả với package công khai**. Mọi máy cài
> đều phải có token, nếu không sẽ gặp `401 Unauthorized` hoặc `404 Not Found`.

Tạo file `.npmrc` ở gốc dự án:

```ini
@mvng267:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Tạo Personal Access Token (classic) tại **GitHub → Settings → Developer settings →
Personal access tokens**, tick quyền:

| Việc | Quyền cần |
|---|---|
| Cài package (`npm i`) | `read:packages` |
| Đăng package (`npm publish`) | `write:packages` |

Rồi đặt vào biến môi trường và cài:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
npm install @mvng267/deck-kit
```

**Gặp lỗi?**

| Thông báo | Nguyên nhân |
|---|---|
| `401 Unauthorized` | thiếu `_authToken`, hoặc token hết hạn |
| `404 Not Found` | token không có `read:packages`, hoặc thiếu dòng `@mvng267:registry` |
| `E403 Forbidden` khi publish | token thiếu `write:packages`, hoặc `name` không khớp chủ repo |

### Ai kéo được package này?

Gói **không công khai**. GitHub Packages gắn quyền của package vào quyền của repo
`mvng267/edmicro-tools` — cấp quyền repo cho ai thì người đó mới cài được:

| Quyền repo được cấp | Làm được gì |
|---|---|
| *(không cấp)* | `npm install` trả **404** — kể cả biết đúng tên gói |
| **Read** | Cài được (token cần `read:packages`) |
| **Write** | Cài + đăng bản mới (token cần `write:packages`) |
| *(gỡ quyền repo)* | Mất luôn quyền cài — không cần thu hồi gì thêm |

Không có URL tải công khai, không đoán được tên gói để lấy. Mỗi người dùng tự tạo PAT của
mình — **đừng dùng chung một token**, vì thu hồi token dùng chung là cắt luôn cả nhóm.

### Đăng bản mới

```bash
npm version patch -w @mvng267/deck-kit   # 0.3.3 → 0.3.4
npm run build -w @mvng267/deck-kit       # BẮT BUỘC — `files` chỉ đóng gói dist/
npm publish -w @mvng267/deck-kit
```

`prepublishOnly` tự chạy `scripts/check-dist.mjs` chặn 3 ca hỏng: thiếu file trong `dist/`,
file rỗng/cụt, và `src/` mới hơn `dist/` (quên dựng lại sau khi sửa code). Không có chốt này
thì npm vẫn publish **bình thường** ra một gói rỗng — mà npm **không cho publish đè cùng số
version**, nên phải bỏ luôn version đó.

Người dùng cập nhật bằng `npm update @mvng267/deck-kit`.

---

## 2. Bắt đầu nhanh

### JavaScript thuần

```html
<div id="host" style="position:relative;height:100vh"></div>
<script type="module">
  import { mountDeck } from "@mvng267/deck-kit"
  import "@mvng267/deck-kit/styles.css"

  const deck = {
    version: 1,
    title: "Tiết 2. Tổng và hiệu hai vectơ",
    theme: "navy-gold",
    slides: [
      { id: "s0", kind: "hero", title: "Tổng hai vectơ", subtitle: "Toán 11" },
      { id: "s1", kind: "content", title: "Quy tắc hình hộp",
        bullets: ["Dựng hình hộp trên ba vectơ", "Đường chéo chính là vectơ tổng"] },
    ],
  }

  const h = mountDeck(document.getElementById("host"), deck, { edit: true })
  h.on("save", patch => console.log("cần lưu:", patch))
</script>
```

Phần tử chứa phải có `position: relative` (hoặc `absolute`/`fixed`) và **chiều cao thật** —
slide định vị tuyệt đối bên trong nó.

### Angular (standalone)

> **Cần bản ≥ 0.3.3.** Bản cũ hơn thiếu metadata Ivy nên Angular từ chối với
> `NG2012: Component imports must be standalone components…` **dù bạn viết đúng** — xem
> [bảng tra lỗi](./docs/angular.md#6b-gặp-lỗi-thì-tra-ở-đây).
>
> Bản đầy đủ (nạp CSS, mọi input/output, Zone.js, SSR, các bẫy):
> [`docs/angular.md`](./docs/angular.md).

```ts
import { DeckViewerComponent } from "@mvng267/deck-kit/angular"
import "@mvng267/deck-kit/styles.css"

@Component({
  standalone: true,
  imports: [DeckViewerComponent],
  // Khung PHẢI có chiều cao — slide dùng `position:absolute` nên khung cao 0 là không thấy gì.
  styles: [`:host { display: block; height: 100vh }`],
  template: `
    <edm-deck [deck]="deck" [edit]="true"
              (save)="onSave($event)"
              (reset)="onReset()"
              (requestImage)="pickImage($event)"></edm-deck>`,
})
export class SlidePage {
  @ViewChild(DeckViewerComponent) deckView!: DeckViewerComponent
  deck = myDeckJson
  constructor(private http: HttpClient) {}

  onSave(patch: any) {
    // Thư viện KHÔNG tự gọi mạng — bạn tự quyết lưu ở đâu,
    // rồi BÁO LẠI kết quả để thanh trạng thái nói đúng sự thật.
    this.http.put("/api/decks/1", patch).subscribe({
      next: () => this.deckView.setSaveState("saved"),
      error: e => this.deckView.setSaveState("error", e.message),
    })
  }
}
```

### React / Next.js

```tsx
import { DeckView } from "@mvng267/deck-kit/react"
import "@mvng267/deck-kit/styles.css"

export function SlidePanel({ deck }) {
  const ref = useRef<DeckHandle>(null)
  return (
    <DeckView
      ref={ref}
      deck={deck}
      edit
      style={{ position: "absolute", inset: 0 }}
      onSave={async patch => {
        try {
          const r = await fetch("/api/decks/1", { method: "PUT", body: JSON.stringify(patch) })
          if (!r.ok) throw new Error(await r.text())
          ref.current?.setSaveState("saved")
        } catch (e) {
          // BẮT BUỘC báo lại — xem mục setSaveState ở phần API
          ref.current?.setSaveState("error", String(e))
        }
      }}
    />
  )
}
```

---

## 3. Nhúng vào app có sẵn — CSS không đụng nhau

deck-kit dùng **chung document** với app chủ nhà (không Shadow DOM, không iframe). Từ **0.2.0**
mọi CSS đều có phạm vi, nhưng có vài điều nên biết.

### Cái gì bảo vệ cái gì

| Cơ chế | Chặn được gì |
|---|---|
| **`.dk-root`** — `mountDeck` tự gắn lên khung deck | Reset (`*{margin:0;padding:0}`), nền, `overflow` chỉ áp trong khung. **Đừng gỡ class này** |
| **`.slide`** bọc selector thẻ | `b,strong` chỉ đổi chữ đậm TRONG slide, không đụng `<b>` của app |
| **`.dk-dark`** (không phải `.dark`) | Tailwind/shadcn dùng `.dark` làm trigger dark-mode. Trùng tên là slide theme tối **bật dark-mode cho cả app** |
| **`@layer deck-kit`** | Cho app **đè** deck-kit khi cần, khỏi chạy đua `!important` |
| **token trên `.dk-root`** | 24 biến `--sl-*` không đổ lên `:root` của app |

> ⚠️ **`@layer` KHÔNG phải cơ chế cách ly.** Từng tưởng vậy rồi đo lại thấy sai: **layer khai
> SAU luôn thắng layer khai trước**, mà layer của deck-kit sinh lúc `mount` nên luôn đứng cuối
> chuỗi ⇒ vẫn thắng app. Thứ thật sự chặn rò là **phạm vi selector**. Ghi ra đây để người sau
> khỏi mất công thử lại.

### Khung chứa phải có chiều cao

```html
<div id="host" style="height:100vh"></div>   <!-- cao 0 là slide "biến mất" -->
```

`mountDeck` tự đặt `position:relative` nếu khung đang `static` — cần thế để `.nav`, thanh
tiến độ và khung trình sửa neo **trong** panel thay vì nổi lên trên UI app.

### Tự kiểm khi nghi ngờ

Bốn dấu hiệu deck-kit đang phá app, đo ngay trong Console:

```js
getComputedStyle(document.body).overflow          // "hidden" = deck giết scroll app
getComputedStyle(document.querySelector("h1 b")).color   // đổi màu = rò b,strong
getComputedStyle(document.querySelector(".nav")).position // "fixed" = nav thoát panel
getComputedStyle(document.documentElement).getPropertyValue("--sl-navy")  // có = rò token
```

Repo này có cổng tự động cho đúng 6 chỉ số đó:
`docker compose exec -T backend python -m app.tools.lesson_plan.leak_test`

---

## 4. Tham chiếu `DeckJson`

Một object **tự chứa**: ảnh đã là data-URI nên không phụ thuộc server nào.

```jsonc
{
  "version": 1,
  "title": "Tiết 2. Tổng và hiệu hai vectơ",
  "theme": "navy-gold",             // 1 trong 12 theme, xem mục 8
  "transition": "fade",             // fade | slide | slideup | zoom | flip | none
  "size": { "w": 1280, "h": 720 },  // mặc định 16:9
  "display": {                      // cấu hình HIỂN THỊ (0.2.0) — xem mục 8
    "fontScale": 1,                 // 0.6–1.6 · 1 = thiết kế gốc
    "density": "normal",            // compact | normal | roomy (lề 48/64/80px)
    "fontFamily": ""                // (0.6.0) NGĂN XẾP font, ghi đè font của theme
  },
  "foot": "Bài 6 · Vectơ trong không gian",
  "assets": {                       // BẢNG ẢNH — slide chỉ giữ id
    "img1": "data:image/webp;base64,…"
  },
  "slides": [ /* … */ ]
}
```

### Trường của deck

| Trường | Kiểu | Bắt buộc | Ý nghĩa |
|---|---|:--:|---|
| `version` | `1` | | Phiên bản schema. Bỏ trống → tự điền `1` |
| `title` | `string` | | Tên deck (dùng cho `<title>` khi xuất HTML) |
| `theme` | `ThemeKey` | | Mặc định `"navy-gold"` |
| `transition` | `TransitionKey` | | Hiệu ứng chuyển slide, mặc định `"fade"` |
| `size` | `{w,h}` | | Mặc định `1280×720` |
| `display` | `DeckDisplay` | | Cỡ chữ + mật độ lề + kiểu chữ — xem mục 8 |
| `foot` | `string` | | Chân trang mặc định cho mọi slide |
| `assets` | `{[id]: dataURI}` | | **Để ảnh ở đây**, đừng nhúng thẳng vào slide |
| `slides` | `DeckSlide[]` | ✔ | Danh sách slide |

> **Vì sao có `assets`?** Cùng một ảnh dùng ở nhiều slide chỉ lưu **một lần**. Deck cả bài
> 213 slide sẽ phình gấp nhiều lần nếu nhúng data-URI thẳng vào từng slide.

### Trường của slide

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | `string` | **Định danh bền** — giữ nguyên qua mọi thao tác sửa. Bắt buộc nếu dùng `getPatch()` |
| `kind` | `string` | 1 trong 46 bố cục (mục 6). Không nhận ra → tự về `"content"` |
| `title` | `string` | Tiêu đề |
| `subtitle` | `string` | Phụ đề (bố cục nhóm *Tiêu đề*) |
| `kicker` | `string` | Nhãn nhỏ phía trên tiêu đề |
| `caption` | `string` | Chú thích (chức danh ở `quoteauthor`, ghi chú hình…) |
| `bullets` | `string[]` | Danh sách ý |
| `columns` | `{title, bullets[]}[]` | Cột (bố cục so sánh/số liệu) |
| `image` | `{asset, title?, aspect?}` | Một ảnh — `asset` là khoá trong `assets` |
| `images` | `{asset,…}[]` | Nhiều ảnh (lưới ảnh) |
| `formula` | `string` | Công thức dạng chữ |
| `formulaImage` | `string` | Ảnh công thức (data-URI **hoặc** id trong `assets`) |
| `table` | `string[][]` | Bảng, dòng đầu là tiêu đề |
| `question` | `{index, stem, options[]}` | Câu hỏi trắc nghiệm |
| `notes` | `string` | **Không hiển thị** — dùng cho Presenter View khi xuất .pptx |
| `accent` | `string` | Màu nhấn riêng slide (mã hex) |
| `skipped` | `boolean` | Ẩn khỏi trình chiếu/xuất; trình sửa vẫn thấy (mờ) |
| `locked` | `boolean` | Khoá đổi bố cục (nội dung nguyên văn) |

Xem file chạy được: [`examples/minimal.json`](./examples/minimal.json) ·
[`examples/full.json`](./examples/full.json) (phủ đủ 46 bố cục).

Muốn xem dữ liệu **THẬT** trông thế nào: [`examples/real-lesson.json`](./examples/real-lesson.json)
— 13 slide xuất thẳng từ một hoạt động đang chạy. Khác mẫu tổng hợp ở chỗ có `question`
(đề + đáp án trong `notes`), `note` giữ nguyên văn, `kicker` và công thức Toán thật.

---

## 5. Tham chiếu API

### `mountDeck(el, deck, opts?) → DeckHandle`

```ts
type MountOpts = {
  edit?: boolean        // bật trình sửa (mặc định false)
  theme?: ThemeKey      // ghi đè deck.theme
  transition?: TransitionKey
  foot?: string         // ghi đè deck.foot
  autoSaveMs?: number   // hẹn giờ phát `save`, 0 = tắt. Mặc định 1200
  keyboard?: boolean    // bật phím ←/→/Home/End/F
}
```

### `DeckHandle`

| Nhóm | Hàm | Mô tả |
|---|---|---|
| **Xem** | `goto(i)` `next()` `prev()` | Chuyển slide |
| | `current()` `count()` | Vị trí / tổng số |
| | `present(on)` `fit()` | Trình chiếu toàn màn hình · căn lại tỉ lệ |
| **Sửa** | `setEditMode(on)` | Bật/tắt trình sửa |
| | `setTheme(k)` `setTransition(k)` | Đổi theme / hiệu ứng |
| | `setKind(i, kind)` | Đổi bố cục slide (tự chuyển dạng dữ liệu) |
| | `canSetKind(i, kind)` | Kiểm tra trước — trả `{ok, reason?, willHide?}` |
| | `undo()` `redo()` | Quay lui/tiến cả `DeckJson` |
| **Dữ liệu** | `getDeck()` | `DeckJson` đầy đủ (đã sửa) |
| | `getPatch()` | Chỉ phần thay đổi — hợp với backend |
| | `setDeck(d)` | Thay toàn bộ deck |
| **Xuất** | `toHTML()` | Một file HTML tự chứa (CSS + ảnh + player) — xem mục 9 |
| **Trạng thái** | `setSaveState(s, detail?)` | Báo kết quả THẬT của lượt lưu — xem dưới |
| **Khác** | `on(ev, fn)` | Đăng ký sự kiện, trả hàm huỷ |
| | `destroy()` | Dọn sạch listener + DOM |

### `setSaveState` — bắt buộc gọi nếu bật `edit`

Thư viện **không tự gọi mạng** nên không thể biết lượt lưu thành công hay không. Nếu bạn
không báo lại, thanh trạng thái sẽ đứng mãi ở *"Đang lưu…"*.

```ts
const h = mountDeck(el, deck, { edit: true })

h.on("save", async patch => {
  try {
    await fetch("/api/decks/1", { method: "PUT", body: JSON.stringify(patch) })
    h.setSaveState("saved")                       // ✓ Đã lưu 14:32
  } catch (e) {
    h.setSaveState("error", "mất kết nối máy chủ") // ⚠ LƯU HỎNG — … · Ctrl+S để thử lại
  }
})
```

| Trạng thái | Hiện gì | Khi nào gọi |
|---|---|---|
| `saving` | "Đang lưu…" | tự đặt khi bắn `save`; gọi tay nếu bạn tự trì hoãn |
| `saved` | "✓ Đã lưu HH:MM" | server xác nhận xong |
| `error` | nền ĐỎ + lý do + "Ctrl+S để thử lại" | request hỏng |
| `dirty` | "Có thay đổi chưa lưu…" | tự đặt khi giáo viên gõ |

> ⚠️ **Đừng nuốt lỗi trong `.catch`**. Không báo `error` thì giáo viên tưởng đã lưu, gõ
> tiếp rồi mất trắng công.

### `applyDisplay(el, display)`

Hàm rời (không nằm trên handle) đặt cỡ chữ + mật độ lề cho khung deck — xem mục 8.

```ts
import { applyDisplay } from "@mvng267/deck-kit"
applyDisplay(host, { fontScale: 1.25, density: "roomy" })
```

`mountDeck` tự gọi nó trong mỗi lượt vẽ, nên **đường thường** là sửa `deck.display` rồi
`h.setDeck(d)` — không cần gọi tay. Gọi trực tiếp chỉ để xem thử tại chỗ (kéo thanh trượt) mà
chưa muốn ghi vào deck.

### Định dạng chữ trong ô (0.2.0)

Khi con trỏ đang ở một ô sửa được, thanh công cụ hiện 4 nút: **B** · *I* · **x²** · **x₂**.

| Nút | Thẻ sinh ra | Phím tắt trình duyệt |
|---|---|---|
| B | `<b>` | Ctrl/⌘ + B |
| I | `<i>` | Ctrl/⌘ + I |
| x² | `<sup>` | — |
| x₂ | `<sub>` | — |

**Đúng 4 thẻ đó** được giữ qua toàn chuỗi: ô sửa → `DeckJson` → HTML tự chứa → **`.pptx`**
(mỗi đoạn định dạng thành một *run* riêng trong file PowerPoint, sửa lại được). Mọi thẻ khác bị
`escRich()` khử thành chữ thường — dán từ Word không mang theo rác, và không có đường cho HTML
lạ chui vào DOM.

Cần chèn định dạng bằng code thì viết thẳng 4 thẻ ấy vào chuỗi trong `DeckJson`:

```jsonc
{ "kind": "content", "title": "Công thức", "bullets": ["Diện tích <b>S</b> = a<sup>2</sup>"] }
```

> Cài nút cho khung sửa của riêng bạn: phải dùng `mousedown` + `preventDefault()`, **không**
> phải `click`. `click` cướp focus khỏi ô sửa trước khi lệnh chạy ⇒ mất vùng bôi đen, nút bấm
> không ăn gì.

### Sự kiện

| Tên | Payload | Khi nào |
|---|---|---|
| `ready` | `{count}` | Mount xong |
| `change` | `DeckJson` | Dữ liệu deck đổi |
| `save` | gói edits | Hết hẹn giờ tự lưu, hoặc bấm Lưu / Ctrl+S |
| `slideChange` | `{index, total}` | Đổi slide đang xem |
| `requestImage` | `{index, dataUrl}` | GV chọn ảnh mới (`dataUrl` đã nén WebP ≤1400px) hoặc gỡ ảnh (`null`) |
| `requestRegenImage` | `{index, prompt}` | GV bấm "Vẽ lại ảnh AI" |
| `reset` | — | GV bấm "Đặt lại" |

> **Thư viện KHÔNG tự gọi mạng.** Mọi việc cần server (lưu, sinh ảnh AI) đều bắn sự kiện
> ra cho ứng dụng chủ tự quyết. Đó chính là điều kiện để Angular dùng được độc lập.

### Phím tắt

| Phím | Việc |
|---|---|
| `←` `→` `PageUp` `PageDown` `Space` | Chuyển slide |
| `Home` `End` | Slide đầu / cuối |
| `F` | Toàn màn hình |
| `Ctrl/⌘ + S` | Lưu ngay |
| `Ctrl/⌘ + Z` | Hoàn tác thao tác sửa |
| `Esc` | Thoát trình chiếu / đóng bộ chọn bố cục |

---

## 6. Danh mục bố cục

Danh sách đầy đủ **sinh tự động từ manifest**: [`docs/layouts.md`](./docs/layouts.md).
Đọc bằng code:

```ts
import { LAYOUTS, SELECTABLE_LAYOUTS, LAYOUT_BY_KEY } from "@mvng267/deck-kit"

LAYOUTS.length            // 46
SELECTABLE_LAYOUTS.length // 41 — 5 bố cục nguyên văn không cho chọn tay
LAYOUT_BY_KEY["three"]    // { key, label, group, shape, needs, maxColumns, renders }
```

Tóm tắt theo nhóm:

| Nhóm | Bố cục |
|---|---|
| **Cơ bản** | `content` `twocol` `cards` `numbered` `checklist` `toc` `agenda` `blank` `goals` `remember` |
| **Số liệu** | `bignum` `metrics` `kpirow` |
| **So sánh** | `three` `compare3` `compare` `proscons` `quadrant` `comparetable` `tablewide` `feature` |
| **Quy trình** | `steps` `arrow` `timeline` `vtimeline` `pyramid` `funnel` `formulasteps` |
| **Nhấn mạnh** | `define` `example` `defcard` `statement` `spotlight` `quote` `quoteauthor` |
| **Đặc biệt** | `hero` `split` `section` `gallery` `imageleft` `imageright` |
| **Nguyên văn** 🔒 | `formula` `figure` `table` `note` `question` |

> 🔒 **5 bố cục nguyên văn không cho chọn tay** — đây là **cố ý**. Nội dung của chúng
> (công thức, bảng, câu hỏi) lấy đúng từ giáo án gốc; cho đổi sang thì AI hoặc giáo viên
> sẽ vô tình bịa ra dữ liệu không có trong nguồn.

**Viết prompt cho LLM dàn slide?** Dùng [`docs/slide-schema.md`](./docs/slide-schema.md) —
hợp đồng JSON sinh từ manifest: mỗi bố cục đọc trường nào, cần tối thiểu bao nhiêu ý/cột,
ngưỡng độ dài bao nhiêu. Chép tay bảng này là lệch: đã gặp thật, prompt dạy `quoteauthor`
chỉ có `caption` trong khi builder đọc **cả** `subtitle` (tên) lẫn `caption` (chức danh),
nên slide ra có chức danh mà không có tên người nói.

---

## 7. Chuyển đổi bố cục

Nguyên tắc: **không bao giờ xoá dữ liệu**. Bố cục mới không hiển thị phần nào thì phần đó
chỉ *tạm ẩn* — đổi ngược lại là thấy nguyên vẹn.

```ts
import { canConvert, convert } from "@mvng267/deck-kit"

const chk = canConvert(slide, "three")
// { ok: true, transform: "bulletsToColumns" }         → đổi được, tự tách ý thành cột
// { ok: true, willHide: 4 }                           → đổi được nhưng 4 ý sẽ tạm ẩn
// { ok: false, reason: "Cần ít nhất 2 ảnh trong…" }   → khoá, kèm lý do đọc được

if (chk.ok) slide = convert(slide, "three")
```

Bố cục nhóm theo **hình dạng dữ liệu** (`shape`), đổi trong cùng nhóm là tự do:

| `shape` | Dữ liệu chính | Đổi chéo nhóm |
|---|---|---|
| `list` | `bullets` | → `columns`: mỗi ý thành một cột |
| `columns` | `columns` | → `bullets`: làm phẳng tiêu đề + ý của các cột |
| `headline` | `title` + `subtitle` | Phần còn lại tạm ẩn, có cảnh báo trước |
| `media` | `images` | Chỉ mở khi đủ ảnh, thiếu thì khoá kèm lý do |
| `verbatim` | nguyên văn | **Cấm** đổi sang — không bịa được dữ liệu gốc |

Đã kiểm đủ **46×46 = 2116 cặp**: 1886 cặp chuyển được (đúng bố cục đích, không mất dữ liệu,
đổi đi đổi về khôi phục nguyên trạng), 215 cặp khoá đều có lý do đọc được.

---

## 8. Theme & tuỳ biến

12 theme dựng sẵn:

```
navy-gold  blue-green  cream-editorial  dark-modern  purple-tech  black-gold
deep-blue  light-neu   coral-warm       emerald-fresh slate-pro   rose-elegant
```

```ts
import { THEMES, applyTheme } from "@mvng267/deck-kit"
THEMES.map(t => t.key)     // liệt kê
handle.setTheme("dark-modern")
```

Tự khai token riêng — ghi đè biến CSS `--sl-*` lên phần tử chứa:

```css
#host {
  --sl-bg: #fffdf8;      --sl-bg2: #f6f1e6;   --sl-card: #fff;
  --sl-ink: #2b2b2b;     --sl-muted: #7a7264;
  --sl-navy: #4a3b2a;    --sl-navy2: #6b563d;
  --sl-gold: #c8a45a;    --sl-blue: #7a6a52;  --sl-green: #6b8f5e;
  --sl-border: #e6ded0;  --sl-rail: #c8a45a;  --sl-dot: #ded3c0;
  --sl-font: "Be Vietnam Pro", system-ui, sans-serif;
}
```

### Cỡ chữ & mật độ lề — `display` (0.2.0)

Theme lo **màu**; `display` lo **kích cỡ**. Hai thứ độc lập nhau.

```ts
mountDeck(el, { ...deck, display: { fontScale: 1.25, density: "roomy" } })
```

| Khoá | Giá trị | Ý nghĩa |
|---|---|---|
| `fontScale` | 0,6 – 1,6 (mặc định 1) | Nhân vào **mọi** cỡ chữ. Ngoài khoảng thì tự kẹp |
| `density` | `compact` · `normal` · `roomy` | Lề slide 48 / 64 / 80px |
| `fontFamily` | ngăn xếp CSS (mặc định: theo theme) | Ghi đè `--sl-font`. Bỏ trống ⇒ font của theme sống lại |

**`fontFamily` phải là NGĂN XẾP, không phải một tên font.** Slide được vẽ ở hai nơi có bộ font
khác nhau — trình duyệt người dùng và máy dựng `.pptx` — nên tên đầu tiên thường chỉ có ở một
bên. Ngăn xếp phải kết thúc bằng họ chắc chắn đọc được tiếng Việt:

```ts
mountDeck(el, { ...deck, display: {
  fontFamily: 'Georgia,"Times New Roman","Liberation Serif","DejaVu Serif",serif',
} })
```

`Liberation Sans`/`Liberation Serif` khớp thước với Arial/Times nên độ dài dòng gần như không
đổi giữa hai nơi — quan trọng vì ngưỡng tràn chữ của slide đo theo thước đó.

**Vì sao nhân `calc()` chứ không `transform:scale`:** luồng xuất `.pptx` đọc
`getBoundingClientRect()` để đặt textbox và `getComputedStyle().fontSize` để lấy cỡ chữ.
`transform` làm hai thứ đó lệch nhau ⇒ chữ trong .pptx đặt sai chỗ. Nhân thẳng vào từng khai
báo thì **.pptx tự khớp** — đo thật: `fontScale=1.25` làm 54,0pt → 67,5pt trong file xuất ra.

Đo trên 114 slide thật: `fontScale=1.25` **không slide nào tràn** (thang thu nhỏ theo số ý
`data-nb` vẫn chạy song song).

---

## 9. Xuất file

| Đường | Gọi thế nào | Kết quả | Khi nào dùng |
|---|---|---|---|
| **JSON** | `handle.getDeck()` | `DeckJson` | Luôn có; app tự lưu/đồng bộ |
| **HTML** | `handle.toHTML()` | Một file tự chứa (CSS + ảnh + player) | Gửi/nhúng/chiếu offline |
| **PPTX** | POST `getDeck()` lên backend | `.pptx` native | Cần backend có Playwright + python-pptx |
| **PDF / giấy** | mở bản HTML rồi `print()` | PDF hoặc bản in | Không cần backend — trình duyệt tự lo |

```ts
// Tải HTML về máy
const blob = new Blob([handle.toHTML()], { type: "text/html" })
const a = Object.assign(document.createElement("a"), {
  href: URL.createObjectURL(blob), download: "bai-giang.html",
})
a.click()
```

Xuất `.pptx` cần backend vì phải chụp nền bằng trình duyệt thật rồi dựng textbox native —
xem `backend/app/tools/lesson_plan/deck_to_pptx.py` trong repo này để tham khảo.

### In / Lưu PDF (0.3.0)

`toHTML()` đã kèm sẵn `@media print`, nên **không cần thư viện PDF nào** — mở file rồi Ctrl+P,
chọn *Đích: Lưu thành PDF*. File tự chứa cũng có nút **⎙** trên thanh điều khiển.

```ts
// In từ app: mở bản tự chứa ở tab mới rồi in
const w = window.open("", "_blank")!
w.document.write(handle.toHTML()); w.document.close()
w.onload = () => setTimeout(() => w.print(), 400)   // chờ ảnh nhúng vẽ xong
```

| Ra giấy thế nào | |
|---|---|
| Mỗi slide | **một trang khổ ngang** 1280×720px (= 960×540pt) |
| Slide `skipped` | **không in** — giống lúc trình chiếu |
| Nav, thanh tiến độ, khung sửa | không in |

**Từ 0.3.2, CSS in nằm trong `deckCss()`** nên mọi deck mount bằng `mountDeck` đều in được —
kể cả trang deck bạn tự đặt ở một route riêng, không nhất thiết phải qua `toHTML()`.

> ⚠️ **Nhưng đừng gọi `window.print()` khi deck đang nằm giữa giao diện app** (sidebar,
> toolbar…): trình duyệt in cả những thứ đó ra giấy. Deck phải chiếm trọn trang — hoặc mở
> **bản HTML tự chứa** ở tab mới rồi mới in.

> ⚠️ **Khung chứa deck đặt `height`/`overflow` bằng style INLINE thì CSS in phải `!important`.**
> Inline thắng mọi selector, nên khung cao `100vh` sẽ **cắt** chồng slide dài 9×720px xuống còn
> **đúng 1 trang**. `print.css` đã xử lý cho `.dk-root`; khung của riêng bạn thì tự lo.

> ⚠️ **Tự sửa `print.css` thì nhớ hai cái bẫy** (đã mất công vì cả hai): `@page{size}` **không
> được** kèm từ khoá `landscape` sau số đo — Chrome bỏ cả khai báo rồi in ra khổ Letter DỌC.
> Và `.slide` khi in phải là `position:relative`, **không được** `static`: 37 luật
> `position:absolute` (`.hd`, `.foot`…) neo vào slide, mất containing block là tiêu đề mọi
> slide dồn hết lên trang đầu.

> ⚠️ **Bật "In nền" (Background graphics) trong hộp thoại in.** Mặc định trình duyệt bỏ nền để
> tiết kiệm mực; slide theme tối mất nền là **chữ trắng trên giấy trắng**. `print.css` đã đặt
> `print-color-adjust:exact`, nhưng vài trình duyệt vẫn để người dùng quyết.

---

## 10. Câu hỏi thường gặp

**Slide không hiện gì?**
Ba nguyên nhân, theo thứ tự hay gặp: (1) khung chứa **cao 0** — deck lấp đầy khung chứ không
tự cao, đặt `height` thật; (2) quên `import "@mvng267/deck-kit/styles.css"`; (3) khung **mất
class `.dk-root`** vì framework gán lại `class` sau khi mount — đó là phạm vi của toàn bộ CSS
deck-kit, mất nó là slide trắng trơn. `position` thì không phải lo: `mountDeck` tự đặt
`relative` nếu khung đang `static`.

**Nhúng vào app Tailwind/shadcn có đụng CSS nhau không?**
Không, từ 0.2.0 — xem [mục 3](#3-nhúng-vào-app-có-sẵn--css-không-đụng-nhau) để biết cơ chế nào
bảo vệ cái gì và 4 dòng tự kiểm khi nghi ngờ. Chú ý theme tối dùng class `.dk-dark`, **không**
phải `.dark`, nên không bật dark-mode của app.

**Chữ trong slide nhỏ/to quá so với máy chiếu?**
Đặt `display.fontScale` (0,6–1,6) — xem [mục 8](#8-theme--tuỳ-biến). Cỡ chữ này **tự chảy sang
`.pptx`**, không phải chỉnh lại lần nữa sau khi xuất.

**Sửa xong mà không thấy lưu?**
Thư viện không tự gọi mạng. Phải nghe sự kiện `save` rồi tự gửi lên server.

**`getDeck()` hay `getPatch()`?**
`getDeck()` khi app tự lưu cả file. `getPatch()` khi backend chỉ nhận phần thay đổi —
gói nhỏ hơn nhiều với deck cả bài.

**Đổi bố cục làm mất ý?**
Không. Dữ liệu chỉ *tạm ẩn* nếu bố cục mới không hiển thị nó; `canConvert()` báo trước
qua `willHide`.

**Ảnh làm file JSON nặng quá?**
Dùng bảng `assets` thay vì nhúng data-URI vào từng slide. Ảnh giáo viên tải lên đã được
nén WebP ≤1400px ngay ở trình duyệt.

**Dùng được ở server-side rendering không?**
`mountDeck` cần DOM nên phải gọi trong `useEffect`/`ngAfterViewInit`. Riêng `renderSections()`
và `deckCss()` là hàm thuần, chạy được ở Node để sinh HTML tĩnh.

---

## Giấy phép

UNLICENSED — dùng nội bộ Edmicro.
