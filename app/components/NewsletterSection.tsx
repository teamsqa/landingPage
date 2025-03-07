'use client';

import { useState } from 'react';
import { Input, Button } from '@/app/ui';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al suscribir');
      }

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error al suscribir:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="py-20 bg-lime-500 dark:bg-lime-600">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Mantente actualizado
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Suscríbete a nuestro newsletter y recibe contenido exclusivo, tutoriales y noticias sobre automatización de pruebas
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow"
                disabled={status === 'loading' || status === 'success'}
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                ) : status === 'success' ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  'Suscribirse'
                )}
              </Button>
            </div>
          </form>
          
          {status === 'success' && (
            <p className="mt-4 text-white">
              ¡Gracias por suscribirte! Revisa tu correo para confirmar tu suscripción.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-500">
              Hubo un error al suscribirte. Por favor, inténtalo de nuevo.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}