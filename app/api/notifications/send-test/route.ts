import { NextResponse } from 'next/server';
import { getMessaging } from 'firebase-admin/messaging';
import { firebaseApp } from '@/app/config/firebase.config';

// POST - Enviar notificación de prueba
export async function POST(request: Request) {
  try {
    const { token, title, body, data, imageUrl } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token FCM es requerido' },
        { status: 400 }
      );
    }

    if (!firebaseApp) {
      return NextResponse.json(
        { success: false, message: 'Firebase no está configurado correctamente' },
        { status: 500 }
      );
    }

    // Configurar el mensaje
    const message = {
      token,
      notification: {
        title: title || '🎉 TeamsQA - Notificación de Prueba',
        body: body || 'Esta es una notificación de prueba para verificar que todo funciona correctamente.',
        imageUrl: imageUrl || undefined
      },
      data: {
        click_action: '/',
        url: '/',
        type: 'test_notification',
        timestamp: new Date().toISOString(),
        ...data
      },
      webpush: {
        fcmOptions: {
          link: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        },
        notification: {
          icon: '/Logo.svg',
          badge: '/Logo.svg',
          requireInteraction: true,
          vibrate: [200, 100, 200],
          tag: 'teamsqa-test'
        }
      }
    };

    // Enviar notificación
    const messaging = getMessaging(firebaseApp);
    const response = await messaging.send(message);

    console.log(`✅ Notificación de prueba enviada exitosamente: ${response}`);

    return NextResponse.json({
      success: true,
      message: 'Notificación de prueba enviada exitosamente',
      data: {
        messageId: response,
        token: token.substring(0, 20) + '...'
      }
    });

  } catch (error: any) {
    console.error('❌ Error enviando notificación de prueba:', error);
    
    // Manejar errores específicos de FCM
    let errorMessage = 'Error al enviar la notificación de prueba';
    
    if (error.code === 'messaging/registration-token-not-registered') {
      errorMessage = 'El token FCM no está registrado o ha expirado';
    } else if (error.code === 'messaging/invalid-registration-token') {
      errorMessage = 'Token FCM inválido';
    } else if (error.code === 'messaging/mismatched-credential') {
      errorMessage = 'Error de configuración de credenciales';
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}
