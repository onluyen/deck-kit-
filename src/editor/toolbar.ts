/**
 * Thanh công cụ TRÊN — thay cho console bên phải.
 *
 * Vì sao đổi: bố cục cũ có 3 vùng chrome (rail 172px + console 238px + thanh nổi) ăn hết
 * chỗ, slide đang sửa chỉ còn 406px trên panel 864px. Dồn điều khiển lên thanh trên thì
 * slide rộng 682px — TO GẤP 1,7 LẦN, mà slide mới là thứ giáo viên cần nhìn nhất.
 * Đồng thời khớp thói quen PowerPoint/Google Slides.
 *
 * Nhóm nút, ngăn bằng vạch dọc:
 *   [Lưu + trạng thái] │ [Bố cục ▾ · Màu ▾ · Ảnh · Ghi chú] │ [Thêm · Nhân bản · Ẩn · Xoá] │ [Trình chiếu]
 *
 * Popover viết tay bằng CSS/JS thuần (không Radix) để giữ tính độc lập cho Angular.
 */
import { LAYOUT_BY_KEY } from "../layouts/manifest"
import { openPicker } from "./picker"
import { getRailFilter, setRailFilter } from "./rail"
import { icon } from "../ui/icons"
import { esc } from "../util/html"
import { checkAccent } from "../util/contrast"
import type { EditorState } from "./index"

/** Màu nhấn per-slide — trùng bảng của app. */
const ACC = ["#5b8def", "#46b083", "#e0a23a", "#e8503a", "#7a5ae0", "#2B4182", "#0E9F6E"]

/** Nút định dạng chữ — `data-cmd` là lệnh `execCommand` tương ứng. */
function fmtBtn(cmd: string, label: string, title: string): string {
  return `<button class="dk-btn dk-fmt" data-cmd="${cmd}" title="${esc(title)}" ` +
    `tabindex="-1">${label}</button>`
}

export type ToolbarOpts = {
  onMsg: (m: string) => void
  onSave: (reload: boolean) => void
  /** `dataUrl` = ảnh mới đã nén (WebP ≤1400px); `null` = giáo viên gỡ ảnh. */
  onRequestImage?: (idx: number, dataUrl: string | null) => void
  onRequestRegenImage?: (idx: number, prompt?: string) => void
  onReset?: () => void
  pushUndo: (fn: () => void) => void
  scheduleSave: (note?: string) => void
  onAdapt: (k: string, idx: number, sec: HTMLElement) => string
  onAddSlide: () => void
  onPresent: () => void
  onDup: (sec: HTMLElement) => void
  onDel: (sec: HTMLElement) => void
  onSync: () => void
  /** Sửa ghi chú/đáp án (Presenter View) — trước đây KHÔNG có đường nào sửa. */
  onNotes?: (idx: number, notes: string) => void
}

const btn = (id: string, ic: string, label: string, title: string, cls = "") =>
  `<button id="${id}" class="dk-btn ${cls}" title="${esc(title)}">${icon(ic)}` +
  `<span class="dk-lb">${esc(label)}</span></button>`

