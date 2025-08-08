'use client';

import { useState } from 'react';
import AdminLayout from '@/app/admin/components/AdminLayout';
import { Card } from '@/app/ui';

export default function EmailSetupPage() {
  const [activeService, setActiveService] = useState<'sendgrid' | 'mailgun' | 'resend' | 'smtp'>('sendgrid');

  const services = {
    sendgrid: {
      name: 'SendGrid',
      icon: '📧',
      description: 'Servicio confiable para producción con buenas métricas',
      envVars: [
        'SENDGRID_API_KEY=sg.tu_api_key_aquí',
        'FROM_EMAIL=newsletter@tudominio.com'
      ],
      npmInstall: 'npm install @sendgrid/mail',
      steps: [
        'Crea una cuenta gratuita en sendgrid.com',
        'Verifica tu dominio de envío',
        'Crea una API Key en Settings > API Keys',
        'Configura las variables de entorno',
        'Ejecuta el comando npm install'
      ]
    },
    mailgun: {
      name: 'Mailgun',
      icon: '📮',
      description: 'Servicio robusto con buena API y herramientas',
      envVars: [
        'MAILGUN_API_KEY=tu_api_key_aquí',
        'MAILGUN_DOMAIN=tu_dominio.mailgun.org',
        'FROM_EMAIL=newsletter@tudominio.com'
      ],
      npmInstall: 'npm install mailgun-js',
      steps: [
        'Crea una cuenta en mailgun.com',
        'Configura tu dominio',
        'Obtén tu API Key del dashboard',
        'Configura las variables de entorno',
        'Ejecuta el comando npm install'
      ]
    },
    resend: {
      name: 'Resend',
      icon: '⚡',
      description: 'Servicio moderno y fácil de usar, ideal para startups',
      envVars: [
        'RESEND_API_KEY=re_tu_api_key_aquí',
        'FROM_EMAIL=newsletter@tudominio.com'
      ],
      npmInstall: 'npm install resend',
      steps: [
        'Crea una cuenta en resend.com',
        'Verifica tu dominio',
        'Crea una API Key',
        'Configura las variables de entorno',
        'Ejecuta el comando npm install'
      ]
    },
    smtp: {
      name: 'SMTP',
      icon: '📬',
      description: 'Usa Gmail, Outlook o cualquier servidor SMTP',
      envVars: [
        'SMTP_HOST=smtp.gmail.com',
        'SMTP_PORT=587',
        'SMTP_USER=tu_email@gmail.com',
        'SMTP_PASSWORD=tu_contraseña_de_aplicación',
        'FROM_EMAIL=tu_email@gmail.com'
      ],
      npmInstall: 'npm install nodemailer',
      steps: [
        'Habilita autenticación de 2 factores en Gmail',
        'Genera una contraseña de aplicación',
        'Configura las variables de entorno',
        'Ejecuta el comando npm install',
        'Para otros proveedores, ajusta SMTP_HOST y SMTP_PORT'
      ]
    }
  };

  const currentService = services[activeService];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
              Configuración de Email
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Configura un servicio de email para envío masivo
            </p>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-6">
        <div className="flex items-start">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <span className="text-white">⚠️</span>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Configuración Requerida
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Actualmente estás usando el servicio de demostración. Los emails no se envían realmente. 
              Para habilitar el envío real, configura uno de los servicios de email disponibles.
            </p>
            <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-lg">
              <p className="text-sm font-mono text-yellow-800 dark:text-yellow-200">
                📊 Suscriptores capturados: ✅<br/>
                📧 Envío de emails: ⚠️ En modo demo
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Service Selection */}
      <Card className="p-6 bg-gray-50 dark:bg-gray-800 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Selecciona un Servicio de Email
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(services).map(([key, service]) => (
            <button
              key={key}
              onClick={() => setActiveService(key as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeService === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className="font-semibold text-gray-800 dark:text-white">{service.name}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Configuration Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instructions */}
        <Card className="p-6 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            {currentService.icon} {currentService.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {currentService.description}
          </p>
          
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
            Pasos de configuración:
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            {currentService.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>

          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
              Comando de instalación:
            </h4>
            <code className="text-sm bg-gray-800 text-green-400 px-2 py-1 rounded">
              {currentService.npmInstall}
            </code>
          </div>
        </Card>

        {/* Environment Variables */}
        <Card className="p-6 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Variables de Entorno
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Agrega estas variables a tu archivo <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.local</code>:
          </p>
          
          <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
            {currentService.envVars.map((envVar, index) => (
              <div key={index} className="mb-1">
                {envVar}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 Consejo:</strong> Después de configurar las variables de entorno, 
              reinicia el servidor de desarrollo con <code>npm run dev</code>
            </p>
          </div>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="p-6 bg-gray-50 dark:bg-gray-800 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          🚀 Próximos pasos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="text-2xl mb-2">1️⃣</div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Configura el Servicio</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sigue las instrucciones para tu servicio elegido
            </p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">2️⃣</div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Prueba el Envío</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ve a Newsletter → Enviar Email para probar
            </p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">3️⃣</div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">¡Listo!</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ya puedes enviar newsletters a tus suscriptores
            </p>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
}
