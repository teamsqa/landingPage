import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

// GET - Obtener curso específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseRef = adminDb.collection('courses').doc(id);
    const doc = await courseRef.get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    console.error('Error al obtener curso:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener el curso' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar curso
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseData = await request.json();
    
    const courseRef = adminDb.collection('courses').doc(id);
    const doc = await courseRef.get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    const updatedCourse = {
      ...courseData,
      updatedAt: new Date().toISOString()
    };

    await courseRef.update(updatedCourse);
    
    return NextResponse.json({
      success: true,
      data: { id, ...updatedCourse },
      message: 'Curso actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar el curso' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar curso
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseRef = adminDb.collection('courses').doc(id);
    const doc = await courseRef.get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    await courseRef.delete();
    
    return NextResponse.json({
      success: true,
      message: 'Curso eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    return NextResponse.json(
      { success: false, message: 'Error al eliminar el curso' },
      { status: 500 }
    );
  }
}
