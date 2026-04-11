import {
    addBook,
    deleteBook,
    toggleBookRecommendation,
} from "@/service/bookservice";

//tambah buku.
await addBook({
  title: "Bumi",
  author: "Tere Liye",
  category: "Novel",
  coverUrl: "",
  description: "Petualangan Raib dan kawan-kawan...",
  isRecommended: false,
});
// jadikan rekomendasi
await toggleBookRecommendation("bookId", true);
// hapus buku
await deleteBook("bookId");
