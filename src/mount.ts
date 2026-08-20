/**
 * `mountDeck(el, deck, opts)` — API chính của thư viện.
 *
 * Thư viện KHÔNG tự gọi mạng: mọi việc cần server (sinh ảnh AI, lưu) đều bắn sự kiện ra cho app chủ
 * tự quyết. Đó là điều kiện để Angular dùng được mà không cần backend Python nào.
 */
import type { DeckDisplay, DeckJson, DeckPatch, DeckSlide, ThemeKey, TransitionKey } from "./model"
import { normalizeDeck } from "./model"
import { deckCss, renderSections, renderStage } from "./render"
import { attachPlayer, type Player } from "./player"
import { applyTheme, DEFAULT_THEME, THEME_BY_KEY } from "./themes"
import { canConvert, convert } from "./layouts/convert"
import { esc } from "./util/html"
import { buildRail, railSetActive } from "./editor/rail"
import { buildToolbar, closePop } from "./editor/toolbar"
import { collect as collectEdits } from "./editor/collect"
import {
  colsToBul, newEditorState, newSlideHTML, readBul, readCols, toCols,
  type EditorState,
} from "./editor"

export type DeckEvent =
  | "ready" | "change" | "save" | "slideChange" | "requestImage" | "requestRegenImage" | "reset"

export type MountOpts = {
  edit?: boolean
  theme?: ThemeKey
  transition?: TransitionKey
  foot?: string
  /** Tự phát `save` sau khi ngừng sửa (ms). 0 = tắt. Mặc định 1200. */
  autoSaveMs?: number
  keyboard?: boolean
}

export type DeckHandle = {
  goto(i: number): void
  next(): void
  prev(): void
  current(): number
  count(): number
  present(on: boolean): void
  fit(): void
  setEditMode(on: boolean): void
  setTheme(k: ThemeKey): void
  setTransition(k: TransitionKey): void
  undo(): void
  redo(): void
  getDeck(): DeckJson
  getPatch(): DeckPatch
  setDeck(d: DeckJson): void
  /** Đổi bố cục slide đang chọn (tự chuyển dạng dữ liệu theo ma trận). */
  setKind(idx: number, kind: string): boolean
  canSetKind(idx: number, kind: string): ReturnType<typeof canConvert>
  toHTML(): string
  /**
   * Báo KẾT QUẢ THẬT của lượt lưu lên thanh trạng thái.
   *
   * Thư viện không tự gọi mạng nên không biết lưu thành công hay không — nếu tự hiện
   * "Đã lưu" ngay lúc bắn sự kiện thì đó là NÓI DỐI khi request hỏng. App chủ gọi hàm này
   * sau khi biết kết quả.
   */
  setSaveState(state: SaveState, detail?: string): void
  on(ev: DeckEvent, fn: (payload?: any) => void): () => void
  destroy(): void
}

/** `saving` đang gửi · `saved` xong · `error` hỏng (kèm lý do) · `dirty` có thay đổi chưa gửi. */
export type SaveState = "saving" | "saved" | "error" | "dirty"

/** Mật độ lề → `--pad` (giá trị gốc 64px). */
const DENSITY: Record<string, string> = { compact: "48px", normal: "64px", roomy: "80px" }

/**
 * Áp cấu hình hiển thị lên khung deck.
 *
 * KẸP `fontScale` vào [0.6, 1.6]: dữ liệu có thể tới từ JSON người dùng sửa tay hoặc API, và
 * cỡ chữ ×10 làm slide vỡ hoàn toàn mà không có gì chặn (`.body{overflow:hidden}` chỉ cắt chứ
 * không thu nhỏ).
 */
export function applyDisplay(el: HTMLElement, d?: DeckDisplay): void {
  const fs = Number(d?.fontScale)
  el.style.setProperty("--dk-fs", String(Number.isFinite(fs) ? Math.min(1.6, Math.max(0.6, fs)) : 1))
  // `--dk-pad` chứ không phải `--pad`: `.slide` đọc `var(--dk-pad,64px)` nên đặt tên riêng
  // tránh bị chính `.slide{--pad:…}` che mất.
  // Kiểu chữ: ghi đè `--sl-font` mà `applyTheme` vừa đặt (paint() gọi applyTheme TRƯỚC
  // applyDisplay nên thứ tự này đúng). Bỏ trống ⇒ gỡ hẳn thuộc tính để font của theme sống lại,
  // chứ không đặt lại bằng chuỗi rỗng (chuỗi rỗng vẫn là một khai báo và vẫn đè).
  const ff = String(d?.fontFamily || "").trim()
  if (ff) el.style.setProperty("--sl-font", ff)
  else el.style.removeProperty("--sl-font")

  const pad = DENSITY[d?.density || ""]
  if (pad) el.style.setProperty("--dk-pad", pad)
  else el.style.removeProperty("--dk-pad")
}

