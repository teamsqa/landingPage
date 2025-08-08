'use client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/app/ui';
import { Course, Tool, Topic, Benefit } from '@/app/types/course';
import FileUpload from './FileUpload';
import { uploadFile } from '@/app/lib/upload';
import { showToast } from '@/app/components/Toast';

type Props = {
  course: Course | null;
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: (courseData: Partial<Course>) => void;
};

export default function CourseFormModal({ course, isOpen, isEditing, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    duration: '',
    level: 'Básico',
    price: '',
    instructor: '',
    instructorRole: '',
    instructorImage: '',
    image: '',
    tools: [],
    topics: [],
    benefits: [],
    requirements: [],
    targetAudience: [],
    whatYouWillLearn: [],
    courseContent: [],
    active: true
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingToolIcon, setUploadingToolIcon] = useState<number | null>(null);

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      if (isEditing && course) {
        setFormData(course);
      } else {
        setFormData({
          title: '',
          description: '',
          duration: '',
          level: 'Básico',
          price: '',
          instructor: '',
          instructorRole: '',
          instructorImage: '',
          image: '',
          tools: [],
          topics: [],
          benefits: [],
          requirements: [],
          targetAudience: [],
          whatYouWillLearn: [],
          courseContent: [],
          active: true
        });
      }
    }
  }, [isOpen, isEditing, course]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof Course, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof Course, index: number, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    handleInputChange(field, newArray);
  };

  const addArrayItem = (field: keyof Course) => {
    const currentArray = (formData[field] as string[]) || [];
    handleInputChange(field, [...currentArray, '']);
  };

  const removeArrayItem = (field: keyof Course, index: number) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.filter((_, i) => i !== index);
    handleInputChange(field, newArray);
  };

  const handleToolChange = (index: number, field: keyof Tool, value: string) => {
    const tools = [...(formData.tools || [])];
    tools[index] = { ...tools[index], [field]: value };
    handleInputChange('tools', tools);
  };

  const addTool = () => {
    const tools = [...(formData.tools || [])];
    tools.push({ name: '' }); // No incluimos icono hasta que se proporcione
    handleInputChange('tools', tools);
  };

  const removeTool = (index: number) => {
    const tools = (formData.tools || []).filter((_, i) => i !== index);
    handleInputChange('tools', tools);
  };

  const handleTopicChange = (index: number, field: keyof Topic, value: string | string[]) => {
    const topics = [...(formData.topics || [])];
    topics[index] = { ...topics[index], [field]: value };
    handleInputChange('topics', topics);
  };

  const addTopic = () => {
    const topics = [...(formData.topics || [])];
    topics.push({ title: '', content: [''] });
    handleInputChange('topics', topics);
  };

  const removeTopic = (index: number) => {
    const topics = (formData.topics || []).filter((_, i) => i !== index);
    handleInputChange('topics', topics);
  };

  const handleBenefitChange = (index: number, field: keyof Benefit, value: string) => {
    const benefits = [...(formData.benefits || [])];
    benefits[index] = { ...benefits[index], [field]: value };
    handleInputChange('benefits', benefits);
  };

  const addBenefit = () => {
    const benefits = [...(formData.benefits || [])];
    benefits.push({ title: '', description: '' });
    handleInputChange('benefits', benefits);
  };

  const removeBenefit = (index: number) => {
    const benefits = (formData.benefits || []).filter((_, i) => i !== index);
    handleInputChange('benefits', benefits);
  };

  // Funciones para "Lo que aprenderás"
  const handleWhatYouWillLearnChange = (index: number, value: string) => {
    const items = [...(formData.whatYouWillLearn || [])];
    items[index] = value;
    handleInputChange('whatYouWillLearn', items);
  };

  const addWhatYouWillLearnItem = () => {
    const items = [...(formData.whatYouWillLearn || [])];
    items.push('');
    handleInputChange('whatYouWillLearn', items);
  };

  const removeWhatYouWillLearnItem = (index: number) => {
    const items = (formData.whatYouWillLearn || []).filter((_, i) => i !== index);
    handleInputChange('whatYouWillLearn', items);
  };

  // Funciones para "Contenido del curso"
  const handleCourseContentChange = (index: number, value: string) => {
    const items = [...(formData.courseContent || [])];
    items[index] = value;
    handleInputChange('courseContent', items);
  };

  const addCourseContentItem = () => {
    const items = [...(formData.courseContent || [])];
    items.push('');
    handleInputChange('courseContent', items);
  };

  const removeCourseContentItem = (index: number) => {
    const items = (formData.courseContent || []).filter((_, i) => i !== index);
    handleInputChange('courseContent', items);
  };

  // Funciones para subida de archivos
  const handleMainImageUpload = async (file: File) => {
    setUploadingImage(true);
    
    const uploadPromise = async () => {
      try {
        const url = await uploadFile(file);
        handleInputChange('image', url);
        return url;
      } catch (error) {
        console.error('Error uploading main image:', error);
        throw new Error('Error al subir la imagen principal');
      }
    };

    showToast.promise(
      uploadPromise(),
      {
        loading: 'Subiendo imagen...',
        success: '📸 Imagen subida exitosamente',
        error: 'Error al subir la imagen',
      }
    ).finally(() => {
      setUploadingImage(false);
    });
  };

  const handleToolIconUpload = async (file: File, toolIndex: number) => {
    setUploadingToolIcon(toolIndex);
    
    const uploadPromise = async () => {
      try {
        const url = await uploadFile(file);
        handleToolChange(toolIndex, 'icon', url);
        return url;
      } catch (error) {
        console.error('Error uploading tool icon:', error);
        throw new Error('Error al subir el icono de la herramienta');
      }
    };

    showToast.promise(
      uploadPromise(),
      {
        loading: 'Subiendo icono...',
        success: '🎯 Icono subido exitosamente',
        error: 'Error al subir el icono',
      }
    ).finally(() => {
      setUploadingToolIcon(null);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      showToast.warning('Por favor, completa los campos obligatorios (título y descripción)');
      return;
    }

    setIsProcessing(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card variant="elevated" className="border-0 shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Editar Curso' : 'Crear Nuevo Curso'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {isEditing ? 'Modifica la información del curso' : 'Completa la información para crear un nuevo curso'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                disabled={isProcessing}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">
              {/* Información Básica */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título del Curso *
                    </label>
                    <Input
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ej: Fundamentos de Automatización"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duración
                    </label>
                    <Input
                      value={formData.duration || ''}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="Ej: 8 semanas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nivel
                    </label>
                    <select
                      value={formData.level || 'Básico'}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Básico">Básico</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Precio
                    </label>
                    <Input
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="Ej: $399 USD"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe el curso..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    required
                  />
                </div>
              </div>

              {/* Instructor */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información del Instructor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del Instructor
                    </label>
                    <Input
                      value={formData.instructor || ''}
                      onChange={(e) => handleInputChange('instructor', e.target.value)}
                      placeholder="Ej: Laura Sánchez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rol del Instructor
                    </label>
                    <Input
                      value={formData.instructorRole || ''}
                      onChange={(e) => handleInputChange('instructorRole', e.target.value)}
                      placeholder="Ej: QA Automation Lead"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Foto del Instructor (URL)
                    </label>
                    <Input
                      value={formData.instructorImage || ''}
                      onChange={(e) => handleInputChange('instructorImage', e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Herramientas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Herramientas del Curso
                </h3>
                <div className="space-y-4">
                  {(formData.tools || []).map((tool, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Herramienta {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => removeTool(index)}
                          className="px-2 py-1 text-xs"
                        >
                          ✕
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nombre de la Herramienta
                          </label>
                          <Input
                            value={tool.name || ''}
                            onChange={(e) => handleToolChange(index, 'name', e.target.value)}
                            placeholder="Ej: Selenium WebDriver"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Icono de la Herramienta
                          </label>
                          <div className="space-y-2">
                            <FileUpload 
                              onFileSelect={(file) => handleToolIconUpload(file, index)}
                              currentValue={tool.icon}
                              accept="image/*"
                              label="Subir icono"
                              className="text-xs"
                            />
                            {uploadingToolIcon === index && (
                              <p className="text-xs text-lime-600">Subiendo icono...</p>
                            )}
                            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                              - O -
                            </div>
                            <Input
                              value={tool.icon || ''}
                              onChange={(e) => handleToolChange(index, 'icon', e.target.value)}
                              placeholder="URL del icono o emoji"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addTool}
                    className="w-full"
                  >
                    + Agregar Herramienta
                  </Button>
                </div>
              </div>

              {/* Imagen del Curso */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Imagen del Curso
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subir Imagen del Curso
                    </label>
                    <FileUpload 
                      onFileSelect={handleMainImageUpload}
                      currentValue={formData.image}
                      accept="image/*"
                      label="Seleccionar imagen del curso"
                    />
                    {uploadingImage && (
                      <p className="text-sm text-lime-600 mt-2">Subiendo imagen...</p>
                    )}
                  </div>
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    - O -
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL de la Imagen
                    </label>
                    <Input
                      value={formData.image || ''}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://ejemplo.com/curso-imagen.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Lo que aprenderás */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Lo que aprenderás
                </h3>
                <div className="space-y-3">
                  {(formData.whatYouWillLearn || []).map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleWhatYouWillLearnChange(index, e.target.value)}
                        placeholder="Ej: Fundamentos de automatización de pruebas"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeWhatYouWillLearnItem(index)}
                        className="px-3"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addWhatYouWillLearnItem}
                    className="w-full"
                  >
                    + Agregar elemento de aprendizaje
                  </Button>
                </div>
              </div>

              {/* Contenido del curso */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contenido del curso
                </h3>
                <div className="space-y-3">
                  {(formData.courseContent || []).map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleCourseContentChange(index, e.target.value)}
                        placeholder="Ej: Módulo 1: Introducción a las pruebas automatizadas"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeCourseContentItem(index)}
                        className="px-3"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addCourseContentItem}
                    className="w-full"
                  >
                    + Agregar contenido del curso
                  </Button>
                </div>
              </div>

              {/* Estado */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Estado del Curso
                </h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active || false}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Curso activo (visible en la landing page)
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isProcessing}
              >
                {isProcessing ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Curso
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
