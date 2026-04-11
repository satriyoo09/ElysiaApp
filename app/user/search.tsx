import { getallBooks, getBooksByCategory } from "../../service/bookservice";

//ambil semua buku.
const semua = await getallBooks();

//ambil buku berdasarkan kategori.
const kategori = await getBooksByCategory("novel"); // ganti "novel" dengan kategori yang diinginkan

// tampilkan hasil pencarian buku berdasarkan kategori.
console.log(kategori);
