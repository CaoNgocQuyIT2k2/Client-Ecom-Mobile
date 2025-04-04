import React, { useState, useEffect } from 'react'
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { useHeaderHeight } from '@react-navigation/elements'
import { toggleWishlist, getWishlist } from '@/services/wishlistService' // Dịch vụ wishlist
import { router, Stack } from 'expo-router'


// Định nghĩa kiểu dữ liệu cho `CartItemType`
export interface Product {
  _id: string;
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  soldCount: number;
  category: {
    id: number;
    name: string;
    image: string;
  };
  ratings: {
    stars: {
      [key: string]: number;
    };
    totalRatings: number;
    average: number;
  };
}
export interface CartItemType {
  _id: string;
  idUser: number;
  productId: Product; // Sửa đây thành kiểu Product
  createdAt: string;
  __v: number;
  isFavorite?: boolean; // Thêm thuộc tính isFavorite
}


const WishListscreen = () => {
  const headerHeight = useHeaderHeight()
  const [wishlistItems, setWishlistItems] = useState<CartItemType[]>([])
  const [noFavorites, setNoFavorites] = useState<boolean>(false) // Trạng thái để kiểm tra nếu không có sản phẩm yêu thích

  // Lấy danh sách yêu thích khi component được mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlist(); // Lấy danh sách yêu thích từ API
        console.log('Response data:', response); // Log toàn bộ response
        
        if (response.success && Array.isArray(response.wishlist)) {
          if (response.wishlist.length === 0) {
            setNoFavorites(true); // Nếu không có sản phẩm yêu thích, hiển thị thông báo
          } else {
            // Gán isFavorite cho từng item
            const updatedWishlist = response.wishlist.map((item: CartItemType) => ({
              ...item,
              isFavorite: true, // Đảm bảo mỗi sản phẩm yêu thích đều có isFavorite là true
            }));
            
            setWishlistItems(updatedWishlist); // Cập nhật danh sách sản phẩm yêu thích
          }
        } else {
          console.error('Invalid wishlist data:', response);
        }
      } catch (error) {
        console.error('❌ Failed to fetch wishlist:', error);
      }
    };
    fetchWishlist();
  }, []);
  
  

  // Thêm useEffect theo dõi sự thay đổi của wishlistItems
  useEffect(() => {
    console.log('Wishlist items updated:', wishlistItems)
  }, [wishlistItems])

  // Hàm toggle yêu thích
  const handleToggleWishlist = async (item: CartItemType) => {
    try {
      const response = await toggleWishlist(item.productId._id) // Chỉ truyền productId
      console.log('Response data:', response)
  
      if (response.success) {
        const updatedItems = wishlistItems.map((i) =>
          i._id === item._id
            ? { ...i, isFavorite: !i.isFavorite } // Đổi trạng thái yêu thích
            : i
        )
        setWishlistItems(updatedItems)
      }
    } catch (error) {
      console.error('❌ Failed to toggle wishlist:', error)
    }
  }
  

  // Component hiển thị mỗi sản phẩm trong danh sách yêu thích
  const WishListItem = ({ item }: { item: CartItemType }) => {
    const product = item.productId; // Sản phẩm nằm trong trường productId
  
    const imageUri = product.images && product.images.length > 0 ? product.images[0] : '@/assets/images/whiteImage.png';
  
    return (
      <View style={styles.itemWrapper}>
        <TouchableOpacity onPress={() => router.push({ pathname: "/product-details/[id]", params: { id: item.productId.id } })}>
        <Image source={{ uri: imageUri }} style={styles.itemImg} />
        </TouchableOpacity>
        <View style={styles.itemInfoWrapper}>
        <TouchableOpacity onPress={() => router.push({ pathname: "/product-details/[id]", params: { id: item.productId.id } })}>
          <Text style={styles.itemText}>{product.title}</Text>
        </TouchableOpacity>
          <Text style={styles.itemPrice}>${product.price}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleToggleWishlist(item)}
          style={styles.favoriteWrapper}
        >
          <Ionicons
            name={item.isFavorite ? 'heart' : 'heart-outline'} // Kiểm tra trạng thái isFavorite
            size={24}
            color={item.isFavorite ? Colors.primary : Colors.black}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'WishList',
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerShown: true,
        }}
      />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        {noFavorites ? (
          <Text style={styles.noFavoritesText}>You have no favorite products yet.</Text>
        ) : (
          <FlatList
            data={wishlistItems}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <WishListItem item={item} />}
          />
        )}
      </View>
    </>
  )
}

export default WishListscreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  itemImg: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  itemInfoWrapper: { flex: 1, justifyContent: 'center', gap: 5 },
  itemText: { fontSize: 16, fontWeight: '500', color: Colors.black },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.black },
  favoriteWrapper: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 25,
  },
  noFavoritesText: {
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
    marginTop: 20,
  },
})
