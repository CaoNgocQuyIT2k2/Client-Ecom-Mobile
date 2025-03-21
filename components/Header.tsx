import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from "react-native";
import React, { useEffect, useState, RefObject } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchUserProfile } from "@/services/userService";
  import { useSegments } from "expo-router";

type HeaderProps = {
  searchInputRef?: RefObject<TextInput>;
};

const Header: React.FC<HeaderProps> = ({ searchInputRef }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/40");
  const [searchText, setSearchText] = useState("");

  const segments = useSegments(); // Lấy thông tin đường dẫn hiện tại
  useEffect(() => {
    const loadUserAvatar = async () => {
      try {
        const user = await fetchUserProfile();
        setAvatar(user.avatar || '@/assets/images/defaultUser.png');
      } catch (error) {
        console.error("❌ Error loading avatar:", error);
      }
    };

    loadUserAvatar();
  }, []);

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push(`/main-tabs/explore?key=${encodeURIComponent(searchText)}`);
    } else {
      router.push(`/main-tabs/explore`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.searchBar}>
      <TextInput
  ref={searchInputRef} // Đảm bảo input thực sự nhận ref
  style={styles.searchInput}
  placeholder="Search"
  placeholderTextColor={Colors.gray}
  value={searchText}
  onChangeText={setSearchText}
  onFocus={() => {
    if (segments?.[1] !== "explore") {
      router.push("/main-tabs/explore");
    }
  }}
  
  
  onSubmitEditing={handleSearch}
/>



        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search-outline" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/main-tabs/profile")}>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: Colors.black,
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
  },
});
