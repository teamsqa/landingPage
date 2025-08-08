import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Aplicar headers de optimización para rutas estáticas
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  // Headers para imágenes
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return response;
  }

  // Headers para API routes (aplicar cache ligero)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    return response;
  }

  // Headers generales de seguridad y rendimiento
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};