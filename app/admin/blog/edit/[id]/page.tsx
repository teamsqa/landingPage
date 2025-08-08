'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost, BlogCategory, BlogPostStatus } from '@/app/types/blog';
import { Card, Button, Input } from '@/app/ui';
import { generateSlug, calculateReadingTime, generateExcerpt, validateBlogPost } from '@/app/lib/blog-utils';

interface EditBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  // Cargar post y categorías
  useEffect(() => {
    Promise.all([
      loadPost(),
      loadCategories()
    ]);
  }, [id]);

  // Actualizar form data cuando se carga el post
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags.join(', '),
        coverImage: post.coverImage || '',
        status: post.status,
        published: post.published,
        seo: {
          metaTitle: post.seo.metaTitle || post.title,
          metaDescription: post.seo.metaDescription || post.excerpt,
          keywords: post.seo.keywords || []
        }
      });
    }
  }, [post]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${id}`);
      const data = await response.json();

      if (data.success) {
        setPost(data.data);
      } else {
        setErrors([data.message || 'Error al cargar el post']);
      }
    } catch (err) {
      setErrors(['Error de conexión']);
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
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
    
    if (!post) return;

    const postData = {
      ...formData,
      slug: post.slug, // Mantener el slug original
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      readingTime: calculateReadingTime(formData.content),
      published: shouldPublish,
      status: shouldPublish ? 'published' as BlogPostStatus : formData.status,
      author: post.author // Mantener el autor original
    };

    // Validar
    const validation = validateBlogPost(postData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setErrors([]);

    try {
      const response = await fetch(`/api/blog/posts/${post.id}`, {
        method: 'PUT',
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
        setErrors([data.message || 'Error al actualizar el post']);
      }
    } catch (err) {
      setErrors(['Error de conexión. Por favor, intenta de nuevo.']);
      console.error('Error updating post:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Post no encontrado
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          El post que intentas editar no existe o no tienes permisos para verlo.
        </p>
        <Button onClick={() => router.push('/admin/blog')}>
          Volver al blog
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Editar Artículo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Modifica los detalles del artículo "{post.title}"
          </p>
        </div>
        
        <div className="flex gap-3">
          {post.published && (
            <Button
              variant="secondary"
              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
            >
              Ver publicado
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => router.back()}
          >
            ← Volver
          </Button>
        </div>
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
                  <p className="text-sm text-gray-500 mt-1">
                    URL: /blog/{post.slug} (no se puede cambiar)
                  </p>
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
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    'Guardar cambios'
                  )}
                </Button>

                {!formData.published && (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={saving}
                    onClick={(e) => handleSubmit(e, true)}
                    className="w-full"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Publicando...
                      </>
                    ) : (
                      'Guardar y publicar'
                    )}
                  </Button>
                )}

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

            {/* Info del post */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Creado:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Última actualización:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(post.updatedAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 dark:text-gray-400">Autor:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {post.author.name}
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 dark:text-gray-400">Vistas:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {post.views.toLocaleString()}
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 dark:text-gray-400">Likes:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {post.likes.toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
