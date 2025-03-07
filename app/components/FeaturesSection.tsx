'use client';

import { Card } from '@/app/ui';

const features = [
  {
    title: 'Formación Práctica',
    description: 'Aprende trabajando en proyectos reales con las últimas tecnologías del mercado',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    bgColor: 'bg-lime-100 dark:bg-lime-900',
    textColor: 'text-lime-600 dark:text-lime-400'
  },
  {
    title: 'Mentorías Expertas',
    description: 'Acompañamiento personalizado por profesionales con amplia experiencia en la industria',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-600 dark:text-orange-400'
  },
  {
    title: 'Certificación Profesional',
    description: 'Obtén certificaciones reconocidas que validan tus habilidades en el mercado',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">¿Por qué elegirnos?</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-12 text-lg max-w-3xl mx-auto">
          Nuestra metodología única combina la práctica intensiva con el acompañamiento experto para garantizar tu éxito profesional
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="elevated"
              hover
              className="p-8"
            >
              <div className={`${feature.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                <svg className={`w-8 h-8 ${feature.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}