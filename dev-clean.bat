@echo off
echo Limpiando archivos temporales...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Terminando procesos Node.js existentes...
taskkill /F /IM node.exe 2>nul

echo Iniciando servidor de desarrollo...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--max-old-space-size=4096
npm run dev
