import { uploadAvatar } from "@/services/userService";
import * as ImagePicker from "expo-image-picker";
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaTypeOptions } from "expo-image-picker";
import { useState } from "react";

import { Alert } from "react-native";

/**
 * Yêu cầu quyền truy cập thư viện ảnh.
 * @returns {Promise<boolean>} Trả về true nếu được cấp quyền, false nếu bị từ chối.
 */
const requestPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Quyền bị từ chối",
      "Ứng dụng cần quyền truy cập ảnh để thay đổi avatar."
    );
    return false;
  }
  return true;
};

/**
 * Mở thư viện ảnh để chọn avatar và cập nhật lên Cloudinary.
 * @param {Function} setAvatar Hàm cập nhật avatar trong state.
 * @param {Function} uploadAvatarAPI Hàm API để upload avatar.
 */
const handleUploadAvatar = async () => {
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Sử dụng đúng chuẩn
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
      if (result.canceled) return;
  
      const localUri = result.assets[0].uri;
      const filename = localUri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
  
      const formData = new FormData();
      formData.append("avatar", {
        uri: localUri,
        name: filename,
        type,
      } as any);
  
      setLoading(true);
  
      const response = await uploadAvatar(formData);
      if (response.avatar) {
        setAvatar(response.avatar);
        Alert.alert("Thành công", "Avatar đã được cập nhật!");
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật avatar.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi upload avatar:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật avatar.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

export { handleUploadAvatar };
