import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItemType } from '@/types/type';
import { Alert } from 'react-native';

interface CartState {
  items: CartItemType[];
  selectedItems: CartItemType[];
}



const initialState: CartState = {
  items: [],
  selectedItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartItemType[]>) {
      state.items = action.payload;
      AsyncStorage.setItem('cart', JSON.stringify(state.items));
    },
    addToCart(state, action: PayloadAction<CartItemType>) {
      state.items.push(action.payload);
      AsyncStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      AsyncStorage.setItem('cart', JSON.stringify(state.items));
    },

updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
  const { id, quantity } = action.payload;
  
  // Find the product in the cart
  const itemIndex = state.items.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    if (quantity < 1) {
      // Show confirmation dialog before removing the item
      Alert.alert(
        'Confirmation',
        'Do you want to remove this item from the cart?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: () => {
              state.items = state.items.filter((item) => item.id !== id);
              state.selectedItems = state.selectedItems.filter((item) => item.id !== id);
              AsyncStorage.setItem('cart', JSON.stringify(state.items));
            },
            style: 'destructive',
          },
        ]
      );
    } else {
      // Update quantity if greater than 0
      state.items[itemIndex].quantity = quantity;
    }
  }

  // Check in selectedItems if the product is selected
  const selectedIndex = state.selectedItems.findIndex((item) => item.id === id);
  if (selectedIndex !== -1 && quantity > 0) {
    state.selectedItems[selectedIndex].quantity = quantity;
  }

  AsyncStorage.setItem('cart', JSON.stringify(state.items));
},

      
setSelectedItems: (state, action) => {
  state.selectedItems = action.payload;  // Cập nhật đúng dữ liệu
},

    clearSelectedItems(state) {
        // Giữ lại các sản phẩm không có trong danh sách `selectedItems`
        state.items = state.items.filter(
            (item) => !state.selectedItems.some((selected) => selected._id === item._id) // So sánh bằng _id thay vì productId
        );
    
        // Xóa danh sách `selectedItems` sau khi mua hàng
        state.selectedItems = [];
    
        // Lưu lại danh sách giỏ hàng mới vào AsyncStorage
        AsyncStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    
    loadCartFromStorage(state, action: PayloadAction<CartItemType[]>) {
      state.items = action.payload;
    }
  },
});

export const { setCartItems, addToCart, removeFromCart, updateQuantity, setSelectedItems, clearSelectedItems, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
