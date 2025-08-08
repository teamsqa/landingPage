'use client';

import { useCallback, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button, Card } from '@/app/ui';
import AdminLayout from '@/app/admin/components/AdminLayout';
import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';
import { useOptimizedFetch } from '@/app/hooks/useOptimizedFetch';

// Lazy loading de componentes pesados
const RegistrationsTable = dynamic(() => import('@/app/admin/components/RegistrationsTable'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />,
  ssr: false
});

const QuickStatsCard = dynamic(() => import('@/app/admin/components/QuickStatsCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />,
  ssr: false
});

type Registration = {
  _id: string;
  name: string;
  email: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut } = useFirebaseAuth();
  
  // Usar el hook optimizado para las inscripciones
  const { data: registrations = [], error, isLoading, refresh } = useOptimizedFetch<Registration[]>(
    user ? '/api/inscripcion' : null,
    {
      staleTime: 30 * 1000, // 30 segundos
      cacheTime: 5 * 60 * 1000, // 5 minutos
      revalidateOnFocus: true,
    }
  );

  // Componente optimizado para las estadísticas
  const OptimizedStats = useMemo(() => {
    const stats = {
      total: registrations?.length || 0,
      approved: registrations?.filter(r => r.status === 'approved').length || 0,
      pending: registrations?.filter(r => r.status === 'pending').length || 0,
      rejected: registrations?.filter(r => r.status === 'rejected').length || 0,
    };

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card variant="elevated" className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.approved}</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Pendientes</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Rechazadas</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.rejected}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }, [registrations]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cerrar sesión');
    }
  }, [signOut, router]);

  const updateStatus = useCallback(async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/inscripcion/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el estado');
      }

      // Refrescar datos después de la actualización
      refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar el estado');
    }
  }, [refresh]);

  const handleViewDetail = useCallback((registration: Registration) => {
    router.push(`/admin/inscripciones?id=${registration._id}`);
  }, [router]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200/60 dark:border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-300 font-medium">Cargando datos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card variant="elevated" className="p-8 text-center max-w-md bg-gray-50 dark:bg-gray-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-700 dark:text-red-400 mb-2">Error al cargar</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <Button variant="primary" onClick={refresh}>
              Reintentar
            </Button>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
              Panel de Administración
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gestiona las inscripciones y monitorea el estado del sistema
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats - Suspense para mejor loading */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg mb-8" />}>
        <div className="mb-8">
          <QuickStatsCard totalRegistrations={registrations?.length || 0} />
        </div>
      </Suspense>

      {/* Analytics Section - Enlace directo a Google Analytics */}
      <div className="mb-8 lg:mb-10">
        <Card variant="elevated" className="p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-900/5 dark:shadow-black/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                  Análisis de Tráfico Web
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Accede a Google Analytics para ver estadísticas detalladas del sitio web
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 text-sm font-medium w-full sm:w-auto shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">📊 Ver Google Analytics</span>
                <span className="sm:hidden">📊 Analytics</span>
              </a>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 text-sm font-medium w-full sm:w-auto shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">🔍 Search Console</span>
                <span className="sm:hidden">🔍 Console</span>
              </a>
            </div>
          </div>
          
          <div className="mt-4 p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Acceso optimizado a métricas
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Para mejorar el rendimiento del dashboard, ahora accedes directamente a Google Analytics 
                  donde puedes ver todas las métricas en tiempo real, crear reportes personalizados y 
                  configurar alertas automáticas.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Inscripciones Statistics Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
          Gestión de Inscripciones
        </h2>
        {OptimizedStats}
      </div>

      {/* Table Section con Suspense */}
      <Card variant="elevated" className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Inscripciones Recientes
          </h2>
          <Button 
            onClick={refresh}
            variant="primary"
            size="sm"
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Actualizar
          </Button>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200/60 dark:border-gray-600 overflow-hidden">
          <Suspense fallback={
            <div className="animate-pulse p-8">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
          }>
            <RegistrationsTable 
              registrations={registrations || []}
              onUpdateStatus={updateStatus}
              onRefresh={refresh}
              onViewDetail={handleViewDetail}
            />
          </Suspense>
        </div>
      </Card>
    </AdminLayout>
  );
}
