import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function AuthCheck() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          console.log("🔹 Token từ AsyncStorage:", token);
          router.replace("/tabs"); // Điều hướng sau khi token load xong
        } else {
          router.replace("/signin"); // Nếu không có token thì về màn hình login
        }
      } catch (error) {
        console.error("❌ Lỗi khi đọc authToken:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return <View />; // Tránh lỗi UI render trước khi điều hướng
}
