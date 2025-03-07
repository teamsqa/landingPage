'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, getIdToken, signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/app/lib/firebase';
import Cookies from 'js-cookie';
import { LoadingPage } from '@/app/ui';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
        } catch (error) {
          console.error('Error getting token:', error);
          await handleSignOut();
        }
      } else {
        Cookies.remove('firebase-token');
        setUser(null);
        
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
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
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