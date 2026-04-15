import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"; // import fungsi-fungsi auth dari firebase, jangan diubah-ubah
import { doc, setDoc } from "firebase/firestore"; // import fungsi untuk menulis data ke Firestore, jangan diubah-ubah
import { auth, db } from "./firebase"; // import objek auth dan db dari file firebase, jangan diubah-ubah

export const registerUser = async (
  // fungsi untuk register user baru
  email: string,
  password: string,
  name: string,
) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password); // buat user baru dengan email dan password
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    role: "user",
    createdAt: new Date(),
  }); // simpan data user baru ke Firestore dengan nama, email, role, dan tanggal pembuatan
  return user; // kembalikan objek user yang baru dibuat
};
export const loginUser = async (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password); // fungsi untuk login user dengan email dan password, kembalikan hasil dari fungsi signInWithEmailAndPassword
export const logoutUser = () => signOut(auth);
//kirim email reset password ke user
export const sendResetPasswordEmail = (email: string) => {
  try {
    sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw error;
  }
};
