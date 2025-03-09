import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Link, router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputField from "@/components/InputField";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { loginUser } from "@/services/authService";

const SignInScreen = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      Alert.alert("Error", "Please enter your username/email and password.");
      return;
    }

    setLoading(true);

    try {
      const userData = await loginUser(emailOrUsername, password);
      // console.log("✅ Login successful:", userData);

      // Navigate to the main screen
      router.replace("/tabs");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Sign In",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons size={24} name="close" color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        <InputField
          placeholder="Username"
          placeholderTextColor={Colors.gray}
          autoCapitalize="none"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
        />

        <InputField
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Nút Forgot Password */}
        <TouchableOpacity
          onPress={() => router.push("/forgotpassword")}
          style={styles.forgotPasswordBtn}
        >
          <Text style={styles.forgotPasswordTxt}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.btnTxt}>
            {loading ? "Logging in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", marginTop: 30 }}>
          <Text style={styles.loginTxt}>Don't have an account?</Text>
          <Link href={"/signup"} asChild>
            <TouchableOpacity>
              <Text style={[styles.loginTxt, styles.loginTxtSpan]}>
                {" "}
                Sign Up{" "}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
};

export default SignInScreen;

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
  forgotPasswordBtn: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotPasswordTxt: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
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
