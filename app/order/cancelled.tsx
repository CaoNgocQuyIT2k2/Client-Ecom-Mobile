import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getOrderDetails, getUserOrdersByStatus } from '@/services/orderService'
import { Colors } from '@/constants/Colors'
import OrderDetailsModal from '@/components/OrderDetailsModal'

export default function CancelledScreen() {
  const [confirmedOrders, setConfirmedOrders] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  
  const handleViewMore = async (orderId: string) => {
    try {
      const response = await getOrderDetails(orderId)
      setSelectedProducts(response.data.products)
      setModalVisible(true)
    } catch (err) {
      console.error('❌ Error loading order details:', err)
    }
  }
  const recommendedProducts = [
    {
      id: '101',
      title: 'Bluetooth Headphones Over-Ear',
      price: 326600,
      image: require('../../assets/images/defaultUser.png'),
      discount: '-49%',
    },
    {
      id: '102',
      title: 'Stainless Steel S Hook',
      price: 5000,
      image: require('../../assets/images/defaultUser.png'),
      discount: 'Best Price',
    },
  ]

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const token = await AsyncStorage.getItem('authToken')
        if (!token) throw new Error('Không tìm thấy token')

        const decoded = JSON.parse(atob(token.split('.')[1])) // Decode JWT để lấy idUser

        // Lấy danh sách New Order
        const orders = await getUserOrdersByStatus(
          decoded.idUser,
          'Cancelled'
        )
        setConfirmedOrders(orders)
      } catch (error) {
        console.error('❌ Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <View style={styles.container}>
    {loading ? (
      <ActivityIndicator size="large" color="blue" />
    ) : confirmedOrders.length === 0 ? (
      <Text style={styles.noOrdersText}>You have no orders yet.</Text>
    ) : (
        <>
          <FlatList
            data={confirmedOrders}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <Image
                  source={{ uri: item.products[0]?.image || '' }}
                  style={styles.productImage}
                />
                <View style={styles.orderDetails}>
                  <Text style={styles.title}>
                    {item.products[0]?.title || 'No Title'}
                  </Text>
                  <Text style={styles.variant}>
                    Quantity: {item.products[0]?.quantity}
                  </Text>
                  <Text style={styles.price}>
                    ${item.totalAmount.toLocaleString()}
                  </Text>
                  <Text style={styles.status}>Cancelled</Text>

                 {item.products.length > 1 && (
  <TouchableOpacity
    style={styles.viewMoreButton}
    onPress={() => handleViewMore(item._id)}
  >
    <Text style={styles.viewMoreText}>See More</Text>
  </TouchableOpacity>
)}


                  <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactText}>Contact Shop</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListFooterComponent={
              <>
                <Text style={styles.sectionTitle}>You May Also Like</Text>
                <FlatList
                  horizontal
                  data={recommendedProducts}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.recommendCard}>
                      <Image
                        source={item.image}
                        style={styles.recommendImage}
                      />
                      <Text style={styles.discount}>{item.discount}</Text>
                      <Text style={styles.recommendTitle}>{item.title}</Text>
                      <Text style={styles.recommendPrice}>
                        ₫{item.price.toLocaleString()}
                      </Text>
                    </View>
                  )}
                />
              </>
            }
          />
        </>
      )}
      <OrderDetailsModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  products={selectedProducts}
/>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowOpacity: 0.1,
  },
  noOrdersText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  orderDetails: { flex: 1, marginLeft: 10 },
  title: { fontSize: 16, fontWeight: 'bold' },
  variant: { color: 'gray' },
  price: { fontSize: 14, color: Colors.primary, fontWeight: 'bold' },
  status: { color: Colors.primary, fontWeight: 'bold' },
  viewMoreButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  viewMoreText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  contactButton: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  contactText: { color: '#000', textAlign: 'center' },
  recommendCard: {
    width: 150,
    marginRight: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  recommendImage: { width: 100, height: 100, borderRadius: 10 },
  discount: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: Colors.primary,
    color: '#fff',
    padding: 2,
    fontSize: 10,
    borderRadius: 5,
  },
  recommendTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  recommendPrice: { color: Colors.primary, fontWeight: 'bold', fontSize: 14 },
})
