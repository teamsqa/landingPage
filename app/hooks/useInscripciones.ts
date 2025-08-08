'use client';

import { useState, useEffect, useCallback } from 'react';

interface Registration {
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
}

interface UseInscripcionesResult {
  registrations: Registration[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useInscripciones(): UseInscripcionesResult {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Siempre empezar con loading true
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async (showLoading = true) => {
    const startTime = Date.now();
    const minLoadingTime = 800; // Tiempo mínimo de loading en ms

    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetch('/api/inscripcion', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      let extractedData: Registration[];
      if (result.success && result.data) {
        extractedData = result.data;
      } else if (Array.isArray(result)) {
        extractedData = result;
      } else if (result.data) {
        extractedData = result.data;
      } else {
        extractedData = result;
      }

      setRegistrations(extractedData || []);

      // Asegurar tiempo mínimo de loading para mostrar skeleton
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      if (remainingTime > 0 && showLoading) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

    } catch (err: any) {
      console.error('Error fetching registrations:', err);
      setError(err.message || 'Error al cargar las inscripciones');
      setRegistrations([]);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchRegistrations(true);
  }, [fetchRegistrations]);

  // Fetch inicial
  useEffect(() => {
    fetchRegistrations(true);
  }, [fetchRegistrations]);

  return {
    registrations,
    isLoading,
    error,
    refresh,
  };
}