export function mountDeck(el: HTMLElement, input: DeckJson, opts: MountOpts = {}): DeckHandle {
  let deck = normalizeDeck(input)
  if (opts.theme) deck.theme = opts.theme
  if (opts.transition) deck.transition = opts.transition
  const base = normalizeDeck(JSON.parse(JSON.stringify(input)))   // bản gốc để tính patch
  let edit = !!opts.edit
  const listeners = new Map<DeckEvent, Set<(p?: any) => void>>()
  const undoStack: string[] = []
  const redoStack: string[] = []
  let player: Player | null = null
  let saveTimer: any = null
  let styleEl: HTMLStyleElement | null = null

  // Editor state
  const editorState: EditorState = newEditorState()
  const editorUndoStack: Array<() => void> = []

  // Lỗi trong listener của app chủ KHÔNG được làm chết deck — nhưng nuốt im lặng thì GV ngồi
  // chờ một việc đã hỏng (vd listener `save` ném lỗi ⇒ không có gì được lưu, thanh trạng thái
  // vẫn "Đang lưu…"). Báo qua thanh trạng thái, và CHỈ khi đang sửa: đường xuất .pptx chạy
  // Playwright headless, không ai nhìn thanh đó, thêm log chỉ tổ nhiễu.
  const emit = (ev: DeckEvent, p?: any) =>
    listeners.get(ev)?.forEach(fn => {
      try { fn(p) } catch { if (edit) msg(`⚠ App chủ báo lỗi khi xử lý "${ev}"`, "ed-error") }
    })

  function paint() {
    const keep = player?.cur() ?? 0
    el.innerHTML = renderStage(deck, { edit, foot: opts.foot })
    if (!styleEl) {
      styleEl = document.createElement("style")
      el.prepend(styleEl)
    } else {
      el.prepend(styleEl)
    }
    styleEl.textContent = deckCss(deck, { edit })
    applyTheme(el, deck.theme || DEFAULT_THEME)
    el.classList.toggle("lp-edit", edit)
    // Khung sửa (rail/console/thanh trạng thái) và slide đều `position:absolute` — phần tử
    // chứa BẮT BUỘC phải tạo containing block, không thì chúng neo vào <body> và đè lên
    // giao diện của app chủ. Tự đặt để người dùng vanilla không phải nhớ.
    if (getComputedStyle(el).position === "static") el.style.position = "relative"
    el.style.overflow = el.style.overflow || "hidden"
    // `.dk-root` là PHẠM VI của toàn bộ CSS deck-kit — thiếu nó thì reset và nền không áp,
    // slide ra trắng trơn. Trước đây dùng `html,body{}` nên nó rò ra cả trang chủ nhà.
    el.classList.add("dk-root")
    applyDisplay(el, deck.display)
    player?.destroy()
    player = attachPlayer(el, {
      w: deck.size?.w, h: deck.size?.h, keyboard: opts.keyboard,
      onSlideChange: (i, total) => {
        emit("slideChange", { index: i, total })
        // Chuyển slide KHÔNG đổi nội dung gì — chỉ đổi slide đang chọn và vẽ lại thanh công
        // cụ (nút phụ thuộc bố cục/khoá/ảnh của slide hiện tại).
        //
        // Trước đây gọi thẳng `syncEditor()`, mà nó dựng lại TOÀN BỘ rail: bấm một lần mũi
        // tên trên bài 156 slide là 156 lần clone slide 1280×720. Đó là thứ khiến việc sửa
        // bài dài thành cực hình.
        if (edit) {
          railSetActive(el, i)
          syncToolbar()
        }
      },
    })
    player.show(Math.min(keep, deck.slides.length - 1))

    if (edit) {
      attachEditorHandlers()
      syncEditor()
    }
  }

  function pushUndo() {
    undoStack.push(JSON.stringify(deck))
    if (undoStack.length > 60) undoStack.shift()
    redoStack.length = 0
  }

  function pushEditorUndo(fn: () => void) {
    editorUndoStack.push(fn)
    if (editorUndoStack.length > 80) editorUndoStack.shift()
  }

  /**
   * Hoàn tác MỘT bước sửa — dùng chung cho Ctrl+Z và `handle.undo()`.
   *
   * Phải dùng chung: hai đường này từng đi hai stack khác nhau (`editorUndoStack` closure DOM
   * vs `undoStack` ảnh chụp JSON), nên nút Undo của app chủ và Ctrl+Z làm hai việc khác hẳn.
   * Tệ hơn: `undoStack` chỉ được đẩy ở 4 chỗ API (setTheme/setTransition/setDeck/setKind),
   * KHÔNG thao tác gõ chữ nào đẩy vào — nên `handle.undo()` đổ lại ảnh chụp cũ rồi `paint()`
   * là XOÁ SẠCH chữ GV đang gõ chưa lưu.
   *
   * Trả `false` khi không còn gì để hoàn tác — bên gọi tự lo báo.
   * Lưu ý thứ tự: `syncEditor()` dựng lại thanh công cụ ⇒ `#edmsg` là phần tử MỚI, nên mọi
   * `msg()` phải gọi SAU hàm này, không thì lời nhắc bị xoá ngay khi vừa hiện.
   */
  function undoEditorStep(): boolean {
    const f = editorUndoStack.pop()
    if (!f) return false
    try { f() } catch { /* nút undo hỏng không được làm chết editor */ }
    player?.refresh()
    syncEditor()
    return true
  }

  function changed(repaint = true) {
    if (repaint) paint()
    emit("change", deck)
    if (opts.autoSaveMs !== 0) {
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => emit("save", handle.getPatch()), opts.autoSaveMs ?? 1200)
    }
  }

  function msg(t: string, cls = "") {
    const m = el.querySelector<HTMLElement>("#edmsg")
    if (!m) return
    m.textContent = t
    // GIỮ lớp gốc `dk-status`: gán đè `className` làm mất luôn kiểu nền/cỡ chữ của ô
    // trạng thái, và `.dk-toolbar:has(.ed-error)` cũng không đổi nền cảnh báo được.
    m.className = cls ? `dk-status ${cls}` : "dk-status"
  }

  /** Giờ dạng HH:MM để hiện "Đã lưu 14:32" — GV biết CHÍNH XÁC lần lưu gần nhất. */
  const clock = () =>
    new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })

  /** Lời nhắc của thao tác vừa làm (vd "Đã xoá slide — Ctrl+Z để lấy lại") — giữ lại để hiện
   *  KÈM trạng thái lưu. Thiếu nó thì mọi thao tác bị hẹn-giờ-lưu ghi đè bằng câu chung
   *  chung, giáo viên mất luôn gợi ý hoàn tác. */
  let lastNote = ""

  function scheduleSave(note?: string) {
    clearTimeout(saveTimer)
    lastNote = note || ""
    msg(note || "Có thay đổi chưa lưu…", "ed-dirty")
    saveTimer = setTimeout(() => {
      // "Đang lưu…" chứ KHÔNG phải "Đã lưu": lúc này request còn chưa đi.
      // App chủ gọi `setSaveState("saved"|"error")` khi biết kết quả thật.
      // Ghép kèm `lastNote` để gợi ý Ctrl+Z không bị hẹn-giờ-lưu xoá mất — thao tác
      // phá huỷ (xoá slide) mà mất luôn hướng dẫn hoàn tác là tệ nhất.
      // "Đang lưu…" LUÔN mang lớp `ed-dirty`: việc chưa lưu xong là trạng thái cảnh báo, dù
      // có kèm lời nhắc hay không. Trước đây lúc có lớp lúc không nên cùng một trạng thái mà
      // hiện hai màu khác nhau.
      msg(lastNote ? `${lastNote} · Đang lưu…` : "Đang lưu…", "ed-dirty")
      emit("save", collectEdits(el, editorState))
    }, opts.autoSaveMs ?? 1200)
  }

  function syncEditor() {
    if (!edit) return
    buildRail(el, {
      // Rail báo việc vừa làm qua `note` để lời nhắc hoàn tác không bị câu chung
      // chung của `scheduleSave` ghi đè ngay sau đó.
      onSync: (note?: string) => {
        player?.refresh()
        syncEditor()
        scheduleSave(note)
      },
      onMsg: msg,
      pushUndo: pushEditorUndo,
      onGoto: i => player?.show(i),
      onDup: dupSlideFromDOM,
      onDel: delSlideFromDOM,
    })
    syncToolbar()
  }

  /**
   * Chỉ vẽ lại THANH CÔNG CỤ, không đụng rail.
   *
   * Tách ra để đường chuyển slide dùng: nút trên thanh phụ thuộc slide đang chọn (bố cục,
   * khoá, có ảnh hay không) nên vẫn phải vẽ lại, nhưng rail thì không có lý do gì phải dựng
   * lại — nội dung không đổi.
   */
  function syncToolbar() {
    if (!edit) return
    buildToolbar(el, editorState, {
      onMsg: msg,
      onSave: (reload) => {
        clearTimeout(saveTimer)          // bấm "Lưu ngay" thì huỷ hẹn giờ, khỏi lưu 2 lần
        msg(reload ? "Đang đổi bố cục…" : "Đang lưu…", "ed-dirty")
        emit("save", collectEdits(el, editorState))
        if (reload) setTimeout(() => paint(), 100)
      },
      onRequestImage: (idx, dataUrl) => emit("requestImage", { index: idx, dataUrl }),
      onRequestRegenImage: (idx, prompt) => emit("requestRegenImage", { index: idx, prompt }),
      onReset: () => emit("reset"),
      pushUndo: pushEditorUndo,
      scheduleSave,
      onAddSlide: addSlide,
      onPresent: () => handle.present(!el.classList.contains("lp-present")),
      onDup: dupSlideFromDOM,
      onDel: delSlideFromDOM,
      onSync: syncEditor,
      // Đọc từ DOM chứ không từ `deck.slides` — DOM mới là bản GV vừa gõ (chưa lưu).
      onAdapt: (k, idx, sec) => {
        const slide = deck.slides[idx]
        if (!slide) return ""
        const chk = canConvert(slide, k)
        if (!chk.ok) return ""
        if (chk.transform === "bulletsToColumns") {
          const bs = readBul(sec)
          if (bs.length) {
            editorState.columns[idx] = toCols(k, bs)
            return "Đã tách ý thành cột cho bố cục mới"
          }
        }
        if (chk.transform === "columnsToBullets") {
          const fl = colsToBul(readCols(sec))
          if (fl.length) {
            editorState.bullets[idx] = fl
            return "Đã gộp cột thành các ý"
          }
        }
        // KHÔNG nói "chỉ hiện tiêu đề": nhiều bố cục (quoteauthor/split/hero) còn vẽ cả phụ đề
        // và ảnh. Và phải nói rõ DỮ LIỆU CÒN NGUYÊN — đó đúng là cam kết ở đầu `convert.ts`
        // ("KHÔNG BAO GIỜ XOÁ dữ liệu") mà câu cũ chưa từng nói, nên GV tưởng mất bài.
        if (chk.willHide) {
          return `Bố cục mới không vẽ ${chk.willHide} phần nội dung — dữ liệu vẫn còn, đổi lại là thấy`
        }
        return ""
      },
    })
  }

  /**
   * Gắn handler uỷ quyền lên `el` — chỉ MỘT lần cho cả vòng đời.
   *
   * `paint()` thay `el.innerHTML` nên con bị bỏ, nhưng listener gắn trên chính `el` thì còn:
   * gắn lại mỗi lần vẽ sẽ chồng handler và mỗi cú bấm chạy nhiều lần.
   */
  /** Phím tắt Alt+↑/↓ nghe trên `document` — giữ tham chiếu để `destroy()` gỡ được,
   *  không thì mount/unmount nhiều lần là chồng handler, mỗi cú bấm chạy nhiều lần. */
  let onDocKey: ((e: KeyboardEvent) => void) | null = null
  let editorBound = false

  function attachEditorHandlers() {
    // "Đặt lại" nằm trong chrome vừa vẽ lại → phải gắn lại mỗi lần paint
    el.querySelector<HTMLElement>("#edreset")?.addEventListener("click", () => emit("reset"))
    if (editorBound) return
    editorBound = true

    // Click handlers cho editor (xoá ý, thêm ý, di chuyển slide, etc.)
    el.addEventListener("click", ev => {
      const t = ev.target as HTMLElement
      if (!t.classList) return

      if (t.classList.contains("edx")) {
        const li = t.closest("li")
        if (li) {
          const par = li.parentNode
          const ref = li.nextSibling
          li.remove()
          pushEditorUndo(() => par?.insertBefore(li, ref))
        }
        scheduleSave()
        ev.preventDefault()
      } else if (t.classList.contains("eddel")) {
        const s = t.closest(".slide") as HTMLElement
        if (s) delSlideFromDOM(s)
        ev.preventDefault()
        ev.stopPropagation()
      } else if (t.classList.contains("edmv")) {
        const sm = t.closest(".slide") as HTMLElement
        const d = +(t.getAttribute("data-d") || 0)
        const sib = (d < 0 ? sm.previousElementSibling : sm.nextElementSibling) as HTMLElement | null
        if (sm && sib && sib.classList.contains("slide")) {
          const par = sm.parentNode!
          const ref = sm.nextSibling
          if (d < 0) par.insertBefore(sm, sib)
          else par.insertBefore(sib, sm)
          pushEditorUndo(() => par.insertBefore(sm, ref))
          player?.refresh()
          syncEditor()
          scheduleSave("Đã đổi thứ tự — Ctrl+Z để hoàn tác")
        }
        ev.preventDefault()
        ev.stopPropagation()
      } else if (t.classList.contains("edadd")) {
        const base = t.getAttribute("data-base") || ""
        const ul = t.previousElementSibling as HTMLElement
        if (ul && ul.classList.contains("bul")) {
          const li = document.createElement("li")
          li.innerHTML = `<span contenteditable="true" data-e="${base}.x">Ý mới</span><button class="edx" title="Xoá ý">×</button>`
          ul.appendChild(li)
          pushEditorUndo(() => li.remove())
          focusEnd(li.querySelector<HTMLElement>("span"))
          scheduleSave()
        }
        ev.preventDefault()
      }
    }, true)

    // Gõ vào ô sửa được → hẹn giờ tự lưu
    el.addEventListener("input", ev => {
      if ((ev.target as HTMLElement)?.isContentEditable) scheduleSave()
    }, true)

    // Chụp nội dung TRƯỚC khi sửa để Ctrl+Z trả lại được (mỗi lần focus = 1 bước undo)
    el.addEventListener("focusin", ev => {
      const t = ev.target as HTMLElement
      if (t?.isContentEditable) t.setAttribute("data-prev", t.innerHTML)
    }, true)

    el.addEventListener("focusout", ev => {
      const t = ev.target as HTMLElement
      if (!t?.isContentEditable) return
      const pv = t.getAttribute("data-prev")
      if (pv != null && pv !== t.innerHTML) pushEditorUndo(() => { t.innerHTML = pv })
      t.removeAttribute("data-prev")
    }, true)

    // Ctrl/Cmd+S — lưu ngay (chặn hộp "Lưu trang" của trình duyệt)
    el.addEventListener("keydown", ev => {
      if (!(ev.ctrlKey || ev.metaKey) || (ev.key !== "s" && ev.key !== "S")) return
      clearTimeout(saveTimer)
      msg("Đang lưu…", "ed-dirty")
      emit("save", collectEdits(el, editorState))
      ev.preventDefault()
      ev.stopPropagation()
    }, true)

    // Alt+↑/↓ — chuyển slide LÊN/XUỐNG một bậc.
    //
    // Kéo-thả một slide từ vị trí 140 lên 12 trong cột cuộn 150px là cực hình; với bài 156
    // slide đây là cách duy nhất dùng được cho quãng dài. Dùng Alt+↑/↓ vì player đã chiếm
    // ←/→ (chuyển slide), còn ↑/↓ trần thì trình duyệt dùng để cuộn.
    //
    // Đi qua đúng `pushEditorUndo` như kéo-thả nên Ctrl+Z vẫn lấy lại được.
    //
    // Nghe trên `document`, KHÔNG phải trên `el`: bấm vào thumbnail ở rail xong thì focus nằm
    // ở `<body>`, mà listener gắn trên `el` chỉ nổ khi focus nằm TRONG deck ⇒ phím tắt im
    // lặng đúng lúc GV hay dùng nhất. Đã đo: focus body ⇒ không đổi, focus deck ⇒ đổi.
    // Bù lại phải tự canh phạm vi: nhiều deck cùng trang thì chỉ deck đang sửa mới nhận.
    onDocKey = ev => {
      const isMove = ev.altKey && (ev.key === "ArrowUp" || ev.key === "ArrowDown")
      const isUndo = (ev.ctrlKey || ev.metaKey) && (ev.key === "z" || ev.key === "Z")
      if (!isMove && !isUndo) return
      if (!edit || !document.body.contains(el)) return
      // Đang gõ trong ô nhập/vùng sửa của NGƯỜI KHÁC thì đừng cướp phím.
      const a = document.activeElement as HTMLElement | null
      if (a && a !== document.body && !el.contains(a)) return
      if (ev.key === "z" || ev.key === "Z") {
        // Ctrl+Z phải nghe CÙNG PHẠM VI với Alt+↑/↓. Bản đầu để Ctrl+Z trên `el`: chuyển
        // slide xong focus nằm ở `<body>` ⇒ chuyển được mà KHÔNG hoàn tác được — đúng tình
        // huống nguy hiểm nhất. Đã đo: Alt+↑ đi 3→2, Ctrl+Z không đưa về 3.
        // "Chưa có thao tác nào" chứ không phải "Không còn gì": câu sau khẳng định stack đã
        // cạn, sai ở phiên mới toanh chưa từng sửa gì.
        if (!undoEditorStep()) { msg("Chưa có thao tác nào để hoàn tác"); ev.preventDefault(); return }
        msg("Đã hoàn tác thao tác vừa rồi")
        ev.preventDefault()
        ev.stopPropagation()
        return
      }
      const sec = el.querySelector<HTMLElement>("#scaler > .slide.active")
      if (!sec || !sec.parentNode) return
      const up = ev.key === "ArrowUp"
      const sib = up ? sec.previousElementSibling : sec.nextElementSibling
      if (!sib) return                        // đã ở đầu/cuối danh sách
      const par = sec.parentNode
      const back = sec.nextSibling            // chỗ cũ, để hoàn tác
      if (up) par.insertBefore(sec, sib)
      else par.insertBefore(sec, sib.nextSibling)
      pushEditorUndo(() => { par.insertBefore(sec, back) })
      player?.refresh()
      syncEditor()
      scheduleSave(`Đã chuyển slide ${up ? "lên" : "xuống"} — Ctrl+Z để hoàn tác`)
      ev.preventDefault()
      ev.stopPropagation()
    }
    document.addEventListener("keydown", onDocKey, true)
  }

  /**
   * Thêm slide trống ngay sau slide đang chọn.
   *
   * Slide mới KHÔNG có `data-index` (chưa tồn tại phía server) mà mang `data-new="1"`;
   * `collect()` đọc nó qua `structure.new` chứ không qua `edits`.
   */
  function addSlide() {
    const sc = el.querySelector<HTMLElement>("#scaler")
    if (!sc) return
    const a = el.querySelector<HTMLElement>("#scaler > .slide.active")
    const sec = document.createElement("section")
    sec.className = "slide chrome dots"
    sec.setAttribute("data-new", "1")
    sec.setAttribute("data-kind", "content")
    sec.setAttribute("data-nb", "1")
    sec.innerHTML = newSlideHTML()
    if (a?.nextSibling) sc.insertBefore(sec, a.nextSibling)
    else sc.appendChild(sec)

    pushEditorUndo(() => { sec.remove(); player?.refresh() })

    // `refresh()` gọi `show(cur)` với chỉ số CŨ nên sẽ kéo `active` về slide cũ —
    // phải chỉ đích danh vị trí slide mới sau khi player đã đếm lại.
    player?.refresh()
    const pos = Array.from(el.querySelectorAll("#scaler > .slide")).indexOf(sec)
    if (pos >= 0) player?.show(pos)
    syncEditor()
    focusEnd(sec.querySelector<HTMLElement>(".ttl"))
    msg("Đã thêm slide mới · sửa nội dung rồi Lưu")
  }

  /** Đặt con trỏ vào cuối một vùng contenteditable. */
  function focusEnd(sp: HTMLElement | null) {
    if (!sp) return
    sp.focus()
    const r = document.createRange()
    r.selectNodeContents(sp)
    const s = getSelection()
    if (!s) return
    s.removeAllRanges()
    s.addRange(r)
  }

  /**
   * Nhân bản slide. Bản sao là slide MỚI (`data-new`), phải **gỡ `data-index`** —
   * nếu giữ, `collect()` sẽ ghi 2 lần edits vào cùng một slide gốc.
   */
  function dupSlideFromDOM(sec: HTMLElement) {
    const c = sec.cloneNode(true) as HTMLElement
    c.setAttribute("data-new", "1")
    c.removeAttribute("data-index")
    c.classList.remove("active")
    sec.parentNode!.insertBefore(c, sec.nextSibling)
    pushEditorUndo(() => c.remove())
    player?.refresh()
    syncEditor()
    scheduleSave("Đã nhân bản slide — Ctrl+Z để bỏ")
  }

  function delSlideFromDOM(sec: HTMLElement) {
    const all = el.querySelectorAll("#scaler > .slide")
    if (all.length <= 1) {
      msg("Không xoá được: deck phải còn ít nhất 1 slide", "ed-error")
      return
    }
    const wa = sec.classList.contains("active")
    const nx = (sec.nextElementSibling || sec.previousElementSibling) as HTMLElement | null
    const par = sec.parentNode
    const ref = sec.nextSibling
    sec.remove()
    pushEditorUndo(() => {
      par!.insertBefore(sec, ref)
      player?.refresh()
      const back = Array.from(el.querySelectorAll("#scaler > .slide")).indexOf(sec)
      if (back >= 0) player?.show(back)
    })
    // Player phải đếm lại TRƯỚC khi chỉ định slide kế tiếp, không thì `active` lệch.
    player?.refresh()
    if (wa && nx) {
      const pos = Array.from(el.querySelectorAll("#scaler > .slide")).indexOf(nx)
      if (pos >= 0) player?.show(pos)
    }
    syncEditor()
    scheduleSave("Đã xoá slide — Ctrl+Z để lấy lại")
  }

  const handle: DeckHandle = {
    goto: i => player?.show(i),
    next: () => player?.next(),
    prev: () => player?.prev(),
    current: () => player?.cur() ?? 0,
    count: () => deck.slides.length,
    present(on) {
      el.classList.toggle("lp-present", on)
      if (on) player?.fullscreen()
      else if (document.fullscreenElement) document.exitFullscreen()
    },
    fit: () => player?.fit(),
    setEditMode(on) { edit = on; paint() },
    setTheme(k) { pushUndo(); deck.theme = k; changed() },
    setTransition(k) { pushUndo(); deck.transition = k; changed() },
    undo() {
      // ĐANG SỬA thì nguồn sự thật là DOM (bản GV vừa gõ), không phải `deck`. Đổ lại ảnh chụp
      // JSON ở đây là `paint()` xoá sạch chữ chưa lưu — nút Undo của app chủ và Ctrl+Z phải
      // làm ĐÚNG một việc, trên ĐÚNG một stack.
      if (edit) { if (undoEditorStep()) msg("Đã hoàn tác thao tác vừa rồi"); return }
      const prev = undoStack.pop()
      if (!prev) return
      redoStack.push(JSON.stringify(deck))
      deck = JSON.parse(prev)
      changed()
    },
    redo() {
      // Chưa có stack làm-lại cho thao tác sửa (undo editor là closure một chiều). Thà không
      // làm gì còn hơn đổ ảnh chụp JSON đè lên chữ GV đang gõ — xem chú thích ở `undo()`.
      if (edit) return
      const nxt = redoStack.pop()
      if (!nxt) return
      undoStack.push(JSON.stringify(deck))
      deck = JSON.parse(nxt)
      changed()
    },
    getDeck: () => JSON.parse(JSON.stringify(deck)),
    getPatch: () => diffDeck(base, deck),
    setDeck(d) { pushUndo(); deck = normalizeDeck(d); changed() },
    canSetKind(idx, kind) { return canConvert(deck.slides[idx], kind) },
    setKind(idx, kind) {
      const sl = deck.slides[idx]
      if (!sl || !canConvert(sl, kind).ok) return false
      pushUndo()
      deck.slides[idx] = convert(sl, kind)
      changed()
      return true
    },
    toHTML() { return toStandaloneHtml(deck, opts.foot) },
    setSaveState(state, detail) {
      if (state === "saving") return msg("Đang lưu…", "ed-dirty")
      if (state === "saved") { lastNote = ""; return msg(`✓ Đã lưu ${clock()}`, "ed-saved") }
      if (state === "dirty") return msg("Có thay đổi chưa lưu…", "ed-dirty")
      // LỖI: nói rõ hỏng ở đâu + việc GV cần làm. Im lặng hoặc chỉ "Lỗi" thì giáo viên
      // tưởng đã lưu, gõ tiếp rồi mất trắng.
      msg(`⚠ LƯU HỎNG${detail ? ` — ${detail}` : ""} · Ctrl+S để thử lại`, "ed-error")
    },
    on(ev, fn) {
      if (!listeners.has(ev)) listeners.set(ev, new Set())
      listeners.get(ev)!.add(fn)
      return () => listeners.get(ev)?.delete(fn)
    },
    destroy() {
      clearTimeout(saveTimer)
      if (onDocKey) { document.removeEventListener("keydown", onDocKey, true); onDocKey = null }
      player?.destroy()
      listeners.clear()
      el.innerHTML = ""
      styleEl = null
    },
  }

  paint()
  emit("ready", { count: deck.slides.length })
  return handle
}

