import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
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
