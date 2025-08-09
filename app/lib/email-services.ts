// Configuración de servicios de email para TeamsQA Newsletter
// Puedes elegir el servicio que prefieras y configurar las credenciales

export interface EmailService {
  name: string;
  send: (to: string[], subject: string, content: string, htmlContent: string) => Promise<void>;
}

// 1. Configuración con SendGrid (Recomendado para producción)
export class SendGridService implements EmailService {
  name = 'SendGrid';
  
  constructor(private apiKey: string, private fromEmail: string) {}
  
  async send(to: string[], subject: string, content: string, htmlContent: string): Promise<void> {
    // Implementación con SendGrid
    // npm install @sendgrid/mail
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(this.apiKey);
    
    const msg = {
      to,
      from: this.fromEmail,
      subject,
      text: content,
      html: htmlContent,
    };
    
    await sgMail.sendMultiple(msg);
    */
    throw new Error('SendGrid no configurado. Instala @sendgrid/mail y descomenta el código.');
  }
}

// 2. Configuración con Mailgun
export class MailgunService implements EmailService {
  name = 'Mailgun';
  
  constructor(private apiKey: string, private domain: string, private fromEmail: string) {}
  
  async send(to: string[], subject: string, content: string, htmlContent: string): Promise<void> {
    // Implementación con Mailgun
    // npm install mailgun-js
    /*
    const mailgun = require('mailgun-js');
    const mg = mailgun({apiKey: this.apiKey, domain: this.domain});
    
    const data = {
      from: this.fromEmail,
      to,
      subject,
      text: content,
      html: htmlContent
    };
    
    await mg.messages().send(data);
    */
    throw new Error('Mailgun no configurado. Instala mailgun-js y descomenta el código.');
  }
}

// 3. Configuración con Resend (Moderno y fácil de usar)
export class ResendService implements EmailService {
  name = 'Resend';
  
  constructor(private apiKey: string, private fromEmail: string) {}
  
  async send(to: string[], subject: string, content: string, htmlContent: string): Promise<void> {
    // Implementación con Resend
    // npm install resend
    /*
    const { Resend } = require('resend');
    const resend = new Resend(this.apiKey);
    
    for (const email of to) {
      await resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject,
        text: content,
        html: htmlContent,
      });
    }
    */
    throw new Error('Resend no configurado. Instala resend y descomenta el código.');
  }
}

// 4. Configuración con Nodemailer + SMTP (Gmail, Outlook, etc.)
export class SMTPService implements EmailService {
  name = 'SMTP';
  
  constructor(
    private host: string, 
    private port: number, 
    private user: string, 
    private password: string,
    private fromEmail: string
  ) {}
  
  async send(to: string[], subject: string, content: string, htmlContent: string): Promise<void> {
    try {
      // Implementación con Nodemailer
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: this.host,
        port: this.port,
        secure: this.port === 465,
        auth: {
          user: this.user,
          pass: this.password,
        },
      });

      // Verificar configuración
      await transporter.verify();
      
      for (const email of to) {
        await transporter.sendMail({
          from: this.fromEmail,
          to: email,
          subject,
          text: content,
          html: htmlContent,
        });
      }

      console.log(`✅ Email enviado exitosamente a ${to.length} destinatario(s)`);
    } catch (error: any) {
      console.error('❌ Error enviando email:', error);
      throw new Error(`Error SMTP: ${error?.message || 'Error desconocido'}`);
    }
  }
}

// Factory para crear el servicio según la configuración
export function createEmailService(): EmailService {
  // Revisa las variables de entorno para determinar qué servicio usar
  
  if (process.env.SENDGRID_API_KEY) {
    return new SendGridService(
      process.env.SENDGRID_API_KEY,
      process.env.FROM_EMAIL || 'newsletter@teamsqa.com'
    );
  }
  
  if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    return new MailgunService(
      process.env.MAILGUN_API_KEY,
      process.env.MAILGUN_DOMAIN,
      process.env.FROM_EMAIL || 'newsletter@teamsqa.com'
    );
  }
  
  if (process.env.RESEND_API_KEY) {
    return new ResendService(
      process.env.RESEND_API_KEY,
      process.env.FROM_EMAIL || 'newsletter@teamsqa.com'
    );
  }
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return new SMTPService(
      process.env.SMTP_HOST,
      parseInt(process.env.SMTP_PORT || '587'),
      process.env.SMTP_USER,
      process.env.SMTP_PASSWORD,
      process.env.FROM_EMAIL || 'newsletter@teamsqa.com'
    );
  }
  
  // Servicio de demostración (no envía emails reales)
  return new DemoEmailService();
}

// Servicio de demostración para desarrollo
class DemoEmailService implements EmailService {
  name = 'Demo';
  
  async send(to: string[], subject: string, content: string, htmlContent: string): Promise<void> {
    console.log('📧 DEMO EMAIL SERVICE');
    console.log('To:', to.join(', '));
    console.log('Subject:', subject);
    console.log('Content:', content.substring(0, 100) + '...');
    console.log('Recipients:', to.length);
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Instrucciones de configuración
export const EMAIL_SETUP_INSTRUCTIONS = `
🚀 CONFIGURACIÓN DE SERVICIOS DE EMAIL

Para habilitar el envío real de emails, elige uno de estos servicios:

1. 📧 SENDGRID (Recomendado para producción)
   - Crea una cuenta en https://sendgrid.com
   - Variables de entorno:
     SENDGRID_API_KEY=tu_api_key_aquí
     FROM_EMAIL=newsletter@tudominio.com
   - Comando: npm install @sendgrid/mail

2. 📮 MAILGUN
   - Crea una cuenta en https://mailgun.com
   - Variables de entorno:
     MAILGUN_API_KEY=tu_api_key_aquí
     MAILGUN_DOMAIN=tu_dominio.mailgun.org
     FROM_EMAIL=newsletter@tudominio.com
   - Comando: npm install mailgun-js

3. ⚡ RESEND (Moderno y fácil)
   - Crea una cuenta en https://resend.com
   - Variables de entorno:
     RESEND_API_KEY=tu_api_key_aquí
     FROM_EMAIL=newsletter@tudominio.com
   - Comando: npm install resend

4. 📬 SMTP (Gmail, Outlook, etc.)
   - Variables de entorno:
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=tu_email@gmail.com
     SMTP_PASSWORD=tu_contraseña_de_aplicación
     FROM_EMAIL=tu_email@gmail.com
   - Comando: npm install nodemailer

Después de configurar, descomenta el código correspondiente en /lib/email-services.ts
`;
