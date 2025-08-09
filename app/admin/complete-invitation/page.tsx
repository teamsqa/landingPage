'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Button } from '@/app/ui';
import { showToast } from '@/app/components/Toast';
import PasswordInput from '@/app/components/PasswordInput';

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
    email: searchParams.get('email') || '',
    uid: ''
  });

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    const verified = searchParams.get('verified');
    const testMode = searchParams.get('test');
    const email = searchParams.get('email');
    
    if (mode === 'verifyEmail' && oobCode) {
      // El usuario viene desde el link de verificación de email Firebase
      handleEmailVerification(oobCode);
    } else if (verified === 'true') {
      // El usuario ya verificó el email
      showToast.success('Email verificado exitosamente. Ahora establece tu contraseña.');
    } else if (testMode === 'true' && email) {
      // El usuario viene desde el link de prueba simple
      handleTestModeSetup(email);
    }
  }, [searchParams]);

  const handleTestModeSetup = async (email: string) => {
    try {
      setLoading(true);
      console.log('🧪 Modo test: obteniendo información del usuario para:', email);
      
      // Obtener información del usuario por email
      const response = await fetch(`/api/admin/users/by-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setInvitationInfo(prev => ({
          ...prev,
          uid: data.data.uid,
          email: data.data.email,
          role: data.data.role || prev.role,
          name: data.data.displayName || prev.name
        }));
        
        showToast.success('Información del usuario cargada. Establece tu contraseña.');
        console.log('✅ Usuario encontrado:', data.data.uid);
      } else {
        console.error('❌ No se encontró usuario:', data.message);
        showToast.error('No se pudo encontrar la información del usuario');
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      showToast.error('Error al obtener información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async (oobCode: string) => {
    try {
      setLoading(true);
      
      // Primero obtener información del código
      const infoResponse = await fetch(`/api/admin/users/verify-email?oobCode=${oobCode}`);
      const infoData = await infoResponse.json();
      
      if (infoData.success) {
        setInvitationInfo(prev => ({
          ...prev,
          email: infoData.data.email,
          role: infoData.data.role || prev.role,
          name: infoData.data.displayName || prev.name
        }));

        // Verificar el email
        const verifyResponse = await fetch('/api/admin/users/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oobCode })
        });

        const verifyData = await verifyResponse.json();
        
        if (verifyData.success) {
          showToast.success('Email verificado exitosamente. Ahora establece tu contraseña.');
          setInvitationInfo(prev => ({
            ...prev,
            uid: verifyData.data.uid
          }));
        } else {
          showToast.error(verifyData.message || 'Error al verificar el email');
        }
      } else {
        showToast.error(infoData.message || 'Código de verificación inválido');
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      showToast.error('Error al verificar el email');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationInfo.uid) {
      showToast.error('No se pudo obtener la información del usuario');
      return;
    }
    
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
      // Detectar si estamos en modo test
      const testMode = searchParams.get('test') === 'true';
      
      const response = await fetch('/api/admin/users/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: invitationInfo.uid,
          password: formData.password,
          testMode: testMode // Enviar flag de modo test
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showToast.success('¡Registro completado exitosamente!');
        
        setTimeout(() => {
          router.push('/admin/login?message=registration-complete');
        }, 2000);
      } else {
        showToast.error(data.message || 'Error al completar el registro');
      }
      
    } catch (error) {
      console.error('Error:', error);
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

        {(invitationInfo.role || invitationInfo.email) && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Información de la invitación:
            </h3>
            {invitationInfo.name && (
              <p className="text-sm text-blue-600 dark:text-blue-300">
                <strong>Nombre:</strong> {invitationInfo.name}
              </p>
            )}
            {invitationInfo.email && (
              <p className="text-sm text-blue-600 dark:text-blue-300">
                <strong>Email:</strong> {invitationInfo.email}
              </p>
            )}
            {invitationInfo.role && (
              <p className="text-sm text-blue-600 dark:text-blue-300">
                <strong>Rol:</strong> {invitationInfo.role}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordInput
            label="Nueva contraseña"
            value={formData.password}
            onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
            placeholder="Mínimo 6 caracteres"
            required
            disabled={loading}
          />

          <PasswordInput
            label="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
            placeholder="Confirma tu contraseña"
            required
            disabled={loading}
          />

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
