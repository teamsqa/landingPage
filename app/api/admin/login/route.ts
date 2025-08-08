import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticación requerido' },
        { status: 400 }
      );
    }

    // Verificar el token ID
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Obtener información del usuario de Firebase Auth
    const authUser = await adminAuth.getUser(uid);

    // Obtener información del usuario de Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado en el sistema' },
        { status: 401 }
      );
    }

    const userData = userDoc.data();

    // Verificar que el usuario es admin o coordinador
    if (!userData?.role || (userData.role !== 'admin' && userData.role !== 'coordinator')) {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para acceder al panel de administración' },
        { status: 403 }
      );
    }

    // Verificar que el usuario está activo
    if (userData.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Tu cuenta no está activa' },
        { status: 403 }
      );
    }

    // Actualizar custom claims si es necesario
    await adminAuth.setCustomUserClaims(uid, {
      role: userData.role,
      permissions: userData.profile?.permissions || []
    });

    // Actualizar última actividad
    await adminDb.collection('users').doc(uid).update({
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Combinar datos de Firebase Auth con datos de Firestore
    const combinedUser = {
      // Datos de Firebase Auth
      uid: authUser.uid,
      email: authUser.email,
      emailVerified: authUser.emailVerified,
      displayName: authUser.displayName || userData.displayName || userData.firstName + ' ' + userData.lastName || null,
      photoURL: authUser.photoURL,
      phoneNumber: authUser.phoneNumber,
      disabled: authUser.disabled,
      metadata: {
        creationTime: authUser.metadata.creationTime,
        lastSignInTime: authUser.metadata.lastSignInTime,
        lastRefreshTime: authUser.metadata.lastRefreshTime
      },
      
      // Datos de Firestore (información adicional)
      role: userData.role,
      status: userData.status,
      profile: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.displayName || authUser.displayName,
        bio: userData.bio,
        department: userData.department,
        position: userData.position,
        permissions: userData.profile?.permissions || [],
        preferences: userData.profile?.preferences || {},
        avatar: userData.profile?.avatar || authUser.photoURL
      },
      
      // Metadatos del sistema
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      lastLoginAt: userData.lastLoginAt,
      invitedBy: userData.invitedBy,
      invitedAt: userData.invitedAt,
      
      // Información de actividad
      loginCount: userData.loginCount || 0,
      isOnline: true
    };

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: combinedUser
    });

  } catch (error: any) {
    console.error('Error en login:', error);
    
    let errorMessage = 'Error interno del servidor';
    if (error.code === 'auth/id-token-expired') {
      errorMessage = 'Token de autenticación expirado';
    } else if (error.code === 'auth/id-token-revoked') {
      errorMessage = 'Token de autenticación revocado';
    } else if (error.code === 'auth/invalid-id-token') {
      errorMessage = 'Token de autenticación inválido';
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 401 }
    );
  }
}