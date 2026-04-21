// app/(auth)/login.tsx

import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/color";
import { loginUser } from "../../service/authService";
import { db } from "../../service/firebase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Oops!", "Email dan password harus diisi.");
      return;
    }

    try {
      setLoading(true);

      // login ke Firebase Auth
      const { user } = await loginUser(email, password);

      // ambil role dari Firestore
      const docSnap = await getDoc(doc(db, "users", user.uid));
      const userData = docSnap.data();

      // arahkan sesuai role
      if (userData?.role === "admin") {
        router.replace("/admin/dasboard");
      } else {
        router.replace("/user");
      }
    } catch (error: any) {
      // pesan error yang ramah
      let message = "Login gagal. Coba lagi.";
      if (error.code === "auth/user-not-found") {
        message = "Akun tidak ditemukan.";
      } else if (error.code === "auth/wrong-password") {
        message = "Password salah.";
      } else if (error.code === "auth/invalid-email") {
        message = "Format email tidak valid.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Terlalu banyak percobaan. Coba lagi nanti.";
      }
      Alert.alert("Login Gagal", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>ElysiaApp</Text>
        <Text style={styles.tagline}>Perpustakaan Digital</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Masuk ke Akun</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.btnLogin, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Masuk</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/Register")}>
          <Text style={styles.linkText}>
            Belum punya akun?{" "}
            <Text style={styles.linkBold}>Daftar sekarang</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  appName: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: Colors.soft,
    marginTop: 4,
    letterSpacing: 2,
  },
  form: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 14,
  },
  btnLogin: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  btnText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },
  linkText: {
    color: Colors.soft,
    textAlign: "center",
    fontSize: 13,
    marginTop: 8,
  },
  linkBold: {
    fontWeight: "800",
    color: "#fff",
  },
});