/** So bản gốc với bản đã sửa → chỉ phần đổi (ánh xạ thẳng sang `apply_edits` phía backend). */
export function diffDeck(base: DeckJson, cur: DeckJson): DeckPatch {
  const byId = new Map(base.slides.map(s => [s.id, s]))
  const slides: Record<string, Partial<DeckSlide>> = {}
  const added: DeckSlide[] = []
  for (const s of cur.slides) {
    const b = byId.get(s.id)
    if (!b) { added.push(s); continue }
    const patch: Record<string, unknown> = {}
    for (const k of Object.keys(s) as (keyof DeckSlide)[]) {
      if (k === "id") continue
      if (JSON.stringify(s[k]) !== JSON.stringify(b[k])) patch[k] = s[k]
    }
    if (Object.keys(patch).length) slides[s.id] = patch
  }
  const curIds = new Set(cur.slides.map(s => s.id))
  return {
    slides, added,
    order: cur.slides.map(s => s.id),
    removed: base.slides.filter(s => !curIds.has(s.id)).map(s => s.id),
    skipped: cur.slides.filter(s => s.skipped).map(s => s.id),
  }
}

/**
 * 1 file HTML tự chứa (CSS + ảnh data-URI + player) — mở offline là chiếu được, và **in ra
 * giấy / lưu PDF được** bằng Ctrl+P.
 *
 * CSS in nằm sẵn trong `deckCss()` (ngoài `@layer`) nên file này không phải ghép thêm — mọi
 * đường mount đều in được, kể cả trang deck `/preview/deck/…` mở ở tab riêng.
 *
 * `html,body` phải tự khai ở đây: từ 0.2.0 `base.css` không còn selector trần nữa (nó từng rò
 * ra app chủ nhà), nên file độc lập không có ai đặt nền và chiều cao cho nó.
 *
 * ⚠️ Khung BẮT BUỘC có class `.dk-root` và token theme đặt sẵn trên đó. Trong app thì
 * `mountDeck` lo hai việc này (`el.classList.add("dk-root")` + `applyTheme`), nhưng file tự
 * chứa không chạy `mountDeck` — chỉ có `bootstrapPlayer` rút gọn. Thiếu là **mọi `--sl-*` không
 * tồn tại ⇒ slide trong suốt, chữ trắng trên nền trắng**: đo được `backgroundColor:
 * rgba(0,0,0,0)` trên theme tối. Lỗi này im lặng từ 0.2.0 tới khi cổng `print_test` bắt được.
 */
