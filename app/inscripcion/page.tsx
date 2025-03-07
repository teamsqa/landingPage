'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input, Select, Button, Card, Loading } from '@/app/ui';
import { z } from 'zod';

// Validation schemas
const personalInfoSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  country: z.string().min(1, 'País requerido'),
  department: z.string().optional(),
  municipality: z.string().optional(),
  city: z.string().optional(),
});

const educationSchema = z.object({
  education: z.string().min(1, 'Nivel de educación requerido'),
  institution: z.string().min(1, 'Institución requerida'),
  programming_experience: z.string().min(1, 'Experiencia requerida'),
  company: z.string().optional(),
  position: z.string().optional(),
});

const courseSchema = z.object({
  course: z.string().min(1, 'Curso requerido'),
  motivation: z.string().min(20, 'Por favor describe tu motivación (mínimo 20 caracteres)'),
  tools: z.array(z.string()).optional(),
});

// Options for selects
const courseOptions = [
  { value: '', label: 'Selecciona un curso' },
  { value: 'automatizacion-basico', label: 'Fundamentos de Automatización' },
  { value: 'serenity-java', label: 'SerenityBDD y Java Intermedio' },
  { value: 'automatizacion-profesional', label: 'Automatización Profesional' }
];

const educationLevelOptions = [
  { value: '', label: 'Selecciona tu nivel de educación' },
  { value: 'bachiller', label: 'Bachiller' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'tecnologo', label: 'Tecnólogo' },
  { value: 'pregrado', label: 'Pregrado' },
  { value: 'postgrado', label: 'Postgrado' }
];

const programmingExperienceOptions = [
  { value: '', label: 'Selecciona tu nivel de experiencia' },
  { value: 'ninguna', label: 'Ninguna experiencia' },
  { value: 'basica', label: 'Experiencia básica' },
  { value: 'intermedia', label: 'Experiencia intermedia' },
  { value: 'avanzada', label: 'Experiencia avanzada' }
];

const countryOptions = [
  { value: '', label: 'Selecciona tu país' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'chile', label: 'Chile' },
  { value: 'mexico', label: 'México' },
  { value: 'peru', label: 'Perú' },
  { value: 'espana', label: 'España' },
  { value: 'otro', label: 'Otro' }
];

const tools = [
  'Git',
  'Java',
  'Selenium',
  'Cucumber',
  'Jenkins',
  'Postman',
  'JUnit',
  'TestNG',
  'Maven',
  'Gradle'
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  country: string;
  department?: string;
  municipality?: string;
  city?: string;
  education: string;
  institution: string;
  programming_experience: string;
  company: string;
  position: string;
  course: string;
  motivation: string;
  tools: string[];
};

type FormErrors = {
  [K in keyof FormData]?: string;
} & {
  submit?: string;
};

