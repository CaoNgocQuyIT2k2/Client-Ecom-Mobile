import { BASE_URL } from '@/constants/api'
import { ProductType } from '@/types/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

export const getProductDetails = async (id: string) => {
    try {
      const URL = `${BASE_URL}/products/getProductByMongoId/${id}`;
      const response = await axios.get(URL);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  };

  export const getSimilarProducts = async (productId: string): Promise<ProductType[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products/getSimilarProducts/${productId}`);
      return response.data.similarProducts || [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy sản phẩm tương tự:', error);
      return [];
    }
  };

// 🟢 Lưu sản phẩm đã xem
export const saveRecentlyViewed = async (productId: string) => {
  try {
    // Lấy token từ AsyncStorage
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('User not authenticated');

    // Giải mã token để lấy idUser
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const idUser = decoded.idUser; // Lấy idUser từ token

    console.log('Sending request to save recently viewed', { idUser, productId });

    // Gửi request để lưu sản phẩm đã xem
    const response = await axios.post(
      `${BASE_URL}/recentlyViewed/saveRecentlyViewed`,  // URL của API lưu sản phẩm đã xem
      { productId, userId: idUser },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Thêm token vào header
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('❌ Error saving recently viewed:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      throw new Error(error.response?.data?.message || 'Server error');
    } else {
      console.error('❌ Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// 🟢 Lấy sản phẩm đã xem
export const getRecentlyViewed = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('User not authenticated');

    // Giải mã token để lấy idUser
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const idUser = decoded.idUser;

    const response = await axios.get(`${BASE_URL}/recentlyViewed/getRecentlyViewed/${idUser}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching recently viewed products:', error);
    throw error;
  }
};