export function buildToolbar(root: HTMLElement, state: EditorState, opts: ToolbarOpts): void {
  const bar = root.querySelector<HTMLElement>("#dk-toolbar")
  if (!bar) return
  const sec = root.querySelector<HTMLElement>("#scaler > .slide.active")
    || root.querySelector<HTMLElement>("#scaler > .slide")
  if (!sec) { bar.innerHTML = ""; return }

  const idx = +(sec.dataset.index || 0)
  const kind = sec.dataset.kind || "content"
  const secs = root.querySelectorAll("#scaler > .slide")
  const pos = Array.from(secs).indexOf(sec)
  const def = LAYOUT_BY_KEY[kind]
  const skipped = sec.classList.contains("skipped")
  const locked = sec.dataset.locked === "1"

  // Nút ảnh mở cho MỌI bố cục có render ảnh — trước đây hardcode `content|figure` nên
  // 4 bố cục cần ảnh (gallery/imageleft/imageright/quoteauthor) không có đường thêm ảnh.
  const takesImage = !!def?.renders.some(r => r === "image" || r === "images")
  const hasImg = !!sec.querySelector(".two img,.bigfig img,.fig img,.gcell img,.qav")
  const canRegen = !!sec.querySelector(".edregen")

  let h = ""
  // ── Nhóm 1: lưu ──
  h += '<div class="dk-grp">'
  h += btn("dk-save", "save", "Lưu", "Lưu ngay (Ctrl+S)", "primary")
  h += '<span id="edmsg" class="dk-status"></span>'
  h += "</div>"

  // ── Nhóm 2: thuộc tính slide ──
  h += '<div class="dk-grp">'
  h += `<button id="dk-layout" class="dk-btn" title="Đổi bố cục — có ô tìm kiếm, rê chuột để xem trước"` +
    `${locked ? " disabled" : ""}>${icon("layout")}<span class="dk-lb">${esc(def?.label || kind)}</span>` +
    `${icon("chevron", "dk-caret")}</button>`
  h += `<button id="dk-color" class="dk-btn" title="Màu nhấn của slide này">${icon("palette")}` +
    `<span class="dk-lb">Màu</span>${icon("chevron", "dk-caret")}</button>`
  if (takesImage) {
    h += btn("dk-img", "image", hasImg ? "Đổi ảnh" : "Thêm ảnh", "Chọn ảnh minh hoạ cho slide")
    if (hasImg) h += btn("dk-imgx", "trash", "Gỡ ảnh", "Gỡ ảnh khỏi slide", "danger-ghost")
  }
  if (canRegen) h += btn("dk-regen", "regen", "Vẽ lại ảnh", "Vẽ lại ảnh bằng AI (~1 phút)")
  h += btn("dk-notes", "note", "Ghi chú", "Ghi chú/đáp án cho Presenter View (không hiện trên slide)")
  h += "</div>"

  // ── Nhóm 2b: định dạng chữ ────────────────────────────────────────────────
  //
  // Cả đường ống rich-text ĐÃ xong từ trước mà thiếu đúng cái nút: `collect.richText()` giữ
  // 4 thẻ khi đọc, `escRich()` mở lại khi vẽ, `_EXTRACT.richRuns()` tách thành run, rồi
  // `deck_to_pptx` ghi vào .pptx (kể cả `baseline` cho mũ/chỉ số).
  //
  // Dùng `execCommand` vì nó sinh ĐÚNG 4 thẻ đó — đã chạy thử trong Chromium:
  // bold→<b> · italic→<i> · superscript→<sup> · subscript→<sub>. API này bị đánh dấu
  // deprecated nhưng chưa trình duyệt nào bỏ, và không có thay thế cho contenteditable.
  //
  // Nhãn dùng CHỮ chứ không phải icon: B/I/x²/x₂ là quy ước ai cũng đọc được ngay.
  h += '<div class="dk-grp" id="dk-fmt-grp">'
  h += fmtBtn("bold", "<b>B</b>", "Đậm (Ctrl+B)")
  h += fmtBtn("italic", "<i>I</i>", "Nghiêng (Ctrl+I)")
  h += fmtBtn("superscript", "x<sup>2</sup>", "Số mũ — x²")
  h += fmtBtn("subscript", "x<sub>2</sub>", "Chỉ số dưới — x₂")
  h += "</div>"

  // ── Nhóm 3: thao tác slide ──
  h += '<div class="dk-grp">'
  h += btn("dk-add", "add", "Thêm", "Thêm slide trống sau slide này")
  h += btn("dk-dup", "duplicate", "Nhân bản", "Tạo bản sao ngay dưới slide này")
  h += btn("dk-skip", skipped ? "show" : "hide", skipped ? "Bỏ ẩn" : "Ẩn",
           skipped ? "Cho slide hiện lại khi trình chiếu" : "Ẩn khỏi trình chiếu và bản xuất")
  h += btn("dk-del", "trash", "Xoá", "Xoá slide (Ctrl+Z để lấy lại)", "danger")
  h += "</div>"

  // ── Nhóm 3b: lọc rail ─────────────────────────────────────────────────────
  // 57/156 slide của bài thật là `locked` (nguyên văn giáo án, sửa không ăn). Giấu được thứ
  // không sửa được là đỡ thật khi đang soát bài dài.
  const rf = getRailFilter()
  h += '<div class="dk-grp" id="dk-filter-grp">'
  h += `<button id="dk-filter" class="dk-btn${rf ? " on" : ""}" title="Lọc danh sách slide bên trái">` +
    `${icon("hide")}<span class="dk-lb">${rf === "skip" ? "Đang ẩn" : rf === "lock" ? "Nguyên văn" : "Lọc"}</span>` +
    `${icon("chevron", "dk-caret")}</button>`
  h += "</div>"

  // ── Nhóm 4: trình chiếu + vị trí ──
  h += '<div class="dk-grp dk-right">'
  h += `<span class="dk-pos">${pos + 1}<span class="dk-pos-sep">/</span>${secs.length}</span>`
  h += btn("dk-present", "present", "Trình chiếu", "Trình chiếu toàn màn hình (Esc để thoát)")
  h += `<button id="dk-reset" class="dk-btn ghost" title="Đặt lại slide về bản AI dàn ban đầu">${icon("reset")}</button>`
  h += "</div>"

  bar.innerHTML = h
  wire(root, bar, sec, idx, kind, state, opts)
}

