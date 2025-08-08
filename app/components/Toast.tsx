'use client';
import { Toaster, toast } from 'react-hot-toast';

// Configuración de estilos personalizados
export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Configuración por defecto para todos los toasts
        className: '',
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '400px',
        },
        // Configuración específica para tipos
        success: {
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        loading: {
          style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#3b82f6',
          },
        },
      }}
    />
  );
};

// Funciones de notificación personalizadas
export const showToast = {
  success: (message: string, options?: any) => {
    toast.success(message, {
      icon: '🎉',
      ...options,
    });
  },
  
  error: (message: string, options?: any) => {
    toast.error(message, {
      icon: '❌',
      ...options,
    });
  },
  
  warning: (message: string, options?: any) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#fff',
      },
      ...options,
    });
  },
  
  info: (message: string, options?: any) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#fff',
      },
      ...options,
    });
  },
  
  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      ...options,
    });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    },
    options?: any
  ) => {
    return toast.promise(promise, msgs, {
      success: {
        icon: '✅',
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#fff',
        },
      },
      error: {
        icon: '💥',
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#fff',
        },
      },
      loading: {
        icon: '🔄',
        style: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#fff',
        },
      },
      ...options,
    });
  },

  // Notificación personalizada con acción
  custom: (message: string, actionText?: string, onAction?: () => void) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔔</span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {message}
              </p>
            </div>
          </div>
        </div>
        {actionText && onAction && (
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                onAction();
                toast.dismiss(t.id);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-lime-600 hover:text-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              {actionText}
            </button>
          </div>
        )}
        <div className="flex border-l border-gray-200 dark:border-gray-700">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            ✕
          </button>
        </div>
      </div>
    ));
  },
};

export default showToast;
