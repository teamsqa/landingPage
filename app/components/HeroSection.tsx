'use client';

import Link from 'next/link';
import { useGoogleAnalytics } from './GoogleAnalytics';

export default function HeroSection() {
  const { trackEvent } = useGoogleAnalytics();

  const handleVerCursosClick = () => {
    trackEvent('click', 'Hero_CTA', 'Ver Cursos');
  };

  const handleInscribirseClick = () => {
    trackEvent('click', 'Hero_CTA', 'Inscríbete Ahora');
  };

  return (
    <section className="relative h-screen">
      <div 
        className="absolute w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1580894894513-541e068a3e2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      <div className="absolute inset-0 bg-black/70 dark:bg-black/80">
        <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Transforma tu futuro en el mundo de la automatización de pruebas
          </h1>
          <h2 className="text-2xl md:text-3xl mb-8 text-lime-400">
            Domina SerenityBDD, Java, Gradle y Cucumber con nosotros
          </h2>
          <p className="text-xl mb-12 max-w-3xl text-gray-200">
            Impulsa tu carrera aprendiendo de expertos y aplicando metodologías innovadoras en proyectos reales.
          </p>
          <div className="flex gap-6">
            <Link
              href="#cursos"
              onClick={handleVerCursosClick}
              className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Ver Cursos
            </Link>
            <Link
              href="/inscripcion"
              onClick={handleInscribirseClick}
              className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Inscríbete Ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}