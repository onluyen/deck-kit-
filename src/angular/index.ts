/**
 * Adapter Angular — standalone component, không phụ thuộc HttpClient.
 *
 * Thư viện KHÔNG tự fetch: app chủ nhận `save`/`requestImage` rồi tự gọi API bằng `HttpClient` của
 * mình. Nhờ vậy dùng được ở dự án Angular bất kỳ, không cần backend Python.
 */
import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges,
  OnDestroy, Output, SimpleChanges, ViewChild,
} from "@angular/core"
import type { DeckJson, DeckPatch, ThemeKey, TransitionKey } from "../model"
import { mountDeck, type DeckHandle, type SaveState } from "../mount"

@Component({
  selector: "edm-deck",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #host class="edm-deck-host" style="position:relative;width:100%;height:100%"></div>`,
})
export class DeckViewerComponent implements OnChanges, OnDestroy {
  @ViewChild("host", { static: true }) hostRef!: ElementRef<HTMLElement>

  @Input({ required: true }) deck!: DeckJson
  @Input() edit = false
  @Input() theme?: ThemeKey
  @Input() transition?: TransitionKey
  @Input() foot?: string
  /** ms; 0 = tắt tự lưu. */
  @Input() autoSaveMs = 1200

  @Output() ready = new EventEmitter<{ count: number }>()
  @Output() change = new EventEmitter<DeckJson>()
  @Output() save = new EventEmitter<DeckPatch>()
  @Output() slideChange = new EventEmitter<{ index: number; total: number }>()
  /** `dataUrl` = ảnh mới đã nén (WebP ≤1400px); `null` = giáo viên gỡ ảnh. */
  @Output() requestImage = new EventEmitter<{ index: number; dataUrl: string | null }>()
  @Output() requestRegenImage = new EventEmitter<{ index: number; prompt?: string }>()
  @Output() reset = new EventEmitter<void>()

  private handle: DeckHandle | null = null

  /** Truy cập API đầy đủ (goto/undo/getDeck/toHTML…) từ component cha. */
  get api(): DeckHandle | null { return this.handle }

  ngOnChanges(ch: SimpleChanges): void {
    if (!this.handle) { this.mount(); return }
    // Đổi deck → nạp lại; các thuộc tính còn lại đổi tại chỗ để không mất vị trí slide đang xem
    if (ch["deck"] && !ch["deck"].firstChange) this.handle.setDeck(this.deck)
    if (ch["edit"] && !ch["edit"].firstChange) this.handle.setEditMode(this.edit)
    if (ch["theme"] && this.theme) this.handle.setTheme(this.theme)
    if (ch["transition"] && this.transition) this.handle.setTransition(this.transition)
  }

  private mount(): void {
    if (!this.deck) return
    this.handle = mountDeck(this.hostRef.nativeElement, this.deck, {
      edit: this.edit, theme: this.theme, transition: this.transition,
      foot: this.foot, autoSaveMs: this.autoSaveMs,
    })
    this.handle.on("ready", p => this.ready.emit(p))
    this.handle.on("change", p => this.change.emit(p))
    this.handle.on("save", p => this.save.emit(p))
    this.handle.on("slideChange", p => this.slideChange.emit(p))
    this.handle.on("requestImage", p => this.requestImage.emit(p))
    this.handle.on("requestRegenImage", p => this.requestRegenImage.emit(p))
    this.handle.on("reset", () => this.reset.emit())
  }

  /**
   * Báo kết quả THẬT của lượt lưu (`saved` | `error` | `saving` | `dirty`).
   *
   * BẮT BUỘC gọi khi bật `edit`: thư viện không tự gọi mạng nên không biết lưu xong hay
   * hỏng — không báo lại thì thanh trạng thái đứng mãi ở "Đang lưu…".
   */
  setSaveState(state: SaveState, detail?: string): void {
    this.handle?.setSaveState(state, detail)
  }

  ngOnDestroy(): void { this.handle?.destroy(); this.handle = null }
}

export { mountDeck } from "../mount"
export type { DeckHandle, MountOpts, SaveState } from "../mount"
export type { DeckJson, DeckPatch, DeckSlide } from "../model"
