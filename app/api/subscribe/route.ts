
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { createEmailService } from '@/app/lib/email-services';

// Función para generar el template de email de bienvenida
function generateWelcomeEmailTemplate(email: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Bienvenido al Newsletter de TeamsQA!</title>
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
        .welcome-badge {
          display: inline-block;
          background-color: #dcfce7;
          color: #166534;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          margin: 20px 0;
        }
        .content {
          margin: 20px 0;
        }
        .benefits {
          background-color: #f0fdf4;
          border-left: 4px solid #84cc16;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .benefits ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .benefits li {
          margin: 8px 0;
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
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #84cc16;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 TeamsQA</div>
          <h1>¡Bienvenido a nuestra comunidad!</h1>
          <span class="welcome-badge">✨ Suscripción Confirmada</span>
        </div>

        <div class="content">
          <p>¡Hola y bienvenido!</p>
          
          <p>Nos alegra mucho tenerte en nuestra comunidad de <strong>TeamsQA</strong>. Acabas de unirte a un grupo de profesionales apasionados por el testing y la calidad de software.</p>
          
          <div class="benefits">
            <h3>🎯 ¿Qué puedes esperar de nuestro newsletter?</h3>
            <ul>
              <li><strong>Contenido exclusivo</strong> sobre testing y QA</li>
              <li><strong>Tutoriales prácticos</strong> y casos de uso reales</li>
              <li><strong>Novedades</strong> sobre nuestros cursos y workshops</li>
              <li><strong>Tips y trucos</strong> para mejorar tus habilidades</li>
              <li><strong>Recursos gratuitos</strong> para tu desarrollo profesional</li>
              <li><strong>Invitaciones especiales</strong> a eventos y webinars</li>
            </ul>
          </div>

          <p>También te invitamos a explorar nuestros cursos especializados y recursos disponibles en nuestro sitio web.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://teamsqa.com'}" class="button">
              Explorar Cursos
            </a>
          </div>

          <div class="social-links" style="text-align: center;">
            <p><strong>Síguenos en nuestras redes sociales:</strong></p>
            <a href="https://linkedin.com/company/teamsqa">LinkedIn</a> |
            <a href="https://twitter.com/teamsqa">Twitter</a> |
            <a href="https://instagram.com/teamsqa">Instagram</a>
          </div>
        </div>

        <div class="footer">
          <p>Este email fue enviado a <strong>${email}</strong></p>
          <p>Si no deseas recibir más emails, puedes darte de baja en cualquier momento.</p>
          <p><strong>TeamsQA</strong> - Transformando el futuro del testing</p>
          <p>© ${new Date().getFullYear()} TeamsQA. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para enviar email de bienvenida
async function sendWelcomeEmail(email: string): Promise<boolean> {
  try {
    const emailService = createEmailService();
    const subject = '🎉 ¡Bienvenido al Newsletter de TeamsQA!';
    const htmlContent = generateWelcomeEmailTemplate(email);
    
    await emailService.send([email], subject, '', htmlContent);
    console.log(`✅ Email de bienvenida enviado a: ${email}`);
    return true;
  } catch (error: any) {
    console.error('❌ Error enviando email de bienvenida:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verificar si ya está suscrito
    const existingSubscriber = await getDocs(
      query(collection(db, 'subscribers'), where('email', '==', email))
    );

    if (!existingSubscriber.empty) {
      return NextResponse.json(
        { success: false, message: 'Este email ya está suscrito a nuestro newsletter' },
        { status: 400 }
      );
    }

    // Agregar a la base de datos
    const docRef = await addDoc(collection(db, 'subscribers'), {
      email,
      subscribedAt: serverTimestamp(),
      status: 'active',
      source: 'website',
    });

    // Enviar email de bienvenida
    const emailSent = await sendWelcomeEmail(email);

    return NextResponse.json({ 
      success: true, 
      message: 'Suscripción exitosa',
      data: {
        id: docRef.id,
        email,
        welcomeEmailSent: emailSent
      }
    });
    
  } catch (error: any) {
    console.error('Error al suscribir:', error);
    return NextResponse.json(
      { success: false, message: 'Error al suscribir', error: error.message },
      { status: 500 }
    );
  }
}