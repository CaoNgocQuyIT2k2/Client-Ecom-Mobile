import axios from 'axios'
import { BASE_URL } from '@/constants/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const toggleWishlist = async (productId: string) => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    if (!token) throw new Error('User not authenticated')

    const decoded = JSON.parse(atob(token.split('.')[1]))
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

    const decoded = JSON.parse(atob(token.split('.')[1]))
    const idUser = decoded.idUser // Lấy idUser từ token
    try {
      const response = await axios.get(
        `${BASE_URL}/wishlist/getWishlist/${idUser}`
      )
      return response.data
    } catch (error) {
      console.error('❌ Error fetching wishlist:', error)
      throw error
    }
  }