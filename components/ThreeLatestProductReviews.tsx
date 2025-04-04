import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { get3LatestProductReviews, Review, getTotalReviews } from '@/services/reviewService'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { router } from 'expo-router'

const ThreeLatestProductReviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalReviews, setTotalReviews] = useState<number>(0) // ✅ Thêm state lưu tổng số đánh giá

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      const latestReviews = await get3LatestProductReviews(productId)
      setReviews(latestReviews)
      setIsLoading(false)
    }

    const fetchTotalReviews = async () => {
      const total = await getTotalReviews(productId)
      setTotalReviews(total)
    }

    fetchReviews()
    fetchTotalReviews() // ✅ Gọi API lấy tổng số đánh giá
  }, [productId])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Product Reviews ({totalReviews})</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() =>
            router.push({ pathname: '/allreviewscreen', params: { productId } })
          }
        >
          {/* ✅ Hiển thị tổng số đánh giá */}
          <Text style={styles.viewAllText}>All Reviews</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.reviewContainer}>
              <View style={styles.userInfo}>
                <Image
                  source={{ uri: item.user?.avatar }}
                  style={styles.avatar}
                />
                <Text style={styles.userName}>{item.user?.fullName}</Text>
              </View>

              {/* ⭐ Hiển thị số sao màu vàng ⭐ */}
              <Text style={styles.rating}>
                {`Rating: ${Number(item.rating).toFixed(1)}`}{' '}
                <Text style={styles.star}>★</Text>
              </Text>

              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          )}
        />
      )}
    </View>
  )
}

export default ThreeLatestProductReviews

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Colors.extraLightGray,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: '500' },
  viewAllButton: {
    flexDirection: 'row', // ✅ Để số lượng và chữ "All Reviews" nằm cùng dòng
    alignItems: 'center',
    padding: 5,
  },
  reviewCount: { // ✅ Thêm style cho số lượng đánh giá
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 5, // ✅ Tạo khoảng cách giữa số lượng và chữ "All Reviews"
  },
  viewAllText: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  reviewContainer: {
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  rating: { fontSize: 14, color: Colors.gray, marginTop: 5 },
  star: { color: 'gold', fontSize: 20 }, // Đổi màu vàng và tăng kích thước sao
  comment: { marginTop: 5, fontSize: 14 },
  reviewImage: { marginTop: 10, width: '100%', height: 100, borderRadius: 5 },
})
