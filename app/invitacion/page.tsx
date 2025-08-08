'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Card, Input } from '@/app/ui';
import { showToast } from '@/app/components/Toast';

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setValidating(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      setValidating(true);
      
      // Decodificar token para mostrar información básica
      const tokenData = JSON.parse(Buffer.from(token!, 'base64url').toString());
      setInvitationData(tokenData);
      
    } catch (error) {
      showToast.error('Token de invitación inválido');
    } finally {
      setValidating(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast.success('¡Invitación aceptada exitosamente!');
        // Redirigir al login o dashboard
        window.location.href = '/admin/login';
      } else {
        showToast.error(data.message || 'Error al aceptar la invitación');
      }
    } catch (error) {
      showToast.error('Error al procesar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'password') setPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Validando invitación...
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Por favor espera mientras verificamos tu invitación.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Invitación no válida
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              El enlace de invitación no es válido o ha expirado.
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/'}>
              Volver al inicio
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
          <div className="w-12 h-12 bg-lime-100 dark:bg-lime-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido a TeamsQA!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Has sido invitado a unirte como <strong>{invitationData?.role || 'usuario'}</strong>
          </p>
          {invitationData?.email && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Cuenta: {invitationData.email}
            </p>
          )}
        </div>

        <form onSubmit={handleAcceptInvitation} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Crear contraseña *
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Ingresa tu contraseña"
              error={errors.password}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar contraseña *
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirma tu contraseña"
              error={errors.confirmPassword}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Aceptar invitación'}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Al aceptar esta invitación, te unes a la plataforma TeamsQA con los permisos
            correspondientes a tu rol asignado.
          </p>
        </div>
      </Card>
    </div>
  );
}
