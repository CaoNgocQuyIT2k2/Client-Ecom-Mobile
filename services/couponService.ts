// services/couponService.ts

import { BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Lấy danh sách mã giảm giá của người dùng
export const getUserCoupons = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
  
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const idUser = decoded.idUser;
  
      const response = await axios.get(`${BASE_URL}/coupon/${idUser}`, {
        headers: {
          'Content-Type': 'application/json',  // Xác định Content-Type
          'Authorization': `Bearer ${token}`, // Gửi token trong Authorization header
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch coupons:', error);
      throw error;
    }
  };
  
  

// Áp dụng mã giảm giá cho đơn hàng
export const applyCoupon = async (code: string, totalAmount: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
  
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const idUser = decoded.idUser;
  
      const response = await axios.post(
        `${BASE_URL}/coupon/applyCoupon`,
        {
          idUser,
          code,
          totalAmount,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      return response.data; // Trả về discount và finalAmount
    } catch (error) {
      console.error('❌ Failed to apply coupon:', error);
      throw error;
    }
  };
  
