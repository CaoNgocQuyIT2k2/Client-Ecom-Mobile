import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/api";


// 🟢 API lấy thông tin user từ token
export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.get(`${BASE_URL}/user/getProfile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.user;
  } catch (error: any) {
    console.error("❌ Lỗi lấy thông tin user:", error.message);
    throw error;
  }
};

// 🟢 API cập nhật thông tin profile
export const updateProfile = async (userData: {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
}) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.put(`${BASE_URL}/user/updateProfile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi cập nhật hồ sơ:", error.message);
    throw error;
  }
};


// 🟢 API cập nhật avatar
export const uploadAvatar = async (formData: FormData) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.post(`${BASE_URL}/user/uploadAvatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi upload avatar:", error.message);
    throw error;
  }
};

// 🟢 API cập nhật mật khẩu mới
export const updatePassword = async (passwordData: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.put(`${BASE_URL}/user/updatePassword`, passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi đổi mật khẩu:", error.message);
    throw error;
  }
};

// 🟢 API yêu cầu đặt lại mật khẩu (gửi OTP qua email)
export const requestPasswordReset = async (emailOrUsername: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/forgotPassword`, {
      emailOrUsername,
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi gửi OTP:", error.message);
    throw error;
  }
};

// 🟢 API Xác thực OTP quên mật khẩu
export const verifyPasswordResetOTP = async (email: string, otpCode: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/verifyPassOtp`, { email, otpCode });
    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi xác thực OTP:", error.message);
    throw error;
  }
};

// 🟢 API Đặt lại mật khẩu
export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/resetPassword`, {
      email,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi đặt lại mật khẩu:", error.message);
    throw error;
  }
};
// 🟢 API cập nhật chỉ fullName
export const updateFullName = async (fullName: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.put(
      `${BASE_URL}/user/updateFullName`,
      { fullName }, // Chỉ gửi fullName
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi cập nhật fullName:", error.message);
    throw error;
  }
};

// 🟢 Gửi yêu cầu đổi số điện thoại mới
export const requestChangePhone = async (idUser: number, newPhoneNumber: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.post(
      `${BASE_URL}/user/requestChangePhone`, // ✅ Đúng endpoint mới
      { idUser, newPhoneNumber }, // ✅ Dùng idUser
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi gửi OTP đổi số điện thoại:", error.message);
    throw error;
  }
};


// 🟢 Xác thực OTP để đổi số điện thoại mới
export const verifyChangePhone = async (idUser: number, otpCode: string, newPhoneNumber: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.post(
      `${BASE_URL}/user/verifyChangePhone`, // ✅ Đúng endpoint mới
      { idUser, otpCode, newPhoneNumber }, // ✅ Dùng idUser
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi xác thực OTP đổi số điện thoại:", error.message);
    throw error;
  }
};
// 🟢 Gửi yêu cầu đổi email mới
export const requestChangeEmail = async (idUser: number, newEmail: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.post(
      `${BASE_URL}/user/requestChangeEmail`,
      { idUser, newEmail },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi gửi OTP đổi email:", error.message);
    throw error;
  }
};

// 🟢 Xác thực OTP để đổi email mới
export const verifyChangeEmail = async (idUser: number, otpCode: string, newEmail: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.post(
      `${BASE_URL}/user/verifyChangeEmail`,
      { idUser, otpCode, newEmail },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi xác thực OTP đổi email:", error.message);
    throw error;
  }
};