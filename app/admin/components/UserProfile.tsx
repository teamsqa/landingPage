'use client';

import { useState } from 'react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { Button, Card, Input } from '@/app/ui';
import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';
import { showToast } from '@/app/components/Toast';

interface UserProfileProps {
  onLogout: () => void;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: () => void;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

// Componente para mostrar avatar con iniciales
function UserAvatar({ user, size = 120 }: { user: any; size?: number }) {
  const getInitials = (email: string, displayName?: string) => {
    if (displayName && displayName.trim()) {
      return displayName
        .trim()
        .split(' ')
        .map(name => name.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    
    if (email) {
      const emailUser = email.split('@')[0];
      if (emailUser.length >= 2) {
        return emailUser.substring(0, 2).toUpperCase();
      }
      return emailUser.charAt(0).toUpperCase() + 'U';
    }
    
    return 'AU';
  };

  // Si el usuario tiene foto de Google
  if (user?.photoURL) {
    return (
      <div className="relative">
        <img
          src={user.photoURL}
          alt="User Avatar"
          className="rounded-full border-4 border-lime-500 object-cover"
          style={{ width: `${size}px`, height: `${size}px` }}
          onError={(e) => {
            // Si la imagen falla al cargar, ocultar y mostrar las iniciales
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
            const initialsDiv = target.nextElementSibling as HTMLElement;
            if (initialsDiv) {
              initialsDiv.classList.remove('hidden');
            }
          }}
        />
        <div
          className="hidden rounded-full border-4 border-lime-500 bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg"
          style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size/3}px` }}
        >
          {getInitials(user?.email || 'A', user?.displayName)}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-full border-4 border-lime-500 bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg"
      style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size/3}px` }}
    >
      {getInitials(user?.email || 'A', user?.displayName)}
    </div>
  );
}

// Modal para editar perfil
function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Función para generar nombre desde email
  const generateNameFromEmail = () => {
    if (user?.email) {
      const emailUser = user.email.split('@')[0];
      // Capitalizar primera letra y agregar espacios en camelCase o underscores
      const name = emailUser
        .replace(/[._-]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      setFormData(prev => ({ ...prev, displayName: name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile(user, {
        displayName: formData.displayName || null
      });

      showToast.success('Perfil actualizado correctamente');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      showToast.error(error.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Editar Perfil
            </h3>
            <Button variant="secondary" onClick={onClose} className="p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre para mostrar
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Ingresa tu nombre"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={generateNameFromEmail}
                  className="px-3 py-2 text-xs"
                  title="Generar desde email"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Este será el nombre que verán otros usuarios
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (solo lectura)
              </label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

// Modal para cambiar contraseña
function ChangePasswordModal({ isOpen, onClose, user }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      showToast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(user, formData.newPassword);
      showToast.success('Contraseña actualizada correctamente');
      onClose();
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      showToast.error(error.message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cambiar Contraseña
            </h3>
            <Button variant="secondary" onClick={onClose} className="p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Nueva contraseña"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirmar nueva contraseña"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default function UserProfile({ onLogout }: UserProfileProps) {
  const { user, combinedUser, refreshUserData } = useFirebaseAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Función para refrescar datos después de una actualización
  const handleUpdate = async () => {
    if (refreshUserData) {
      await refreshUserData();
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No hay usuario logueado</p>
      </div>
    );
  }

  // Determinamos qué datos mostrar
  const displayUser = combinedUser || user;
  const displayName = displayUser?.displayName || 
    (combinedUser?.profile?.firstName) || 
    displayUser?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="w-full">
      {/* Header del perfil */}
      <div className="text-center mb-8">
        <UserAvatar user={displayUser} size={120} />
        
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {displayName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {displayUser?.email}
          </p>

          {/* Badges de estado */}
          {combinedUser && (
            <div className="flex flex-wrap gap-2 justify-center">
              {combinedUser.role && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium capitalize">
                  {combinedUser.role}
                </span>
              )}
              {combinedUser.status && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  combinedUser.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : combinedUser.status === 'inactive'
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {combinedUser.status === 'active' ? 'Activo' : 
                   combinedUser.status === 'inactive' ? 'Inactivo' : 
                   combinedUser.status}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid de información extendido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card de Email */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">{displayUser?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {combinedUser?.emailVerified || displayUser?.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verificado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pendiente verificación
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Card de Rol */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rol del Sistema</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {combinedUser?.role === 'admin' ? 'Administrador' :
                 combinedUser?.role === 'profesor' ? 'Profesor' :
                 combinedUser?.role === 'estudiante' ? 'Estudiante' :
                 combinedUser?.role === 'coordinador' ? 'Coordinador' :
                 combinedUser?.role || 'No asignado'}
              </p>
              <div className="mt-2 space-y-1">
                {combinedUser?.profile?.permissions?.canAccessAdmin && (
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    Acceso Admin
                  </span>
                )}
                {combinedUser?.profile?.permissions?.canEditUsers && (
                  <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs ml-1">
                    Gestión Usuarios
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Card de Cuenta */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Estado de Cuenta</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    combinedUser?.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : combinedUser?.status === 'inactive'
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {combinedUser?.status === 'active' ? 'Activo' : 
                     combinedUser?.status === 'inactive' ? 'Inactivo' : 
                     combinedUser?.status || 'Desconocido'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Proveedor:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Firebase
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card de Departamento */}
        {combinedUser?.profile?.department ? (
          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Información Laboral</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{combinedUser.profile.department}</p>
                {combinedUser.profile.position && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{combinedUser.profile.position}</p>
                )}
                {(combinedUser.profile as any)?.phone && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Teléfono disponible
                  </div>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ID de Usuario</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{displayUser?.uid}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Identificador único del sistema</p>
              </div>
            </div>
          </Card>
        )}

        {/* Card de Actividad */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Actividad Reciente</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Último acceso:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {combinedUser?.lastLoginAt 
                      ? new Date(combinedUser.lastLoginAt).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : (displayUser?.metadata?.lastSignInTime 
                          ? new Date(displayUser.metadata.lastSignInTime).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'N/A')
                    }
                  </span>
                </div>
                {combinedUser?.loginCount && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total accesos:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {combinedUser.loginCount}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Creado:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {displayUser?.metadata?.creationTime 
                      ? new Date(displayUser.metadata.creationTime).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short'
                        })
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card de Progreso/Estadísticas - Disabled until activity tracking is implemented */}
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button
          variant="secondary"
          onClick={() => setShowEditModal(true)}
          className="flex items-center justify-center gap-3 py-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar Datos
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center justify-center gap-3 py-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 712 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
          </svg>
          Cambiar Contraseña
        </Button>

        <Button
          variant="danger"
          onClick={onLogout}
          className="flex items-center justify-center gap-3 py-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </Button>
      </div>

      {/* Modales */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={handleUpdate}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        user={user}
      />
    </div>
  );
}
