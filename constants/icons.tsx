import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { fetchUserProfile } from "@/services/userService";

export const icon = {
  index: ({ color }: { color: string }) => (
    <Ionicons name="home-outline" size={22} color={color} />
  ),
  explore: ({ color }: { color: string }) => (
    <Ionicons name="search-outline" size={22} color={color} />
  ),
  notifications: ({ color }: { color: string }) => (
    <Ionicons name="notifications-outline" size={22} color={color} />
  ),
  cart: ({ color }: { color: string }) => (
    <Ionicons name="cart-outline" size={22} color={color} />
  ),
  profile: ({ color }: { color: string }) => {
    const [avatar, setAvatar] = useState(
      "https://xsgames.co/randomusers/avatar.php?g=male"
    ); // Ảnh mặc định

    useEffect(() => {
      const loadUserAvatar = async () => {
        try {
          const user = await fetchUserProfile();
          console.log("🔹 Avatar từ API:", user.avatar);
          setAvatar(user.avatar || "https://xsgames.co/randomusers/avatar.php?g=male");
        } catch (error) {
          console.error("❌ Lỗi khi load avatar:", error);
        }
      };

      loadUserAvatar();
    }, []);

    return <Image source={{ uri: avatar }} style={styles.userImg} />;
  },
};

const styles = StyleSheet.create({
  userImg: {
    height: 24,
    width: 24,
    borderRadius: 12, // Bo tròn ảnh
  },
});
