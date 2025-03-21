import { useEffect } from "react";
import { router } from "expo-router";

export default function SplashScreen() {
  useEffect(() => {
    setTimeout(() => {
      router.push("/main-tabs"); // Chuyển đến trang chính
    }, 1000);
  }, []);

  return null; // Không cần giao diện, chỉ để điều hướng
}
