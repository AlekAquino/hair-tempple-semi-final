#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
task_tmp="$(mktemp -d)"
mkdir -p "$project_root/asset/production/products" "$project_root/public/asset/production/products"

while IFS='|' read -r slug page; do
  page_html="$task_tmp/$slug.html"
  curl -L --fail --silent --show-error --max-time 30 "$page" -o "$page_html"
  image_url="$(perl -0777 -ne 'if (/property="og:image".*?content="([^"]+)"/s) { print $1 } elsif (/content="([^"]+)".*?property="og:image"/s) { print $1 }' "$page_html")"
  image_url="${image_url/http:/https:}"

  if [[ -z "$image_url" ]]; then
    printf 'Imagem não localizada: %s\n' "$slug" >&2
    exit 1
  fi

  curl -L --fail --silent --show-error --max-time 40 "$image_url" -o "$project_root/asset/production/products/$slug"
  cp "$project_root/asset/production/products/$slug" "$project_root/public/asset/production/products/$slug"
  printf 'Baixado: %s\n' "$slug"
done <<'EOF'
thermal-clean.webp|https://tksk.com.br/produtos/thermal-clean-200ml/
cmc-shampoo.webp|https://tksk.com.br/produtos/shampoo-hidratante-cmc-interactive-200ml-nova-embalagem/
cmc-condicionador.webp|https://tksk.com.br/produtos/condicionador-hidratante-cmc-interactive-200g-nova-embalagem/
cmc-mask.webp|https://tksk.com.br/produtos/mascara-ultra-hidratante-cmc-interactive-250g/
4-deep-types.webp|https://tksk.com.br/produtos/reconstrutor-4-deep-types-200g/
omg-oil.webp|https://tksk.com.br/produtos/oleo-finalizador-anti-aging-omg-oil-60ml/
b-free.webp|https://tksk.com.br/produtos/leave-in-reconstrutor-b-free-100g/
mizu-suplemento.webp|https://tksk.com.br/produtos/suplemento-capilar-mizu-200ml/
mizu-interactive.webp|https://tksk.com.br/produtos/mizu-interactive-redutor-de-volume-200ml/
detox-energize.webp|https://tksk.com.br/produtos/desintoxicante-de-couro-cabeludo-detox-energize-100g/
dpg-active.webp|https://tksk.com.br/produtos/tonico-antiqueda-e-nascimento-dos-fios-dpg-active-120ml/
shampoo-cloves.png|https://eaebrazil.com.br/products/shampoo-cloves-cinnamon-and-rosemary-eae-brazil
shampoo-ozonated.png|https://eaebrazil.com.br/products/shampoo-melaleuca-ozonated-oil-300-ml
shampoo-detox.png|https://eaebrazil.com.br/products/shampoo-mint-detox-300ml-eae-brazil
EOF
