import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

// POST - Registrar token FCM de un usuario
export async function POST(request: Request) {
  try {
    const { token, userId, deviceInfo } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token FCM es requerido' },
        { status: 400 }
      );
    }

    // Guardar o actualizar token en Firestore
    const tokenData = {
      token,
      userId: userId || null,
      deviceInfo: deviceInfo || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    // Verificar si el token ya existe
    const existingTokenQuery = await adminDb
      .collection('fcm_tokens')
      .where('token', '==', token)
      .get();

    if (existingTokenQuery.empty) {
      // Crear nuevo token
      await adminDb.collection('fcm_tokens').add(tokenData);
      console.log(`✅ Nuevo token FCM registrado: ${token.substring(0, 20)}...`);
    } else {
      // Actualizar token existente
      const existingDoc = existingTokenQuery.docs[0];
      await existingDoc.ref.update({
        updatedAt: new Date().toISOString(),
        isActive: true,
        userId: userId || existingDoc.data().userId,
        deviceInfo: deviceInfo || existingDoc.data().deviceInfo
      });
      console.log(`🔄 Token FCM actualizado: ${token.substring(0, 20)}...`);
    }

    return NextResponse.json({
      success: true,
      message: 'Token registrado correctamente',
      data: { tokenId: token.substring(0, 20) + '...' }
    });

  } catch (error: any) {
    console.error('Error registrando token FCM:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al registrar el token',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE - Desactivar token FCM
export async function DELETE(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token FCM es requerido' },
        { status: 400 }
      );
    }

    // Buscar y desactivar token
    const tokenQuery = await adminDb
      .collection('fcm_tokens')
      .where('token', '==', token)
      .get();

    if (!tokenQuery.empty) {
      const tokenDoc = tokenQuery.docs[0];
      await tokenDoc.ref.update({
        isActive: false,
        deactivatedAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: 'Token desactivado correctamente'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Token no encontrado' },
        { status: 404 }
      );
    }

  } catch (error: any) {
    console.error('Error desactivando token FCM:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al desactivar el token',
        error: error.message
      },
      { status: 500 }
    );
  }
}
