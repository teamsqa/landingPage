'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, Button } from '@/app/ui';

interface WindowInfo {
  id: string;
  name: string;
  url: string;
  status: 'open' | 'closed';
  type: 'window' | 'popup' | 'tab';
  openedAt: Date;
  windowRef?: Window | null;
}

export default function WindowTabsSection() {
  const [windows, setWindows] = useState<WindowInfo[]>([]);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [communicationLog, setCommunicationLog] = useState<string[]>([]);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check window status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setWindows(prev => prev.map(win => ({
        ...win,
        status: win.windowRef && !win.windowRef.closed ? 'open' : 'closed'
      })));
    }, 1000);

    checkIntervalRef.current = interval;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Cleanup windows on unmount
  useEffect(() => {
    return () => {
      windows.forEach(win => {
        if (win.windowRef && !win.windowRef.closed) {
          win.windowRef.close();
        }
      });
    };
  }, []);

  const addToLog = (message: string) => {
    setCommunicationLog(prev => [
      `${new Date().toLocaleTimeString()} - ${message}`,
      ...prev.slice(0, 19)
    ]);
  };

  const generateWindowId = () => Math.random().toString(36).substr(2, 9);

  const createSimpleWindow = () => {
    try {
      const id = generateWindowId();
      const windowRef = window.open('about:blank', id, 'width=600,height=400,scrollbars=yes,resizable=yes');
      
      if (!windowRef) {
        setPopupBlocked(true);
        return;
      }

      setPopupBlocked(false);

      // Add content to the new window
      windowRef.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ventana Simple - ${id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              margin: 0;
            }
            .container { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; }
            button { 
              background: #4CAF50; 
              color: white; 
              border: none; 
              padding: 10px 20px; 
              margin: 5px; 
              border-radius: 5px; 
              cursor: pointer;
            }
            button:hover { background: #45a049; }
            input { padding: 8px; margin: 5px; border: none; border-radius: 3px; }
            .close-btn { background: #f44336; }
            .close-btn:hover { background: #da190b; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>🪟 Ventana de Prueba</h2>
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>URL:</strong> ${windowRef.location.href}</p>
            <p>Esta es una ventana simple para pruebas de automatización.</p>
            
            <div data-testid="window-controls">
              <button onclick="alert('Alerta desde ventana secundaria!')" data-testid="window-alert-btn">
                📢 Mostrar Alerta
              </button>
              <button onclick="window.opener.postMessage('Hola desde ventana ${id}!', '*')" data-testid="send-message-btn">
                💬 Enviar Mensaje
              </button>
              <button onclick="window.close()" class="close-btn" data-testid="close-window-btn">
                ❌ Cerrar Ventana
              </button>
            </div>

            <div style="margin-top: 20px;">
              <input type="text" id="messageInput" placeholder="Escribe un mensaje..." data-testid="message-input">
              <button onclick="sendCustomMessage()" data-testid="send-custom-message">
                📤 Enviar Personalizado
              </button>
            </div>

            <div style="margin-top: 20px;">
              <h4>Información de la ventana:</h4>
              <ul>
                <li>Ancho: <span id="width">${windowRef.innerWidth}</span>px</li>
                <li>Alto: <span id="height">${windowRef.innerHeight}</span>px</li>
                <li>X: <span id="screenX">${windowRef.screenX}</span></li>
                <li>Y: <span id="screenY">${windowRef.screenY}</span></li>
              </ul>
              <button onclick="updateInfo()" data-testid="update-info-btn">🔄 Actualizar Info</button>
            </div>
          </div>

          <script>
            function sendCustomMessage() {
              const input = document.getElementById('messageInput');
              const message = input.value || 'Mensaje vacío';
              window.opener.postMessage('Mensaje personalizado: ' + message, '*');
              input.value = '';
            }

            function updateInfo() {
              document.getElementById('width').textContent = window.innerWidth;
              document.getElementById('height').textContent = window.innerHeight;
              document.getElementById('screenX').textContent = window.screenX;
              document.getElementById('screenY').textContent = window.screenY;
            }

            // Update info periodically
            setInterval(updateInfo, 2000);
          </script>
        </body>
        </html>
      `);
      windowRef.document.close();

      const newWindow: WindowInfo = {
        id,
        name: `Ventana Simple ${id}`,
        url: windowRef.location.href,
        status: 'open',
        type: 'window',
        openedAt: new Date(),
        windowRef
      };

      setWindows(prev => [...prev, newWindow]);
      setActiveWindow(id);
      addToLog(`Ventana simple creada: ${id}`);

    } catch (error) {
      console.error('Error creating window:', error);
      setPopupBlocked(true);
    }
  };

  const createPopupWindow = () => {
    try {
      const id = generateWindowId();
      const windowRef = window.open(
        'about:blank',
        id,
        'width=400,height=300,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no'
      );
      
      if (!windowRef) {
        setPopupBlocked(true);
        return;
      }

      setPopupBlocked(false);

      windowRef.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Popup - ${id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 15px; 
              background: #ff9a56;
              color: white;
              margin: 0;
              text-align: center;
            }
            button { 
              background: #fff; 
              color: #ff9a56; 
              border: none; 
              padding: 8px 15px; 
              margin: 8px; 
              border-radius: 20px; 
              cursor: pointer;
              font-weight: bold;
            }
            button:hover { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h3>🔥 Popup Window</h3>
          <p>ID: ${id}</p>
          <button onclick="alert('¡Popup alert!')" data-testid="popup-alert">📢 Alerta</button>
          <br>
          <button onclick="window.opener.postMessage('Popup message!', '*')" data-testid="popup-message">
            💬 Mensaje
          </button>
          <br>
          <button onclick="window.close()" data-testid="popup-close">❌ Cerrar</button>
          
          <div style="margin-top: 15px; font-size: 12px;">
            <div>Tamaño: ${windowRef.innerWidth}x${windowRef.innerHeight}</div>
            <div>Sin barras de herramientas</div>
          </div>
        </body>
        </html>
      `);
      windowRef.document.close();

      const newWindow: WindowInfo = {
        id,
        name: `Popup ${id}`,
        url: windowRef.location.href,
        status: 'open',
        type: 'popup',
        openedAt: new Date(),
        windowRef
      };

      setWindows(prev => [...prev, newWindow]);
      addToLog(`Popup creado: ${id}`);

    } catch (error) {
      console.error('Error creating popup:', error);
      setPopupBlocked(true);
    }
  };

  const openNewTab = () => {
    try {
      const id = generateWindowId();
      const windowRef = window.open('about:blank', '_blank');
      
      if (!windowRef) {
        setPopupBlocked(true);
        return;
      }

      setPopupBlocked(false);

      windowRef.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Nueva Pestaña - ${id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 30px; 
              background: linear-gradient(45deg, #1e3c72, #2a5298);
              color: white;
              margin: 0;
            }
            .header { text-align: center; margin-bottom: 30px; }
            .content { max-width: 600px; margin: 0 auto; }
            button { 
              background: #4CAF50; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              margin: 10px; 
              border-radius: 5px; 
              cursor: pointer;
              font-size: 14px;
            }
            button:hover { background: #45a049; }
            .danger { background: #f44336; }
            .danger:hover { background: #da190b; }
            input { padding: 10px; margin: 10px; border: none; border-radius: 3px; width: 200px; }
            .info-box { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔗 Nueva Pestaña</h1>
            <p>ID: ${id}</p>
          </div>
          
          <div class="content">
            <div class="info-box">
              <h3>Información de la pestaña:</h3>
              <ul>
                <li>Abierta en nueva pestaña</li>
                <li>URL: ${windowRef.location.href}</li>
                <li>Hora de apertura: ${new Date().toLocaleTimeString()}</li>
              </ul>
            </div>

            <div data-testid="tab-controls">
              <button onclick="alert('Alerta desde nueva pestaña!')" data-testid="tab-alert">
                📢 Mostrar Alerta
              </button>
              <button onclick="window.opener.postMessage('¡Mensaje desde pestaña ${id}!', '*')" data-testid="tab-message">
                💬 Enviar Mensaje
              </button>
              <button onclick="window.close()" class="danger" data-testid="tab-close">
                ❌ Cerrar Pestaña
              </button>
            </div>

            <div style="margin-top: 30px;">
              <input type="text" id="tabMessage" placeholder="Mensaje personalizado..." data-testid="tab-message-input">
              <button onclick="sendTabMessage()" data-testid="send-tab-message">📤 Enviar</button>
            </div>

            <div class="info-box">
              <h4>Pruebas disponibles:</h4>
              <button onclick="testLocalStorage()" data-testid="test-localstorage">💾 Test LocalStorage</button>
              <button onclick="testNavigator()" data-testid="test-navigator">🧭 Test Navigator</button>
              <button onclick="testLocation()" data-testid="test-location">🌐 Test Location</button>
            </div>
          </div>

          <script>
            function sendTabMessage() {
              const input = document.getElementById('tabMessage');
              const message = input.value || 'Mensaje desde pestaña';
              window.opener.postMessage('TAB: ' + message, '*');
              input.value = '';
            }

            function testLocalStorage() {
              localStorage.setItem('tab_test', 'Valor desde pestaña ${id}');
              alert('LocalStorage actualizado: ' + localStorage.getItem('tab_test'));
            }

            function testNavigator() {
              alert('Navigator info:\\nUser Agent: ' + navigator.userAgent.substring(0, 50) + '...');
            }

            function testLocation() {
              alert('Location info:\\nHref: ' + location.href + '\\nProtocol: ' + location.protocol);
            }
          </script>
        </body>
        </html>
      `);
      windowRef.document.close();

      const newWindow: WindowInfo = {
        id,
        name: `Pestaña ${id}`,
        url: windowRef.location.href,
        status: 'open',
        type: 'tab',
        openedAt: new Date(),
        windowRef
      };

      setWindows(prev => [...prev, newWindow]);
      addToLog(`Nueva pestaña abierta: ${id}`);

    } catch (error) {
      console.error('Error creating tab:', error);
      setPopupBlocked(true);
    }
  };

  const createMultipleWindows = () => {
    const windowTypes = ['window', 'popup', 'tab'];
    windowTypes.forEach((type, index) => {
      setTimeout(() => {
        if (type === 'window') createSimpleWindow();
        else if (type === 'popup') createPopupWindow();
        else openNewTab();
      }, index * 1000);
    });
    addToLog('Creando múltiples ventanas...');
  };

  const focusWindow = (id: string) => {
    const window_info = windows.find(w => w.id === id);
    if (window_info && window_info.windowRef && !window_info.windowRef.closed) {
      window_info.windowRef.focus();
      setActiveWindow(id);
      addToLog(`Foco cambiado a ventana: ${id}`);
    }
  };

  const closeWindow = (id: string) => {
    const window_info = windows.find(w => w.id === id);
    if (window_info && window_info.windowRef) {
      window_info.windowRef.close();
      addToLog(`Ventana cerrada: ${id}`);
    }
  };

  const closeAllWindows = () => {
    windows.forEach(win => {
      if (win.windowRef && !win.windowRef.closed) {
        win.windowRef.close();
      }
    });
    addToLog('Todas las ventanas cerradas');
  };

  const sendMessageToAll = () => {
    let count = 0;
    windows.forEach(win => {
      if (win.windowRef && !win.windowRef.closed) {
        win.windowRef.postMessage('Mensaje broadcast desde ventana principal', '*');
        count++;
      }
    });
    addToLog(`Mensaje enviado a ${count} ventanas`);
  };

  // Listen for messages from child windows
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      addToLog(`Mensaje recibido: "${event.data}"`);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Instructions */}
      <Card className="p-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-3">
          🪟 Manejo de Ventanas y Pestañas
        </h3>
        <div className="text-purple-800 dark:text-purple-200 space-y-2 text-sm">
          <p><strong>Para Testers:</strong> Practica el manejo de múltiples ventanas, popups y pestañas del navegador.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold">Tipos de Ventanas:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Ventana:</strong> Con barras de herramientas</li>
                <li><strong>Popup:</strong> Sin barras, tamaño fijo</li>
                <li><strong>Pestaña:</strong> Nueva pestaña del navegador</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Funcionalidades:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Comunicación entre ventanas</li>
                <li>Cambio de foco</li>
                <li>Detección de bloqueo de popups</li>
                <li>Monitoreo de estado</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Controles de Ventanas</h4>

          {popupBlocked && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 rounded text-yellow-800 dark:text-yellow-200 text-sm">
              ⚠️ Los popups están bloqueados. Permite popups en este sitio para continuar.
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={createSimpleWindow}
              className="w-full justify-start"
              data-testid="create-simple-window"
            >
              🪟 Crear Ventana Simple
            </Button>
            
            <Button
              onClick={createPopupWindow}
              className="w-full justify-start"
              variant="secondary"
              data-testid="create-popup-window"
            >
              🔥 Crear Popup
            </Button>
            
            <Button
              onClick={openNewTab}
              className="w-full justify-start"
              variant="secondary"
              data-testid="create-new-tab"
            >
              🔗 Abrir Nueva Pestaña
            </Button>
            
            <Button
              onClick={createMultipleWindows}
              className="w-full justify-start"
              data-testid="create-multiple-windows"
            >
              🚀 Crear Múltiples Ventanas
            </Button>

            <div className="border-t pt-3 mt-4">
              <Button
                onClick={sendMessageToAll}
                className="w-full justify-start mb-2"
                variant="secondary"
                disabled={windows.filter(w => w.status === 'open').length === 0}
                data-testid="send-message-all"
              >
                📢 Mensaje a Todas
              </Button>
              
              <Button
                onClick={closeAllWindows}
                className="w-full justify-start"
                variant="danger"
                disabled={windows.filter(w => w.status === 'open').length === 0}
                data-testid="close-all-windows"
              >
                ❌ Cerrar Todas
              </Button>
            </div>
          </div>
        </Card>

        {/* Window List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Ventanas Activas</h4>
            <span className="text-sm text-gray-500" data-testid="windows-count">
              {windows.filter(w => w.status === 'open').length} abiertas
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto" data-testid="windows-list">
            {windows.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <div className="text-4xl mb-2">🪟</div>
                <p>No hay ventanas abiertas</p>
              </div>
            ) : (
              windows.map((win) => (
                <div
                  key={win.id}
                  className={`p-3 border rounded transition-colors ${
                    activeWindow === win.id
                      ? 'border-lime-400 bg-lime-50 dark:bg-lime-900/20'
                      : win.status === 'open'
                      ? 'border-gray-300 hover:bg-gray-50'
                      : 'border-red-300 bg-red-50 dark:bg-red-900/20 opacity-75'
                  }`}
                  data-testid={`window-item-${win.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>
                        {win.type === 'window' ? '🪟' : 
                         win.type === 'popup' ? '🔥' : '🔗'}
                      </span>
                      <span className="font-medium text-sm">{win.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      win.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {win.status === 'open' ? '✅ Abierta' : '❌ Cerrada'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    Abierta: {win.openedAt.toLocaleTimeString()}
                  </div>
                  
                  {win.status === 'open' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => focusWindow(win.id)}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        data-testid={`focus-window-${win.id}`}
                      >
                        👁️ Foco
                      </button>
                      <button
                        onClick={() => closeWindow(win.id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        data-testid={`close-window-${win.id}`}
                      >
                        ❌ Cerrar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Communication Log */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Log de Comunicación</h4>
            <Button
              onClick={() => setCommunicationLog([])}
              variant="secondary"
              className="text-xs py-1 px-2"
              data-testid="clear-log"
            >
              🗑️ Limpiar
            </Button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto text-sm" data-testid="communication-log">
            {communicationLog.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <div className="text-2xl mb-2">📝</div>
                <p>Sin actividad</p>
              </div>
            ) : (
              communicationLog.map((entry, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
                  data-testid={`log-entry-${index}`}
                >
                  {entry}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Testing Tips */}
      <Card className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
        <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
          💡 Consejos para Testing de Ventanas
        </h4>
        <div className="text-indigo-800 dark:text-indigo-200 space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-2">Selenium WebDriver:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><code>driver.window_handles</code> - Lista de ventanas</li>
                <li><code>driver.switch_to.window(handle)</code> - Cambiar ventana</li>
                <li><code>driver.current_window_handle</code> - Ventana actual</li>
                <li><code>driver.close()</code> - Cerrar ventana actual</li>
                <li><code>driver.quit()</code> - Cerrar todas las ventanas</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Cypress:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><code>cy.window()</code> - Obtener objeto window</li>
                <li><code>cy.visit()</code> en nueva ventana</li>
                <li>Manejo con <code>cy.origin()</code> para cross-origin</li>
                <li>Interceptar <code>window.open()</code> con stubs</li>
                <li>Verificar comunicación entre ventanas</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
