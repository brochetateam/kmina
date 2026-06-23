#!/usr/bin/env bash
# ============================================
#  Kmina · Servidor local para desarrollo
#  ./start.sh para abrir la web en el navegador
# ============================================

PORT=${1:-8000}

echo ""
echo "  Iniciando servidor local en http://localhost:$PORT"
echo "  Abre esa URL en tu navegador."
echo "  Ctrl+C para detener."
echo ""

open_browser() {
  sleep 1
  if command -v xdg-open >/dev/null; then xdg-open "$1"
  elif command -v open >/dev/null; then open "$1"
  fi
}

if command -v python3 >/dev/null; then
  open_browser "http://localhost:$PORT" &
  python3 -m http.server $PORT
elif command -v python >/dev/null; then
  open_browser "http://localhost:$PORT" &
  python -m http.server $PORT
elif command -v npx >/dev/null; then
  open_browser "http://localhost:$PORT" &
  npx --yes http-server -p $PORT -c-1
else
  echo "  ERROR: instala Python o Node.js"
  exit 1
fi
