import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

//type data notifikasi
export type notifications = {
  id: string;
  Title: string;
  massage: string;
  targetRole: "all" | "user" | "admin";
  isRead: boolean;
  createAt?: any;
};
//kirim notifikasi khusus admin
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
    console.error("gagal ngirim jajal maning", error);
    throw error;
  }
};
//ambil notifikasi khusus user
export const getUserNotifications = async (): Promise<notifications[]> => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("targetRole", "in", ["all", "user"]),
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
// AMBIL SEMUA NOTIFIKASI (khusus admin)
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
//tandai notifikasi yang sudah dibaca
export const markAsRead = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), {
      isRead: true,
    });
  } catch (error) {
    console.error("Gagal tandai notifikasi:", error);
    throw error;
  }
};
//hapus notifikasi khusus admin
export const deleteNotification = async (notificationId: string) => {
  try {
    await deleteDoc(doc(db, "notifications", notificationId));
  } catch (error) {
    console.error("Gagal hapus notifikasi:", error);
    throw error;
  }
};
