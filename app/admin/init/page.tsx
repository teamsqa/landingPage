'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Input } from '@/app/ui';
import { showToast } from '@/app/components/Toast';

interface SystemStatus {
  hasAdmin: boolean;
  canInitialize: boolean;
  loading: boolean;
}

export default function InitAdminPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    hasAdmin: false,
    canInitialize: true,
    loading: true
  });

  // Verificar el estado del sistema al cargar la página
  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/init');
      if (response.ok) {
        const data = await response.json();
        setSystemStatus({
          hasAdmin: data.hasAdmin || false,
          canInitialize: data.canInitialize || false,
          loading: false
        });
        
        if (data.hasAdmin) {
          showToast.warning('Ya existe un administrador en el sistema');
        }
      } else {
        throw new Error('Error al verificar el estado del sistema');
      }
    } catch (error) {
      console.error('Error checking system status:', error);
      setSystemStatus(prev => ({ ...prev, loading: false }));
      showToast.error('Error al verificar el estado del sistema');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'El nombre completo es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast.success('¡Administrador creado exitosamente!');
        showToast.info('Redirigiendo al panel de administración...');
        
        // Limpiar formulario
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          displayName: ''
        });

        // Actualizar estado del sistema
        setSystemStatus(prev => ({
          ...prev,
          hasAdmin: true,
          canInitialize: false
        }));

        // Redirigir después de un breve delay
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      } else {
        showToast.error(data.message || 'Error al crear el administrador');
      }
    } catch (error) {
      showToast.error('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (systemStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Verificando estado del sistema...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (systemStatus.hasAdmin || !systemStatus.canInitialize) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sistema ya inicializado
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Ya existe un administrador en el sistema. Esta función no está disponible.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/admin/login'}
            >
              Ir al panel de administración
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lime-100 dark:bg-lime-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Configuración Inicial
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Crea el primer usuario administrador del sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre completo *
            </label>
            <Input
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="Juan Pérez"
              error={errors.displayName}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="admin@empresa.com"
              error={errors.email}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña *
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Mínimo 6 caracteres"
              error={errors.password}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar contraseña *
            </label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirma tu contraseña"
              error={errors.confirmPassword}
              disabled={loading}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creando administrador...' : 'Crear Administrador'}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            ⚠️ Esta página solo funciona si no existe ningún administrador en el sistema.
            Una vez creado, esta función se deshabilitará automáticamente.
          </p>
        </div>
      </Card>
    </div>
  );
}
