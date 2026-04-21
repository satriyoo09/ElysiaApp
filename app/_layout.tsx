import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useNetwork } from "../hooks/useNetwork";

export default function RootLayout() {
  const { user, role, loading } = useAuth();
  const { isOnline } = useNetwork();

  useEffect(() => {
    // This is where you can initialize any global state or perform side effects
    if (loading) return;
    if (!user) {
      // If the user is not authenticated, redirect to the login page
      router.replace("../auth/login");
    }
    // If the user is authenticated, redirect to the appropriate dashboard based on their role
    else if (role === "admin") {
      router.replace("./admin/dashboard");
    }
    // For regular users, redirect to the user dashboard
    else {
      router.replace("./user/dashboard");
    }
    // You can also add additional logic here to handle other roles or edge cases
  }, [user, role, loading]);

  return (
    <>
      {/* Banner offline */}
      {!isOnline && (
        <View
          style={{
            backgroundColor: "#FF4444",
            padding: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
            Tidak ada koneksi internet
          </Text>
        </View>
      )}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
