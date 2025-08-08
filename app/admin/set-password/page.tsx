'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Input, Button } from '@/app/ui';
import { showToast } from '@/app/components/Toast';
import LoadingWithLogo from '@/app/components/LoadingWithLogo';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [resetInfo, setResetInfo] = useState({
    email: '',
    code: ''
  });

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    
    if (mode === 'resetPassword' && oobCode) {
      verifyResetCode(oobCode);
    } else {
      showToast.error('Link de invitación inválido');
      setVerifying(false);
    }
  }, [searchParams]);

  const verifyResetCode = async (code: string) => {
    try {
      const email = await verifyPasswordResetCode(auth, code);
      setResetInfo({ email, code });
      setVerifying(false);
      showToast.success(`Configurando contraseña para: ${email}`);
    } catch (error: any) {
      console.error('Error verificando código:', error);
      showToast.error('El link de invitación ha expirado o es inválido');
      setVerifying(false);
    }
  };

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
      // Confirmar el restablecimiento de contraseña
      await confirmPasswordReset(auth, resetInfo.code, formData.password);
      
      showToast.success('¡Contraseña establecida exitosamente!');
      showToast.info('Ahora puedes iniciar sesión');
      
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error estableciendo contraseña:', error);
      showToast.error('Error al establecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-lime-200 dark:bg-lime-900 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative">
          <LoadingWithLogo 
            message="Verificando invitación..." 
            size="md"
          />
        </Card>
      </div>
    );
  }

  if (!resetInfo.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-red-200 dark:bg-red-900 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-orange-200 dark:bg-orange-900 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <Card className="w-full max-w-md p-8 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Link Inválido
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              El link de invitación ha expirado o es inválido. Contacta al administrador para obtener un nuevo enlace.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/login')}
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700"
            >
              Ir al Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-lime-200 dark:bg-lime-900 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md p-8 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-lime-100 to-lime-200 dark:from-lime-900 dark:to-lime-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Establece tu Contraseña
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configura tu contraseña para acceder a TeamsQA
          </p>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-300">
                Configurando para:
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-200 font-semibold">
                {resetInfo.email}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva contraseña *
            </label>
            <div className="relative">
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
                className="w-full"
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                La contraseña debe tener al menos 6 caracteres
              </div>
            </div>
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
              className="w-full"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="relative bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 py-3 transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <span className="opacity-0">Estableciendo contraseña...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Establecer Contraseña
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Después de establecer tu contraseña podrás iniciar sesión normalmente
          </div>
        </div>
      </Card>
    </div>
  );
}
