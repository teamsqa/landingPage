import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { firebaseOptimizer } from '@/app/lib/firebase-optimizer';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

export async function POST(request: Request) {
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

    // Verificar duplicados usando optimizador
    const existingRegistrations = await firebaseOptimizer.executeQuery({
      collection: 'registrations',
      filters: [
        { field: 'email', operator: '==', value: formData.email.toLowerCase() },
        { field: 'course', operator: '==', value: formData.course }
      ],
      limit: 1,
      cacheTTL: 10000 // 10 segundos para verificación de duplicados
    });
    
    if (existingRegistrations.docs.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Ya existe una inscripción con este email para este curso' },
        { status: 409 }
      );
    }

    const docRef = await adminDb.collection('registrations').add({
      ...formData,
      email: formData.email.toLowerCase(), // Normalizar email
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      // Campos de búsqueda optimizados
      searchName: formData.name.toLowerCase(),
      searchEmail: formData.email.toLowerCase(),
    });

    return NextResponse.json({
      success: true,
      message: 'Inscripción recibida correctamente',
      data: { id: docRef.id },
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const status = url.searchParams.get('status');
    
    const filters = [];
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filters.push({ field: 'status', operator: '==' as const, value: status });
    }

    const result = await firebaseOptimizer.executeQuery({
      collection: 'registrations',
      filters,
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit,
      offset: (page - 1) * limit,
      cacheTTL: 30000 // 30 segundos de cache
    });

    // Formato de respuesta compatible
    return NextResponse.json({
      success: true,
      data: result.docs,
      meta: {
        currentPage: page,
        totalCount: result.totalCount,
        totalPages: result.totalCount ? Math.ceil(result.totalCount / limit) : 1,
        limit,
        hasNext: result.hasMore,
        hasPrev: page > 1
      }
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
