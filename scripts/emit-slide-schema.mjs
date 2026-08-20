/**
 * Sinh `docs/slide-schema.md` — HỢP ĐỒNG JSON để viết prompt cho LLM dàn slide.
 *
 * Vì sao sinh tự động: người viết prompt cần biết CHÍNH XÁC mỗi bố cục ăn trường nào và
 * ngưỡng độ dài bao nhiêu. Chép tay là lệch — đã gặp thật: prompt dạy `quoteauthor` chỉ có
 * `caption` trong khi builder đọc CẢ `subtitle` (tên) lẫn `caption` (chức danh), nên slide
 * ra có chức danh mà không có tên người nói.
 *
 * Nguồn sự thật là `manifest.ts` (`needs`/`renders`/`fits`/`maxColumns`), cùng thứ mà bộ
 * chọn bố cục và ma trận chuyển đổi đang dùng.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..")
const { LAYOUTS, GROUP_ORDER } = await import(join(root, "dist/index.js"))

/** Trường mỗi bố cục THỰC SỰ đọc — suy từ `renders` + các trường riêng của builder. */
const FIELDS = {
  title: "`title`",
  subtitle: "`subtitle`",
  bullets: "`bullets[]`",
  columns: "`columns[]` = `[{title, bullets[]}]`",
  image: "`figure` (id trong HÌNH CÓ THỂ DÙNG) hoặc `image_prompt`",
  images: "`figures[]` (nhiều id)",
  formula: "`formula`",
  table: "`rows[][]` — CODE tự chèn từ giáo án, LLM không sinh",
  question: "`stem` + `options[]` — CODE tự chèn, LLM không sinh",
}

/** Trường phụ mà `renders` không mô tả nhưng builder có đọc. */
const EXTRA = {
  formula: ["`caption` — chú thích dưới công thức"],
  figure: ["`caption` — chú thích dưới hình"],
  quoteauthor: ["`subtitle` — TÊN tác giả", "`caption` — chức danh/nguồn"],
  defcard: ["`caption` — nguồn (vd `Nguồn: SGK Toán 12`)"],
  tablewide: ["`caption` — chú thích dưới bảng"],
  content: ["`image_prompt` — xin AI vẽ ảnh (chỉ khi KHÔNG có `figure`)"],
  imageleft: ["`image_prompt` — xin AI vẽ ảnh"],
  imageright: ["`image_prompt` — xin AI vẽ ảnh"],
}

const needStr = l => {
  const n = l.needs || {}
  const p = []
  if (n.bullets) p.push(`≥ ${n.bullets} ý`)
  if (n.columns) p.push(`≥ ${n.columns} cột`)
  if (n.columnsWithTitle) p.push(`≥ ${n.columnsWithTitle} cột CÓ title`)
  if (n.images) p.push(`≥ ${n.images} ảnh`)
  return p.join(" · ") || "—"
}

const fitStr = l => {
  const f = l.fits || {}
  const p = []
  if (f.title) p.push(`title ≤ ${f.title} ký tự`)
  if (f.bullet) p.push(`mỗi ý ≤ ${f.bullet}`)
  if (f.bulletCount) p.push(`≤ ${f.bulletCount} ý`)
  if (f.colTitle) p.push(`title cột ≤ ${f.colTitle}`)
  if (l.maxColumns) p.push(`≤ ${l.maxColumns} cột`)
  return p.join(" · ") || "—"
}

