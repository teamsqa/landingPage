import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import { BlogCategory, BLOG_DEFAULT_CATEGORIES } from '@/app/types/blog';

// GET - Obtener todas las categorías
export async function GET() {
  try {
    const snapshot = await adminDb.collection('blogCategories').orderBy('name').get();
    
    let categories: BlogCategory[] = [];
    
    if (snapshot.empty) {
      // Si no hay categorías, crear las por defecto
      const batch = adminDb.batch();
      
      for (const defaultCategory of BLOG_DEFAULT_CATEGORIES) {
        const docRef = adminDb.collection('blogCategories').doc(defaultCategory.id);
        batch.set(docRef, defaultCategory);
      }
      
      await batch.commit();
      categories = BLOG_DEFAULT_CATEGORIES;
    } else {
      categories = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      } as BlogCategory));
    }

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener las categorías', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva categoría
export async function POST(request: Request) {
  try {
    const categoryData = await request.json();

    // Validar datos requeridos
    if (!categoryData.name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'El nombre de la categoría es requerido' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    
    // Generar slug si no se proporciona
    const slug = categoryData.slug || categoryData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Verificar que el slug no exista
    const existingCategory = await adminDb.collection('blogCategories').where('slug', '==', slug).get();
    if (!existingCategory.empty) {
      return NextResponse.json(
        { success: false, message: 'Ya existe una categoría con este nombre' },
        { status: 400 }
      );
    }

    const category: Omit<BlogCategory, 'id'> = {
      name: categoryData.name.trim(),
      slug,
      description: categoryData.description?.trim() || '',
      color: categoryData.color || '#6b7280',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection('blogCategories').add(category);
    
    const createdCategory: BlogCategory = {
      id: docRef.id,
      ...category
    };

    return NextResponse.json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: createdCategory
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog category:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear la categoría', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
