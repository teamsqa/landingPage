'use client';

import { useState, useEffect } from 'react';
import { BlogCategory } from '@/app/types/blog';
import { Card, Button, Input } from '@/app/ui';
import { generateSlug } from '@/app/lib/blog-utils';

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6b7280'
  });

  // Cargar categorías
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/blog/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data || []);
      } else {
        setError(data.message || 'Error al cargar las categorías');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#6b7280'
    });
    setEditingCategory(null);
    setShowForm(false);
    setFormErrors([]);
  };

  const handleEdit = (category: BlogCategory) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#6b7280'
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('El nombre es requerido');
    }

    if (formData.name.length > 50) {
      errors.push('El nombre no puede exceder 50 caracteres');
    }

    if (formData.description.length > 200) {
      errors.push('La descripción no puede exceder 200 caracteres');
    }

    // Verificar slug único
    const slug = generateSlug(formData.name);
    const existingCategory = categories.find(cat => 
      cat.slug === slug && (!editingCategory || cat.id !== editingCategory.id)
    );
    
    if (existingCategory) {
      errors.push('Ya existe una categoría con este nombre');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    setFormErrors([]);

    const categoryData = {
      name: formData.name.trim(),
      slug: generateSlug(formData.name),
      description: formData.description.trim(),
      color: formData.color
    };

    try {
      const isEditing = editingCategory !== null;
      const url = isEditing 
        ? `/api/blog/categories/${editingCategory.id}`
        : '/api/blog/categories';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });

      const data = await response.json();

      if (data.success) {
        await loadCategories();
        resetForm();
      } else {
        setFormErrors([data.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la categoría`]);
      }
    } catch (err) {
      setFormErrors(['Error de conexión. Por favor, intenta de nuevo.']);
      console.error('Error saving category:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto podría afectar posts existentes.')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/categories/${categoryId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await loadCategories();
      } else {
        alert(data.message || 'Error al eliminar la categoría');
      }
    } catch (err) {
      alert('Error de conexión');
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categorías del Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona las categorías para organizar tus artículos
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
          >
            ← Volver al blog
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
          >
            {showForm ? 'Cancelar' : '+ Nueva categoría'}
          </Button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>

          {/* Errores */}
          {formErrors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Corrige los siguientes errores:
                  </h3>
                  <ul className="mt-1 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                    {formErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre de la categoría"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  maxLength={50}
                />
                {formData.name && (
                  <p className="text-sm text-gray-500 mt-1">
                    URL: /blog?category={generateSlug(formData.name)}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <div 
                    className="px-3 py-2 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.name || 'Preview'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Descripción opcional de la categoría..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.description.length}/200 caracteres
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingCategory ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  editingCategory ? 'Actualizar' : 'Crear categoría'
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de categorías */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Categorías Existentes
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Cargando categorías...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Error al cargar
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={loadCategories}>
              Reintentar
            </Button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay categorías
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Aún no has creado ninguna categoría.
            </p>
            <Button onClick={() => setShowForm(true)}>
              Crear primera categoría
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Creada
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {category.description || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-gray-500 dark:text-gray-400">
                        {category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(category)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(category.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
