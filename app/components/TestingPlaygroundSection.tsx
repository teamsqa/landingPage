'use client';

import { useState } from 'react';
import { Card, Button } from '@/app/ui';
import BasicTestingForms from './testing-playground/BasicTestingForms';
import IntermediateTestingForms from './testing-playground/IntermediateTestingForms';
import AdvancedTestingForms from './testing-playground/AdvancedTestingForms';
import AlertsTestingSection from './testing-playground/AlertsTestingSection';
import WindowTabsSection from './testing-playground/WindowTabsSection';
import IframeTestingSection from './testing-playground/IframeTestingSection';
import ShadowDOMSection from './testing-playground/ShadowDOMSection';
import ECommerceSection from './testing-playground/ECommerceSection';

type TestingCategory = 'forms' | 'alerts' | 'windows' | 'iframe' | 'shadow' | 'ecommerce';
type FormComplexity = 'basic' | 'intermediate' | 'advanced';

export default function TestingPlaygroundSection() {
  const [activeCategory, setActiveCategory] = useState<TestingCategory>('forms');
  const [activeFormComplexity, setActiveFormComplexity] = useState<FormComplexity>('basic');

  const categories = [
    { id: 'forms' as TestingCategory, name: 'Formularios', icon: '📝', description: 'Pruebas de formularios de diferentes complejidades' },
    { id: 'alerts' as TestingCategory, name: 'Alertas', icon: '⚠️', description: 'Manejo de alertas, confirmaciones y prompts' },
    { id: 'windows' as TestingCategory, name: 'Ventanas/Tabs', icon: '🪟', description: 'Manejo de ventanas y pestañas múltiples' },
    { id: 'iframe' as TestingCategory, name: 'iFrames', icon: '🖼️', description: 'Interacción con elementos dentro de iframes' },
    { id: 'shadow' as TestingCategory, name: 'Shadow DOM', icon: '👥', description: 'Elementos dentro del Shadow DOM' },
    { id: 'ecommerce' as TestingCategory, name: 'E-Commerce', icon: '🛒', description: 'Simulador de tienda online completo' }
  ];

  const formComplexities = [
    { id: 'basic' as FormComplexity, name: 'Básico', level: 1, description: 'Formularios simples con validaciones básicas' },
    { id: 'intermediate' as FormComplexity, name: 'Intermedio', level: 2, description: 'Formularios con elementos dinámicos y validaciones complejas' },
    { id: 'advanced' as FormComplexity, name: 'Avanzado', level: 3, description: 'Formularios multi-paso con validaciones avanzadas' }
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'forms':
        switch (activeFormComplexity) {
          case 'basic':
            return <BasicTestingForms />;
          case 'intermediate':
            return <IntermediateTestingForms />;
          case 'advanced':
            return <AdvancedTestingForms />;
        }
        break;
      case 'alerts':
        return <AlertsTestingSection />;
      case 'windows':
        return <WindowTabsSection />;
      case 'iframe':
        return <IframeTestingSection />;
      case 'shadow':
        return <ShadowDOMSection />;
      case 'ecommerce':
        return <ECommerceSection />;
      default:
        return <BasicTestingForms />;
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            🧪 Playground de Pruebas
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Practica y mejora tus habilidades de automatización con estos escenarios reales de testing. 
            Desde formularios básicos hasta e-commerce complejo.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border rounded-lg ${
                activeCategory === category.id
                  ? 'ring-2 ring-lime-500 bg-lime-50 dark:bg-lime-900/20 border-lime-500'
                  : 'hover:bg-white dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Form Complexity Selector (only for forms) */}
        {activeCategory === 'forms' && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {formComplexities.map((complexity) => (
              <Button
                key={complexity.id}
                variant={activeFormComplexity === complexity.id ? "primary" : "secondary"}
                onClick={() => setActiveFormComplexity(complexity.id)}
                className="flex items-center gap-2"
              >
                <span className="flex">
                  {Array.from({ length: complexity.level }, (_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
                </span>
                {complexity.name}
              </Button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="min-h-[600px]">
          {renderContent()}
        </div>

        {/* Instructions */}
        <Card className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Cómo usar este Playground
              </h3>
              <ul className="text-blue-800 dark:text-blue-300 space-y-2">
                <li>• <strong>Explora las categorías:</strong> Cada sección presenta diferentes desafíos de automatización</li>
                <li>• <strong>Practica con diferentes complejidades:</strong> Comienza con formularios básicos y avanza gradualmente</li>
                <li>• <strong>Inspecciona los elementos:</strong> Usa las herramientas de desarrollador para identificar selectores</li>
                <li>• <strong>Automatiza:</strong> Escribe scripts de Selenium, Cypress, Playwright o tu herramienta favorita</li>
                <li>• <strong>Únete a nuestros cursos:</strong> Aprende las mejores prácticas con instructores expertos</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
