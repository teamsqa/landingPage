'use client';

import { useState } from 'react';
import { Card, Button, Input } from '@/app/ui';

export default function BasicTestingForms() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    country: '',
    newsletter: false,
    terms: false
  });
  
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const countries = ['España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newResult = `✅ Formulario enviado: ${formData.name} - ${formData.email} - ${new Date().toLocaleTimeString()}`;
    setResults(prev => [newResult, ...prev.slice(0, 4)]);
    setLoading(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      age: '',
      gender: '',
      country: '',
      newsletter: false,
      terms: false
    });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      age: '',
      gender: '',
      country: '',
      newsletter: false,
      terms: false
    });
    setResults([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Card */}
      <Card className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          ⭐ Formulario Básico
          <span className="text-sm font-normal bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
            Nivel Principiante
          </span>
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="basic-form">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ingresa tu nombre completo"
              required
              data-testid="name-input"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo Electrónico *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="ejemplo@correo.com"
              required
              data-testid="email-input"
            />
          </div>

          {/* Edad */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Edad
            </label>
            <Input
              id="age"
              name="age"
              type="number"
              min="18"
              max="100"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              placeholder="25"
              data-testid="age-input"
            />
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Género
            </label>
            <div className="space-y-2">
              {['masculino', 'femenino', 'otro', 'prefiero-no-decir'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="mr-2"
                    data-testid={`gender-${option}`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {option.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* País */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              País
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              data-testid="country-select"
            >
              <option value="">Selecciona tu país</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={(e) => setFormData(prev => ({ ...prev, newsletter: e.target.checked }))}
                className="mr-2"
                data-testid="newsletter-checkbox"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Quiero recibir el newsletter
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
                className="mr-2"
                required
                data-testid="terms-checkbox"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Acepto los términos y condiciones *
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              data-testid="submit-button"
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
            
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              data-testid="reset-button"
            >
              Limpiar
            </Button>
          </div>
        </form>
      </Card>

      {/* Instructions and Results Card */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📋 Instrucciones de Prueba
        </h3>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Elementos a probar:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Input de texto (nombre)</li>
            <li>• Input de email con validación</li>
            <li>• Input numérico con min/max</li>
            <li>• Radio buttons</li>
            <li>• Select dropdown</li>
            <li>• Checkboxes (opcional y requerido)</li>
            <li>• Validaciones de formulario</li>
            <li>• Estados de carga</li>
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Selectores sugeridos:</h4>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono">
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <div>data-testid="basic-form"</div>
              <div>data-testid="name-input"</div>
              <div>data-testid="email-input"</div>
              <div>data-testid="submit-button"</div>
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📄 Últimos envíos:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="text-xs bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-2 rounded"
                  data-testid={`result-${index}`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
