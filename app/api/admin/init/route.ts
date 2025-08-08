import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';
import { ROLE_PERMISSIONS } from '@/app/types/user';

// GET - Verificar si ya existe un administrador
export async function GET() {
  try {
    const adminQuery = await adminDb.collection('users').where('role', '==', 'admin').get();
    const hasAdmin = !adminQuery.empty;

    return NextResponse.json({
      hasAdmin,
      canInitialize: !hasAdmin
    });

  } catch (error: any) {
    console.error('Error al verificar administradores:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al verificar el estado del sistema' 
      },
      { status: 500 }
    );
  }
}

// POST - Crear el primer usuario administrador
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, displayName } = body;

    // Validar datos requeridos
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { success: false, message: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un administrador
    const adminQuery = await adminDb.collection('users').where('role', '==', 'admin').get();
    if (!adminQuery.empty) {
      return NextResponse.json(
        { success: false, message: 'Ya existe un administrador en el sistema' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    
    // Crear el usuario en Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });

    // Preparar datos del usuario administrador
    const userData = {
      email,
      displayName,
      role: 'admin',
      status: 'active',
      createdAt: now,
      updatedAt: now,
      profile: {
        firstName: displayName.split(' ')[0] || displayName,
        lastName: displayName.split(' ').slice(1).join(' ') || '',
        permissions: ROLE_PERMISSIONS.admin
      }
    };

    // Guardar en Firestore
    await adminDb.collection('users').doc(userRecord.uid).set(userData);

    return NextResponse.json({
      success: true,
      message: 'Administrador creado exitosamente',
      data: {
        uid: userRecord.uid,
        email,
        displayName,
        role: 'admin'
      }
    });

  } catch (error: any) {
    console.error('Error al crear administrador inicial:', error);
    
    // Manejar errores específicos de Firebase Auth
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { success: false, message: 'El email ya está registrado' },
        { status: 409 }
      );
    }
    
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { success: false, message: 'El email no es válido' },
        { status: 400 }
      );
    }
    
    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { success: false, message: 'La contraseña es muy débil' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error al crear el administrador' },
      { status: 500 }
    );
  }
}
