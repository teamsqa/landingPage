
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email es requerido' },
        { status: 400 }
      );
    }

    await addDoc(collection(db, 'subscribers'), {
      email,
      subscribedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: 'Suscripción exitosa' });
  } catch (error: any) {
    console.error('Error al suscribir:', error);
    return NextResponse.json(
      { success: false, message: 'Error al suscribir', error: error.message },
      { status: 500 }
    );
  }
}