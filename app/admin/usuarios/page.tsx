'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/admin/components/AdminLayout';
import UserFormModal from '@/app/admin/components/UserFormModal';
import { Button, Card, Input } from '@/app/ui';
import { showToast } from '@/app/components/Toast';
import LoadingWithLogo from '@/app/components/LoadingWithLogo';
import { useConfirm } from '@/app/components/ConfirmModal';
import { User, UserRole, UserStatus, ROLE_LABELS } from '@/app/types/user';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  
  const { confirm, ConfirmComponent } = useConfirm();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        showToast.error('Error al cargar usuarios');
      }
    } catch (error) {
      showToast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    const confirmed = await confirm({
      title: '⚠️ Eliminar Usuario',
      message: `¿Estás seguro de que quieres eliminar al usuario "${user.displayName}"? Esta acción es irreversible.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/users/${user.uid}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          showToast.success('Usuario eliminado exitosamente');
          loadUsers();
        } else {
          showToast.error(data.message || 'Error al eliminar usuario');
        }
      } catch (error) {
        showToast.error('Error al eliminar usuario');
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'suspended' ? 'suspender' : 'activar';
    
    const confirmed = await confirm({
      title: `${action === 'suspender' ? '⚠️' : '✅'} ${action.charAt(0).toUpperCase() + action.slice(1)} Usuario`,
      message: `¿Estás seguro de que quieres ${action} al usuario "${user.displayName}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelText: 'Cancelar',
      type: newStatus === 'suspended' ? 'warning' : 'info'
    });

    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/users/${user.uid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        
        const data = await response.json();
        
        if (data.success) {
          showToast.success(`Usuario ${action === 'suspender' ? 'suspendido' : 'activado'} exitosamente`);
          loadUsers();
        } else {
          showToast.error(data.message || `Error al ${action} usuario`);
        }
      } catch (error) {
        showToast.error(`Error al ${action} usuario`);
      }
    }
  };

  const handleResendInvitation = async (user: User) => {
    const confirmed = await confirm({
      title: '📧 Reenviar Invitación',
      message: `¿Reenviar invitación por email a "${user.displayName}" (${user.email})?`,
      confirmText: 'Reenviar',
      cancelText: 'Cancelar',
      type: 'info'
    });

    if (confirmed) {
      try {
        // Necesitamos obtener el token de Firebase Auth
        const { auth } = await import('@/app/lib/firebase');
        const token = await auth.currentUser?.getIdToken();
        
        if (!token) {
          showToast.error('No autorizado. Inicia sesión nuevamente.');
          return;
        }

        const response = await fetch(`/api/admin/users/${user.uid}/resend-invitation`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          showToast.success('Invitación reenviada exitosamente');
          
          // Actualizar la lista de usuarios
          loadUsers();
        } else {
          showToast.error(data.error || 'Error al reenviar invitación');
        }
      } catch (error) {
        console.error('Error reenviando invitación:', error);
        showToast.error('Error al reenviar invitación');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Activo' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactivo' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspendido' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      admin: 'bg-purple-100 text-purple-800',
      coordinador: 'bg-blue-100 text-blue-800',
      profesor: 'bg-green-100 text-green-800',
      estudiante: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleConfig[role]}`}>
        {ROLE_LABELS[role]}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <LoadingWithLogo 
            message="Cargando usuarios..." 
            size="md"
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>
          <Button 
            onClick={handleCreateUser}
            variant="primary"
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Usuario
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="coordinador">Coordinador</option>
              <option value="profesor">Profesor</option>
              <option value="estudiante">Estudiante</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="suspended">Suspendido</option>
              <option value="inactive">Inactivo</option>
            </select>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              {filteredUsers.length} de {users.length} usuarios
            </div>
          </div>
        </Card>

        {/* Tabla de usuarios */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Último acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-lime-100 dark:bg-lime-900 flex items-center justify-center">
                            <span className="text-lime-600 dark:text-lime-400 font-medium">
                              {user.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          Editar
                        </Button>
                        {user.status === 'pending' && (
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleResendInvitation(user)}
                            className="flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Reenviar
                          </Button>
                        )}
                        <Button
                          variant={user.status === 'active' ? 'warning' : 'primary'}
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.status === 'active' ? 'Suspender' : 'Activar'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No se encontraron usuarios
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primer usuario'
                }
              </p>
            </div>
          )}
        </Card>

        {/* Modal de crear/editar usuario */}
        {isModalOpen && (
          <UserFormModal
            user={selectedUser}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={loadUsers}
          />
        )}

        <ConfirmComponent />
      </div>
    </AdminLayout>
  );
}
