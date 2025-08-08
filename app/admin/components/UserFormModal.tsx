'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/app/ui';
import { showToast } from '@/app/components/Toast';
import { User, UserRole, CreateUserRequest, ROLE_LABELS } from '@/app/types/user';

type UserFormModalProps = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function UserFormModal({ user, isOpen, onClose, onSave }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    role: 'estudiante' as UserRole,
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    bio: '',
    sendInvitation: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        phone: user.profile.phone || '',
        department: user.profile.department || '',
        bio: user.profile.bio || '',
        sendInvitation: false
      });
    } else {
      setFormData({
        email: '',
        displayName: '',
        role: 'estudiante',
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        bio: '',
        sendInvitation: true
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'El nombre completo es requerido';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.role) {
      newErrors.role = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = user ? `/api/admin/users/${user.uid}` : '/api/admin/users';
      const method = user ? 'PUT' : 'POST';

      const requestData = user ? {
        email: formData.email,
        displayName: formData.displayName,
        role: formData.role,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          department: formData.department,
          bio: formData.bio
        }
      } : {
        email: formData.email,
        displayName: formData.displayName,
        role: formData.role,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          department: formData.department,
          bio: formData.bio
        },
        sendInvitation: formData.sendInvitation
      } as CreateUserRequest;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.success) {
        showToast.success(user ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
        onSave();
        onClose();
        
        // Si es un nuevo usuario y se envió invitación, mostrar el token
        if (!user && data.data.invitationToken) {
          showToast.info(`Token de invitación: ${data.data.invitationToken.substring(0, 20)}...`);
        }
      } else {
        showToast.error(data.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      showToast.error('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="usuario@ejemplo.com"
                    error={errors.email}
                    disabled={!!user} // No permitir cambiar email en edición
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre Completo *
                  </label>
                  <Input
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    placeholder="Juan Pérez"
                    error={errors.displayName}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Juan"
                    error={errors.firstName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apellido *
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Pérez"
                    error={errors.lastName}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rol *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  >
                    <option value="estudiante">{ROLE_LABELS.estudiante}</option>
                    <option value="profesor">{ROLE_LABELS.profesor}</option>
                    <option value="coordinador">{ROLE_LABELS.coordinador}</option>
                    <option value="admin">{ROLE_LABELS.admin}</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Departamento
                </label>
                <Input
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Tecnología, Marketing, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biografía
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Descripción breve del usuario..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
              </div>

              {!user && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sendInvitation"
                    checked={formData.sendInvitation}
                    onChange={(e) => handleInputChange('sendInvitation', e.target.checked.toString())}
                    className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sendInvitation" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Enviar invitación por correo electrónico
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : (user ? 'Actualizar Usuario' : 'Crear Usuario')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
