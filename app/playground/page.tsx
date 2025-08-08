import { Metadata } from 'next'
import TestingPlaygroundSection from '../components/TestingPlaygroundSection'

export const metadata: Metadata = {
  title: 'Playground de Pruebas QA - Automatización | Selenium, Cypress, Playwright - TeamsQA',
  description: 'Playground interactivo para practicar automatización de pruebas. Escenarios reales con formularios, alertas, iframes, shadow DOM y e-commerce. Compatible con Selenium, Cypress, Playwright y TestCafe.',
  keywords: [
    'playground testing',
    'automatización pruebas',
    'selenium webdriver',
    'cypress testing',
    'playwright automation',
    'testcafe',
    'formularios testing',
    'alertas javascript',
    'shadow dom testing',
    'iframe automation',
    'e-commerce testing',
    'QA automation',
    'testing practice',
    'web testing',
    'automation tools',
    'TeamsQA'
  ],
  authors: [{ name: 'TeamsQA', url: 'https://teamsqa.com' }],
  creator: 'TeamsQA',
  publisher: 'TeamsQA',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Playground de Pruebas QA - Automatización | TeamsQA',
    description: 'Practica automatización de pruebas con escenarios reales. Compatible con Selenium, Cypress, Playwright y TestCafe.',
    url: 'https://teamsqa.com/playground',
    siteName: 'TeamsQA',
    images: [
      {
        url: '/playground-og-image.png',
        width: 1200,
        height: 630,
        alt: 'TeamsQA Playground de Pruebas - Automatización QA',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground de Pruebas QA - Automatización | TeamsQA',
    description: 'Practica automatización con escenarios reales: formularios, alertas, iframes, shadow DOM y e-commerce.',
    images: ['/playground-og-image.png'],
    creator: '@teamsqa',
  },
  alternates: {
    canonical: 'https://teamsqa.com/playground',
  },
  category: 'technology',
}

export default function PlaygroundPage() {
  // Datos estructurados para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Playground de Pruebas QA - TeamsQA',
    description: 'Playground interactivo para practicar automatización de pruebas con escenarios reales',
    url: 'https://teamsqa.com/playground',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'TeamsQA',
      url: 'https://teamsqa.com',
    },
    featureList: [
      'Formularios de testing (básico, intermedio, avanzado)',
      'Manejo de alertas JavaScript',
      'Testing con múltiples ventanas',
      'Automatización de iframes',
      'Testing de Shadow DOM',
      'Simulación de e-commerce completo',
      'Compatible con Selenium WebDriver',
      'Compatible con Cypress',
      'Compatible con Playwright',
      'Compatible con TestCafe'
    ],
    keywords: 'playground testing, automatización pruebas, selenium, cypress, playwright, testcafe, QA automation',
    inLanguage: 'es',
    isAccessibleForFree: true,
    educationalUse: 'practice',
    learningResourceType: 'interactive tool'
  }

  return (
    <>
      {/* Datos estructurados JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        {/* Hero Section */}
        <header className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              🧪 Playground de Pruebas QA - Automatización
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
              Practica y mejora tus habilidades de automatización de pruebas con escenarios reales de testing. 
              Desde formularios básicos hasta e-commerce complejo. Compatible con las principales herramientas de automatización.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow" title="Selenium WebDriver">
                🎯 Selenium WebDriver
              </span>
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow" title="Cypress Testing">
                🚀 Cypress
              </span>
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow" title="Playwright Automation">
                🎭 Playwright
              </span>
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow" title="TestCafe E2E Testing">
                🤖 TestCafe
              </span>
            </div>
          </div>
        </header>

        {/* Main Playground Section */}
        <main className="pb-20">
          <TestingPlaygroundSection />
        </main>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-6xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para dominar la automatización de pruebas?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Únete a nuestros cursos de automatización QA y aprende de expertos con proyectos reales. 
              Especialízate en Selenium, Cypress, Playwright y más herramientas de testing.
            </p>
            <nav className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/inscripcion"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                title="Ver cursos de automatización QA"
              >
                Ver Cursos de Automatización
              </a>
              <a
                href="/"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                title="Volver al inicio de TeamsQA"
              >
                Volver a Inicio
              </a>
            </nav>
          </div>
        </section>
    </div>
    </>
  )
}
