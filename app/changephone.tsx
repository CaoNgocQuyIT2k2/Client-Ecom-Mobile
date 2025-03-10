import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Link, router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputField from "@/components/InputField";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { requestChangePhone } from "@/services/userService"; // API đổi số điện thoại
import { jwtDecode } from "jwt-decode";

const ChangePhoneScreen = () => {
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestChangePhone = async () => {
    if (!newPhoneNumber) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại mới.");
      return;
    }
    setLoading(true);
    try {
      // 🟢 Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực.");
      }

      // 🟢 Giải mã token để lấy idUser
      const decodedToken: any = jwtDecode(token);
      const idUser = decodedToken?.idUser; // ✅ Sử dụng idUser thay vì userId
      // console.log(decodedToken);
      if (!idUser) {
        throw new Error("Không thể lấy ID người dùng từ token.");
      }

      // console.log("✅ User ID:", idUser); // Kiểm tra giá trị idUser

      // 🟢 Gửi API yêu cầu đổi số điện thoại
      await requestChangePhone(idUser, newPhoneNumber);

      Alert.alert("Thành công", "Mã OTP đã được gửi đến số điện thoại mới.");

      // 🔄 Chuyển hướng sang trang nhập OTP
      router.replace({
        pathname: "/otpchangephoneverify ",
        params: { newPhoneNumber },
      });
    } catch (error: any) {
      console.error("❌ Lỗi gửi OTP:", error);
      Alert.alert("Lỗi", error.message || "Không thể gửi OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Đổi Số Điện Thoại",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons size={24} name="close" color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Nhập Số Điện Thoại Mới</Text>

        <InputField
          placeholder="Số điện thoại mới"
          placeholderTextColor={Colors.gray}
          autoCapitalize="none"
          keyboardType="phone-pad"
          value={newPhoneNumber}
          onChangeText={setNewPhoneNumber}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={handleRequestChangePhone}
          disabled={loading}
        >
          <Text style={styles.btnTxt}>
            {loading ? "Đang gửi OTP..." : "Xác Nhận"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Bạn muốn quay lại?</Text>
          <Link href={"/editprofile"} asChild>
            <TouchableOpacity>
              <Text style={[styles.footerText, styles.linkText]}>
                Quay về hồ sơ
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
};

export default ChangePhoneScreen;

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
    marginBottom: 20,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: Colors.black,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: 5,
  },
});
