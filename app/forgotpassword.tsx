import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Link, router, Stack } from "expo-router";
import InputField from "@/components/InputField";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { requestPasswordReset } from "@/services/userService";

const ForgotPasswordScreen = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
      if (!emailOrUsername) {
        Alert.alert("Lỗi", "Vui lòng nhập email hoặc username.");
        return;
      }
    
    
      setLoading(true);
    
      try {
        const response = await requestPasswordReset(emailOrUsername);
        // console.log("✅ Phản hồi từ API:", response);
    
        Alert.alert("Thành công", "Mã OTP đã được gửi đến email của bạn.");
        router.replace({
          pathname: "/otppasswordverify",
          params: { email: emailOrUsername },
        });
    
      } catch (error: any) {
        console.error("❌ Lỗi gửi OTP:", error);
    
        let errorMessage = "Không thể gửi OTP.";
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
    
        Alert.alert("Lỗi", errorMessage);
      } finally {
        setLoading(false);
      }
    };
    

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Quên Mật Khẩu",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons size={24} name="close" color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Quên Mật Khẩu</Text>

        <InputField
          placeholder="Email hoặc Username"
          placeholderTextColor={Colors.gray}
          autoCapitalize="none"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          <Text style={styles.btnTxt}>
            {loading ? "Đang gửi OTP..." : "Gửi OTP"}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", marginTop: 30 }}>
          <Text style={styles.loginTxt}>Bạn đã có tài khoản?</Text>
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

export default ForgotPasswordScreen;

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
