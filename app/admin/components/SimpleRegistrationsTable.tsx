'use client';
import React from 'react';
import { Button, Badge } from '@/app/ui';

type Registration = {
  _id: string;
  name: string;
  email: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  phone?: string;
  country?: string;
  department?: string;
  municipality?: string;
  city?: string;
  education?: string;
  institution?: string;
  programming_experience?: string;
  company?: string;
  position?: string;
  motivation?: string;
  tools?: string[];
};

type Props = {
  registrations: Registration[];
  onUpdateStatus: (id: string, newStatus: 'approved' | 'rejected') => void;
  onRefresh: () => void;
  onViewDetail: (registration: Registration) => void;
};

export default function SimpleRegistrationsTable({ registrations, onUpdateStatus, onRefresh, onViewDetail }: Props) {
  if (!registrations || registrations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No hay inscripciones disponibles
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b">
              Curso
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration, index) => (
            <tr key={registration._id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b">
                {registration.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b">
                {registration.email}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b">
                {registration.course}
              </td>
              <td className="px-4 py-3 text-sm border-b">
                <Badge
                  variant={
                    registration.status === 'approved' ? 'success' :
                    registration.status === 'rejected' ? 'danger' :
                    'warning'
                  }
                >
                  {
                    registration.status === 'approved' ? 'Aprobado' :
                    registration.status === 'rejected' ? 'Rechazado' :
                    'Pendiente'
                  }
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm border-b">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewDetail(registration)}
                    className="text-xs px-2 py-1"
                  >
                    Ver Detalle
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onUpdateStatus(registration._id, 'approved')}
                    disabled={registration.status === 'approved'}
                    className="text-xs px-2 py-1"
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onUpdateStatus(registration._id, 'rejected')}
                    disabled={registration.status === 'rejected'}
                    className="text-xs px-2 py-1"
                  >
                    Rechazar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
