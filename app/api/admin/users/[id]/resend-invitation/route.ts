import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebase-admin';
import FirebaseInvitationService from '@/app/lib/firebase-invitation';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Verificar autenticación del admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Verificar que el usuario es admin
    const adminUserDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const adminUserData = adminUserDoc.data();
    
    if (!adminUserData || adminUserData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Obtener información del usuario a invitar
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    if (!userData) {
      return NextResponse.json(
        { error: 'Datos de usuario no válidos' },
        { status: 400 }
      );
    }

    // Reenviar invitación
    const invitationResult = await FirebaseInvitationService.sendInvitationEmail({
      email: userData.email,
      displayName: userData.displayName || userData.email,
      role: userData.role,
      invitedBy: decodedToken.email || 'Admin'
    });

    // Actualizar el documento del usuario con los nuevos links
    await adminDb.collection('users').doc(userId).update({
      invitationStatus: 'sent',
      invitationSentAt: new Date().toISOString(),
      verificationLink: invitationResult.verificationLink,
      passwordLink: invitationResult.passwordLink,
      lastInvitationSentBy: decodedToken.uid
    });

    return NextResponse.json({
      message: 'Invitación reenviada exitosamente',
      user: {
        id: userId,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role
      },
      invitation: {
        verificationLink: invitationResult.verificationLink,
        passwordLink: invitationResult.passwordLink,
        sentAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error reenviando invitación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
