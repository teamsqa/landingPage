'use client';
import React, { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import AdminLayout from "@/app/admin/components/AdminLayout";
import InscripcionesSkeleton from "@/app/admin/components/InscripcionesSkeleton";
import EmptyInscripciones from "@/app/admin/components/EmptyInscripciones";
import { Card, Button } from '@/app/ui';
import { useInscripciones } from '@/app/hooks/useInscripciones';
import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';

// Lazy loading optimizado
const OptimizedRegistrationsTable = dynamic(() => import('@/app/admin/components/OptimizedRegistrationsTable'), {
  loading: () => (
    <div className="p-6">
      <InscripcionesSkeleton showStats={false} showTable={true} />
    </div>
  ),
  ssr: false
});

const RegistrationDetailModal = dynamic(() => import('@/app/admin/components/RegistrationDetailModal'), {
  loading: () => <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>,
  ssr: false
});

type Registration = {
  _id: string;
  name: string;
  email: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  phone?: string;
  country?: string;
  department?: string;
  municipality?: string;
  city?: string;
  education?: string;
  institution?: string;
  programming_experience?: string;
  company?: string;
  position?: string;
  motivation?: string;
  tools?: string[];
};

const OptimizedInscripcionesPage = () => {
  const { user } = useFirebaseAuth();
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Usar el hook específico para inscripciones
  const { registrations = [], error, isLoading, refresh } = useInscripciones();

  // Debug temporal para verificar los datos
  console.log('🔍 Inscripciones Page Debug:', {
    userAuthenticated: !!user,
    registrationsCount: registrations?.length || 0,
    registrationsArray: registrations,
    isLoading,
    error,
    hasData: !!registrations
  });

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
    setSelectedRegistration(registration);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
  }, []);

  const handleApproveWithMessage = useCallback(async (id: string, message: string) => {
    try {
      const response = await fetch(`/api/inscripcion/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'approved',
          customMessage: message 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al aprobar la inscripción');
      }

      refresh();
      alert('Inscripción aprobada y email enviado exitosamente');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al aprobar la inscripción');
      throw error;
    }
  }, [refresh]);

  const handleRejectWithMessage = useCallback(async (id: string, message: string) => {
    try {
      const response = await fetch(`/api/inscripcion/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'rejected',
          customMessage: message 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al rechazar la inscripción');
      }

      refresh();
      alert('Inscripción rechazada y email enviado exitosamente');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al rechazar la inscripción');
      throw error;
    }
  }, [refresh]);

  if (isLoading) {
    return (
      <AdminLayout>
        <InscripcionesSkeleton showStats={true} showTable={true} />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Card variant="elevated" className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button variant="primary" onClick={refresh}>
            Reintentar
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  // Estadísticas optimizadas 
  const stats = {
    total: registrations?.length || 0,
    pending: registrations?.filter((r: Registration) => r.status === 'pending').length || 0,
    approved: registrations?.filter((r: Registration) => r.status === 'approved').length || 0,
    rejected: registrations?.filter((r: Registration) => r.status === 'rejected').length || 0,
  };

  // Verificar si hay inscripciones
  const hasRegistrations = registrations && registrations.length > 0;

  return (
    <AdminLayout>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Gestión de Inscripciones
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Administra y revisa todas las inscripciones de estudiantes
            </p>
          </div>
          <Button
            variant="primary"
            onClick={refresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <svg 
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Cargando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {hasRegistrations && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pending}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Aprobadas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.approved}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Rechazadas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Content Area */}
      {!hasRegistrations ? (
        <EmptyInscripciones />
      ) : (
        /* Table Section con Suspense */
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Lista de Inscripciones
            </h2>
          </div>
          <Suspense fallback={
            <InscripcionesSkeleton showStats={false} showTable={true} />
          }>
            <OptimizedRegistrationsTable 
              registrations={registrations || []} 
              onUpdateStatus={updateStatus}
              onRefresh={refresh} 
              onViewDetail={handleViewDetail}
            />
          </Suspense>
        </Card>
      )}

      {/* Modal de Detalle */}
      {isModalOpen && selectedRegistration && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        }>
          <RegistrationDetailModal
            registration={selectedRegistration}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onApprove={handleApproveWithMessage}
            onReject={handleRejectWithMessage}
          />
        </Suspense>
      )}
    </AdminLayout>
  );
};

export default OptimizedInscripcionesPage;
