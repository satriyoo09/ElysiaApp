import { useRouter } from "expo-router";
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
import { sendResetPasswordEmail } from "../../service/authService";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Oops!", "email harus diisi.");
      return;
    }
    try {
      setLoading(true);
      await sendResetPasswordEmail(email);
      setEmailSent(true);
    } catch (error: any) {
      let messsege = "reset passord gagal. coba Lagi";
      if (error.code === "auth/user-not-found") {
        messsege = "email tidak terdaftar di ElysiaApp";
      } else if (error.code === "auth/invalid-email") {
        messsege = "format Email tidak Falid";
      } else if (error.code === "auth/too-many-requests") {
        messsege = "terlalu banyak permintaan, coba lagi nanti";
      }
      Alert.alert("gagal", messsege);
    } finally {
      setLoading(false);
    }
  };
  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>📧</Text>

          <Text style={styles.successTitle}>Email Terkirim!</Text>

          <Text style={styles.successDesc}>
            Kami sudah kirim link reset password ke:
          </Text>

          <Text style={styles.emailText}>{email}</Text>

          <Text style={styles.successNote}>
            Buka email kamu dan klik link yang dikirim. Cek folder Spam jika
            tidak ada di Inbox.
          </Text>

          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => router.replace("/auth/login")}
          >
            <Text style={styles.btnBackText}>Kembali ke Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnResend}
            onPress={() => {
              setEmailSent(false);
              setEmail("");
            }}
          >
            <Text style={styles.btnResendText}>Kirim ulang ke email lain</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Tampilan form input email ──
  return (
    <View style={styles.container}>
      {/* Tombol back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>← Kembali</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>Lupa Password?</Text>
        <Text style={styles.desc}>
          Tenang! Masukkan email yang terdaftar dan kami akan kirimkan link
          untuk buat password baru.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Masukkan email kamu"
          placeholderTextColor={Colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
        />

        <TouchableOpacity
          style={[styles.btnSend, loading && { opacity: 0.7 }]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnSendText}>Kirim Link Reset</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text style={styles.linkText}>
            Ingat password? <Text style={styles.linkBold}>Masuk sekarang</Text>
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
    padding: 24,
  },
  backBtn: {
    marginBottom: 24,
    marginTop: 8,
  },
  backBtnText: {
    color: Colors.soft,
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  desc: {
    fontSize: 16,
    color: Colors.soft,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    color: "#fff",
  },
  btnSend: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  btnSendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: Colors.soft,
    fontSize: 16,
    textAlign: "center",
  },
  linkBold: {
    fontWeight: "600",
  },
  successBox: {
    alignItems: "center",
    gap: 12,
  },
  successIcon: {
    fontSize: 56,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  successDesc: {
    fontSize: 16,
    color: Colors.soft,
  },
  emailText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  successNote: {
    fontSize: 16,
    color: Colors.soft,
    textAlign: "center",
  },
  btnBack: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  btnBackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  btnResend: {
    marginTop: 24,
  },
  btnResendText: {
    color: Colors.soft,
    fontSize: 16,
  },
});
