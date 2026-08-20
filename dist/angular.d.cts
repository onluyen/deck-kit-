import { OnChanges, OnDestroy, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { D as DeckJson, T as ThemeKey, a as TransitionKey, b as DeckPatch, c as DeckHandle, S as SaveState } from './mount-B7SXSqQI.cjs';
export { d as DeckSlide, M as MountOpts, m as mountDeck } from './mount-B7SXSqQI.cjs';

/**
 * Adapter Angular — standalone component, không phụ thuộc HttpClient.
 *
 * Thư viện KHÔNG tự fetch: app chủ nhận `save`/`requestImage` rồi tự gọi API bằng `HttpClient` của
 * mình. Nhờ vậy dùng được ở dự án Angular bất kỳ, không cần backend Python.
 */

declare class DeckViewerComponent implements OnChanges, OnDestroy {
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
}

export { DeckHandle, DeckJson, DeckPatch, DeckViewerComponent, SaveState };
