import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '@/constants/api'
import { Order } from '@/types/type'

export const createOrder = async (orderData: any) => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    if (!token) throw new Error('User not authenticated')

    const response = await axios.post(`${BASE_URL}/order/create`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error('❌ Error placing order:', error)
    throw error
  }
}

export const getUserOrdersByStatus = async (idUser: string, status: string) => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    if (!token) throw new Error('User not authenticated')

    // Mã hóa trạng thái đơn hàng thành dạng URL an toàn
    const encodedStatus = encodeURIComponent(status)

    const response = await axios.get(
      `${BASE_URL}/order/${idUser}/status/${encodedStatus}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data.orders
  } catch (error) {
    console.error('❌ Error fetching orders by status:', error)
    throw error
  }
}

export const cancelOrder = async (idOrder: string) => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    if (!token) throw new Error('User not authenticated')

    const response = await axios.put(
      `${BASE_URL}/order/cancel/${idOrder}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('❌ Error canceling order:', error)
    throw error
  }
}

export const requestCancelOrder = async (idOrder: string, reason: string) => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    if (!token) throw new Error('User is not authenticated.')

    const response = await axios.post(
      `${BASE_URL}/requestcancelorder/requestCancel/${idOrder}`,
      { reason },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('❌ Error requesting order cancellation:', error)

    // 🔥 Extract error message from backend response
    let errorMessage = 'An error occurred. Please try again.'

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage // ✅ Get message from backend
    } else if (error.request) {
      errorMessage = 'Cannot connect to the server. Please check your network.'
    } else {
      errorMessage = error.message
    }

    throw new Error(errorMessage)
  }
}


export const getOrderDetails = async (orderId: string) => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    if (!token) throw new Error('User not authenticated')

    const response = await axios.get(`${BASE_URL}/order/details/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.data
  } catch (error) {
    console.error('❌ Error getting order details:', error)
    throw error
  }
}
