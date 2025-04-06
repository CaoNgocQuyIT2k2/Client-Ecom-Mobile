import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { getUserCoupons, applyCoupon } from '@/services/couponService'
import { Checkbox } from 'react-native-paper'
import { router, Stack } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'
import { Colors } from '@/constants/Colors'

// Define voucher type
type CouponType = {
  _id: string
  code: string
  discount: number
  minOrder: number
  expiresAt: string
}

const CouponScreen = ({ route }: { route?: any }) => {
  const { totalAmount } = useLocalSearchParams()
  const parsedTotalAmount = totalAmount ? parseFloat(totalAmount as string) : 0
  const headerHeight = useHeaderHeight() || 0;

  console.log('Total Amount:', parsedTotalAmount) // Check the value

  console.log('Total Amount:', totalAmount) // Check the value totalAmount
  const [coupons, setCoupons] = useState<CouponType[]>([])
  const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null)

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const result = await getUserCoupons()
        setCoupons(result.coupons)
      } catch (error) {
        Alert.alert('Error', 'Unable to retrieve the list of vouchers')
      }
    }
    fetchCoupons()
  }, [])

  const handleCouponSelect = (coupon: CouponType) => {
    setSelectedCoupon(coupon)
  }

  // Use parsedTotalAmount instead of totalAmount
  const handleApplyCoupon = async () => {
    if (!selectedCoupon) {
      // Trường hợp không chọn mã giảm giá => quay lại màn checkout không truyền gì
      router.push('/checkout')
      return
    }
  
    try {
      const response = await applyCoupon(selectedCoupon.code, parsedTotalAmount)
      const discountAmount = (parsedTotalAmount * response.discount) / 100
  
      Alert.alert(
        'Success',
        `Discount: ${response.discount}% - New total amount: ${response.finalAmount}`
      )
  
      router.push({
        pathname: '/checkout',
        params: {
          finalAmount: response.finalAmount,
          discountAmount: discountAmount,
        },
      })
    } catch (error) {
      Alert.alert('Error', 'Unable to apply the discount code')
    }
  }
  
  

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: 'center',
        }}
      />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <Text style={styles.title}>Select ShopQ Voucher</Text>
        <FlatList
          data={coupons}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.couponCard,
                selectedCoupon?._id === item._id && styles.selectedCoupon,
              ]}
              onPress={() => handleCouponSelect(item)}
            >
              <View style={styles.couponContent}>
                <Text style={styles.couponCode}>{item.code}</Text>
                <Text style={styles.discount}>
                  Discount {item.discount}% 
                </Text>
                <Text style={styles.expiryDate}>
                  Expiry: {new Date(item.expiresAt).toLocaleDateString()}
                </Text>
              </View>
              <Checkbox
                status={selectedCoupon?._id === item._id ? 'checked' : 'unchecked'}
                onPress={() => handleCouponSelect(item)}
              />
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyCoupon}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={[styles.applyButton, { backgroundColor: '#ccc', marginTop: 10 }]}
  onPress={() => router.push('/checkout')}
>
  <Text style={[styles.buttonText, { color: '#000' }]}>Skip voucher</Text>
</TouchableOpacity>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedCoupon: { borderColor: Colors.primary, borderWidth: 2 },
  couponContent: { flex: 1 },
  couponCode: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  discount: { fontSize: 15, color: '#333', marginTop: 5, fontWeight: 'bold' },
  expiryDate: { fontSize: 12, color: 'gray', marginTop: 5 },
  applyButton: {
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
})

export default CouponScreen
