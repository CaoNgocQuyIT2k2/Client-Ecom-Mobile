// 📁 components/OrderDetailsModal.tsx
import React from 'react'
import {
  Modal,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Colors } from '@/constants/Colors'

interface Props {
  visible: boolean
  onClose: () => void
  products: any[]
}

export default function OrderDetailsModal({
  visible,
  onClose,
  products,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Order</Text>
          <FlatList
            data={products}
            keyExtractor={(item, index) => `${item.productId?._id}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                ) : (
                  <Image
                    source={require('@/assets/images/whiteImage.png')}
                    style={styles.productImage}
                  />
                )}

                <View style={styles.orderDetails}>
                  <Text style={styles.titleText}>
                    {item.productId?.title || 'No Title'}
                  </Text>
                  <Text style={styles.variant}>Quantity: {item.quantity}</Text>
                  <Text style={styles.variant}>Price: {item.price}</Text>
                </View>
              </View>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: '#fff' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  orderDetails: {
    flex: 1,
    marginLeft: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  variant: {
    color: 'gray',
    marginVertical: 2,
  },
  status: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  contactButton: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  contactText: {
    color: '#000',
    textAlign: 'center',
  },
  reviewButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 5,
    flex: 1,
  },
  reviewText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
})
