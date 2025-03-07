import { NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { app } from '@/app/lib/firebase';

export async function POST() {
  try {
    const auth = getAuth(app);
    await auth.signOut();

    const response = NextResponse.json({
      success: true,
      message: 'Logout exitoso'
    });

    // Clear the admin token cookie
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { success: false, message: 'Error cerrando sesión' },
      { status: 500 }
    );
  }
}