import { useState, useEffect, useCallback, useRef } from 'react';

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UseOptimizedPaginatedFetchOptions {
  initialPage?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected' | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  staleTime?: number;
  cacheTime?: number;
  revalidateOnFocus?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseOptimizedPaginatedFetchResult<T> {
  data: T[];
  meta: PaginationMeta | null;
  error: string | null;
  isLoading: boolean;
  isValidating: boolean;
  refresh: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setStatus: (status: 'pending' | 'approved' | 'rejected' | null) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  removeItem: (id: string) => void;
  addItem: (item: T) => void;
}

// Cache global para datos paginados
const paginatedCache = new Map<string, {
  data: any[];
  meta: PaginationMeta;
  timestamp: number;
  etag?: string;
}>();

export function useOptimizedPaginatedFetch<T extends { _id: string }>(
  url: string | null,
  options: UseOptimizedPaginatedFetchOptions = {}
): UseOptimizedPaginatedFetchResult<T> {
  const {
    initialPage = 1,
    limit = 20,
    status = null,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    staleTime = 60 * 1000, // 1 minuto
    cacheTime = 10 * 60 * 1000, // 10 minutos
    revalidateOnFocus = true,
    autoRefresh = false,
    refreshInterval = 30 * 1000, // 30 segundos
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);

  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  // Crear clave de cache única
  const createCacheKey = useCallback((page: number, status: string | null, sortBy: string, sortOrder: string) => {
    return `${url}_${page}_${limit}_${status || 'all'}_${sortBy}_${sortOrder}`;
  }, [url, limit]);

  // Función de fetch optimizada
  const fetchData = useCallback(async (
    page: number = currentPage,
    status: string | null = currentStatus,
    sortBy: string = currentSortBy,
    sortOrder: string = currentSortOrder,
    forceRefresh: boolean = false
  ) => {
    if (!url) return;

    const cacheKey = createCacheKey(page, status, sortBy, sortOrder);
    
    // Verificar cache primero
    if (!forceRefresh) {
      const cached = paginatedCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < staleTime) {
        setData(cached.data);
        setMeta(cached.meta);
        setError(null);
        return;
      }
    }

    // Cancelar request anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const isFirstLoad = data.length === 0 && !meta;
    if (isFirstLoad) {
      setIsLoading(true);
    } else {
      setIsValidating(true);
    }
    
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (status) {
        params.append('status', status);
      }

      // Usar URL optimizada si existe
      const fetchUrl = url.includes('/optimized/') ? url : url.replace('/api/', '/api/') + '/optimized';
      const response = await fetch(`${fetchUrl}?${params}`, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error en la respuesta del servidor');
      }

      const newData = result.data || [];
      const newMeta = result.meta || null;

      setData(newData);
      setMeta(newMeta);
      setError(null);
      lastFetchRef.current = Date.now();

      // Actualizar cache
      if (newMeta) {
        paginatedCache.set(cacheKey, {
          data: newData,
          meta: newMeta,
          timestamp: Date.now(),
        });

        // Limpiar cache antiguo periódicamente
        if (Math.random() < 0.1) {
          cleanOldCache();
        }
      }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMessage = err.message || 'Error desconocido';
        setError(errorMessage);
        console.error('Error in fetchData:', err);
      }
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [url, currentPage, currentStatus, currentSortBy, currentSortOrder, createCacheKey, staleTime, data.length, meta, limit]);

  // Función para limpiar cache antiguo
  const cleanOldCache = useCallback(() => {
    const now = Date.now();
    paginatedCache.forEach((value, key) => {
      if (now - value.timestamp > cacheTime) {
        paginatedCache.delete(key);
      }
    });
  }, [cacheTime]);

  // Effect inicial y cuando cambian los parámetros
  useEffect(() => {
    fetchData(currentPage, currentStatus, currentSortBy, currentSortOrder);
  }, [fetchData, currentPage, currentStatus, currentSortBy, currentSortOrder]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && url && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        fetchData(currentPage, currentStatus, currentSortBy, currentSortOrder, false);
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, url, refreshInterval, fetchData, currentPage, currentStatus, currentSortBy, currentSortOrder]);

  // Revalidar al hacer focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      if (Date.now() - lastFetchRef.current > staleTime) {
        fetchData(currentPage, currentStatus, currentSortBy, currentSortOrder);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, staleTime, fetchData, currentPage, currentStatus, currentSortBy, currentSortOrder]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Funciones de navegación
  const nextPage = useCallback(() => {
    if (meta && meta.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [meta]);

  const prevPage = useCallback(() => {
    if (meta && meta.hasPrev) {
      setCurrentPage(prev => prev - 1);
    }
  }, [meta]);

  const goToPage = useCallback((page: number) => {
    if (meta && page >= 1 && page <= meta.totalPages) {
      setCurrentPage(page);
    }
  }, [meta]);

  // Funciones de filtrado y ordenamiento
  const setStatus = useCallback((newStatus: 'pending' | 'approved' | 'rejected' | null) => {
    setCurrentStatus(newStatus);
    setCurrentPage(1); // Reset a primera página
  }, []);

  const setSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setCurrentSortBy(sortBy);
    setCurrentSortOrder(sortOrder);
    setCurrentPage(1); // Reset a primera página
  }, []);

  // Funciones de manipulación de datos optimistas
  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setData(prevData => 
      prevData.map(item => 
        item._id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prevData => prevData.filter(item => item._id !== id));
    // Actualizar meta
    if (meta) {
      setMeta(prev => prev ? { ...prev, totalCount: prev.totalCount - 1 } : null);
    }
  }, [meta]);

  const addItem = useCallback((item: T) => {
    setData(prevData => [item, ...prevData]);
    // Actualizar meta
    if (meta) {
      setMeta(prev => prev ? { ...prev, totalCount: prev.totalCount + 1 } : null);
    }
  }, [meta]);

  // Función de refresh manual
  const refresh = useCallback(async () => {
    await fetchData(currentPage, currentStatus, currentSortBy, currentSortOrder, true);
  }, [fetchData, currentPage, currentStatus, currentSortBy, currentSortOrder]);

  return {
    data,
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
    removeItem,
    addItem,
  };
}
