// hooks/useAuth.ts

import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../service/firebase";

// Format data user yang akan dipakai di seluruh app
type UserData = {
  uid: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthState = {
  user: User | null; // data auth dari Firebase
  userData: UserData | null; // data lengkap dari Firestore
  role: "user" | "admin" | null;
  loading: boolean;
};

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged = listener otomatis dari Firebase
    // akan dipanggil setiap kali status login berubah
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User sedang login — ambil data lengkap dari Firestore
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            setUser(firebaseUser);
            setUserData({ ...data, uid: firebaseUser.uid });
            setRole(data.role);
          }
        } catch (error) {
          console.error("Gagal ambil data user:", error);
        }
      } else {
        // User tidak login / sudah logout
        setUser(null);
        setUserData(null);
        setRole(null);
      }

      setLoading(false); // selesai cek, loading matikan
    });

    // Cleanup: hentikan listener saat komponen unmount
    return () => unsubscribe();
  }, []);

  return { user, userData, role, loading };
};
