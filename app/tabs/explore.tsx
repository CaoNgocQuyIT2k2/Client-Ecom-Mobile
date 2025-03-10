import { ActivityIndicator, ScrollView, StyleSheet, View, Text, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ProductType } from '@/types/type';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { BASE_URL } from '@/constants/api';
import { useIsFocused } from "@react-navigation/native"; 
import ProductListSearch from '@/components/ProducListSearch';

const ExploreScreen = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);
const [filters, setFilters] = useState<{ minPrice: string; maxPrice: string; selectedRatings: number[] }>({
  minPrice: "",
  maxPrice: "",
  selectedRatings: [],
});

  const { key } = useLocalSearchParams();
  const isFocused = useIsFocused();
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null); // Ref cho ô tìm kiếm

  useEffect(() => {
    if (key) {
      const searchKey = Array.isArray(key) ? key[0] : key;
      searchProducts(searchKey);
    } else {
      fetchAllProducts(); // Lấy toàn bộ sản phẩm nếu không có từ khóa
    }
  }, [key]);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  }, [isFocused]);

  // Lấy tất cả sản phẩm (mặc định)
  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/products/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('❌ Lỗi khi lấy toàn bộ sản phẩm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tìm kiếm sản phẩm theo từ khóa
  const searchProducts = async (searchKey: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/products/searchProducts?key=${searchKey}`);
      setProducts(response.data);
    } catch (error) {
      console.error('❌ Lỗi khi tìm kiếm sản phẩm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, header: () => <Header searchInputRef={searchInputRef} /> }} />

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size={'large'} color={Colors.darkRed} />
        </View>
      ) : (
        <ScrollView style={styles.productList}>
<ProductListSearch
  products={products}
  flatlist={true}
  isFilterModalVisible={isFilterModalVisible}
  setFilterModalVisible={setFilterModalVisible}
  filters={filters}
  setFilters={setFilters}
/>


        </ScrollView>
      )}
    </>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    paddingTop: 30,
  },
});
