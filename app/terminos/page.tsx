export const metadata = {
  title: 'Términos y Condiciones - TeamsQA',
  description: 'Términos y condiciones de uso de la plataforma educativa TeamsQA',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Términos y Condiciones
          </h1>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              <strong>Fecha de última actualización:</strong> 7 de agosto de 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Introducción
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Bienvenido a TeamsQA ("nosotros", "nuestro" o "la plataforma"). Estos Términos y Condiciones 
                ("Términos") rigen el uso de nuestros servicios educativos en línea, incluyendo cursos de 
                automatización de pruebas, materiales de aprendizaje y plataforma web.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Al acceder y utilizar nuestros servicios, usted acepta cumplir con estos Términos. 
                Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Definiciones
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p><strong>"Plataforma":</strong> Se refiere al sitio web y aplicaciones de TeamsQA.</p>
                <p><strong>"Usuario":</strong> Cualquier persona que acceda o utilice nuestros servicios.</p>
                <p><strong>"Estudiante":</strong> Usuario registrado que ha adquirido o accede a nuestros cursos.</p>
                <p><strong>"Contenido":</strong> Incluye cursos, videos, materiales, ejercicios y cualquier información disponible en la plataforma.</p>
                <p><strong>"Servicios":</strong> Todos los servicios educativos ofrecidos por TeamsQA.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Uso de los Servicios
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Elegibilidad</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Debe tener al menos 18 años para utilizar nuestros servicios. Si es menor de 18 años, 
                debe contar con la supervisión y consentimiento de un padre o tutor legal.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Registro de Cuenta</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Debe proporcionar información precisa y actualizada durante el registro</li>
                <li>Es responsable de mantener la confidencialidad de su cuenta</li>
                <li>Debe notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
                <li>Una persona puede tener solo una cuenta activa</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.3 Uso Aceptable</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">Se compromete a:</p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Usar los servicios solo para fines educativos legítimos</li>
                <li>Respetar los derechos de propiedad intelectual</li>
                <li>No compartir credenciales de acceso con terceros</li>
                <li>Mantener un comportamiento respetuoso en la comunidad</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Propiedad Intelectual
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Todo el contenido de la plataforma, incluyendo pero no limitado a cursos, videos, 
                textos, gráficos, logos, íconos, imágenes, clips de audio y software, es propiedad 
                de TeamsQA o sus licenciantes y está protegido por las leyes de propiedad intelectual 
                de Colombia y tratados internacionales.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.1 Licencia de Uso</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Se le otorga una licencia limitada, no exclusiva, no transferible y revocable para 
                acceder y usar el contenido únicamente para sus propósitos educativos personales.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.2 Restricciones</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>No puede reproducir, distribuir o modificar el contenido sin autorización</li>
                <li>No puede usar el contenido para fines comerciales</li>
                <li>No puede crear trabajos derivados del contenido</li>
                <li>No puede realizar ingeniería inversa del software</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Pagos y Reembolsos
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.1 Precios</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Los precios están expresados en pesos colombianos (COP) e incluyen los impuestos aplicables 
                según la legislación colombiana. Nos reservamos el derecho de cambiar los precios en cualquier momento.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.2 Política de Reembolso</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Puede solicitar reembolso completo dentro de los primeros 7 días después de la compra</li>
                <li>Después de 7 días, no se procesarán reembolsos, excepto por defectos técnicos significativos</li>
                <li>Los reembolsos se procesarán en un plazo de 5-10 días hábiles</li>
                <li>Para solicitar reembolso, contacte nuestro soporte técnico</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Privacidad y Datos Personales
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                El tratamiento de sus datos personales se rige por nuestra Política de Privacidad 
                y cumple con la Ley 1581 de 2012 (Ley de Protección de Datos Personales) y el 
                Decreto 1377 de 2013 de Colombia.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Limitación de Responsabilidad
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                En la máxima medida permitida por la ley colombiana:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>TeamsQA no garantiza que los servicios estarán disponibles de manera ininterrumpida</li>
                <li>No nos hacemos responsables por daños indirectos, incidentales o consecuentes</li>
                <li>Nuestra responsabilidad máxima se limita al monto pagado por los servicios</li>
                <li>Los servicios se proporcionan "tal como están"</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Terminación
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Podemos suspender o terminar su acceso a los servicios en caso de:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Violación de estos Términos</li>
                <li>Actividad fraudulenta o ilegal</li>
                <li>Uso indebido de la plataforma</li>
                <li>Solicitud del usuario</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Ley Aplicable y Jurisdicción
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Estos Términos se rigen por las leyes de la República de Colombia. 
                Cualquier disputa será resuelta en los tribunales competentes de Bogotá, Colombia, 
                sin perjuicio del derecho del consumidor de acudir a las autoridades de protección 
                al consumidor (SIC - Superintendencia de Industria y Comercio).
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Modificaciones
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Nos reservamos el derecho de modificar estos Términos en cualquier momento. 
                Las modificaciones entrarán en vigor inmediatamente después de su publicación. 
                Le notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Contacto
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Email:</strong> legal@teamsqa.com
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Teléfono:</strong> +57 (1) 234-5678
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Dirección:</strong> Calle 123 #45-67, Bogotá, Colombia
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
