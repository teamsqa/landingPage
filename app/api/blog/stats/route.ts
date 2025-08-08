import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

// GET - Obtener estadísticas del blog
export async function GET() {
  try {
    const [postsSnapshot, categoriesSnapshot] = await Promise.all([
      adminDb.collection('blogPosts').get(),
      adminDb.collection('blogCategories').get()
    ]);

    const posts = postsSnapshot.docs.map((doc: any) => doc.data());
    
    const stats = {
      totalPosts: posts.length,
      publishedPosts: posts.filter((post: any) => post.published).length,
      draftPosts: posts.filter((post: any) => post.status === 'draft').length,
      archivedPosts: posts.filter((post: any) => post.status === 'archived').length,
      totalViews: posts.reduce((sum: number, post: any) => sum + (post.views || 0), 0),
      totalLikes: posts.reduce((sum: number, post: any) => sum + (post.likes || 0), 0),
      categoriesCount: categoriesSnapshot.size
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener las estadísticas', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
