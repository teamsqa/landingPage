# 📧🔔 Sistema de Notificaciones y Email - TeamsQA

Este documento explica cómo configurar y usar el sistema completo de notificaciones por email y Firebase Cloud Messaging (FCM) en la aplicación TeamsQA.

## 📋 Características Implementadas

### ✅ Sistema de Email
- ✅ **Emails de confirmación** para suscripciones al newsletter
- ✅ **Emails de confirmación** para inscripciones a cursos
- ✅ **Notificaciones al administrador** cuando hay nuevas inscripciones
- ✅ **Emails de respuesta** para inscripciones (aprobado/rechazado)
- ✅ **Sistema de templates HTML** personalizados
- ✅ **Soporte para múltiples proveedores** (SMTP, SendGrid, Resend, Mailgun)

### ✅ Sistema de Notificaciones Push (Firebase)
- ✅ **Firebase Cloud Messaging** configurado
- ✅ **Service Worker** para notificaciones en segundo plano
- ✅ **Hook de React** para manejar notificaciones
- ✅ **Componente de interfaz** para solicitar permisos
- ✅ **APIs para enviar notificaciones** individuales y masivas
- ✅ **Sistema de tokens** para usuarios registrados

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y configura las variables necesarias:

```bash
cp .env.example .env.local
```

#### Configuración de Firebase
```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="your-private-key-with-quotes"

# Firebase Cloud Messaging
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

#### Configuración de Email (Elige una opción)

**OPCIÓN 1: SMTP (Gmail - Recomendado para desarrollo)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
FROM_EMAIL=noreply@teamsqa.com
```

**OPCIÓN 2: SendGrid (Recomendado para producción)**
```env
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@teamsqa.com
```

**OPCIÓN 3: Resend (Moderno y fácil)**
```env
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@teamsqa.com
```

#### Configuración Adicional
```env
NEXT_PUBLIC_SITE_URL=https://teamsqa.com
ADMIN_NOTIFICATION_EMAIL=admin@teamsqa.com
```

### 2. Configuración de Firebase Cloud Messaging

#### 2.1 Generar VAPID Key
1. Ve a Firebase Console → Tu Proyecto → Project Settings → Cloud Messaging
2. En la sección "Web configuration", genera las claves VAPID
3. Copia la clave pública a `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

#### 2.2 Actualizar Service Worker
Edita `/public/firebase-messaging-sw.js` con tu configuración de Firebase:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com", 
  projectId: "tu-proyecto-id",
  // ... resto de la configuración
};
```

### 3. Configuración de SMTP con Gmail

Para usar Gmail como servidor SMTP:

1. **Activa la verificación en 2 pasos** en tu cuenta de Google
2. Ve a **"Contraseñas de aplicaciones"** en la configuración de tu cuenta
3. **Genera una nueva contraseña de aplicación**
4. Usa esa contraseña en `SMTP_PASSWORD` (NO tu contraseña normal)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=generated-app-password
FROM_EMAIL=noreply@tudominio.com
```

## 📱 Uso del Sistema

### Integrar Notificaciones en tu App

#### 1. Agregar el NotificationManager al Layout

```tsx
// app/layout.tsx
import NotificationManager from '@/app/components/NotificationManager';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NotificationManager 
          showPermissionRequest={true}
          enableAutoRequest={false}
        >
          {children}
        </NotificationManager>
      </body>
    </html>
  );
}
```

#### 2. Usar el Hook en Componentes

```tsx
// Cualquier componente
import { useNotifications } from '@/app/hooks/useNotifications';

function MyComponent() {
  const { 
    canShowNotifications, 
    requestPermission, 
    sendTestNotification 
  } = useNotifications();

  const handleEnableNotifications = async () => {
    await requestPermission();
  };

  return (
    <div>
      {!canShowNotifications && (
        <button onClick={handleEnableNotifications}>
          Activar Notificaciones
        </button>
      )}
      
      {canShowNotifications && (
        <button onClick={sendTestNotification}>
          Enviar Notificación de Prueba
        </button>
      )}
    </div>
  );
}
```

## 🔧 APIs Disponibles

### 📧 APIs de Email

#### 1. Suscripción al Newsletter
```bash
POST /api/subscribe
Content-Type: application/json

{
  "email": "usuario@example.com"
}
```

**Funcionalidad:**
- ✅ Guarda el email en Firestore
- ✅ Verifica duplicados
- ✅ Envía email de bienvenida automáticamente

#### 2. Inscripción a Cursos
```bash
POST /api/inscripcion
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "course": "Automatización con Selenium",
  "phone": "+1234567890"
}
```

**Funcionalidad:**
- ✅ Guarda inscripción en Firestore
- ✅ Envía confirmación al candidato
- ✅ Notifica al administrador

#### 3. Enviar Respuesta de Inscripción
```bash
POST /api/send-notification
Content-Type: application/json

{
  "registrationId": "doc-id",
  "candidateName": "Juan Pérez",
  "candidateEmail": "juan@example.com",
  "courseName": "Curso de Testing",
  "status": "approved", // "approved" | "rejected"
  "customMessage": "¡Felicitaciones! Has sido aceptado."
}
```

### 🔔 APIs de Notificaciones Push

#### 1. Registrar Token FCM
```bash
POST /api/notifications/register-token
Content-Type: application/json

