import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

// Cache en memoria para datos recientes (5 minutos)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Optimized GET with pagination, sorting, and caching
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Máximo 100
    const status = searchParams.get('status') || null;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
    
    // Crear clave de cache única
    const cacheKey = `inscriptions_${page}_${limit}_${status}_${sortBy}_${sortOrder}`;
    
    // Verificar cache
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cached.data.registrations,
        meta: cached.data.meta,
        cached: true
      });
    }

    // Construir query base
    let query = adminDb.collection('registrations');
    
    // Aplicar filtros
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query = query.where('status', '==', status);
    }
    
    // Aplicar ordenamiento
    query = query.orderBy(sortBy, sortOrder);
    
    // Aplicar paginación
    const offset = (page - 1) * limit;
    query = query.offset(offset).limit(limit);

    const snapshot = await query.get();
    
    // Obtener total count (optimizado para evitar multiple queries)
    let totalQuery = adminDb.collection('registrations');
    if (status) {
      totalQuery = totalQuery.where('status', '==', status);
    }
    
    // Ejecutar queries en paralelo
    const [dataSnapshot, countSnapshot] = await Promise.all([
      Promise.resolve(snapshot),
      totalQuery.get()
    ]);
    
    const registrations = dataSnapshot.docs.map((doc: DocumentSnapshot) => {
      const data = doc.data() || {};
      return {
        _id: doc.id,
        ...data,
      };
    });

    const totalCount = countSnapshot.size;
    const totalPages = Math.ceil(totalCount / limit);
    
    const result = {
      registrations,
      meta: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
    
    // Guardar en cache
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    // Limpiar cache antigua cada 100 requests
    if (Math.random() < 0.01) {
      cleanOldCache();
    }

    return NextResponse.json({
      success: true,
      data: result.registrations,
      meta: result.meta
    });

  } catch (error: any) {
    console.error('Error obteniendo inscripciones:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener las inscripciones',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Optimized POST with validation and async processing
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const now = new Date().toISOString();
    
    // Validación básica
    const requiredFields = ['name', 'email', 'course'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Campos requeridos faltantes: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Verificar duplicados por email y curso
    const existingQuery = await adminDb.collection('registrations')
      .where('email', '==', formData.email.toLowerCase())
      .where('course', '==', formData.course)
      .limit(1)
      .get();
    
    if (!existingQuery.empty) {
      return NextResponse.json(
        { success: false, message: 'Ya existe una inscripción con este email para este curso' },
        { status: 409 }
      );
    }

    // Preparar datos optimizados
    const registrationData = {
      ...formData,
      email: formData.email.toLowerCase(), // Normalizar email
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      // Campos de búsqueda optimizados
      searchName: formData.name.toLowerCase(),
      searchEmail: formData.email.toLowerCase(),
    };

    const docRef = await adminDb.collection('registrations').add(registrationData);
    
    // Invalidar cache relacionado de forma asíncrona
    process.nextTick(() => {
      invalidateCache(['pending', 'all']);
    });

    return NextResponse.json({
      success: true,
      message: 'Inscripción recibida correctamente',
      data: { 
        id: docRef.id,
        status: 'pending',
        createdAt: now
      },
    });

  } catch (error: any) {
    console.error('Error procesando la inscripción:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar la inscripción',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Función para limpiar cache antigua
function cleanOldCache() {
  const now = Date.now();
  cache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  });
}

// Función para invalidar cache específico
function invalidateCache(statuses: string[]) {
  cache.forEach((value, key) => {
    const shouldInvalidate = statuses.some(status => 
      key.includes(`_${status}_`) || key.includes('_all_') || status === 'all'
    );
    if (shouldInvalidate) {
      cache.delete(key);
    }
  });
}
