'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/app/ui';

interface AnalyticsMetrics {
  totalUsers: number;
  totalSessions: number;
  totalPageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  usersByCountry: Array<{
    country: string;
    users: number;
  }>;
  dailyUsers: Array<{
    date: string;
    users: number;
  }>;
}

interface AnalyticsCardProps {
  period?: '7d' | '30d' | '90d';
}

export default function AnalyticsCard({ period = '30d' }: AnalyticsCardProps) {
  const [data, setData] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = period === '7d' ? '7daysAgo' : period === '90d' ? '90daysAgo' : '30daysAgo';
      const response = await fetch(`/api/admin/analytics?startDate=${startDate}&endDate=today`);
      
      if (!response.ok) {
        throw new Error('Error al obtener datos de Analytics');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    // Formato: YYYYMMDD -> DD/MM
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${day}/${month}`;
  };

  if (loading) {
    return (
      <Card variant="elevated" className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="elevated" className="p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Reintentar
          </button>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            📊 Google Analytics - Últimos {period === '7d' ? '7 días' : period === '90d' ? '90 días' : '30 días'}
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Actualizado: {new Date().toLocaleTimeString('es-ES')}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Usuarios</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{data.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Sesiones</p>
                <p className="text-lg font-bold text-green-900 dark:text-green-100">{data.totalSessions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Páginas vistas</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{data.totalPageviews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Rebote</p>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-100">{data.bounceRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Duración</p>
                <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{formatDuration(data.avgSessionDuration)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico simple de usuarios diarios */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Usuarios por día (últimos 7 días)</h4>
          <div className="flex items-end justify-between h-24 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            {data.dailyUsers.map((day, index) => {
              const maxUsers = Math.max(...data.dailyUsers.map(d => d.users));
              const height = (day.users / maxUsers) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-lime-500 rounded-t min-w-[20px] transition-all duration-300 hover:bg-lime-600"
                    style={{ height: `${height}%` }}
                    title={`${day.users} usuarios`}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Páginas más visitadas y países */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="elevated" className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📄 Páginas más visitadas
          </h4>
          <div className="space-y-3">
            {data.topPages.slice(0, 5).map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {page.path === '/' ? 'Inicio' : page.path}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {page.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🌍 Usuarios por país
          </h4>
          <div className="space-y-3">
            {data.usersByCountry.slice(0, 5).map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {country.country}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {country.users.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
