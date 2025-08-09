import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { firebaseOptimizer } from '@/app/lib/firebase-optimizer';
import { createEmailService } from '@/app/lib/email-services';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

// Función para generar el template de confirmación de inscripción
function generateRegistrationConfirmationTemplate(formData: any): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Inscripción - TeamsQA</title>
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
        .status-badge {
          display: inline-block;
          background-color: #fef3c7;
          color: #92400e;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          margin: 20px 0;
        }
        .content {
          margin: 20px 0;
        }
        .info-box {
          background-color: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .highlight {
          background-color: #e0f2fe;
          border-left: 4px solid #0ea5e9;
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
          <div class="logo">✅ TeamsQA</div>
          <h1>¡Inscripción Recibida!</h1>
          <span class="status-badge">📝 En Revisión</span>
        </div>

        <div class="content">
          <p>Hola <strong>${formData.name}</strong>,</p>
          
          <p>¡Gracias por tu interés en <strong>TeamsQA</strong>! Hemos recibido tu inscripción para el curso <strong>"${formData.course}"</strong> y queremos confirmarte que está siendo revisada por nuestro equipo.</p>
          
          <div class="info-box">
            <h3>📋 Resumen de tu Inscripción</h3>
            <p><strong>Nombre:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Curso:</strong> ${formData.course}</p>
            <p><strong>Teléfono:</strong> ${formData.phone || 'No proporcionado'}</p>
            <p><strong>Fecha de inscripción:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
          </div>

          <div class="highlight">
            <h3>🕐 ¿Qué sigue ahora?</h3>
            <p>Nuestro equipo revisará tu inscripción y nos pondremos en contacto contigo pronto para informarte sobre:</p>
            <ul>
              <li>El estado de tu aplicación</li>
              <li>Los próximos pasos del proceso</li>
              <li>Información sobre fechas de inicio</li>
              <li>Detalles del programa de estudios</li>
            </ul>
          </div>

          <p>Mientras tanto, te invitamos a seguir nuestras redes sociales y explorar nuestro contenido educativo.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://teamsqa.com'}" class="button">
              Visitar nuestro Blog
            </a>
          </div>

          <p><strong>¿Tienes preguntas?</strong><br>
          No dudes en contactarnos en <a href="mailto:info@teamsqa.com">info@teamsqa.com</a></p>
        </div>

        <div class="footer">
          <p>Este es un correo automático de confirmación.</p>
          <p><strong>TeamsQA</strong> - Transformando el futuro del testing</p>
          <p>© ${new Date().getFullYear()} TeamsQA. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para enviar notificación al administrador
function generateAdminNotificationTemplate(formData: any, registrationId: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Inscripción - TeamsQA Admin</title>
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
          background-color: #3b82f6;
          color: white;
          padding: 20px;
          border-radius: 8px;
        }
        .urgent-badge {
          display: inline-block;
          background-color: #dc2626;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          margin: 10px 0;
        }
        .details {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .admin-actions {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Nueva Inscripción</h1>
          <span class="urgent-badge">REQUIERE REVISIÓN</span>
        </div>

        <div class="details">
          <h3>📊 Detalles del Candidato</h3>
          <p><strong>ID:</strong> ${registrationId}</p>
          <p><strong>Nombre:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Teléfono:</strong> ${formData.phone || 'No proporcionado'}</p>
          <p><strong>Curso:</strong> ${formData.course}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          
          ${formData.experience ? `<p><strong>Experiencia:</strong> ${formData.experience}</p>` : ''}
          ${formData.motivation ? `<p><strong>Motivación:</strong> ${formData.motivation}</p>` : ''}
          ${formData.comments ? `<p><strong>Comentarios:</strong> ${formData.comments}</p>` : ''}
        </div>

        <div class="admin-actions">
          <h3>⚡ Acciones Requeridas</h3>
          <p>Esta inscripción está pendiente de revisión. Accede al panel de administración para:</p>
          <ul>
            <li>Revisar los detalles completos</li>
            <li>Aprobar o rechazar la solicitud</li>
            <li>Enviar respuesta al candidato</li>
          </ul>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/inscripciones" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Ver en Panel Admin
          </a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para enviar emails de confirmación
async function sendRegistrationEmails(formData: any, registrationId: string) {
  try {
    const emailService = createEmailService();
    
    // Email de confirmación al candidato
    const confirmationSubject = `✅ Inscripción recibida - ${formData.course} | TeamsQA`;
    const confirmationHtml = generateRegistrationConfirmationTemplate(formData);
    
    await emailService.send([formData.email], confirmationSubject, '', confirmationHtml);
    console.log(`✅ Email de confirmación enviado a: ${formData.email}`);

    // Email de notificación al admin (si está configurado)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (adminEmail) {
      const adminSubject = `🚨 Nueva inscripción: ${formData.name} - ${formData.course}`;
      const adminHtml = generateAdminNotificationTemplate(formData, registrationId);
      
      await emailService.send([adminEmail], adminSubject, '', adminHtml);
      console.log(`✅ Notificación enviada al admin: ${adminEmail}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('❌ Error enviando emails:', error);
    return { success: false, error: error.message };
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const now = new Date().toISOString();

    // Validación básica
    const requiredFields = ['name', 'email', 'course'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Campos requeridos faltantes: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Verificar duplicados usando optimizador
    const existingRegistrations = await firebaseOptimizer.executeQuery({
      collection: 'registrations',
      filters: [
        { field: 'email', operator: '==', value: formData.email.toLowerCase() },
        { field: 'course', operator: '==', value: formData.course }
      ],
      limit: 1,
      cacheTTL: 10000 // 10 segundos para verificación de duplicados
    });
    
    if (existingRegistrations.docs.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Ya existe una inscripción con este email para este curso' },
        { status: 409 }
      );
    }

    const docRef = await adminDb.collection('registrations').add({
      ...formData,
      email: formData.email.toLowerCase(), // Normalizar email
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      // Campos de búsqueda optimizados
      searchName: formData.name.toLowerCase(),
      searchEmail: formData.email.toLowerCase(),
    });

    // Enviar emails de confirmación y notificación
    const emailResult = await sendRegistrationEmails(formData, docRef.id);

    return NextResponse.json({
      success: true,
      message: 'Inscripción recibida correctamente',
      data: { 
        id: docRef.id,
        emailsSent: emailResult.success,
        emailError: emailResult.error || null
      },
    });
  } catch (error: any) {
    console.error('Error procesando la inscripción:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar la inscripción',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const status = url.searchParams.get('status');
    
    const filters = [];
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filters.push({ field: 'status', operator: '==' as const, value: status });
    }

    const result = await firebaseOptimizer.executeQuery({
      collection: 'registrations',
      filters,
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit,
      offset: (page - 1) * limit,
      cacheTTL: 30000 // 30 segundos de cache
    });

    // Formato de respuesta compatible
    return NextResponse.json({
      success: true,
      data: result.docs,
      meta: {
        currentPage: page,
        totalCount: result.totalCount,
        totalPages: result.totalCount ? Math.ceil(result.totalCount / limit) : 1,
        limit,
        hasNext: result.hasMore,
        hasPrev: page > 1
      }
    });
  } catch (error: any) {
    console.error('Error obteniendo inscripciones:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener las inscripciones',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
