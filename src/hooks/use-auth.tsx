// src/hooks/use-auth.tsx
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user exists in Firestore, if not, create them
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
          });
          // Seed initial categories for new user
          const categories = [
            { id: 'cat-1', name: 'Groceries', icon: 'ShoppingCart', color: '#FF6384' },
            { id: 'cat-2', name: 'Transport', icon: 'Car', color: '#36A2EB' },
            { id: 'cat-3', name: 'Housing', icon: 'Home', color: '#FFCE56' },
            { id: 'cat-4', name: 'Entertainment', icon: 'Film', color: '#4BC0C0' },
            { id: 'cat-5', name: 'Health', icon: 'HeartPulse', color: '#9966FF' },
            { id: 'cat-6', name: 'Salary', icon: 'Landmark', color: '#32CD32' },
            { id: 'cat-7', name: 'Utilities', icon: 'Lightbulb', color: '#FF9F40' },
            { id: 'cat-8', name: 'Dining Out', icon: 'Utensils', color: '#C9CBCF' },
          ];
          for (const category of categories) {
            await setDoc(doc(db, `users/${user.uid}/categories`, category.id), category);
          }
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
