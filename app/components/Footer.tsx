'use client';

import Link from 'next/link';
import TeamsQALogo from './TeamsQALogo';
import { useState, useEffect } from 'react';

const footerLinks = {
  cursos: [
    { name: 'Fundamentos de Automatización', href: '/cursos/automatizacion-basico' },
    { name: 'Automatización Profesional', href: '/cursos/automatizacion-profesional' },
  ],
  recursos: [
    { name: 'Blog', href: '/blog' },
    { name: 'Playground de Pruebas', href: '/playground' },
    { name: 'Documentación', href: '/docs' },
    { name: 'Comunidad', href: '/comunidad' },
  ],
  empresa: [
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Términos y Condiciones', href: '/terminos' },
    { name: 'Política de Privacidad', href: '/privacidad' },
    { name: 'Admin', href: '/admin/login' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-4">
              <TeamsQALogo className="bg-white rounded-full" />
              <span className="text-2xl font-bold">TeamsQA</span>
            </Link>
            <p className="text-gray-400">
              Formando la próxima generación de profesionales en automatización de pruebas
            </p>
            <div className="flex gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@Teamsqa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Cursos</h3>
            <ul className="space-y-4">
              {footerLinks.cursos.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Recursos</h3>
            <ul className="space-y-4">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Empresa</h3>
            <ul className="space-y-4">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © {new Date().getFullYear()} TeamsQA. Todos los derechos reservados.
            </p>
            <div className="flex gap-8">
              <Link 
                href="/terminos"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Términos y Condiciones
              </Link>
              <Link 
                href="/privacidad"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}