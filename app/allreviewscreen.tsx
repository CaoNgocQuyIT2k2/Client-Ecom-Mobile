import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { getProductReviews, Review } from "@/services/reviewService";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";

const AllReviewScreen = () => {
  const { productId } = useLocalSearchParams(); // ✅ Lấy productId từ URL params
  const [reviews, setReviews] = useState<Review[]>([]);
  const headerHeight = useHeaderHeight() || 0;
  const productIdStr = Array.isArray(productId) ? productId[0] : productId; // ✅ Ép kiểu về string

  useEffect(() => {
    const fetchReviews = async () => {
      if (productIdStr) { // ✅ Kiểm tra nếu productIdStr có giá trị
        const allReviews = await getProductReviews(productIdStr);
        setReviews(allReviews);
      }
    };
    fetchReviews();
  }, [productIdStr]);
  

  return (
     <>
          <Stack.Screen options={{ title: 'Product Review', headerTitleAlign: "center",
              headerTransparent: true,
              headerShown: true,}} />
    <View style={[styles.container, { marginTop: headerHeight }]}>
    <FlatList
  data={reviews}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <View style={styles.reviewContainer}>
      <View style={styles.userInfo}>
        <Image source={{ uri: item.user?.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{item.user?.fullName}</Text>
      </View>
      <Text style={styles.rating}>
        {`Rating: ${Number(item.rating).toFixed(1)}`} <Text style={styles.star}>★</Text>
      </Text>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  )}
  contentContainerStyle={{ paddingBottom: 20 }} // ✅ Tránh bị cắt cuối danh sách
  initialNumToRender={10} // ✅ Load trước 10 review
  maxToRenderPerBatch={10} // ✅ Load mỗi lần tối đa 10 review
  ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No reviews yet</Text>} // ✅ Hiển thị nếu không có review
/>


    </View>
    </>
  );
};

export default AllReviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  reviewContainer: { marginBottom: 15, padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  comment: { marginTop: 5, fontSize: 14 },
  backButton: { padding: 10, backgroundColor: '#ff4747', borderRadius: 5, marginTop: 10, alignItems: 'center' },
  backText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
   rating: { fontSize: 14, color: Colors.gray, marginTop: 5 },
    star: { color: 'gold', fontSize: 20 }, // Đổi màu vàng và tăng kích thước sao
});
