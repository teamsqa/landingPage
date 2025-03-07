import { Button, Card } from '@/app/ui';
import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';

export default function UserProfile({ onLogout }: { onLogout: () => void }) {
  const { user } = useFirebaseAuth();

  return (
    <Card variant="elevated" className="mb-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Perfil de Usuario
          </h2>
          <div className="space-y-1">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">ID:</span> {user?.uid}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Email verificado:</span> {user?.emailVerified ? 'Sí' : 'No'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Último acceso:</span> {user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
        <Button
          variant="danger"
          onClick={onLogout}
          className="flex items-center gap-2"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          Cerrar Sesión
        </Button>
      </div>
    </Card>
  );
}