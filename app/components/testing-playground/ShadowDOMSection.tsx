'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '@/app/ui';

interface ShadowComponent {
  id: string;
  name: string;
  type: 'simple' | 'form' | 'nested' | 'complex';
  created: Date;
}

export default function ShadowDOMSection() {
  const [shadowComponents, setShadowComponents] = useState<ShadowComponent[]>([]);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [activeShadow, setActiveShadow] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRefs = useRef<{ [key: string]: HTMLElement }>({});

  const addToLog = (message: string) => {
    setMessageLog(prev => [
      `${new Date().toLocaleTimeString()} - ${message}`,
      ...prev.slice(0, 19)
    ]);
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createSimpleShadowDOM = () => {
    const id = generateId();
    const container = document.createElement('div');
    container.id = `shadow-container-${id}`;
    container.setAttribute('data-testid', `shadow-container-${id}`);
    container.style.cssText = `
      margin: 20px;
      padding: 20px;
      border: 3px solid #3498db;
      border-radius: 10px;
      background: linear-gradient(45deg, #3498db, #2980b9);
      color: white;
      font-family: Arial, sans-serif;
    `;

    const shadow = container.attachShadow({ mode: 'open' });
    
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }
        .shadow-content {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        .shadow-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          text-align: center;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        button {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 10px 20px;
          margin: 8px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        button:hover {
          background: #c0392b;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        input {
          padding: 8px 12px;
          margin: 8px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
        }
        .result {
          margin-top: 15px;
          padding: 10px;
          background: rgba(0,0,0,0.3);
          border-radius: 5px;
          font-size: 14px;
        }
        .badge {
          display: inline-block;
          background: #f39c12;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
        }
      </style>
      <div class="shadow-content">
        <div class="shadow-title">
          🌟 Componente Shadow DOM Simple
          <span class="badge">ID: ${id}</span>
        </div>
        <p>Este contenido está dentro del Shadow DOM y no es directamente accesible desde el DOM principal.</p>
        
        <div>
          <input type="text" id="shadowInput" placeholder="Escribe algo..." data-testid="shadow-input-${id}">
          <button id="processBtn" data-testid="shadow-process-btn-${id}">📝 Procesar</button>
        </div>
        
        <div>
          <button id="alertBtn" data-testid="shadow-alert-btn-${id}">🚨 Mostrar Alerta</button>
          <button id="messageBtn" data-testid="shadow-message-btn-${id}">💬 Enviar Mensaje</button>
          <button id="toggleBtn" data-testid="shadow-toggle-btn-${id}">🎨 Cambiar Color</button>
        </div>
        
        <div class="result" id="result" data-testid="shadow-result-${id}">
          <strong>Estado:</strong> Listo para interacciones
        </div>
      </div>
    `;

    // Add event listeners
    const input = shadow.getElementById('shadowInput') as HTMLInputElement;
    const processBtn = shadow.getElementById('processBtn');
    const alertBtn = shadow.getElementById('alertBtn');
    const messageBtn = shadow.getElementById('messageBtn');
    const toggleBtn = shadow.getElementById('toggleBtn');
    const result = shadow.getElementById('result');

    processBtn?.addEventListener('click', () => {
      const value = input?.value || '';
      if (result) {
        result.innerHTML = `<strong>Procesado:</strong> "${value}"`;
      }
      if (input) input.value = '';
      
      // Dispatch custom event
      container.dispatchEvent(new CustomEvent('shadowProcessed', {
        detail: { id, value, timestamp: new Date() }
      }));
    });

    alertBtn?.addEventListener('click', () => {
      alert(`Alerta desde Shadow DOM ${id}!`);
      if (result) {
        result.innerHTML = `<strong>Acción:</strong> Alerta mostrada`;
      }
    });

    messageBtn?.addEventListener('click', () => {
      const event = new CustomEvent('shadowMessage', {
        detail: { id, message: `Mensaje desde Shadow DOM ${id}`, timestamp: new Date() }
      });
      container.dispatchEvent(event);
      if (result) {
        result.innerHTML = `<strong>Acción:</strong> Mensaje enviado`;
      }
    });

    let colorToggle = false;
    toggleBtn?.addEventListener('click', () => {
      colorToggle = !colorToggle;
      const colors = colorToggle 
        ? { primary: '#e74c3c', secondary: '#c0392b' }
        : { primary: '#27ae60', secondary: '#229954' };
      
      container.style.background = `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`;
      container.style.borderColor = colors.primary;
      
      if (result) {
        result.innerHTML = `<strong>Acción:</strong> Color cambiado a ${colorToggle ? 'rojo' : 'verde'}`;
      }
    });

    if (containerRef.current) {
      containerRef.current.appendChild(container);
    }

    shadowRefs.current[id] = container;

    const component: ShadowComponent = {
      id,
      name: `Shadow Simple ${id}`,
      type: 'simple',
      created: new Date()
    };

    setShadowComponents(prev => [...prev, component]);
    setActiveShadow(id);
    addToLog(`Shadow DOM simple creado: ${id}`);
  };

  const createShadowForm = () => {
    const id = generateId();
    const container = document.createElement('div');
    container.id = `shadow-form-${id}`;
    container.setAttribute('data-testid', `shadow-form-container-${id}`);
    container.style.cssText = `
      margin: 20px;
      padding: 25px;
      border: 3px solid #8e44ad;
      border-radius: 15px;
      background: linear-gradient(135deg, #8e44ad, #9b59b6);
      color: white;
      font-family: Arial, sans-serif;
    `;

    const shadow = container.attachShadow({ mode: 'open' });
    
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .form-container {
          background: rgba(255, 255, 255, 0.1);
          padding: 25px;
          border-radius: 12px;
          backdrop-filter: blur(15px);
        }
        .form-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          font-size: 14px;
        }
        input, select, textarea {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }
        input:focus, select:focus, textarea:focus {
          outline: 2px solid #f39c12;
          box-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
        }
        button {
          background: #e67e22;
          color: white;
          border: none;
          padding: 12px 24px;
          margin: 10px 5px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        button:hover {
          background: #d35400;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        button.submit {
          background: #27ae60;
        }
        button.submit:hover {
          background: #229954;
        }
        button.reset {
          background: #95a5a6;
        }
        button.reset:hover {
          background: #7f8c8d;
        }
        .validation-error {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 5px;
        }
        .success-message {
          color: #2ecc71;
          background: rgba(46, 204, 113, 0.2);
          padding: 10px;
          border-radius: 5px;
          margin-top: 15px;
        }
        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 5px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      </style>
      <div class="form-container">
        <div class="form-title">📋 Formulario Shadow DOM (${id})</div>
        
        <form id="shadowForm">
          <div class="form-group">
            <label for="name">Nombre Completo *</label>
            <input type="text" id="name" name="name" required data-testid="shadow-form-name-${id}">
            <div class="validation-error" id="nameError"></div>
          </div>

          <div class="form-group">
            <label for="email">Correo Electrónico *</label>
            <input type="email" id="email" name="email" required data-testid="shadow-form-email-${id}">
            <div class="validation-error" id="emailError"></div>
          </div>

          <div class="form-group">
            <label for="age">Edad</label>
            <input type="number" id="age" name="age" min="18" max="100" data-testid="shadow-form-age-${id}">
          </div>

          <div class="form-group">
            <label for="country">País</label>
            <select id="country" name="country" data-testid="shadow-form-country-${id}">
              <option value="">Selecciona un país</option>
              <option value="es">España</option>
              <option value="mx">México</option>
              <option value="ar">Argentina</option>
              <option value="co">Colombia</option>
              <option value="pe">Perú</option>
            </select>
          </div>

          <div class="form-group">
            <label>Intereses</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" name="interests" value="tech" id="tech" data-testid="shadow-interest-tech-${id}">
                <label for="tech">Tecnología</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" name="interests" value="sports" id="sports" data-testid="shadow-interest-sports-${id}">
                <label for="sports">Deportes</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" name="interests" value="music" id="music" data-testid="shadow-interest-music-${id}">
                <label for="music">Música</label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="comments">Comentarios</label>
            <textarea id="comments" name="comments" rows="3" placeholder="Cuéntanos algo sobre ti..." data-testid="shadow-form-comments-${id}"></textarea>
          </div>

          <div class="form-group">
            <div class="checkbox-item">
              <input type="checkbox" id="terms" name="terms" required data-testid="shadow-form-terms-${id}">
              <label for="terms">Acepto los términos y condiciones *</label>
            </div>
            <div class="validation-error" id="termsError"></div>
          </div>

          <div class="form-group">
            <button type="submit" class="submit" data-testid="shadow-form-submit-${id}">🚀 Enviar</button>
            <button type="reset" class="reset" data-testid="shadow-form-reset-${id}">🔄 Limpiar</button>
            <button type="button" id="validateBtn" data-testid="shadow-form-validate-${id}">✅ Validar</button>
          </div>

          <div id="formResult" data-testid="shadow-form-result-${id}"></div>
        </form>
      </div>
    `;

    // Add form logic
    const form = shadow.getElementById('shadowForm') as HTMLFormElement;
    const validateBtn = shadow.getElementById('validateBtn');
    const formResult = shadow.getElementById('formResult');

    const clearErrors = () => {
      shadow.querySelectorAll('.validation-error').forEach(el => el.textContent = '');
    };

    const validateForm = () => {
      clearErrors();
      let isValid = true;

      const name = (shadow.getElementById('name') as HTMLInputElement)?.value;
      if (!name || name.length < 2) {
        const nameError = shadow.getElementById('nameError');
        if (nameError) nameError.textContent = 'El nombre debe tener al menos 2 caracteres';
        isValid = false;
      }

      const email = (shadow.getElementById('email') as HTMLInputElement)?.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        const emailError = shadow.getElementById('emailError');
        if (emailError) emailError.textContent = 'Email inválido';
        isValid = false;
      }

      const terms = (shadow.getElementById('terms') as HTMLInputElement)?.checked;
      if (!terms) {
        const termsError = shadow.getElementById('termsError');
        if (termsError) termsError.textContent = 'Debes aceptar los términos';
        isValid = false;
      }

      if (formResult) {
        formResult.innerHTML = isValid 
          ? '<div class="success-message">✅ Formulario válido</div>'
          : '<div class="validation-error">❌ Formulario contiene errores</div>';
      }

      return isValid;
    };

    validateBtn?.addEventListener('click', validateForm);

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;

      const formData = new FormData(form);
      const data: any = Object.fromEntries(formData);
      
      // Get interests
      const interests = Array.from(shadow.querySelectorAll('input[name="interests"]:checked'))
        .map((el: any) => el.value);
      data.interests = interests;

      if (formResult) {
        formResult.innerHTML = `<div class="success-message">🎉 Formulario enviado!<br>Datos: ${JSON.stringify(data, null, 2)}</div>`;
      }

      // Dispatch event
      container.dispatchEvent(new CustomEvent('shadowFormSubmitted', {
        detail: { id, data, timestamp: new Date() }
      }));
    });

    form?.addEventListener('reset', () => {
      setTimeout(() => {
        clearErrors();
        if (formResult) formResult.innerHTML = '';
      }, 10);
    });

    if (containerRef.current) {
      containerRef.current.appendChild(container);
    }

    shadowRefs.current[id] = container;

    const component: ShadowComponent = {
      id,
      name: `Shadow Form ${id}`,
      type: 'form',
      created: new Date()
    };

    setShadowComponents(prev => [...prev, component]);
    setActiveShadow(id);
    addToLog(`Shadow DOM con formulario creado: ${id}`);
  };

  const createNestedShadowDOM = () => {
    const id = generateId();
    const parentContainer = document.createElement('div');
    parentContainer.id = `nested-shadow-${id}`;
    parentContainer.setAttribute('data-testid', `nested-shadow-container-${id}`);
    parentContainer.style.cssText = `
      margin: 20px;
      padding: 25px;
      border: 3px solid #e67e22;
      border-radius: 15px;
      background: linear-gradient(135deg, #e67e22, #f39c12);
      color: white;
      font-family: Arial, sans-serif;
    `;

    const parentShadow = parentContainer.attachShadow({ mode: 'open' });
    
    parentShadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .parent-content {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .parent-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          text-align: center;
        }
        button {
          background: #c0392b;
          color: white;
          border: none;
          padding: 8px 16px;
          margin: 5px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        button:hover {
          background: #a93226;
        }
        #childContainer {
          border: 2px dashed rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          padding: 15px;
          margin-top: 15px;
        }
      </style>
      <div class="parent-content">
        <div class="parent-title">🔗 Shadow DOM Padre (${id})</div>
        <p>Este es el Shadow DOM padre que contiene otro Shadow DOM anidado:</p>
        <button id="parentBtn" data-testid="nested-parent-btn-${id}">🚨 Acción Padre</button>
        <div id="childContainer"></div>
      </div>
    `;

    // Create nested shadow DOM
    const childContainer = parentShadow.getElementById('childContainer');
    if (childContainer) {
      const nestedElement = document.createElement('div');
      nestedElement.setAttribute('data-testid', `nested-child-element-${id}`);
      
      const childShadow = nestedElement.attachShadow({ mode: 'open' });
      
      childShadow.innerHTML = `
        <style>
          :host {
            display: block;
          }
          .child-content {
            background: rgba(231, 76, 60, 0.3);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
          }
          .child-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #fff;
          }
          button {
            background: #27ae60;
            color: white;
            border: none;
            padding: 6px 12px;
            margin: 3px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
          }
          button:hover {
            background: #229954;
          }
          input {
            padding: 6px;
            margin: 5px;
            border: none;
            border-radius: 3px;
            font-size: 12px;
          }
          .result {
            margin-top: 10px;
            padding: 8px;
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
            font-size: 12px;
          }
        </style>
        <div class="child-content">
          <div class="child-title">🎯 Shadow DOM Hijo</div>
          <p style="font-size: 12px;">Este Shadow DOM está anidado dentro del padre</p>
          <input type="text" id="childInput" placeholder="Input anidado" data-testid="nested-child-input-${id}">
          <button id="childBtn" data-testid="nested-child-btn-${id}">📝 Procesar</button>
          <div class="result" id="childResult" data-testid="nested-child-result-${id}">Listo</div>
        </div>
      `;

      // Add child event listeners
      const childInput = childShadow.getElementById('childInput') as HTMLInputElement;
      const childBtn = childShadow.getElementById('childBtn');
      const childResult = childShadow.getElementById('childResult');

      childBtn?.addEventListener('click', () => {
        const value = childInput?.value || '';
        if (childResult) {
          childResult.textContent = `Procesado: "${value}"`;
        }
        if (childInput) childInput.value = '';

        // Send event to parent element
        parentContainer.dispatchEvent(new CustomEvent('nestedChildAction', {
          detail: { id, value, timestamp: new Date(), source: 'child' }
        }));
      });

      childContainer.appendChild(nestedElement);
    }

    // Add parent event listeners
    const parentBtn = parentShadow.getElementById('parentBtn');
    parentBtn?.addEventListener('click', () => {
      alert(`Acción desde Shadow DOM padre ${id}!`);
      
      parentContainer.dispatchEvent(new CustomEvent('nestedParentAction', {
        detail: { id, timestamp: new Date(), source: 'parent' }
      }));
    });

    if (containerRef.current) {
      containerRef.current.appendChild(parentContainer);
    }

    shadowRefs.current[id] = parentContainer;

    const component: ShadowComponent = {
      id,
      name: `Shadow Anidado ${id}`,
      type: 'nested',
      created: new Date()
    };

    setShadowComponents(prev => [...prev, component]);
    setActiveShadow(id);
    addToLog(`Shadow DOM anidado creado: ${id}`);
  };

  const removeShadowComponent = (id: string) => {
    const element = shadowRefs.current[id];
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    
    delete shadowRefs.current[id];
    setShadowComponents(prev => prev.filter(c => c.id !== id));
    
    if (activeShadow === id) {
      setActiveShadow(null);
    }
    
    addToLog(`Componente Shadow DOM eliminado: ${id}`);
  };

  const removeAllShadowComponents = () => {
    Object.values(shadowRefs.current).forEach(element => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    shadowRefs.current = {};
    setShadowComponents([]);
    setActiveShadow(null);
    addToLog('Todos los componentes Shadow DOM eliminados');
  };

  // Listen for custom events from shadow components
  useEffect(() => {
    const handleShadowEvent = (event: any) => {
      const { type, detail } = event;
      addToLog(`Evento ${type}: ${JSON.stringify(detail)}`);
    };

    const events = ['shadowProcessed', 'shadowMessage', 'shadowFormSubmitted', 'nestedChildAction', 'nestedParentAction'];
    
    events.forEach(eventType => {
      document.addEventListener(eventType, handleShadowEvent);
    });

    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, handleShadowEvent);
      });
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Instructions */}
      <Card className="p-6 bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800">
        <h3 className="text-xl font-bold text-violet-900 dark:text-violet-100 mb-3">
          👥 Testing con Shadow DOM
        </h3>
        <div className="text-violet-800 dark:text-violet-200 space-y-2 text-sm">
          <p><strong>Para Testers:</strong> El Shadow DOM encapsula elementos CSS y JavaScript, creando desafíos únicos en automatización.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold">Características del Shadow DOM:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Encapsulación:</strong> CSS y JS aislados</li>
                <li><strong>No accesible:</strong> Selectores normales no funcionan</li>
                <li><strong>Modos:</strong> Open (accesible) vs Closed (privado)</li>
                <li><strong>Anidamiento:</strong> Shadow DOMs dentro de otros</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Desafíos para Testing:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Elementos no visibles con selectores CSS normales</li>
                <li>Necesidad de acceso programático al shadowRoot</li>
                <li>Eventos que no se propagan naturalmente</li>
                <li>Estilos encapsulados que afectan la apariencia</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Crear Shadow DOM</h4>

          <div className="space-y-3 mb-6">
            <Button
              onClick={createSimpleShadowDOM}
              className="w-full justify-start"
              data-testid="create-simple-shadow"
            >
              🌟 Shadow DOM Simple
            </Button>
            
            <Button
              onClick={createShadowForm}
              className="w-full justify-start"
              variant="secondary"
              data-testid="create-shadow-form"
            >
              📋 Shadow con Formulario
            </Button>
            
            <Button
              onClick={createNestedShadowDOM}
              className="w-full justify-start"
              variant="secondary"
              data-testid="create-nested-shadow"
            >
              🔗 Shadow DOM Anidado
            </Button>
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={removeAllShadowComponents}
              className="w-full justify-start"
              variant="danger"
              disabled={shadowComponents.length === 0}
              data-testid="remove-all-shadows"
            >
              🗑️ Eliminar Todos
            </Button>
          </div>
        </Card>

        {/* Component List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Componentes Activos</h4>
            <span className="text-sm text-gray-500" data-testid="shadows-count">
              {shadowComponents.length} activos
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto" data-testid="shadows-list">
            {shadowComponents.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <div className="text-4xl mb-2">👥</div>
                <p>Sin componentes Shadow DOM</p>
              </div>
            ) : (
              shadowComponents.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 border rounded transition-colors cursor-pointer ${
                    activeShadow === component.id
                      ? 'border-lime-400 bg-lime-50 dark:bg-lime-900/20'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveShadow(component.id)}
                  data-testid={`shadow-item-${component.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>
                        {component.type === 'simple' ? '🌟' : 
                         component.type === 'form' ? '📋' : 
                         component.type === 'nested' ? '🔗' : '⚙️'}
                      </span>
                      <span className="font-medium text-sm">{component.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeShadowComponent(component.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                      data-testid={`remove-shadow-${component.id}`}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Creado: {component.created.toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Event Log */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Log de Eventos</h4>
            <Button
              onClick={() => setMessageLog([])}
              variant="secondary"
              className="text-xs py-1 px-2"
              data-testid="clear-event-log"
            >
              🗑️ Limpiar
            </Button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto text-sm" data-testid="event-log">
            {messageLog.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <div className="text-2xl mb-2">📝</div>
                <p>Sin eventos</p>
              </div>
            ) : (
              messageLog.map((entry, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
                  data-testid={`event-entry-${index}`}
                >
                  {entry}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Shadow Components Display Area */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Área de Componentes Shadow DOM</h4>
        <div
          ref={containerRef}
          className="min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"
          data-testid="shadow-components-area"
        >
          {shadowComponents.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-lg">No hay componentes Shadow DOM</p>
              <p className="text-sm mt-2">Usa los controles de arriba para crear componentes</p>
            </div>
          )}
        </div>
      </Card>

      {/* Testing Tips */}
      <Card className="p-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
        <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
          💡 Consejos para Testing de Shadow DOM
        </h4>
        <div className="text-purple-800 dark:text-purple-200 space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-2">Selenium WebDriver:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><code>element.shadow_root</code> - Acceder al shadow root</li>
                <li><code>shadow_root.find_element()</code> - Buscar dentro del shadow</li>
                <li><code>driver.execute_script(&quot;return arguments[0].shadowRoot&quot;, element)</code></li>
                <li>Necesario para elementos con shadowRoot</li>
                <li>Solo funciona con mode=&quot;open&quot;</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">JavaScript/Cypress:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><code>element.shadowRoot.querySelector()</code></li>
                <li><code>cy.get(&apos;element&apos;).shadow().find(&apos;button&apos;)</code></li>
                <li>Plugin cypress-shadow-dom para soporte nativo</li>
                <li>Usar .invoke(&apos;prop&apos;, &apos;shadowRoot&apos;) en Cypress</li>
                <li>Eventos personalizados para comunicación</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
