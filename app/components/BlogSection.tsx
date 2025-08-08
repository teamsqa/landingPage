'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/app/types/blog';
import { Badge, Button, Card } from '@/app/ui';
import { formatDate, getRelativeTime } from '@/app/lib/blog-utils';

interface BlogSectionProps {
  featured?: boolean;
  maxPosts?: number;
  showViewAll?: boolean;
  posts?: BlogPost[]; // Posts pre-cargados desde el servidor
}

export default function BlogSection({ 
  featured = true, 
  maxPosts = 6, 
  showViewAll = true,
  posts: initialPosts = []
}: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(!initialPosts.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si ya tenemos posts iniciales, no hacer fetch
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
      setLoading(false);
      return;
    }

    // Solo hacer fetch si no hay posts iniciales
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const endpoint = featured 
          ? '/api/blog/public?featured=true'
          : `/api/blog/public?limit=${maxPosts}`;
          
        const response = await fetch(endpoint, {
          headers: {
            'Cache-Control': 'max-age=180' // 3 minutos
          }
        });
        const data = await response.json();

        if (data.success) {
          setPosts(data.data.posts || []);
        } else {
          setError(data.message || 'Error al cargar los posts');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [featured, maxPosts, initialPosts]);

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
            priority={featured} // Prioridad para posts destacados
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

        {/* Título con enlace funcional */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
          <Link 
            href={`/blog/${post.slug}`} 
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

        {/* CTA funcional */}
        <Link href={`/blog/${post.slug}`} className="block">
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

  // Mientras carga, mostrar skeleton (solo si no hay posts iniciales)
  if (loading && !initialPosts.length) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-64 mx-auto rounded mb-4"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-96 mx-auto rounded"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(featured ? 3 : 6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-xl mb-4"></div>
                <div className="space-y-4">
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Si hay error, no mostrar la sección
  if (error) {
    return null;
  }

  // Si no hay posts, no mostrar la sección
  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {featured ? 'Últimas publicaciones' : 'Blog'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Mantente al día con nuestras últimas noticias, tutoriales y consejos sobre automatización de pruebas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {showViewAll && posts.length > 0 && (
          <div className="text-center">
            <Link href="/blog">
              <Button size="lg" className="group">
                <span>Ver todos los artículos</span>
                <svg 
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
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
        )}
      </div>
    </section>
  );
}