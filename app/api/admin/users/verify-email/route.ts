import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';

// POST - Verificar email y actualizar estado del usuario
export async function POST(request: Request) {
  try {
    const { oobCode, continueUrl } = await request.json();

    if (!oobCode) {
      return NextResponse.json(
        { success: false, message: 'Código de verificación requerido' },
        { status: 400 }
      );
    }

    // Verificar el código con Firebase Admin
    try {
      // Verificar el email usando Firebase Admin
      await adminAuth.checkRevocationCode(oobCode);
      
      // Obtener información del código
      const emailInfo = await adminAuth.verifyEmailVerificationCode(oobCode);
      
      if (!emailInfo.email) {
        return NextResponse.json(
          { success: false, message: 'No se pudo obtener el email del código' },
          { status: 400 }
        );
      }

      // Obtener el usuario por email
      const userRecord = await adminAuth.getUserByEmail(emailInfo.email);
      
      // Marcar el email como verificado
      await adminAuth.updateUser(userRecord.uid, {
        emailVerified: true
      });

      // Actualizar estado en Firestore
      const userDocRef = adminDb.collection('users').doc(userRecord.uid);
      const userDoc = await userDocRef.get();
      
      if (userDoc.exists) {
        await userDocRef.update({
          status: 'active', // Cambiar de 'pending' a 'active'
          emailVerified: true,
          updatedAt: new Date().toISOString()
        });
      }

      // Actualizar estado de invitaciones relacionadas
      const invitationsQuery = adminDb
        .collection('invitations')
        .where('email', '==', emailInfo.email)
        .where('status', '==', 'sent');
      
      const invitations = await invitationsQuery.get();
      const batch = adminDb.batch();
      
      invitations.docs.forEach((doc: any) => {
        batch.update(doc.ref, {
          status: 'verified',
          verifiedAt: new Date().toISOString()
        });
      });
      
      if (!invitations.empty) {
        await batch.commit();
      }

      return NextResponse.json({
        success: true,
        message: 'Email verificado exitosamente',
        data: {
          email: emailInfo.email,
          uid: userRecord.uid,
          continueUrl: continueUrl || '/admin/set-password',
          userStatus: 'active'
        }
      });

    } catch (firebaseError: any) {
      console.error('Error de Firebase:', firebaseError);
      
      if (firebaseError.code === 'auth/invalid-action-code') {
        return NextResponse.json(
          { success: false, message: 'Código de verificación inválido o expirado' },
          { status: 400 }
        );
      }
      
      if (firebaseError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { success: false, message: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: false, message: 'Error al verificar el email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error al verificar email:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener información del código de verificación sin ejecutarlo
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const oobCode = url.searchParams.get('oobCode');

    if (!oobCode) {
      return NextResponse.json(
        { success: false, message: 'Código de verificación requerido' },
        { status: 400 }
      );
    }

    try {
      // Solo obtener información sin verificar
      const emailInfo = await adminAuth.verifyEmailVerificationCode(oobCode);
      
      if (!emailInfo.email) {
        return NextResponse.json(
          { success: false, message: 'Código inválido' },
          { status: 400 }
        );
      }

      // Obtener información del usuario
      const userRecord = await adminAuth.getUserByEmail(emailInfo.email);
      const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
      
      const userData = userDoc.exists ? userDoc.data() : null;

      return NextResponse.json({
        success: true,
        data: {
          email: emailInfo.email,
          uid: userRecord.uid,
          displayName: userData?.displayName || userRecord.displayName,
          role: userData?.role,
          emailVerified: userRecord.emailVerified,
          userStatus: userData?.status || 'pending'
        }
      });

    } catch (firebaseError: any) {
      console.error('Error verificando código:', firebaseError);
      
      if (firebaseError.code === 'auth/invalid-action-code') {
        return NextResponse.json(
          { success: false, message: 'Código de verificación inválido o expirado' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: 'Error al verificar el código' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error al obtener información del código:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
