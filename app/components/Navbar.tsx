'use client';

import Link from 'next/link';
import { useState } from 'react';
import TeamsQALogo from './TeamsQALogo';
import ThemeToggle from './ThemeToggle';
import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';

export default function Navbar() {
  const { user } = useFirebaseAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-4">
            <TeamsQALogo className="text-lime-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">TeamsQA</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/#cursos" 
              className="text-gray-600 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-500 transition-colors"
            >
              Cursos
            </Link>
            <Link 
              href="/nosotros" 
              className="text-gray-600 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-500 transition-colors"
            >
              Nosotros
            </Link>
            <ThemeToggle />
            <Link 
              href={user ? "/admin" : "/inscripcion"}
              className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
            >
              {user ? 'Dashboard' : 'Inscríbete'}
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <Link 
                href="/#cursos" 
                className="text-gray-600 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Cursos
              </Link>
              <Link 
                href="/nosotros" 
                className="text-gray-600 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </Link>
              
              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              {/* Legal Links */}
              <Link 
                href="/terminos" 
                className="text-gray-500 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-500 transition-colors py-1 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Términos y Condiciones
              </Link>
              <Link 
                href="/privacidad" 
                className="text-gray-500 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-500 transition-colors py-1 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Política de Privacidad
              </Link>
              
              <Link 
                href={user ? "/admin" : "/inscripcion"}
                className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {user ? 'Dashboard' : 'Inscríbete'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}