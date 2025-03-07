import { NextResponse } from 'next/server';
import { adminAuth } from '@/app/lib/firebase-admin';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from '@/app/lib/firebase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In production, verify with Firebase Auth
    if (!adminAuth) {
      throw new Error('Firebase Admin Auth not initialized');
    }

    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const customToken = await adminAuth.createCustomToken(user.uid, {
      role: 'admin',
      timestamp: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      token: customToken
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, message: 'Credenciales inválidas' },
      { status: 401 }
    );
  }
}