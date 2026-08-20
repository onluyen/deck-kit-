# Hướng dẫn cài đặt `@mvng267/deck-kit`

Thư viện xem + sửa slide bài giảng, chạy thuần trình duyệt. **Không cần backend.**

- **Zero dependency** — không kéo theo gói nào. `react` / `@angular/core` chỉ là
  *peer dependency* **tuỳ chọn**: dùng JS thuần thì không cần cài gì thêm.
- Đóng gói sẵn cả ESM, CommonJS, và bản `<script>` cho trang HTML tĩnh.

---

## 0. Trước khi bắt đầu — gói này KHÔNG công khai

Gói nằm trên **GitHub Packages**, quyền gắn theo repo `mvng267/edmicro-tools`:

| Bạn được cấp | Cài được? |
|---|---|
| *(không có quyền repo)* | ✗ `npm install` trả **404**, kể cả biết đúng tên gói |
| Repo **Read** | ✓ cài được |
| Repo **Write** | ✓ cài + đăng bản mới |

> ⚠️ **GitHub Packages KHÔNG cho tải ẩn danh — kể cả với gói công khai.**
> Máy nào cũng phải có token, thiếu là `401` hoặc `404`. Đây là chỗ vấp nhiều nhất.

Chưa có quyền repo thì xin admin cấp trước, mọi bước dưới đây sẽ vô ích.

---

## 1. Tạo Personal Access Token

1. Vào **GitHub → Settings → Developer settings → Personal access tokens →
   Tokens (classic)** — hoặc mở thẳng <https://github.com/settings/tokens>
2. Bấm **Generate new token (classic)**
3. Đặt tên gợi nhớ (vd `deck-kit máy làm việc`), chọn hạn dùng
4. Tick quyền:

| Việc bạn cần làm | Quyền tick |
|---|---|
| Chỉ cài gói | `read:packages` |
| Cài + đăng bản mới | `write:packages` *(tự kéo theo `read:packages`)* |

5. Bấm **Generate token** và **copy ngay** — rời trang là không xem lại được nữa.

> **Mỗi người tự tạo token riêng.** Đừng dùng chung một token cho cả nhóm: lúc cần thu hồi
> (lộ token, người nghỉ việc) là cắt luôn quyền của mọi người.
>
> **Đừng dán token vào chat, issue, hay commit.** Lỡ dán thì coi như đã lộ — vào
> <https://github.com/settings/tokens> xoá và tạo cái mới.

---

## 2. Cấu hình npm

Tạo file `.npmrc` ở **gốc dự án** (cạnh `package.json`):

```ini
@mvng267:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Hai dòng làm hai việc khác nhau — thiếu dòng nào cũng hỏng:
- Dòng 1: gói `@mvng267/*` lấy từ GitHub, phần còn lại vẫn từ npm công cộng
- Dòng 2: gửi token khi gọi GitHub Packages

**Viết `${GITHUB_TOKEN}` đúng như vậy, đừng thay bằng token thật.** npm tự đọc từ biến môi
trường lúc chạy, nhờ đó `.npmrc` commit lên git được mà không lộ gì.

Đặt token vào biến môi trường:

```bash
# Linux / macOS — thêm vào ~/.bashrc hoặc ~/.zshrc cho lần sau khỏi gõ lại
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

```powershell
# Windows PowerShell
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxx"
```

---

## 3. Cài

```bash
npm install @mvng267/deck-kit
```

Kiểm tra cài được:

```bash
node -e "import('@mvng267/deck-kit').then(m => console.log('OK ·', m.LAYOUTS.length, 'bố cục'))"
# OK · 46 bố cục
```

---

## 4. Dùng

### 4.1. JavaScript thuần (không framework)

```js
import { mountDeck } from "@mvng267/deck-kit"
import "@mvng267/deck-kit/styles.css"

const handle = mountDeck(document.getElementById("app"), deckJson)
```

`deckJson` là object `{version, title, theme, slides:[…]}` — xem
[`slide-schema.md`](./slide-schema.md) và [`examples/minimal.json`](../examples/minimal.json).

### 4.2. Trang HTML tĩnh (không build tool)

```html
<link rel="stylesheet" href="node_modules/@mvng267/deck-kit/dist/styles.css">
<div id="app"></div>
<script src="node_modules/@mvng267/deck-kit/dist/deck-kit.global.js"></script>
<script>
  DeckKit.mountDeck(document.getElementById("app"), { /* deck JSON */ })
