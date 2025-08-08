'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedFetchOptions {
  initialData?: any;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
  cacheTime?: number;
  staleTime?: number;
  enabled?: boolean;
}

interface UseOptimizedFetchResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<void>;
  refresh: () => Promise<void>;
}

// Cache global para todas las peticiones
const cache = new Map<string, { data: any; timestamp: number; promise?: Promise<any> }>();

export function useOptimizedFetch<T = any>(
  url: string | null,
  options: UseOptimizedFetchOptions = {}
): UseOptimizedFetchResult<T> {
  const {
    initialData = null,
    revalidateOnFocus = false,
    revalidateOnReconnect = true,
    refreshInterval,
    cacheTime = 5 * 60 * 1000, // 5 minutos
    staleTime = 30 * 1000, // 30 segundos
    enabled = true,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(enabled && !!url);
  const [isValidating, setIsValidating] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialFetchRef = useRef(true);

  const fetchData = useCallback(async (showLoading = true): Promise<T | null> => {
    if (!url || !enabled) return null;

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setIsValidating(true);
      setError(null);

      // Verificar cache
      const cached = cache.get(url);
      const now = Date.now();
      
      // En la primera carga, siempre mostrar loading aunque haya cache
      if (cached && (now - cached.timestamp) < staleTime && !isInitialFetchRef.current) {
        setData(cached.data);
        if (showLoading) setIsLoading(false);
        setIsValidating(false);
        return cached.data;
      }

      // Marcar que ya no es el primer fetch
      isInitialFetchRef.current = false;

      // Si hay una petición en curso, esperarla
      if (cached?.promise) {
        const result = await cached.promise;
        setData(result);
        if (showLoading) setIsLoading(false);
        setIsValidating(false);
        return result;
      }

      // Realizar nueva petición
      const fetchPromise = fetch(url, { 
        signal: abortController.signal,
        headers: {
          'Cache-Control': 'max-age=30',
        }
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        // Extraer datos según la estructura de respuesta
        let extractedData;
        if (result.success && result.data) {
          // Estructura de API personalizada: { success: true, data: [...] }
          extractedData = result.data;
        } else if (Array.isArray(result)) {
          // Array directo
          extractedData = result;
        } else if (result.data) {
          // Otras estructuras con data
          extractedData = result.data;
        } else {
          // Usar el resultado completo
          extractedData = result;
        }
        
        // Actualizar cache
        cache.set(url, {
          data: extractedData,
          timestamp: Date.now(),
        });

        // Limpiar cache viejo
        const expiredKeys = Array.from(cache.keys()).filter(key => {
          const entry = cache.get(key);
          return entry && (Date.now() - entry.timestamp) > cacheTime;
        });
        expiredKeys.forEach(key => cache.delete(key));

        return extractedData;
      });

      // Guardar promesa en cache mientras se resuelve
      if (cached) {
        cache.set(url, { ...cached, promise: fetchPromise });
      } else {
        cache.set(url, { data: null, timestamp: 0, promise: fetchPromise });
      }

      const result = await fetchPromise;
      
      setData(result);
      return result;

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const errorMessage = error.message || 'Error desconocido';
        setError(errorMessage);
        console.error('Fetch error:', error);
      }
      return null;
    } finally {
      if (showLoading) setIsLoading(false);
      setIsValidating(false);
      abortControllerRef.current = null;
    }
  }, [url, enabled, cacheTime, staleTime]);

  const mutate = useCallback(async () => {
    if (url) {
      cache.delete(url);
      await fetchData(false);
    }
  }, [url, fetchData]);

  const refresh = useCallback(async () => {
    if (url) {
      cache.delete(url);
      await fetchData(true);
    }
  }, [url, fetchData]);

  // Fetch inicial
  useEffect(() => {
    if (enabled && url) {
      fetchData();
    }
  }, [url, enabled, fetchData]);

  // Configurar refresh interval
  useEffect(() => {
    if (refreshInterval && enabled && url) {
      intervalRef.current = setInterval(() => {
        fetchData(false);
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refreshInterval, enabled, url, fetchData]);

  // Revalidar en focus
  useEffect(() => {
    if (!revalidateOnFocus || !enabled || !url) return;

    const handleFocus = () => fetchData(false);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, enabled, url, fetchData]);

  // Revalidar en reconnect
  useEffect(() => {
    if (!revalidateOnReconnect || !enabled || !url) return;

    const handleOnline = () => fetchData(false);
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [revalidateOnReconnect, enabled, url, fetchData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    refresh,
  };
}

// Hook especializado para las inscripciones
export function useRegistrations() {
  return useOptimizedFetch('/api/inscripcion', {
    staleTime: 10 * 1000, // 10 segundos
    cacheTime: 2 * 60 * 1000, // 2 minutos
    revalidateOnFocus: true,
  });
}

// Hook para limpiar cache manualmente
export function useCacheClear() {
  return useCallback((pattern?: string) => {
    if (pattern) {
      const keysToDelete = Array.from(cache.keys()).filter(key => 
        key.includes(pattern)
      );
      keysToDelete.forEach(key => cache.delete(key));
    } else {
      cache.clear();
    }
  }, []);
}
