'use client';
import React from 'react';
import AdminLayout from '@/app/admin/components/AdminLayout';
import { Button, Card } from '@/app/ui';
import { showToast } from '@/app/components/Toast';
import { useConfirm } from '@/app/components/ConfirmModal';

export default function NotificationDemo() {
  const { confirm, ConfirmComponent } = useConfirm();

  const handleSuccessToast = () => {
    showToast.success('¡Operación completada exitosamente!');
  };

  const handleErrorToast = () => {
    showToast.error('¡Oops! Algo salió mal');
  };

  const handleWarningToast = () => {
    showToast.warning('Ten cuidado con esta acción');
  };

  const handleInfoToast = () => {
    showToast.info('Aquí tienes información importante');
  };

  const handleLoadingToast = () => {
    const id = showToast.loading('Procesando...');
    setTimeout(() => {
      showToast.success('¡Proceso completado!');
    }, 3000);
  };

  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('¡Éxito!') : reject(new Error('Error simulado'));
      }, 2000);
    });

    showToast.promise(promise, {
      loading: 'Procesando datos...',
      success: 'Datos procesados correctamente',
      error: 'Error al procesar los datos',
    });
  };

  const handleCustomToast = () => {
    showToast.custom(
      'Nueva actualización disponible',
      'Actualizar',
      () => {
        showToast.success('¡Sistema actualizado!');
      }
    );
  };

  const handleConfirmModal = async () => {
    const confirmed = await confirm({
      title: 'Confirmar Acción',
      message: '¿Estás seguro de que quieres proceder con esta acción?',
      confirmText: 'Sí, proceder',
      cancelText: 'Cancelar',
      type: 'info'
    });

    if (confirmed) {
      showToast.success('¡Acción confirmada!');
    } else {
      showToast.info('Acción cancelada');
    }
  };

  const handleDangerConfirm = async () => {
    const confirmed = await confirm({
      title: '⚠️ Eliminar Elemento',
      message: 'Esta acción es irreversible. ¿Estás seguro de que quieres eliminar este elemento?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      showToast.success('🗑️ Elemento eliminado');
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            🎨 Demo de Notificaciones
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Panel de pruebas para el sistema de notificaciones - Solo Admin
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Toast Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Toast Notifications
            </h2>
            <div className="space-y-3">
              <Button onClick={handleSuccessToast} variant="primary" fullWidth>
                🎉 Notificación de Éxito
              </Button>
              <Button onClick={handleErrorToast} variant="danger" fullWidth>
                ❌ Notificación de Error
              </Button>
              <Button onClick={handleWarningToast} variant="warning" fullWidth>
                ⚠️ Notificación de Advertencia
              </Button>
              <Button onClick={handleInfoToast} variant="secondary" fullWidth>
                ℹ️ Notificación de Info
              </Button>
              <Button onClick={handleLoadingToast} variant="orange" fullWidth>
                ⏳ Notificación de Carga
              </Button>
              <Button onClick={handlePromiseToast} variant="primary" fullWidth>
                🔄 Notificación Promise
              </Button>
              <Button onClick={handleCustomToast} variant="secondary" fullWidth>
                🔔 Notificación Personalizada
              </Button>
            </div>
          </Card>

          {/* Confirm Modals */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Modales de Confirmación
            </h2>
            <div className="space-y-3">
              <Button onClick={handleConfirmModal} variant="primary" fullWidth>
                ✅ Modal de Confirmación
              </Button>
              <Button onClick={handleDangerConfirm} variant="danger" fullWidth>
                🗑️ Modal de Peligro
              </Button>
            </div>
            
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Características:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>✨ Animaciones suaves</li>
                <li>🎨 Gradientes coloridos</li>
                <li>📱 Responsive design</li>
                <li>🌙 Soporte dark mode</li>
                <li>🔄 Estados de carga</li>
                <li>🎯 Promesas automáticas</li>
                <li>⚡ Personalizable</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Panel de Información para Desarrolladores */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📋 Información para Desarrolladores
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Importación:</h3>
              <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                import &#123; showToast &#125; from '@/app/components/Toast';
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Uso básico:</h3>
              <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                showToast.success(&apos;¡Éxito!&apos;);
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Modal de confirmación:</h3>
              <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                const confirmed = await confirm(&#123;...&#125;);
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Promesas:</h3>
              <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                showToast.promise(asyncOperation, &#123;...&#125;);
              </code>
            </div>
          </div>
        </Card>

        <ConfirmComponent />
      </div>
    </AdminLayout>
  );
}
