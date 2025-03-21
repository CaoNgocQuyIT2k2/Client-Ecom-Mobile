import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RouteProp, useRoute } from "@react-navigation/native";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";

// 🟢 Khai báo kiểu dữ liệu cho đơn hàng
type OrderItem = {
  id: string;
  title: string;
  status: string;
  price: number;
  image: string;
};

type OrdersData = {
  pending: OrderItem[];
  shipping: OrderItem[];
  delivered: OrderItem[];
  cancelled: OrderItem[];
};

// 🟢 Dữ liệu giả lập đơn hàng
const orderData: OrdersData = {
  pending: [
    { id: "1", title: "Tai nghe Bluetooth", status: "Chờ xác nhận", price: 260000, image: "https://via.placeholder.com/100" }
  ],
  shipping: [
    { id: "2", title: "Laptop ASUS", status: "Shipping", price: 15000000, image: "https://via.placeholder.com/100" }
  ],
  delivered: [
    { id: "3", title: "Bàn phím cơ", status: "Delivered", price: 1200000, image: "https://via.placeholder.com/100" }
  ],
  cancelled: [
    { id: "4", title: "Màn hình gaming", status: "Cancelled", price: 3000000, image: "https://via.placeholder.com/100" }
  ]
};

// 🟢 Component hiển thị danh sách đơn hàng theo từng tab
const OrderListScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ [key in keyof OrdersData]: undefined }, keyof OrdersData>>();
  const orders = orderData[route.name];

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.orderItem}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.status}>{item.status}</Text>
            <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
          </View>
        </View>
      )}
    />
  );
};

// 🟢 Khởi tạo Navigator cho các tab
const Tab = createMaterialTopTabNavigator();

const OrderScreen: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarIndicatorStyle: { backgroundColor: "red" }
      }}
    >
      <Tab.Screen name="pending" component={OrderListScreen} options={{ title: "Chờ xác nhận" }} />
      <Tab.Screen name="shipping" component={OrderListScreen} options={{ title: "Chờ lấy hàng" }} />
      <Tab.Screen name="delivered" component={OrderListScreen} options={{ title: "Chờ giao hàng" }} />
      <Tab.Screen name="cancelled" component={OrderListScreen} options={{ title: "Cancelled" }} />
    </Tab.Navigator>
  );
};

// 🟢 Style cho giao diện
const styles = StyleSheet.create({
  orderItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    color: "gray",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
});

export default OrderScreen;
