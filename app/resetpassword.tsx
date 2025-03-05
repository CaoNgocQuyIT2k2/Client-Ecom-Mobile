import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import InputField from "@/components/InputField";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { resetPassword } from "@/services/userService"; // API đặt lại mật khẩu

const ResetPasswordScreen = () => {
  const { email } = useLocalSearchParams();
  const userEmail = Array.isArray(email) ? email[0] : email; // Đảm bảo email là string

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(userEmail, newPassword);
      Alert.alert("Thành công", "Mật khẩu của bạn đã được cập nhật!");

      // Điều hướng đến trang đăng nhập
      router.replace("/signin");
    } catch (error: any) {
      console.error("❌ Lỗi đặt lại mật khẩu:", error);
      Alert.alert("Lỗi", error.message || "Không thể đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Đặt Lại Mật Khẩu",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons size={24} name="close" color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Đặt Lại Mật Khẩu</Text>

        <InputField
          placeholder="Mật khẩu mới"
          placeholderTextColor={Colors.gray}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <InputField
          placeholder="Nhập lại mật khẩu mới"
          placeholderTextColor={Colors.gray}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.btnTxt}>
            {loading ? "Đang cập nhật..." : "Xác nhận"}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", marginTop: 30 }}>
          <Text style={styles.loginTxt}>Quay lại?</Text>
          <Link href={"/signin"} asChild>
            <TouchableOpacity>
              <Text style={[styles.loginTxt, styles.loginTxtSpan]}>
                {" "}
                Đăng nhập{" "}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
};

export default ResetPasswordScreen;

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
    letterSpacing: 1.2,
    color: Colors.black,
    marginBottom: 50,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: "stretch",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  loginTxt: {
    marginBottom: 30,
    marginTop: 30,
    fontSize: 14,
    color: Colors.black,
    lineHeight: 24,
  },
  loginTxtSpan: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
