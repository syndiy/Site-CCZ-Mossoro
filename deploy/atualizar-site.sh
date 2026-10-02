#!/bin/bash
# Troca o site no servidor por um build novo, sem compilar nada na VM.
# Espera ~/ccz/site.tar.gz com a pasta out/ e o nginx.conf (gerados fora).
# Monta a imagem nova em cima da atual, guarda a anterior e, se a página nova
# não responder, volta sozinho para a anterior.
set -euo pipefail
cd /home/opc/ccz
COMPOSE="docker compose -f docker-compose.micro.yml"
HOST=$(grep '^SITE_DOMAIN=' .env | cut -d= -f2-)

rm -rf build-site && mkdir build-site
tar -xzf site.tar.gz -C build-site
test -f build-site/out/index.html || { echo "pacote sem out/index.html"; exit 1; }
printf 'FROM ccz-frontend:latest\nRUN rm -rf /usr/share/nginx/html/*\nCOPY out/ /usr/share/nginx/html/\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\n' > build-site/Dockerfile

# Valida o nginx novo antes de trocar.
docker run --rm --add-host backend:127.0.0.1 -v "$PWD/build-site/nginx.conf:/etc/nginx/conf.d/default.conf:ro" ccz-frontend:latest nginx -t

docker tag ccz-frontend:latest ccz-frontend:anterior
docker build -q -t ccz-frontend:latest build-site >/dev/null
$COMPOSE up -d frontend >/dev/null 2>&1
sleep 3

if curl -fsS -o /dev/null -m 20 --resolve "$HOST:443:127.0.0.1" "https://$HOST/"; then
  echo "site atualizado $(TZ=America/Fortaleza date '+%d/%m %H:%M')"
  rm -rf build-site site.tar.gz
else
  echo "a página nova não respondeu: voltando para a anterior"
  docker tag ccz-frontend:anterior ccz-frontend:latest
  $COMPOSE up -d frontend >/dev/null 2>&1
  exit 1
fi
