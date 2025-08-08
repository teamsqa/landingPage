'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Input, Button } from '@/app/ui';
import { showToast } from '@/app/components/Toast';
import TeamsQALogo from '@/app/components/TeamsQALogo';

export default function CompleteInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [invitationInfo, setInvitationInfo] = useState({
    role: searchParams.get('role') || '',
    name: decodeURIComponent(searchParams.get('name') || ''),
    email: ''
  });

  useEffect(() => {
    // Aquí podríamos verificar el token de invitación y obtener más información
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    
    if (mode === 'verifyEmail' && oobCode) {
      // El usuario viene desde el link de verificación de email
      showToast.info('Email verificado exitosamente. Ahora establece tu contraseña.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showToast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      showToast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Aquí implementaríamos la lógica para completar la invitación
      showToast.success('¡Registro completado exitosamente!');
      
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
      
    } catch (error) {
      showToast.error('Error al completar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lime-100 dark:bg-lime-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido a TeamsQA!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Completa tu registro estableciendo una contraseña
          </p>
        </div>

        {invitationInfo.role && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Información de la invitación:
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              <strong>Nombre:</strong> {invitationInfo.name}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              <strong>Rol:</strong> {invitationInfo.role}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva contraseña *
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
              required
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
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirma tu contraseña"
              required
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
              {loading ? 'Completando registro...' : 'Completar Registro'}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            ¿Tienes problemas? Contacta al administrador del sistema.
          </p>
        </div>
      </Card>
    </div>
  );
}
