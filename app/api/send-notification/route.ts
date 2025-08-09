import { NextResponse } from 'next/server';
import { createEmailService } from '@/app/lib/email-services';

// Función para enviar email usando el servicio configurado
async function sendEmail(to: string, subject: string, htmlContent: string) {
  try {
    const emailService = createEmailService();
    await emailService.send([to], subject, '', htmlContent);
    return { success: true, messageId: `msg_${Date.now()}` };
  } catch (error: any) {
    console.error('Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

function generateEmailTemplate(
  candidateName: string,
  courseName: string,
  status: 'approved' | 'rejected',
  customMessage: string
): string {
  const isApproved = status === 'approved';
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Respuesta a tu inscripción - TeamsQA</title>
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
          font-size: 28px;
          font-weight: bold;
          color: #84cc16;
          margin-bottom: 10px;
        }
        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
          margin: 20px 0;
        }
        .approved {
          background-color: #d1fae5;
          color: #065f46;
        }
        .rejected {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .content {
          margin: 20px 0;
        }
        .course-info {
          background-color: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .message-box {
          background-color: ${isApproved ? '#f0fdf4' : '#fef2f2'};
          border-left: 4px solid ${isApproved ? '#84cc16' : '#ef4444'};
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TeamsQA</div>
          <h1>Respuesta a tu Inscripción</h1>
        </div>

        <div class="content">
          <p>Hola <strong>${candidateName}</strong>,</p>
          
          <p>Hemos revisado tu inscripción para el curso <strong>"${courseName}"</strong> y queremos informarte sobre nuestra decisión.</p>
          
          <div class="course-info">
            <h3>Detalles del Curso</h3>
            <p><strong>Curso:</strong> ${courseName}</p>
            <p><strong>Estado:</strong> 
              <span class="status-badge ${isApproved ? 'approved' : 'rejected'}">
                ${isApproved ? '✅ Aprobado' : '❌ No Aprobado'}
              </span>
            </p>
          </div>

          <div class="message-box">
            <h3>${isApproved ? '🎉 ¡Felicitaciones!' : '📝 Mensaje del Equipo'}</h3>
            <p>${customMessage}</p>
          </div>

          ${isApproved ? `
            <p>Te contactaremos pronto con más detalles sobre el inicio del curso, horarios y acceso a la plataforma.</p>
            <a href="mailto:info@teamsqa.com" class="button">Contactar Soporte</a>
          ` : `
            <p>Te animamos a seguir preparándote y considerar aplicar nuevamente en el futuro. Puedes revisar nuestros otros cursos disponibles en nuestro sitio web.</p>
          `}
        </div>

        <div class="footer">
          <p>Este es un correo automático, por favor no respondas a esta dirección.</p>
          <p>Si tienes preguntas, contacta nuestro equipo de soporte.</p>
          <p><strong>TeamsQA</strong> - Transformando el futuro del testing</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const { 
      registrationId, 
      candidateName, 
      candidateEmail, 
      courseName, 
      status, 
      customMessage 
    } = await request.json();

    // Validaciones
    if (!registrationId || !candidateName || !candidateEmail || !courseName || !status || !customMessage) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Faltan datos requeridos para enviar el email' 
        },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Estado inválido. Debe ser "approved" o "rejected"' 
        },
        { status: 400 }
      );
    }

    // Generar el contenido del email
    const subject = `Respuesta a tu inscripción: ${courseName} - TeamsQA`;
    const htmlContent = generateEmailTemplate(candidateName, courseName, status, customMessage);

    // Enviar el email
    const emailResult = await sendEmail(candidateEmail, subject, htmlContent);

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Email enviado exitosamente',
        data: {
          messageId: emailResult.messageId,
          sentTo: candidateEmail,
          status: status
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Error al enviar el email',
          error: emailResult.error
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error enviando email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al enviar el email de notificación',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
