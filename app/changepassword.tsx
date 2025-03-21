import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/components/InputField";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { updatePassword } from "@/services/userService";

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await updatePassword({
        oldPassword: "123456",
        newPassword: "newpassword123",
      });
      Alert.alert("Success", "Password changed successfully!");
      router.replace("/main-tabs/profile");
  } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Failed to change password.");
      }
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Change Password",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons size={24} name="close" color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />

       {/* Nút Back */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/editprofile')}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity> 
      <View style={styles.container}>
        <Text style={styles.title}>Change Your Password</Text>

        <InputField
          placeholder="Old Password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        <InputField
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <InputField
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.btnTxt}>
            {loading ? "Updating..." : "Change Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  backButton: {
      position: "absolute",
      top: 65,
      left: 20,
      zIndex: 10,
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
});
