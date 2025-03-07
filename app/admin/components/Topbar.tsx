import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';
import { useState } from 'react';
import UserProfile from './UserProfile';
import { useRouter } from 'next/navigation';

export default function Topbar({ onLogout }: { onLogout: () => void }) {
    const { user, signOut } = useFirebaseAuth();
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
            <header className="bg-gray-800 text-white h-16 flex items-center justify-between px-6">
                <div className="text-xl font-bold">Admin Dashboard</div>
                <div className="flex items-center gap-6">
                    <span>{user?.email}</span>
                    <img
                        src={user?.photoURL || 'https://via.placeholder.com/40'}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full cursor-pointer"
                        onClick={toggleProfile}
                    />
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>
            {showProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full sm:max-w-md lg:max-w-lg mx-4 relative">
                        <button
                            onClick={toggleProfile}
                            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300"
                        >
                            &times;
                        </button>
                        <UserProfile onLogout={onLogout} />
                    </div>
                </div>
            )}
        </>
    );
}
