import AdminLayout from '@/app/admin/components/AdminLayout';

export default function AdminNotFound() {
  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404 - Página No Encontrada</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">La página que estás buscando no existe.</p>
        <a href="/admin" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Volver al Panel de Administración
        </a>
      </div>
    </AdminLayout>
  );
}