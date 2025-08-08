'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Definir tipos simplificados para el AuthProvider
type UserRole = 'admin' | 'coordinator' | 'professor' | 'student';

type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: string;
  permissions: string[];
  profile?: {
    firstName?: string;
    lastName?: string;
    permissions?: string[];
  };
};

type AuthContextType = {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
  isCoordinator: boolean;
  isProfessor: boolean;
  canAccessAdmin: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Obtener datos del usuario desde Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Mapear datos del usuario a la estructura esperada
            const mappedUser: AppUser = {
              uid: firebaseUser.uid,
              email: userData.email || firebaseUser.email || '',
              displayName: userData.displayName || firebaseUser.displayName || '',
              role: userData.role || 'student',
              status: userData.status || 'active',
              permissions: userData.profile?.permissions || [],
              profile: userData.profile
            };
            
            setUser(mappedUser);
          } else {
            // Si no existe en Firestore, crear registro básico como estudiante
            const basicUser: AppUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: 'student',
              status: 'active',
              permissions: []
            };
            setUser(basicUser);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const isAdmin = user?.role === 'admin';
  const isCoordinator = user?.role === 'coordinator';
  const isProfessor = user?.role === 'professor';
  const canAccessAdmin = isAdmin || isCoordinator;

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    hasPermission,
    hasRole,
    isAdmin,
    isCoordinator,
    isProfessor,
    canAccessAdmin,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook específico para verificar si el usuario puede acceder al admin
export function useAdminAccess() {
  const { user, loading, isAdmin, isCoordinator, canAccessAdmin } = useAuth();
  
  return {
    canAccessAdmin,
    isAdmin,
    isCoordinator,
    loading,
    user
  };
}
