import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/app/lib/firebase';

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  url?: string;
  data?: any;
}

export const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationData | null>(null);

  useEffect(() => {
    // Verificar si las notificaciones son soportadas
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Función para solicitar permisos y obtener token
  const requestPermission = async (): Promise<string | null> => {
    if (!isSupported) {
      console.warn('Las notificaciones no son soportadas en este navegador');
      return null;
    }

    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        setFcmToken(token);
        setNotificationPermission('granted');
        
        // Guardar token en el servidor si es necesario
        await saveTokenToServer(token);
        
        return token;
      } else {
        setNotificationPermission('denied');
        return null;
      }
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
      return null;
    }
  };

  // Función para guardar el token en el servidor
  const saveTokenToServer = async (token: string) => {
    try {
      // Aquí puedes enviar el token a tu servidor para almacenarlo
      // y poder enviar notificaciones personalizadas
      const response = await fetch('/api/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        console.warn('No se pudo registrar el token en el servidor');
      }
    } catch (error) {
      console.error('Error guardando token en servidor:', error);
    }
  };

  // Escuchar mensajes en primer plano
  useEffect(() => {
    if (notificationPermission === 'granted') {
      onMessageListener()
        .then((payload: any) => {
          console.log('Mensaje recibido en primer plano:', payload);
          
          const notificationData: NotificationData = {
            title: payload.notification?.title || 'TeamsQA',
            body: payload.notification?.body || 'Nueva notificación',
            icon: payload.notification?.icon || '/Logo.svg',
            image: payload.notification?.image,
            url: payload.data?.url || '/',
            data: payload.data
          };

          setNotification(notificationData);

          // Mostrar notificación nativa si la página no está enfocada
          if (document.hidden) {
            showBrowserNotification(notificationData);
          }
        })
        .catch((err: any) => console.log('Error escuchando mensajes:', err));
    }
  }, [notificationPermission]);

  // Función para mostrar notificación nativa del navegador
  const showBrowserNotification = (data: NotificationData) => {
    if (notificationPermission === 'granted') {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon,
        tag: 'teamsqa-notification',
        requireInteraction: true,
        // @ts-ignore - image no es estándar en todos los navegadores
        image: data.image,
        vibrate: [200, 100, 200]
      } as NotificationOptions);

      notification.onclick = () => {
        window.focus();
        if (data.url) {
          window.location.href = data.url;
        }
        notification.close();
      };

      // Auto-cerrar después de 5 segundos si no se interactúa
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  };

  // Función para limpiar la notificación actual
  const clearNotification = () => {
    setNotification(null);
  };

  // Función para enviar notificación de prueba
  const sendTestNotification = async () => {
    if (!fcmToken) {
      console.warn('No hay token FCM disponible');
      return;
    }

    try {
      const response = await fetch('/api/notifications/send-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: fcmToken,
          title: '🎉 Notificación de prueba',
          body: 'Esta es una notificación de prueba desde TeamsQA'
        }),
      });

      if (!response.ok) {
        throw new Error('Error enviando notificación de prueba');
      }

      console.log('Notificación de prueba enviada');
    } catch (error) {
      console.error('Error enviando notificación de prueba:', error);
    }
  };

  return {
    // Estados
    fcmToken,
    notificationPermission,
    isSupported,
    notification,
    
    // Acciones
    requestPermission,
    clearNotification,
    sendTestNotification,
    showBrowserNotification,
    
    // Helpers
    canShowNotifications: notificationPermission === 'granted' && isSupported,
    needsPermission: notificationPermission === 'default' && isSupported,
    permissionDenied: notificationPermission === 'denied'
  };
};
