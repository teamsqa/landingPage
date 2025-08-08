'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { Card, Input, Button } from '@/app/ui';
import { showToast } from '@/app/components/Toast';
import TeamsQALogo from '@/app/components/TeamsQALogo';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'reset'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validación básica
      if (!formData.email || !formData.password) {
        showToast.error('Por favor completa todos los campos');
        return;
      }

      // 1. Autenticar con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Obtener el token ID
      const idToken = await user.getIdToken();

      // 3. Verificar permisos en el servidor
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (data.success) {
        showToast.success('¡Bienvenido de vuelta!');
        showToast.info('Redirigiendo al panel de administración...');
        
        // Pequeño delay para mostrar el toast
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        showToast.error(data.message || 'No tienes permisos para acceder al panel de administración');
      }

    } catch (error: any) {
      console.error('Error de autenticación:', error);
      
      let errorMessage = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Las credenciales no son válidas. Verifica tu email y contraseña';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del email no es válido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta en unos minutos';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Error de configuración de Firebase';
          break;
        case 'auth/project-not-found':
          errorMessage = 'Proyecto Firebase no encontrado';
          break;
        default:
          errorMessage = `Error: ${error.code || 'Inesperado'}. Intenta nuevamente`;
      }
      
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validación básica
      if (!formData.email) {
        showToast.error('Por favor ingresa tu email');
        return;
      }

      await sendPasswordResetEmail(auth, formData.email);
      showToast.success('Email de recuperación enviado');
      showToast.info('Revisa tu bandeja de entrada y spam');
      
      // Volver a la pestaña de login después de un momento
      setTimeout(() => {
        setActiveTab('login');
      }, 2000);

    } catch (error: any) {
      console.error('Error enviando email de recuperación:', error);
      
      let errorMessage = 'Error al enviar email de recuperación';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del email no es válido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta en unos minutos';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet';
          break;
        default:
          errorMessage = 'Error inesperado. Intenta nuevamente';
      }
      
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-lime-200 dark:bg-lime-900 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
              <TeamsQALogo className="h-20 w-20" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Accede a tu cuenta para gestionar el sistema
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reset')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'reset'
                  ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2" />
              </svg>
              Recuperar
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    placeholder="admin@teamsqa.com"
                    className="pl-10"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isLoading}
                  className="relative flex items-center justify-center py-3 px-4 text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <span className="opacity-0">Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Password Reset Form */}
          {activeTab === 'reset' && (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Recuperar Contraseña
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
                </p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    placeholder="tu-email@teamsqa.com"
                    className="pl-10"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isLoading}
                  className="relative flex items-center justify-center py-3 px-4 text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {isLoading ? (
                    <>
                      <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <span className="opacity-0">Enviando email...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar Email de Recuperación
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ¿Problemas para acceder?{' '}
                <a href="#" className="text-lime-600 hover:text-lime-500 font-medium">
                  Contacta al administrador
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}