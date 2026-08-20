/**
 * Adapter Angular — standalone component, không phụ thuộc HttpClient.
 *
 * Thư viện KHÔNG tự fetch: app chủ nhận `save`/`requestImage` rồi tự gọi API bằng `HttpClient` của
 * mình. Nhờ vậy dùng được ở dự án Angular bất kỳ, không cần backend Python.
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, } from "@angular/core";
import { mountDeck } from "@mvng267/deck-kit";
import * as i0 from "@angular/core";
export class DeckViewerComponent {
    hostRef;
    deck;
    edit = false;
    theme;
    transition;
    foot;
    /** ms; 0 = tắt tự lưu. */
    autoSaveMs = 1200;
    ready = new EventEmitter();
    change = new EventEmitter();
    save = new EventEmitter();
    slideChange = new EventEmitter();
    /** `dataUrl` = ảnh mới đã nén (WebP ≤1400px); `null` = giáo viên gỡ ảnh. */
    requestImage = new EventEmitter();
    requestRegenImage = new EventEmitter();
    reset = new EventEmitter();
    handle = null;
    /** Truy cập API đầy đủ (goto/undo/getDeck/toHTML…) từ component cha. */
    get api() { return this.handle; }
    ngOnChanges(ch) {
        if (!this.handle) {
            this.mount();
            return;
        }
        // Đổi deck → nạp lại; các thuộc tính còn lại đổi tại chỗ để không mất vị trí slide đang xem
        if (ch["deck"] && !ch["deck"].firstChange)
            this.handle.setDeck(this.deck);
        if (ch["edit"] && !ch["edit"].firstChange)
            this.handle.setEditMode(this.edit);
        if (ch["theme"] && this.theme)
            this.handle.setTheme(this.theme);
        if (ch["transition"] && this.transition)
            this.handle.setTransition(this.transition);
    }
    mount() {
        if (!this.deck)
            return;
        this.handle = mountDeck(this.hostRef.nativeElement, this.deck, {
            edit: this.edit, theme: this.theme, transition: this.transition,
            foot: this.foot, autoSaveMs: this.autoSaveMs,
        });
        this.handle.on("ready", p => this.ready.emit(p));
        this.handle.on("change", p => this.change.emit(p));
        this.handle.on("save", p => this.save.emit(p));
        this.handle.on("slideChange", p => this.slideChange.emit(p));
        this.handle.on("requestImage", p => this.requestImage.emit(p));
        this.handle.on("requestRegenImage", p => this.requestRegenImage.emit(p));
        this.handle.on("reset", () => this.reset.emit());
    }
    /**
     * Báo kết quả THẬT của lượt lưu (`saved` | `error` | `saving` | `dirty`).
     *
     * BẮT BUỘC gọi khi bật `edit`: thư viện không tự gọi mạng nên không biết lưu xong hay
     * hỏng — không báo lại thì thanh trạng thái đứng mãi ở "Đang lưu…".
     */
    setSaveState(state, detail) {
        this.handle?.setSaveState(state, detail);
    }
    ngOnDestroy() { this.handle?.destroy(); this.handle = null; }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DeckViewerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: DeckViewerComponent, isStandalone: true, selector: "edm-deck", inputs: { deck: "deck", edit: "edit", theme: "theme", transition: "transition", foot: "foot", autoSaveMs: "autoSaveMs" }, outputs: { ready: "ready", change: "change", save: "save", slideChange: "slideChange", requestImage: "requestImage", requestRegenImage: "requestRegenImage", reset: "reset" }, viewQueries: [{ propertyName: "hostRef", first: true, predicate: ["host"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `<div #host class="edm-deck-host" style="position:relative;width:100%;height:100%"></div>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DeckViewerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: "edm-deck",
                    standalone: true,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: `<div #host class="edm-deck-host" style="position:relative;width:100%;height:100%"></div>`,
                }]
        }], propDecorators: { hostRef: [{
                type: ViewChild,
                args: ["host", { static: true }]
            }], deck: [{
                type: Input,
                args: [{ required: true }]
            }], edit: [{
                type: Input
            }], theme: [{
                type: Input
            }], transition: [{
                type: Input
            }], foot: [{
                type: Input
            }], autoSaveMs: [{
                type: Input
            }], ready: [{
                type: Output
            }], change: [{
                type: Output
            }], save: [{
                type: Output
            }], slideChange: [{
                type: Output
            }], requestImage: [{
                type: Output
            }], requestRegenImage: [{
                type: Output
            }], reset: [{
                type: Output
            }] } });
export { mountDeck } from "@mvng267/deck-kit";
