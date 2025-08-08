'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string;
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Solo cargar si tenemos el ID (permitir en desarrollo para pruebas)
    if (!GA_MEASUREMENT_ID) {
      return;
    }

    try {
      // Cargar script de Google Analytics
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script1.onerror = () => {
        // Error handling without logging sensitive info
      };
      document.head.appendChild(script1);

      // Configurar gtag
      const script2 = document.createElement('script');
      script2.innerHTML = `
        try {
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            ${process.env.NODE_ENV === 'development' ? 'debug_mode: true,' : ''}
            custom_map: {
              'custom_parameter_1': 'page_category'
            }
          });
        } catch (error) {
          // Error handling without logging sensitive info
        }
      `;
      document.head.appendChild(script2);

      // Cleanup al desmontar
      return () => {
        try {
          if (document.head.contains(script1)) {
            document.head.removeChild(script1);
          }
          if (document.head.contains(script2)) {
            document.head.removeChild(script2);
          }
        } catch (error) {
          // Error handling without logging sensitive info
        }
      };
    } catch (error) {
      // Error handling without logging sensitive info
    }
  }, [GA_MEASUREMENT_ID]);

  // Tracking de cambio de página
  useEffect(() => {
    try {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: pathname,
        });
      }
    } catch (error) {
      // Error handling without logging sensitive info
    }
  }, [pathname, GA_MEASUREMENT_ID]);

  return null;
}

// Hook para tracking de eventos personalizados
export const useGoogleAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (page_title: string, page_location: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_title,
        page_location,
      });
    }
  };

  return { trackEvent, trackPageView };
};
