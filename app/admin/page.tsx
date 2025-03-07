'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/app/ui';
import RegistrationsTable from '@/app/admin/components/RegistrationsTable';
import AdminLayout from '@/app/admin/components/AdminLayout';
import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';

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
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }
    fetchRegistrations();
  }, [user, router]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/inscripcion');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar las inscripciones');
      }

      setRegistrations(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cerrar sesión');
    }
  };

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
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

      setRegistrations(prev => 
        prev.map(reg => 
          reg._id === id ? { ...reg, status: newStatus } : reg
        )
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar el estado');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <Card variant="elevated" className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
            <Button
              variant="primary"
              className="mt-6"
              onClick={fetchRegistrations}
            >
              Reintentar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Panel de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gestiona las inscripciones de los estudiantes
        </p>
      </div>
      <RegistrationsTable 
        registrations={registrations} 
        onUpdateStatus={updateStatus} 
        onRefresh={fetchRegistrations} 
      />
    </AdminLayout>
  );
}