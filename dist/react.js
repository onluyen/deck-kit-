import {
  mountDeck
} from "./chunk-C5HXJCH5.js";

// src/react/index.tsx
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { jsx } from "react/jsx-runtime";
var DeckView = forwardRef(function DeckView2(props, ref) {
  const hostRef = useRef(null);
  const handleRef = useRef(null);
  const cb = useRef(props);
  cb.current = props;
  useEffect(() => {
    if (!hostRef.current) return;
    const h = mountDeck(hostRef.current, props.deck, {
      edit: props.edit,
      theme: props.theme,
      transition: props.transition,
      foot: props.foot,
      autoSaveMs: props.autoSaveMs,
      keyboard: props.keyboard
    });
    handleRef.current = h;
    h.on("ready", (p) => cb.current.onReady?.(p));
    h.on("change", (p) => cb.current.onChange?.(p));
    h.on("save", (p) => cb.current.onSave?.(p));
    h.on("slideChange", (p) => cb.current.onSlideChange?.(p));
    h.on("requestImage", (p) => cb.current.onRequestImage?.(p));
    h.on("requestRegenImage", (p) => cb.current.onRequestRegenImage?.(p));
    h.on("reset", () => cb.current.onReset?.());
    return () => {
      h.destroy();
      handleRef.current = null;
    };
  }, [props.deck]);
  useEffect(() => {
    handleRef.current?.setEditMode(!!props.edit);
  }, [props.edit]);
  useEffect(() => {
    if (props.theme) handleRef.current?.setTheme(props.theme);
  }, [props.theme]);
  useEffect(() => {
    if (props.transition) handleRef.current?.setTransition(props.transition);
  }, [props.transition]);
  useImperativeHandle(ref, () => handleRef.current);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: hostRef,
      className: props.className,
      style: { position: "relative", width: "100%", height: "100%", ...props.style }
    }
  );
});
export {
  DeckView,
  mountDeck
};
//# sourceMappingURL=react.js.map