import React, { useEffect, useState } from 'react';
import { useNotifications, NotificationData } from '@/app/hooks/useNotifications';

interface NotificationManagerProps {
  children?: React.ReactNode;
  showPermissionRequest?: boolean;
  enableAutoRequest?: boolean;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  children,
  showPermissionRequest = true,
  enableAutoRequest = false
}) => {
  const {
    fcmToken,
    notificationPermission,
    isSupported,
    notification,
    requestPermission,
    clearNotification,
    sendTestNotification,
    canShowNotifications,
    needsPermission,
    permissionDenied
  } = useNotifications();

  const [showBanner, setShowBanner] = useState(false);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  // Auto-request permission on mount if enabled
  useEffect(() => {
    if (enableAutoRequest && needsPermission && !hasRequestedPermission) {
      setHasRequestedPermission(true);
      requestPermission();
    }
  }, [enableAutoRequest, needsPermission, hasRequestedPermission, requestPermission]);

  // Show permission banner
  useEffect(() => {
    if (showPermissionRequest && needsPermission && !hasRequestedPermission) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [showPermissionRequest, needsPermission, hasRequestedPermission]);

  // Handle permission request
  const handleRequestPermission = async () => {
    setHasRequestedPermission(true);
    const token = await requestPermission();
    if (token) {
      setShowBanner(false);
    }
  };

  // Handle banner dismiss
  const handleDismissBanner = () => {
    setShowBanner(false);
    setHasRequestedPermission(true);
  };

  // Show in-app notification
  const showInAppNotification = (data: NotificationData) => {
    // Aquí puedes usar tu sistema de toast/notificaciones preferido
    console.log('Mostrando notificación in-app:', data);
    
    // Ejemplo con alert (reemplaza con tu toast preferido)
    if (typeof window !== 'undefined') {
      const shouldShow = window.confirm(
        `${data.title}\n\n${data.body}\n\n¿Deseas abrir el enlace?`
      );
      
      if (shouldShow && data.url) {
        window.open(data.url, '_blank');
      }
    }
  };

  // Handle incoming notification
  useEffect(() => {
    if (notification) {
      showInAppNotification(notification);
      clearNotification();
    }
  }, [notification, clearNotification]);

  if (!isSupported) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Permission Banner */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 z-50 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">🔔 Mantente informado</h3>
                <p className="text-sm opacity-90">
                  Activa las notificaciones para recibir noticias importantes y actualizaciones de cursos
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRequestPermission}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Activar
              </button>
              <button
                onClick={handleDismissBanner}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Children content */}
      <div className={showBanner ? 'mt-16' : ''}>
        {children}
      </div>

      {/* Debug Info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs max-w-sm">
          <h4 className="font-semibold mb-2">🔧 Debug - Notificaciones</h4>
          <div className="space-y-1">
            <div>Soportado: {isSupported ? '✅' : '❌'}</div>
            <div>Permiso: {notificationPermission}</div>
            <div>Token: {fcmToken ? '✅ Registrado' : '❌ No registrado'}</div>
            <div>Puede mostrar: {canShowNotifications ? '✅' : '❌'}</div>
          </div>
          
          {canShowNotifications && (
            <button
              onClick={sendTestNotification}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
            >
              Enviar prueba
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationManager;
