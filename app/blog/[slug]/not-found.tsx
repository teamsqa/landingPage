import Link from 'next/link';
import { Button } from '@/app/ui';

export default function NotFound() {
  return (
    <main className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full opacity-20"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-lime-500 to-lime-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6M9 8h6m-6-4h6" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Artículo no encontrado
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            El artículo que estás buscando no existe, ha sido movido o ha sido eliminado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/blog">
            <Button size="lg">
              Ver todos los artículos
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="secondary" size="lg">
              Volver al inicio
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg inline-block">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ¿Necesitas ayuda?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Si crees que esto es un error, por favor{' '}
            <Link href="/contacto" className="text-lime-600 dark:text-lime-400 hover:underline">
              contáctanos
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
