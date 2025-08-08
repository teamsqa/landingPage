'use client';

import TeamsQALogo from '../components/TeamsQALogo';
import ShareButton from '../components/ShareButton';
import WhatsAppShare from '../components/WhatsAppShare';
import { useEffect } from 'react';

export default function NosotrosPage() {
  // Set page metadata on the client side
  useEffect(() => {
    document.title = 'Nosotros - TeamsQA Academia de Automatización';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Conoce más sobre TeamsQA, nuestro equipo y nuestra misión de enseñar automatización de pruebas');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Conoce más sobre TeamsQA, nuestro equipo y nuestra misión de enseñar automatización de pruebas';
      document.head.appendChild(meta);
    }
  }, []);
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <TeamsQALogo className="text-lime-600 w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Sobre <span className="text-lime-600">TeamsQA</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Somos una academia especializada en la enseñanza de automatización de pruebas, 
              comprometidos con formar profesionales altamente capacitados en testing automatizado.
            </p>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Misión</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Democratizar el acceso a la educación en automatización de pruebas, 
                proporcionando formación práctica y de calidad que prepare a profesionales 
                para los desafíos del testing moderno.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Visión</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Ser la academia líder en Latinoamérica para la formación en automatización 
                de pruebas, reconocida por la excelencia académica y el impacto profesional 
                de nuestros graduados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nuestros Valores
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Innovación</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Mantenemos nuestros cursos actualizados con las últimas tecnologías 
                y metodologías en automatización de pruebas.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Excelencia</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nos comprometemos con la más alta calidad en nuestros contenidos 
                y metodologías de enseñanza.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Comunidad</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fomentamos un ambiente colaborativo donde cada estudiante puede 
                crecer y aprender junto a profesionales de la industria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metodología */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nuestra Metodología
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Aprendizaje Práctico y Aplicado
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Proyectos Reales:</strong> Trabajamos con casos de uso del mundo real.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Mentoría Personalizada:</strong> Acompañamiento individual en tu proceso de aprendizaje.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Tecnologías Actuales:</strong> SerenityBDD, Java, Gradle, Cucumber y más.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Flexibilidad:</strong> Aprende a tu propio ritmo con horarios adaptables.
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Enfoque Experimental
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    No solo enseñamos teoría, sino que proporcionamos un entorno 
                    donde puedes experimentar y aplicar inmediatamente lo aprendido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nuestro Impacto
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">500+</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Estudiantes Graduados</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">95%</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Tasa de Satisfacción</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">10+</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Cursos Disponibles</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Soporte Técnico</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-lime-600 to-lime-700">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar tu carrera en automatización?
          </h2>
          <p className="text-lime-100 text-lg mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de profesionales y transforma tu futuro profesional 
            con nuestros cursos especializados en testing automatizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/inscripcion"
              className="bg-white text-lime-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Inscríbete Ahora
            </a>
            <a
              href="/#cursos"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-lime-600 transition-colors"
            >
              Ver Cursos
            </a>
          </div>
          
          <div className="mt-6 flex justify-center">
            <ShareButton 
              title="Nosotros - TeamsQA Academia de Automatización"
              description="Conoce más sobre TeamsQA, nuestro equipo y nuestra misión de enseñar automatización de pruebas"
            />
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
