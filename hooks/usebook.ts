import {
  books,
  getallBooks,
  getBooksByCategory,
  getBooksById,
  getRecommendedBooks,
} from "@/service/bookservice"; // import fungsi getallBooks, getRecommendedBooks, getBooksByCategory, dan getBooksById dari file bookservice
import { useCallback, useEffect, useState } from "react"; // import useState, useEffect, dan useCallback dari react
// hook semua buku (untuk halaman search)
export const useBooks = () => {
  const [books, setBooks] = useState<books[]>([]);
  const [Filtered, setFiltered] = useState<books[]>([]); // buku yang telah difilter
  const [Loading, SetLoading] = useState(true);
  const [error, SetError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    // ini adalah fungsi untuk mengambil semua buku
    try {
      SetLoading(true);
      SetError(null);
      const data = await getallBooks(); //
      setBooks(data);
      setFiltered(data);
    } catch (error) {
      SetError("Gagal ambil data buku");
    } finally {
      SetLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const searchBooks = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) {
        setFiltered(books);
        return;
      }
      const lower = keyword.toLowerCase(); // ini adalah fungsi untuk mengubah string menjadi huruf kecil
      const result = books.filter(
        //ini adalah fungsi untuk mencari buku berdasarkan kata kunci
        (books) =>
          books.title.toLowerCase().includes(lower) ||
          books.author.toLowerCase().includes(lower),
      );
      setFiltered(result); // ini adalah fungsi untuk menyimpan hasil pencarian
    },
    [books], // ini adalah variabel yang digunakan untuk menyimpan hasil pencarian
  );
  //fungsi filter berdasarkan kategori
  const filterByCategory = useCallback(
    async (category: string) => {
      if (category === "semua") {
        setFiltered(books);
        return;
      }
      try {
        // ini adalah fungsi untuk mengambil buku berdasarkan kategori, dan try itu digunakan untuk menangani error
        SetLoading(true);
        const data = await getBooksByCategory(category);
        setFiltered(data);
      } catch (error) {
        SetError("gagal filter kategory");
      } finally {
        // finally adalah fungsi untuk menutup loading
        SetLoading(false);
      }
    },
    [books],
  );

  return {
    books,
    Filtered,
    Loading,
    error,
    searchBooks,
    filterByCategory,
  };
};
// Tampilkan buku yang direkomendasikan (untuk halaman home, khusus user)
export const UseRecommendedBooks = () => {
  const [books, setBooks] = useState<books[]>([]);
  const [Loading, SetLoading] = useState(true);
  const [error, SetError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        SetLoading(true);
        const data = await getRecommendedBooks();
        setBooks(data);
      } catch (error) {
        SetError("tidak ada buku rekomendasi");
        throw error;
      } finally {
        SetLoading(false);
      }
    };
    fetch();
  }, []);
  return {
    books,
    Loading,
    error,
  };
};
//ambil detail satu buku
export const useBooksdetail = (BookId: string) => {
  const [books, setBooks] = useState<books | null>(null);
  const [Loading, SetLoading] = useState(true);
  const [error, SetError] = useState<string | null>(null);

  useEffect(() => {
    if (!BookId) return;
    const fetch = async () => {
      try {
        SetLoading(true);
        const data = await getBooksById(BookId);
        setBooks(data);
      } catch (error) {
        SetError("gagal memuat buku");
        throw error;
      } finally {
        SetLoading(false);
      }
    };
    fetch();
  }, [BookId]);
  return {
    books,
    Loading,
    error,
  };
};
