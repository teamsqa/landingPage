import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { BlogPost } from '@/app/types/blog';

// GET - Obtener un post público por slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const snapshot = await adminDb.collection('blogPosts')
      .where('slug', '==', slug)
      .where('published', '==', true)
      .where('status', '==', 'published')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    // Obtener información de la categoría
    let categoryInfo = null;
    if (data.category) {
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

    // Incrementar las vistas
    await doc.ref.update({
      views: (data.views || 0) + 1
    });

    // Obtener posts relacionados simplificado (sin consulta compleja)
    const relatedSnapshot = await adminDb.collection('blogPosts')
      .where('published', '==', true)
      .limit(10)
      .get();

    const relatedPosts = [];
    for (const relatedDoc of relatedSnapshot.docs) {
      // Filter out the current post and check status, limit to 3
      if (relatedDoc.id !== doc.id && relatedDoc.data().status === 'published' && relatedPosts.length < 3) {
        const relatedData = relatedDoc.data();
        // Get category info for related post if available
        let relatedCategoryInfo = null;
        if (relatedData.category) {
          const relatedCategoryDoc = await adminDb.collection('blogCategories').doc(relatedData.category).get();
          if (relatedCategoryDoc.exists) {
            relatedCategoryInfo = { id: relatedCategoryDoc.id, ...relatedCategoryDoc.data() };
          }
        }
        
        relatedPosts.push({
          id: relatedDoc.id,
          title: relatedData.title,
          slug: relatedData.slug,
          excerpt: relatedData.excerpt,
          coverImage: relatedData.coverImage,
          publishedAt: relatedData.publishedAt,
          author: relatedData.author,
          readingTime: relatedData.readingTime,
          categoryInfo: relatedCategoryInfo
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        post: {
          ...post,
          views: post.views + 1
        },
        relatedPosts
      }
    });

  } catch (error) {
    console.error('Error fetching public blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener el post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
