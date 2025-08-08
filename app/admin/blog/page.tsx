'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost, BlogCategory, BlogStats } from '@/app/types/blog';
import { Card, Button, Badge, Input } from '@/app/ui';
import { formatDate, getRelativeTime } from '@/app/lib/blog-utils';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cargar datos iniciales
  useEffect(() => {
    Promise.all([
      loadPosts(),
      loadCategories(),
      loadStats()
    ]);
  }, []);

  // Cargar posts cuando cambien los filtros
  useEffect(() => {
    loadPosts(1);
  }, [selectedStatus, selectedCategory, searchTerm]);

  const loadPosts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (selectedStatus) {
        params.append('status', selectedStatus);
      }

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`/api/blog/posts?${params}`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.data.posts || []);
        if (data.data.pagination) {
          setTotalPages(data.data.pagination.totalPages);
          setCurrentPage(data.data.pagination.currentPage);
        }
      } else {
        setError(data.message || 'Error al cargar los posts');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error loading posts:', err);
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
      console.error('Error loading categories:', err);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/blog/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // Recargar posts y stats
        await Promise.all([
          loadPosts(currentPage),
          loadStats()
        ]);
      } else {
        alert(data.message || 'Error al eliminar el post');
      }
    } catch (err) {
      alert('Error de conexión');
      console.error('Error deleting post:', err);
    }
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          published: !currentStatus,
          status: !currentStatus ? 'published' : 'draft'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Recargar posts y stats
        await Promise.all([
          loadPosts(currentPage),
          loadStats()
        ]);
      } else {
        alert(data.message || 'Error al actualizar el post');
      }
    } catch (err) {
      alert('Error de conexión');
      console.error('Error updating post:', err);
    }
  };

  const getStatusBadge = (status: string, published: boolean) => {
    if (published && status === 'published') {
      return <Badge variant="primary">Publicado</Badge>;
    } else if (status === 'draft') {
      return <Badge variant="warning">Borrador</Badge>;
    } else if (status === 'archived') {
      return <Badge variant="danger">Archivado</Badge>;
    }
    return <Badge variant="default">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Administra los artículos de tu blog
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/admin/blog/view">
            <Button variant="secondary">
              👁️ Vista pública
            </Button>
          </Link>
          <Link href="/admin/blog/categories">
            <Button variant="secondary">
              Gestionar categorías
            </Button>
          </Link>
          <Link href="/admin/blog/create">
            <Button>
              + Crear artículo
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Posts
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPosts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-4h6m-6-8h6" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Publicados
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.publishedPosts}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Borradores
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.draftPosts}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Vistas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalViews?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <Input
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos los estados</option>
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
              <option value="archived">Archivado</option>
            </select>
          </div>

          {/* Filtro por categoría */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedStatus('');
                setSelectedCategory('');
                setSearchTerm('');
              }}
              className="w-full"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de posts */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Cargando posts...</p>
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
            <Button onClick={() => loadPosts()}>
              Reintentar
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-4h6m-6-8h6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay posts
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm || selectedStatus || selectedCategory
                ? 'No se encontraron posts con los filtros aplicados.'
                : 'Aún no has creado ningún post.'}
            </p>
            <Link href="/admin/blog/create">
              <Button>
                Crear primer post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vistas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {post.coverImage && (
                          <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="flex-grow min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Por {post.author.name} • {post.readingTime} min lectura
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(post.status, post.published)}
                    </td>
                    <td className="px-6 py-4">
                      {post.categoryInfo && (
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: post.categoryInfo.color || '#6b7280' }}
                        >
                          {post.categoryInfo.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {post.publishedAt ? (
                        <div>
                          <div>{formatDate(post.publishedAt)}</div>
                          <div className="text-xs">{getRelativeTime(post.publishedAt)}</div>
                        </div>
                      ) : (
                        <div>
                          <div>{formatDate(post.createdAt)}</div>
                          <div className="text-xs">Borrador</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{post.views}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {post.published && (
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button size="sm" variant="secondary">
                              Ver
                            </Button>
                          </Link>
                        )}
                        
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        
                        <Button
                          size="sm"
                          variant={post.published ? "warning" : "primary"}
                          onClick={() => handleTogglePublish(post.id, post.published)}
                        >
                          {post.published ? 'Despublicar' : 'Publicar'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeletePost(post.id)}
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

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={currentPage <= 1}
                onClick={() => loadPosts(currentPage - 1)}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={currentPage >= totalPages}
                onClick={() => loadPosts(currentPage + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
