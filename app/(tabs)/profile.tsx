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
    avatar: "../../assets/images/defaultUser.png", // Avatar mặc định
  });

  // 🟢 Load user data từ API khi mở lại Profile
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const user = await fetchUserProfile(); // Gọi API lấy thông tin user

          setUserData({
            username: user.fullName || user.email,
            avatar: user.avatar || '@/assets/images/defaultUser.png',
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
      <Stack.Screen options={{ headerShown: true}} />
      <View style={[styles.container, { marginTop: headerHeight - 50}]}>
   
        <View style={{ alignItems: "center" }}>
          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{userData.username}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button}  onPress={() =>router.push('/profile')}>
            <Ionicons name="person-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Your Info</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={() =>router.push('/wishlistscreen')}>
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
          <TouchableOpacity style={styles.button} onPress={() =>router.push('/order')}>
            <Ionicons name="cube-outline" size={20} color={Colors.black}  />
            <Text style={styles.buttonTxt}>Orders</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={() =>router.push('/viewedproducts')}>
            <Ionicons name="eye-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Viewed Product</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/address")}
          >
            <Ionicons name="location-outline" size={20} color={Colors.black} />
            <Text style={styles.buttonTxt}>Address</Text>
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
    margin: 2,
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
    borderWidth: 1.5,
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
