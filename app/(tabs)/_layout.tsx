import React, { useEffect, useState, useCallback } from 'react';
import { Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import { TabBar } from '@/components/TabBar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchNotifications } from '@/redux/slices/notificationSlice';

export default function TabLayout() {
  const [cartCount, setCartCount] = useState(0);
  const unreadCount = useSelector((state: RootState) => state.notification.unreadCount);
  console.log('Unread count from Redux:', unreadCount);
  
  console.log("Unread count2:", unreadCount);
  const dispatch = useDispatch<AppDispatch>();  // Đảm bảo dispatch có kiểu AppDispatch
  useEffect(() => {
    console.log('Unread count:', unreadCount);
  }, [unreadCount]);
  // Khi focus vào tab sẽ gọi lại hàm fetchNotifications
  useFocusEffect(
    useCallback(() => {
      console.log('Fetching notifications...');
      dispatch(fetchNotifications());
    }, [dispatch])
  );
  
  const fetchCartCount = async () => {
    try {
      const cartString = await AsyncStorage.getItem('cart');
      const cart = cartString ? JSON.parse(cartString) : [];

      const totalItems = cart.reduce(
        (sum: number, item: any) => sum + (item.quantity || 1),
        0
      );

      setCartCount(totalItems);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  // Listen for cart updates via an event
  useEffect(() => {
    const listener = EventRegister.addEventListener(
      'updateCartCount',
      (count) => {
        setCartCount(count);
      }
    );

    return () => {
      if (typeof listener === 'string') {
        EventRegister.removeEventListener(listener);
      }
    };
  }, []);

  // Khi focus vào tab sẽ gọi lại hàm fetchCartCount
  useFocusEffect(
    useCallback(() => {
      fetchCartCount();
    }, [])
  );

  return (
    <Tabs
      tabBar={(props) => <TabBar {...(props as any)} cartCount={cartCount} />}
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ headerShown: false, title: 'Home' }}
      />
      <Tabs.Screen
        name="explore"
        options={{ headerShown: false, title: 'Explore' }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
