import { adminAuth } from './firebase-admin';
import { createEmailService } from './email-services';

export interface InvitationEmailOptions {
  email: string;
  displayName: string;
  role: string;
  invitedBy: string;
}

// Template de email de invitación de usuario
function generateUserInvitationEmailTemplate(options: InvitationEmailOptions, verificationLink: string): string {
  const { displayName, role, invitedBy } = options;
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitación a TeamsQA - Bienvenido al Equipo</title>
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 8px;
          margin: -40px -40px 30px -40px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .welcome-badge {
          display: inline-block;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          margin-top: 10px;
        }
        .content {
          margin: 20px 0;
        }
        .role-info {
          background-color: #e0f2fe;
          border-left: 4px solid #0ea5e9;
          padding: 20px;
          border-radius: 0 8px 8px 0;
          margin: 20px 0;
        }
        .steps {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .steps h3 {
          color: #166534;
          margin-top: 0;
        }
        .steps ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        .steps li {
          margin: 10px 0;
          font-weight: 500;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          margin: 30px 0;
          font-weight: bold;
          font-size: 16px;
          text-align: center;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .security-note {
          background-color: #fef2f2;
          border-left: 4px solid #f87171;
          padding: 15px;
          border-radius: 0 8px 8px 0;
          margin: 20px 0;
          font-size: 14px;
        }
        .role-badge {
          display: inline-block;
          background-color: #fbbf24;
          color: #92400e;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 TeamsQA</div>
          <h1>¡Bienvenido al Equipo!</h1>
          <div class="welcome-badge">📧 Invitación Oficial</div>
        </div>

        <div class="content">
          <p>Hola <strong>${displayName}</strong>,</p>
          
          <p>¡Excelente noticia! <strong>${invitedBy}</strong> te ha invitado a formar parte del equipo de <strong>TeamsQA</strong>.</p>
          
          <div class="role-info">
            <h3>🎯 Tu Rol en el Equipo</h3>
            <p>Has sido asignado como: <span class="role-badge">${role}</span></p>
            <p>Este rol te dará acceso a las funcionalidades y herramientas necesarias para colaborar efectivamente en nuestros proyectos de testing y QA.</p>
          </div>

          <div class="steps">
            <h3>📋 Pasos para Completar tu Registro:</h3>
            <ol>
              <li><strong>Verifica tu email</strong> haciendo clic en el botón de abajo</li>
              <li><strong>Establece tu contraseña</strong> personal y segura</li>
              <li><strong>Completa tu perfil</strong> con tu información profesional</li>
              <li><strong>Explora la plataforma</strong> y conoce las herramientas disponibles</li>
            </ol>
          </div>

          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">
              🔐 Verificar Email y Comenzar
            </a>
          </div>

          <div class="security-note">
            <h4>🔒 Nota de Seguridad:</h4>
            <p>Este enlace es válido por <strong>7 días</strong> y es único para ti. No lo compartas con nadie más. Si no completaste el registro, puedes solicitar un nuevo enlace al administrador.</p>
          </div>

          <p><strong>¿Tienes preguntas?</strong><br>
          No dudes en contactar al equipo administrativo o responder a este email.</p>
        </div>

        <div class="footer">
          <p>Este email fue enviado desde el sistema de administración de <strong>TeamsQA</strong></p>
          <p>Si no esperabas esta invitación, puedes ignorar este email de forma segura.</p>
          <p>© ${new Date().getFullYear()} TeamsQA. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Template de email de reenvío de invitación
function generateResendInvitationEmailTemplate(options: InvitationEmailOptions, verificationLink: string): string {
  const { displayName, role, invitedBy } = options;
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recordatorio - Completa tu Registro en TeamsQA</title>
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
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 30px;
          border-radius: 8px;
          margin: -40px -40px 30px -40px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .reminder-badge {
          display: inline-block;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          margin-top: 10px;
        }
        .content {
          margin: 20px 0;
        }
        .reminder-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          border-radius: 0 8px 8px 0;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          margin: 30px 0;
          font-weight: bold;
          font-size: 16px;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
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
          <div class="logo">⏰ TeamsQA</div>
          <h1>Recordatorio de Invitación</h1>
          <div class="reminder-badge">🔄 Reenvío</div>
        </div>

        <div class="content">
          <p>Hola <strong>${displayName}</strong>,</p>
          
          <p>Notamos que aún no has completado tu registro en <strong>TeamsQA</strong>. ¡No queremos que te pierdas la oportunidad de formar parte de nuestro equipo!</p>
          
          <div class="reminder-box">
            <h3>🎯 Tu invitación como <strong>${role}</strong> sigue activa</h3>
            <p>Hemos generado un <strong>nuevo enlace de verificación</strong> para que puedas completar tu registro cuando te sea más conveniente.</p>
          </div>

          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">
              🔐 Completar Registro Ahora
            </a>
          </div>

          <p><strong>¿Necesitas ayuda?</strong><br>
          Si tienes problemas con el registro o preguntas sobre tu rol, contacta a <strong>${invitedBy}</strong> o al equipo administrativo.</p>
        </div>

        <div class="footer">
          <p>Este es un recordatorio automático del sistema de administración de <strong>TeamsQA</strong></p>
          <p>Si ya completaste tu registro, puedes ignorar este email.</p>
          <p>© ${new Date().getFullYear()} TeamsQA. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export class EnhancedFirebaseInvitationService {
  
  /**
   * Genera un link de invitación personalizado para un usuario
   */
  static async generateInvitationLink(options: InvitationEmailOptions): Promise<string> {
    try {
      const { email, displayName, role } = options;
      
      // Configuración del action code para email verification
      const actionCodeSettings = {
        // URL donde redirigir después de verificar el email (usando localhost para desarrollo)
        url: `http://localhost:3000/admin/complete-invitation?role=${role}&name=${encodeURIComponent(displayName)}&verified=true`,
        handleCodeInApp: false, // Redirigir al navegador principal, no dentro de la app
      };

      // Generar link de verificación de email usando Firebase nativo
      const link = await adminAuth.generateEmailVerificationLink(email, actionCodeSettings);
      
      console.log('🔗 Link de verificación generado para:', email);
      return link;
    } catch (error) {
      console.error('Error generando link de invitación:', error);
      throw new Error('No se pudo generar el link de invitación');
    }
  }

  /**
   * Envía un email de invitación real usando nuestro sistema de email
   */
  static async sendInvitationEmail(options: InvitationEmailOptions, isResend: boolean = false): Promise<{
    verificationLink: string;
    emailSent: boolean;
  }> {
    try {
      const { email, displayName } = options;

      // Generar link de verificación
      const verificationLink = await this.generateInvitationLink(options);

      // Enviar email real usando nuestro servicio
      try {
        const emailService = createEmailService();
        
        const subject = isResend 
          ? `🔄 Recordatorio - Completa tu registro en TeamsQA`
          : `🎉 ¡Bienvenido al equipo de TeamsQA!`;
        
        const htmlContent = isResend 
          ? generateResendInvitationEmailTemplate(options, verificationLink)
          : generateUserInvitationEmailTemplate(options, verificationLink);

        await emailService.send([email], subject, '', htmlContent);
        
        console.log(`✅ ${isResend ? 'Reenvío de invitación' : 'Invitación'} enviada a: ${email}`);

        return {
          verificationLink,
          emailSent: true
        };

      } catch (emailError: any) {
        console.error(`❌ Error enviando ${isResend ? 'reenvío de invitación' : 'invitación'}:`, emailError);
        
        // Aunque el email falle, devolvemos el link para logging
        return {
          verificationLink,
          emailSent: false
        };
      }

    } catch (error) {
      console.error('Error en el servicio de invitación:', error);
      throw error;
    }
  }

  /**
   * Reenvía una invitación existente
   */
  static async resendInvitationEmail(options: InvitationEmailOptions): Promise<{
    verificationLink: string;
    emailSent: boolean;
  }> {
    return this.sendInvitationEmail(options, true);
  }
}

export default EnhancedFirebaseInvitationService;
