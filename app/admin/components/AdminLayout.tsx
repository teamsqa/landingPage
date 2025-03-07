import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useFirebaseAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cerrar sesión');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar onLogout={handleLogout} />
        <main className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900 pt-16">
          <div className="container mx-auto px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}