{
  "token": "fcm-token-aqui",
  "userId": "optional-user-id",
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "platform": "web"
  }
}
```

#### 2. Enviar Notificación de Prueba
```bash
POST /api/notifications/send-test
Content-Type: application/json

{
  "token": "fcm-token-aqui",
  "title": "Título de la notificación",
  "body": "Contenido del mensaje",
  "data": { "url": "https://teamsqa.com" }
}
```

#### 3. Enviar Notificación Masiva
```bash
POST /api/notifications/send-broadcast
Content-Type: application/json

{
  "payload": {
    "title": "🎉 Nueva funcionalidad disponible",
    "body": "Descubre las nuevas herramientas de testing",
    "imageUrl": "https://example.com/image.jpg",
    "clickAction": "https://teamsqa.com/nuevas-funcionalidades"
  },
  "options": {
    "sendPush": true,
    "sendEmail": true,
    "targetAudience": "all" // "all" | "subscribers" | "users" | "specific"
  }
}
```

**Audiencias disponibles:**
- `all`: Todos los tokens FCM y emails registrados
- `subscribers`: Solo suscriptores del newsletter
- `users`: Solo usuarios registrados
- `specific`: Tokens/emails específicos (requiere `specificTokens` o `specificEmails`)

## 📊 Estructura de Datos en Firestore

### Colección: `subscribers`
```json
{
  "email": "usuario@example.com",
  "subscribedAt": "2024-01-15T10:30:00Z",
  "status": "active",
  "source": "website"
}
```

### Colección: `registrations`
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "course": "Curso de Testing",
  "phone": "+1234567890",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Colección: `fcm_tokens`
```json
{
  "token": "fcm-token-string",
  "userId": "user-id",
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "platform": "web"
  },
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Colección: `notification_logs`
```json
{
  "payload": {
    "title": "Título",
    "body": "Mensaje",
    "clickAction": "url"
  },
  "results": {
    "push": { "successCount": 150, "failureCount": 5 },
    "email": { "successCount": 200, "failureCount": 2 }
  },
  "sentAt": "2024-01-15T10:30:00Z",
  "totalRecipients": 357
}
```

## 🧪 Testing

### Probar Emails (Desarrollo)
Durante el desarrollo, el sistema usará el `DemoEmailService` que registra los emails en la consola sin enviarlos realmente.

Para probar con emails reales:
1. Configura las variables de entorno de email
2. Reinicia el servidor de desarrollo
3. Los emails se enviarán automáticamente

### Probar Notificaciones Push
1. Abre las Developer Tools (F12)
2. Ve a la tab "Application" → "Service Workers"
3. Verifica que `firebase-messaging-sw.js` esté registrado
4. Usa el botón "Enviar prueba" en el componente de debug
5. O llama directamente a la API de prueba

### Debug Mode
En desarrollo, verás un panel de debug en la esquina inferior derecha con:
- Estado de soporte de notificaciones
- Permisos actuales
- Token FCM
- Botón para enviar notificación de prueba

## 🔒 Seguridad y Mejores Prácticas

### Variables de Entorno
- ✅ Usa `.env.local` para desarrollo (nunca commitear)
- ✅ Configura las variables en tu hosting (Vercel, Netlify, etc.)
- ✅ Las claves privadas deben ir con comillas dobles

### Email Security
- ✅ Usa contraseñas de aplicación para Gmail
- ✅ Configura SPF/DKIM records para tu dominio
- ✅ Usa direcciones "noreply@" para emails automáticos

### Firebase Security
- ✅ Configura reglas de Firestore apropiadas
- ✅ Restringe las APIs de FCM por dominio
- ✅ Rota las claves VAPID regularmente

## 🐛 Troubleshooting

### Problema: Emails no se envían
**Solución:**
1. Verifica las variables de entorno
2. Revisa la consola para errores de autenticación
3. Para Gmail, asegúrate de usar contraseña de aplicación

### Problema: Notificaciones no aparecen
**Solución:**
1. Verifica que el service worker esté registrado
2. Comprueba los permisos de notificación
3. Revisa la configuración VAPID
4. Verifica las reglas de Firebase

### Problema: Service Worker no se registra
**Solución:**
1. Asegúrate de que el archivo esté en `/public/firebase-messaging-sw.js`
2. Verifica la configuración de Firebase en el service worker
3. Revisa la consola para errores de sintaxis

### Problema: Tokens FCM no se guardan
**Solución:**
1. Verifica las reglas de Firestore
2. Comprueba la configuración de Firebase Admin
3. Revisa los permisos de la service account

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación:
- 📧 Email: dev@teamsqa.com
- 📝 Documentación: Esta guía
- 🐛 Issues: Crear ticket en el repositorio

## 🔄 Actualizaciones Futuras

### Próximas funcionalidades:
- [ ] Dashboard de análisis de notificaciones
- [ ] Plantillas de email personalizables desde admin
- [ ] Segmentación avanzada de usuarios
- [ ] A/B testing para notificaciones
- [ ] Integración con WhatsApp Business
- [ ] Notificaciones programadas

---

**¡El sistema está completamente configurado y listo para usar!** 🚀

Simplemente configura las variables de entorno y todos los emails y notificaciones comenzarán a funcionar automáticamente.
