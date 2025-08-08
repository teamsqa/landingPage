'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/app/ui';

export default function IntermediateTestingForms() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    preferences: {
      technologies: [] as string[],
      experience: '',
      availability: '',
      startDate: ''
    },
    additional: {
      portfolio: '',
      linkedin: '',
      github: '',
      comments: ''
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<string[]>(['']);
  const [showConditional, setShowConditional] = useState(false);

  const technologies = ['JavaScript', 'Java', 'Python', 'C#', 'TypeScript', 'Go', 'Ruby', 'PHP'];
  const totalSteps = 3;

  useEffect(() => {
    // Mostrar campos condicionales si selecciona más de 2 años de experiencia
    setShowConditional(['3-5', '5+'].includes(formData.preferences.experience));
  }, [formData.preferences.experience]);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.personalInfo.firstName) newErrors.firstName = 'Nombre es requerido';
      if (!formData.personalInfo.lastName) newErrors.lastName = 'Apellido es requerido';
      if (!formData.personalInfo.email) newErrors.email = 'Email es requerido';
      if (!formData.personalInfo.phone) newErrors.phone = 'Teléfono es requerido';
    } else if (step === 2) {
      if (formData.preferences.technologies.length === 0) {
        newErrors.technologies = 'Selecciona al menos una tecnología';
      }
      if (!formData.preferences.experience) newErrors.experience = 'Experiencia es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
    setErrors({});
  };

  const addDynamicField = () => {
    setDynamicFields(prev => [...prev, '']);
  };

  const removeDynamicField = (index: number) => {
    setDynamicFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateDynamicField = (index: number, value: string) => {
    setDynamicFields(prev => prev.map((field, i) => i === index ? value : field));
  };

  const handleTechnologyToggle = (tech: string) => {
    const current = formData.preferences.technologies;
    const updated = current.includes(tech)
      ? current.filter(t => t !== tech)
      : [...current, tech];
    
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, technologies: updated }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular respuesta
    alert('✅ Formulario intermedio enviado correctamente!\n\nDatos enviados:\n' + 
      JSON.stringify(formData, null, 2));
    setLoading(false);
    
    // Reset
    setCurrentStep(1);
    setFormData({
      personalInfo: { firstName: '', lastName: '', email: '', phone: '' },
      preferences: { technologies: [], experience: '', availability: '', startDate: '' },
      additional: { portfolio: '', linkedin: '', github: '', comments: '' }
    });
    setDynamicFields(['']);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4" data-testid="step-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Información Personal
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre *
                </label>
                <Input
                  value={formData.personalInfo.firstName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                  }))}
                  placeholder="Juan"
                  data-testid="first-name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1" data-testid="first-name-error">
                    {errors.firstName}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Apellido *
                </label>
                <Input
                  value={formData.personalInfo.lastName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                  }))}
                  placeholder="Pérez"
                  data-testid="last-name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1" data-testid="last-name-error">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value }
                }))}
                placeholder="juan@ejemplo.com"
                data-testid="email-step1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1" data-testid="email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono *
              </label>
              <Input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: e.target.value }
                }))}
                placeholder="+34 123 456 789"
                data-testid="phone"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1" data-testid="phone-error">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4" data-testid="step-2">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preferencias Técnicas
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tecnologías de Interés *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {technologies.map((tech) => (
                  <label
                    key={tech}
                    className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                      formData.preferences.technologies.includes(tech)
                        ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    data-testid={`tech-${tech.toLowerCase()}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.technologies.includes(tech)}
                      onChange={() => handleTechnologyToggle(tech)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{tech}</span>
                  </label>
                ))}
              </div>
              {errors.technologies && (
                <p className="text-red-500 text-sm mt-1" data-testid="technologies-error">
                  {errors.technologies}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experiencia en Automatización *
              </label>
              <select
                value={formData.preferences.experience}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, experience: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                data-testid="experience-select"
              >
                <option value="">Selecciona tu nivel</option>
                <option value="0-1">0-1 años</option>
                <option value="1-3">1-3 años</option>
                <option value="3-5">3-5 años</option>
                <option value="5+">5+ años</option>
              </select>
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1" data-testid="experience-error">
                  {errors.experience}
                </p>
              )}
            </div>

            {/* Campos condicionales */}
            {showConditional && (
              <div className="border-t pt-4" data-testid="conditional-section">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                  Información Adicional para Expertos
                </h5>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Inicio Disponible
                  </label>
                  <Input
                    type="date"
                    value={formData.preferences.startDate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, startDate: e.target.value }
                    }))}
                    data-testid="start-date"
                  />
                </div>
              </div>
            )}

            {/* Campos dinámicos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Habilidades Adicionales (Dinámico)
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addDynamicField}
                  className="text-xs py-1 px-2"
                  data-testid="add-skill-button"
                >
                  + Agregar
                </Button>
              </div>
              {dynamicFields.map((field, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={field}
                    onChange={(e) => updateDynamicField(index, e.target.value)}
                    placeholder={`Habilidad ${index + 1}`}
                    data-testid={`skill-${index}`}
                  />
                  {dynamicFields.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeDynamicField(index)}
                      className="px-3"
                      data-testid={`remove-skill-${index}`}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4" data-testid="step-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Información Adicional
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Portfolio URL
              </label>
              <Input
                type="url"
                value={formData.additional.portfolio}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  additional: { ...prev.additional, portfolio: e.target.value }
                }))}
                placeholder="https://mi-portfolio.com"
                data-testid="portfolio-url"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <Input
                  type="url"
                  value={formData.additional.linkedin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    additional: { ...prev.additional, linkedin: e.target.value }
                  }))}
                  placeholder="https://linkedin.com/in/usuario"
                  data-testid="linkedin-url"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub
                </label>
                <Input
                  type="url"
                  value={formData.additional.github}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    additional: { ...prev.additional, github: e.target.value }
                  }))}
                  placeholder="https://github.com/usuario"
                  data-testid="github-url"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comentarios Adicionales
              </label>
              <textarea
                value={formData.additional.comments}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  additional: { ...prev.additional, comments: e.target.value }
                }))}
                placeholder="Cuéntanos más sobre ti y tus objetivos..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                data-testid="comments"
              />
            </div>

            {/* Resumen */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md" data-testid="form-summary">
              <h5 className="font-medium mb-2">Resumen de tus datos:</h5>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Nombre: {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
                <p>Email: {formData.personalInfo.email}</p>
                <p>Tecnologías: {formData.preferences.technologies.join(', ')}</p>
                <p>Experiencia: {formData.preferences.experience}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Card */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                ⭐⭐ Formulario Intermedio
                <span className="text-sm font-normal bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                  Nivel Intermedio
                </span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Paso {currentStep} de {totalSteps}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-lime-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                    data-testid={`step-indicator-${step}`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-1 w-full mx-2 ${
                        step < currentStep ? 'bg-lime-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} data-testid="intermediate-form">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={prevStep}
                disabled={currentStep === 1}
                data-testid="prev-button"
              >
                ← Anterior
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  data-testid="next-button"
                >
                  Siguiente →
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="submit-intermediate"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Formulario'
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      {/* Instructions Card */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📋 Características Intermedias
        </h3>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Elementos complejos:</h4>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Formulario multi-paso</li>
              <li>• Validaciones dinámicas</li>
              <li>• Campos condicionales</li>
              <li>• Elementos dinámicos</li>
              <li>• Estados de progreso</li>
              <li>• Checkboxes múltiples</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Desafíos de Testing:</h4>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Navegación entre pasos</li>
              <li>• Validación por pasos</li>
              <li>• Estados condicionales</li>
              <li>• Elementos que aparecen/desaparecen</li>
              <li>• Manejo de arrays dinámicos</li>
            </ul>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono">
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <div>data-testid="step-1"</div>
              <div>data-testid="next-button"</div>
              <div>data-testid="conditional-section"</div>
              <div>data-testid="add-skill-button"</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
