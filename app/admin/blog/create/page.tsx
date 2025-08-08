'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogCategory, BlogPostStatus } from '@/app/types/blog';
import { Card, Button, Input } from '@/app/ui';
import { generateSlug, calculateReadingTime, generateExcerpt, validateBlogPost } from '@/app/lib/blog-utils';

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    coverImage: '',
    status: 'draft' as BlogPostStatus,
    published: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[]
    }
  });

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Generar slug automáticamente del título
  useEffect(() => {
    if (formData.title && !formData.seo.metaTitle) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaTitle: prev.title
        }
      }));
    }
  }, [formData.title]);

  // Generar excerpt automáticamente del contenido
  useEffect(() => {
    if (formData.content && !formData.excerpt) {
      const generatedExcerpt = generateExcerpt(formData.content);
      setFormData(prev => ({
        ...prev,
        excerpt: generatedExcerpt,
        seo: {
          ...prev.seo,
          metaDescription: prev.seo.metaDescription || generatedExcerpt
        }
      }));
    }
  }, [formData.content]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSeoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent, shouldPublish: boolean = false) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      slug: generateSlug(formData.title),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      readingTime: calculateReadingTime(formData.content),
      published: shouldPublish,
      status: shouldPublish ? 'published' as BlogPostStatus : formData.status,
      author: {
        id: 'current-user', // Esto debería venir del contexto de autenticación
        name: 'Admin',
        email: 'admin@teamsqa.com'
      }
    };

    // Validar
    const validation = validateBlogPost(postData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        setErrors([data.message || 'Error al crear el post']);
      }
    } catch (err) {
      setErrors(['Error de conexión. Por favor, intenta de nuevo.']);
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Crear Nuevo Artículo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Escribe y publica un nuevo artículo para el blog
          </p>
        </div>
        
        <Button
          variant="secondary"
          onClick={() => router.back()}
        >
          ← Volver
        </Button>
      </div>

      {/* Errores */}
      {errors.length > 0 && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Corrige los siguientes errores:
              </h3>
              <ul className="mt-1 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título del artículo *
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Escribe un título atractivo..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-lg font-semibold"
                  />
                  {formData.title && (
                    <p className="text-sm text-gray-500 mt-1">
                      URL: /blog/{generateSlug(formData.title)}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Extracto
                  </label>
                  <textarea
                    id="excerpt"
                    rows={3}
                    placeholder="Breve descripción del artículo..."
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
                    maxLength={300}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.excerpt.length}/300 caracteres
                  </div>
                </div>
              </div>
            </Card>

            {/* Editor de contenido */}
            <Card className="p-6">
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenido del artículo *
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  {/* Barra de herramientas simple */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 border-b border-gray-300 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        onClick={() => {
                          const textarea = document.getElementById('content') as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const selectedText = text.substring(start, end);
                          const newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                          handleInputChange('content', newText);
                        }}
                        title="Negrita"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 12h8m-8-6h8m-8 12h8" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        onClick={() => {
                          const textarea = document.getElementById('content') as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const selectedText = text.substring(start, end);
                          const newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                          handleInputChange('content', newText);
                        }}
                        title="Cursiva"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 4l4 16m-4-8h8" />
                        </svg>
                      </button>
                      <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                      <button
                        type="button"
                        className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        onClick={() => {
                          const textarea = document.getElementById('content') as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const text = textarea.value;
                          const newText = text.substring(0, start) + '\n## ' + text.substring(start);
                          handleInputChange('content', newText);
                        }}
                        title="Título"
                      >
                        H
                      </button>
                      <button
                        type="button"
                        className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        onClick={() => {
                          const textarea = document.getElementById('content') as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const text = textarea.value;
                          const newText = text.substring(0, start) + '\n- ' + text.substring(start);
                          handleInputChange('content', newText);
                        }}
                        title="Lista"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="content"
                    rows={20}
                    placeholder="Escribe el contenido de tu artículo aquí. Puedes usar Markdown..."
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none border-0"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Soporta Markdown básico</span>
                  <span>{calculateReadingTime(formData.content)} min de lectura</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estado y categoría */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Configuración
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etiquetas
                  </label>
                  <Input
                    id="tags"
                    type="text"
                    placeholder="java, automatización, tutorial..."
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separa las etiquetas con comas
                  </p>
                </div>

                <div>
                  <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen de portada
                  </label>
                  <Input
                    id="coverImage"
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={formData.coverImage}
                    onChange={(e) => handleInputChange('coverImage', e.target.value)}
                  />
                  {formData.coverImage && (
                    <div className="mt-2">
                      <img
                        src={formData.coverImage}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* SEO */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                SEO
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta título
                  </label>
                  <Input
                    id="metaTitle"
                    type="text"
                    placeholder="Título para SEO..."
                    value={formData.seo.metaTitle}
                    onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.seo.metaTitle?.length || 0}/60 caracteres
                  </div>
                </div>

                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta descripción
                  </label>
                  <textarea
                    id="metaDescription"
                    rows={3}
                    placeholder="Descripción para SEO..."
                    value={formData.seo.metaDescription}
                    onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
                    maxLength={160}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.seo.metaDescription?.length || 0}/160 caracteres
                  </div>
                </div>
              </div>
            </Card>

            {/* Acciones */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    'Guardar borrador'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  disabled={loading}
                  onClick={(e) => handleSubmit(e, true)}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publicando...
                    </>
                  ) : (
                    'Publicar ahora'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
