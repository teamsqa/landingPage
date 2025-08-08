export type UserRole = 'admin' | 'profesor' | 'estudiante' | 'coordinador';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// Usuario combinado (Firebase Auth + Firestore)
export type CombinedUser = {
  // Datos de Firebase Auth
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  disabled: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime?: string;
    lastRefreshTime?: string;
  };
  
  // Datos de Firestore
  role: UserRole;
  status: UserStatus;
  profile: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    bio?: string;
    department?: string;
    position?: string;
    permissions: UserPermissions;
    preferences: Record<string, any>;
    avatar?: string;
  };
  
  // Metadatos del sistema
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  invitedBy?: string;
  invitedAt?: string;
  
  // Información de actividad
  loginCount: number;
  isOnline: boolean;
};

export type User = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  invitedBy?: string;
  profile: UserProfile;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  bio?: string;
  skills?: string[];
  courses?: string[]; // IDs de cursos para profesores/estudiantes
  permissions: UserPermissions;
};

export type UserPermissions = {
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canManageCourses: boolean;
  canViewReports: boolean;
  canManageInscriptions: boolean;
  canAccessAdmin: boolean;
};

export type CreateUserRequest = {
  email: string;
  displayName: string;
  role: UserRole;
  profile: Omit<UserProfile, 'permissions'>;
  sendInvitation?: boolean;
};

export type UserInvitation = {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'sent' | 'accepted' | 'expired' | 'cancelled';
  token: string;
  verificationLink?: string;
  passwordLink?: string;
};

// Permisos por rol
export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canManageCourses: true,
    canViewReports: true,
    canManageInscriptions: true,
    canAccessAdmin: true,
  },
  coordinador: {
    canCreateUsers: false,
    canEditUsers: true,
    canDeleteUsers: false,
    canManageCourses: true,
    canViewReports: true,
    canManageInscriptions: true,
    canAccessAdmin: true,
  },
  profesor: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canManageCourses: false,
    canViewReports: false,
    canManageInscriptions: false,
    canAccessAdmin: true,
  },
  estudiante: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canManageCourses: false,
    canViewReports: false,
    canManageInscriptions: false,
    canAccessAdmin: false,
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  coordinador: 'Coordinador',
  profesor: 'Profesor',
  estudiante: 'Estudiante',
};
