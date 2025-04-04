import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '@/constants/api'

export interface ReviewData {
  idUser: number
  orderId: string
  reviews: {
    productId: string
    rating: number
    comment: string
  }[]
}

export interface Review {
  _id: string;
  idUser: number;
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    fullName: string;
    avatar: string;
    idUser: number;
  };
}

  
export const createReview = async (reviewData: ReviewData) => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('User not authenticated')
  
        const formattedData = {
          idUser: reviewData.idUser,
          orderId: reviewData.orderId,
          reviews: reviewData.reviews
        }
        
  
      console.log("📌 Debug formattedData:", formattedData) // Log để kiểm tra
  
      const response = await axios.post(
        `${BASE_URL}/review/createReview`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      return response.data
    } catch (error) {
      console.error("❌ Error processing review:", error)
    }
}
  
export const checkReviewStatus = async (orderId: string, idUser: number): Promise<{ reviewExists: boolean }> => {
  try {
      const response = await axios.get(`${BASE_URL}/review/checkReview/${orderId}/${idUser}`);
      return { reviewExists: response.data.reviewExists }; // Trả về object thay vì boolean trực tiếp
  } catch (error) {
      console.error("❌ Error checking review status:", error);
      return { reviewExists: false }; // Tránh lỗi khi API bị lỗi
  }
};

// Lấy tất cả đánh giá của sản phẩm
export const getProductReviews = async (productId: string): Promise<Review[]> => {
  try {
      const response = await axios.get(`${BASE_URL}/review/getProductReview/${productId}`);
      return response.data.reviews;
  } catch (error) {
      console.error("❌ Error fetching product reviews:", error);
      return [];
  }
};

// Lấy 3 đánh giá mới nhất của sản phẩm
export const get3LatestProductReviews = async (productId: string): Promise<Review[]> => {
  try {
      const response = await axios.get(`${BASE_URL}/review/get3LatestProductReviews/${productId}`);
      return response.data.reviews;
  } catch (error) {
      console.error("❌ Error fetching latest product reviews:", error);
      return [];
  }
};

export const getTotalReviews = async (productId: string): Promise<number> => {
  try {
    const response = await axios.get(`${BASE_URL}/review/getTotalReview/${productId}`)
    return response.data.totalReviews || 0
  } catch (error) {
    console.error('❌ Lỗi khi lấy tổng số đánh giá:', error)
    return 0
  }
}