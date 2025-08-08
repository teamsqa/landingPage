'use client';

import { Card } from '@/app/ui';

export default function EmptyInscripciones() {
  return (
    <Card variant="elevated" className="p-12 text-center">
      {/* Ícono ilustrativo */}
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg 
          className="w-12 h-12 text-gray-400 dark:text-gray-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
      </div>

      {/* Título y descripción */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No hay inscripciones aún
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
        Una vez que los estudiantes se inscriban a los cursos, aparecerán aquí para su revisión y aprobación.
      </p>

      {/* Información adicional */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          💡 <strong>Tip:</strong> Las inscripciones nuevas aparecerán automáticamente y podrás gestionarlas desde esta sección.
        </p>
      </div>
    </Card>
  );
}
