import { NextResponse } from 'next/server';
import { getMessaging } from 'firebase-admin/messaging';
import { firebaseApp } from '@/app/config/firebase.config';
import { adminDb } from '@/app/lib/firebase-admin';
import { createEmailService } from '@/app/lib/email-services';

interface NotificationPayload {
  title: string;
  body: string;
  imageUrl?: string;
  clickAction?: string;
  data?: Record<string, string>;
}

interface SendOptions {
  sendPush?: boolean;
  sendEmail?: boolean;
  targetAudience?: 'all' | 'subscribers' | 'users' | 'specific';
  specificTokens?: string[];
  specificEmails?: string[];
}

// Función para obtener tokens FCM activos
async function getActiveTokens(targetAudience: string = 'all', specificTokens?: string[]): Promise<string[]> {
  try {
    if (targetAudience === 'specific' && specificTokens) {
      return specificTokens;
    }

    const tokensQuery = await adminDb
      .collection('fcm_tokens')
      .where('isActive', '==', true)
      .get();

    const tokens: string[] = [];
    tokensQuery.forEach((doc: any) => {
      const data = doc.data();
      if (data.token) {
        tokens.push(data.token);
      }
    });

    console.log(`📱 Encontrados ${tokens.length} tokens FCM activos`);
    return tokens;
  } catch (error) {
    console.error('Error obteniendo tokens FCM:', error);
    return [];
  }
}

// Función para obtener emails de suscriptores
async function getSubscriberEmails(targetAudience: string = 'all', specificEmails?: string[]): Promise<string[]> {
  try {
    if (targetAudience === 'specific' && specificEmails) {
      return specificEmails;
    }

    const emails: string[] = [];

    if (targetAudience === 'subscribers' || targetAudience === 'all') {
      const subscribersQuery = await adminDb
        .collection('subscribers')
        .where('status', '==', 'active')
        .get();

      subscribersQuery.forEach((doc: any) => {
        const data = doc.data();
        if (data.email) {
          emails.push(data.email);
        }
      });
    }

    if (targetAudience === 'users' || targetAudience === 'all') {
      const usersQuery = await adminDb
        .collection('users')
        .where('status', '==', 'active')
        .get();

      usersQuery.forEach((doc: any) => {
        const data = doc.data();
        if (data.email) {
          emails.push(data.email);
        }
      });
    }

    // Eliminar duplicados
    const uniqueEmails = Array.from(new Set(emails));
    console.log(`📧 Encontrados ${uniqueEmails.length} emails únicos`);
    return uniqueEmails;
  } catch (error) {
    console.error('Error obteniendo emails:', error);
    return [];
  }
}

// Función para enviar notificaciones push
async function sendPushNotifications(tokens: string[], payload: NotificationPayload): Promise<any> {
  if (!firebaseApp || tokens.length === 0) {
    return { successCount: 0, failureCount: 0, responses: [] };
  }

  const messaging = getMessaging(firebaseApp);

  // Configurar el mensaje
  const message = {
    notification: {
      title: payload.title,
      body: payload.body,
      imageUrl: payload.imageUrl
    },
    data: {
      click_action: payload.clickAction || '/',
      url: payload.clickAction || '/',
      timestamp: new Date().toISOString(),
      ...payload.data
    },
    webpush: {
      fcmOptions: {
        link: payload.clickAction || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      },
      notification: {
        icon: '/Logo.svg',
        badge: '/Logo.svg',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        tag: 'teamsqa-broadcast'
      }
    }
  };

  try {
    // Enviar a múltiples tokens (máximo 500 por lote según FCM)
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      batches.push(batch);
    }

    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    const allResponses = [];

    for (const batch of batches) {
      try {
        const response = await messaging.sendEachForMulticast({
          ...message,
          tokens: batch
        });

        totalSuccessCount += response.successCount;
        totalFailureCount += response.failureCount;
        allResponses.push(...response.responses);

        console.log(`✅ Lote procesado: ${response.successCount} éxitos, ${response.failureCount} fallos`);
      } catch (error) {
        console.error('Error enviando lote de notificaciones:', error);
        totalFailureCount += batch.length;
      }
    }

    return {
      successCount: totalSuccessCount,
      failureCount: totalFailureCount,
      responses: allResponses
    };
  } catch (error) {
    console.error('Error enviando notificaciones push:', error);
    throw error;
  }
}

