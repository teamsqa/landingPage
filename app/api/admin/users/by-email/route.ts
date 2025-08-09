import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';

// GET - Obtener usuario por email
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email requerido' },
        { status: 400 }
      );
    }

    try {
      // Obtener usuario de Firebase Auth por email
      const userRecord = await adminAuth.getUserByEmail(email);
      
      // Obtener datos adicionales de Firestore
      const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
      const userData = userDoc.exists ? userDoc.data() : null;

      const result = {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName,
        disabled: userRecord.disabled,
        // Datos de Firestore si existen
        role: userData?.role,
        status: userData?.status || 'pending',
        profile: userData?.profile
      };

      console.log(`✅ Usuario encontrado por email ${email}:`, userRecord.uid);

      return NextResponse.json({
        success: true,
        data: result
      });

    } catch (firebaseError: any) {
      if (firebaseError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { success: false, message: 'Usuario no encontrado con ese email' },
          { status: 404 }
        );
      }
      
      console.error('Error Firebase:', firebaseError);
      return NextResponse.json(
        { success: false, message: 'Error al buscar el usuario' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
