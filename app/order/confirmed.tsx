import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  cancelOrder,
  getOrderDetails,
  getUserOrdersByStatus,
  requestCancelOrder,
} from '@/services/orderService'
import { Colors } from '@/constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import OrderDetailsModal from '@/components/OrderDetailsModal'

export default function ConfirmedScreen() {
  const [confirmedOrders, setConfirmedOrders] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // State để xử lý modal chọn lý do hủy đơn
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState("Confirmed"); 
  const [modalVisible1, setModalVisible1] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  
  const handleViewMore = async (orderId: string) => {
    try {
      const response = await getOrderDetails(orderId)
      setSelectedProducts(response.data.products)
      setModalVisible1(true)
    } catch (err) {
      console.error('❌ Error loading order details:', err)
    }
  }
  const cancellationReasons = [
    'Đổi ý không muốn mua',
    'Tìm thấy giá rẻ hơn',
    'Muốn thay đổi sản phẩm',
    'Lý do khác',
  ]

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

  // 🛑 Hàm mở modal chọn lý do hủy
  const openCancelModal = (orderId: string) => {
    setSelectedOrderId(orderId)
    setModalVisible(true)
  }

  // ✅ Hàm hủy đơn hàng với lý do
  const handleCancelOrder = async () => {
    if (!selectedOrderId || !selectedReason) {
      Alert.alert('Lỗi', 'Vui lòng chọn lý do hủy đơn!')
      return
    }

    try {
      setLoading(true)

      // Gọi API requestCancelOrder với idOrder và reason
      const response = await requestCancelOrder(selectedOrderId, selectedReason)

      Alert.alert(
        'Hủy đơn hàng',
        response.message || 'Yêu cầu hủy đơn đã được gửi!'
      )

      // Cập nhật danh sách đơn hàng (nếu API không tự động loại bỏ đơn Cancelled)
      const updatedOrders = confirmedOrders.filter(
        (order) => order._id !== selectedOrderId
      )
      setConfirmedOrders(updatedOrders)
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Gửi yêu cầu hủy đơn thất bại. Vui lòng thử lại.'
      Alert.alert('Lỗi', errorMessage)
    } finally {
      setLoading(false)
      setModalVisible(false) // Đóng modal sau khi xử lý xong
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Không tìm thấy token");
  
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT để lấy idUser
  
        // Gọi API lấy danh sách đơn hàng theo status hiện tại
        const orders = await getUserOrdersByStatus(decoded.idUser, selectedStatus);
  
        setConfirmedOrders(orders);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [selectedStatus]); // Gọi lại API khi trạng thái thay đổi
  

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
                  <Text style={styles.status}>
                    {item.previousStatus
                      ? `${item.previousStatus} ➝ ${item.status}`
                      : item.status}
                  </Text>

                 {item.products.length > 1 && (
  <TouchableOpacity
    style={styles.viewMoreButton}
    onPress={() => handleViewMore(item._id)}
  >
    <Text style={styles.viewMoreText}>See More</Text>
  </TouchableOpacity>
)}


                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <TouchableOpacity style={styles.contactButton}>
                      <Text style={styles.contactText}>Contact Shop</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => openCancelModal(item._id)}
                    >
                      <Text style={styles.cancelText}>Cancel Order</Text>
                    </TouchableOpacity>
                  </View>
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
  visible={modalVisible1}
  onClose={() => setModalVisible1(false)}
  products={selectedProducts}
/>

      {/* 🛑 Modal chọn lý do hủy đơn hàng */}
<Modal animationType="slide" transparent={true} visible={modalVisible}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select a reason to cancel the order</Text>
      {cancellationReasons.map((reason) => (
        <TouchableOpacity
          key={reason}
          style={styles.reasonOption}
          onPress={() => setSelectedReason(reason)} // ✅ Allow selecting only one reason
        >
          <MaterialCommunityIcons
            name={
              selectedReason === reason
                ? 'checkbox-marked'
                : 'checkbox-blank-outline'
            }
            size={20}
            color={selectedReason === reason ? Colors.primary : 'gray'}
          />
          <Text style={styles.reasonText}>{reason}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.cancelModalButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmCancelButton}
          onPress={handleCancelOrder}
        >
          <Text style={styles.confirmCancelText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

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
  noOrdersText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },

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
    width: '49%', // Giảm kích thước xuống 40%
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    width: '49%', // Giữ kích thước như Contact Shop
    alignItems: 'center',
    marginLeft: 10, // Tạo khoảng cách giữa hai nút
  },

  contactText: { color: '#000', fontWeight: 'bold' },
  cancelText: { color: '#fff', fontWeight: 'bold' },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  reasonOption: {
    flexDirection: 'row', // 🛑 Hiển thị checkbox + text trên cùng 1 hàng
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  reasonText: {
    marginLeft: 10, // 📌 Tạo khoảng cách giữa checkbox và text
    fontSize: 16,
  },

  selectedReason: {
    backgroundColor: Colors.primary,
    color: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelModalButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  confirmCancelButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  confirmCancelText: { color: '#fff', fontWeight: 'bold' },
})
