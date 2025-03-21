import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" options={{ presentation: "modal" }} />
      <Stack.Screen name="signup" options={{ presentation: "modal" }} />
      <Stack.Screen name="otpverify" options={{ headerTitle: "OTP Verification" }} />
      <Stack.Screen name="forgotpassword" options={{ headerTitle: "Forgot Password" }} />
      <Stack.Screen name="otppasswordverify" options={{ headerTitle: "OTP Verification" }} />
      <Stack.Screen name="resetpassword" options={{ headerTitle: "Reset Password" }} />
      
    </Stack>
  );
}
