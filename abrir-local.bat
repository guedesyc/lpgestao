@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale o Node.js 22 ou superior e tente novamente.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias do projeto...
  call npm.cmd install
  if errorlevel 1 (
    echo Nao foi possivel instalar as dependencias.
    pause
    exit /b 1
  )
)

echo.
echo LP Gestao local
echo Acesse: http://localhost:3000
echo.
echo Mantenha esta janela aberta enquanto estiver usando o sistema.
echo Para parar, pressione Ctrl+C.
echo.

start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 4; Start-Process 'http://localhost:3000'"
call npm.cmd run dev

endlocal