function wire(root: HTMLElement, bar: HTMLElement, sec: HTMLElement, idx: number,
              kind: string, state: EditorState, opts: ToolbarOpts): void {
  const on = (id: string, fn: (e: MouseEvent) => void) => {
    const el = bar.querySelector<HTMLElement>("#" + id)
    if (el) el.onclick = fn as any
  }

  // ── Định dạng chữ ──────────────────────────────────────────────────────────
  //
  // `mousedown` + `preventDefault` là BẮT BUỘC, không phải `click`: bấm nút bình thường sẽ
  // cướp focus khỏi vùng đang gõ ⇒ mất vùng chọn ⇒ `execCommand` không có gì để định dạng.
  // Chặn hành vi mặc định của mousedown thì con trỏ ở nguyên chỗ cũ.
  bar.querySelectorAll<HTMLElement>(".dk-fmt").forEach(b2 => {
    b2.addEventListener("mousedown", ev => {
      ev.preventDefault()
      const sel = (root.getRootNode() as Document).getSelection?.() || window.getSelection()
      const node = sel?.anchorNode
      const host = node && (node.nodeType === 1 ? node as HTMLElement : node.parentElement)
      // Chỉ áp trong vùng SỬA ĐƯỢC của slide — tránh định dạng nhầm chữ ở thanh công cụ
      if (!host?.closest("[contenteditable='true']")) {
        opts.onMsg("Bôi đen chữ trên slide trước rồi mới bấm định dạng")
        return
      }
      document.execCommand(b2.dataset.cmd || "bold")
      opts.onSave(false)          // chữ đổi ⇒ lưu như mọi thao tác sửa khác
    })
  })

  on("dk-save", () => opts.onSave(false))
  on("dk-add", () => opts.onAddSlide())
  on("dk-dup", () => opts.onDup(sec))
  on("dk-del", () => opts.onDel(sec))
  on("dk-present", () => opts.onPresent())
  on("dk-reset", () => opts.onReset?.())

  on("dk-layout", () => openPicker(idx, kind, sec, {
    onSelect: (k, i, s) => {
      const note = opts.onAdapt(k, i, s)
      state.kinds[i] = k
      if (note) opts.onMsg(note)
      opts.onSave(true)
    },
  }))

  on("dk-skip", () => {
    const nowSkipped = sec.classList.toggle("skipped")
    if (nowSkipped) state.skipped[idx] = true
    else delete state.skipped[idx]
    opts.onSync()
    opts.scheduleSave(nowSkipped ? "Đã ẩn slide khỏi trình chiếu" : "Đã bỏ ẩn slide")
  })

  // ── Popover màu nhấn ──
  on("dk-color", e => {
    const cur = (sec.style.getPropertyValue("--sl-gold") || "").trim().toLowerCase()
    popover(bar, e.currentTarget as HTMLElement,
      '<div class="dk-pop-t">Màu nhấn slide</div><div class="dk-sw">' +
      ACC.map(c => `<button class="dk-swatch${c.toLowerCase() === cur ? " on" : ""}" ` +
        `data-c="${c}" style="background:${c}" title="${c}"></button>`).join("") +
      `<button class="dk-swatch reset" data-c="" title="Theo màu theme">${icon("reset")}</button>` +
      "</div>" +
      // Ô màu tự do — 7 màu trên chỉ là gợi ý nhanh. Trước đây GV muốn màu khác là chịu.
      `<label class="dk-pick"><input type="color" id="dk-pick" value="${cur || "#2b4182"}">` +
      `<span>Màu khác…</span></label>` +
      '<div class="dk-warn" id="dk-cwarn" hidden></div>',
      pop => {
      // ── Cảnh báo tương phản ────────────────────────────────────────────────
      // Đo màu nhấn ở CẢ HAI vai: làm chữ trên nền slide, và làm nền cho chữ `--sl-navy2`.
      // CẢNH BÁO chứ không CHẶN — màu nhấn có lúc chỉ để trang trí, chặn là phủ nhận phán
      // đoán của GV. Xem `util/contrast.ts` về vì sao KHÔNG suy màu tự động.
      const warnBox = pop.querySelector<HTMLElement>("#dk-cwarn")
      const cs = getComputedStyle(sec)
      const showWarn = (c: string) => {
        if (!warnBox) return
        if (!c) { warnBox.hidden = true; return }
        const r = checkAccent(c, cs.getPropertyValue("--sl-bg") || "#ffffff",
                              cs.getPropertyValue("--sl-navy2") || "#0f2977")
        if (r.low && r.worst != null) {
          warnBox.hidden = false
          warnBox.textContent =
            `⚠ Tương phản thấp (${r.worst.toFixed(1)}:1 — nên ≥ 4,5:1). ` +
            "Chữ dùng màu này có thể khó đọc. Vẫn dùng được nếu chỉ để trang trí."
        } else {
          warnBox.hidden = true
        }
      }
      showWarn(cur)

      const pick = pop.querySelector<HTMLInputElement>("#dk-pick")
      if (pick) {
        // `input` (không phải `change`) để xem trước NGAY khi kéo bảng màu — GV thấy màu trên
        // slide trước lúc thả chuột. Lưu thì chờ `change` cho khỏi ghi hàng chục lần.
        const apply = (c: string, save: boolean) => {
          const prev = sec.style.getPropertyValue("--sl-gold")
          state.accents[idx] = c
          sec.style.setProperty("--sl-gold", c)
          sec.style.setProperty("--sl-rail", c)
          if (!save) return
          opts.pushUndo(() => {
            if (prev) { sec.style.setProperty("--sl-gold", prev); sec.style.setProperty("--sl-rail", prev); state.accents[idx] = prev }
            else { sec.style.removeProperty("--sl-gold"); sec.style.removeProperty("--sl-rail"); state.accents[idx] = "" }
            opts.onSave(false)
          })
          opts.onSave(false)
        }
        pick.oninput = () => { apply(pick.value, false); showWarn(pick.value) }
        pick.onchange = () => apply(pick.value, true)
      }
      pop.querySelectorAll<HTMLElement>(".dk-swatch").forEach(b => {
        b.onclick = () => {
          const c = b.getAttribute("data-c") || ""
          showWarn(c)
          const prev = sec.style.getPropertyValue("--sl-gold")
          state.accents[idx] = c
          if (c) {
            sec.style.setProperty("--sl-gold", c)
            sec.style.setProperty("--sl-rail", c)
          } else {
            sec.style.removeProperty("--sl-gold")
            sec.style.removeProperty("--sl-rail")
          }
          opts.pushUndo(() => {
            if (prev) {
              sec.style.setProperty("--sl-gold", prev)
              sec.style.setProperty("--sl-rail", prev)
              state.accents[idx] = prev
            } else {
              sec.style.removeProperty("--sl-gold")
              sec.style.removeProperty("--sl-rail")
              delete state.accents[idx]
            }
          })
          closePop()
          opts.onSync()
          opts.scheduleSave("Đã đổi màu nhấn")
        }
      })
      })
  })

  // ── Popover lọc rail ──
  on("dk-filter", e => {
    const cur = getRailFilter()
    const opt = (v: string, lb: string, hint: string) =>
      `<button class="dk-fopt${cur === v ? " on" : ""}" data-f="${v}">` +
      `<b>${esc(lb)}</b><span>${esc(hint)}</span></button>`
    popover(bar, e.currentTarget as HTMLElement,
      '<div class="dk-pop-t">Hiện slide nào ở cột trái</div>' +
      opt("", "Tất cả", "toàn bộ slide của bài") +
      opt("skip", "Chỉ slide đang ẩn", "slide không trình chiếu/xuất") +
      opt("lock", "Chỉ slide nguyên văn", "lấy từ giáo án — sửa không ăn"),
      pop => {
        pop.querySelectorAll<HTMLElement>(".dk-fopt").forEach(b => {
          b.onclick = () => {
            setRailFilter(root, b.getAttribute("data-f") || "")
            closePop()
            opts.onSync()
          }
        })
      })
  })

  // ── Popover ghi chú/đáp án (Presenter View) ──
  on("dk-notes", e => {
    const cur = sec.dataset.notes || ""
    popover(bar, e.currentTarget as HTMLElement,
      '<div class="dk-pop-t">Ghi chú / đáp án</div>' +
      '<div class="dk-pop-hint">Không hiện trên slide — chỉ vào phần Notes khi xuất .pptx ' +
      '(mở Presenter View để xem).</div>' +
      `<textarea id="dk-notes-ta" class="dk-ta" rows="6" placeholder="Ví dụ: ĐÁP ÁN A — vì …">${esc(cur)}</textarea>` +
      '<button id="dk-notes-ok" class="dk-btn primary dk-w">Lưu ghi chú</button>',
      pop => {
        const ta = pop.querySelector<HTMLTextAreaElement>("#dk-notes-ta")
        ta?.focus()
        const save = () => {
          const v = ta?.value || ""
          if (v === (sec.dataset.notes || "")) return false   // không đổi thì đừng bẩn trạng thái
          sec.dataset.notes = v            // `deck_to_pptx` đọc `data-notes` khi chụp
          opts.onNotes?.(idx, v)
          return true
        }
        // Giữ chữ khi popover đóng vì lý do KHÁC nút "Lưu ghi chú" — bấm ra ngoài, Escape, hoặc
        // mở hộp chọn ảnh. Trước đây chỉ lưu lúc bấm nút, nên đang gõ ghi chú mà bấm "Thêm ảnh"
        // là mất trắng: `closePop()` xoá thẳng textarea khỏi DOM, không ai đọc lại giá trị.
        popOnClose = () => { if (save()) opts.scheduleSave("Đã sửa ghi chú") }
        const okBtn = pop.querySelector<HTMLElement>("#dk-notes-ok")
        if (okBtn) okBtn.onclick = () => {
          const changed = save()
          closePop()
          if (changed) opts.scheduleSave("Đã sửa ghi chú")
        }
      })
  })

  // ── Ảnh ──
  on("dk-img", () => {
    const inp = document.createElement("input")
    inp.type = "file"
    inp.accept = "image/*"
    inp.onchange = () => {
      const f = inp.files?.[0]
      if (!f) return
      opts.onMsg("Đang xử lý ảnh…")
      compressImg(f, durl => {
        opts.onRequestImage?.(idx, durl)
        // "Đã gửi" chứ KHÔNG phải "Đang tải lên": thư viện không hề tải gì (xem đầu `mount.ts`)
        // — app chủ mới là bên tải. Nói "đang tải" là nhận việc của người khác, và app chủ lơ
        // sự kiện thì thanh trạng thái treo vĩnh viễn. Đây là mốc CUỐI CÙNG mình thật sự biết.
        opts.onMsg("Đã gửi ảnh cho hệ thống xử lý")
      })
    }
    inp.click()
  })
  on("dk-imgx", () => {
    opts.onRequestImage?.(idx, null)
    opts.onMsg("Đã yêu cầu gỡ ảnh")
  })
  on("dk-regen", () => {
    const np = window.prompt("Mô tả ảnh mới (bỏ trống = vẽ lại theo mô tả cũ):", "")
    if (np !== null) {
      opts.onRequestRegenImage?.(idx, (np || "").trim())
      // Bỏ "~1 phút": đó là phỏng đoán về việc của app chủ, thư viện không biết và không đo
      // được. Ước lượng thời gian vẫn còn ở tooltip của nút — tooltip là lời khuyên TRƯỚC khi
      // bấm, không phải lời khẳng định trạng thái SAU khi bấm.
      opts.onMsg("Đã gửi yêu cầu vẽ lại ảnh")
    }
  })
}

