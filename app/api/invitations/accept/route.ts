import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

// POST - Aceptar invitación
export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de invitación requerido' },
        { status: 400 }
      );
    }

    // Decodificar token
    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64url').toString());
      const { uid, email, timestamp } = tokenData;

      // Verificar que el token no ha expirado (7 días)
      const expirationTime = timestamp + (7 * 24 * 60 * 60 * 1000);
      if (Date.now() > expirationTime) {
        return NextResponse.json(
          { success: false, message: 'El token de invitación ha expirado' },
          { status: 410 }
        );
      }

      // Buscar la invitación
      const invitationsQuery = await adminDb
        .collection('invitations')
        .where('token', '==', token)
        .where('status', '==', 'pending')
        .get();

      if (invitationsQuery.empty) {
        return NextResponse.json(
          { success: false, message: 'Invitación no válida o ya utilizada' },
          { status: 404 }
        );
      }

      const invitationDoc = invitationsQuery.docs[0];
      
      // Marcar invitación como aceptada
      await invitationDoc.ref.update({
        status: 'accepted',
        acceptedAt: new Date().toISOString()
      });

      // Activar usuario
      await adminDb.collection('users').doc(uid).update({
        status: 'active',
        updatedAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: 'Invitación aceptada exitosamente',
        data: { uid, email }
      });

    } catch (decodeError) {
      return NextResponse.json(
        { success: false, message: 'Token de invitación inválido' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error al aceptar invitación:', String(error));
    return NextResponse.json(
      { success: false, message: 'Error al procesar la invitación' },
      { status: 500 }
    );
  }
}
