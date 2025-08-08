import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { BlogPost, BlogPostUpdate } from '@/app/types/blog';
import { generateSlug, calculateReadingTime, generateExcerpt, validateBlogPost } from '@/app/lib/blog-utils';

// GET - Obtener un post específico por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const docRef = adminDb.collection('blogPosts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    const data = doc.data();
    
    // Obtener información de la categoría
    let categoryInfo = null;
    if (data?.category) {
      const categoryDoc = await adminDb.collection('blogCategories').doc(data.category).get();
      if (categoryDoc.exists) {
        categoryInfo = { id: categoryDoc.id, ...categoryDoc.data() };
      }
    }

    const post: BlogPost = {
      id: doc.id,
      ...data,
      categoryInfo
    } as BlogPost;

    return NextResponse.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener el post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un post existente
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData: BlogPostUpdate = await request.json();

    const docRef = adminDb.collection('blogPosts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    const currentData = doc.data() as BlogPost;
    const now = new Date().toISOString();

    // Preparar datos actualizados
    let updatedPost: Partial<BlogPost> = {
      ...updateData,
      updatedAt: now,
    };

    // Actualizar slug si el título cambió
    if (updateData.title && updateData.title !== currentData.title) {
      let newSlug = generateSlug(updateData.title);
      
      // Verificar que el nuevo slug no exista en otro post
      const existingPost = await adminDb.collection('blogPosts')
        .where('slug', '==', newSlug)
        .where('__name__', '!=', id)
        .get();
      
      if (!existingPost.empty) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      
      updatedPost.slug = newSlug;
    }

    // Actualizar excerpt si el contenido cambió
    if (updateData.content) {
      updatedPost.excerpt = updateData.excerpt || generateExcerpt(updateData.content);
      updatedPost.readingTime = calculateReadingTime(updateData.content);
    }

    // Actualizar publishedAt si se está publicando por primera vez
    if (updateData.published && !currentData.published) {
      updatedPost.publishedAt = updatedPost.publishedAt || now;
    }

    // Validar datos actualizados
    const fullUpdatedData = { ...currentData, ...updatedPost };
    const validation = validateBlogPost(fullUpdatedData);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: 'Datos inválidos', errors: validation.errors },
        { status: 400 }
      );
    }

    // Actualizar en Firestore
    await docRef.update(updatedPost);

    // Obtener el post actualizado con la información de categoría
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();
    
    let categoryInfo = null;
    if (updatedData?.category) {
      const categoryDoc = await adminDb.collection('blogCategories').doc(updatedData.category).get();
      if (categoryDoc.exists) {
        categoryInfo = { id: categoryDoc.id, ...categoryDoc.data() };
      }
    }

    const post: BlogPost = {
      id: updatedDoc.id,
      ...updatedData,
      categoryInfo
    } as BlogPost;

    return NextResponse.json({
      success: true,
      message: 'Post actualizado exitosamente',
      data: post
    });

  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar el post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const docRef = adminDb.collection('blogPosts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el post
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Post eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Error al eliminar el post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH - Incrementar vistas o likes
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    const docRef = adminDb.collection('blogPosts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    let updateData: any = {};

    if (action === 'increment_views') {
      updateData.views = (doc.data()?.views || 0) + 1;
    } else if (action === 'increment_likes') {
      updateData.likes = (doc.data()?.likes || 0) + 1;
    } else if (action === 'decrement_likes') {
      updateData.likes = Math.max(0, (doc.data()?.likes || 0) - 1);
    } else {
      return NextResponse.json(
        { success: false, message: 'Acción no válida' },
        { status: 400 }
      );
    }

    await docRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: 'Post actualizado exitosamente',
      data: updateData
    });

  } catch (error) {
    console.error('Error updating blog post stats:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar estadísticas del post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
