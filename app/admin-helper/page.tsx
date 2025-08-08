'use client';

import { useState } from 'react';
import { Card, Button } from '@/app/ui';

export default function AdminAccessHelper() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAdminLogin = async () => {
    addLog('🔍 Probando acceso admin...');
    
    // Probar con credenciales de ejemplo
    const testCredentials = [
      { email: 'admin@teamsqa.com', password: 'admin123' },
      { email: 'admin@teamsqa.com', password: 'password' },
      { email: 'admin@teamsqa.com', password: 'teamsqa123' },
      { email: 'test@teamsqa.com', password: 'test123' }
    ];

    for (const cred of testCredentials) {
      addLog(`📧 Probando: ${cred.email} / ${cred.password}`);
      
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: cred.email, 
            password: cred.password,
            test: true 
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          addLog(`✅ ${cred.email} - FUNCIONA!`);
          break;
        } else {
          addLog(`❌ ${cred.email} - ${data.message}`);
        }
      } catch (error: any) {
        addLog(`❌ ${cred.email} - Error: ${error.message}`);
      }
    }
  };

  const createTestUser = async () => {
    addLog('👤 Creando usuario de prueba...');
    
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@teamsqa.com',
          password: 'admin123',
          name: 'Admin TeamsQA'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addLog('✅ Usuario creado exitosamente!');
        addLog(`📧 Email: admin@teamsqa.com`);
        addLog(`🔑 Password: admin123`);
      } else {
        addLog(`❌ Error: ${data.message}`);
      }
    } catch (error: any) {
      addLog(`❌ Error creando usuario: ${error.message}`);
    }
  };

  const directAdminAccess = () => {
    addLog('🚀 Redirigiendo a login...');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            🔧 Helper de Acceso Admin
          </h1>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="font-semibold text-blue-800 mb-2">📋 Problema identificado:</h2>
            <p className="text-blue-700">
              La ruta <code>/admin</code> redirige a <code>/admin/login</code> porque requiere autenticación.
              Esto es el comportamiento correcto de seguridad.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <Button
              onClick={testAdminLogin}
              className="w-full bg-blue-600 text-white"
            >
              🧪 Probar Credenciales Existentes
            </Button>

            <Button
              onClick={createTestUser}
              className="w-full bg-green-600 text-white"
            >
              👤 Crear Usuario Admin de Prueba
            </Button>

            <Button
              onClick={directAdminAccess}
              className="w-full bg-purple-600 text-white"
            >
              🚀 Ir a Página de Login
            </Button>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">💡 Credenciales sugeridas:</h3>
            <div className="text-yellow-700 font-mono text-sm">
              <p>📧 Email: admin@teamsqa.com</p>
              <p>🔑 Password: admin123</p>
            </div>
          </div>

          {testResults.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📝 Log de Pruebas:</h3>
              <div className="font-mono text-xs max-h-48 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
