#!/bin/bash

# Script para desplegar optimizaciones de rendimiento
# Ejecutar desde la raíz del proyecto

echo "🚀 Desplegando optimizaciones de rendimiento para TeamsQA..."

# Verificar que Firebase CLI esté instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado. Instalando..."
    npm install -g firebase-tools
fi

# Login a Firebase (si no está logueado)
echo "🔐 Verificando autenticación Firebase..."
firebase login --no-localhost

# Verificar proyecto Firebase
echo "📋 Verificando proyecto Firebase..."
firebase use --add

echo "📊 Desplegando índices de Firestore..."
firebase deploy --only firestore:indexes

echo "🛡️ Desplegando reglas de Firestore..."
firebase deploy --only firestore:rules

# Opcional: Desplegar funciones si existen
if [ -d "functions" ]; then
    echo "⚡ Desplegando funciones Firebase..."
    firebase deploy --only functions
fi

echo "✅ Despliegue completado!"
echo ""
echo "📝 Notas importantes:"
echo "1. Los índices pueden tardar varios minutos en crearse"
echo "2. Verificar en Firebase Console que estén activos"
echo "3. Probar las APIs optimizadas después del despliegue"
echo ""
echo "🔗 Enlaces útiles:"
echo "- Firebase Console: https://console.firebase.google.com"
echo "- Índices de Firestore: https://console.firebase.google.com/project/$(firebase use)/firestore/indexes"
echo ""
echo "🎉 ¡El sitio debería ser notablemente más rápido ahora!"
