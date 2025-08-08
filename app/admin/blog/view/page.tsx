'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost, BlogCategory } from '@/app/types/blog';
import { Button, Input, Card, Badge } from '@/app/ui';
import { formatDate, getRelativeTime } from '@/app/lib/blog-utils';
import AdminLayout from '@/app/admin/components/AdminLayout';

export default function AdminBlogViewPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  // Función para cargar posts
  const fetchPosts = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9'
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`/api/blog/public?${params}`);
      const data = await response.json();

      if (data.success) {
        const newPosts = data.data.posts || [];
        
        if (append) {
          setPosts(prev => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        
        if (data.data.pagination) {
          setTotalPages(data.data.pagination.totalPages);
          setCurrentPage(data.data.pagination.currentPage);
        }
      } else {
        setError(data.message || 'Error al cargar los posts');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Cargar posts cuando cambien los filtros
  useEffect(() => {
    fetchPosts(1, false);
  }, [selectedCategory, searchTerm]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      fetchPosts(currentPage + 1, true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const PostCard = ({ post }: { post: BlogPost }) => (
    <Card key={post.id} variant="elevated" hover className="p-0 overflow-hidden bg-white dark:bg-gray-800">
      {/* Imagen de portada */}
      {post.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {post.categoryInfo && (
            <div className="absolute top-4 left-4">
              <span 
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white"
                style={{
                  backgroundColor: post.categoryInfo.color || '#6b7280'
                }}
              >
                {post.categoryInfo.name}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        {/* Categoría sin imagen */}
        {!post.coverImage && post.categoryInfo && (
          <div className="mb-3">
            <span 
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white"
              style={{
                backgroundColor: post.categoryInfo.color || '#6b7280'
              }}
            >
              {post.categoryInfo.name}
            </span>
          </div>
        )}

        {/* Título */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
          <Link 
            href={`/admin/blog/view/${post.slug}`} 
            className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        {/* Extracto */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta información */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            {/* Autor */}
            <div className="flex items-center space-x-2">
              {post.author.avatar && (
                <div className="relative w-6 h-6">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              )}
              <span>{post.author.name}</span>
            </div>
            
            {/* Tiempo de lectura */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readingTime} min</span>
            </div>
          </div>
          
          {/* Fecha */}
          <time dateTime={post.publishedAt} title={formatDate(post.publishedAt || post.createdAt)}>
            {getRelativeTime(post.publishedAt || post.createdAt)}
          </time>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* CTA */}
        <Link href={`/admin/blog/view/${post.slug}`} className="block">
          <Button variant="secondary" size="sm" fullWidth className="group">
            <span>Leer más</span>
            <svg 
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </Button>
        </Link>
      </div>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vista Pública del Blog
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Previsualiza cómo se ve tu blog para los visitantes
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/admin/blog">
              <Button variant="secondary">
                ← Volver al dashboard
              </Button>
            </Link>
          </div>
        </div>

      {/* Filtros */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <form onSubmit={handleSearch}>
              <Input
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </form>
          </div>

          {/* Filtro por categoría */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
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

          {/* Estado */}
          <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            Mostrando solo posts publicados
          </div>

          {/* Limpiar filtros */}
          <div>
            <Button
              variant="secondary"
              onClick={clearFilters}
              className="w-full"
              size="sm"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid de posts */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-0 overflow-hidden">
              <div className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full"></div>
                <div className="p-6 space-y-4">
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-5/6"></div>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded w-24"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error al cargar los posts
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron posts
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchTerm || selectedCategory 
              ? 'Intenta con otros términos de búsqueda o filtros.'
              : 'Aún no hay contenido publicado. ¡Crea tu primer post!'
            }
          </p>
          {(searchTerm || selectedCategory) ? (
            <Button onClick={clearFilters}>
              Ver todos los posts
            </Button>
          ) : (
            <Link href="/admin/blog/create">
              <Button>
                Crear primer post
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Grid de posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Cargar más */}
          {currentPage < totalPages && (
            <div className="text-center mt-12">
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                size="lg"
                className="group"
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Cargando...
                  </>
                ) : (
                  <>
                    <span>Cargar más artículos</span>
                    <svg 
                      className="w-5 h-5 ml-2 transform group-hover:translate-y-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
    </AdminLayout>
  );
}
