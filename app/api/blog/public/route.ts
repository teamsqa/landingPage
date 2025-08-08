import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { BlogPost } from '@/app/types/blog';
import { createCachedResponse } from '@/app/lib/api-cache-middleware';

// Cache local para posts y categorías
let cachedPosts: any = null;
let cachedCategories: Map<string, any> = new Map();
let cacheTimestamp: number = 0;
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutos

// GET - Obtener posts públicos para la landing page
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '6'), 20);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured') === 'true';
    const now = Date.now();

    // Generar cache key único para esta consulta
    const cacheKey = `${page}-${limit}-${category || ''}-${featured}`;
    
    // Verificar cache local
    if (cachedPosts && (now - cacheTimestamp) < CACHE_DURATION) {
      const cachedResult = cachedPosts[cacheKey];
      if (cachedResult) {
        return createCachedResponse(cachedResult, {
          maxAge: Math.floor((CACHE_DURATION - (now - cacheTimestamp)) / 1000),
          etag: `"blog-${cacheTimestamp}-${cacheKey}"`
        });
      }
    }

    // Construir query optimizada
    let query = adminDb.collection('blogPosts')
      .where('published', '==', true)
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc');

    // Para featured, obtener solo los más recientes
    if (featured) {
      query = query.limit(3);
    } else {
      // Aplicar paginación eficiente
      const offset = (page - 1) * limit;
      if (offset > 0) {
        // Usar cursor-based pagination en lugar de offset
        query = query.limit(limit + offset);
      } else {
        query = query.limit(limit);
      }
    }

    const snapshot = await query.get();
    let docs = snapshot.docs;

    // Si hay offset, aplicar skip después de la consulta
    if (!featured && (page - 1) * limit > 0) {
      docs = docs.slice((page - 1) * limit);
    }

    const posts: BlogPost[] = [];

    // Procesar posts en paralelo para mejor rendimiento
    const postPromises = docs.map(async (doc: any) => {
      const data = doc.data();
      
      // Obtener información de la categoría con cache
      let categoryInfo = null;
      if (data.category) {
        // Verificar cache de categorías
        if (cachedCategories.has(data.category)) {
          categoryInfo = cachedCategories.get(data.category);
        } else {
          const categoryDoc = await adminDb.collection('blogCategories').doc(data.category).get();
          if (categoryDoc.exists) {
            categoryInfo = { id: categoryDoc.id, ...categoryDoc.data() };
            cachedCategories.set(data.category, categoryInfo);
          }
        }
      }

      return {
        id: doc.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        author: data.author,
        publishedAt: data.publishedAt,
        createdAt: data.createdAt,
        tags: data.tags || [],
        category: data.category,
        categoryInfo,
        readingTime: data.readingTime || 5,
        // No incluir contenido completo para optimizar
        content: featured ? undefined : data.excerpt || ''
      } as BlogPost;
    });

    const resolvedPosts = await Promise.all(postPromises);

    // Filtrar por categoría si se especifica (más eficiente post-query)
    let filteredPosts = resolvedPosts;
    if (category) {
      filteredPosts = resolvedPosts.filter(post => post.category === category);
    }

    // Construir respuesta
    const responseData = {
      success: true,
      data: {
        posts: featured ? filteredPosts.slice(0, 3) : filteredPosts,
        ...(featured ? {} : {
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredPosts.length / limit),
            totalCount: filteredPosts.length,
            hasNextPage: page * limit < filteredPosts.length,
            hasPrevPage: page > 1,
            limit
          }
        })
      }
    };

    // Actualizar cache local
    if (!cachedPosts || (now - cacheTimestamp) > CACHE_DURATION) {
      cachedPosts = {};
      cacheTimestamp = now;
    }
    cachedPosts[cacheKey] = responseData;

    return createCachedResponse(responseData, {
      maxAge: Math.floor(CACHE_DURATION / 1000),
      etag: `"blog-${cacheTimestamp}-${cacheKey}"`
    });

  } catch (error) {
    console.error('Error fetching public blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los posts', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
