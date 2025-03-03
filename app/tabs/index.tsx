import {
  ActivityIndicator,
  FlatList,
  Image,
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
import ProducList from '@/components/ProducList'
import Categories from '@/components/Categories'
import { BASE_URL } from '@/constants/api'
import Top10Sold from '@/components/Top10Sold'
import BannerCarousel from '@/components/BannerCarousel'

type Props = {}

const HomeScreen = (props: Props) => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [top10Sold, setTop10Sold] = useState<ProductType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Home' })
  }, [navigation])
  

  useEffect(() => {
    getCategories()
    getProducts()
    getTop10Sold()
  }, [])

  const getProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/products`)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
      <View>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Home',
          header: () => <Header />,
        }}
      />

      <ScrollView>
        <BannerCarousel />
        <Categories categories={categories} />
        <Top10Sold products={top10Sold} />
        <ProducList products={products} flatlist={true} />
      </ScrollView>
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})
