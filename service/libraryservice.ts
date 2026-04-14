import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase"; //import firebase yang ada di firebase.ts

export type LibraryStatus = "readLater" | "favorite" | "done";

export type libraryItem = {
  // deteksi library yang ada di firebase, dan jangan diubah
  id?: string;
  userId: string;
  bookId: string;
  status: LibraryStatus;
  saveAt?: any;
};

export const saveToLibrary = async (
  userId: string,
  bookId: string,
  status: LibraryStatus,
  bookInfo: {
    bookTitle: string;
    bookAuthor: string;
    bookCover: string;
    bookCategory: string;
  },
) => {
  try {
    // cek dulu apakah buku sudah ada di library user
    const q = query(
      collection(db, "library"),
      where("userId", "==", userId),
      where("bookId", "==", bookId),
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      const docId = existing.docs[0].id;
      await updateDoc(doc(db, "library", docId), { status });
      return docId;
    }
    const docRef = await addDoc(collection(db, "library"), {
      userId,
      bookId,
      status,
      ...bookInfo,
      saveAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("gagal kesimpan, koe kudu jajal maaning");
    throw error;
  }
};
export const getUserLibrary = async (
  userId: string,
): Promise<libraryItem[]> => {
  try {
    const q = query(collection(db, "library"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as libraryItem[];
  } catch (error) {
    console.error("Gagal ambil library:", error);
    throw error;
  }
};
// ambil library berdasarkan status
export const getLibraryByStatus = async (
  userId: string,
  status: LibraryStatus,
): Promise<libraryItem[]> => {
  try {
    const q = query(
      collection(db, "library"),
      where("userId", "==", userId),
      where("status", "==", status),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as libraryItem[];
  } catch (error) {
    console.error("gagal ambil", error);
    throw error;
  }
};
// update status buku di library
export const updateLibraryStatus = async (
  libraryId: string,
  Status: LibraryStatus,
) => {
  try {
    await updateDoc(doc(db, "library", libraryId), { Status });
  } catch (error) {
    console.error("gagal update jajal maning", error);
    throw error;
  }
};
// hapus buku di library
export const romoveFromLibrary = async (userId: string, bookId: string) => {
  try {
    const q = query(
      collection(db, "library"),
      where("userId", "==", userId),
      where("bookId", "==", bookId),
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(doc(db, "library", snapshot.docs[0].id));
    }
  } catch (error) {
    console.error("gagal hapus, jajal maning", error);
    throw error;
  }
};
//cek apakah buku sudah di library
export const isBookInLibrary = async (
  userId: string,
  bookId: string,
): Promise<libraryItem | null> => {
  try {
    const q = query(
      collection(db, "library"),
      where("userId", "==", userId),
      where("bookId", "==", bookId),
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      } as libraryItem;
    }
    return null;
  } catch (error) {
    console.error("data tidak ada, makane query sing bener");
    throw error;
  }
};
