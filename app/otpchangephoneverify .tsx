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
import { verifyChangePhone } from "@/services/userService";
import { jwtDecode } from "jwt-decode";

const OTPChangePhoneVerifyScreen = () => {
  const { newPhoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const phoneNumber = Array.isArray(newPhoneNumber) ? newPhoneNumber[0] : newPhoneNumber || "";

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

      // 🟢 Giải mã token để lấy idUser
      const decodedToken: any = jwtDecode(token);
      const idUser = decodedToken?.idUser; // Lấy idUser từ token

      if (!idUser) {
        Alert.alert("Lỗi", "Không thể lấy ID người dùng từ token.");
        return;
      }

      const otpCode = otp.join("");
      if (otpCode.length !== 6) {
        Alert.alert("Lỗi", "Vui lòng nhập mã OTP gồm 6 chữ số.");
        return;
      }

      const phoneNumber = Array.isArray(newPhoneNumber) ? newPhoneNumber[0] : newPhoneNumber || "";

      await verifyChangePhone(idUser, otpCode, phoneNumber);
      Alert.alert("Thành công", "Số điện thoại đã được cập nhật.");
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
        <Text style={styles.subtitle}>Nhập mã OTP đã gửi đến số điện thoại mới</Text>

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

export default OTPChangePhoneVerifyScreen;

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
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.gray,
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 5,
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  verifyText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