export function toStandaloneHtml(deck: DeckJson, foot?: string): string {
  const d = normalizeDeck(deck)
  const title = d.title || "Bài giảng"
  const shell = "html,body{margin:0;height:100%;background:#0d0f14;overflow:hidden}"
  const t = THEME_BY_KEY[d.theme || DEFAULT_THEME] || THEME_BY_KEY[DEFAULT_THEME]
  // Token ghi thẳng vào style inline — đúng thứ `applyTheme` làm lúc mount.
  const tok = Object.entries(t.tokens)
    .map(([k, v]) => `--sl-${k}:${String(v).replace(/[;"<>]/g, "")}`).join(";")
  // Cỡ chữ + mật độ lề cũng phải theo sang file tự chứa, nếu không GV chỉnh trong app rồi tải
  // về lại thấy khác — cùng lý do với token theme ở trên. Kẹp y hệt `applyDisplay`.
  const fsv = Number(d.display?.fontScale)
  const fs = Number.isFinite(fsv) ? Math.min(1.6, Math.max(0.6, fsv)) : 1
  const pad = DENSITY[d.display?.density || ""]
  const disp = `--dk-fs:${fs}` + (pad ? `;--dk-pad:${pad}` : "")
  return '<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    `<title>${title.replace(/[<>&]/g, "")}</title>` +
    `<style>${shell}${deckCss(d)}</style></head><body>` +
    `<div class="dk-root" data-theme="${esc(t.key)}" data-dark="${t.dark ? 1 : 0}" ` +
    `style="height:100%;${tok};${disp}">` +
    renderStage(d, { foot }) +
    "</div>" +
    `<script>(${bootstrapPlayer.toString()})(${d.size?.w || 1280},${d.size?.h || 720})</script>` +
    "</body></html>"
}

