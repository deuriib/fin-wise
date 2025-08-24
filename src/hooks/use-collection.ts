// src/hooks/use-collection.ts
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, QueryDocumentSnapshot, DocumentData, orderBy, query } from 'firebase/firestore';

export function useCollection<T>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) {
        setData([]);
        setLoading(false);
        return;
    };
    
    let collectionQuery = query(collection(db, path));
    
    // Specific ordering for transactions
    if (path.includes('transactions')) {
      collectionQuery = query(collection(db, path), orderBy('date', 'desc'));
    }

    const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
      const result: T[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        result.push({ id: doc.id, ...doc.data() } as T);
      });
      setData(result);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching collection:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]);

  return { data, loading };
}
