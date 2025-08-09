import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app);

// Inicializar messaging solo en cliente y si está soportado
let messaging: any = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

// Función para solicitar permiso y obtener token FCM
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.warn('Firebase Messaging no está disponible');
      return null;
    }

    // Verificar si ya tenemos permiso
    if (Notification.permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      
      if (currentToken) {
        console.log('Token FCM obtenido:', currentToken);
        return currentToken;
      } else {
        console.log('No se pudo obtener el token FCM');
        return null;
      }
    }

    // Solicitar permiso
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Permisos de notificación concedidos');
      
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      
      if (currentToken) {
        console.log('Token FCM obtenido:', currentToken);
        return currentToken;
      } else {
        console.log('No se pudo obtener el token FCM');
        return null;
      }
    } else {
      console.log('Permisos de notificación denegados');
      return null;
    }
  } catch (error) {
    console.error('Error al solicitar permisos:', error);
    return null;
  }
};

// Función para escuchar mensajes en primer plano
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      console.warn('Firebase Messaging no está disponible');
      return;
    }
    
    onMessage(messaging, (payload) => {
      console.log('Mensaje recibido en primer plano:', payload);
      resolve(payload);
    });
  });
};

export { app, auth, db, messaging };