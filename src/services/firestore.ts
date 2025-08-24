// src/services/firestore.ts
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

// Generic add document function
export const addDocument = async <T>(path: string, data: T) => {
  const docRef = await addDoc(collection(db, path), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Generic update document function
export const updateDocument = async <T>(path: string, id: string, data: Partial<T>) => {
  const docRef = doc(db, path, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Generic delete document function
export const deleteDocument = async (path: string, id: string) => {
  const docRef = doc(db, path, id);
  await deleteDoc(docRef);
};
