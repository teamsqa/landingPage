'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '@/app/ui';

interface IframeInfo {
  id: string;
  name: string;
  src: string;
  loaded: boolean;
  error: boolean;
}

export default function IframeTestingSection() {
  const [iframes, setIframes] = useState<IframeInfo[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [activeIframe, setActiveIframe] = useState<string | null>(null);
  
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});

  const addToLog = (message: string) => {
    setMessageLog(prev => [
      `${new Date().toLocaleTimeString()} - ${message}`,
      ...prev.slice(0, 19)
    ]);
  };

  const generateIframeId = () => Math.random().toString(36).substr(2, 9);

  const createSimpleIframe = () => {
    const id = generateIframeId();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Iframe Simple - ${id}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            color: white;
            margin: 0;
          }
          .container { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; }
          button { 
            background: #fff; 
            color: #FF6B6B; 
            border: none; 
            padding: 10px 20px; 
            margin: 8px; 
            border-radius: 5px; 
            cursor: pointer;
            font-weight: bold;
          }
          button:hover { background: #f0f0f0; }
          input { padding: 8px; margin: 8px; border: none; border-radius: 3px; }
          select { padding: 8px; margin: 8px; border: none; border-radius: 3px; }
          .form-group { margin: 15px 0; }
          .result { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🖼️ Iframe Simple (ID: ${id})</h2>
          <p>Este iframe contiene elementos interactivos para pruebas.</p>
          
          <div class="form-group">
            <h4>Formulario dentro del iframe:</h4>
            <input type="text" id="iframeInput" placeholder="Escribe algo aquí..." data-testid="iframe-input">
            <button onclick="processInput()" data-testid="iframe-process-btn">📝 Procesar</button>
          </div>

          <div class="form-group">
            <select id="iframeSelect" data-testid="iframe-select">
              <option value="">Selecciona una opción</option>
              <option value="option1">Opción 1</option>
              <option value="option2">Opción 2</option>
              <option value="option3">Opción 3</option>
            </select>
            <button onclick="processSelect()" data-testid="iframe-select-btn">📋 Procesar Selección</button>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="iframeCheckbox" data-testid="iframe-checkbox"> 
              Acepto los términos del iframe
            </label>
            <br>
            <button onclick="processCheckbox()" data-testid="iframe-checkbox-btn">✅ Verificar Checkbox</button>
          </div>

          <div class="form-group">
            <button onclick="sendMessage()" data-testid="iframe-message-btn">💬 Enviar Mensaje al Parent</button>
            <button onclick="showAlert()" data-testid="iframe-alert-btn">🚨 Mostrar Alerta</button>
            <button onclick="changeBackground()" data-testid="iframe-bg-btn">🎨 Cambiar Color</button>
          </div>

          <div class="result" id="result" data-testid="iframe-result">
            <strong>Resultado:</strong> Sin acciones realizadas
          </div>
        </div>

        <script>
          function processInput() {
            const input = document.getElementById('iframeInput');
            const result = document.getElementById('result');
            result.innerHTML = '<strong>Resultado:</strong> Input procesado: "' + input.value + '"';
            input.value = '';
          }

          function processSelect() {
            const select = document.getElementById('iframeSelect');
            const result = document.getElementById('result');
            result.innerHTML = '<strong>Resultado:</strong> Selección: "' + select.value + '"';
          }

          function processCheckbox() {
            const checkbox = document.getElementById('iframeCheckbox');
            const result = document.getElementById('result');
            result.innerHTML = '<strong>Resultado:</strong> Checkbox está ' + (checkbox.checked ? 'marcado' : 'desmarcado');
          }

          function sendMessage() {
            window.parent.postMessage('Mensaje desde iframe ${id}', '*');
            const result = document.getElementById('result');
            result.innerHTML = '<strong>Resultado:</strong> Mensaje enviado al parent';
          }

          function showAlert() {
            alert('¡Alerta desde dentro del iframe ${id}!');
            const result = document.getElementById('result');
            result.innerHTML = '<strong>Resultado:</strong> Alerta mostrada';
          }

          function changeBackground() {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.style.background = 'linear-gradient(45deg, ' + randomColor + ', ' + colors[Math.floor(Math.random() * colors.length)] + ')';
            const result = document.getElementById('result');
            result.innerHTML = '<strong>Resultado:</strong> Fondo cambiado a ' + randomColor;
          }

          // Auto-update timestamp
          setInterval(() => {
            document.title = 'Iframe Simple - ${id} - ' + new Date().toLocaleTimeString();
          }, 1000);
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const src = URL.createObjectURL(blob);

    const newIframe: IframeInfo = {
      id,
      name: `Iframe Simple ${id}`,
      src,
      loaded: false,
      error: false
    };

    setIframes(prev => [...prev, newIframe]);
    setActiveIframe(id);
    addToLog(`Iframe simple creado: ${id}`);
  };

  const createFormIframe = () => {
    const id = generateIframeId();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Iframe Formulario - ${id}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
          }
          .form-container { background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; }
          .form-group { margin: 15px 0; }
          label { display: block; margin-bottom: 5px; font-weight: bold; }
          input, select, textarea { 
            width: 100%; 
            padding: 10px; 
            border: none; 
            border-radius: 5px; 
            box-sizing: border-box;
            font-size: 14px;
          }
          button { 
            background: #4CAF50; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            margin: 10px 5px; 
            border-radius: 5px; 
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
          }
          button:hover { background: #45a049; }
          .submit-btn { background: #FF6B35; }
          .submit-btn:hover { background: #E55A31; }
          .reset-btn { background: #6c757d; }
          .reset-btn:hover { background: #5a6268; }
          .validation-error { color: #ff4757; font-size: 12px; margin-top: 5px; }
          .success { color: #2ed573; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="form-container">
          <h2>📋 Formulario Iframe (ID: ${id})</h2>
          <form id="iframeForm" onsubmit="return submitForm(event)">
            
            <div class="form-group">
              <label for="name">Nombre Completo *</label>
              <input type="text" id="name" name="name" data-testid="iframe-form-name" required>
              <div class="validation-error" id="nameError"></div>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" name="email" data-testid="iframe-form-email" required>
              <div class="validation-error" id="emailError"></div>
            </div>

            <div class="form-group">
              <label for="age">Edad</label>
              <input type="number" id="age" name="age" min="18" max="100" data-testid="iframe-form-age">
              <div class="validation-error" id="ageError"></div>
            </div>

            <div class="form-group">
              <label for="country">País</label>
              <select id="country" name="country" data-testid="iframe-form-country">
                <option value="">Selecciona un país</option>
                <option value="es">España</option>
                <option value="mx">México</option>
                <option value="ar">Argentina</option>
                <option value="co">Colombia</option>
                <option value="pe">Perú</option>
                <option value="cl">Chile</option>
              </select>
            </div>

            <div class="form-group">
              <label for="interests">Intereses</label>
              <div>
                <label><input type="checkbox" name="interests" value="tech" data-testid="interest-tech"> Tecnología</label>
                <label><input type="checkbox" name="interests" value="sports" data-testid="interest-sports"> Deportes</label>
                <label><input type="checkbox" name="interests" value="music" data-testid="interest-music"> Música</label>
                <label><input type="checkbox" name="interests" value="travel" data-testid="interest-travel"> Viajes</label>
              </div>
            </div>

            <div class="form-group">
              <label for="comments">Comentarios</label>
              <textarea id="comments" name="comments" rows="4" placeholder="Cuéntanos algo sobre ti..." data-testid="iframe-form-comments"></textarea>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" id="terms" name="terms" data-testid="iframe-form-terms" required> 
                Acepto los términos y condiciones *
              </label>
              <div class="validation-error" id="termsError"></div>
            </div>

            <div class="form-group">
              <button type="submit" class="submit-btn" data-testid="iframe-form-submit">🚀 Enviar Formulario</button>
              <button type="reset" class="reset-btn" data-testid="iframe-form-reset">🔄 Limpiar</button>
              <button type="button" onclick="validateForm()" data-testid="iframe-form-validate">✅ Validar</button>
            </div>

            <div id="formResult" data-testid="iframe-form-result"></div>
          </form>
        </div>

        <script>
          function clearErrors() {
            document.querySelectorAll('.validation-error').forEach(el => el.textContent = '');
          }

          function validateForm() {
            clearErrors();
            let isValid = true;
            
            const name = document.getElementById('name').value;
            if (!name || name.length < 2) {
              document.getElementById('nameError').textContent = 'El nombre debe tener al menos 2 caracteres';
              isValid = false;
            }

            const email = document.getElementById('email').value;
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!email || !emailRegex.test(email)) {
              document.getElementById('emailError').textContent = 'Email inválido';
              isValid = false;
            }

            const age = document.getElementById('age').value;
            if (age && (age < 18 || age > 100)) {
              document.getElementById('ageError').textContent = 'La edad debe estar entre 18 y 100 años';
              isValid = false;
            }

            const terms = document.getElementById('terms').checked;
            if (!terms) {
              document.getElementById('termsError').textContent = 'Debes aceptar los términos y condiciones';
              isValid = false;
            }

            const result = document.getElementById('formResult');
            result.innerHTML = isValid ? 
              '<div class="success">✅ Formulario válido</div>' : 
              '<div class="validation-error">❌ Formulario contiene errores</div>';
            
            return isValid;
          }

          function submitForm(event) {
            event.preventDefault();
            
            if (!validateForm()) {
              return false;
            }

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData);
            
            // Get interests as array
            const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(el => el.value);
            data.interests = interests;

            const result = document.getElementById('formResult');
            result.innerHTML = '<div class="success">🎉 Formulario enviado correctamente!<br>Datos: ' + JSON.stringify(data, null, 2) + '</div>';
            
            // Send message to parent
            window.parent.postMessage('Formulario enviado desde iframe ${id}: ' + JSON.stringify(data), '*');
            
            return false;
          }

          document.getElementById('iframeForm').addEventListener('reset', function() {
            setTimeout(() => {
              clearErrors();
              document.getElementById('formResult').innerHTML = '';
            }, 10);
          });
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const src = URL.createObjectURL(blob);

    const newIframe: IframeInfo = {
      id,
      name: `Formulario ${id}`,
      src,
      loaded: false,
      error: false
    };

    setIframes(prev => [...prev, newIframe]);
    setActiveIframe(id);
    addToLog(`Iframe con formulario creado: ${id}`);
  };

  const createNestedIframes = () => {
    const id = generateIframeId();
    const nestedId = generateIframeId();
    
    const nestedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Iframe Anidado - ${nestedId}</title>
        <style>
          body { 
            padding: 15px; 
            background: #e74c3c; 
            color: white; 
            font-family: Arial, sans-serif;
            text-align: center;
          }
          button { 
            background: white; 
            color: #e74c3c; 
            border: none; 
            padding: 8px 16px; 
            margin: 5px; 
            border-radius: 5px; 
            cursor: pointer;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h4>🎯 Iframe Anidado (${nestedId})</h4>
        <p>Este es un iframe dentro de otro iframe</p>
        <button onclick="alert('Alerta desde iframe anidado!')" data-testid="nested-alert">🚨 Alerta Anidada</button>
        <button onclick="window.parent.parent.postMessage('Mensaje desde iframe anidado ${nestedId}', '*')" data-testid="nested-message">
          💬 Mensaje al Abuelo
        </button>
        <input type="text" placeholder="Input anidado" data-testid="nested-input" style="margin: 10px; padding: 5px; border: none; border-radius: 3px;">
      </body>
      </html>
    `;

    const parentHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Iframe Padre - ${id}</title>
        <style>
          body { 
            padding: 20px; 
            background: linear-gradient(45deg, #3498db, #2980b9); 
            color: white; 
            font-family: Arial, sans-serif;
          }
          .container { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; }
          button { 
            background: white; 
            color: #3498db; 
            border: none; 
            padding: 10px 20px; 
            margin: 10px; 
            border-radius: 5px; 
            cursor: pointer;
            font-weight: bold;
          }
          iframe { border: 2px solid white; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h3>🔗 Iframe Padre (${id})</h3>
          <p>Este iframe contiene otro iframe anidado:</p>
          <button onclick="alert('Alerta desde iframe padre!')" data-testid="parent-alert">🚨 Alerta Padre</button>
          <button onclick="window.parent.postMessage('Mensaje desde iframe padre ${id}', '*')" data-testid="parent-message">
            💬 Mensaje al Parent
          </button>
          <br>
          <iframe src="data:text/html;base64,${btoa(nestedHtml)}" width="100%" height="200" data-testid="nested-iframe"></iframe>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([parentHtml], { type: 'text/html' });
    const src = URL.createObjectURL(blob);

    const newIframe: IframeInfo = {
      id,
      name: `Iframes Anidados ${id}`,
      src,
      loaded: false,
      error: false
    };

    setIframes(prev => [...prev, newIframe]);
    setActiveIframe(id);
    addToLog(`Iframes anidados creados: ${id} (contiene ${nestedId})`);
  };

  const createExternalIframe = () => {
    const id = generateIframeId();
    const url = customUrl || 'https://example.com';

    const newIframe: IframeInfo = {
      id,
      name: `External ${id}`,
      src: url,
      loaded: false,
      error: false
    };

    setIframes(prev => [...prev, newIframe]);
    setActiveIframe(id);
    addToLog(`Iframe externo creado: ${id} (${url})`);
  };

  const removeIframe = (id: string) => {
    const iframe = iframes.find(i => i.id === id);
    if (iframe && iframe.src.startsWith('blob:')) {
      URL.revokeObjectURL(iframe.src);
    }
    
    setIframes(prev => prev.filter(i => i.id !== id));
    delete iframeRefs.current[id];
    
    if (activeIframe === id) {
      setActiveIframe(null);
    }
    
    addToLog(`Iframe eliminado: ${id}`);
  };

  const removeAllIframes = () => {
    iframes.forEach(iframe => {
      if (iframe.src.startsWith('blob:')) {
        URL.revokeObjectURL(iframe.src);
      }
    });
    
    setIframes([]);
    iframeRefs.current = {};
    setActiveIframe(null);
    addToLog('Todos los iframes eliminados');
  };

  const handleIframeLoad = (id: string) => {
    setIframes(prev => prev.map(iframe =>
      iframe.id === id ? { ...iframe, loaded: true, error: false } : iframe
    ));
    addToLog(`Iframe cargado: ${id}`);
  };

  const handleIframeError = (id: string) => {
    setIframes(prev => prev.map(iframe =>
      iframe.id === id ? { ...iframe, loaded: false, error: true } : iframe
    ));
    addToLog(`Error cargando iframe: ${id}`);
  };

  // Listen for messages from iframes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      addToLog(`Mensaje recibido: "${event.data}"`);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Instructions */}
      <Card className="p-6 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
        <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-3">
          🖼️ Testing con iFrames
        </h3>
        <div className="text-orange-800 dark:text-orange-200 space-y-2 text-sm">
          <p><strong>Para Testers:</strong> Los iframes presentan desafíos únicos en automatización. Practica aquí diferentes escenarios.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold">Tipos de iFrames:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Simple:</strong> Contenido básico con elementos interactivos</li>
                <li><strong>Formulario:</strong> Formularios complejos dentro del iframe</li>
                <li><strong>Anidados:</strong> iframes dentro de otros iframes</li>
                <li><strong>Externos:</strong> Contenido de otros dominios</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Desafíos:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Cambio de contexto entre iframes</li>
                <li>Comunicación entre frames</li>
                <li>Elementos no accesibles directamente</li>
                <li>Políticas de seguridad cross-origin</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Controls */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Crear iFrames</h4>

          <div className="space-y-3 mb-6">
            <Button
              onClick={createSimpleIframe}
              className="w-full justify-start"
              data-testid="create-simple-iframe"
            >
              🖼️ Iframe Simple
            </Button>
            
            <Button
              onClick={createFormIframe}
              className="w-full justify-start"
              variant="secondary"
              data-testid="create-form-iframe"
            >
              📋 Iframe con Formulario
            </Button>
            
            <Button
              onClick={createNestedIframes}
              className="w-full justify-start"
              variant="secondary"
              data-testid="create-nested-iframes"
            >
              🔗 iFrames Anidados
            </Button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">URL Externa (opcional)</label>
            <Input
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com"
              className="mb-2"
              data-testid="external-url-input"
            />
            <Button
              onClick={createExternalIframe}
              className="w-full justify-start"
              variant="secondary"
              data-testid="create-external-iframe"
            >
              🌐 Iframe Externo
            </Button>
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={removeAllIframes}
              className="w-full justify-start"
              variant="danger"
              disabled={iframes.length === 0}
              data-testid="remove-all-iframes"
            >
              🗑️ Eliminar Todos
            </Button>
          </div>
        </Card>

        {/* Iframe List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">iFrames Activos</h4>
            <span className="text-sm text-gray-500" data-testid="iframes-count">
              {iframes.length} activos
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto" data-testid="iframes-list">
            {iframes.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <div className="text-4xl mb-2">🖼️</div>
                <p>Sin iframes</p>
              </div>
            ) : (
              iframes.map((iframe) => (
                <div
                  key={iframe.id}
                  className={`p-3 border rounded transition-colors cursor-pointer ${
                    activeIframe === iframe.id
                      ? 'border-lime-400 bg-lime-50 dark:bg-lime-900/20'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveIframe(iframe.id)}
                  data-testid={`iframe-item-${iframe.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{iframe.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        iframe.error ? 'bg-red-100 text-red-800' :
                        iframe.loaded ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {iframe.error ? '❌ Error' : iframe.loaded ? '✅ Cargado' : '⏳ Cargando'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeIframe(iframe.id);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                        data-testid={`remove-iframe-${iframe.id}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 truncate">
                    {iframe.src.startsWith('blob:') ? 'Contenido interno' : iframe.src}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Message Log */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Log de Mensajes</h4>
            <Button
              onClick={() => setMessageLog([])}
              variant="secondary"
              className="text-xs py-1 px-2"
              data-testid="clear-message-log"
            >
              🗑️ Limpiar
            </Button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto text-sm" data-testid="message-log">
            {messageLog.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <div className="text-2xl mb-2">📝</div>
                <p>Sin mensajes</p>
              </div>
            ) : (
              messageLog.map((entry, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
                  data-testid={`message-entry-${index}`}
                >
                  {entry}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Active Iframe Display */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Vista Activa</h4>
          
          {activeIframe ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Iframe: {iframes.find(i => i.id === activeIframe)?.name}
              </div>
              <div className="border-2 border-gray-300 rounded overflow-hidden" style={{ height: '400px' }}>
                <iframe
                  ref={el => iframeRefs.current[activeIframe] = el}
                  src={iframes.find(i => i.id === activeIframe)?.src}
                  width="100%"
                  height="100%"
                  onLoad={() => handleIframeLoad(activeIframe)}
                  onError={() => handleIframeError(activeIframe)}
                  data-testid={`active-iframe-${activeIframe}`}
                  title={`Iframe ${activeIframe}`}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🖼️</div>
              <p>Selecciona un iframe para visualizarlo</p>
              <p className="text-sm mt-2">O crea uno nuevo usando los controles</p>
            </div>
          )}
        </Card>
      </div>

      {/* Testing Tips */}
      <Card className="p-6 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
        <h4 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100 mb-3">
          💡 Consejos para Testing de iFrames
        </h4>
        <div className="text-cyan-800 dark:text-cyan-200 space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-2">Selenium WebDriver:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><code>driver.switch_to.frame(iframe)</code> - Cambiar al iframe</li>
                <li><code>driver.switch_to.default_content()</code> - Volver al contenido principal</li>
                <li><code>driver.switch_to.parent_frame()</code> - Volver al frame padre</li>
                <li><code>WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it(locator))</code></li>
                <li>Usar índice, nombre o elemento WebElement para identificar</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Cypress:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><code>cy.get(&apos;iframe&apos;).then($iframe =&gt; &#123; ... &#125;)</code></li>
                <li><code>cy.iframe()</code> con plugin cypress-iframe</li>
                <li><code>cy.enter(&apos;iframe&apos;).then(getBody =&gt; &#123; ... &#125;)</code></li>
                <li>Manejo de contenido cross-origin con cy.origin()</li>
                <li>Verificar carga con <code>cy.get(&apos;iframe&apos;).should(&apos;be.visible&apos;)</code></li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
