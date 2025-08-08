import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';
import { User, ROLE_PERMISSIONS } from '@/app/types/user';

type Params = {
  params: Promise<{
    uid: string;
  }>;
};

// GET - Obtener usuario específico
export async function GET(request: Request, { params }: Params) {
  try {
    const { uid } = await params;
    
    const userDoc = await adminDb.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const userData = { uid: userDoc.id, ...userDoc.data() };

    return NextResponse.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error al obtener usuario:', String(error));
    return NextResponse.json(
      { success: false, message: 'Error al obtener el usuario' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar usuario
export async function PUT(request: Request, { params }: Params) {
  try {
    const { uid } = await params;
    const body = await request.json();
    
    // TODO: Verificar permisos del usuario actual
    
    const { email, displayName, role, status, profile } = body;
    
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    // Actualizar Firebase Auth si es necesario
    const authUpdates: any = {};
    if (email) authUpdates.email = email;
    if (displayName) authUpdates.displayName = displayName;
    if (status === 'suspended') authUpdates.disabled = true;
    if (status === 'active') authUpdates.disabled = false;

    if (Object.keys(authUpdates).length > 0) {
      await adminAuth.updateUser(uid, authUpdates);
    }

    // Preparar datos para Firestore
    if (email) updateData.email = email;
    if (displayName) updateData.displayName = displayName;
    if (role) {
      updateData.role = role;
      updateData.profile = {
        ...profile,
        permissions: ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]
      };
    }
    if (status) updateData.status = status;
    if (profile && !role) updateData.profile = profile;

    // Actualizar en Firestore
    await adminDb.collection('users').doc(uid).update(updateData);

    // Obtener datos actualizados
    const updatedDoc = await adminDb.collection('users').doc(uid).get();
    const updatedUser = { uid: updatedDoc.id, ...updatedDoc.data() };

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', String(error));
    return NextResponse.json(
      { success: false, message: 'Error al actualizar el usuario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario (solo admin)
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { uid } = await params;
    
    // TODO: Verificar que el usuario actual es admin
    
    // Eliminar de Firebase Auth
    await adminAuth.deleteUser(uid);
    
    // Eliminar de Firestore
    await adminDb.collection('users').doc(uid).delete();

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', String(error));
    return NextResponse.json(
      { success: false, message: 'Error al eliminar el usuario' },
      { status: 500 }
    );
  }
}
