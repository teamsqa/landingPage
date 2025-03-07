'use client';

import { Card } from '@/app/ui';

const methodologies = [
  {
    title: 'Aprendizaje Práctico',
    description: 'Desarrolla habilidades reales trabajando en proyectos empresariales actuales',
    icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
  },
  {
    title: 'Seguimiento Individual',
    description: 'Recibe retroalimentación personalizada para potenciar tu desarrollo',
    icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
  },
  {
    title: 'Comunidad Activa',
    description: 'Conecta y aprende de otros profesionales en un ambiente colaborativo',
    icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
  },
  {
    title: 'Evaluación Continua',
    description: 'Mide tu progreso con ejercicios prácticos y retroalimentación constante',
    icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
  }
];

export default function MethodologySection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Nuestra Metodología</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Un enfoque integral que combina la práctica intensiva con el acompañamiento experto
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {methodologies.map((method, index) => (
            <Card 
              key={index}
              variant="elevated"
              hover
              className="p-6"
            >
              <div className="bg-lime-100 dark:bg-lime-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <svg 
                  className="w-8 h-8 text-lime-600 dark:text-lime-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d={method.icon} 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{method.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{method.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}