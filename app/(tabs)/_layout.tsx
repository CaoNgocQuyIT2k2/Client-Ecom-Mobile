import React, { useEffect, useState, useCallback } from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { EventRegister } from 'react-native-event-listeners'; // ✅ Import EventRegister

export default function TabLayout() {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const cartString = await AsyncStorage.getItem('cart');
      const cart = cartString ? JSON.parse(cartString) : [];
  
  
      const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
  
  
      setCartCount(totalItems);
    } catch (error) {
      console.error('Lỗi khi lấy số lượng giỏ hàng:', error);
    }
  };

  // ✅ Lắng nghe sự kiện cập nhật giỏ hàng
  useEffect(() => {
    const listener = EventRegister.addEventListener("updateCartCount", (count) => {
      setCartCount(count);
    });
  
    return () => {
      if (typeof listener === "string") { // ✅ Kiểm tra chắc chắn listener là string
        EventRegister.removeEventListener(listener);
      }
    };
  }, []);
  

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
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false, title: "Home" }} />
      <Tabs.Screen name="explore" options={{ headerShown: false, title: "Explore" }} />
      <Tabs.Screen name="notifications" options={{ title: "Notifications" }} />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarBadge: cartCount
        }}
      />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
