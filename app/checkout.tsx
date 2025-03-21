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
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '@/constants/api'
import { useHeaderHeight } from '@react-navigation/elements'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { createOrder } from '@/services/orderService'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { clearSelectedItems } from '@/redux/cartSlice'

// Interfaces
interface Address {
  _id: string
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

const CheckoutScreen = () => {
  const headerHeight = useHeaderHeight() || 0
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')
  const [modalVisible, setModalVisible] = useState(false)
  const [cartItems, setCartItems] = useState<Product[]>([])

  const dispatch = useDispatch()
  const selectedItems = useSelector(
    (state: RootState) => state.cart.selectedItems
  )

  const cartTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('Token not found')
      const decoded = JSON.parse(atob(token.split('.')[1]))
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
      const decoded = JSON.parse(atob(token.split('.')[1]))

      const orderData = {
        idUser: decoded.idUser,
        address: selectedAddress,
        products: selectedItems.map((item) => ({
            productId: item.productId || item._id,  // ✅ Sử dụng _id nếu cần
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            image: item.images?.[0] || '',
          })),
          
        totalAmount: cartTotal,
        paymentMethod: 'Cash on Delivery',
      }

      const response = await createOrder(orderData)
      if (response.success) {
        dispatch(clearSelectedItems()); // Xóa selectedItems khỏi Redux
        setTimeout(() => router.push('/afterorder'), 300)
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
  data={selectedItems.map(item => ({
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
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productPrice}>
          ${item.price} x {item.quantity}
        </Text>
      </View>
    </View>
  )}
/>


        <Text style={styles.totalText}>Total: ${cartTotal}</Text>
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
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  selectedAddressContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#E3F2FD',
  },
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
  paymentMethod: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  paymentMethodText: { fontSize: 15 },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  orderButton: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Adjust to make the modal expand full screen
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền tối mờ
  },
  modalContainer: {
    flex: 1,
    width: '100%', // Đảm bảo modal full ngang
    paddingTop: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addressItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 20,
  },
  selectedAddress: { backgroundColor: '#D6E4FF', borderColor: '#4F46E5' },
  closeModalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4F46E5',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 50,
  },
  closeModalText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  productItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  productDetails: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  productPrice: { fontSize: 14, color: '#666' },
})
