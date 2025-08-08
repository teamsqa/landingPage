import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

// GET - Obtener todos los cursos
export async function GET() {
  try {
    const coursesRef = adminDb.collection('courses');
    const snapshot = await coursesRef.orderBy('createdAt', 'desc').get();
    
    const courses = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los cursos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo curso
export async function POST(request: NextRequest) {
  try {
    const courseData = await request.json();
    
    // Validaciones básicas
    if (!courseData.title || !courseData.description) {
      return NextResponse.json(
        { success: false, message: 'Título y descripción son requeridos' },
        { status: 400 }
      );
    }

    // Agregar timestamps
    const newCourse = {
      ...courseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true
    };

    const docRef = await adminDb.collection('courses').add(newCourse);
    
    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...newCourse },
      message: 'Curso creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear curso:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear el curso' },
      { status: 500 }
    );
  }
}
