'use client';

import TeamsQALogo from './TeamsQALogo';

interface LoadingWithLogoProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingWithLogo({ 
  message = "Cargando...", 
  size = 'md',
  className = '' 
}: LoadingWithLogoProps) {
  const sizeClasses = {
    sm: {
      container: 'p-6',
      logo: 'w-8 h-8',
      logoWrapper: 'w-16 h-16',
      text: 'text-sm',
      title: 'text-lg'
    },
    md: {
      container: 'p-8',
      logo: 'w-12 h-12',
      logoWrapper: 'w-20 h-20',
      text: 'text-base',
      title: 'text-xl'
    },
    lg: {
      container: 'p-12',
      logo: 'w-16 h-16',
      logoWrapper: 'w-24 h-24',
      text: 'text-lg',
      title: 'text-2xl'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`text-center ${classes.container} ${className}`}>
      {/* Logo con animación */}
      <div className="flex justify-center mb-6">
        <div className={`${classes.logoWrapper} relative`}>
          {/* Círculo de fondo animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-lime-100 to-lime-200 dark:from-lime-900 dark:to-lime-800 rounded-full animate-pulse"></div>
          
          {/* Spinner exterior */}
          <div className="absolute inset-0 border-4 border-lime-200 dark:border-lime-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-lime-500 dark:border-t-lime-400 rounded-full animate-spin"></div>
          
          {/* Logo en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
              <TeamsQALogo className={classes.logo} />
            </div>
          </div>
        </div>
      </div>

      {/* Título animado */}
      <h2 className={`font-semibold text-gray-900 dark:text-white mb-2 ${classes.title}`}>
        TeamsQA
      </h2>

      {/* Mensaje */}
      <p className={`text-gray-600 dark:text-gray-300 ${classes.text}`}>
        {message}
      </p>

      {/* Puntos de carga animados */}
      <div className="flex justify-center space-x-1 mt-4">
        <div className="w-2 h-2 bg-lime-500 dark:bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-lime-500 dark:bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-lime-500 dark:bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}
