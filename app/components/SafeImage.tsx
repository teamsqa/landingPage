'use client';

import React, { useState, useCallback } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  onErrorLogged?: (error: string) => void;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = '/aws.svg',
  alt,
  onErrorLogged,
  className,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      
      if (onErrorLogged) {
        onErrorLogged(`Failed to load image: ${src}`);
      }
      
      console.debug('SafeImage: Fallback applied for:', src);
    }
  }, [src, fallbackSrc, hasError, onErrorLogged, currentSrc]);

  // Función para validar URL
  const getValidSrc = useCallback((imageSrc: string) => {
    if (!imageSrc) return fallbackSrc;
    
    // Si es una URL blob, verificar que sea válida
    if (imageSrc.startsWith('blob:')) {
      try {
        new URL(imageSrc);
        return imageSrc;
      } catch {
        return fallbackSrc;
      }
    }
    
    return imageSrc;
  }, [fallbackSrc]);

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false);
    setCurrentSrc(getValidSrc(src));
  }, [src, getValidSrc]);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
    />
  );
};

export default SafeImage;
