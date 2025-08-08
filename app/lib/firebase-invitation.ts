import { adminAuth } from './firebase-admin';

export interface InvitationEmailOptions {
  email: string;
  displayName: string;
  role: string;
  invitedBy: string;
}

export class FirebaseInvitationService {
  
  /**
   * Genera un link de invitación personalizado para un usuario
   */
  static async generateInvitationLink(options: InvitationEmailOptions): Promise<string> {
    try {
      const { email, displayName, role } = options;
      
      // Configuración del action code para email verification
      const actionCodeSettings = {
        // URL donde redirigir después de verificar el email
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/complete-invitation?role=${role}&name=${encodeURIComponent(displayName)}`,
        handleCodeInApp: true,
      };

      // Generar link de verificación de email
      const link = await adminAuth.generateEmailVerificationLink(email, actionCodeSettings);
      
      return link;
    } catch (error) {
      console.error('Error generando link de invitación:', error);
      throw new Error('No se pudo generar el link de invitación');
    }
  }

  /**
   * Genera un link de restablecimiento de contraseña para un usuario recién creado
   */
  static async generatePasswordSetupLink(email: string): Promise<string> {
    try {
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/set-password`,
        handleCodeInApp: true,
      };

      // Generar link para establecer contraseña
      const link = await adminAuth.generatePasswordResetLink(email, actionCodeSettings);
      
      return link;
    } catch (error) {
      console.error('Error generando link de contraseña:', error);
      throw new Error('No se pudo generar el link de contraseña');
    }
  }

  /**
   * Envía un email de invitación usando Firebase Auth (requiere configuración de templates)
   */
  static async sendInvitationEmail(options: InvitationEmailOptions): Promise<{
    verificationLink: string;
    passwordLink: string;
  }> {
    try {
      const { email, displayName, role } = options;

      // Generar ambos links
      const verificationLink = await this.generateInvitationLink(options);
      const passwordLink = await this.generatePasswordSetupLink(email);

      return {
        verificationLink,
        passwordLink
      };

    } catch (error) {
      console.error('Error enviando invitación:', error);
      throw error;
    }
  }

  /**
   * Configura templates de email personalizados (requiere Firebase Console)
   */
  static getEmailTemplateInstructions() {
    return {
      steps: [
        "1. Ve a Firebase Console > Authentication > Templates",
        "2. Configura el template de 'Email address verification'",
        "3. Personaliza el mensaje para incluir información de invitación",
        "4. Configura el template de 'Password reset'",
        "5. Personaliza para el flujo de establecimiento de contraseña inicial"
      ],
      templates: {
        emailVerification: {
          subject: "Invitación a TeamsQA - Verifica tu email",
          body: `
            <h2>¡Bienvenido a TeamsQA!</h2>
            <p>Has sido invitado a unirte a nuestro sistema.</p>
            <p>Para completar tu registro:</p>
            <ol>
              <li>Haz clic en el enlace de verificación de email</li>
              <li>Establece tu contraseña</li>
              <li>Completa tu perfil</li>
            </ol>
            <p><a href="%LINK%">Verificar Email y Continuar</a></p>
          `
        },
        passwordReset: {
          subject: "TeamsQA - Establece tu contraseña",
          body: `
            <h2>Establece tu contraseña</h2>
            <p>Para completar tu registro en TeamsQA, establece tu contraseña:</p>
            <p><a href="%LINK%">Establecer Contraseña</a></p>
          `
        }
      }
    };
  }
}

export default FirebaseInvitationService;