/** Player rút gọn nhúng vào file HTML tự chứa (không kéo theo cả bundle). */
function bootstrapPlayer(W: number, H: number) {
  const S = Array.from(document.querySelectorAll<HTMLElement>("#scaler > .slide"))
  const sc = document.getElementById("scaler")!
  let cur = 0
  const fit = () => {
    const s = Math.min((innerWidth - 48) / W, (innerHeight - 96) / H)
    if (s > 0) sc.style.transform = `scale(${s})`
  }
  const show = (i: number) => {
    cur = Math.max(0, Math.min(S.length - 1, i))
    S.forEach((s, k) => s.classList.toggle("active", k === cur))
    const c = document.getElementById("cnt"); if (c) c.textContent = `${cur + 1} / ${S.length}`
    const p = document.getElementById("sprog"); if (p) p.style.width = `${((cur + 1) / S.length) * 100}%`
  }
  addEventListener("resize", fit)
  addEventListener("keydown", e => {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { show(cur + 1); e.preventDefault() }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { show(cur - 1); e.preventDefault() }
    else if (e.key === "Home") show(0)
    else if (e.key === "End") show(S.length - 1)
    else if (e.key === "f" || e.key === "F") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()
  })
  document.getElementById("prev")!.onclick = () => show(cur - 1)
  document.getElementById("next")!.onclick = () => show(cur + 1)
  const fb = document.getElementById("fs"); if (fb) fb.onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()

  // In / lưu PDF — chỉ có ở file HTML tự chứa. Trình duyệt tự lo hộp thoại in và việc
  // "Lưu thành PDF"; ta chỉ cần `@media print` (print.css) dàn mỗi slide một trang.
  // Nút thêm bằng JS chứ không nằm trong `renderStage`: `renderStage` dùng chung với panel
  // trong app, mà in từ trong app sẽ kéo theo cả giao diện app ra giấy.
  const nav = document.querySelector(".nav")
  if (nav) {
    const pb = document.createElement("button")
    pb.textContent = "⎙"
    pb.title = "In / Lưu PDF (Ctrl+P)"
    pb.onclick = () => print()
    nav.appendChild(pb)
  }
  // Ctrl+P là phím quen của trình duyệt — không chặn, chỉ để nó chạy tự nhiên.
  fit(); show(0)
}
