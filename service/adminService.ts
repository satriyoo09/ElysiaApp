import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getCountFromServer,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { books } from "./bookservice";
import { db } from "./firebase";
import { notifications } from "./notificationService";

// TYPE //
export type dasbordStats = {
  totalBooks: number;
  totalUsers: number;
  TotalNotifications: number;
  TotalrecommendedBooks: number;
};
export type userData = {
  uid: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createAt: any;
};

// Ambil Statistik Dasbord //
export const getDasboardStats = async (): Promise<dasbordStats> => {
  try {
    const [books, users, notifications, recommendedBooks] = await Promise.all([
      getCountFromServer(collection(db, "books")),
      getCountFromServer(collection(db, "users")),
      getCountFromServer(collection(db, "notifications")),
      getCountFromServer(
        query(collection(db, "books"), where("isRecommended", "==", true)),
      ),
    ]);
    return {
      totalBooks: books.data().count,
      totalUsers: users.data().count,
      TotalNotifications: notifications.data().count,
      TotalrecommendedBooks: recommendedBooks.data().count,
    };
  } catch (error) {
    console.error("Gagal ambil data dasbord:", error);
    throw error;
  }
};
// ambil semua user
export const getAllUsers = async (): Promise<userData[]> => {
  try {
    const q = query(collection(db, "users"), orderBy("createAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...(doc.data() as Omit<userData, "uid">),
    })) as userData[];
  } catch (error) {
    console.error("Gagal ambil data user:", error);
    throw error;
  }
};
// ubah role user
export const updateUserRole = async (
  userId: string,
  role: "user" | "admin",
) => {
  try {
    await updateDoc(doc(db, "users", userId), { role });
  } catch (error) {
    console.error("Gagal ubah role user:", error);
    throw error;
  }
};
// hapus akun user dari databese
export const deleteUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.error("Gagal hapus user:", error);
    throw error;
  }
};
//tambah buku baru
export const addBook = async (bookData: Omit<books, "id" | "createAt">) => {
  try {
    const docRef = await addDoc(collection(db, "books"), {
      ...bookData,
      createAt: serverTimestamp(),
    });
    return docRef.id; // kembalikan id dari buku yang baru ditambahkan
  } catch (error) {
    console.error("Gagal tambah buku:", error);
    throw error;
  }
};
//edit buku di databese
export const updateBook = async (bookId: string, Data: Partial<books>) => {
  try {
    await updateDoc(doc(db, "books", bookId), {
      ...Data,
      updateAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Gagal update buku:", error);
    throw error;
  }
};
// hapus buku dari database
export const deleteBook = async (bookId: string) => {
  try {
    await deleteDoc(doc(db, "books", bookId));
  } catch (error) {
    console.error("Gagal hapus buku:", error);
    throw error;
  }
};
//setting rekomendasi buku
export const toggleRecomendation = async (bookId: string, status: boolean) => {
  try {
    await updateDoc(doc(db, "books", bookId), {
      isRecommended: status,
    });
  } catch (error) {
    console.error("Gagal update rekomendasi buku:", error);
    throw error;
  }
};
//kirim notifikasi
export const sendNotification = async (
  data: Omit<notifications, "id" | "createAt" | "isRead">,
) => {
  try {
    const docRef = await addDoc(collection(db, "notifications"), {
      ...data,
      isRead: false,
      createAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Gagal kirim notifikasi:", error);
    throw error;
  }
};
//hapus notifikasi
export const deleteNotification = async (notifId: string) => {
  try {
    await deleteDoc(doc(db, "notifations", notifId));
  } catch (error) {
    console.error("Gagal hapus notifikasi:", error);
    throw error;
  }
};
//tandai notifikasi
export const markAsRead = async (notifId: string) => {
  try {
    await updateDoc(doc(db, "notifications", notifId), {
      isRead: true,
    });
  } catch (error) {
    console.error("Gagal tandai notifikasi:", error);
    throw error;
  }
};
//ambil semua notifikasi
export const getAllNotifications = async (): Promise<notifications[]> => {
  try {
    const q = query(
      collection(db, "notifications"),
      orderBy("createAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as notifications[];
  } catch (error) {
    console.error("Gagal ambil notifikasi:", error);
    throw error;
  }
};
