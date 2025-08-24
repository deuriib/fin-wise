// src/hooks/use-document.ts
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, DocumentSnapshot, DocumentData } from 'firebase/firestore';

export function useDocument<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }
    
    const docRef = doc(db, path);

    const unsubscribe = onSnapshot(docRef, (docSnap: DocumentSnapshot<DocumentData>) => {
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        console.log("No such document!");
        setData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching document:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]);

  return { data, loading };
}
