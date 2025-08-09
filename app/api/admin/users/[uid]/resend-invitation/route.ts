import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';
import EnhancedFirebaseInvitationService from '@/app/lib/enhanced-firebase-invitation';

// POST - Reenviar invitación a usuario existente
export async function POST(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'UID de usuario requerido' },
        { status: 400 }
      );
    }

    // Obtener datos del usuario de Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Datos de usuario no válidos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe en Firebase Auth
    try {
      await adminAuth.getUser(uid);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { success: false, message: 'Usuario no encontrado en Firebase Auth' },
          { status: 404 }
        );
      }
      throw error;
    }

    // Generar y enviar nueva invitación
    const invitationResult = await EnhancedFirebaseInvitationService.resendInvitationEmail({
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      invitedBy: 'current-admin-uid' // TODO: Obtener del token actual
    });

    // Crear nuevo registro de invitación
    const invitationToken = Buffer.from(JSON.stringify({
      uid,
      email: userData.email,
      timestamp: Date.now()
    })).toString('base64url');

    const now = new Date().toISOString();
    const invitation = {
      email: userData.email,
      role: userData.role,
      invitedBy: 'current-admin-uid', // TODO: Obtener del token actual
      createdAt: now,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
      status: invitationResult.emailSent ? 'sent' : 'pending',
      token: invitationToken,
      verificationLink: invitationResult.verificationLink,
      passwordLink: invitationResult.verificationLink
    };

    // Guardar nueva invitación
    const invitationRef = await adminDb.collection('invitations').add(invitation);

    // Marcar invitaciones anteriores como expiradas (opcional)
    const oldInvitationsQuery = adminDb
      .collection('invitations')
      .where('email', '==', userData.email)
      .where('status', '==', 'sent');
    
    const oldInvitations = await oldInvitationsQuery.get();
    const batch = adminDb.batch();
    
    oldInvitations.docs.forEach((doc: any) => {
      if (doc.id !== invitationRef.id) {
        batch.update(doc.ref, { status: 'expired' });
      }
    });
    
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: invitationResult.emailSent 
        ? 'Invitación reenviada exitosamente'
        : 'Invitación generada, pero el email no se pudo enviar',
      data: {
        invitation: {
          id: invitationRef.id,
          verificationLink: invitationResult.verificationLink,
          emailSent: invitationResult.emailSent,
          message: invitationResult.emailSent 
            ? 'Email de invitación reenviado correctamente'
            : 'Error al enviar email. Revisa la configuración SMTP.'
        }
      }
    });

  } catch (error) {
    console.error('Error al reenviar invitación:', error);
    return NextResponse.json(
      { success: false, message: 'Error al reenviar la invitación' },
      { status: 500 }
    );
  }
}
