import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';
import { createEmailService } from '@/app/lib/email-services';

// POST - Enviar email de invitación simple (sin Firebase link)
export async function POST(request: Request) {
  try {
    const { email, displayName, role } = await request.json();

    if (!email || !displayName || !role) {
      return NextResponse.json(
        { success: false, message: 'Email, nombre y rol son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe en Firebase Auth
    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      console.log('Usuario encontrado:', userRecord.uid);

      // Generar link personalizado simple para testing
      const invitationLink = `http://localhost:3000/admin/complete-invitation?email=${encodeURIComponent(email)}&role=${role}&name=${encodeURIComponent(displayName)}&test=true`;

      // Template de email simple
      const emailTemplate = `
        <h2>Invitación a TeamsQA</h2>
        <p>Hola ${displayName},</p>
        <p>Has sido invitado a formar parte del equipo de TeamsQA con el rol de <strong>${role}</strong>.</p>
        <p><a href="${invitationLink}" style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Completar Registro</a></p>
        <p>Este es un email de prueba del sistema de invitaciones.</p>
      `;

      // Enviar email
      try {
        const emailService = createEmailService();
        await emailService.send([email], 'Invitación de prueba - TeamsQA', '', emailTemplate);
        
        console.log('✅ Email de prueba enviado a:', email);

        return NextResponse.json({
          success: true,
          message: 'Email de invitación enviado exitosamente',
          data: {
            email,
            invitationLink,
            emailSent: true,
            testMode: true
          }
        });

      } catch (emailError) {
        console.error('Error enviando email:', emailError);
        return NextResponse.json({
          success: true,
          message: 'Link generado pero email no enviado',
          data: {
            email,
            invitationLink,
            emailSent: false,
            testMode: true,
            emailError: String(emailError)
          }
        });
      }

    } catch (firebaseError: any) {
      if (firebaseError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { success: false, message: 'Usuario no encontrado' },
          { status: 404 }
        );
      }
      throw firebaseError;
    }

  } catch (error) {
    console.error('Error en test de invitación:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
