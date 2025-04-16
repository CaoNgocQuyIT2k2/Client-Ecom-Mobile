import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getNotifications } from '@/services/notificationService';

// Kiểu dữ liệu của thông báo
interface Notification {
    _id: string;
    title: string;
    content: string;
    isRead: boolean;
    image?: string | null;
    type?: string;
    orderId?: string | null;
    createdAt: string;
  }
  

// Kiểu dữ liệu trả về từ API khi gọi getNotifications
interface NotificationsResponse {
  data: Notification[];  // Dữ liệu trả về là một mảng thông báo
}

export const fetchNotifications = createAsyncThunk<Notification[], void>(
    'notifications/fetchNotifications',
    async () => {
      try {
        const response = await getNotifications();
        console.log('Fetched notifications:', response.data);  // Kiểm tra dữ liệu trả về từ API
        return response.data;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    }
  );
  
  const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
      list: [] as Notification[],
      unreadCount: 0,
    },
    reducers: {
      markAsReadLocally: (state, action) => {
        const id = action.payload;
        const index = state.list.findIndex((n) => n._id === id);
        console.log('index:', index);  // Kiểm tra giá trị unreadCount

        if (index !== -1) {
          state.list[index].isRead = true;
          state.list = state.list.map((notification) =>
            notification._id === action.payload
              ? { ...notification, isRead: true }
              : notification
          );
          state.unreadCount = state.list.filter((n) => !n.isRead).length;
          
           // Cập nhật lại số lượng thông báo chưa đọc
        }
      }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            console.log('Fetched notifications:', action.payload);  // Log dữ liệu trả về từ API
          
            state.list = action.payload;
          
            // Kiểm tra lại filter để đếm số lượng thông báo chưa đọc
            const unreadNotifications = action.payload.filter((n) => !n.isRead);
            console.log('Unread notifications:', unreadNotifications);  // Log các thông báo chưa đọc
          
            state.unreadCount = unreadNotifications.length;
          
            // Log thêm toàn bộ state
            console.log('Updated state:', state);
            console.log('Unread count updated:', state.unreadCount);
          });
          
      }
      
  });
  

export const { markAsReadLocally } = notificationSlice.actions;
export default notificationSlice.reducer;
