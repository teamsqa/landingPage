// Global error suppression for browser extensions
// This helps reduce noise from browser extension errors in the console

export const suppressExtensionErrors = () => {
  // Lista de extensiones conocidas que pueden causar errores
  const EXTENSION_PATTERNS = [
    'contentScript.js',
    'content_script.js',
    'extension',
    'chrome-extension',
    'moz-extension',
    'safari-extension',
    'grammarly',
    'loom',
    'lastpass',
    'bitwarden',
    'metamask',
    'honey',
    'adblock',
    'ublock',
    'ghostery'
  ];

  // Patrones de errores específicos de extensiones
  const EXTENSION_ERROR_PATTERNS = [
    'Cannot read properties of undefined',
    'Cannot read property',
    'Script error',
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    'reading \'sentence\'',
    'reading \'record\'',
    'TypeError: Cannot read properties of undefined (reading \'sentence\')',
    'A listener indicated an asynchronous response by returning true',
    'message channel closed before a response was received',
    'Extension context invalidated',
    'Cannot access contents of url',
    'Cannot access a chrome://',
    'chrome-extension://',
    'moz-extension://'
  ];

  // Función para verificar si un error es de una extensión
  const isExtensionError = (error: any) => {
    const errorString = error?.toString?.() || '';
    const stackString = error?.stack?.toString?.() || '';
    const messageString = error?.message?.toString?.() || '';
    const sourceString = error?.source?.toString?.() || '';
    
    // Verificar patrones de archivos de extensión
    const hasExtensionFile = EXTENSION_PATTERNS.some(pattern => 
      errorString.toLowerCase().includes(pattern.toLowerCase()) ||
      stackString.toLowerCase().includes(pattern.toLowerCase()) ||
      messageString.toLowerCase().includes(pattern.toLowerCase()) ||
      sourceString.toLowerCase().includes(pattern.toLowerCase())
    );

    // Verificar patrones de errores típicos de extensiones
    const hasExtensionError = EXTENSION_ERROR_PATTERNS.some(pattern =>
      messageString.includes(pattern) || errorString.includes(pattern)
    );

    // Verificar específicamente errores de message channels de extensiones
    const isMessageChannelError = (
      messageString.includes('listener indicated an asynchronous response') ||
      messageString.includes('message channel closed before a response')
    );

    // Si el error viene de contentScript.js o similar, es definitivamente de extensión
    if (sourceString.includes('contentScript.js') || stackString.includes('contentScript.js')) {
      return true;
    }

    // Si es un error de message channel sin stack trace específico, probablemente es de extensión
    if (isMessageChannelError && !stackString.includes('file://') && !stackString.includes('http')) {
      return true;
    }

    return hasExtensionFile || hasExtensionError || isMessageChannelError;
  };

  // Suprimir errores no capturados
  const originalErrorHandler = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (isExtensionError({ message, source, stack: error?.stack })) {
      return true; // Prevenir que se muestre en la consola
    }
    
    // Llamar al handler original si existe
    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error);
    }
    
    return false;
  };

  // Suprimir promesas rechazadas
  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = (event) => {
    if (isExtensionError(event.reason)) {
      event.preventDefault(); // Prevenir que se muestre en la consola
      return;
    }
    
    // Llamar al handler original si existe
    if (originalUnhandledRejection) {
      originalUnhandledRejection.call(window, event);
    }
  };
};

// Auto-inicializar si estamos en el navegador
if (typeof window !== 'undefined') {
  suppressExtensionErrors();
}
