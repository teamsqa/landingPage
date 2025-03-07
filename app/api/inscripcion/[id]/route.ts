import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Validación básica del payload (puedes ajustarla según tus necesidades)
    if (!formData || typeof formData !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Payload inválido' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const docRef = await adminDb.collection('registrations').add({
      ...formData,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: 'Inscripción recibida correctamente',
      data: { id: docRef.id },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error procesando la inscripción:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar la inscripción',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const snapshot = await adminDb.collection('registrations').get();
    const registrations = snapshot.docs.map((doc: DocumentSnapshot) => {
      const data = doc.data() || {};
      return {
        _id: doc.id,
        ...data,
      };
    });

    return NextResponse.json({
      success: true,
      data: registrations,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error obteniendo inscripciones:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener las inscripciones',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
