'use client';

import { useState } from 'react';
import { Button } from '@/app/ui';

const socialNetworks = [
  {
    name: 'WhatsApp',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.594z',
    color: 'bg-[#25D366] hover:bg-[#20b55a]'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z',
    color: 'bg-[#0077B5] hover:bg-[#006399]'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    color: 'bg-[#E4405F] hover:bg-[#d1365d]'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@Teamsqa',
    icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
    color: 'bg-[#FF0000] hover:bg-[#e60000]'
  }
];

export default function SocialButtons() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const message = '🎓 TeamsQA - Academia de Automatización\n\nDescubre cómo convertirte en un experto en automatización de pruebas con SerenityBDD, Java, Gradle y Cucumber. ¡Únete a más de 500 estudiantes graduados!\n\n' + currentUrl;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Social Media Buttons */}
        <div className={`absolute bottom-full right-0 mb-4 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <div className="flex flex-col gap-3">
            {socialNetworks.map((network) => (
              network.name === 'WhatsApp' ? (
                <button
                  key={network.name}
                  onClick={handleWhatsAppClick}
                  className={`w-12 h-12 rounded-full ${network.color} text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300`}
                  title={network.name}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d={network.icon} />
                  </svg>
                </button>
              ) : (
                <a
                  key={network.name}
                  href={network.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-full ${network.color} text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300`}
                  title={network.name}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d={network.icon} />
                  </svg>
                </a>
              )
            ))}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-lime-500 text-white shadow-lg flex items-center justify-center transform transition-all duration-300 ${
            isOpen ? 'rotate-45 bg-red-500 hover:bg-red-600' : 'hover:bg-lime-600'
          }`}
        >
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}