'use client';
import React, { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Button, Badge, Input } from '@/app/ui';
import { useOptimizedPaginatedFetch } from '@/app/hooks/useOptimizedPaginatedFetch';

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

interface HighPerformanceRegistrationsTableProps {
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  onViewDetail: (registration: Registration) => void;
  className?: string;
}

// Componente de fila memoizado para mejor performance
const RegistrationRow = memo(({ 
  registration, 
  onUpdateStatus, 
  onViewDetail,
  isSelected,
  onSelect,
}: {
  registration: Registration;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  onViewDetail: (registration: Registration) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = useCallback(async (status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(registration._id, status);
    } finally {
      setIsUpdating(false);
    }
  }, [registration._id, onUpdateStatus]);

  const handleSelect = useCallback(() => {
    onSelect(registration._id);
  }, [registration._id, onSelect]);

  const handleViewDetail = useCallback(() => {
    onViewDetail(registration);
  }, [registration, onViewDetail]);

  const statusBadgeVariant = useMemo(() => {
    switch (registration.status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'warning';
    }
  }, [registration.status]);

  const formattedDate = useMemo(() => {
    return new Date(registration.createdAt).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, [registration.createdAt]);

  return (
    <tr className={`
      border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 
      transition-colors duration-150 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
    `}>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {registration.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white truncate max-w-40">
              {registration.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-40">
              {registration.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-gray-900 dark:text-white font-medium truncate max-w-32">
          {registration.course}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={statusBadgeVariant}>
          {registration.status === 'pending' ? 'Pendiente' :
           registration.status === 'approved' ? 'Aprobado' : 'Rechazado'}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleViewDetail}
            className="text-xs px-3 py-1"
          >
            Ver
          </Button>
          {registration.status === 'pending' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusUpdate('approved')}
                disabled={isUpdating}
                className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? '...' : '✓'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
                className="text-xs px-3 py-1"
              >
                {isUpdating ? '...' : '✗'}
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
});
RegistrationRow.displayName = 'RegistrationRow';

// Componente principal optimizado
const HighPerformanceRegistrationsTable = memo(({ 
  onUpdateStatus, 
  onViewDetail,
  className = ""
}: HighPerformanceRegistrationsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Usar el hook paginado optimizado
  const {
    data: registrations,
    meta,
    error,
    isLoading,
    isValidating,
    refresh,
    nextPage,
    prevPage,
    goToPage,
    setStatus,
    setSorting,
    updateItem,
  } = useOptimizedPaginatedFetch<Registration>('/api/inscripcion', {
    limit: 25,
    status: statusFilter,
    sortBy,
    sortOrder,
    staleTime: 30 * 1000,
    cacheTime: 5 * 60 * 1000,
    revalidateOnFocus: true,
    autoRefresh: true,
    refreshInterval: 60 * 1000, // Refresh cada minuto
  });

  // Filtrar por búsqueda local (sobre los datos paginados actuales)
  const filteredRegistrations = useMemo(() => {
    if (!searchQuery.trim()) return registrations;
    
    const query = searchQuery.toLowerCase();
    return registrations.filter(reg => 
      reg.name.toLowerCase().includes(query) ||
      reg.email.toLowerCase().includes(query) ||
      reg.course.toLowerCase().includes(query)
    );
  }, [registrations, searchQuery]);

  // Manejar búsqueda con debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce para evitar múltiples actualizaciones
    searchTimeoutRef.current = setTimeout(() => {
      // Si hay búsqueda, no usar filtros del servidor
      if (value.trim()) {
        setStatus(null);
      }
    }, 300);
  }, [setStatus]);

  // Manejar cambio de filtro de estado
  const handleStatusFilterChange = useCallback((status: 'pending' | 'approved' | 'rejected' | null) => {
    setStatusFilter(status);
    setStatus(status);
    setSearchQuery(''); // Limpiar búsqueda local
  }, [setStatus]);

  // Manejar cambio de ordenamiento
  const handleSortChange = useCallback((field: string) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newOrder);
    setSorting(field, newOrder);
  }, [sortBy, sortOrder, setSorting]);

  // Manejar actualización de estado optimista
  const handleStatusUpdate = useCallback(async (id: string, newStatus: 'approved' | 'rejected') => {
    // Actualización optimista
    updateItem(id, { status: newStatus });
    
    try {
      await onUpdateStatus(id, newStatus);
    } catch (error) {
      // Revertir si hay error
      const originalItem = registrations.find(r => r._id === id);
      if (originalItem) {
        updateItem(id, { status: originalItem.status });
      }
      throw error;
    }
  }, [updateItem, onUpdateStatus, registrations]);

  // Manejar selección múltiple
  const handleRowSelect = useCallback((id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = filteredRegistrations.map(r => r._id);
    setSelectedRows(prev => 
      prev.size === allIds.length ? new Set() : new Set(allIds)
    );
  }, [filteredRegistrations]);

  // Acciones en lote
  const handleBulkAction = useCallback(async (action: 'approve' | 'reject') => {
    if (selectedRows.size === 0) return;

    const status = action === 'approve' ? 'approved' : 'rejected';
    const promises = Array.from(selectedRows).map(id => handleStatusUpdate(id, status));
    
    try {
      await Promise.all(promises);
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Error en acción masiva:', error);
    }
  }, [selectedRows, handleStatusUpdate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center ${className}`}>
        <div className="text-red-600 dark:text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Error al cargar datos</h3>
          <p className="text-sm">{error}</p>
        </div>
        <Button variant="primary" onClick={refresh}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header con controles */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Input
              placeholder="Buscar por nombre, email o curso..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-sm"
            />
            
            <select
              value={statusFilter || ''}
              onChange={(e) => handleStatusFilterChange(e.target.value as any || null)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRows.size} seleccionados
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Aprobar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                >
                  Rechazar
                </Button>
              </>
            )}
            
            <Button
              variant="secondary"
              onClick={refresh}
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              {isValidating ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                '🔄'
              )}
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Cargando inscripciones...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredRegistrations.length && filteredRegistrations.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSortChange('name')}
                >
                  <div className="flex items-center gap-1">
                    Usuario
                    {sortBy === 'name' && (
                      <span className="text-blue-500">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSortChange('course')}
                >
                  <div className="flex items-center gap-1">
                    Curso
                    {sortBy === 'course' && (
                      <span className="text-blue-500">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSortChange('status')}
                >
                  <div className="flex items-center gap-1">
                    Estado
                    {sortBy === 'status' && (
                      <span className="text-blue-500">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSortChange('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Fecha
                    {sortBy === 'createdAt' && (
                      <span className="text-blue-500">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((registration) => (
                  <RegistrationRow
                    key={registration._id}
                    registration={registration}
                    onUpdateStatus={handleStatusUpdate}
                    onViewDetail={onViewDetail}
                    isSelected={selectedRows.has(registration._id)}
                    onSelect={handleRowSelect}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    {searchQuery ? 
                      `No se encontraron resultados para "${searchQuery}"` :
                      'No hay inscripciones'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {meta && meta.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {((meta.currentPage - 1) * (meta.limit || 20)) + 1} a {Math.min(meta.currentPage * (meta.limit || 20), meta.totalCount)} de {meta.totalCount} inscripciones
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={prevPage}
              disabled={!meta.hasPrev}
            >
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 text-sm rounded ${
                      page === meta.currentPage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={nextPage}
              disabled={!meta.hasNext}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

HighPerformanceRegistrationsTable.displayName = 'HighPerformanceRegistrationsTable';

export default HighPerformanceRegistrationsTable;
