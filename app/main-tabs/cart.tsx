import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useEffect } from 'react'
import { router, Stack, useNavigation } from 'expo-router'
import { CartItemType } from '@/types/type'
import { useHeaderHeight } from '@react-navigation/elements'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { EventRegister } from 'react-native-event-listeners'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
  removeFromCart,
  updateQuantity,
  setSelectedItems,
  loadCartFromStorage,
} from '../../redux/cartSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CartScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const selectedItems = useSelector(
    (state: RootState) => state.cart.selectedItems
  )


  useEffect(() => {
    const loadCartAndSelectedItems = async () => {
      const cartData = await AsyncStorage.getItem('cart');
      const selectedData = await AsyncStorage.getItem('selectedItems');
  
      if (cartData) {
        dispatch(loadCartFromStorage(JSON.parse(cartData)));
      }
      if (selectedData) {
        dispatch(setSelectedItems(JSON.parse(selectedData)));
      }
    };
    
    loadCartAndSelectedItems();
  }, [dispatch]);
  

  useEffect(() => {
    navigation.setOptions({ title: 'Cart' })
  }, [navigation])

  useEffect(() => {
    // Reset selectedItems khi vào CartScreen
    const resetSelectedItems = async () => {
      dispatch(setSelectedItems([]))  
      await AsyncStorage.setItem('selectedItems', JSON.stringify([]))  
    }
    resetSelectedItems()
  }, [])

  useEffect(() => {
    // Cập nhật badge số lượng sản phẩm trong giỏ hàng
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    EventRegister.emit('updateCartCount', totalItems)
  }, [cartItems])

  const headerHeight = useHeaderHeight()
  // useEffect(() => {
  //   console.log('🛒 Redux - Selected Items:', selectedItems)
  // }, [selectedItems])
  const checkAsyncStorage = async () => {
    const storedData = await AsyncStorage.getItem('selectedItems')
    // console.log('📦 Dữ liệu trong AsyncStorage:', storedData)
  }
  
  useEffect(() => {
    checkAsyncStorage()
  }, [selectedItems])
    
  const toggleSelectItem = async (item: CartItemType) => {
    // console.log('🔍 Trước khi cập nhật:', selectedItems)
  
    const isSelected = selectedItems.some((selected) => selected.id === item.id)
  
    let updatedSelectedItems
    if (isSelected) {
      updatedSelectedItems = selectedItems.filter(
        (selected) => selected.id !== item.id
      )
    } else {
      updatedSelectedItems = [...selectedItems, item]
    }
  
    // console.log('✅ Sau khi cập nhật:', updatedSelectedItems)
  
    dispatch(setSelectedItems(updatedSelectedItems))
  
    // Lưu vào AsyncStorage
    await AsyncStorage.setItem(
      'selectedItems',
      JSON.stringify(updatedSelectedItems)
    )
  }
  
  

  const proceedToCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert(
        'Chọn sản phẩm',
        'Vui lòng chọn ít nhất một sản phẩm để thanh toán.'
      )
      return
    }

    // console.log('📌 Selected Products Before Checkout:', selectedItems)

    setTimeout(() => {
      router.push({
        pathname: '/checkout',
        params: { selectedItems: JSON.stringify(selectedItems) },
      })
    }, 100)
  }

  // useEffect(() => {
  //   console.log('📌 Cart Items:', cartItems)
  // }, [cartItems])

  const totalAmount = cartItems.reduce((sum, item) => {
    if (selectedItems.some((selected) => selected.id === item.id)) {
      return sum + item.price * item.quantity
    }
    return sum
  }, 0)

  const CartItem = ({ item }: { item: CartItemType }) => {
    const isSelected = selectedItems.some((selected) => selected.id === item.id)

    return (
      <View style={styles.itemWrapper}>
        <TouchableOpacity
          onPress={() => toggleSelectItem(item)}
          style={styles.checkbox}
        >
          <Ionicons
            name={
              selectedItems.some((selected) => selected.id === item.id)
                ? 'checkbox-outline'
                : 'square-outline'
            }
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>

        <Image source={{ uri: item.images[0] }} style={styles.itemImg} />

        <View style={styles.itemInfoWrapper}>
          <Text style={styles.itemText}>{item.title}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>

          <View style={styles.itemControlWrapper}>
            <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
              <Ionicons name="trash-outline" size={22} color={'red'} />
            </TouchableOpacity>

            <View style={styles.quantityControlWrapper}>
              <TouchableOpacity
                onPress={() => {
                  if (item.quantity === 1) {
                    Alert.alert(
                      'Remove Item',
                      'Do you want to remove this item from the cart?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Remove',
                          onPress: () => dispatch(removeFromCart(item.id)),
                        },
                      ]
                    )
                  } else {
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                }}
              >
                <Ionicons
                  name="remove-outline"
                  size={20}
                  color={Colors.black}
                />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() =>
                  dispatch(
                    updateQuantity({ id: item.id, quantity: item.quantity + 1 })
                  )
                }
              >
                <Ionicons name="add-outline" size={20} color={Colors.black} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CartItem item={item} />}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={proceedToCheckout}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  checkbox: { marginRight: 10 },
  itemImg: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  itemInfoWrapper: { flex: 1, justifyContent: 'center', gap: 5 },
  itemText: { fontSize: 16, fontWeight: '500', color: Colors.black },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.black },
  itemControlWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  quantityControlWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: Colors.extraLightGray,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  checkoutBtnText: { fontSize: 16, fontWeight: '500', color: Colors.white },
  totalText: { fontSize: 16, fontWeight: 'bold', color: Colors.black },
})