// ── Popover thuần: một cái mở tại một thời điểm, Esc/bấm ra ngoài thì đóng ──

let popEl: HTMLElement | null = null
let popOff: (() => void) | null = null
/** Việc phải làm TRƯỚC khi popover biến mất — vd giữ lại chữ GV đang gõ dở. Đặt trong `init`. */
let popOnClose: (() => void) | null = null

export function closePop(): void {
  // Chạy TRƯỚC `remove()`: sau khi remove thì các phần tử con đã rời DOM, đọc `.value` không
  // còn đáng tin và mọi thứ gõ dở coi như mất.
  const done = popOnClose
  popOnClose = null
  try { done?.() } catch { /* lỗi khi lưu dở không được chặn việc đóng popover */ }
  popEl?.remove()
  popEl = null
  popOff?.()
  popOff = null
}

function popover(bar: HTMLElement, anchor: HTMLElement, html: string,
                 init?: (el: HTMLElement) => void): void {
  const same = popEl?.dataset.for === anchor.id
  closePop()
  if (same) return                     // bấm lại chính nút đang mở ⇒ đóng

  const el = document.createElement("div")
  el.className = "dk-pop"
  el.dataset.for = anchor.id
  el.innerHTML = html
  // Gắn vào GỐC DECK, không phải vào `bar`. `.dk-toolbar` khai `overflow-x:auto` để nút cuộn
  // ngang được trên màn hẹp — mà theo spec CSS, `overflow-y:visible` đi kèm `overflow-x:auto`
  // bị ép thành `auto`. Thanh chỉ cao 52px còn popover cao ~123px ⇒ popover BỊ CẮT, ô
  // "Màu khác…" nằm ở y≈134px, ngoài vùng nhìn thấy. Đo được đúng như vậy trước khi sửa.
  //
  // Gắn vào `.dk-root` (không phải `document.body`) để popover ở CÙNG ngữ cảnh xếp chồng với
  // phần còn lại của deck — `body` là đúng cái bẫy khiến picker bố cục chui xuống dưới modal.
  const host = (bar.closest(".dk-root") as HTMLElement) || bar.parentElement || bar
  host.appendChild(el)
  // Neo dưới nút, tự lùi vào trong nếu chạm mép phải. Toạ độ tính theo `host` vì popover giờ
  // là con của host; dùng `bar` để canh bề ngang cho popover không tràn khỏi thanh.
  const a = anchor.getBoundingClientRect()
  const b = bar.getBoundingClientRect()
  const h = host.getBoundingClientRect()
  el.style.top = `${a.bottom - h.top + 6}px`
  el.style.left = `${Math.max(4, Math.min(a.left - h.left, b.right - h.left - el.offsetWidth - 4))}px`
  popEl = el
  init?.(el)

  // `<input type="color">` và `type="file"` mở hộp thoại của HỆ ĐIỀU HÀNH — cửa sổ đó nằm
  // NGOÀI trang, nên khi GV bấm chọn màu, trình duyệt bắn `mousedown` với target là <html>
  // hoặc chính body. Kiểm mỗi `el.contains(target)` thì popover tưởng bị bấm ra ngoài và tự
  // đóng ngay lúc GV vừa chọn xong — đúng lỗi "chọn màu xong thanh màu bị ẩn, không ấn được".
  //
  // Không chặn mọi `mousedown` (làm vậy thì popover không đóng được nữa): chỉ bỏ qua khi phần
  // tử đang giữ focus là ô chọn màu/chọn file NẰM TRONG popover này — tức hộp thoại HĐH do
  // chính nó mở ra đang mở.
  const nativeDialogOpen = () => {
    const a = document.activeElement as HTMLInputElement | null
    return !!a && a.tagName === "INPUT" && (a.type === "color" || a.type === "file") && el.contains(a)
  }
  const onDoc = (ev: MouseEvent) => {
    if (nativeDialogOpen()) return
    if (!el.contains(ev.target as Node) && !anchor.contains(ev.target as Node)) closePop()
  }
  const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape") closePop() }
  setTimeout(() => document.addEventListener("mousedown", onDoc), 0)
  document.addEventListener("keydown", onKey)
  popOff = () => {
    document.removeEventListener("mousedown", onDoc)
    document.removeEventListener("keydown", onKey)
  }
}

function compressImg(file: File, cb: (dataUrl: string) => void): void {
  const rd = new FileReader()
  rd.onload = () => {
    const img = new Image()
    img.onload = () => {
      const mx = 1400
      let w = img.width, h = img.height
      if (w > mx || h > mx) {
        const r = Math.min(mx / w, mx / h)
        w = Math.round(w * r); h = Math.round(h * r)
      }
      const cv = document.createElement("canvas")
      cv.width = w; cv.height = h
      cv.getContext("2d")!.drawImage(img, 0, 0, w, h)
      try { cb(cv.toDataURL("image/webp", 0.82)) } catch { cb(cv.toDataURL("image/png")) }
    }
    img.src = rd.result as string
  }
  rd.readAsDataURL(file)
}
