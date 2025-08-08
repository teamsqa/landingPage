import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

// PATCH - Actualizar el estado de una inscripción
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, customMessage } = await request.json();
    const { id } = await params;

    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Estado inválido' },
        { status: 400 }
      );
    }

    // Obtener la inscripción actual para enviar el email
    const registrationDoc = await adminDb.collection('registrations').doc(id).get();
    
    if (!registrationDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    const registrationData = registrationDoc.data();
    
    // Actualizar el estado en la base de datos
    const now = new Date().toISOString();
    await adminDb.collection('registrations').doc(id).update({
      status,
      updatedAt: now,
      ...(customMessage && { lastMessage: customMessage })
    });

    // Si se proporciona un mensaje personalizado, enviar email de notificación
    if (customMessage && (status === 'approved' || status === 'rejected')) {
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationId: id,
            candidateName: registrationData?.name,
            candidateEmail: registrationData?.email,
            courseName: registrationData?.course,
            status,
            customMessage
          }),
        });

        const emailResult = await emailResponse.json();
        
        if (!emailResult.success) {
          console.error('Error enviando email:', emailResult.message);
          // No fallar la actualización si el email falla
        }
      } catch (emailError) {
        console.error('Error enviando email de notificación:', emailError);
        // No fallar la actualización si el email falla
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Estado actualizado correctamente',
      data: {
        id,
        status,
        updatedAt: now
      }
    });

  } catch (error: any) {
    console.error('Error actualizando inscripción:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al actualizar la inscripción',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

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
