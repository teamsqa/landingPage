import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
let adminDb: any;
let adminAuth: any;

try {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      })
    });
  }
  adminDb = getFirestore();
  adminAuth = getAuth();
} catch (error) {
  // Firebase Admin initialization error - logging disabled for security
}

export { adminDb, adminAuth };