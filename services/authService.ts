import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/api";

export const loginUser = async (emailOrUsername: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      emailOrUsername,
      password,
    });

    const userData = response.data;

    // Lưu token vào AsyncStorage
    if (userData.token) {
      await AsyncStorage.setItem("authToken", userData.token);
      console.log("✅ Token đã lưu:", userData.token);
    } else {
      throw new Error("Không nhận được token hợp lệ");
    }

    return userData;
  } catch (error: any) {
    console.error("❌ Lỗi đăng nhập:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi server");
  }
};

// API để lấy thông tin user từ token
export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.user;
  } catch (error: any) {
    console.error("❌ Lỗi lấy thông tin user:", error.message);
    throw error;
  }
};


export const registerUser = async (email: string, username: string, password: string, confirmPassword: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      username,
      password,
      confirmPassword,
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi đăng ký:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi server");
  }
};

export const verifyOTP = async (email: string, otpCode: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/verify-otp`, {
      email,
      otpCode,
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi xác thực OTP:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi server");
  }
};
