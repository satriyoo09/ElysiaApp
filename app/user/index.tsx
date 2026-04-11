import { useEffect, useState } from "react";
import { books, getRecommendedBooks } from "../../service/bookservice";

export default function Home() {
  const [recommended, setRecommended] = useState<books[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getRecommendedBooks();
      setRecommended(data);
    };
    fetch();
  }, []);
  // buku akan ditampilkan di sini.
}
