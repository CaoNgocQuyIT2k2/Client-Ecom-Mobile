import { Redirect, Slot, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, LogBox, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import { store } from '@/redux/store'
import { Provider } from 'react-redux';

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

  return ( 
     <Provider store={store}>
    <NavigationContainer>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Tabs chính chứa Home, Profile, Explore,... */}
        <Stack.Screen name="main-tabs" />

        {/* Màn hình Product Details - Đặt trong Stack để có header */}
        <Stack.Screen
          name="product-details/[id]"
          options={{ headerShown: true, title: 'Product Details',headerTitleAlign: "center" }}
        />

        {/* Màn hình Order - Đặt trong Stack để có header */}
        <Stack.Screen
          name="order"
          options={{ headerShown: true, title: 'Orders' ,headerTitleAlign: "center"}}
        />

        {/* Các màn hình khác */}
        {/* <Stack.Screen name="signin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="signup" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="otpverify"
          options={{ headerTitle: 'OTP Verification' }}
        />
        <Stack.Screen
          name="forgotpassword"
          options={{ headerTitle: 'Forgot Password' }}
        />
        <Stack.Screen
          name="otppasswordverify"
          options={{ headerTitle: 'OTP Verification' }}
        />
        <Stack.Screen
          name="resetpassword"
          options={{ headerTitle: 'Reset Password' }}
        /> */}
        <Stack.Screen name="address" options={{ headerTitle: 'My Address' }} />
        <Stack.Screen name="afterorder"  />
        <Stack.Screen
          name="editaddress"
          options={{ headerTitle: 'Edit Address' }}
        />
        <Stack.Screen name="checkout" options={{ headerTitle: 'Check Out' }} />
      </Stack>
    </NavigationContainer>
    </Provider>
  )
}
