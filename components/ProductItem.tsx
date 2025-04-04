import React, { useState, useEffect } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Link } from 'expo-router'
import { toggleWishlist, getWishlist } from '@/services/wishlistService' // Giả sử bạn có dịch vụ này
import { ProductType } from '@/types/type'
import { saveRecentlyViewed } from '@/services/productService' // Import service

type Props = {
  item: ProductType
  index: number
}

const width = Dimensions.get('window').width - 40

const ProductItem = ({ item, index }: Props) => {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlist, setWishlist] = useState<any[]>([])

  // Lấy wishlist khi component được mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlist() // Lấy wishlist từ API
        if (response.success) {
          setWishlist(response.wishlist)
        }
      } catch (error) {
        console.error('❌ Failed to fetch wishlist:', error)
      }
    }
    fetchWishlist()
  }, [])

  // Kiểm tra xem sản phẩm có trong wishlist hay không
  useEffect(() => {
    const productInWishlist = wishlist.some(w => w.productId.id === item.id) // Kiểm tra id sản phẩm trong wishlist
    setIsInWishlist(productInWishlist)
  }, [wishlist, item.id])

  const handleToggleWishlist = async () => {
    try {
      const response = await toggleWishlist(item._id) // Giả sử bạn có API toggleWishlist
      if (response.success) {
        setIsInWishlist(!isInWishlist) // Đảo trạng thái khi thành công
      }
    } catch (error) {
      console.error('❌ Failed to toggle wishlist:', error)
    }
  }

  // Hàm lưu sản phẩm đã xem khi bấm vào sản phẩm
  const handleProductPress = async () => {
    try {
      // Kiểm tra nếu sản phẩm đã được lưu để tránh lưu lại
      await saveRecentlyViewed(item._id); // Lưu sản phẩm đã xem
      console.log("Sản phẩm đã được lưu thành công!");
    } catch (error) {
      console.error("❌ Lỗi lưu sản phẩm đã xem:", error);
    }
  };
  

  return (
    <Link href={{ pathname: "/product-details/[id]", params: { id: item.id } }} asChild>
      <TouchableOpacity onPress={handleProductPress}> 
        <Animated.View style={styles.container} entering={FadeInDown.delay(300 + index * 100).duration(500)}>
          <Image source={{ uri: item.images[0] }} style={styles.productImg} />
          <TouchableOpacity
            style={styles.bookmarkBtn}
            onPress={handleToggleWishlist}
          >
            <Ionicons
              name={isInWishlist ? 'heart' : 'heart-outline'}
              size={22}
              color={isInWishlist ? Colors.primary : Colors.black}  // Giả sử bạn có Colors.primary
            />
          </TouchableOpacity>
          <View style={styles.productInfo}>
            <Text style={styles.price}>${item.price}</Text>
            <View style={styles.ratingWrapper}>
              <Text style={styles.rating}>({item.soldCount})</Text>
              <Ionicons name="star" size={20} color="#D4AF37" />
              <Text style={styles.rating}>{item.ratings.average.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={styles.title}>{item.title}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  )
}

export default ProductItem

const styles = StyleSheet.create({
  productImg: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  container: {
    width: width / 2 - 10,
  },
  bookmarkBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 5,
    borderRadius: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    letterSpacing: 1.1,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rating: {
    fontSize: 14,
    color: Colors.gray,
  },
})
