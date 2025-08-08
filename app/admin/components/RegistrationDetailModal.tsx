'use client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input } from '@/app/ui';

type Registration = {
  _id: string;
  name: string;
  email: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  phone?: string;
  country?: string;
  department?: string;
  municipality?: string;
  city?: string;
  education?: string;
  institution?: string;
  programming_experience?: string;
  company?: string;
  position?: string;
  motivation?: string;
  tools?: string[];
};

type Props = {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, message: string) => void;
  onReject: (id: string, message: string) => void;
};

export default function RegistrationDetailModal({ registration, isOpen, onClose, onApprove, onReject }: Props) {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mensajes predeterminados
  const defaultApprovalMessage = `¡Hola ${registration?.name || '[Nombre]'}!

¡Estamos encantados de tenerte con nosotros! 🎉

Nos complace informarte que tu inscripción para el curso "${registration?.course || '[Curso]'}" ha sido APROBADA.

Estamos emocionados de acompañarte en este viaje de aprendizaje y crecimiento profesional. Nuestro equipo de expertos está preparado para brindarte la mejor experiencia educativa y ayudarte a alcanzar tus objetivos en automatización de pruebas.

Nos gustaría que te formes con nosotros y formes parte de nuestra comunidad de profesionales en testing. Creemos firmemente en tu potencial y estamos seguros de que aprovecharás al máximo esta oportunidad.

📋 Próximos pasos:
• Recibirás un correo con los detalles del curso y cronograma
• Te enviaremos el enlace de acceso a nuestra plataforma de aprendizaje
• Te asignaremos a tu mentor personal
• Tendrás acceso a nuestro grupo exclusivo de estudiantes

¡Bienvenido/a a la familia TeamsQA! Estamos aquí para apoyarte en cada paso del camino.

¡Nos vemos pronto!

Equipo TeamsQA 🚀`;

  const defaultRejectionMessage = `Hola ${registration?.name || '[Nombre]'},

Gracias por tu interés en nuestro curso "${registration?.course || '[Curso]'}".

Después de revisar cuidadosamente tu aplicación, en esta ocasión no podemos continuar con tu inscripción debido a:

[Especifica la razón del rechazo]

Te animamos a seguir desarrollando tus habilidades y consideramos que podrías ser un excelente candidato en el futuro. No dudes en aplicar nuevamente cuando sientas que cumples con todos los requisitos.

¡Mucho éxito en tu camino profesional!

Equipo TeamsQA`;

  // Actualizar mensaje cuando se abre el modal
  useEffect(() => {
    if (isOpen && registration) {
      setMessage(defaultApprovalMessage);
    }
  }, [isOpen, registration, defaultApprovalMessage]);

  if (!isOpen || !registration) return null;

  const handleApprove = async () => {
    if (!message.trim()) {
      alert('Por favor, ingresa un mensaje para el candidato');
      return;
    }
    
    setIsProcessing(true);
    try {
      await onApprove(registration._id, message);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error al aprobar:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!message.trim()) {
      alert('Por favor, ingresa un mensaje explicando el motivo del rechazo');
      return;
    }
    
    setIsProcessing(true);
    try {
      await onReject(registration._id, message);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error al rechazar:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadApprovalTemplate = () => {
    setMessage(defaultApprovalMessage);
  };

  const loadRejectionTemplate = () => {
    setMessage(defaultRejectionMessage);
  };

  const clearMessage = () => {
    setMessage('');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rechazado</Badge>;
      default:
        return <Badge variant="warning">Pendiente</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card variant="elevated" className="border-0 shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalle de Inscripción
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Revisa la información del candidato y toma una decisión
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(registration.status)}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  disabled={isProcessing}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información Personal
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre Completo
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-900 dark:text-white">{registration.name}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-900 dark:text-white">{registration.email}</p>
                    </div>
                  </div>

                  {registration.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Teléfono
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{registration.phone}</p>
                      </div>
                    </div>
                  )}

                  {registration.country && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        País
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{registration.country}</p>
                      </div>
                    </div>
                  )}

                  {(registration.department || registration.municipality || registration.city) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ubicación
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">
                          {[registration.city, registration.municipality, registration.department].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {registration.company && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Empresa
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{registration.company}</p>
                      </div>
                    </div>
                  )}

                  {registration.position && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cargo Actual
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{registration.position}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Curso */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información del Curso
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Curso Seleccionado
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-900 dark:text-white font-medium">{registration.course}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fecha de Inscripción
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-900 dark:text-white">{formatDate(registration.createdAt)}</p>
                    </div>
                  </div>

                  {registration.education && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nivel de Educación
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{registration.education}</p>
                      </div>
                    </div>
                  )}

                  {registration.institution && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Institución Educativa
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{registration.institution}</p>
                      </div>
                    </div>
                  )}

                  {registration.programming_experience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Experiencia en Programación
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{registration.programming_experience}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Motivación */}
            {registration.motivation && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Motivación del Candidato
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{registration.motivation}</p>
                </div>
              </div>
            )}

            {/* Herramientas */}
            {registration.tools && registration.tools.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Herramientas Conocidas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {registration.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mensaje de Respuesta */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Mensaje de Respuesta
              </h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={loadApprovalTemplate}
                    disabled={isProcessing}
                    className="text-xs"
                  >
                    📝 Plantilla Aprobación
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={loadRejectionTemplate}
                    disabled={isProcessing}
                    className="text-xs"
                  >
                    📝 Plantilla Rechazo
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={clearMessage}
                    disabled={isProcessing}
                    className="text-xs"
                  >
                    🗑️ Limpiar
                  </Button>
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Escribe un mensaje personalizado que se enviará al candidato por correo electrónico
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors"
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Este mensaje se incluirá en el correo de notificación junto con la decisión tomada.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          {registration.status === 'pending' && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="order-last sm:order-first"
                >
                  Cancelar
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    disabled={isProcessing || !message.trim()}
                    className="flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Rechazar y Enviar Email
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleApprove}
                    disabled={isProcessing || !message.trim()}
                    className="flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    Aprobar y Enviar Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
