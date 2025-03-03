import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, Slot, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("🔹 Token từ AsyncStorage:", token);

        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❌ Lỗi khi đọc authToken:", error);
      } finally {
        setLoading(false);
        await SplashScreen.hideAsync(); // Ẩn SplashScreen khi xong
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
   <Stack>
    {isAuthenticated ? (
      <>
       <Stack.Screen name="tabs" options={{ headerShown: false, headerTitle: "" }} />
      </>
    ) : (
      <>
        <Stack.Screen name="signin" options={{ presentation: "modal" }} />
        <Stack.Screen name="signup" options={{ presentation: "modal" }} />
        <Stack.Screen name="otpverify" options={{ headerTitle: "OTP Verification" }} />
      </>
    )}
  </Stack>
  );
}
