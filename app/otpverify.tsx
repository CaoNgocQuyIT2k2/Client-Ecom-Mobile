import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, TextInput } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Colors } from "@/constants/Colors";

const OtpVerifyScreen = () => {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

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

  const handleVerifyOTP = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit OTP.");
      return;
    }

    Alert.alert("Success", "OTP verified successfully!");
    router.push("/tabs");
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "OTP Verification", headerTitleAlign: "center" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to your email</Text>

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
          <Text style={styles.verifyText}>VERIFY</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default OtpVerifyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: "600", color: Colors.black, marginBottom: 10 },
  subtitle: { fontSize: 14, color: Colors.gray, marginBottom: 30 },
  otpContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  otpInput: { width: 40, height: 45, borderWidth: 1, borderRadius: 5, borderColor: Colors.gray, fontSize: 18, textAlign: "center", marginHorizontal: 5 },
  verifyBtn: { backgroundColor: Colors.primary, padding: 14, borderRadius: 5, width: "80%", alignItems: "center" },
  verifyText: { color: Colors.white, fontSize: 16, fontWeight: "600" },
});
