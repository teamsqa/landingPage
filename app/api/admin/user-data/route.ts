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
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Combinar datos de Firebase Auth con datos de Firestore
    const combinedUser = {
      // Datos de Firebase Auth
      uid: authUser.uid,
      email: authUser.email,
      emailVerified: authUser.emailVerified,
      displayName: authUser.displayName || userData?.displayName || 
                   (userData?.firstName && userData?.lastName ? `${userData.firstName} ${userData.lastName}` : null),
      photoURL: authUser.photoURL,
      phoneNumber: authUser.phoneNumber,
      disabled: authUser.disabled,
      metadata: {
        creationTime: authUser.metadata.creationTime,
        lastSignInTime: authUser.metadata.lastSignInTime,
        lastRefreshTime: authUser.metadata.lastRefreshTime
      },
      
      // Datos de Firestore (información adicional)
      role: userData?.role || 'estudiante',
      status: userData?.status || 'pending',
      profile: {
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        fullName: userData?.firstName && userData?.lastName ? 
                 `${userData.firstName} ${userData.lastName}` : 
                 (userData?.displayName || authUser.displayName || ''),
        bio: userData?.bio || '',
        department: userData?.department || '',
        position: userData?.position || '',
        permissions: userData?.profile?.permissions || {
          canCreateUsers: false,
          canEditUsers: false,
          canDeleteUsers: false,
          canManageCourses: false,
          canViewReports: false,
          canManageInscriptions: false,
          canAccessAdmin: false
        },
        preferences: userData?.profile?.preferences || {},
        avatar: userData?.profile?.avatar || authUser.photoURL || null
      },
      
      // Metadatos del sistema
      createdAt: userData?.createdAt || new Date().toISOString(),
      updatedAt: userData?.updatedAt || new Date().toISOString(),
      lastLoginAt: userData?.lastLoginAt || null,
      invitedBy: userData?.invitedBy || null,
      invitedAt: userData?.invitedAt || null,
      
      // Información de actividad
      loginCount: userData?.loginCount || 0,
      isOnline: true
    };

    return NextResponse.json({
      success: true,
      user: combinedUser
    });

  } catch (error: any) {
    console.error('Error obteniendo datos del usuario:', error);
    
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
