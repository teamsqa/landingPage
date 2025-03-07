import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const firebaseConfig = {
  credential: process.env.FIREBASE_PRIVATE_KEY ? cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }) : undefined,
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
};

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  try {
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig);
      console.log('Firebase Admin initialized successfully');
      return app;
    }
    return getApps()[0];
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

// Export initialized services
export const firebaseApp = process.env.NODE_ENV === 'production' ? initializeFirebaseAdmin() : null;
export const firebaseDb = process.env.NODE_ENV === 'production' ? getFirestore() : null;
export const firebaseAuth = process.env.NODE_ENV === 'production' ? getAuth() : null;

// Validate Firebase configuration
export function validateFirebaseConfig() {
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase configuration variables: ${missingVars.join(', ')}`
    );
  }

  return true;
}

// Helper function to check if Firebase is initialized
export function isFirebaseInitialized() {
  return getApps().length > 0;
}