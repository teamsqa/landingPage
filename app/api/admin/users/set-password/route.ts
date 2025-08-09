import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';

// POST - Establecer contraseña para usuario recién verificado
export async function POST(request: Request) {
  try {
    const { uid, password, oobCode, testMode } = await request.json();

    // Validar datos requeridos
    if (!uid || !password) {
      return NextResponse.json(
        { success: false, message: 'UID y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    try {
      // Verificar que el usuario existe
      const userRecord = await adminAuth.getUser(uid);
      
      // En modo test, marcar automáticamente el email como verificado
      if (testMode && !userRecord.emailVerified) {
        console.log('🧪 Modo test: Marcando email como verificado para', userRecord.email);
        await adminAuth.updateUser(uid, {
          emailVerified: true
        });
      }
      
      // Verificar que el email ya está verificado (saltar en modo test después de la actualización)
      const updatedUserRecord = testMode ? await adminAuth.getUser(uid) : userRecord;
      
      if (!updatedUserRecord.emailVerified) {
        return NextResponse.json(
          { success: false, message: 'El email debe estar verificado antes de establecer la contraseña' },
          { status: 400 }
        );
      }

      // Establecer la contraseña
      await adminAuth.updateUser(uid, {
        password: password,
        disabled: false // Asegurar que la cuenta esté habilitada
      });

      // Actualizar estado en Firestore
      const userDocRef = adminDb.collection('users').doc(uid);
      const userDoc = await userDocRef.get();
      
      if (userDoc.exists) {
        await userDocRef.update({
          status: 'active',
          passwordSet: true,
          updatedAt: new Date().toISOString(),
          onboardingCompletedAt: new Date().toISOString()
        });
      }

      // Marcar invitaciones como completadas
      const invitationsQuery = adminDb
        .collection('invitations')
        .where('email', '==', userRecord.email)
        .where('status', 'in', ['sent', 'verified']);
      
      const invitations = await invitationsQuery.get();
      const batch = adminDb.batch();
      
      invitations.docs.forEach((doc: any) => {
        batch.update(doc.ref, {
          status: 'completed',
          completedAt: new Date().toISOString()
        });
      });
      
      if (!invitations.empty) {
        await batch.commit();
      }

      // Generar token de acceso personalizado para login inmediato (opcional)
      const customToken = await adminAuth.createCustomToken(uid);

      return NextResponse.json({
        success: true,
        message: 'Contraseña establecida exitosamente. ¡Registro completado!',
        data: {
          uid,
          email: userRecord.email,
          customToken, // Puede usarse para login automático
          status: 'active',
          onboardingComplete: true
        }
      });

    } catch (firebaseError: any) {
      console.error('Error de Firebase:', firebaseError);
      
      if (firebaseError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { success: false, message: 'Usuario no encontrado' },
          { status: 404 }
        );
      }
      
      if (firebaseError.code === 'auth/weak-password') {
        return NextResponse.json(
          { success: false, message: 'La contraseña es demasiado débil' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: 'Error al establecer la contraseña' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error al establecer contraseña:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
