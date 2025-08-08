'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '@/app/ui';

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
}

export default function AdvancedTestingForms() {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<FileData[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [formData, setFormData] = useState({
    wizard: {
      projectName: '',
      projectType: '',
      framework: '',
      complexity: '',
      timeline: '',
      budget: '',
      requirements: '',
      features: [] as string[]
    },
    team: {
      teamSize: '',
      roles: [] as Array<{id: string, role: string, experience: string, startDate: string}>,
      methodology: '',
      tools: [] as string[]
    },
    delivery: {
      milestones: [] as Array<{id: string, title: string, date: string, description: string}>,
      deliverables: '',
      acceptance: '',
      maintenance: false,
      support: ''
    }
  });

  const projectTypes = ['Web Application', 'Mobile App', 'Desktop Software', 'API/Backend', 'DevOps/Infrastructure'];
  const frameworks = ['React', 'Vue', 'Angular', 'Next.js', 'Laravel', 'Django', 'Spring Boot', 'Express.js'];
  const methodologies = ['Scrum', 'Kanban', 'Waterfall', 'Hybrid'];
  const tools = ['Jira', 'Trello', 'Azure DevOps', 'GitHub Projects', 'Monday.com'];
  const features = ['Authentication', 'Payment Integration', 'Real-time Chat', 'File Upload', 'Notifications', 'Analytics', 'API Integration', 'Admin Panel'];

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    const timer = setTimeout(() => {
      localStorage.setItem('advanced-form-data', JSON.stringify(formData));
      setLastSaved(new Date());
    }, 2000);
    
    setAutoSaveTimer(timer);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [formData]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('advanced-form-data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFormData(parsedData);
        setLastSaved(new Date());
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const newFiles: FileData[] = Array.from(uploadedFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const updateProgress = (progress: number) => {
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: progress < 100 ? 'uploading' : 'completed', progress }
          : f
      ));
    };

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      updateProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(interval);
        // Randomly simulate some errors
        if (Math.random() < 0.1) {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: 'error' } : f
          ));
        }
      }
    }, 300);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const addRole = () => {
    const newRole = {
      id: Math.random().toString(36).substr(2, 9),
      role: '',
      experience: '',
      startDate: ''
    };
    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        roles: [...prev.team.roles, newRole]
      }
    }));
  };

  const updateRole = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        roles: prev.team.roles.map(role => 
          role.id === id ? { ...role, [field]: value } : role
        )
      }
    }));
  };

  const removeRole = (id: string) => {
    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        roles: prev.team.roles.filter(role => role.id !== id)
      }
    }));
  };

  const addMilestone = () => {
    const newMilestone = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      date: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        milestones: [...prev.delivery.milestones, newMilestone]
      }
    }));
  };

  const updateMilestone = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        milestones: prev.delivery.milestones.map(milestone => 
          milestone.id === id ? { ...milestone, [field]: value } : milestone
        )
      }
    }));
  };

  const removeMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        milestones: prev.delivery.milestones.filter(milestone => milestone.id !== id)
      }
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    const current = formData.wizard.features;
    const updated = current.includes(feature)
      ? current.filter(f => f !== feature)
      : [...current, feature];
    
    setFormData(prev => ({
      ...prev,
      wizard: { ...prev.wizard, features: updated }
    }));
  };

  const handleToolToggle = (tool: string) => {
    const current = formData.team.tools;
    const updated = current.includes(tool)
      ? current.filter(t => t !== tool)
      : [...current, tool];
    
    setFormData(prev => ({
      ...prev,
      team: { ...prev.team, tools: updated }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate complex submission
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Clear saved data
    localStorage.removeItem('advanced-form-data');
    
    alert('✅ Formulario avanzado enviado correctamente!\n\n' +
      'Proyecto: ' + formData.wizard.projectName + '\n' +
      'Tipo: ' + formData.wizard.projectType + '\n' +
      'Equipo: ' + formData.team.teamSize + ' personas\n' +
      'Archivos: ' + files.length + ' archivos adjuntos'
    );
    
    setLoading(false);
    
    // Reset form
    setCurrentStep(1);
    setFiles([]);
    setFormData({
      wizard: { projectName: '', projectType: '', framework: '', complexity: '', timeline: '', budget: '', requirements: '', features: [] },
      team: { teamSize: '', roles: [], methodology: '', tools: [] },
      delivery: { milestones: [], deliverables: '', acceptance: '', maintenance: false, support: '' }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6" data-testid="wizard-step-1">
            <h4 className="text-lg font-semibold">Configuración del Proyecto</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre del Proyecto *</label>
                <Input
                  value={formData.wizard.projectName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    wizard: { ...prev.wizard, projectName: e.target.value }
                  }))}
                  placeholder="Mi Proyecto Increíble"
                  data-testid="project-name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Proyecto *</label>
                <select
                  value={formData.wizard.projectType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    wizard: { ...prev.wizard, projectType: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  data-testid="project-type"
                >
                  <option value="">Selecciona el tipo</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {formData.wizard.projectType && (
              <div className="grid grid-cols-2 gap-4 animate-fadeIn" data-testid="conditional-framework">
                <div>
                  <label className="block text-sm font-medium mb-2">Framework/Tecnología</label>
                  <select
                    value={formData.wizard.framework}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      wizard: { ...prev.wizard, framework: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    data-testid="framework-select"
                  >
                    <option value="">Selecciona framework</option>
                    {frameworks.map(fw => (
                      <option key={fw} value={fw}>{fw}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Complejidad</label>
                  <select
                    value={formData.wizard.complexity}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      wizard: { ...prev.wizard, complexity: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    data-testid="complexity-select"
                  >
                    <option value="">Nivel de complejidad</option>
                    <option value="low">Baja - Funcionalidades básicas</option>
                    <option value="medium">Media - Características estándar</option>
                    <option value="high">Alta - Funcionalidades avanzadas</option>
                    <option value="enterprise">Enterprise - Solución completa</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-3">Características del Proyecto</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {features.map(feature => (
                  <label
                    key={feature}
                    className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                      formData.wizard.features.includes(feature)
                        ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    data-testid={`feature-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.wizard.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="sr-only"
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Requisitos Detallados</label>
              <textarea
                value={formData.wizard.requirements}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  wizard: { ...prev.wizard, requirements: e.target.value }
                }))}
                placeholder="Describe en detalle los requisitos del proyecto..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                data-testid="requirements-textarea"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.wizard.requirements.length} / 1000 caracteres
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6" data-testid="wizard-step-2">
            <h4 className="text-lg font-semibold">Configuración del Equipo</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tamaño del Equipo</label>
                <select
                  value={formData.team.teamSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    team: { ...prev.team, teamSize: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  data-testid="team-size"
                >
                  <option value="">Selecciona tamaño</option>
                  <option value="1-2">1-2 personas</option>
                  <option value="3-5">3-5 personas</option>
                  <option value="6-10">6-10 personas</option>
                  <option value="10+">10+ personas</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Metodología</label>
                <select
                  value={formData.team.methodology}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    team: { ...prev.team, methodology: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  data-testid="methodology"
                >
                  <option value="">Selecciona metodología</option>
                  {methodologies.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Roles */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Roles del Equipo</label>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addRole}
                  className="text-sm py-1 px-3"
                  data-testid="add-role-button"
                >
                  + Agregar Rol
                </Button>
              </div>
              
              <div className="space-y-3" data-testid="roles-container">
                {formData.team.roles.map((role, index) => (
                  <div key={role.id} className="grid grid-cols-4 gap-3 p-3 border rounded" data-testid={`role-${index}`}>
                    <Input
                      value={role.role}
                      onChange={(e) => updateRole(role.id, 'role', e.target.value)}
                      placeholder="Desarrollador Frontend"
                      data-testid={`role-name-${index}`}
                    />
                    <select
                      value={role.experience}
                      onChange={(e) => updateRole(role.id, 'experience', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700"
                      data-testid={`role-experience-${index}`}
                    >
                      <option value="">Experiencia</option>
                      <option value="junior">Junior (0-2 años)</option>
                      <option value="mid">Mid (2-5 años)</option>
                      <option value="senior">Senior (5+ años)</option>
                    </select>
                    <Input
                      type="date"
                      value={role.startDate}
                      onChange={(e) => updateRole(role.id, 'startDate', e.target.value)}
                      data-testid={`role-start-date-${index}`}
                    />
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeRole(role.id)}
                      className="px-3"
                      data-testid={`remove-role-${index}`}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                
                {formData.team.roles.length === 0 && (
                  <div className="text-center py-6 text-gray-500 border-2 border-dashed rounded">
                    No hay roles definidos. Haz clic en "Agregar Rol" para comenzar.
                  </div>
                )}
              </div>
            </div>

            {/* Tools Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Herramientas de Gestión</label>
              <div className="grid grid-cols-3 gap-3">
                {tools.map(tool => (
                  <label
                    key={tool}
                    className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                      formData.team.tools.includes(tool)
                        ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    data-testid={`tool-${tool.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.team.tools.includes(tool)}
                      onChange={() => handleToolToggle(tool)}
                      className="sr-only"
                    />
                    <span className="text-sm">{tool}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6" data-testid="wizard-step-3">
            <h4 className="text-lg font-semibold">Entrega y Documentos</h4>
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-3">Archivos del Proyecto</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver
                    ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                data-testid="file-drop-zone"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  data-testid="file-input"
                />
                <div className="text-4xl mb-2">📁</div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Arrastra archivos aquí o{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-lime-600 hover:text-lime-700 font-medium"
                    data-testid="browse-files-button"
                  >
                    selecciona archivos
                  </button>
                </p>
                <p className="text-sm text-gray-500">Máximo 10MB por archivo</p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2" data-testid="files-list">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 border rounded" data-testid={`file-${file.id}`}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{file.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            {file.status === 'completed' && (
                              <span className="text-green-500 text-xs">✓</span>
                            )}
                            {file.status === 'error' && (
                              <span className="text-red-500 text-xs">✗</span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile(file.id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                              data-testid={`remove-file-${file.id}`}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        {file.status === 'uploading' && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-lime-600 h-2 rounded-full transition-all"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Hitos del Proyecto</label>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addMilestone}
                  className="text-sm py-1 px-3"
                  data-testid="add-milestone-button"
                >
                  + Agregar Hito
                </Button>
              </div>
              
              <div className="space-y-3" data-testid="milestones-container">
                {formData.delivery.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="grid grid-cols-3 gap-3 p-3 border rounded" data-testid={`milestone-${index}`}>
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      placeholder="Nombre del hito"
                      data-testid={`milestone-title-${index}`}
                    />
                    <Input
                      type="date"
                      value={milestone.date}
                      onChange={(e) => updateMilestone(milestone.id, 'date', e.target.value)}
                      data-testid={`milestone-date-${index}`}
                    />
                    <div className="flex gap-2">
                      <Input
                        value={milestone.description}
                        onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                        placeholder="Descripción"
                        className="flex-1"
                        data-testid={`milestone-description-${index}`}
                      />
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeMilestone(milestone.id)}
                        className="px-3"
                        data-testid={`remove-milestone-${index}`}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Options */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Entregables Finales</label>
                <textarea
                  value={formData.delivery.deliverables}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    delivery: { ...prev.delivery, deliverables: e.target.value }
                  }))}
                  placeholder="Lista de entregables finales..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  data-testid="deliverables-textarea"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Criterios de Aceptación</label>
                <textarea
                  value={formData.delivery.acceptance}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    delivery: { ...prev.delivery, acceptance: e.target.value }
                  }))}
                  placeholder="Criterios para considerar el proyecto completo..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  data-testid="acceptance-textarea"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.delivery.maintenance}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    delivery: { ...prev.delivery, maintenance: e.target.checked }
                  }))}
                  className="mr-2"
                  data-testid="maintenance-checkbox"
                />
                <span className="text-sm">Incluir período de mantenimiento</span>
              </label>
            </div>

            {formData.delivery.maintenance && (
              <div className="animate-fadeIn" data-testid="maintenance-section">
                <label className="block text-sm font-medium mb-2">Detalles del Soporte</label>
                <Input
                  value={formData.delivery.support}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    delivery: { ...prev.delivery, support: e.target.value }
                  }))}
                  placeholder="6 meses de soporte técnico incluido..."
                  data-testid="support-input"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              ⭐⭐⭐ Formulario Avanzado
              <span className="text-sm font-normal bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                Nivel Experto
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Paso {currentStep} de 3 • Wizard Complejo con Auto-guardado
            </p>
          </div>
          
          {lastSaved && (
            <div className="text-sm text-gray-500" data-testid="auto-save-indicator">
              💾 Guardado: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {['Proyecto', 'Equipo', 'Entrega'].map((stepName, index) => {
              const stepNum = index + 1;
              return (
                <div key={stepName} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        stepNum <= currentStep
                          ? 'bg-lime-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}
                      data-testid={`wizard-step-indicator-${stepNum}`}
                    >
                      {stepNum < currentStep ? '✓' : stepNum}
                    </div>
                    <span className="text-xs mt-1 font-medium">{stepName}</span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`h-1 w-32 mx-4 ${
                        stepNum < currentStep ? 'bg-lime-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Progreso: {Math.round((currentStep / 3) * 100)}% completado
          </div>
        </div>

        <form onSubmit={handleSubmit} data-testid="advanced-form">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
              disabled={currentStep === 1}
              data-testid="wizard-prev-button"
            >
              ← Anterior
            </Button>
            
            <div className="text-sm text-gray-500">
              {currentStep < 3 ? `Siguiente: ${['Equipo', 'Entrega'][currentStep - 1]}` : 'Listo para enviar'}
            </div>
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(currentStep + 1, 3))}
                data-testid="wizard-next-button"
              >
                Siguiente →
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                data-testid="submit-advanced-form"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando proyecto...
                  </>
                ) : (
                  '🚀 Crear Proyecto'
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