// Función para generar template de email de notificación
function generateNotificationEmailTemplate(payload: NotificationPayload): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${payload.title} - TeamsQA</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: white;
          border-radius: 10px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #84cc16;
          margin-bottom: 10px;
        }
        .content {
          margin: 20px 0;
        }
        .main-image {
          width: 100%;
          max-width: 500px;
          height: auto;
          border-radius: 8px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background-color: #84cc16;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 TeamsQA</div>
          <h1>${payload.title}</h1>
        </div>

        <div class="content">
          ${payload.imageUrl ? `<img src="${payload.imageUrl}" alt="Imagen de notificación" class="main-image">` : ''}
          
          <p>${payload.body}</p>

          ${payload.clickAction ? `
            <div style="text-align: center;">
              <a href="${payload.clickAction}" class="button">
                Ver más información
              </a>
            </div>
          ` : ''}
        </div>

        <div class="footer">
          <p>Gracias por ser parte de la comunidad <strong>TeamsQA</strong></p>
          <p>© ${new Date().getFullYear()} TeamsQA. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para enviar emails
async function sendEmailNotifications(emails: string[], payload: NotificationPayload): Promise<any> {
  if (emails.length === 0) {
    return { successCount: 0, failureCount: 0 };
  }

  try {
    const emailService = createEmailService();
    const subject = `📢 ${payload.title} | TeamsQA`;
    const htmlContent = generateNotificationEmailTemplate(payload);

    // Enviar emails en lotes de 50 para evitar límites de rate
    const batchSize = 50;
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      try {
        await emailService.send(batch, subject, '', htmlContent);
        successCount += batch.length;
        console.log(`✅ Emails enviados: ${batch.length} destinatarios`);
      } catch (error) {
        console.error(`❌ Error enviando lote de emails:`, error);
        failureCount += batch.length;
      }

      // Pausa entre lotes para evitar rate limiting
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { successCount, failureCount };
  } catch (error) {
    console.error('Error enviando emails:', error);
    return { successCount: 0, failureCount: emails.length };
  }
}

export async function POST(request: Request) {
  try {
    const { payload, options }: { payload: NotificationPayload; options: SendOptions } = await request.json();

    if (!payload.title || !payload.body) {
      return NextResponse.json(
        { success: false, message: 'Título y contenido son requeridos' },
        { status: 400 }
      );
    }

    const results: any = {
      push: { successCount: 0, failureCount: 0 },
      email: { successCount: 0, failureCount: 0 }
    };

    // Enviar notificaciones push
    if (options.sendPush !== false) {
      console.log('📱 Preparando notificaciones push...');
      const tokens = await getActiveTokens(options.targetAudience, options.specificTokens);
      
      if (tokens.length > 0) {
        results.push = await sendPushNotifications(tokens, payload);
        console.log(`✅ Push notifications: ${results.push.successCount} enviadas, ${results.push.failureCount} fallidas`);
      } else {
        console.log('⚠️ No se encontraron tokens FCM activos');
      }
    }

    // Enviar notificaciones por email
    if (options.sendEmail !== false) {
      console.log('📧 Preparando notificaciones por email...');
      const emails = await getSubscriberEmails(options.targetAudience, options.specificEmails);
      
      if (emails.length > 0) {
        results.email = await sendEmailNotifications(emails, payload);
        console.log(`✅ Email notifications: ${results.email.successCount} enviadas, ${results.email.failureCount} fallidas`);
      } else {
        console.log('⚠️ No se encontraron emails activos');
      }
    }

    // Guardar registro de la notificación
    await adminDb.collection('notification_logs').add({
      payload,
      options,
      results,
      sentAt: new Date().toISOString(),
      totalRecipients: results.push.successCount + results.push.failureCount + results.email.successCount + results.email.failureCount
    });

    return NextResponse.json({
      success: true,
      message: 'Notificaciones enviadas',
      data: {
        summary: {
          pushNotifications: {
            sent: results.push.successCount,
            failed: results.push.failureCount
          },
          emailNotifications: {
            sent: results.email.successCount,
            failed: results.email.failureCount
          },
          total: {
            sent: results.push.successCount + results.email.successCount,
            failed: results.push.failureCount + results.email.failureCount
          }
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Error enviando notificaciones:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al enviar las notificaciones',
        error: error.message
      },
      { status: 500 }
    );
  }
}
