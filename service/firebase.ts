import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwyzZLQrXYdW5KNZrGwOBHlRE4B9rs0WY",
  authDomain: "elysiaapp-151d5.firebaseapp.com",
  databaseURL:
    "https://elysiaapp-151d5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "elysiaapp-151d5",
  storageBucket: "elysiaapp-151d5.firebasestorage.app",
  messagingSenderId: "511063343107",
  appId: "1:511063343107:web:4d083b481e4d2424b28e36",
  measurementId: "G-QMQB6H6TDF",
};
// ini adalah initialisasi firebase, jangan diubah-ubah
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
