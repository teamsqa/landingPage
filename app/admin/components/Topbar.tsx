import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';
import { useState } from 'react';
import UserProfile from './UserProfile';
import { useRouter } from 'next/navigation';
import { useSidebar } from './SidebarContext';

// Componente UserAvatar pequeño para el Topbar
function UserAvatarSmall({ user, size = 40 }: { user: any; size?: number }) {
  const getInitials = (email: string, displayName?: string) => {
    if (displayName && displayName.trim()) {
      return displayName
        .trim()
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    // Si no hay displayName, usar el email
    if (email) {
      const emailUser = email.split('@')[0];
      if (emailUser.length >= 2) {
        return emailUser.slice(0, 2).toUpperCase();
      }
      return emailUser.charAt(0).toUpperCase();
    }
    
    return 'U'; // Fallback
  };

  if (user?.photoURL) {
    return (
      <div className="relative">
        <img
          src={user.photoURL}
          alt="User Avatar"
          className="rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer object-cover shadow-sm"
          style={{ width: `${size}px`, height: `${size}px` }}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
            const initialsDiv = target.nextElementSibling as HTMLElement;
            if (initialsDiv) {
              initialsDiv.classList.remove('hidden');
            }
          }}
        />
        <div
          className="hidden rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-blue-500 bg-gray-500 flex items-center justify-center text-white font-bold shadow-sm cursor-pointer transition-all duration-200"
          style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size/3}px` }}
        >
          {getInitials(user?.email || 'A', user?.displayName)}
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-50 dark:border-gray-700 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-blue-500 bg-gray-500 flex items-center justify-center text-white font-bold shadow-sm cursor-pointer transition-all duration-200"
        style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size/3}px` }}
      >
        {getInitials(user?.email || 'A', user?.displayName)}
      </div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-50 dark:border-gray-700 rounded-full"></div>
    </div>
  );
}

export default function Topbar({ onLogout }: { onLogout: () => void }) {
    const { user, signOut } = useFirebaseAuth();
    const { isCollapsed, toggleCollapsed } = useSidebar();
    const router = useRouter();
    const [showProfile, setShowProfile] = useState(false);

    const toggleProfile = () => {
        setShowProfile(!showProfile);
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

    return (
        <>
            <header className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200/80 dark:border-gray-700 h-16 flex items-center justify-between px-6 shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Botón de menú móvil */}
                    <button
                        onClick={toggleCollapsed}
                        className="p-2 lg:hidden text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white rounded-lg transition-all duration-200 flex-shrink-0"
                        title="Abrir menú"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Título responsive */}
                    <div className="flex items-center min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm font-bold">TQ</span>
                            </div>
                            <div>
                                <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    <span className="hidden sm:inline">Panel de Administración</span>
                                    <span className="sm:hidden">Admin</span>
                                </h1>
                                <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    TeamsQA Dashboard
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                    {/* Notificaciones - oculto en móvil muy pequeño */}
                    <button className="hidden sm:flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 relative group">
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                    </button>

                    {/* Perfil del usuario - responsive */}
                    <div className="flex items-center gap-2 lg:gap-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl px-3 lg:px-4 h-10 lg:h-12 min-w-0 max-w-[150px] sm:max-w-none border border-gray-200/50 dark:border-gray-600/50">
                        <div className="text-right flex-1 min-w-0 hidden sm:block">
                            <div className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {user?.displayName || user?.email?.split('@')[0] || 'Usuario'}
                            </div>
                            {user?.emailVerified && (
                                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verificado
                                </div>
                            )}
                        </div>
                        <button
                            onClick={toggleProfile}
                            className="relative flex-shrink-0 h-6 w-6 lg:h-8 lg:w-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:rotate-3"
                            title="Ver perfil completo"
                        >
                            <UserAvatarSmall user={user} size={24} />
                        </button>
                    </div>

                    {/* Botón de logout responsive */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 lg:gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-10 lg:h-12 px-3 lg:px-4 rounded-xl transition-all duration-200 text-sm lg:text-base font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105"
                        title="Cerrar Sesión"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="hidden md:block">Salir</span>
                    </button>
                </div>
            </header>
            
            {/* Modal de perfil responsive */}
            {showProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 lg:p-4">
                    <div className="bg-white dark:bg-gray-800 p-4 lg:p-8 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={toggleProfile}
                            className="absolute top-3 right-3 lg:top-6 lg:right-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white z-10 bg-gray-100 dark:bg-gray-700 rounded-full p-1.5 lg:p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <UserProfile onLogout={onLogout} />
                    </div>
                </div>
            )}
        </>
    );
}
