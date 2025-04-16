import { Redirect, Slot, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, LogBox, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import { store } from '@/redux/store'
import { Provider } from 'react-redux';
import NotificationInitializer from './NotificationInitializer'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/redux/store'; // 👈 import persistor

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  LogBox.ignoreLogs(["AxiosError"])

  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        setIsAuthenticated(!!token)
      } catch (error) {
        console.error('❌ Lỗi khi đọc authToken:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync()
    }
  }, [loading])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/signin" />
  }
  LogBox.ignoreLogs(['VirtualizedLists should never be nested']); // ✅ Ẩn cảnh báo



return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <NotificationInitializer />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product-details/[id]" options={{ headerShown: true, title: 'Product Details', headerTitleAlign: 'center' }} />
          <Stack.Screen name="order" options={{ headerShown: true, title: 'Orders', headerTitleAlign: 'center' }} />
          {/* Các màn khác giữ nguyên */}
          <Stack.Screen name="address" options={{ headerTitle: 'My Address' }} />
          <Stack.Screen name="afterorder" />
          <Stack.Screen name="editaddress" options={{ headerTitle: 'Edit Address' }} />
          <Stack.Screen name="checkout" options={{ headerTitle: 'Check Out' }} />
          <Stack.Screen name="reviewproduct" options={{ headerTitle: 'Review Product' }} />
          <Stack.Screen name="allreviewscreen" options={{ headerTitle: 'All Review Product' }} />
          <Stack.Screen name="wishlistscreen" options={{ headerTitle: 'Wishlist' }} />
          <Stack.Screen name="viewedproducts" options={{ headerTitle: 'Viewed Product' }} />
          <Stack.Screen name="coupons" options={{ headerTitle: 'Coupons' }} />
        </Stack>
      </NavigationContainer>
    </PersistGate>
  </Provider>
);
}
