import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

// PATCH - Actualizar el estado de una inscripción de forma optimizada
export async function PATCH(
  request: NextRequest,
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

    // Usar transacción para consistencia y obtener documento actualizado
    const docRef = adminDb.collection('registrations').doc(id);
    const now = new Date().toISOString();
    
    const updatedData = await adminDb.runTransaction(async (transaction: any) => {
      const doc = await transaction.get(docRef);
      
      if (!doc.exists) {
        throw new Error('Inscripción no encontrada');
      }

      const currentData = doc.data();
      const updateData = {
        status,
        updatedAt: now,
        ...(customMessage && { lastMessage: customMessage }),
        // Optimización: mantener histórico de estados
        statusHistory: [
          ...(currentData?.statusHistory || []),
          {
            status,
            changedAt: now,
            ...(customMessage && { message: customMessage })
          }
        ]
      };

      transaction.update(docRef, updateData);
      
      return {
        ...currentData,
        ...updateData,
        _id: id
      };
    });

    // Procesar email de notificación de forma asíncrona (no bloqueante)
    if (customMessage && (status === 'approved' || status === 'rejected')) {
      // No esperar por el email para responder rápidamente
      setImmediate(async () => {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              registrationId: id,
              candidateName: updatedData.name,
              candidateEmail: updatedData.email,
              courseName: updatedData.course,
              status,
              customMessage
            }),
          });
        } catch (emailError) {
          console.error('Error enviando email asíncrono:', emailError);
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Estado actualizado correctamente',
      data: {
        id,
        status,
        updatedAt: now,
        previousStatus: updatedData.statusHistory?.[updatedData.statusHistory.length - 2]?.status
      }
    });

  } catch (error: any) {
    console.error('Error actualizando inscripción:', error);
    
    if (error.message === 'Inscripción no encontrada') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 404 }
      );
    }

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

// GET optimizado para obtener inscripción individual
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const doc = await adminDb.collection('registrations').doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    const data = doc.data();
    
    return NextResponse.json({
      success: true,
      data: {
        _id: doc.id,
        ...data,
      }
    });

  } catch (error: any) {
    console.error('Error obteniendo inscripción:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener la inscripción',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar inscripción (nuevo endpoint)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const doc = await adminDb.collection('registrations').doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    await adminDb.collection('registrations').doc(id).delete();
    
    return NextResponse.json({
      success: true,
      message: 'Inscripción eliminada correctamente',
      data: { id }
    });

  } catch (error: any) {
    console.error('Error eliminando inscripción:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al eliminar la inscripción',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
