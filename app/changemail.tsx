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
import { requestChangeEmail } from "@/services/userService";
import { jwtDecode } from "jwt-decode";

const ChangeEmailScreen = () => {
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestChangeEmail = async () => {
    if (!newEmail) {
      Alert.alert("Lỗi", "Vui lòng nhập email mới.");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Không tìm thấy token xác thực.");

      const decodedToken: any = jwtDecode(token);
      const idUser = decodedToken?.idUser;
      if (!idUser) throw new Error("Không thể lấy ID người dùng từ token.");

      await requestChangeEmail(idUser, newEmail);
      Alert.alert("Thành công", "Mã OTP đã được gửi đến email mới.");

      router.replace({
        pathname: "/otpchangeemailverify ",
        params: { newEmail },
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
          headerTitle: "Đổi Email",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons size={24} name="close" color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Nhập Email Mới</Text>

        <InputField
          placeholder="Email mới"
          placeholderTextColor={Colors.gray}
          autoCapitalize="none"
          keyboardType="email-address"
          value={newEmail}
          onChangeText={setNewEmail}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={handleRequestChangeEmail}
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

export default ChangeEmailScreen;


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
