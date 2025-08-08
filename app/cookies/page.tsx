'use client';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Configuración de Cookies
          </h1>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Gestiona tus preferencias de cookies para personalizar tu experiencia en TeamsQA
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                ¿Qué son las cookies?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
                cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia, 
                recordar tus preferencias y proporcionar funcionalidades personalizadas.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Tipos de Cookies que Utilizamos
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Cookies Esenciales
                    </h3>
                    <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-sm font-medium">
                      Siempre Activas
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Estas cookies son necesarias para el funcionamiento básico de la plataforma 
                    y no se pueden desactivar.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Autenticación y seguridad de sesión</li>
                    <li>• Funcionalidades básicas de navegación</li>
                    <li>• Preferencias de idioma y región</li>
                    <li>• Carrito de compras y proceso de pago</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Cookies de Rendimiento
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 dark:peer-focus:ring-lime-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Nos ayudan a entender cómo interactúas con la plataforma para mejorar 
                    el rendimiento y la experiencia de usuario.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Análisis de uso y navegación</li>
                    <li>• Métricas de rendimiento del sitio</li>
                    <li>• Detección y corrección de errores</li>
                    <li>• Optimización de velocidad de carga</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Cookies de Personalización
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 dark:peer-focus:ring-lime-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Permiten que la plataforma recuerde tus preferencias y te ofrezca 
                    contenido personalizado.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Recomendaciones de cursos personalizadas</li>
                    <li>• Tema oscuro/claro preferido</li>
                    <li>• Progreso de aprendizaje</li>
                    <li>• Configuraciones de la cuenta</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Cookies de Marketing
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 dark:peer-focus:ring-lime-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Se utilizan para mostrarte anuncios relevantes y medir la efectividad 
                    de nuestras campañas publicitarias.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Publicidad personalizada</li>
                    <li>• Seguimiento de conversiones</li>
                    <li>• Remarketing y retargeting</li>
                    <li>• Análisis de efectividad publicitaria</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Gestión de Cookies en tu Navegador
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                También puedes gestionar las cookies directamente desde tu navegador:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Google Chrome</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configuración → Privacidad y seguridad → Cookies y otros datos del sitio
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Firefox</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Opciones → Privacidad y seguridad → Cookies y datos del sitio
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Safari</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Preferencias → Privacidad → Administrar datos del sitio web
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Microsoft Edge</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configuración → Cookies y permisos del sitio → Cookies
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  💡 Información Importante
                </h3>
                <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                  <li>• Deshabilitar cookies esenciales puede afectar la funcionalidad de la plataforma</li>
                  <li>• Puedes cambiar tus preferencias en cualquier momento</li>
                  <li>• Tus configuraciones se guardan localmente en tu dispositivo</li>
                  <li>• Al borrar las cookies del navegador, deberás configurar nuevamente tus preferencias</li>
                </ul>
              </div>
            </section>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="bg-lime-600 text-white px-8 py-3 rounded-lg hover:bg-lime-700 transition-colors font-semibold"
                  onClick={() => {
                    localStorage.setItem('teamsqa-cookie-consent', 'accepted');
                    window.location.reload();
                  }}
                >
                  Guardar Preferencias
                </button>
                <button 
                  className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold"
                  onClick={() => {
                    localStorage.removeItem('teamsqa-cookie-consent');
                    window.location.reload();
                  }}
                >
                  Resetear Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
