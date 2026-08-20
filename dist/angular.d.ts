/**
 * Adapter Angular — standalone component, không phụ thuộc HttpClient.
 *
 * Thư viện KHÔNG tự fetch: app chủ nhận `save`/`requestImage` rồi tự gọi API bằng `HttpClient` của
 * mình. Nhờ vậy dùng được ở dự án Angular bất kỳ, không cần backend Python.
 */
import { ElementRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import type { DeckJson, DeckPatch, ThemeKey, TransitionKey } from "@mvng267/deck-kit";
import { type DeckHandle, type SaveState } from "@mvng267/deck-kit";
import * as i0 from "@angular/core";
export declare class DeckViewerComponent implements OnChanges, OnDestroy {
    hostRef: ElementRef<HTMLElement>;
    deck: DeckJson;
    edit: boolean;
    theme?: ThemeKey;
    transition?: TransitionKey;
    foot?: string;
    /** ms; 0 = tắt tự lưu. */
    autoSaveMs: number;
    ready: EventEmitter<{
        count: number;
    }>;
    change: EventEmitter<DeckJson>;
    save: EventEmitter<DeckPatch>;
    slideChange: EventEmitter<{
        index: number;
        total: number;
    }>;
    /** `dataUrl` = ảnh mới đã nén (WebP ≤1400px); `null` = giáo viên gỡ ảnh. */
    requestImage: EventEmitter<{
        index: number;
        dataUrl: string | null;
    }>;
    requestRegenImage: EventEmitter<{
        index: number;
        prompt?: string | undefined;
    }>;
    reset: EventEmitter<void>;
    private handle;
    /** Truy cập API đầy đủ (goto/undo/getDeck/toHTML…) từ component cha. */
    get api(): DeckHandle | null;
    ngOnChanges(ch: SimpleChanges): void;
    private mount;
    /**
     * Báo kết quả THẬT của lượt lưu (`saved` | `error` | `saving` | `dirty`).
     *
     * BẮT BUỘC gọi khi bật `edit`: thư viện không tự gọi mạng nên không biết lưu xong hay
     * hỏng — không báo lại thì thanh trạng thái đứng mãi ở "Đang lưu…".
     */
    setSaveState(state: SaveState, detail?: string): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DeckViewerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DeckViewerComponent, "edm-deck", never, { "deck": { "alias": "deck"; "required": true; }; "edit": { "alias": "edit"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "transition": { "alias": "transition"; "required": false; }; "foot": { "alias": "foot"; "required": false; }; "autoSaveMs": { "alias": "autoSaveMs"; "required": false; }; }, { "ready": "ready"; "change": "change"; "save": "save"; "slideChange": "slideChange"; "requestImage": "requestImage"; "requestRegenImage": "requestRegenImage"; "reset": "reset"; }, never, never, true, never>;
}
export { mountDeck } from "@mvng267/deck-kit";
export type { DeckHandle, MountOpts, SaveState } from "@mvng267/deck-kit";
export type { DeckJson, DeckPatch, DeckSlide } from "@mvng267/deck-kit";
