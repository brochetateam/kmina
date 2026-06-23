@echo off
REM ============================================
REM  Kmina · Servidor local para desarrollo
REM  Doble-click para abrir la web en el navegador
REM ============================================

echo.
echo  Iniciando servidor local en http://localhost:8000
echo  Abre esa URL en tu navegador.
echo  Cierra esta ventana para detener el servidor.
echo.

REM Intentar Python 3
where python >nul 2>&1
if %errorlevel% == 0 (
  start "" http://localhost:8000
  python -m http.server 8000
  goto :eof
)

REM Intentar Node
where npx >nul 2>&1
if %errorlevel% == 0 (
  start "" http://localhost:8000
  npx --yes http-server -p 8000 -c-1
  goto :eof
)

echo.
echo  ERROR: no se encontro Python ni Node.js instalados.
echo  Instala Python desde https://python.org o Node desde https://nodejs.org
echo  O despliega el sitio en GitHub Pages (la web funciona ahi directamente).
echo.
pause
