// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Fallback for local development without service account key
    // This requires FIREBASE_CONFIG env var to be set (e.g., by Firebase emulators or gcloud CLI)
     console.warn("Firebase Admin SDK is not initialized with a service account. Some features may not work in a deployed environment.");
    admin.initializeApp();
  }
}

const db = admin.firestore();

export { admin, db };
