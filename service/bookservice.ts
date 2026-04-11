//import material yang dibutuhkan untuk mengelola data buku, jangan diubah-ubah
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
// import objek db dari file firebase, jangan diubah-ubah
import { db } from "./firebase";

// fungsi untuk menambahkan buku baru ke Firestore.
export type books = {
  id?: string;
  title: string;
  author: string;
  category: string;
  coverUrl: string;
  description: string;
  isRecommended: boolean;
  createAt?: any;
};
//tambah buku baru, khusus admin
export const addBook = async (bookData: Omit<books, "id" | "createAt">) => {
  const docRef = await addDoc(collection(db, "books"), {
    ...bookData,
    createAt: serverTimestamp(),
  });
  return docRef.id; // kembalikan id dari buku yang baru ditambahkan
};

// fungsi ambil semua buku dari firestore.
export const getallBooks = async (): Promise<books[]> => {
  try {
    const q = query(collection(db, "books"), orderBy("createAt", "desc")); // ambil semua buku dari databese.
    const snapshot = await getDocs(q); // snapshot untuk menyimpan hasil query yang diambil dari firestore, await digunakan untuk menuggu hasil query, getdocs digunakan untuk mengambil data dari firestore berdasarkan query yang sudah dibuat
    return snapshot.docs.map((doc) => ({
      id: doc.id, // ambil id dari buku yang diambil dari firestore
      ...doc.data(),
    })) as books[]; // kembalikan array buku yang diambil dari Firestore
  } catch (error) {
    console.error("buku gagal diambil", error); // tampilkan error di console jika terjadi kesalahan saat mengambil buku
    throw error; // lempar error jika terjadi kesalahan saat mengambil buku
  }
};
// ambil rekomendasi buku untuk halaman home, khusus untuk user.
export const getRecommendedBooks = async (): Promise<books[]> => {
  try {
    // function try catch untuk menangani error saat mengambil data buku dari firestore
    const q = query(
      collection(db, "books"), // buat query untuk mengambil buku yang direkomendasikan.
      where("isRecommended", "==", true), // where untuk memfilter buku yang direkomendasikan, dengan kondisi isRecommended harus true
      orderBy("createAt", "desc"), // orderBy untuk mengurutkan buku berdasarkan tanggal pembuatan, dengan urutan terbaru di atas
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as books[]; // kembalikan array buku yang direkomendasikan
  } catch (error) {
    console.error("tidak ada buku rekomendasi", error); // tampilkan error di console jika terjadi kesalahan saat mengambil buku rekomendasi
    throw error; // lempar error jika terjadi kesalahan saat mengambil buku rekomendasi
  }
};
// fungsi untuk mengambil buku berdasarkan kategori, untuk search di home.
export const getBooksByCategory = async (
  category: string,
): Promise<books[]> => {
  // const adalah variabel yang tidak bisa diubah, getBooksByCategory adalah nama fungsi, async untuk menandakan bahwa fungsi ini bersifat asynchronous, category adalah parameter yang diterima oleh fungsi ini dengan tipe string, Promise<books[]> adalah tipe data yang dikembalikan oleh fungsi ini yaitu sebuah promise yang berisi array of books
  try {
    const q = query(
      collection(db, "books"),
      where("category", "==", category),
      orderBy("createAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as books[]; // kembalikan array buku yang sesuai dengan kategori yang dicari
  } catch (error) {
    console.error("buku tidak ditemukan", error);
    throw error;
  }
};
//ambil buku satu kategori.
export const getBooksById = async (id: string): Promise<books | null> => {
  try {
    const docRef = doc(db, "books", "bookId");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as books; // kembalikan buku yang sesuai dengan id yang dicari
    }
    return null; // kembalikan null jika buku tidak ditemukan
  } catch (error) {
    console.error("buku tidak ditemukan", error);
    throw error;
  }
};
// edit buku, khusus admin.
export const UpdateBook = async (
  bookId: string,
  updatedData: Partial<books>,
) => {
  try {
    const dockRef = doc(db, "books", bookId);
    await updateDoc(dockRef, updatedData); // update data buku yang sesuai dengan id yang dicari dengan data yang baru
    console.log("buku berhasil diupdate"); // tampilkan pesan sukses di console jika buku berhasil diupdate
  } catch (error) {
    console.error("gagal mengupdate buku", error); // tampilkan error di console jika terjadi kesalahan saat mengupdate buku
    throw error; // lempar error jika terjadi kesalahan saat mengupdate buku
  }
};
//hapus buku, khusus admin.
export const deleteBook = async (BookId: string) => {
  try {
    const docRef = doc(db, "books", "BookId");
    await deleteDoc(docRef); // hapus buku yang sesuai dengan id yang dicari
    console.log("buku berhasil dihapus"); // tampilkan pesan sukses di console jika buku berhasil dihapus
  } catch (error) {
    console.error("buku gagal dihapus", error); // tampilkan error di console jika terjadi kesalahan saat menghapus buku
    throw error; // lempar error jika terjadi kesalahan saat menghapus buku
  }
};
// set / unset rekomendasi buku, khusus admin.
export const toggleBookRecommendation = async (
  bookId: string,
  status: boolean,
) => {
  try {
    await updateDoc(doc(db, "books", bookId), {
      isRecommended: status, // update status rekomendasi buku yang sesuai dengan id yang dicari dengan status yang baru
    });
  } catch (error) {
    console.error("gagal mengupdate rekomendasi buku", error); // tampilkan error di console jika terjadi kesalahan saat mengupdate rekomendasi buku
    throw error; // lempar error jika terjadi kesalahan saat mengupdate rekomendasi buku
  }
};
