import { NextRequest, NextResponse } from 'next/server';

// Cache global para el middleware
const apiCache = new Map<string, { 
  data: any; 
  timestamp: number; 
  etag: string;
  headers: Record<string, string>;
}>();

const CACHE_DURATION = 30 * 1000; // 30 segundos por defecto

export function createCacheMiddleware(options: {
  duration?: number;
  skipPaths?: string[];
  onlyPaths?: string[];
} = {}) {
  const { 
    duration = CACHE_DURATION, 
    skipPaths = [], 
    onlyPaths = [] 
  } = options;

  return async function cacheMiddleware(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const { pathname, search } = new URL(request.url);
    const method = request.method;
    
    // Solo cachear GET requests
    if (method !== 'GET') {
      const response = await handler(request);
      
      // Invalidar cache relacionado después de mutaciones
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        invalidateRelatedCache(pathname);
      }
      
      return response;
    }

    // Verificar si la ruta debe ser cacheada
    const shouldCache = shouldCacheRequest(pathname, skipPaths, onlyPaths);
    if (!shouldCache) {
      return handler(request);
    }

    const cacheKey = `${pathname}${search}`;
    const cached = apiCache.get(cacheKey);
    const now = Date.now();

    // Verificar cache válido
    if (cached && (now - cached.timestamp) < duration) {
      // Verificar ETag si está presente
      const ifNoneMatch = request.headers.get('if-none-match');
      if (ifNoneMatch && ifNoneMatch === cached.etag) {
        return new NextResponse(null, { 
          status: 304,
          headers: {
            'etag': cached.etag,
            'cache-control': `public, max-age=${Math.floor(duration / 1000)}`,
          }
        });
      }

      return new NextResponse(JSON.stringify(cached.data), {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'etag': cached.etag,
          'cache-control': `public, max-age=${Math.floor(duration / 1000)}`,
          'x-cache': 'HIT',
          ...cached.headers
        }
      });
    }

    // Ejecutar handler original
    const response = await handler(request);
    
    // Solo cachear responses exitosos
    if (response.status === 200 && response.headers.get('content-type')?.includes('application/json')) {
      try {
        const responseData = await response.clone().json();
        const etag = generateETag(responseData);
        
        // Guardar en cache
        apiCache.set(cacheKey, {
          data: responseData,
          timestamp: now,
          etag,
          headers: {
            'content-type': response.headers.get('content-type') || 'application/json'
          }
        });

        // Limpiar cache antiguo periódicamente
        if (Math.random() < 0.1) {
          cleanExpiredCache(duration);
        }

        // Agregar headers de cache
        const cachedResponse = new NextResponse(JSON.stringify(responseData), {
          status: 200,
          headers: {
            'content-type': 'application/json',
            'etag': etag,
            'cache-control': `public, max-age=${Math.floor(duration / 1000)}`,
            'x-cache': 'MISS'
          }
        });

        return cachedResponse;
      } catch (error) {
        console.error('Error caching response:', error);
      }
    }

    return response;
  };
}

function shouldCacheRequest(
  pathname: string, 
  skipPaths: string[], 
  onlyPaths: string[]
): boolean {
  // Si hay onlyPaths definidos, solo cachear esas rutas
  if (onlyPaths.length > 0) {
    return onlyPaths.some(path => pathname.startsWith(path));
  }

  // Skip paths específicos
  if (skipPaths.some(path => pathname.startsWith(path))) {
    return false;
  }

  // Cachear APIs por defecto excepto rutas de autenticación
  return pathname.startsWith('/api/') && 
         !pathname.includes('/auth') && 
         !pathname.includes('/login');
}

function generateETag(data: any): string {
  // Generar ETag simple basado en el hash del contenido
  const content = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32-bit
  }
  return `"${Math.abs(hash).toString(16)}"`;
}

function cleanExpiredCache(duration: number) {
  const now = Date.now();
  apiCache.forEach((value, key) => {
    if (now - value.timestamp > duration * 2) { // Limpiar cache 2x más viejo
      apiCache.delete(key);
    }
  });
}

function invalidateRelatedCache(pathname: string) {
  // Invalidar cache relacionado basado en el path
  const patterns = [
    pathname,
    pathname.split('/').slice(0, -1).join('/'), // Path padre
  ];

  apiCache.forEach((value, key) => {
    if (patterns.some(pattern => key.startsWith(pattern))) {
      apiCache.delete(key);
    }
  });
}

// Helper para crear response con cache headers
export function createCachedResponse(
  data: any, 
  options: {
    maxAge?: number;
    etag?: string;
    lastModified?: string;
  } = {}
) {
  const { maxAge = 30, etag, lastModified } = options;
  
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'cache-control': `public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
  };

  if (etag) {
    headers['etag'] = etag;
  }

  if (lastModified) {
    headers['last-modified'] = lastModified;
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers
  });
}

// Export del cache para debugging
export { apiCache };