let md = `# Hợp đồng JSON cho slide

> **Sinh tự động** từ \`src/layouts/manifest.ts\` — đừng sửa tay, chạy \`npm run build\`.
> Dùng file này làm nguồn khi viết prompt cho LLM dàn slide.
>
> ⚠️ **Đây KHÔNG phải thứ deck-kit render.** File này tả **slide thô do LLM viết**. Thứ deck-kit
> thật sự đọc là \`DeckJson\` — tên trường khác (\`figure\` → \`image\`, \`image_prompt\` →
> \`imagePrompt\`) và có thêm \`id\`/\`kicker\`/\`locked\`/\`table\`/\`question\` do code sinh. Xem
> [\`deck-json.md\`](./deck-json.md). Đo thật: cùng một hoạt động, thô **4 slide** ⇄ DeckJson
> **7 slide**.

## Khung ngoài

LLM trả về DUY NHẤT một object, không kèm giải thích, không kèm \`\`\`:

\`\`\`json
{"slides":[ {"kind":"…", …}, … ]}
\`\`\`

## Trường dùng chung

| Trường | Kiểu | Ghi chú |
|---|---|---|
| \`kind\` | string | Bắt buộc. Không thuộc danh sách dưới → bị ép về \`content\`. |
| \`title\` | string | Hầu như bố cục nào cũng dùng. |
| \`subtitle\` | string | Chỉ vài bố cục đọc (xem bảng). |
| \`bullets\` | string[] | Ý ngắn. |
| \`columns\` | \`{title, bullets[]}[]\` | Bố cục nhiều cột. |
| \`figure\` | string | ID ảnh có trong "HÌNH CÓ THỂ DÙNG". Mỗi ảnh dùng tối đa 1 lần. |
| \`figures\` | string[] | Chỉ \`gallery\`. |
| \`formula\` | string | Chữ thường, KHÔNG LaTeX. |
| \`caption\` | string | Chú thích — ý nghĩa tuỳ bố cục (xem cột "Trường phụ"). |
| \`image_prompt\` | string | Tiếng Anh. Tối đa 3 slide/hoạt động. Cấm vẽ hình toán chính xác. |
| \`notes\` | string | Ghi chú người trình bày, KHÔNG hiện trên slide. |

`

md += `## Bố cục theo nhóm\n\n`
md += `\`AI\` = LLM được phép sinh · \`GV\` = giáo viên chọn tay được (bố cục chỉ có \`GV\` là do CODE chèn nguyên văn từ giáo án).\n\n`

// `_KINDS` phía Python là danh sách LLM được sinh. Giữ đồng bộ bằng `kinds_test.py`;
// ở đây suy ra từ chính manifest: bố cục hệ thống tự chèn thì không cho LLM sinh.
const SYSTEM_ONLY = new Set(["table", "tablewide", "note", "question"])
const NOT_FOR_AI = new Set([...SYSTEM_ONLY, "blank"])

for (const g of GROUP_ORDER) {
  const items = LAYOUTS.filter(l => l.group === g)
  if (!items.length) continue
  md += `### ${g}\n\n`
  md += `| \`kind\` | Tên | AI | Trường đọc | Điều kiện | Ngưỡng vừa vặn | Trường phụ |\n`
  md += `|---|---|---|---|---|---|---|\n`
  for (const l of items) {
    const reads = (l.renders || []).map(r => FIELDS[r] || `\`${r}\``).join("<br>")
    const extra = (EXTRA[l.key] || []).join("<br>") || "—"
    md += `| \`${l.key}\` | ${l.label} | ${NOT_FOR_AI.has(l.key) ? "—" : "✓"}`
      + ` | ${reads} | ${needStr(l)} | ${fitStr(l)} | ${extra} |\n`
  }
  md += `\n`
}

md += `## Bẫy đã gặp thật

- **Không đủ \`needs\` thì builder RƠI VỀ \`content\`** — không báo lỗi, chỉ ra slide sai bố cục.
  Vd \`metrics\` cần ≥ 2 cột CÓ \`title\`; cột chỉ có \`bullets\` không tính.
- **\`quoteauthor\` đọc CẢ \`subtitle\` lẫn \`caption\`** — thiếu \`subtitle\` là mất tên người nói.
- **Vượt "ngưỡng vừa vặn" thì vẫn dựng được** nhưng chữ bị thu nhỏ/cắt. Đây là ngưỡng ĐỀ NGHỊ
  cho prompt, không phải điều kiện chặn.
- **\`table\`/\`note\`/\`question\`/\`tablewide\` do CODE chèn nguyên văn** từ giáo án. LLM sinh ra
  cũng bị bỏ — và tệ hơn là bỏ IM LẶNG.
- **\`image_prompt\` cấm dùng cho hình toán chính xác** (đồ thị, mặt phẳng toạ độ, bảng biến
  thiên, dựng hình) — AI vẽ sai. Code chặn sẵn bằng \`_MATH_DENY\`.
`

mkdirSync(join(root, "docs"), { recursive: true })
writeFileSync(join(root, "docs/slide-schema.md"), md, "utf8")
console.log(`docs/slide-schema.md: ${LAYOUTS.length} bố cục · `
  + `${LAYOUTS.filter(l => !NOT_FOR_AI.has(l.key)).length} cho AI`)
