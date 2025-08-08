'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseOptimizedImageOptions {
  fallbackSrc?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

interface UseOptimizedImageResult {
  src: string;
  isLoading: boolean;
  error: boolean;
  handleLoad: () => void;
  handleError: (error: any) => void;
  retry: () => void;
}

export function useOptimizedImage(
  originalSrc: string,
  options: UseOptimizedImageOptions = {}
): UseOptimizedImageResult {
  const { fallbackSrc, placeholder, onLoad, onError } = options;
  const [src, setSrc] = useState(placeholder || originalSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 2;

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setError(false);
    retryCountRef.current = 0;
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback((errorEvent: any) => {
    console.warn('Image failed to load:', originalSrc, errorEvent);
    
    if (retryCountRef.current < maxRetries) {
      // Retry loading the original image
      retryCountRef.current++;
      setTimeout(() => {
        setSrc(`${originalSrc}?retry=${retryCountRef.current}`);
      }, 1000 * retryCountRef.current);
      return;
    }

    setError(true);
    setIsLoading(false);
    
    if (fallbackSrc && src !== fallbackSrc) {
      setSrc(fallbackSrc);
      return;
    }
    
    onError?.(errorEvent);
  }, [originalSrc, fallbackSrc, src, onError]);

  const retry = useCallback(() => {
    setError(false);
    setIsLoading(true);
    retryCountRef.current = 0;
    setSrc(originalSrc);
  }, [originalSrc]);

  // Update src when originalSrc changes
  useEffect(() => {
    if (originalSrc !== src && !placeholder) {
      setSrc(originalSrc);
      setError(false);
      setIsLoading(true);
      retryCountRef.current = 0;
    }
  }, [originalSrc, src, placeholder]);

  return {
    src,
    isLoading,
    error,
    handleLoad,
    handleError,
    retry,
  };
}

// Hook para lazy loading de imágenes con Intersection Observer
export function useLazyImage(
  src: string,
  options: {
    rootMargin?: string;
    threshold?: number;
    fallbackSrc?: string;
  } = {}
) {
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const { rootMargin = '50px', threshold = 0.1, fallbackSrc } = options;

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setImageSrc(src);
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [src, rootMargin, threshold]);

  const optimizedImage = useOptimizedImage(imageSrc, {
    fallbackSrc,
  });

  return {
    ...optimizedImage,
    ref: imgRef,
    isInView,
  };
}

// Hook para precargar imágenes críticas
export function usePreloadImages(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const preloadImage = useCallback((url: string) => {
    if (loadedImages.has(url) || loadingImages.has(url)) {
      return Promise.resolve();
    }

    setLoadingImages(prev => new Set(prev).add(url));

    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(url));
        setLoadingImages(prev => {
          const next = new Set(prev);
          next.delete(url);
          return next;
        });
        resolve();
      };
      
      img.onerror = () => {
        setLoadingImages(prev => {
          const next = new Set(prev);
          next.delete(url);
          return next;
        });
        reject(new Error(`Failed to preload image: ${url}`));
      };
      
      img.src = url;
    });
  }, [loadedImages, loadingImages]);

  const preloadImages = useCallback((imageUrls: string[]) => {
    return Promise.allSettled(
      imageUrls.map(url => preloadImage(url))
    );
  }, [preloadImage]);

  useEffect(() => {
    if (urls.length > 0) {
      preloadImages(urls);
    }
  }, [urls, preloadImages]);

  return {
    loadedImages,
    loadingImages,
    preloadImage,
    preloadImages,
    isLoaded: (url: string) => loadedImages.has(url),
    isLoading: (url: string) => loadingImages.has(url),
  };
}
