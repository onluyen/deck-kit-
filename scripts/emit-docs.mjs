/**
 * Sinh `docs/layouts.md` + `examples/*.json` TỪ MANIFEST.
 *
 * Tài liệu sinh tự động thì không bao giờ lệch code: thêm bố cục mới là chạy lại,
 * không phải nhớ sửa tay ở hai nơi.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..")
const { LAYOUTS, GROUP_ORDER, THEMES } = await import(join(root, "dist/index.js"))

// ── docs/layouts.md ──────────────────────────────────────────────────────────
const need = l => {
  const n = l.needs || {}
  const p = []
  if (n.bullets) p.push(`≥${n.bullets} ý`)
  if (n.columns) p.push(`≥${n.columns} cột`)
  if (n.columnsWithTitle) p.push(`≥${n.columnsWithTitle} cột có tiêu đề`)
  if (n.images) p.push(`≥${n.images} ảnh`)
  return p.join(", ") || "—"
}

const SHAPE_VI = {
  list: "Danh sách", columns: "Cột", headline: "Tiêu đề",
  media: "Ảnh", verbatim: "Nguyên văn",
}

let md = `# Danh mục bố cục

> **File này SINH TỰ ĐỘNG** từ \`src/layouts/manifest.ts\` — đừng sửa tay.
> Chạy lại: \`npm run docs -w @mvng267/deck-kit\`

Tổng ${LAYOUTS.length} bố cục · ${LAYOUTS.filter(l => l.selectable).length} bố cục giáo viên
chọn tay được · ${THEMES.length} theme.

**Cột "Cần"** = dữ liệu tối thiểu để bố cục mở khoá trong bộ chọn. Thiếu thì ô bị khoá
kèm lý do, hoặc thư viện tự chuyển dạng dữ liệu cho khớp (ý ⇄ cột).

**Cột "Hiển thị"** = trường nào của slide thực sự được vẽ ra. Trường không nằm trong đây
vẫn được GIỮ trong dữ liệu, chỉ là tạm không hiện.

`

for (const g of [...GROUP_ORDER, "Nguyên văn"]) {
  const items = LAYOUTS.filter(l => l.group === g)
  if (!items.length) continue
  md += `\n## ${g}\n\n`
  if (g === "Nguyên văn") {
    md += "> 🔒 Nhóm này **không cho chọn tay** — nội dung lấy đúng từ giáo án gốc.\n" +
      "> Cho đổi sang thì AI hoặc giáo viên sẽ vô tình bịa ra dữ liệu không có trong nguồn.\n\n"
  }
  md += "| `kind` | Tên | Dạng dữ liệu | Cần | Hiển thị |\n|---|---|---|---|---|\n"
  for (const l of items) {
    md += `| \`${l.key}\` | ${l.label}${l.selectable ? "" : " 🔒"} | ${SHAPE_VI[l.shape] || l.shape}` +
      ` | ${need(l)} | ${l.renders.join(", ")} |\n`
  }
}

md += `\n## Theme\n\n| Khoá | Tên |\n|---|---|\n`
for (const t of THEMES) md += `| \`${t.key}\` | ${t.label || t.key} |\n`

mkdirSync(join(root, "docs"), { recursive: true })
writeFileSync(join(root, "docs/layouts.md"), md, "utf8")

// ── examples/minimal.json ────────────────────────────────────────────────────
mkdirSync(join(root, "examples"), { recursive: true })
writeFileSync(join(root, "examples/minimal.json"), JSON.stringify({
  version: 1,
  title: "Tiết 2. Tổng và hiệu hai vectơ",
  theme: "navy-gold",
  foot: "Bài 6 · Vectơ trong không gian",
  slides: [
    { id: "s0", kind: "hero", title: "Tổng hai vectơ", subtitle: "Toán 11 · 45 phút" },
    {
      id: "s1", kind: "content", title: "Quy tắc hình hộp",
      bullets: [
        "Dựng hình hộp trên ba vectơ chung gốc",
        "Đường chéo chính là vectơ tổng",
        "Kiểm tra lại bằng toạ độ",
      ],
    },
    {
      id: "s2", kind: "compare", title: "Mặt phẳng và không gian",
      columns: [
        { title: "Mặt phẳng", bullets: ["Quy tắc hình bình hành", "Hai vectơ"] },
        { title: "Không gian", bullets: ["Quy tắc hình hộp", "Ba vectơ"] },
      ],
    },
  ],
}, null, 2), "utf8")

// ── examples/full.json — phủ ĐỦ mọi bố cục ───────────────────────────────────
const B = ["Ý thứ nhất của slide", "Ý thứ hai", "Ý thứ ba", "Ý thứ tư"]
const C = [
  { title: "Cột A", bullets: ["a1", "a2"] },
  { title: "Cột B", bullets: ["b1", "b2"] },
  { title: "Cột C", bullets: ["c1"] },
]
// PNG 1×1 trong suốt — đủ để bố cục cần ảnh mở khoá mà file mẫu không phình
const PX = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

writeFileSync(join(root, "examples/full.json"), JSON.stringify({
  version: 1,
  title: `Mẫu đủ ${LAYOUTS.length} bố cục`,
  theme: "navy-gold",
  foot: "deck-kit · ví dụ đầy đủ",
  assets: { img1: PX, img2: PX },
  slides: LAYOUTS.map((l, i) => {
    const s = {
      id: `s${i}`, kind: l.key, kicker: l.group,
      title: l.label, subtitle: `Bố cục \`${l.key}\``,
    }
    if (l.renders.includes("bullets")) s.bullets = B
    if (l.renders.includes("columns")) s.columns = C.slice(0, l.maxColumns || 3)
    if (l.renders.includes("image")) s.image = { asset: "img1", title: "Hình minh hoạ" }
    if (l.renders.includes("images")) s.images = [{ asset: "img1" }, { asset: "img2" }]
    if (l.renders.includes("formula")) s.formula = "AB + AD + AA' = AC'"
    if (l.renders.includes("table")) s.table = [["Tiêu chí", "Giá trị"], ["a", "b"], ["c", "d"]]
    if (l.renders.includes("question")) {
      s.question = { index: 1, stem: "Tổng ba vectơ chung gốc bằng vectơ nào?",
                     options: ["A. Đường chéo hình hộp", "B. Cạnh bên"] }
      s.notes = "ĐÁP ÁN: A"
    }
    if (!l.selectable) s.locked = true
    return s
  }),
}, null, 2), "utf8")

console.log(`docs/layouts.md: ${LAYOUTS.length} bố cục · examples/{minimal,full}.json OK`)
