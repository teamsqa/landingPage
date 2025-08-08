import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { createCachedResponse } from '@/app/lib/api-cache-middleware';

// Cache local para evitar múltiples consultas a Firebase
let cachedCourses: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// GET - Obtener cursos activos para la landing page
export async function GET() {
  try {
    const now = Date.now();
    
    // Usar cache local si está disponible y no ha expirado
    if (cachedCourses && (now - cacheTimestamp) < CACHE_DURATION) {
      return createCachedResponse({
        success: true,
        data: cachedCourses
      }, {
        maxAge: Math.floor((CACHE_DURATION - (now - cacheTimestamp)) / 1000),
        etag: `"courses-${cacheTimestamp}"`
      });
    }

    // Optimizar consulta Firebase con índices
    const coursesRef = adminDb.collection('courses')
      .where('active', '==', true)
      .orderBy('createdAt', 'desc');
    
    const snapshot = await coursesRef.get();
    
    const courses = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        image: data.image,
        level: data.level,
        duration: data.duration,
        tools: data.tools || [],
        whatYouWillLearn: data.whatYouWillLearn || [],
        active: data.active,
        createdAt: data.createdAt
      };
    });

    // Actualizar cache local
    cachedCourses = courses;
    cacheTimestamp = now;

    return createCachedResponse({
      success: true,
      data: courses
    }, {
      maxAge: Math.floor(CACHE_DURATION / 1000),
      etag: `"courses-${cacheTimestamp}"`
    });

  } catch (error) {
    console.error('Error al obtener cursos públicos:', String(error));
    return NextResponse.json(
      { success: false, message: 'Error al obtener los cursos' },
      { status: 500 }
    );
  }
}
