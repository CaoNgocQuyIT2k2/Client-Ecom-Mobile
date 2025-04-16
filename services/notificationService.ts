import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants/api';

// Lấy danh sách thông báo từ server
export const getNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('User not authenticated');

    const response = await axios.get(`${BASE_URL}/notifications/getNotifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;  // Dữ liệu trả về là danh sách thông báo
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    throw error;
  }
};

// Đánh dấu thông báo là đã đọc
export const markAsReadApi = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('User not authenticated');

    const response = await axios.put(
      `${BASE_URL}/notifications/${id}/read`, 
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;  // Trả về thông báo đã được cập nhật
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    throw error;
  }
};
