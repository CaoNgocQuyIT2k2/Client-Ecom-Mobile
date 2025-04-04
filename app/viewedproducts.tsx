import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { RecentlyViewedProduct } from '@/types/type'
import { router, Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { useHeaderHeight } from '@react-navigation/elements'
import { getRecentlyViewed } from '@/services/productService'

const ViewedProducts = () => {
  const [savedProducts, setSavedProducts] = useState<RecentlyViewedProduct[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const headerHeight = useHeaderHeight()

  useEffect(() => {
    const fetchSavedProducts = async () => {
      setIsLoading(true);
      try {
        const { recentlyViewedProducts } = await getRecentlyViewed();
        console.log(recentlyViewedProducts);  // Kiểm tra dữ liệu API trả về
        setSavedProducts(recentlyViewedProducts);
      } catch (error) {
        console.error('❌ Failed to fetch viewed products:', error);
      }
      setIsLoading(false);
    };
  
    fetchSavedProducts();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Viewed Product',
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerShown: true,
        }}
      />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : savedProducts.length === 0 ? (
          <Text>No viewed products before</Text>  // Không có sản phẩm đã xem
        ) : (
          <FlatList
            data={savedProducts}
            numColumns={2} // Hiển thị 2 cột
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() =>
                  router.push({
                    pathname: '/product-details/[id]',
                    params: { id: item.productId.id },  // Sửa lại thành productId.id
                  })
                }
              >
                <Image
                  source={{ uri: item.productId.images[0] }}  // Sửa thành productId.images
                  style={styles.image}
                />
                <Text numberOfLines={1} style={styles.productName}>
                  {item.productId.title}  
                </Text>
                <Text style={styles.price}>${item.productId.price}</Text> 
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </>
  )
}

export default ViewedProducts

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productCard: {
    flex: 1, // Đảm bảo mỗi sản phẩm chiếm nửa chiều rộng của màn hình
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 5,
  },
})
