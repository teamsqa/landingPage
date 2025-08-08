'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAdminAccess, useAuth } from '@/app/providers/AuthProvider';
import { SidebarProvider, useSidebar } from './SidebarContext';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { canAccessAdmin, loading } = useAdminAccess();
  const { signOut } = useAuth();
  const { isCollapsed, toggleCollapsed } = useSidebar();

  useEffect(() => {
    if (!loading && !canAccessAdmin) {
      router.push('/admin/login');
    }
  }, [loading, canAccessAdmin, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cerrar sesión');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center bg-gray-50/95 dark:bg-gray-800/90 backdrop-blur-sm p-12 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-gray-600 mx-auto mb-6"></div>
          <p className="text-gray-500 dark:text-gray-300 font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!canAccessAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center bg-gray-50/95 dark:bg-gray-800/90 backdrop-blur-sm p-12 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700 max-w-md">
          <div className="w-16 h-16 bg-gray-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            No tienes permisos para acceder a esta área.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Overlay para mobile cuando sidebar está abierto */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-10"
          onClick={toggleCollapsed}
        />
      )}
      
      <Sidebar />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 w-full ${
          // En desktop: usar margin-left basado en isCollapsed
          // En mobile: siempre ocupar todo el ancho
          'lg:' + (isCollapsed ? 'ml-16' : 'ml-64') + ' ml-0'
        }`}
      >
        <Topbar onLogout={handleLogout} />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}