'use client';

import { Card } from '@/app/ui';

interface QuickStatsProps {
  totalRegistrations: number;
}

export default function QuickStatsCard({ totalRegistrations }: QuickStatsProps) {
  const today = new Date();
  const thisMonth = today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  return (
    <Card variant="elevated" className="p-6 lg:p-8 mb-6 lg:mb-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-900/5 dark:shadow-black/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Resumen del Sistema
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Estado actual de inscripciones en {thisMonth}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center sm:text-right bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200/30 dark:border-emerald-800/30">
          <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {totalRegistrations}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mt-1">
            Total inscripciones
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg px-3 py-2 border border-green-200/30 dark:border-green-800/30">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Sistema operativo</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg px-3 py-2 border border-blue-200/30 dark:border-blue-800/30">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Base de datos activa</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 rounded-lg px-3 py-2 font-medium">
          🕒 Última actualización: {today.toLocaleTimeString('es-ES')}
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start sm:items-center gap-2">
          <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            Para análisis web detallado, usa Google Analytics directamente
          </span>
        </div>
      </div>
    </Card>
  );
}
