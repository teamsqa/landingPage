// Error logging utility for better debugging

export interface ErrorInfo {
  message: string;
  stack?: string;
  component?: string;
  action?: string;
  userAgent?: string;
  url?: string;
  timestamp?: Date;
}

export class ErrorLogger {
  static log(error: Error | string, context?: {
    component?: string;
    action?: string;
  }) {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      component: context?.component,
      action: context?.action,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      timestamp: new Date(),
    };

    // En desarrollo, mostrar el error en consola
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Logger');
      console.error('Message:', errorInfo.message);
      if (errorInfo.component) console.error('Component:', errorInfo.component);
      if (errorInfo.action) console.error('Action:', errorInfo.action);
      console.groupEnd();
    }

    // En producción, podrías enviar esto a un servicio de logging como Sentry
    if (process.env.NODE_ENV === 'production') {
      // TODO: Enviar a servicio de logging externo
      // Ejemplo: Sentry.captureException(error);
    }

    return errorInfo;
  }

  static logAsync(promise: Promise<any>, context?: {
    component?: string;
    action?: string;
  }) {
    return promise.catch((error) => {
      this.log(error, context);
      throw error; // Re-throw para mantener el comportamiento original
    });
  }
}

// Hook para uso en componentes React
export const useErrorHandler = (component: string) => {
  return (error: Error | string, action?: string) => {
    ErrorLogger.log(error, { component, action });
  };
};
