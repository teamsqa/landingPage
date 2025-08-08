'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/app/admin/components/AdminLayout';
import { Button, Card } from '@/app/ui';
import { showToast } from '@/app/components/Toast';

type Subscriber = {
  id: string;
  email: string;
  subscribedAt: any;
  status: 'active' | 'unsubscribed';
};

type EmailCampaign = {
  subject: string;
  content: string;
  template: 'welcome' | 'announcement' | 'custom';
};

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [campaign, setCampaign] = useState<EmailCampaign>({
    subject: '',
    content: '',
    template: 'announcement'
  });
  const [activeTab, setActiveTab] = useState<'subscribers' | 'compose'>('subscribers');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar suscriptores');
      }

      setSubscribers(data.subscribers);
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Error al cargar suscriptores');
    } finally {
      setLoading(false);
    }
  };

  const sendMassEmail = async () => {
    if (!campaign.subject.trim() || !campaign.content.trim()) {
      showToast.error('Por favor completa el asunto y contenido del email');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar emails');
      }

      showToast.success(`Emails enviados exitosamente a ${data.sent} suscriptores`);
      setCampaign({ subject: '', content: '', template: 'announcement' });
      
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Error al enviar emails');
    } finally {
      setSending(false);
    }
  };

  const getTemplate = (type: string) => {
    const templates = {
      welcome: {
        subject: '¡Bienvenido a TeamsQA Newsletter!',
        content: `¡Hola!

Gracias por suscribirte a nuestro newsletter de TeamsQA. 

Te mantendremos al día con:
• Tutoriales de automatización de pruebas
• Noticias de la industria
• Tips y mejores prácticas
• Contenido exclusivo

¡Esperamos que disfrutes nuestro contenido!

Saludos,
El equipo de TeamsQA`
      },
      announcement: {
        subject: 'Novedades desde TeamsQA',
        content: `Hola,

Tenemos novedades emocionantes para compartir contigo...

[Escribe tu contenido aquí]

Saludos,
El equipo de TeamsQA`
      }
    };
    return templates[type as keyof typeof templates] || { subject: '', content: '' };
  };

  const loadTemplate = (templateType: EmailCampaign['template']) => {
    const template = getTemplate(templateType);
    setCampaign({
      ...campaign,
      template: templateType,
      subject: template.subject,
      content: template.content
    });
  };

  const exportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Fecha de Suscripción,Estado\n"
      + subscribers.map(sub => 
          `${sub.email},${new Date(sub.subscribedAt?.seconds * 1000).toLocaleDateString()},${sub.status}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "suscriptores_newsletter.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-300">Cargando newsletter...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📧</span>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
              Gestión de Newsletter
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Administra suscriptores y envía correos masivos
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscribers'
                  ? 'border-gray-500 text-gray-800 dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Suscriptores ({subscribers.filter(s => s.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'compose'
                  ? 'border-gray-500 text-gray-800 dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Enviar Email
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2V4a2 2 0 012-2h4a2 2 0 012 2v4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Suscriptores</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{subscribers.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Activos</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {subscribers.filter(s => s.status === 'active').length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Desuscritos</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {subscribers.filter(s => s.status === 'unsubscribed').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <Card className="p-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Lista de Suscriptores</h3>
              <div className="flex gap-3">
                <Button onClick={exportSubscribers} variant="secondary" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar CSV
                </Button>
                <Button onClick={fetchSubscribers} variant="primary" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar
                </Button>
              </div>
            </div>
          </Card>

          {/* Subscribers Table */}
          <Card className="bg-gray-50 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fecha de Suscripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {subscriber.subscribedAt?.seconds 
                          ? new Date(subscriber.subscribedAt.seconds * 1000).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscriber.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.status === 'active' ? 'Activo' : 'Desuscrito'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'compose' && (
        <div className="space-y-6">
          {/* Template Selection */}
          <Card className="p-6 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Templates Predefinidos</h3>
            <div className="flex gap-3">
              <Button onClick={() => loadTemplate('welcome')} variant="secondary" size="sm">
                Template de Bienvenida
              </Button>
              <Button onClick={() => loadTemplate('announcement')} variant="secondary" size="sm">
                Template de Anuncio
              </Button>
            </div>
          </Card>

          {/* Email Composer */}
          <Card className="p-6 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Componer Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Escribe el asunto del email..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenido
                </label>
                <textarea
                  value={campaign.content}
                  onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Escribe el contenido del email..."
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Se enviará a {subscribers.filter(s => s.status === 'active').length} suscriptores activos
                </p>
                <Button 
                  onClick={sendMassEmail} 
                  disabled={sending || !campaign.subject.trim() || !campaign.content.trim()}
                  variant="primary"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar Email Masivo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
