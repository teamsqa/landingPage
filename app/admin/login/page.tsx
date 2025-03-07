'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { Card, Input, Button } from '@/app/ui';
import AdminLayout from '@/app/admin/components/AdminLayout';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setSuccess('Inicio de sesión exitoso. Redirigiendo...');
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (error: any) {
      console.error('Error de autenticación:', error);
      setError(
        error.code === 'auth/invalid-credential' 
          ? 'Credenciales inválidas' 
          : 'Error al iniciar sesión'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
      <main className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-md">
          <Card variant="elevated" className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              Acceso Administrativo
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                required
                autoComplete="email"
                disabled={isLoading}
              />

              <Input
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>
  );
}