/** Adapter React — dùng trong Next của repo này (thay `<iframe>` trong workspace). */
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import type { DeckJson, DeckPatch, ThemeKey, TransitionKey } from "../model"
import { mountDeck, type DeckHandle } from "../mount"

export type DeckViewProps = {
  deck: DeckJson
  edit?: boolean
  theme?: ThemeKey
  transition?: TransitionKey
  foot?: string
  autoSaveMs?: number
  keyboard?: boolean
  className?: string
  style?: React.CSSProperties
  onReady?: (p: { count: number }) => void
  onChange?: (d: DeckJson) => void
  onSave?: (p: DeckPatch) => void
  onSlideChange?: (p: { index: number; total: number }) => void
  /** `dataUrl` = ảnh mới đã nén (WebP ≤1400px); `null` = giáo viên gỡ ảnh. */
  onRequestImage?: (p: { index: number; dataUrl: string | null }) => void
  onRequestRegenImage?: (p: { index: number; prompt?: string }) => void
  onReset?: () => void
}

export const DeckView = forwardRef<DeckHandle | null, DeckViewProps>(function DeckView(props, ref) {
  const hostRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<DeckHandle | null>(null)
  // Callback giữ trong ref: mount lại deck mỗi lần cha render sẽ mất vị trí slide đang xem
  const cb = useRef(props); cb.current = props

  useEffect(() => {
    if (!hostRef.current) return
    const h = mountDeck(hostRef.current, props.deck, {
      edit: props.edit, theme: props.theme, transition: props.transition,
      foot: props.foot, autoSaveMs: props.autoSaveMs, keyboard: props.keyboard,
    })
    handleRef.current = h
    h.on("ready", p => cb.current.onReady?.(p))
    h.on("change", p => cb.current.onChange?.(p))
    h.on("save", p => cb.current.onSave?.(p))
    h.on("slideChange", p => cb.current.onSlideChange?.(p))
    h.on("requestImage", p => cb.current.onRequestImage?.(p))
    h.on("requestRegenImage", p => cb.current.onRequestRegenImage?.(p))
    h.on("reset", () => cb.current.onReset?.())
    return () => { h.destroy(); handleRef.current = null }
    // Chỉ mount lại khi ĐỔI DECK — thêm props khác vào deps sẽ dựng lại DOM
    // và giáo viên mất con trỏ đang gõ dở.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.deck])

  useEffect(() => { handleRef.current?.setEditMode(!!props.edit) }, [props.edit])
  useEffect(() => { if (props.theme) handleRef.current?.setTheme(props.theme) }, [props.theme])
  useEffect(() => { if (props.transition) handleRef.current?.setTransition(props.transition) }, [props.transition])

  // Trả HÀM đọc ref, không phải giá trị chốt lúc render đầu: handle chỉ có sau `useEffect`,
  // chốt sớm thì cha luôn nhận `null`.
  useImperativeHandle(ref, () => handleRef.current as DeckHandle)

  return <div ref={hostRef} className={props.className}
    style={{ position: "relative", width: "100%", height: "100%", ...props.style }} />
})

export { mountDeck } from "../mount"
export type { DeckHandle, MountOpts } from "../mount"
export type { DeckJson, DeckPatch, DeckSlide } from "../model"
