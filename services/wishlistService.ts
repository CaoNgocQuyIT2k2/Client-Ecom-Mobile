import axios from 'axios'
import { BASE_URL } from '@/constants/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decode as atob } from 'base-64'   // thư viện hỗ trợ React Native
import { Buffer } from 'buffer';

export const toggleWishlist = async (productId: string) => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    if (!token) throw new Error('User not authenticated')

        // Giải mã JWT an toàn từ base64url
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))

    const idUser = decoded.idUser // Lấy idUser từ token

    console.log('Sending request to toggle wishlist', { idUser, productId })

    const response = await axios.post(
      `${BASE_URL}/wishlist/toggleWishlist`,
      { idUser, productId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('❌ Error toggling wishlist:', error.response.data)
      // In thêm status và headers của phản hồi
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
      throw new Error(error.response?.data?.message || 'Server error')
    } else {
      console.error('❌ Unexpected error:', error)
      throw new Error('An unexpected error occurred')
    }
  }
}


export const getWishlist = async () => {
  const token = await AsyncStorage.getItem('authToken')
  if (!token) throw new Error('User not authenticated')

  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')

    const decoded = JSON.parse(atob(padded))
    const idUser = decoded.idUser

    const response = await axios.get(`${BASE_URL}/wishlist/getWishlist/${idUser}`)
    return response.data
  } catch (error) {
    console.error('❌ Error fetching wishlist:', error)
    throw error
  }
}

  