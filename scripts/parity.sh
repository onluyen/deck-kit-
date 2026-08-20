#!/usr/bin/env bash
# Cổng SO ẢNH: renderer Python (`slides_html`) ⇄ thư viện TS (`@mvng267/deck-kit`).
#
# ⚠️ CỔNG DI TRÚ LỊCH SỬ — KHÔNG còn là điều kiện merge (2026-08).
#
# Nó sinh ra để chứng minh bản port TS không làm hỏng bản Python gốc. Việc di trú đã xong:
# `deck_to_pptx` nay CHỈ dùng bundle deck-kit, thiếu bundle thì báo lỗi chứ không lùi về
# renderer Python. Bên Python đứng lại ở 33 bố cục trong khi manifest có 46, nên cổng này
# chỉ phủ 36/46 và sẽ teo dần — đừng nhận nợ giữ nó xanh.
#
# Hạn chế cố hữu: nó chỉ khẳng định HAI RENDERER GIỐNG NHAU, không khẳng định ĐẸP/ĐÚNG —
# lỗi có ở cả hai bên thì nó im lặng (đã gặp thật: `.cmptbl` lệch cột, cả hai cùng lệch).
#
# Cổng THAY THẾ, chạy sau mỗi lần đổi CSS:
#   docker compose exec -T backend python -m app.tools.lesson_plan.layout_test      # 46×3
#   docker compose exec -T backend python -m app.tools.lesson_plan.real_test --all  # 990 slide thật
#
# Chạy từ gốc repo. Cần container `backend` đang chạy (Playwright + PIL nằm trong đó).
# Quét 36 bố cục × 3 mức dữ liệu × 4 theme; chỉ được coi là ĐẠT khi lệch ~0 pixel.
set -euo pipefail
cd "$(dirname "$0")/../../.."

LEVELS="${LEVELS:-thin fit over}"
THEMES="${THEMES:-navy-gold slate-cyan ink-amber forest-lime}"

echo "▸ build deck-kit"
npm run build -w @mvng267/deck-kit >/dev/null
npm run sync:css >/dev/null

echo "▸ đồng bộ file vào container"
for f in parity.py deck_samples.py deck_json.py slides_html.py; do
  docker compose cp "backend/app/tools/lesson_plan/$f" "backend:/app/app/tools/lesson_plan/$f" >/dev/null 2>&1
done
for f in base.css edit.css; do
  docker compose cp "backend/app/tools/lesson_plan/assets/$f" \
    "backend:/app/app/tools/lesson_plan/assets/$f" >/dev/null 2>&1
done
docker compose exec -T backend mkdir -p /app/outputs/_parity
docker compose exec -T backend chmod -R 777 /app/outputs/_parity

for level in $LEVELS; do
  for theme in $THEMES; do
    echo "▸ $level / $theme"
    # 1. Python sinh HTML + DeckJson
    docker compose exec -T backend python -c "
from app.tools.lesson_plan.parity import emit_inputs
emit_inputs('$level', '$theme')" >/dev/null

    # 2. deck-kit dựng HTML từ chính DeckJson đó
    docker compose cp "backend:/app/outputs/_parity/deck-$level.json" \
      "/tmp/deck-$level.json" >/dev/null 2>&1
    node packages/deck-kit/scripts/render-json.mjs \
      "/tmp/deck-$level.json" "/tmp/ts-$level.html" >/dev/null
    docker compose cp "/tmp/ts-$level.html" \
      "backend:/app/outputs/_parity/ts-$level.html" >/dev/null 2>&1

    # 3. Chụp 2 bên rồi so từng pixel
    docker compose exec -T backend python -c "
from pathlib import Path
from app.tools.lesson_plan.parity import OUT, shoot, compare
from app.tools.lesson_plan.deck_samples import all_kinds
kinds = all_kinds()
shoot(OUT/'py-$level.html', OUT/'py-$level-$theme', len(kinds))
shoot(OUT/'ts-$level.html', OUT/'ts-$level-$theme', len(kinds))
rows = compare(OUT/'py-$level-$theme', OUT/'ts-$level-$theme', kinds)
bad = [r for r in rows if r['diff'] is None or r['diff'] > 0.01]
for r in bad:
    print('  LỆCH', r['kind'], r['diff'], r['note'])
print(f\"  {len(rows)-len(bad)}/{len(rows)} khớp\")
"
  done
done
