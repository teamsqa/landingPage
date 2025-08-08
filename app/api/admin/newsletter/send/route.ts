import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { createEmailService, EMAIL_SETUP_INSTRUCTIONS } from '@/app/lib/email-services';

export async function POST(request: NextRequest) {
  try {
    const { subject, content, template } = await request.json();

    if (!subject?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Asunto y contenido son requeridos' }, { status: 400 });
    }

    // Obtener suscriptores activos
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef);
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: 'No hay suscriptores' }, { status: 400 });
    }

    // Filtrar solo suscriptores activos (por defecto todos son activos)
    const subscribers = snapshot.docs
      .map(doc => ({
        id: doc.id,
        email: doc.data().email,
        status: doc.data().status || 'active'
      }))
      .filter(sub => sub.status !== 'unsubscribed');

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No hay suscriptores activos' }, { status: 400 });
    }

    // Crear HTML del email
    const htmlContent = createEmailHTML(subject, content);

    try {
      // Intentar enviar con el servicio configurado
      const emailService = createEmailService();
      const emails = subscribers.map(sub => sub.email);
      
      if (emailService.name === 'Demo') {
        console.log('🔧 Usando servicio de demostración para desarrollo');
      }
      
      await emailService.send(emails, subject, content, htmlContent);

      // Guardar registro de la campaña
      await addDoc(collection(db, 'email_campaigns'), {
        subject,
        content,
        template,
        sentAt: new Date(),
        totalSubscribers: subscribers.length,
        sentCount: subscribers.length,
        failedCount: 0,
        service: emailService.name,
        status: 'sent'
      });

      return NextResponse.json({ 
        success: true, 
        sent: subscribers.length, 
        failed: 0,
        total: subscribers.length,
        service: emailService.name,
        message: emailService.name === 'Demo' 
          ? `Campaña de DEMOSTRACIÓN creada para ${subscribers.length} suscriptores. ${EMAIL_SETUP_INSTRUCTIONS}`
          : `Email enviado exitosamente a ${subscribers.length} suscriptores usando ${emailService.name}`
      });

    } catch (emailError) {
      console.error('Error enviando emails:', emailError);
      
      // Guardar campaña como fallida
      await addDoc(collection(db, 'email_campaigns'), {
        subject,
        content,
        template,
        createdAt: new Date(),
        totalSubscribers: subscribers.length,
        sentCount: 0,
        failedCount: subscribers.length,
        error: emailError instanceof Error ? emailError.message : 'Error desconocido',
        status: 'failed'
      });

      return NextResponse.json({ 
        error: `Error enviando emails: ${emailError instanceof Error ? emailError.message : 'Error desconocido'}`,
        setupInstructions: EMAIL_SETUP_INSTRUCTIONS
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para crear HTML del email
function createEmailHTML(subject: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            color: white;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .content p {
            margin: 15px 0;
            color: #333;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
        }
        .unsubscribe {
            margin-top: 20px;
        }
        .unsubscribe a {
            color: #999;
            text-decoration: none;
            font-size: 12px;
        }
        .logo {
            width: 50px;
            height: 50px;
            margin: 0 auto 10px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚀</div>
            <h1>TeamsQA</h1>
        </div>
        <div class="content">
            ${content.split('\n').map(paragraph => 
              paragraph.trim() ? `<p>${paragraph.replace(/\n/g, '<br>')}</p>` : '<br>'
            ).join('')}
        </div>
        <div class="footer">
            <p><strong>TeamsQA</strong> - Automatización de Pruebas</p>
            <p>Recibiste este email porque te suscribiste a nuestro newsletter.</p>
            <div class="unsubscribe">
                <a href="#">Cancelar suscripción</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}
