import { useCallback, useEffect, useState } from "react";
import { books } from "../service/bookservice";
import {
  getUserLibrary,
  isBookInLibrary,
  libraryItem,
  LibraryStatus,
  romoveFromLibrary,
  saveToLibrary,
  updateLibraryStatus,
} from "../service/libraryservice";
import { useAuth } from "./useAuth";

export const useLibrary = () => {
  const { user } = useAuth();
  const [library, setLibrary] = useState<libraryItem[]>([]);
  const [Loading, SetLoading] = useState(true);
  const [error, SetError] = useState<string | null>(null);

  const fetchLibrary = useCallback(async () => {
    if (!user) return;
    try {
      SetLoading(true);
      SetError(null);
      const data = await getUserLibrary(user.uid);
      setLibrary(data);
    } catch (error) {
      SetError("Gagal memeuat koleksi buku");
    } finally {
      SetLoading(false);
    }
  }, [user]);
  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);
  //ambil koleksi berdasarkan tab (baca nanati | favorite | selesai)
  const getBystatus = useCallback(
    (status: LibraryStatus) => {
      return library.filter((item) => item.status === status);
    },
    [library],
  );
  //simpan buku ke library
  const saveBooks = useCallback(
    async (books: books, status: LibraryStatus) => {
      if (!user || !books) return;
      try {
        await saveToLibrary(user.uid, books.id as string, status, {
          bookTitle: books.title,
          bookAuthor: books.author,
          bookCover: books.coverUrl,
          bookCategory: books.category,
        });
        fetchLibrary();
      } catch (error) {
        SetError("Gagal menambahkan buku ke koleksi");
      }
    },
    [user, fetchLibrary],
  );
  //update status di library
  const changeStatus = useCallback(
    async (libraryId: string, status: LibraryStatus) => {
      try {
        await updateLibraryStatus(libraryId, status);
        fetchLibrary();
      } catch (error) {
        SetError("Gagal mengubah status buku");
      }
    },
    [fetchLibrary],
  );
  // hapus buku dari Library
  const removebooks = useCallback(
    async (bookId: string) => {
      if (!user) return;
      try {
        await romoveFromLibrary(user.uid, bookId);
        fetchLibrary();
      } catch (error) {
        SetError("Gagal menghapus buku");
      }
    },
    [fetchLibrary, user],
  );
  //cek status buku yang disimpan
  const CheckBookStatus = useCallback(
    async (bookId: string) => {
      if (!user) return null;
      return await isBookInLibrary(user.uid, bookId);
    },
    [user],
  );
  return {
    // fungi ini mengembalikan objek yang berisi koleksi buku
    library,
    getBystatus,
    saveBooks,
    changeStatus,
    removebooks,
    CheckBookStatus,
    Loading,
    error,

    readLater: library.filter((i) => i.status === "readLater"),
    favorites: library.filter((i) => i.status === "favorite"),
    done: library.filter((i) => i.status === "done"),
  };
};
