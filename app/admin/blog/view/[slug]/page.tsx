import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/app/types/blog';
import { Card, Button, Badge } from '@/app/ui';
import { formatDate, getRelativeTime } from '@/app/lib/blog-utils';
import { processMarkdown } from '@/app/lib/markdown';
import AdminLayout from '@/app/admin/components/AdminLayout';

interface AdminBlogPostViewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog/public/${slug}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success && data.data?.post ? data.data.post : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function AdminBlogPostViewPage({ params }: AdminBlogPostViewPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header de administrador */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vista del Post
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Previsualización de "{post.title}"
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href={`/admin/blog/edit/${post.id}`}>
              <Button variant="secondary">
                ✏️ Editar
              </Button>
            </Link>
            <Link href="/admin/blog/view">
              <Button variant="secondary">
                ← Volver al blog
              </Button>
            </Link>
          </div>
        </div>

      {/* Stats del post */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {post.published ? '✅ Publicado' : '📝 Borrador'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vistas</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {(post.views || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {(post.likes || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lectura</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {post.readingTime} min
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contenido del post */}
      <Card className="overflow-hidden">
        {/* Hero Section */}
        <div className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Categoría */}
              {post.categoryInfo && (
                <div className="mb-4">
                  <span 
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white"
                    style={{
                      backgroundColor: post.categoryInfo.color || '#6b7280'
                    }}
                  >
                    {post.categoryInfo.name}
                  </span>
                </div>
              )}

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                {post.title}
              </h1>

              {/* Extracto */}
              {post.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Meta información */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mb-8">
                {/* Autor */}
                {post.author && (
                  <>
                    <div className="flex items-center space-x-3">
                      {post.author.avatar && (
                        <div className="relative w-10 h-10">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name || 'Autor'}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {post.author.name || 'Autor'}
                        </div>
                        <div className="text-sm">
                          Autor
                        </div>
                      </div>
                    </div>

                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                  </>
                )}

                {/* Fecha */}
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={post.publishedAt || post.createdAt}>
                    {formatDate(post.publishedAt || post.createdAt)}
                  </time>
                </div>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

                {/* Tiempo de lectura */}
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readingTime} min de lectura</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Imagen de portada */}
        {post.coverImage && (
          <div className="py-8">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido del post */}
        <div className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <article className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: processMarkdown(post.content) }}
                  className="blog-content" 
                />
              </article>
            </div>
          </div>
        </div>
      </Card>

      {/* Información adicional del admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Información del Post
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">ID:</span>
              <span className="font-mono text-gray-900 dark:text-white">{post.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Slug:</span>
              <span className="font-mono text-gray-900 dark:text-white">{post.slug}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Estado:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {post.published ? 'Publicado' : 'Borrador'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Creado:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Actualizado:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(post.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            SEO y Metadata
          </h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400 block mb-1">Meta Title:</span>
              <span className="text-gray-900 dark:text-white">
                {post.seo.metaTitle || post.title}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600 dark:text-gray-400 block mb-1">Meta Description:</span>
              <span className="text-gray-900 dark:text-white">
                {post.seo.metaDescription || post.excerpt}
              </span>
            </div>
            
            {post.seo.keywords && post.seo.keywords.length > 0 && (
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-1">Keywords:</span>
                <div className="flex flex-wrap gap-1">
                  {post.seo.keywords.map((keyword, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      </div>
    </AdminLayout>
  );
}

// Generar metadata dinámica
export async function generateMetadata({ params }: AdminBlogPostViewPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post no encontrado | Admin',
      description: 'El artículo que buscas no existe o ha sido removido.'
    };
  }

  return {
    title: `${post.title} | Admin Blog`,
    description: post.excerpt || post.title,
  };
}