export default function Inscripcion() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    department: '',
    municipality: '',
    city: '',
    education: '',
    institution: '',
    programming_experience: '',
    company: '',
    position: '',
    course: '',
    motivation: '',
    tools: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleToolChange = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool]
    }));
  };

  const validateStep = (step: number): boolean => {
    try {
      switch (step) {
        case 1:
          personalInfoSchema.parse(formData);
          break;
        case 2:
          educationSchema.parse(formData);
          break;
        case 3:
          courseSchema.parse(formData);
          break;
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/inscripcion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el formulario');
      }

      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        department: '',
        municipality: '',
        city: '',
        education: '',
        institution: '',
        programming_experience: '',
        company: '',
        position: '',
        course: '',
        motivation: '',
        tools: [],
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error:', error);
      setErrors({
        ...errors,
        submit: error instanceof Error ? error.message : 'Error al enviar el formulario'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            step === currentStep ? 'bg-lime-500 text-white scale-110' : 
            step < currentStep ? 'bg-lime-200 text-lime-700' : 
            'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step
            )}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 transition-all duration-300 ${
              step < currentStep ? 'bg-lime-200' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Información Personal</h2>
      <Input
        label="Nombre completo"
        name="name"
        type="text"
        required
        placeholder="Ej: Juan Pérez"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        autoComplete="name"
      />
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          required
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          required
          placeholder="+57 300 123 4567"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>
      <div className="space-y-6">
        <Select
          label="País de residencia"
          name="country"
          options={countryOptions}
          required
          value={formData.country}
          onChange={handleInputChange}
          error={errors.country}
        />
        
        {formData.country !== 'colombia' && (
          <Input
            label="Ciudad"
            name="city"
            type="text"
            required
            placeholder="Ej: Madrid"
            value={formData.city}
            onChange={handleInputChange}
            error={errors.city}
            autoComplete="address-level2"
          />
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Formación y Experiencia</h2>
      <Select
        label="Nivel de educación"
        name="education"
        options={educationLevelOptions}
        required
        value={formData.education}
        onChange={handleInputChange}
        error={errors.education}
      />
      <Input
        label="Institución educativa"
        name="institution"
        type="text"
        placeholder="Ej: Universidad Nacional"
        value={formData.institution}
        onChange={handleInputChange}
        error={errors.institution}
        autoComplete="organization"
      />
      <Select
        label="Experiencia en programación"
        name="programming_experience"
        options={programmingExperienceOptions}
        required
        value={formData.programming_experience}
        onChange={handleInputChange}
        error={errors.programming_experience}
      />
      <Input
        label="Empresa actual (opcional)"
        name="company"
        type="text"
        placeholder="Ej: Tech Solutions S.A."
        value={formData.company}
        onChange={handleInputChange}
        error={errors.company}
        autoComplete="organization"
      />
      <Input
        label="Cargo actual (opcional)"
        name="position"
        type="text"
        placeholder="Ej: QA Manual"
        value={formData.position}
        onChange={handleInputChange}
        error={errors.position}
        autoComplete="organization-title"
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Selección del Curso</h2>
      <Select
        label="Curso de interés"
        name="course"
        options={courseOptions}
        required
        value={formData.course}
        onChange={handleInputChange}
        error={errors.course}
      />
      <div className="space-y-2">
        <Input
          label="¿Por qué te interesa este curso?"
          name="motivation"
          as="textarea"
          rows={4}
          placeholder="Cuéntanos por qué te interesa tomar este curso y qué esperas aprender..."
          required
          value={formData.motivation}
          onChange={handleInputChange}
          error={errors.motivation}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mínimo 20 caracteres. {formData.motivation.length}/20
        </p>
      </div>
      <div className="space-y-4">
        <p className="font-medium text-gray-700 dark:text-gray-200">¿Qué herramientas conoces?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <label key={tool} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.tools.includes(tool)}
                onChange={() => handleToolChange(tool)}
                className="rounded text-lime-500 focus:ring-lime-500 dark:bg-gray-700"
              />
              <span className="group-hover:text-lime-600 dark:text-gray-200 transition-colors">
                {tool}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  if (submitSuccess) {
    return (
      <main className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-3xl">
          <Card variant="elevated" className="p-8 text-center">
            <div className="mb-6 text-lime-500 dark:text-lime-400">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              ¡Inscripción Exitosa!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Gracias por inscribirte. Pronto nos pondremos en contacto contigo para los siguientes pasos.
            </p>
            <Link href="/">
              <Button variant="primary">
                Volver al Inicio
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al inicio
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-lime-600 to-lime-400 bg-clip-text text-transparent">
          Inscríbete Ahora
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
          Completa el formulario para comenzar tu camino en la automatización de pruebas
        </p>
        
        {renderStepIndicator()}

        <Card variant="elevated" className="transition-all duration-300 hover:shadow-lg">
          <form onSubmit={handleSubmit} className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {errors.submit && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {errors.submit}
              </div>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Anterior
                </Button>
              )}
              <div className="ml-auto">
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    className="flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    Siguiente
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loading size="sm" className="mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar solicitud
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}