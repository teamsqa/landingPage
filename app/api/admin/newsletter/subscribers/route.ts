import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    // Obtener suscriptores de Firestore
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef, orderBy('subscribedAt', 'desc'));
    const snapshot = await getDocs(q);

    const subscribers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      status: doc.data().status || 'active' // Por defecto activo si no existe el campo
    }));

    return NextResponse.json({ 
      success: true, 
      subscribers,
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length
    });

  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST para actualizar el estado de un suscriptor
export async function POST(request: NextRequest) {
  try {
    const { subscriberId, status } = await request.json();

    if (!subscriberId || !['active', 'unsubscribed'].includes(status)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Actualizar estado del suscriptor
    const subscriberRef = doc(db, 'subscribers', subscriberId);
    await updateDoc(subscriberRef, {
      status,
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true, message: 'Estado actualizado' });

  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
