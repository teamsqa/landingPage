import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { BlogPost, BlogPostCreate, BlogPostUpdate } from '@/app/types/blog';
import { generateSlug, calculateReadingTime, generateExcerpt, validateBlogPost } from '@/app/lib/blog-utils';

// GET - Obtener todos los posts de blog con paginación y filtros
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const author = url.searchParams.get('author');
    const published = url.searchParams.get('published');
    const search = url.searchParams.get('search');

    let query = adminDb.collection('blogPosts');

    // Aplicar filtros
    if (status) {
      query = query.where('status', '==', status);
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    if (author) {
      query = query.where('author.id', '==', author);
    }

    if (published !== null && published !== undefined) {
      query = query.where('published', '==', published === 'true');
    }

    // Ordenar por fecha de publicación o creación
    query = query.orderBy('createdAt', 'desc');

    // Contar total de documentos
    const totalSnapshot = await query.get();
    const totalCount = totalSnapshot.size;

    // Aplicar paginación
    const offset = (page - 1) * limit;
    if (offset > 0) {
      const lastVisible = totalSnapshot.docs[offset - 1];
      query = query.startAfter(lastVisible);
    }
    query = query.limit(limit);

    const snapshot = await query.get();
    let posts: BlogPost[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Obtener información de la categoría
      let categoryInfo = null;
      if (data.category) {
        const categoryDoc = await adminDb.collection('blogCategories').doc(data.category).get();
        if (categoryDoc.exists) {
          categoryInfo = { id: categoryDoc.id, ...categoryDoc.data() };
        }
      }

      posts.push({
        id: doc.id,
        ...data,
        categoryInfo
      } as BlogPost);
    }

    // Aplicar búsqueda de texto si se proporciona
    if (search) {
      const searchTerm = search.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los posts', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo post de blog
export async function POST(request: Request) {
  try {
    const postData: BlogPostCreate = await request.json();

    // Validar datos
    const validation = validateBlogPost(postData);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: 'Datos inválidos', errors: validation.errors },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    
    // Generar slug único
    let slug = generateSlug(postData.title);
    const existingPost = await adminDb.collection('blogPosts').where('slug', '==', slug).get();
    
    if (!existingPost.empty) {
      slug = `${slug}-${Date.now()}`;
    }

    // Generar excerpt si no se proporciona
    const excerpt = postData.excerpt || generateExcerpt(postData.content);

    // Calcular tiempo de lectura
    const readingTime = calculateReadingTime(postData.content);

    // Preparar datos del post
    const blogPost: Omit<BlogPost, 'id' | 'categoryInfo'> = {
      ...postData,
      slug,
      excerpt,
      readingTime,
      views: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    };

    // Solo agregar publishedAt si el post está publicado
    if (postData.published) {
      blogPost.publishedAt = postData.publishedAt || now;
    }

    // Guardar en Firestore
    const docRef = await adminDb.collection('blogPosts').add(blogPost);

    // Obtener el post creado con la información de categoría
    const createdDoc = await docRef.get();
    const createdData = createdDoc.data();
    
    let categoryInfo = null;
    if (createdData?.category) {
      const categoryDoc = await adminDb.collection('blogCategories').doc(createdData.category).get();
      if (categoryDoc.exists) {
        categoryInfo = { id: categoryDoc.id, ...categoryDoc.data() };
      }
    }

    const createdPost: BlogPost = {
      id: docRef.id,
      ...createdData,
      categoryInfo
    } as BlogPost;

    return NextResponse.json({
      success: true,
      message: 'Post creado exitosamente',
      data: createdPost
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear el post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
