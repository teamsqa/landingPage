'use client';

import { memo, useMemo, useCallback, useState } from 'react';
import { Table, Badge, Button, Card, Input } from '@/app/ui';

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

// Componente de fila optimizado con memo
const RegistrationRow = memo<{
  index: number;
  style: any;
  data: {
    registrations: Registration[];
    onUpdateStatus: (id: string, newStatus: 'approved' | 'rejected') => void;
    onViewDetail: (registration: Registration) => void;
  };
}>(({ index, style, data }) => {
  const registration = data.registrations[index];
  
  return (
    <div style={style} className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {registration.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {registration.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {registration.email}
              </p>
            </div>
            
            <div className="min-w-0">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium truncate">
                {registration.course}
              </p>
            </div>
            
            <div className="min-w-0">
              <Badge
                variant={
                  registration.status === 'approved' ? 'success' :
                  registration.status === 'rejected' ? 'danger' :
                  'warning'
                }
                className="shadow-md"
              >
                {
                  registration.status === 'approved' ? '✓ Aprobado' :
                  registration.status === 'rejected' ? '✗ Rechazado' :
                  '⏳ Pendiente'
                }
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => data.onViewDetail(registration)}
                className="text-xs px-2 py-1"
              >
                Ver
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => data.onUpdateStatus(registration._id, 'approved')}
                disabled={registration.status === 'approved'}
                className="text-xs px-2 py-1"
              >
                Aprobar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => data.onUpdateStatus(registration._id, 'rejected')}
                disabled={registration.status === 'rejected'}
                className="text-xs px-2 py-1"
              >
                Rechazar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

RegistrationRow.displayName = 'RegistrationRow';

// Componente de tarjeta móvil optimizado
const RegistrationCard = memo<{ 
  registration: Registration;
  onUpdateStatus: (id: string, newStatus: 'approved' | 'rejected') => void;
  onViewDetail: (registration: Registration) => void;
}>(({ registration, onUpdateStatus, onViewDetail }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-xl p-5 space-y-4 shadow-lg shadow-gray-900/5 dark:shadow-black/10 hover:shadow-xl hover:shadow-gray-900/10 dark:hover:shadow-black/20 transition-all duration-200">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {registration.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
              {registration.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {registration.email}
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg px-3 py-2 border border-blue-200/30 dark:border-blue-800/30">
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            📚 {registration.course}
          </p>
        </div>
      </div>
      
      <Badge
        variant={
          registration.status === 'approved' ? 'success' :
          registration.status === 'rejected' ? 'danger' :
          'warning'
        }
        className="shadow-md"
      >
        {
          registration.status === 'approved' ? '✓ Aprobado' :
          registration.status === 'rejected' ? '✗ Rechazado' :
          '⏳ Pendiente'
        }
      </Badge>
    </div>

    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 rounded-lg px-3 py-2 font-medium">
      🕒 {new Date(registration.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </div>

    <div className="border-t border-gray-200/60 dark:border-gray-700/60 pt-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewDetail(registration)}
          className="text-xs px-3 py-2 flex-1 sm:flex-none font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          👁️ Ver Detalle
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onUpdateStatus(registration._id, 'approved')}
          disabled={registration.status === 'approved'}
          className="text-xs px-3 py-2 flex-1 sm:flex-none font-medium shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
        >
          ✓ Aprobar
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onUpdateStatus(registration._id, 'rejected')}
          disabled={registration.status === 'rejected'}
          className="text-xs px-3 py-2 flex-1 sm:flex-none font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          ✗ Rechazar
        </Button>
      </div>
    </div>
  </div>
));

RegistrationCard.displayName = 'RegistrationCard';

const OptimizedRegistrationsTable = memo<Props>(({ registrations, onUpdateStatus, onRefresh, onViewDetail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Filtrar registros de forma optimizada
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(registration => {
      const matchesSearch = registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          registration.course.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [registrations, searchTerm, statusFilter]);

  // Preparar datos para la lista virtual
  const virtualListData = useMemo(() => ({
    registrations: filteredRegistrations,
    onUpdateStatus,
    onViewDetail,
  }), [filteredRegistrations, onUpdateStatus, onViewDetail]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((status: typeof statusFilter) => {
    setStatusFilter(status);
  }, []);

  if (registrations.length === 0) {
    return (
      <Card variant="elevated" className="overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-900/5 dark:shadow-black/10">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
            No hay inscripciones
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            Las nuevas inscripciones aparecerán aquí
          </p>
          <Button variant="primary" onClick={onRefresh}>
            Actualizar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-900/5 dark:shadow-black/10">
      <div className="p-6 lg:p-8">
        {/* Header y filtros */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Inscripciones ({filteredRegistrations.length})
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Gestiona las solicitudes de inscripción
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={onRefresh}
            className="w-full sm:w-auto bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
          >
            🔄 Actualizar
          </Button>
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar por nombre, email o curso..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusFilterChange(status)}
                  className="text-xs px-3 py-2"
                >
                  {status === 'all' ? 'Todos' :
                   status === 'pending' ? 'Pendientes' :
                   status === 'approved' ? 'Aprobados' :
                   'Rechazados'}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Vista móvil - tarjetas */}
        <div className="block lg:hidden space-y-4">
          {filteredRegistrations.length > 0 ? (
            filteredRegistrations.map((registration) => (
              <RegistrationCard 
                key={registration._id} 
                registration={registration}
                onUpdateStatus={onUpdateStatus}
                onViewDetail={onViewDetail}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>

        {/* Vista desktop - lista virtual para mejor rendimiento */}
        <div className="hidden lg:block">
          {filteredRegistrations.length > 0 ? (
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
              {/* Header de la tabla */}
              <div className="flex items-center px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>Nombre</div>
                  <div>Curso</div>
                  <div>Estado</div>
                  <div>Acciones</div>
                </div>
              </div>
              
              {/* Tabla con scroll optimizado para datasets grandes */}
              <div style={{ maxHeight: '600px', overflowY: 'auto' }} className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
                {filteredRegistrations.map((registration, index) => (
                  <RegistrationRow
                    key={registration._id}
                    index={index}
                    style={{ height: '80px' }}
                    data={virtualListData}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
                No se encontraron resultados
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});

OptimizedRegistrationsTable.displayName = 'OptimizedRegistrationsTable';

export default OptimizedRegistrationsTable;
