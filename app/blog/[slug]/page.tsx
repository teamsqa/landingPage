import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/app/types/blog';
import { Card, Button, Badge } from '@/app/ui';
import { formatDate, getRelativeTime } from '@/app/lib/blog-utils';
import { processMarkdown } from '@/app/lib/markdown';
import ShareButtons from '@/app/components/ShareButtons';

interface BlogPostPageProps {
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

async function getRelatedPosts(categoryId: string, currentPostId: string, limit: number = 3): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog/public?category=${categoryId}&limit=${limit}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const posts = data.success && data.data?.posts ? data.data.posts : [];
    
    // Filtrar el post actual y devolver solo los relacionados
    return posts.filter((post: BlogPost) => post.id !== currentPostId);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.id, 4);

  // Generar JSON-LD para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
      image: post.author.avatar
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'TeamsQA',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/Logo.svg`
      }
    },
    articleSection: post.categoryInfo?.name,
    keywords: post.tags?.join(', '),
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${post.readingTime}M`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="mb-8">
                <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>
                    <Link href="/" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li className="text-gray-900 dark:text-white">
                    {post.title}
                  </li>
                </ol>
              </nav>

              {/* Categoría */}
              {post.categoryInfo && (
                <div className="mb-4">
                  <Link 
                    href={`/blog?category=${post.category}`}
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: post.categoryInfo.color || '#6b7280'
                    }}
                  >
                    {post.categoryInfo.name}
                  </Link>
                </div>
              )}

              {/* Título */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
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
        </section>

        {/* Imagen de portada */}
        {post.coverImage && (
          <section className="py-8">
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
          </section>
        )}

        {/* Contenido del post */}
        <section className="py-12">
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
        </section>

        {/* Compartir */}
        <section className="py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ¿Te gustó este artículo?
                </h3>
                
                <ShareButtons 
                  title={post.title}
                  url={typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Posts relacionados */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                  Artículos relacionados
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.slice(0, 3).map((relatedPost) => (
                    <Card key={relatedPost.id} variant="elevated" hover className="p-0 overflow-hidden bg-white dark:bg-gray-800">
                      {relatedPost.coverImage && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
                          <Link 
                            href={`/blog/${relatedPost.slug}`} 
                            className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
                          >
                            {relatedPost.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{getRelativeTime(relatedPost.publishedAt || relatedPost.createdAt)}</span>
                          <span>{relatedPost.readingTime} min</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link href="/blog">
                    <Button>
                      Ver todos los artículos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA final */}
        <section className="py-16 bg-lime-600 dark:bg-lime-700">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                ¿Te gustaría aprender más sobre QA y automatización?
              </h2>
              <p className="text-lime-100 text-lg mb-8">
                Explora nuestros cursos especializados y lleva tus habilidades al siguiente nivel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#courses">
                  <Button variant="secondary" size="lg">
                    Ver cursos
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-lime-600">
                    Más artículos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Generar metadata dinámica
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
      description: 'El artículo que buscas no existe o ha sido removido.'
    };
  }

  return {
    title: `${post.title} | TeamsQA Blog`,
    description: post.excerpt || post.title,
    keywords: post.tags?.join(', '),
    authors: post.author?.name ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}
