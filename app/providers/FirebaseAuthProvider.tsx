'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, getIdToken, signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/app/lib/firebase';
import { CombinedUser } from '@/app/types/user';
import Cookies from 'js-cookie';
import { LoadingPage } from '@/app/ui';

type AuthContextType = {
  user: User | null;
  combinedUser: CombinedUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  combinedUser: null,
  loading: true,
  signOut: async () => {},
  refreshUserData: async () => {},
});

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [combinedUser, setCombinedUser] = useState<CombinedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Función para obtener datos combinados del usuario
  const fetchCombinedUserData = async (firebaseUser: User): Promise<CombinedUser | null> => {
    try {
      const token = await getIdToken(firebaseUser, true);
      const response = await fetch('/api/admin/user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: token }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching combined user data:', error);
      return null;
    }
  };

  // Función para refrescar datos del usuario
  const refreshUserData = async () => {
    if (user) {
      const combinedData = await fetchCombinedUserData(user);
      setCombinedUser(combinedData);
    }
  };

  useEffect(() => {
    // Only set up auth listener if auth is initialized
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await getIdToken(user, true);
          Cookies.set('firebase-token', token, { 
            secure: true,
            sameSite: 'strict'
          });
          setUser(user);
          
          // Obtener datos combinados
          const combinedData = await fetchCombinedUserData(user);
          setCombinedUser(combinedData);
        } catch (error) {
          console.error('Error getting token:', error);
          await handleSignOut();
        }
      } else {
        Cookies.remove('firebase-token');
        setUser(null);
        setCombinedUser(null);
        
        if (pathname?.startsWith('/admin') && !pathname?.startsWith('/admin/login')) {
          router.push('/admin/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleSignOut = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      Cookies.remove('firebase-token');
      setUser(null);
      setCombinedUser(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      combinedUser, 
      loading, 
      signOut: handleSignOut,
      refreshUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}