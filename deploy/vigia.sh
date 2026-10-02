#!/bin/bash
# Vigia do portal: roda no servidor a cada 5 minutos (cron).
# Confere o caminho que o visitante usa (HTTPS -> nginx -> Java -> banco), os
# contêineres, o disco e a memória. Se algo falhar, tenta religar e avisa no
# celular pelo ntfy (https://ntfy.sh): uma vez quando cai e outra quando volta.
#
# Tópico do ntfy em ~/ccz/.ntfy-topico (quem souber o nome recebe os avisos).
# Para receber: app ntfy no celular -> inscrever-se no tópico.
set -u
DIR=/home/opc/ccz
COMPOSE="docker compose -f $DIR/docker-compose.micro.yml"
TOPICO=$(cat "$DIR/.ntfy-topico" 2>/dev/null)
ESTADO="$DIR/.vigia-fora-do-ar"
HOST=$(grep '^SITE_DOMAIN=' "$DIR/.env" | cut -d= -f2-)

verificar() {
  local falhas=""
  curl -fsS -o /dev/null -m 20 --resolve "$HOST:443:127.0.0.1" "https://$HOST/" || falhas+="site "
  curl -fsS -o /dev/null -m 30 --resolve "$HOST:443:127.0.0.1" "https://$HOST/api/configuracaoGlobal" || falhas+="api "
  for c in ccz-db-1 ccz-backend-1 ccz-frontend-1 ccz-caddy-1; do
    [ "$(docker inspect -f '{{.State.Running}}' "$c" 2>/dev/null)" = "true" ] || falhas+="$c "
  done
  local disco memoria
  disco=$(df --output=pcent / | tail -1 | tr -dc 0-9)
  [ "$disco" -ge 90 ] && falhas+="disco-${disco}% "
  memoria=$(free -m | awk '/^Mem:/{print $7}')
  [ "$memoria" -lt 50 ] && falhas+="memoria-livre-${memoria}MB "
  echo "$falhas"
}

avisar() { # titulo, mensagem, prioridade
  [ -n "$TOPICO" ] || return 0
  curl -s -m 15 -H "Title: $1" -H "Priority: $3" -H "Tags: dog" -d "$2" "https://ntfy.sh/$TOPICO" >/dev/null
}

falhas=$(verificar)
if [ -n "$falhas" ]; then
  # O Java leva ~1 min para subir: só age se a falha persistir na segunda checagem.
  sleep 90
  falhas=$(verificar)
fi

agora=$(TZ=America/Fortaleza date '+%d/%m %H:%M')
if [ -n "$falhas" ]; then
  $COMPOSE up -d >/dev/null 2>&1
  if [ ! -f "$ESTADO" ]; then
    avisar "Portal do CCZ com problema" "Falhou: ${falhas}($agora). Tentei religar os serviços automaticamente." high
    echo "$agora $falhas" > "$ESTADO"
  fi
  echo "$agora FALHA: $falhas" >> "$DIR/vigia.log"
elif [ -f "$ESTADO" ]; then
  avisar "Portal do CCZ voltou" "Tudo normal desde $agora (problema começou em $(cut -d' ' -f1-2 "$ESTADO"))." default
  rm -f "$ESTADO"
  echo "$agora voltou ao normal" >> "$DIR/vigia.log"
fi
