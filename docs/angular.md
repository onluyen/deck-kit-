# Dùng deck-kit trong Angular

Thư viện là TypeScript thuần, **không phụ thuộc React**. Bản Angular là một standalone
component bọc quanh `mountDeck`, dùng được từ Angular 17 trở lên.

Cài đặt: xem [`install.md`](./install.md). Trang này chỉ nói phần Angular.

---

> **Cần `@mvng267/deck-kit` ≥ 0.3.3.** Bản trước đó build bằng tsup nên **thiếu `ɵcmp`**, và
> Angular từ chối với `NG2012: Component imports must be standalone components…` dù bạn viết
> đúng. Từ 0.3.3 gói được biên dịch bằng `ngc` ở chế độ **partial Ivy** — một bản chạy được cho
> Angular 17 → 19+.
>
> Kẹt ở bản cũ mà chưa nâng được? Bỏ `DeckViewerComponent`, gọi thẳng `mountDeck` — xem
> [mục 7](#7-không-muốn-dùng-component). Không mất gì: component bên trong cũng chỉ gọi đúng
> hàm đó.

## 1. Nạp CSS

Thêm vào `angular.json` (mục `projects.<tên>.architect.build.options.styles`):

```json
"styles": [
  "src/styles.css",
  "node_modules/@mvng267/deck-kit/dist/styles.css"
]
```

Không nạp CSS thì slide vẫn dựng nhưng **không có kiểu dáng** — chữ đen trên nền trắng,
xếp chồng lên nhau.

---

## 2. Xem slide (không sửa)

```ts
import { Component } from "@angular/core"
import { DeckViewerComponent } from "@mvng267/deck-kit/angular"
import type { DeckJson } from "@mvng267/deck-kit"

@Component({
  standalone: true,
  imports: [DeckViewerComponent],
  template: `<edm-deck [deck]="deck" [theme]="'navy-gold'"></edm-deck>`,
  // Khung phải CÓ CHIỀU CAO — slide dùng position:absolute nên khung cao 0 là không thấy gì.
  styles: [`:host { display: block; height: 100vh }`],
})
export class DeckPage {
  deck: DeckJson = { version: 1, title: "Bài 1", slides: [/* … */] }
}
```

> **Bẫy hay gặp nhất:** quên cho khung chiều cao. `<edm-deck>` lấp đầy khung cha; cha cao 0
> thì slide "biến mất" dù không có lỗi nào.

---

## 3. Cho sửa slide

```ts
import { Component, ViewChild } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { DeckViewerComponent } from "@mvng267/deck-kit/angular"
import type { DeckJson, DeckPatch } from "@mvng267/deck-kit"

@Component({
  standalone: true,
  imports: [DeckViewerComponent],
  template: `
    <edm-deck [deck]="deck" [edit]="true" [autoSaveMs]="1200"
              (save)="onSave($event)"
              (reset)="onReset()"
              (slideChange)="pos = $event"
              (requestImage)="onImage($event)"
              (requestRegenImage)="onRegen($event)"></edm-deck>`,
  styles: [`:host { display: block; height: 100vh }`],
})
export class DeckEditPage {
  @ViewChild(DeckViewerComponent) view!: DeckViewerComponent
  deck!: DeckJson
  pos = { index: 0, total: 0 }

  constructor(private http: HttpClient) {}

  /** ⚠️ BẮT BUỘC khi bật `edit` — xem mục 5 README. */
  onSave(patch: DeckPatch) {
    this.view.setSaveState("saving")
    this.http.put("/api/decks/1", patch).subscribe({
      next: () => this.view.setSaveState("saved"),
      error: e => this.view.setSaveState("error", e?.message || "mất kết nối"),
    })
  }

  onReset() {
    this.http.post("/api/decks/1/reset", {}).subscribe(() => location.reload())
  }

  /** `dataUrl` = ảnh mới đã nén sẵn (WebP ≤ 1400px) · `null` = giáo viên gỡ ảnh. */
  onImage(e: { index: number; dataUrl: string | null }) {
    const url = `/api/decks/1/slides/${e.index}/image`
    if (e.dataUrl) this.http.put(url, { data: e.dataUrl }).subscribe()
    else this.http.delete(url).subscribe()
  }

  onRegen(e: { index: number; prompt?: string }) {
    this.http.post(`/api/decks/1/slides/${e.index}/regen`, { prompt: e.prompt }).subscribe()
  }
}
```

---

## 4. `setSaveState` — bắt buộc, không phải tuỳ chọn

Thư viện **không tự gọi mạng**: nó phát sự kiện `save` rồi chờ bạn báo lại. Không báo thì
thanh trạng thái **đứng mãi ở "Đang lưu…"** — giáo viên tưởng đã lưu, gõ tiếp rồi mất trắng
khi máy chủ thật ra đã lỗi.

| Gọi | Thanh trạng thái hiện |
|---|---|
| `setSaveState("saving")` | *Đang lưu…* |
| `setSaveState("saved")` | *Đã lưu HH:MM* |
| `setSaveState("error", "mất kết nối")` | *LƯU HỎNG — mất kết nối* (nền đỏ) |
| `setSaveState("dirty")` | *Có thay đổi chưa lưu* |

Đây là thiết kế có chủ đích: thư viện thà **không biết** còn hơn **nói dối**.

---

## 5. Tham chiếu `<edm-deck>`

### Input

| Input | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `deck` | `DeckJson` | — | **Bắt buộc.** Dữ liệu slide |
| `edit` | `boolean` | `false` | Bật trình sửa (thanh công cụ + thumbnail) |
| `theme` | `ThemeKey` | `navy-gold` | 1 trong 12 theme |
| `transition` | `TransitionKey` | `fade` | Hiệu ứng chuyển slide |
| `foot` | `string` | `""` | Chân trang mặc định |
| `autoSaveMs` | `number` | `1200` | Chờ bao lâu sau khi ngừng gõ thì phát `save`. **`0` = tắt tự lưu** |

Đổi `deck` hay `theme` là component tự dựng lại (`ngOnChanges`) — không cần gọi gì thêm.

### Output

| Output | Payload | Khi nào |
|---|---|---|
| `ready` | `{count}` | Dựng xong lần đầu |
| `change` | `DeckJson` | Nội dung đổi (mọi thao tác sửa) |
| `save` | `DeckPatch` | Tới lúc lưu — **phải gọi `setSaveState` sau đó** |
| `slideChange` | `{index, total}` | Chuyển slide |
| `requestImage` | `{index, dataUrl\|null}` | Giáo viên chọn/gỡ ảnh |
| `requestRegenImage` | `{index, prompt?}` | Bấm "Vẽ lại ảnh" |
| `reset` | — | Bấm "Đặt lại về bản gốc" |

### Truy cập API đầy đủ

```ts
this.view.api?.goto(3)          // nhảy tới slide
this.view.api?.undo()           // hoàn tác
const deck = this.view.api?.getDeck()
const html = this.view.api?.toHTML()   // xuất HTML độc lập
```

`api` trả `null` trước khi component dựng xong — luôn dùng `?.`.

---

## 6. Bẫy riêng của Angular

**Đừng bọc `deck` trong signal rồi gán lại mỗi lần render.** `ngOnChanges` so sánh tham
chiếu; gán object mới mỗi chu kỳ khiến deck dựng lại liên tục, mất cả vị trí slide đang xem
lẫn con trỏ đang gõ.

**Zone.js:** thư viện gắn listener bằng DOM thuần nên callback chạy **ngoài** Angular zone.
Nếu view không cập nhật sau `(save)`/`(slideChange)`, bọc lại:

```ts
constructor(private zone: NgZone) {}
onSave(patch: DeckPatch) { this.zone.run(() => { /* … */ }) }
```

**SSR / Angular Universal:** component đụng `document` khi mount. Chạy SSR thì hoãn tới
trình duyệt:

```ts
if (isPlatformBrowser(this.platformId)) { /* dựng deck */ }
```

**`ViewEncapsulation` không cứu được deck-kit, và cũng không cần.** CSS deck-kit nạp toàn cục
(`styles.css`), không đi qua encapsulation của Angular. Từ **v1.2.0** nó tự giới hạn trong
`.dk-root` nên không rò ra app — nhưng cũng vì thế **đừng gán lại `[class]`/`[ngClass]` cho
phần tử chứa deck sau khi mount**: mất `.dk-root` là slide ra trắng trơn.

**Lỗi `Standard Angular field decorators are not supported in JIT mode`** khi import
`/angular` bằng Node thuần là **bình thường** — bản Angular phải qua trình biên dịch Angular,
không chạy trực tiếp bằng `node`.

---

## 6b. Gặp lỗi thì tra ở đây

| Lỗi / triệu chứng | Vì sao | Sửa |
|---|---|---|
| **`NG2012: Component imports must be standalone components, directives, pipes, or must be NgModules`** | Gói **< 0.3.3** build bằng tsup nên `DeckViewerComponent` **thiếu `ɵcmp`** — Angular không nhận ra nó là standalone | Nâng lên **≥ 0.3.3**. Chưa nâng được thì bỏ component, gọi thẳng `mountDeck` ([mục 7](#7-không-muốn-dùng-component)) |
| `Cannot find module '@mvng267/deck-kit/angular'` | Thiếu `.npmrc` hoặc token không có `read:packages` | Xem [`install.md` mục 5](./install.md) |
| Slide dựng ra nhưng **không có kiểu dáng** | Quên nạp `styles.css` | Thêm vào `angular.json` — [mục 1](#1-nạp-css) |
| **Không thấy gì cả**, khung trống trơn | Khung chứa **cao 0** — slide dùng `position:absolute` nên không tự đẩy chiều cao | `:host { display: block; height: 100vh }` hoặc chiều cao cụ thể |
| Slide ra **trắng trơn**, mất nền và màu | Khung mất class `.dk-root` (bị `[class]`/`[ngClass]` gán đè sau khi mount) | Đừng gán lại `class` cho phần tử chứa deck |
| Deck **dựng lại liên tục**, mất chỗ đang gõ | `deck` là object mới mỗi chu kỳ render | Giữ tham chiếu ổn định — [mục 6](#6-bẫy-riêng-của-angular) |
| View **không cập nhật** sau `(save)` / `(slideChange)` | Callback chạy ngoài Angular zone | Bọc `NgZone.run()` — [mục 6](#6-bẫy-riêng-của-angular) |
| Thanh trạng thái kẹt ở *"Đang lưu…"* | Quên gọi `setSaveState` | [Mục 4](#4-setsavestate--bắt-buộc-không-phải-tuỳ-chọn) — **bắt buộc** khi bật `edit` |
| Lỗi `document is not defined` khi SSR | Component đụng DOM lúc mount | Hoãn tới trình duyệt — [mục 6](#6-bẫy-riêng-của-angular) |
| Hai bộ slide đè nhau / CSS chèn hai lần | Nạp **hai bản** thư viện (gói < 0.3.3 có lỗi này) | Nâng ≥ 0.3.3; kiểm `npm ls @mvng267/deck-kit` chỉ ra **một** bản |

> **Vì sao `NG2012` từng xảy ra dù bạn viết đúng.** Gói build bằng `tsup`/esbuild — nó chỉ *bóc*
> decorator (`__decorateElement`) chứ **không sinh `ɵcmp`**, thứ Angular dùng để nhận ra
> standalone component. Từ **0.3.3** bản Angular được biên dịch bằng `ngc` ở chế độ
> **partial Ivy** (`ɵɵngDeclareComponent`), để app chủ dịch nốt sang Ivy đúng phiên bản Angular
> **của bạn** — nên một bản gói chạy được cho Angular 17 → 19+.
>
> Repo có cổng `ng-consumer-test` **biên dịch thử một app Angular tiêu dùng** ở mỗi lần build,
> nên lỗi này không quay lại âm thầm được nữa.

---

## 7. Không muốn dùng component?

`mountDeck` là JS thuần, gắn vào `ElementRef` nào cũng được:

```ts
import { mountDeck, type DeckHandle, type DeckPatch } from "@mvng267/deck-kit"

export class MyDeck implements AfterViewInit, OnDestroy {
  @ViewChild("host") host!: ElementRef<HTMLElement>
  private handle?: DeckHandle
  private off: Array<() => void> = []

  ngAfterViewInit() {
    // `mountDeck` KHÔNG nhận callback qua tham số — đăng ký bằng `on()`.
    this.handle = mountDeck(this.host.nativeElement, this.deck, { edit: true, autoSaveMs: 1200 })
    this.off.push(this.handle.on("save", (patch: DeckPatch) => {
      this.handle!.setSaveState("saving")
      this.http.put("/api/decks/1", patch).subscribe({
        next: () => this.handle!.setSaveState("saved"),
        error: e => this.handle!.setSaveState("error", e?.message || "mất kết nối"),
      })
    }))
  }

  ngOnDestroy() {
    this.off.forEach(f => f())     // `on()` trả về hàm GỠ đăng ký
    this.handle?.destroy()
  }
}
```

`on(ev, fn)` nhận: `ready` · `change` · `save` · `slideChange` · `requestImage` ·
`requestRegenImage` · `reset` — cùng bộ với output của `<edm-deck>`, và trả về hàm gỡ đăng ký.

Nhớ gọi `destroy()` — nếu không, listener và `ResizeObserver` còn treo lại sau khi rời trang.
