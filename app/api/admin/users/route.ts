import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';
import { User, CreateUserRequest, UserInvitation, ROLE_PERMISSIONS } from '@/app/types/user';
import EnhancedFirebaseInvitationService from '@/app/lib/enhanced-firebase-invitation';

// GET - Obtener todos los usuarios (solo admin)
export async function GET() {
  try {
    // TODO: Verificar que el usuario actual es admin
    
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.orderBy('createdAt', 'desc').get();
    
    const users = snapshot.docs.map((doc: any) => ({
      uid: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', String(error));
    return NextResponse.json(
      { success: false, message: 'Error al obtener los usuarios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario (solo admin)
export async function POST(request: Request) {
  try {
    // TODO: Verificar que el usuario actual es admin
    
    const body: CreateUserRequest = await request.json();
    const { email, displayName, role, profile, sendInvitation = true } = body;

    // Validar datos requeridos
    if (!email || !displayName || !role) {
      return NextResponse.json(
        { success: false, message: 'Email, nombre y rol son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    try {
      await adminAuth.getUserByEmail(email);
      return NextResponse.json(
        { success: false, message: 'El usuario ya existe con este email' },
        { status: 409 }
      );
    } catch (error: any) {
      // Si no existe, continuamos (esto es lo esperado)
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    const now = new Date().toISOString();
    
    // Crear el usuario en Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      displayName,
      emailVerified: false,
      disabled: false,
    });

    // Preparar datos del usuario
    const userData: Omit<User, 'uid'> = {
      email,
      displayName,
      role,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      profile: {
        ...profile,
        permissions: ROLE_PERMISSIONS[role]
      }
    };

    // Guardar en Firestore
    await adminDb.collection('users').doc(userRecord.uid).set(userData);

    // Crear invitación si se solicita
    if (sendInvitation) {
      try {
        // Generar y enviar invitación usando el servicio mejorado
        const invitationResult = await EnhancedFirebaseInvitationService.sendInvitationEmail({
          email,
          displayName,
          role,
          invitedBy: 'current-admin-uid' // TODO: Obtener del token actual
        });

        // Crear registro de invitación en Firestore
        const invitationToken = Buffer.from(JSON.stringify({
          uid: userRecord.uid,
          email,
          timestamp: Date.now()
        })).toString('base64url');

        const invitation: Omit<UserInvitation, 'id'> = {
          email,
          role,
          invitedBy: 'current-admin-uid', // TODO: Obtener del token actual
          createdAt: now,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
          status: invitationResult.emailSent ? 'sent' : 'pending',
          token: invitationToken,
          verificationLink: invitationResult.verificationLink,
          passwordLink: invitationResult.verificationLink // Usando el mismo link
        };

        const invitationRef = await adminDb.collection('invitations').add(invitation);
        
        return NextResponse.json({
          success: true,
          message: invitationResult.emailSent 
            ? 'Usuario creado e invitación enviada exitosamente'
            : 'Usuario creado, pero el email de invitación no se pudo enviar',
          data: {
            user: { uid: userRecord.uid, ...userData },
            invitation: {
              id: invitationRef.id,
              verificationLink: invitationResult.verificationLink,
              emailSent: invitationResult.emailSent,
              message: invitationResult.emailSent 
                ? 'Email de invitación enviado correctamente'
                : 'Error al enviar email. Revisa la configuración SMTP.'
            }
          }
        });

      } catch (invitationError) {
        console.error('Error enviando invitación:', invitationError);
        
        // El usuario fue creado pero la invitación falló
        return NextResponse.json({
          success: true,
          message: 'Usuario creado, pero no se pudo enviar la invitación',
          data: { 
            user: { uid: userRecord.uid, ...userData },
            invitationError: 'No se pudo enviar el email de invitación'
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: { uid: userRecord.uid, ...userData }
    });

  } catch (error) {
    console.error('Error al crear usuario:', String(error));
    return NextResponse.json(
      { success: false, message: 'Error al crear el usuario' },
      { status: 500 }
    );
  }
}
