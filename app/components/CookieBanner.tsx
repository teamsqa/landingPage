'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('teamsqa-cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('teamsqa-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('teamsqa-cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🍪 Uso de Cookies
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies opcionales 
              para mejorar tu experiencia de aprendizaje. Puedes gestionar tus preferencias en cualquier momento.
              <Link 
                href="/privacidad" 
                className="text-lime-600 hover:text-lime-700 dark:hover:text-lime-500 underline ml-1"
              >
                Ver Política de Privacidad
              </Link>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={rejectCookies}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              Solo Esenciales
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors text-sm font-medium"
            >
              Aceptar Todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
