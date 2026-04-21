// app/(auth)/register.tsx

import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
import { auth, db } from "../../service/firebase";

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Oops!", "Email dan password harus diisi.");
      return;
    }

    try {
      setLoading(true);

      // buat akun di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // simpan data user ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user", // default role
        createdAt: new Date(),
      });

      Alert.alert("Sukses", "Akun berhasil dibuat!");

      // redirect ke login
      router.replace("/auth/Login");
    } catch (error: any) {
      let message = "Registrasi gagal.";

      if (error.code === "auth/email-already-in-use") {
        message = "Email sudah digunakan.";
      } else if (error.code === "auth/invalid-email") {
        message = "Format email tidak valid.";
      } else if (error.code === "auth/weak-password") {
        message = "Password minimal 6 karakter.";
      }

      Alert.alert("Register Gagal", message);
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
        <Text style={styles.formTitle}>Buat Akun Baru</Text>

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
          style={[styles.btnRegister, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Text style={styles.btnText}>Daftar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/Login")}>
          <Text style={styles.linkText}>
            Sudah punya akun?{" "}
            <Text style={styles.linkBold}>Masuk</Text>
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
  btnRegister: {
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
