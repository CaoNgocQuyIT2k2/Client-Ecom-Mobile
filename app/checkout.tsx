import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Image,
  Alert,
  Switch,
  ScrollView,
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '@/constants/api'
import { useHeaderHeight } from '@react-navigation/elements'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { createOrder, getRewardPoints } from '@/services/orderService'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { clearSelectedItems } from '@/redux/cartSlice'
import { applyCoupon, getUserCoupons } from '@/services/couponService'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { Checkbox } from 'react-native-paper'
import { Buffer } from 'buffer';

// Interfaces
interface Address {
  _id: string
  idUser: Number // Thêm thuộc tính này để tương thích với dữ liệu API
  fullName: string
  phone: string
  addressLine: string
  city: string
  state: string
  country: string
  isDefault: boolean
}

interface Product {
  _id: string
  productId: string
  title: string
  price: number
  quantity: number
  images: string[]
}

// Khai báo kiểu dữ liệu cho Coupon
interface CouponType {
  code: string
  discount: number
}

const CheckoutScreen = () => {
  const headerHeight = useHeaderHeight() || 0
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')
  const [modalVisible, setModalVisible] = useState(false)
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null)
  const [coupons, setCoupons] = useState([])
  const { finalAmount, discountAmount } = useLocalSearchParams()
  const [cartTotal1, setCartTotal1] = useState(finalAmount || 0)
  const [cartTotal2, setCartTotal2] = useState(finalAmount)
  const [useRewardPoints, setUseRewardPoints] = useState(false); // Trạng thái bật/tắt sử dụng reward points
  const [decoded, setDecoded] = useState<any>(null); // Dùng useState để lưu dữ liệu giải mã
  const [rewardPointsDiscount, setRewardPointsDiscount] = useState(0);

  useEffect(() => {
    // Tính lại cartTotal nếu finalAmount có thay đổi
    setCartTotal1(finalAmount || cartTotal)
  }, [finalAmount])

  useEffect(() => {
    // Lấy mã giảm giá khi người dùng vào màn hình checkout
    const fetchCoupons = async () => {
      try {
        const result = await getUserCoupons()
        setCoupons(result.coupons) // Set coupons data
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch coupons.')
      }
    }

    fetchCoupons()
  }, [])

  const dispatch = useDispatch()
  const selectedItems = useSelector(
    (state: RootState) => state.cart.selectedItems
  )

  const cartTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('Token not found')
          // Giải mã JWT an toàn từ base64url
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))
    setDecoded(decoded); // Lưu dữ liệu vào state
      fetchAddresses(decoded.idUser)
    } catch (error) {
      console.error('❌ Error fetching user data:', error)
    }
  }

  const fetchAddresses = async (idUser: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/address/${idUser}`)
      if (response.data.success) {
        setAddresses(response.data.data)
        const defaultAddress = response.data.data.find(
          (addr: Address) => addr.isDefault
        )
        setSelectedAddress(defaultAddress || null)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
        Alert.alert('Error', 'Please select a shipping address.')
        return
    }
    try {
        const token = await AsyncStorage.getItem('authToken')
        if (!token) throw new Error('User not authenticated')
            // Giải mã JWT an toàn từ base64url
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))

        const orderData = {
            idUser: decoded.idUser,
            address: selectedAddress,
            products: selectedItems.map((item) => ({
                productId: item.productId || item._id, // ✅ Sử dụng _id nếu cần
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                image: item.images?.[0] || '',
            })),
            totalAmount: cartTotal2,
            paymentMethod: 'Cash on Delivery',
            coupon: selectedCoupon ? selectedCoupon.code : null, // Thêm coupon vào dữ liệu đơn hàng
            discountAmount: discountAmount || 0,
            usedRewardPoints: useRewardPoints ? rewardPointsDiscount : 0, // 👉 THÊM DÒNG NÀY
        }
        const response = await createOrder(orderData)

        if (response.success) {
          dispatch(clearSelectedItems())
          // ✅ Alert nếu có discountMessage
          if (response.discountMessage) {
            Alert.alert('Discount Info', response.discountMessage)
          }
        
          setTimeout(() => router.push('/afterorder'), 2000)
        } else {
          Alert.alert('Error', 'Failed to place order.')
        }
        
    } catch (error) {
        console.error('❌ Error:', error)
        Alert.alert('Error', 'Something went wrong. Please try again.')
    }
}


  const handleChangeAddress = () => {
    console.log('Opening modal...')
    setModalVisible(true) // Mở modal khi bấm vào nút
  }
  
  
  useEffect(() => {
    const fetchRewardPoints = async () => {
      try {
        const rewardPoints = await getRewardPoints(); // Lấy rewardPoints từ API
        // Chuyển rewardPoints thành số và lưu vào state
        setRewardPointsDiscount(parseFloat(rewardPoints.toString()));  // Đảm bảo kiểu number
      } catch (error) {
        console.error('Error fetching reward points:', error);
      }
    };
  
    fetchRewardPoints();
  }, [cartTotal]);
  
  const calculateTotalAmount = () => {
    const totalAmount = Number(finalAmount) || cartTotal;
    const rewardPoints = Number(rewardPointsDiscount);
    
    let finalAmount1 = totalAmount;
    const discount = discountAmount
    ? parseFloat(Array.isArray(discountAmount) ? discountAmount[0] : discountAmount)
    : 0;
  
  
    // Trừ voucher (nếu có)
    if (selectedCoupon) {
      finalAmount1 -= discount; // discount là giá trị giảm giá từ voucher
    }
  
    // Nếu sử dụng điểm thưởng
    if (useRewardPoints) {
      const pointsToUse = rewardPoints > finalAmount1 ? finalAmount1 : rewardPoints;
      finalAmount1 -= pointsToUse;
    }
  
    return finalAmount1;
  };
  
  
  // Khi người dùng bật/tắt Switch, tính lại finalAmount
  useEffect(() => {
    // Tính lại cartTotal nếu finalAmount có thay đổi
    setCartTotal1(finalAmount || cartTotal)
  }, [finalAmount]);
  
  useEffect(() => {
    // Cập nhật tiền sau khi tính lại
    const finalAmount2 = calculateTotalAmount();
    setCartTotal2(finalAmount2.toString());  // Chuyển thành chuỗi nếu cần
  }, [useRewardPoints, rewardPointsDiscount, selectedCoupon, discountAmount, selectedItems]);
  
  console.log("///");
  console.log("carrtTotal: " +cartTotal);
  console.log("carrtTotal1: " +cartTotal1);
  console.log("carrtTotal2: " +cartTotal2);
  console.log("finalAmount: ", finalAmount);
  console.log("rewardPointsDiscount: ", rewardPointsDiscount);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push("/cart")} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        {selectedAddress ? (
          <View style={styles.selectedAddressContainer}>
            <Text style={styles.selectedAddressText}>
              {selectedAddress.fullName} - {selectedAddress.phone}
            </Text>
            <Text style={styles.selectedAddressText}>
              {selectedAddress.addressLine}, {selectedAddress.city},{' '}
              {selectedAddress.state}, {selectedAddress.country}
            </Text>
            <TouchableOpacity
              style={styles.changeAddressButton}
              onPress={handleChangeAddress}
            >
              <Text style={styles.changeAddressText}>Change Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noAddressText}>No default address found.</Text>
        )}

        <Text style={styles.sectionTitle}>Selected Products</Text>
        <FlatList<Product>
          data={selectedItems.map((item) => ({
            _id: item._id,
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            images: Array.isArray(item.images) ? item.images : [item.images], // Ensure images is an array
          }))}
          keyExtractor={(item) => item._id} // Dùng _id thay vì productId
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image
                source={{ uri: item.images[0] }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.title}</Text>
                <Text style={styles.productPrice}>
                  ${item.price} x {item.quantity}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }} // Đảm bảo phần cuối của list có không gian cuộn
          showsVerticalScrollIndicator={false} // Tắt thanh cuộn dọc nếu cần
        />

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethodContainer}>
          <Checkbox
            status={
              paymentMethod === 'Cash on Delivery' ? 'checked' : 'unchecked'
            }
            onPress={() => setPaymentMethod('Cash on Delivery')}
          />
          <Text style={styles.paymentMethodText}>Cash on Delivery</Text>
        </View>

        <Text style={styles.sectionTitle}>Voucher</Text>
        <View style={styles.voucherContainer}>
          <FontAwesome5
            name="ticket-alt"
            size={24}
            color="#4F46E5"
            style={styles.voucherIcon}
          />
          <Text style={styles.voucherText}>ShopQ Voucher</Text>
          <TouchableOpacity
            style={styles.voucherButton}
            onPress={() =>
              router.push({
                pathname: '/coupons',
                params: { totalAmount: cartTotal }, // Truyền totalAmount đúng cách
              })
            }
          >
            {Number(discountAmount) > 0 && (
              <View>
                <Text style={styles.discountText}>-${discountAmount}</Text>
              </View>
            )}

            <Text style={styles.voucherButtonText}></Text>
            <FontAwesome5 name="chevron-right" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.rewardPointsContainer}>
  <Text style={styles.rewardPointsText}>Use Reward Points (${rewardPointsDiscount})</Text>
  <Switch
    value={useRewardPoints}
    onValueChange={setUseRewardPoints}
  />
  {useRewardPoints && (
    <Text style={styles.rewardPointsDiscountText}>
    </Text>
  )}

</View>
</ScrollView>


      </View>
      <View style={styles.orderContainer}>
  <Text style={styles.totalText}>Total: ${cartTotal2}</Text>
  <TouchableOpacity
    style={styles.orderButton}
    onPress={handleCreateOrder}
  >
    <Text style={styles.orderText}>Place Order</Text>
  </TouchableOpacity>
</View>
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Shipping Address</Text>
              <FlatList<Address>
                data={addresses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.addressItem,
                      selectedAddress &&
                        selectedAddress._id === item._id &&
                        styles.selectedAddress,
                    ]}
                    onPress={() => {
                      setSelectedAddress(item)
                      setModalVisible(false)
                    }}
                  >
                    <Text>
                      {item.fullName} - {item.phone}
                    </Text>
                    <Text>
                      {item.addressLine}, {item.city}, {item.state},{' '}
                      {item.country}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  )
}

export default CheckoutScreen

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9F9F9' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  productItem: { flexDirection: 'row', marginBottom: 15 },
  productImage: { width: 50, height: 50, marginRight: 10 },
  productDetails: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productPrice: { fontSize: 14, color: 'gray' },

  selectedAddressContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#E3F2FD',
  },
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Căn trái và phải
    alignItems: 'center', // Canh giữa theo chiều dọc
    backgroundColor: Colors.extraLightGray, // Đổ nền màu xám
    padding: 15, // Nếu muốn có khoảng đệm bên trong

  },

  orderButton: {
    padding: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    width: '40%', // Đặt chiều rộng là 40%
    alignItems: 'center',
  },
  orderText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  selectedAddressText: { fontSize: 16, marginBottom: 5 },
  changeAddressButton: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#4F46E5',
    borderRadius: 5,
    alignItems: 'center',
  },
  changeAddressText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  noAddressText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  voucherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  voucherIcon: {
    marginRight: 10,
  },
  voucherText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  voucherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  voucherButtonText: {
    color: 'white',
    fontSize: 14,
    marginRight: 5,
  },
  discountText: {
    fontSize: 14,
    color: Colors.white, // Màu cho số tiền giảm
    fontWeight: 'bold',
    marginRight: 8, // Khoảng cách giữa số tiền giảm và tổng tiền
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    color: Colors.primary,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  totalText: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 5,
  },
  rewardPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rewardPointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  rewardPointsDiscountText: {
    fontSize: 14,
    color: Colors.darkRed,
    fontWeight: 'bold',
    marginTop: 5,
  },
  closeModalText: { color: '#fff', textAlign: 'center' },
  addressItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedAddress: {
    backgroundColor: '#F1F1F1',
  },
  shippingOptionButton: {
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedShippingOption: {
    backgroundColor: '#4F46E5',
  },
  shippingOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  // changeAddressButton: {
  //   marginTop: 10,
  //   backgroundColor: '#4F46E5',
  //   padding: 10,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  // changeAddressText: { color: '#fff', fontWeight: 'bold' },
})
