# Script PowerShell para desplegar optimizaciones de rendimiento
# Ejecutar desde la raíz del proyecto con: .\deploy-optimizations.ps1

Write-Host "🚀 Desplegando optimizaciones de rendimiento para TeamsQA..." -ForegroundColor Green

# Verificar que Firebase CLI esté instalado
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseInstalled) {
    Write-Host "❌ Firebase CLI no está instalado. Instalando..." -ForegroundColor Red
    npm install -g firebase-tools
}

# Login a Firebase (si no está logueado)
Write-Host "🔐 Verificando autenticación Firebase..." -ForegroundColor Yellow
firebase login --no-localhost

# Verificar proyecto Firebase
Write-Host "📋 Verificando proyecto Firebase..." -ForegroundColor Yellow
firebase use --add

Write-Host "📊 Desplegando índices de Firestore..." -ForegroundColor Cyan
firebase deploy --only firestore:indexes

Write-Host "🛡️ Desplegando reglas de Firestore..." -ForegroundColor Cyan
firebase deploy --only firestore:rules

# Opcional: Desplegar funciones si existen
if (Test-Path "functions") {
    Write-Host "⚡ Desplegando funciones Firebase..." -ForegroundColor Cyan
    firebase deploy --only functions
}

Write-Host ""
Write-Host "✅ Despliegue completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Notas importantes:" -ForegroundColor Yellow
Write-Host "1. Los índices pueden tardar varios minutos en crearse"
Write-Host "2. Verificar en Firebase Console que estén activos"
Write-Host "3. Probar las APIs optimizadas después del despliegue"
Write-Host ""
Write-Host "🔗 Enlaces útiles:" -ForegroundColor Blue
Write-Host "- Firebase Console: https://console.firebase.google.com"

# Obtener proyecto actual
$currentProject = firebase use --json | ConvertFrom-Json
$projectId = $currentProject.active

if ($projectId) {
    Write-Host "- Índices de Firestore: https://console.firebase.google.com/project/$projectId/firestore/indexes"
} else {
    Write-Host "- Configurar proyecto Firebase primero con 'firebase use --add'"
}

Write-Host ""
Write-Host "🎉 ¡El sitio debería ser notablemente más rápido ahora!" -ForegroundColor Green
