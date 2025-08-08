# Script para iniciar desarrollo sin problemas de permisos
Write-Host "🧹 Limpiando archivos temporales..." -ForegroundColor Yellow

# Limpiar directorio .next
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Directorio .next eliminado" -ForegroundColor Green
}

# Limpiar caché de node_modules
if (Test-Path "node_modules\.cache") {
    Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Caché de node_modules eliminada" -ForegroundColor Green
}

# Terminar procesos Node.js
Write-Host "🔄 Terminando procesos Node.js existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Liberar puertos
Write-Host "🔓 Liberando puertos 3000 y 3001..." -ForegroundColor Yellow
$processes = netstat -ano | Select-String ":3000" | ForEach-Object { ($_ -split '\s+')[4] }
$processes += netstat -ano | Select-String ":3001" | ForEach-Object { ($_ -split '\s+')[4] }
$processes | Where-Object { $_ -and $_ -ne "0" } | ForEach-Object { 
    taskkill /F /PID $_ 2>$null
}

# Configurar variables de entorno
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NODE_OPTIONS = "--max-old-space-size=4096"

Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Green
npm run dev
