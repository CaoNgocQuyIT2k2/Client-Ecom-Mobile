import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { verifyChangeEmail } from "@/services/userService";
import { jwtDecode } from "jwt-decode";

const OTPChangeEmailVerifyScreen = () => {
  const { newEmail } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const email = Array.isArray(newEmail) ? newEmail[0] : newEmail || "";

  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Lỗi", "Không tìm thấy token xác thực.");
        return;
      }

      const decodedToken: any = jwtDecode(token);
      const idUser = decodedToken?.idUser;
      if (!idUser) {
        Alert.alert("Lỗi", "Không thể lấy ID người dùng từ token.");
        return;
      }

      const otpCode = otp.join("");
      if (otpCode.length !== 6) {
        Alert.alert("Lỗi", "Vui lòng nhập mã OTP gồm 6 chữ số.");
        return;
      }

      await verifyChangeEmail(idUser, otpCode, email);
      Alert.alert("Thành công", "Email đã được cập nhật.");
      router.replace("/editprofile");
    } catch (error: any) {
      console.error("❌ Lỗi xác thực OTP:", error);
      Alert.alert("Lỗi", error.message || "OTP không hợp lệ.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Xác thực OTP", headerTitleAlign: "center" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Xác thực OTP</Text>
        <Text style={styles.subtitle}>Nhập mã OTP đã gửi đến email mới</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref as TextInput)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOTP}>
          <Text style={styles.verifyText}>XÁC THỰC</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default OTPChangeEmailVerifyScreen;



// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.gray,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  verifyText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
