import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '@/constants/api'
import { Order } from '@/types/type'
import { Buffer } from 'buffer'
import { decode as atob } from 'base-64' // thư viện hỗ trợ React Native

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

export const getRewardPoints = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    if (!token) throw new Error('User not authenticated')

    // Giải mã JWT an toàn từ base64url
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))
    const idUser = decoded.idUser

    const response = await axios.get(
      `${BASE_URL}/rewardPoints/getRewardPoints/${idUser}`
    )
    return response.data.rewardPoints // Trả về giá trị rewardPoints
  } catch (error) {
    console.error('Error fetching reward points:', error)
    throw new Error('Could not fetch reward points from API')
  }
}

export const fetchOrderSummary = async (userId: number, range = 'all', groupBy: 'week' | 'month' | 'year' = 'month') => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    const res = await axios.get(`${BASE_URL}/order/summary/${userId}?range=${range}&groupBy=${groupBy}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data
  } catch (err) {
    console.error('Fetch summary error:', err)
    throw err
  }
}

export const fetchOrderStats = async (userId: number) => {
  try {
    const token = await AsyncStorage.getItem('authToken')
  const res = await axios.get(`${BASE_URL}/order/stats/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  return res.data
  } catch (err) {
    console.error('Fetch summary error:', err)
    throw err
  }
}