import { defineConfig } from "tsup"

export default defineConfig([
  {
    // Core + adapter: ESM cho bundler, CJS cho Node/Jest, kèm .d.ts
    entry: { index: "src/index.ts", angular: "src/angular/index.ts", react: "src/react/index.tsx" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    // CSS nạp thành CHUỖI: toHTML() phải ghép được CSS vào file tự chứa, không có <link> để trỏ
    loader: { ".css": "text" },
    external: ["@angular/core", "@angular/common", "react", "react-dom", "pptxgenjs"],
  },
  {
    // Bản IIFE cho <script src> — dùng cho "route shell" của backend + tool pptx_html
    entry: { "deck-kit": "src/iife.ts" },
    format: ["iife"],
    globalName: "DeckKit",
    minify: true,
    sourcemap: false,
    dts: false,
    clean: false,
    loader: { ".css": "text" },
    external: ["pptxgenjs"],
  },
])
