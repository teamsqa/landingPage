'use client';

import { useEffect } from 'react';
import { Button, Card } from './ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <Card variant="elevated" className="p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Algo salió mal
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Lo sentimos, ha ocurrido un error. Por favor intenta nuevamente.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="primary"
              onClick={reset}
            >
              Intentar nuevamente
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}