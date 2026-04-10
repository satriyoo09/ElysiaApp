import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //simulasi cek logika sendiri
  useEffect(() => {
    //simulasi api call untuk mendapatkan data user kalau perlu
    setTimeout(() => {
      const mockUser = { id: 1, name: "aufa rafif" }; //ganti dengan data asli nantinya
      const mockRole = "admin"; //bisa ganti user jika sesuai dengan data aslinya
      setUser(mockUser); // ini adalah contoh data user yang didapat dari api, nanti bisa diganti
      setRole(mockRole); // ini adalah contoh data role yang didapat dari api, nanti bisa diganti
      setLoading(false); // setelah data user dan role didapat, set loading ke false
    }, 1000);
  }, []);

  return { user, role, loading }; // return user, role, dan loading untuk digunakan di komponen lain
}
