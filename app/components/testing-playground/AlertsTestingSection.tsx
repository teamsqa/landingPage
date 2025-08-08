'use client';

import { useState, useRef } from 'react';
import { Card, Button } from '@/app/ui';

interface AlertResult {
  type: string;
  message: string;
  result: string | boolean | null;
  timestamp: Date;
}

export default function AlertsTestingSection() {
  const [alertHistory, setAlertHistory] = useState<AlertResult[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [customPromptDefault, setCustomPromptDefault] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addToHistory = (type: string, message: string, result: string | boolean | null) => {
    setAlertHistory(prev => [{
      type,
      message,
      result,
      timestamp: new Date()
    }, ...prev.slice(0, 9)]); // Keep only last 10
  };

  const handleSimpleAlert = () => {
    const message = customMessage || '¡Esta es una alerta de prueba!';
    alert(message);
    addToHistory('alert', message, true);
  };

  const handleConfirm = () => {
    const message = customMessage || '¿Confirmas esta acción?';
    const result = confirm(message);
    addToHistory('confirm', message, result);
  };

  const handlePrompt = () => {
    const message = customMessage || 'Introduce tu nombre:';
    const defaultValue = customPromptDefault || 'Usuario';
    const result = prompt(message, defaultValue);
    addToHistory('prompt', message, result);
  };

  const handleMultipleAlerts = () => {
    const alerts = [
      { type: 'alert', message: 'Primera alerta secuencial' },
      { type: 'confirm', message: '¿Continuar con la segunda alerta?' },
      { type: 'prompt', message: 'Introduce un valor para la tercera:' },
      { type: 'alert', message: 'Secuencia completada' }
    ];

    let currentIndex = 0;

    const showNext = () => {
      if (currentIndex >= alerts.length) return;

      const current = alerts[currentIndex];
      let result: string | boolean | null = null;

      setTimeout(() => {
        switch (current.type) {
          case 'alert':
            alert(current.message);
            result = true;
            break;
          case 'confirm':
            result = confirm(current.message);
            if (!result) {
              addToHistory(current.type, current.message, result);
              return; // Stop sequence if user cancels
            }
            break;
          case 'prompt':
            result = prompt(current.message, 'Valor por defecto');
            if (result === null) {
              addToHistory(current.type, current.message, result);
              return; // Stop sequence if user cancels
            }
            break;
        }

        addToHistory(current.type, current.message, result);
        currentIndex++;
        
        if (currentIndex < alerts.length) {
          showNext();
        }
      }, currentIndex * 500); // Delay between alerts
    };

    showNext();
  };

  const startTimedAlerts = () => {
    if (isListening) return;
    
    setIsListening(true);
    setAlertCount(0);
    
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setAlertCount(count);
      
      const result = confirm(`Alerta automática #${count}\n¿Quieres continuar recibiendo alertas?`);
      addToHistory('confirm', `Alerta automática #${count}`, result);
      
      if (!result || count >= 5) {
        clearInterval(interval);
        setIsListening(false);
        alert(result ? 'Secuencia completada (máximo 5 alertas)' : 'Secuencia cancelada por el usuario');
      }
    }, 3000);
    
    timeoutRef.current = interval;
  };

  const stopTimedAlerts = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsListening(false);
    alert('Secuencia de alertas detenida');
  };

  const handleNestedAlerts = () => {
    const firstResult = confirm('Primera confirmación\n¿Continuar con alertas anidadas?');
    addToHistory('confirm', 'Primera confirmación', firstResult);
    
    if (firstResult) {
      alert('Preparando alertas anidadas...');
      
      setTimeout(() => {
        const secondResult = prompt('¿Cuál es tu color favorito?', 'azul');
        addToHistory('prompt', '¿Cuál es tu color favorito?', secondResult);
        
        if (secondResult) {
          const thirdResult = confirm(`¿Tu color favorito es ${secondResult}?`);
          addToHistory('confirm', `¿Tu color favorito es ${secondResult}?`, thirdResult);
          
          if (thirdResult) {
            alert(`¡Excelente! ${secondResult} es un gran color.`);
            addToHistory('alert', `¡Excelente! ${secondResult} es un gran color.`, true);
          } else {
            const correction = prompt('¿Cuál es entonces tu color favorito?', secondResult);
            addToHistory('prompt', '¿Cuál es entonces tu color favorito?', correction);
            
            if (correction) {
              alert(`Ahora sí, ${correction} es tu color favorito.`);
              addToHistory('alert', `Ahora sí, ${correction} es tu color favorito.`, true);
            }
          }
        }
      }, 1000);
    }
  };

  const handleComplexScenario = () => {
    // Escenario complejo que simula un flujo real de aplicación
    const userName = prompt('¡Bienvenido! Para comenzar, introduce tu nombre:', 'Usuario');
    if (!userName) {
      alert('Necesitas introducir un nombre para continuar.');
      return;
    }
    addToHistory('prompt', 'Introduce tu nombre', userName);
    
    alert(`Hola ${userName}! Te guiaremos a través de un proceso de configuración.`);
    
    const wantsNotifications = confirm('¿Quieres recibir notificaciones?');
    addToHistory('confirm', '¿Quieres recibir notificaciones?', wantsNotifications);
    
    let email = '';
    if (wantsNotifications) {
      email = prompt('Introduce tu email para las notificaciones:', `${userName.toLowerCase()}@email.com`) || '';
      addToHistory('prompt', 'Introduce tu email', email);
      
      if (email && email.includes('@')) {
        alert(`Perfecto! Enviaremos notificaciones a ${email}`);
      } else {
        const retry = confirm('El email no es válido. ¿Quieres intentar de nuevo?');
        addToHistory('confirm', 'Reintentar email', retry);
        
        if (retry) {
          email = prompt('Introduce un email válido:', '') || '';
          addToHistory('prompt', 'Email válido', email);
        }
      }
    }
    
    const theme = prompt('Selecciona un tema:\n1. Claro\n2. Oscuro\n3. Automático\n\nIntroduce el número (1, 2, o 3):', '1');
    addToHistory('prompt', 'Seleccionar tema', theme);
    
    const themeNames = { '1': 'Claro', '2': 'Oscuro', '3': 'Automático' };
    const selectedTheme = themeNames[theme as keyof typeof themeNames] || 'Claro';
    
    const confirmSetup = confirm(`Configuración completada:
• Nombre: ${userName}
• Notificaciones: ${wantsNotifications ? `Sí (${email})` : 'No'}
• Tema: ${selectedTheme}

¿Confirmas esta configuración?`);
    
    addToHistory('confirm', 'Confirmar configuración', confirmSetup);
    
    if (confirmSetup) {
      alert('¡Configuración guardada exitosamente! Bienvenido a la aplicación.');
      addToHistory('alert', 'Configuración guardada', true);
    } else {
      const restart = confirm('¿Quieres reiniciar el proceso de configuración?');
      addToHistory('confirm', 'Reiniciar configuración', restart);
      
      if (restart) {
        setTimeout(() => handleComplexScenario(), 500);
      } else {
        alert('Configuración cancelada. Puedes cambiar la configuración más tarde.');
      }
    }
  };

  const clearHistory = () => {
    const confirm_clear = confirm('¿Estás seguro de que quieres limpiar el historial?');
    if (confirm_clear) {
      setAlertHistory([]);
      addToHistory('system', 'Historial limpiado', true);
    }
  };

  const exportHistory = () => {
    if (alertHistory.length === 0) {
      alert('No hay historial para exportar');
      return;
    }
    
    const dataStr = JSON.stringify(alertHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alert_history.json';
    link.click();
    URL.revokeObjectURL(url);
    
    alert('Historial exportado como alert_history.json');
    addToHistory('system', 'Historial exportado', true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Instructions */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">
          🚨 Sección de Alertas JavaScript
        </h3>
        <div className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
          <p><strong>Para Testers:</strong> Esta sección permite practicar el manejo de alertas JavaScript (alert, confirm, prompt).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold">Tipos de Alertas:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>alert()</code> - Muestra información</li>
                <li><code>confirm()</code> - Solicita confirmación (Sí/No)</li>
                <li><code>prompt()</code> - Solicita entrada de texto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Escenarios de Prueba:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Alertas simples y personalizadas</li>
                <li>Alertas secuenciales y anidadas</li>
                <li>Alertas automáticas con temporizador</li>
                <li>Flujos complejos con múltiples tipos</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Controles de Alertas</h4>
          
          {/* Custom Message Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Mensaje Personalizado</label>
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Escribe tu mensaje personalizado..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              data-testid="custom-message-input"
            />
            
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Valor por defecto para prompt</label>
              <input
                type="text"
                value={customPromptDefault}
                onChange={(e) => setCustomPromptDefault(e.target.value)}
                placeholder="Valor por defecto..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                data-testid="prompt-default-input"
              />
            </div>
          </div>

          {/* Basic Alert Buttons */}
          <div className="space-y-3 mb-6">
            <h5 className="font-medium">Alertas Básicas</h5>
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={handleSimpleAlert}
                className="w-full justify-start"
                data-testid="simple-alert-button"
              >
                📢 Mostrar Alerta Simple
              </Button>
              <Button
                onClick={handleConfirm}
                className="w-full justify-start"
                variant="secondary"
                data-testid="confirm-button"
              >
                ❓ Mostrar Confirmación
              </Button>
              <Button
                onClick={handlePrompt}
                className="w-full justify-start"
                variant="secondary"
                data-testid="prompt-button"
              >
                ✏️ Mostrar Prompt
              </Button>
            </div>
          </div>

          {/* Advanced Alert Scenarios */}
          <div className="space-y-3 mb-6">
            <h5 className="font-medium">Escenarios Avanzados</h5>
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={handleMultipleAlerts}
                className="w-full justify-start text-sm"
                variant="secondary"
                data-testid="multiple-alerts-button"
              >
                🔄 Alertas Secuenciales
              </Button>
              <Button
                onClick={handleNestedAlerts}
                className="w-full justify-start text-sm"
                variant="secondary"
                data-testid="nested-alerts-button"
              >
                🎯 Alertas Anidadas
              </Button>
              <Button
                onClick={handleComplexScenario}
                className="w-full justify-start text-sm"
                data-testid="complex-scenario-button"
              >
                🚀 Flujo Complejo
              </Button>
            </div>
          </div>

          {/* Timed Alerts */}
          <div className="space-y-3 mb-6">
            <h5 className="font-medium">Alertas Automáticas</h5>
            <div className="flex gap-2">
              <Button
                onClick={startTimedAlerts}
                disabled={isListening}
                className="flex-1"
                data-testid="start-timed-alerts"
              >
                {isListening ? `⏱️ Ejecutando... (${alertCount})` : '▶️ Iniciar Alertas Automáticas'}
              </Button>
              <Button
                onClick={stopTimedAlerts}
                disabled={!isListening}
                variant="danger"
                data-testid="stop-timed-alerts"
              >
                ⏹️ Detener
              </Button>
            </div>
            {isListening && (
              <div className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                ⚠️ Las alertas aparecerán cada 3 segundos. Responde "Cancelar" para detener.
              </div>
            )}
          </div>

          {/* History Actions */}
          <div className="space-y-2">
            <h5 className="font-medium">Gestión del Historial</h5>
            <div className="flex gap-2">
              <Button
                onClick={clearHistory}
                variant="secondary"
                className="flex-1"
                data-testid="clear-history-button"
              >
                🗑️ Limpiar
              </Button>
              <Button
                onClick={exportHistory}
                variant="secondary"
                className="flex-1"
                data-testid="export-history-button"
              >
                💾 Exportar
              </Button>
            </div>
          </div>
        </Card>

        {/* History Panel */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Historial de Alertas</h4>
            <span className="text-sm text-gray-500" data-testid="history-count">
              {alertHistory.length} registros
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto" data-testid="alert-history-list">
            {alertHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No hay alertas en el historial</p>
                <p className="text-sm">Haz clic en cualquier botón para comenzar</p>
              </div>
            ) : (
              alertHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border-l-4 ${
                    entry.type === 'alert'
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : entry.type === 'confirm'
                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                      : entry.type === 'prompt'
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-400 bg-gray-50 dark:bg-gray-800'
                  }`}
                  data-testid={`history-entry-${index}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm uppercase">
                      {entry.type === 'alert' ? '📢 Alert' : 
                       entry.type === 'confirm' ? '❓ Confirm' : 
                       entry.type === 'prompt' ? '✏️ Prompt' : '⚙️ System'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm mb-1">{entry.message}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Resultado:</strong> {
                      entry.result === true ? '✅ Aceptado' :
                      entry.result === false ? '❌ Cancelado' :
                      entry.result === null ? '⏭️ Sin respuesta' :
                      `"${entry.result}"`
                    }
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Testing Tips */}
      <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
          💡 Consejos para Testing de Alertas
        </h4>
        <div className="text-green-800 dark:text-green-200 space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-2">Selenium WebDriver:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><code>driver.switch_to.alert</code> - Cambiar a alerta</li>
                <li><code>alert.accept()</code> - Aceptar alerta</li>
                <li><code>alert.dismiss()</code> - Cancelar alerta</li>
                <li><code>alert.send_keys(text)</code> - Escribir en prompt</li>
                <li><code>alert.text</code> - Obtener texto de alerta</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Cypress:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><code>cy.window().its('confirm').should('have.been.called')</code></li>
                <li><code>cy.stub(window, 'alert')</code> - Mock alert</li>
                <li><code>cy.stub(window, 'confirm').returns(true)</code></li>
                <li><code>cy.stub(window, 'prompt').returns('valor')</code></li>
                <li>Verificar con <code>expect(stub).to.have.been.calledWith('mensaje')</code></li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
