import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { fetchUserProfile } from "@/services/userService";

const Header = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/40"); // Ảnh mặc định

  useEffect(() => {
    const loadUserAvatar = async () => {
      try {
        const user = await fetchUserProfile(); // Gọi API lấy thông tin user
        console.log("🔹 Avatar từ API:", user.avatar);
        setAvatar(user.avatar || "https://i.pravatar.cc/40"); // Cập nhật avatar
      } catch (error) {
        console.error("❌ Lỗi khi load avatar:", error);
      }
    };

    loadUserAvatar();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Nút Back */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color={Colors.primary} />
      </TouchableOpacity>

      {/* Ô Search */}
      <Link href={"/tabs/explore"} asChild>
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchTxt}>Search</Text>
          <Ionicons name="search-outline" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </Link>

      {/* Chuông thông báo & Avatar */}
      <View style={styles.rightSection}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/editprofile")}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 15,
  },
  searchBar: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  searchTxt: {
    color: Colors.gray,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray,
  },
});
