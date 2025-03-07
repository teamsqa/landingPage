import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';
import type { CollectionReference, QuerySnapshot } from 'firebase-admin/firestore';

export async function GET() {
  try {
    // Obtenemos las colecciones disponibles en la base de datos
    const collections: CollectionReference[] = await adminDb.listCollections();
    
    // Para cada colección, se consulta un solo documento para saber si está vacía
    const collectionsWithDocs = await Promise.all(
      collections.map(async (collection) => {
        const snapshot: QuerySnapshot = await collection.limit(1).get();
        return {
          id: collection.id,
          path: collection.path,
          isEmpty: snapshot.empty
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: collectionsWithDocs
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error listing collections:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener las colecciones',
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
