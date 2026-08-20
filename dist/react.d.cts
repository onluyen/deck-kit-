import * as react from 'react';
import { D as DeckJson, T as ThemeKey, a as TransitionKey, b as DeckPatch, c as DeckHandle } from './mount-B7SXSqQI.cjs';
export { d as DeckSlide, M as MountOpts, m as mountDeck } from './mount-B7SXSqQI.cjs';

type DeckViewProps = {
    deck: DeckJson;
    edit?: boolean;
    theme?: ThemeKey;
    transition?: TransitionKey;
    foot?: string;
    autoSaveMs?: number;
    keyboard?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onReady?: (p: {
        count: number;
    }) => void;
    onChange?: (d: DeckJson) => void;
    onSave?: (p: DeckPatch) => void;
    onSlideChange?: (p: {
        index: number;
        total: number;
    }) => void;
    /** `dataUrl` = ảnh mới đã nén (WebP ≤1400px); `null` = giáo viên gỡ ảnh. */
    onRequestImage?: (p: {
        index: number;
        dataUrl: string | null;
    }) => void;
    onRequestRegenImage?: (p: {
        index: number;
        prompt?: string;
    }) => void;
    onReset?: () => void;
};
declare const DeckView: react.ForwardRefExoticComponent<DeckViewProps & react.RefAttributes<DeckHandle | null>>;

export { DeckHandle, DeckJson, DeckPatch, DeckView, type DeckViewProps };