</script>
```

### 4.3. React / Next.js

```tsx
"use client"
import { DeckView } from "@mvng267/deck-kit/react"
import "@mvng267/deck-kit/styles.css"

export default function Page() {
  return <DeckView deck={deckJson} edit onSave={patch => api.save(patch)} />
}
```

Props: `deck` (bắt buộc) · `edit` · `theme` · `transition` · `foot` · `className` ·
`onChange` · `onSave`.

### 4.4. Angular (standalone)

```ts
import { DeckViewerComponent } from "@mvng267/deck-kit/angular"

@Component({
  standalone: true,
  imports: [DeckViewerComponent],
  template: `<edm-deck [deck]="deck" [edit]="true" (save)="onSave($event)"></edm-deck>`,
})
export class SlidePage { deck = deckJson }
```

Input: `deck` · `edit` · `theme` · `transition` · `foot`. Output: `change` · `save`.

Thêm CSS vào `angular.json`:

```json
"styles": ["node_modules/@mvng267/deck-kit/dist/styles.css"]
```

### ⚠️ Bật `edit` thì BẮT BUỘC gọi `setSaveState`

Thư viện **không tự gọi mạng**. Bật sửa mà không báo lại kết quả lưu thì thanh trạng thái
đứng mãi ở *"Đang lưu…"* — giáo viên tưởng đã lưu, gõ tiếp rồi mất trắng.

```js
const handle = mountDeck(el, deck, {
  edit: true,
  onSave: async patch => {
    try {
      await api.save(patch)
      handle.setSaveState("saved")                      // ✓ máy chủ xác nhận
    } catch (e) {
      handle.setSaveState("error", e.message)           // ✗ nói rõ lý do
    }
  },
})
```

Bản React/Angular đã lo sẵn phần này qua `onSave`/`(save)`.

---

## 5. Gặp lỗi

| Thông báo | Nguyên nhân | Cách sửa |
|---|---|---|
| `401 Unauthorized` | Thiếu `_authToken`, token sai hoặc hết hạn | Kiểm `echo $GITHUB_TOKEN` có giá trị không; token hết hạn thì tạo mới |
| `404 Not Found` | Thiếu dòng `@mvng267:registry`, **hoặc token không có `read:packages`**, **hoặc bạn chưa được cấp quyền repo** | Xem lại `.npmrc` đủ 2 dòng; kiểm quyền token; hỏi admin về quyền repo |
| `E403 Forbidden` khi publish | Token thiếu `write:packages`, hoặc scope tên gói không khớp chủ repo | Tạo token có `write:packages` |
| `ERR_MODULE_NOT_FOUND` cho `@angular/core` / `react` | Import nhầm bản wrapper | Dùng JS thuần thì import `@mvng267/deck-kit`, **không** phải `/react` hay `/angular` |
| Slide hiện ra nhưng **không có kiểu dáng** | Quên nạp CSS | Thêm `import "@mvng267/deck-kit/styles.css"` |
| Slide **trắng trơn** dù CSS đã nạp | Khung chứa mất class `.dk-root` (bị framework ghi đè `class`) | Đừng gán lại `class` cho khung sau khi mount — `.dk-root` là phạm vi của toàn bộ CSS deck-kit |
| Slide **cao 0px / không thấy gì** | Khung chứa không có chiều cao | `<div style="height:100vh">` — deck lấp đầy khung, không tự cao |
| **Trang app mất scroll** sau khi mở deck | Bản < 0.2.0 khai `html,body{overflow:hidden}` | Nâng lên ≥ 0.2.0 |
| **Chữ đậm của app đổi màu** | Bản < 0.2.0 khai `b,strong{}` toàn cục | Nâng lên ≥ 0.2.0 |
| Chọn **theme tối** làm cả app sang dark-mode | Bản < 0.2.0 dùng class `.dark` — trùng trigger dark-mode của Tailwind/shadcn | Nâng lên ≥ 0.2.0 (đã đổi thành `.dk-dark`) |
| Nút **B / I / x² / x₂** bấm không ăn | Khung sửa chưa focus, hoặc nút tự viết dùng `click` thay `mousedown` | `click` cướp focus làm mất vùng bôi đen — xem mục 5 README |
| Thanh trạng thái kẹt ở *"Đang lưu…"* | Quên gọi `setSaveState` | Xem cảnh báo cuối mục 5 README |
| `Standard Angular field decorators are not supported in JIT mode` | Import `/angular` bằng Node thuần | Bình thường — bản Angular phải chạy qua trình biên dịch Angular |
| `TS2307: Cannot find module '@mvng267/deck-kit/react'` (hoặc `/angular`) — kèm dòng *"There are types at …, but this result could not be resolved"* | Bản < 0.5.0 chỉ chạy được với `"moduleResolution": "bundler"` | Nâng lên ≥ 0.5.0 — đã hỗ trợ cả `node` · `node16` · `nodenext` · `bundler`, không phải đổi tsconfig nữa |
| `TS1479: … referenced file is an ECMAScript module and cannot be imported with 'require'` khi import **`/angular`** từ file CommonJS | Bản Angular chỉ có ESM — bản CJS do tsup dựng bị vặt mất metadata Ivy (`ɵcmp`), dùng vào là dính `NG2012` | Import động: `await import("@mvng267/deck-kit/angular")`, hoặc để file đó thành ESM. Riêng `.` và `/react` thì `require` bình thường |

Cách soi nhanh xem token có đúng quyền không:

```bash
npm view @mvng267/deck-kit version
# ra số version = token OK · 401/404 = xem bảng trên
```

---

## 6. Cập nhật

```bash
npm update @mvng267/deck-kit
```

---

## 7. Đăng bản mới *(chỉ người có quyền Write)*

```bash
npm version patch -w @mvng267/deck-kit   # 0.3.0 → 0.3.1
npm run build -w @mvng267/deck-kit       # BẮT BUỘC
npm publish -w @mvng267/deck-kit
```

**Không được bỏ bước build.** Trường `files` chỉ đóng gói `dist/`, nên quên dựng là npm vẫn
publish **bình thường** ra một gói rỗng, không báo lỗi gì — mà npm **không cho publish đè
cùng số version**, nên phải bỏ luôn version đó.

`prepublishOnly` đã cài sẵn chốt chặn ([`scripts/check-dist.mjs`](../scripts/check-dist.mjs))
bắt 3 ca: thiếu file trong `dist/`, file rỗng/cụt, và `src/` mới hơn `dist/` (sửa code mà
quên dựng lại).

> **Riêng repo `edmicro-tools`:** backend đọc thẳng file trong `packages/deck-kit/dist/`
> nên phải `npm run build -w @mvng267/deck-kit` **trước** `docker compose build backend`.
> Quên thì hỏng lúc chạy chứ không lỗi lúc build — soi bằng cờ `deck_kit_bundle` ở `/health`.

---

## Đọc tiếp

- [README](../README.md) — tham chiếu API đầy đủ, theme, xuất file
- [`slide-schema.md`](./slide-schema.md) — hợp đồng JSON từng bố cục (viết prompt cho LLM)
- [`layouts.md`](./layouts.md) — danh mục 46 bố cục
