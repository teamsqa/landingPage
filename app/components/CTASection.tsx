'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-lime-500 dark:bg-lime-600">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">¿Listo para impulsar tu carrera?</h2>
        <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
          Únete a nuestra comunidad de profesionales QA y domina las herramientas más demandadas del mercado.
        </p>
        <Link
          href="/inscripcion"
          className="bg-white text-lime-600 dark:text-lime-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-50 transition-colors inline-block"
        >
          Comienza Ahora
        </Link>
      </div>
    </section>
  );
}