// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "finwise-dr658",
  appId: "1:123107038301:web:3f419532e44581a9e0e9b4",
  storageBucket: "finwise-dr658.firebasestorage.app",
  apiKey: "AIzaSyD7rIhdfH_Z26-2ga7FetWPI3I1uU0wY-A",
  authDomain: "finwise-dr658.firebaseapp.com",
  messagingSenderId: "123107038301",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
