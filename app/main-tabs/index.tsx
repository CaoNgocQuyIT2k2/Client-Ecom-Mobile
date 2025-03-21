import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { CategoryType, ProductType } from '@/types/type'
import { Stack, useNavigation } from 'expo-router'
import Header from '@/components/Header'
import ProductItem from '@/components/ProductItem'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Colors } from '@/constants/Colors'
import Categories from '@/components/Categories'
import { BASE_URL } from '@/constants/api'
import Top10Sold from '@/components/Top10Sold'
import BannerCarousel from '@/components/BannerCarousel'
import ProductList from '@/components/ProducList'

const HomeScreen = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [top10Sold, setTop10Sold] = useState<ProductType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [page, setPage] = useState(1) // Theo dõi trang hiện tại

  const navigation = useNavigation()

  useEffect(() => {}, [navigation])

  useEffect(() => {
    getCategories()
    getProducts(1) // Load trang đầu tiên
    getTop10Sold()
  }, [])

  // Gọi API sản phẩm có phân trang
const getProducts = async (pageNumber: number) => {
  if (pageNumber === 1) setIsLoading(true);
  else setIsLoadingMore(true);

  try {
    // console.log(`🔹 Fetching page ${pageNumber}`);
    const response = await axios.get(`${BASE_URL}/products/products?page=${pageNumber}`);
    if (pageNumber === 1) {
      setProducts(response.data); // Load trang đầu tiên
    } else {
      setProducts((prev) => [...prev, ...response.data]); // Load tiếp dữ liệu mới
    }
    setPage(pageNumber + 1); // Tăng page để lần sau gọi tiếp
  } catch (error) {
    console.error('❌ Error fetching products:', error);
  } finally {
    if (pageNumber === 1) setIsLoading(false);
    setIsLoadingMore(false);
  }
};

  // Gọi API danh mục
  const getCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/categories`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Gọi API Top 10 sản phẩm bán chạy
  const getTop10Sold = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/top10Sold`)
      setTop10Sold(response.data)
    } catch (error) {
      console.error('Error fetching sale products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size={'large'} color={Colors.darkRed} />
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />

      <ScrollView>
        <BannerCarousel />
        <Categories categories={categories} />
        <Top10Sold products={top10Sold} />
        <ProductList
          products={products}
          flatlist={true}
          loadMoreProducts={() => getProducts(page)}
          isLoadingMore={isLoadingMore}
        />
      </ScrollView>
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
