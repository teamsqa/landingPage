import Link from 'next/link';
import Image from 'next/image';

const courses = [
  {
    id: 'automatizacion-basico',
    title: 'Fundamentos de Automatización',
    description: 'Inicia tu camino en la automatización de pruebas aprendiendo los conceptos básicos y herramientas fundamentales.',
    duration: '8 semanas',
    level: 'Básico',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    topics: [
      'Introducción a Java y POO',
      'Fundamentos de Testing',
      'Git y Control de Versiones',
      'Primeros pasos en Automatización'
    ]
  },
  {
    id: 'serenity-java',
    title: 'SerenityBDD y Java Intermedio',
    description: 'Domina las técnicas intermedias de automatización con SerenityBDD y mejora tus habilidades en Java.',
    duration: '12 semanas',
    level: 'Intermedio',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    topics: [
      'SerenityBDD Framework',
      'Page Objects y Screen Play',
      'Patrones de Diseño en Testing',
      'Reportes Avanzados'
    ]
  },
  {
    id: 'automatizacion-profesional',
    title: 'Automatización Profesional',
    description: 'Alcanza el nivel profesional en automatización dominando herramientas avanzadas y mejores prácticas de la industria.',
    duration: '16 semanas',
    level: 'Profesional',
    image: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    topics: [
      'CI/CD con Jenkins y Docker',
      'Testing en Microservicios',
      'Performance Testing',
      'Arquitectura de Automatización'
    ]
  }
];

export default function Cursos() {
  return (
    <main className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-lime-600 to-lime-400 bg-clip-text text-transparent">
          Nuestros Cursos
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          Selecciona el curso que mejor se adapte a tu nivel y objetivos profesionales
        </p>
        
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-lime-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {course.duration}
                    </span>
                    <span className={`text-white text-sm font-medium px-3 py-1 rounded-full ${
                      course.level === 'Básico' ? 'bg-green-500' :
                      course.level === 'Intermedio' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 hover:text-lime-600 transition-colors">
                  {course.title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="mb-8">
                  <h3 className="font-semibold mb-3 text-gray-700">Lo que aprenderás:</h3>
                  <ul className="space-y-2">
                    {course.topics.map((topic, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-lime-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  href={`/cursos/${course.id}`}
                  className="group w-full inline-flex items-center justify-center bg-lime-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-lime-600 transition-all duration-300 space-x-2"
                >
                  <span>Ver detalles del curso</span>
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}