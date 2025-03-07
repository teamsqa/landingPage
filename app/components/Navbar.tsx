'use client';

import Link from 'next/link';
import TeamsQALogo from './TeamsQALogo';
import ThemeToggle from './ThemeToggle';
import { useFirebaseAuth } from '@/app/providers/FirebaseAuthProvider';

export default function Navbar() {
  const { user } = useFirebaseAuth();

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
            <ThemeToggle />
            <Link 
              href={user ? "/admin" : "/inscripcion"}
              className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
            >
              {user ? 'Dashboard' : 'Inscríbete'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}