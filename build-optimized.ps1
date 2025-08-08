# Script optimizado para build en producción
# Asegurar que el sistema está limpio y optimizado

Write-Host "🚀 Iniciando build optimizado del sistema..." -ForegroundColor Green

# 1. Limpiar cache y archivos temporales
Write-Host "🧹 Limpiando cache y archivos temporales..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "node_modules/.cache") { Remove-Item -Recurse -Force "node_modules/.cache" }
if (Test-Path ".eslintcache") { Remove-Item -Force ".eslintcache" }

# 2. Verificar y limpiar node_modules si es necesario
$nodeModulesSize = if (Test-Path "node_modules") { (Get-ChildItem -Recurse "node_modules" | Measure-Object -Property Length -Sum).Sum / 1MB } else { 0 }
if ($nodeModulesSize -gt 500) {
    $sizeMB = [math]::Round($nodeModulesSize, 2)
    Write-Host "📦 node_modules es muy grande ($sizeMB MB), limpiando..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    npm install --production=false
}

# 3. Optimizar dependencias
Write-Host "⚡ Optimizando dependencias..." -ForegroundColor Yellow
npm prune
npm dedupe

# 4. Ejecutar build con optimizaciones
Write-Host "🔨 Ejecutando build optimizado..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Build con análisis de bundle si se especifica
if ($args -contains "--analyze") {
    Write-Host "📊 Build con análisis de bundle..." -ForegroundColor Cyan
    npm run build -- --experimental-build-mode=compile
} else {
    npm run build
}

# 5. Verificar el resultado del build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completado exitosamente!" -ForegroundColor Green
    
    # Mostrar estadísticas del build
    if (Test-Path ".next") {
        $buildSize = (Get-ChildItem -Recurse ".next" | Measure-Object -Property Length -Sum).Sum / 1MB
        $buildSizeMB = [math]::Round($buildSize, 2)
        Write-Host "📦 Tamaño del build: $buildSizeMB MB" -ForegroundColor Cyan
    }
    
    # Limpiar archivos innecesarios después del build
    if (Test-Path ".next/cache") { 
        $cacheSize = (Get-ChildItem -Recurse ".next/cache" | Measure-Object -Property Length -Sum).Sum / 1MB
        $cacheSizeMB = [math]::Round($cacheSize, 2)
        Write-Host "🗑️  Limpiando cache de build ($cacheSizeMB MB)..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force ".next/cache" -ErrorAction SilentlyContinue
    }
    
    Write-Host "🎉 Sistema optimizado y listo para producción!" -ForegroundColor Green
} else {
    Write-Host "❌ Error en el build. Revisando logs..." -ForegroundColor Red
    exit 1
}
