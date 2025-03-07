import Link from 'next/link';
import { Button, Card } from './ui';

export default function NotFound() {
  return (
    <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <Card variant="elevated" className="p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Lo sentimos, la página que buscas no existe.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="primary">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}