import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { fetchUserProfile } from "@/services/userService";

const ProfileScreen = () => {
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  const [userData, setUserData] = useState({
    username: "Guest",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male", // Avatar mặc định
  });

  // 🟢 Load user data từ API khi mở lại Profile
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const user = await fetchUserProfile(); // Gọi API lấy thông tin user

          setUserData({
            username: user.fullName || user.email,
            avatar: user.avatar || "https://xsgames.co/randomusers/avatar.php?g=male",
          });
        } catch (error) {
          console.error("❌ Lỗi khi load user:", error);
        }
      };

      loadUserData();
    }, [])
  );

  // 🟢 Hàm Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged Out", "You have been logged out.");
      router.replace("/signin"); // Điều hướng về trang đăng nhập
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
   
        <View style={{ alignItems: "center" }}>
          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{userData.username}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="person-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Your Orders</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="heart-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Your Wishlist</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="card-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Payment History</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="gift-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Reward Point</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="help-circle-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Customer Support</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            
          >
            <Ionicons name="settings-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Setting</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/editprofile")}>
            <Ionicons name="pencil-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.black,
    marginTop: 10,
  },
  buttonWrapper: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    padding: 10,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonTxt: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.black,
  },
});
