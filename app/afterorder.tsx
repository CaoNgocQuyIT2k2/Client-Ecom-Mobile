import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";

const products = [
  {
    id: "1",
    name: "Hoco W35 Over-Ear Headphones",
    discount: "-42%",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Heartleaf Toner Pad",
    discount: "-38%",
    image: "https://via.placeholder.com/150",
  },
];

const AfterOrder = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
     
      {/* Payment Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Waiting for Payment</Text>
        <Text style={styles.statusText}>
          ShopQ protects your rights - DO NOT TRANSFER MONEY IN ADVANCE to the Shipper when the order has not been delivered.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/main-tabs")}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/order")} >
            <Text style={styles.buttonText}>🛍 My Orders</Text>
          </TouchableOpacity>
                    
        </View>
      </View>

      {/* Banner */}
      <Image source={{ uri: "https://via.placeholder.com/300x100" }} style={styles.banner} />

      {/* Product List */}
      <FlatList
        data={products}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.discount}>{item.discount}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    
  container: { flex: 1, backgroundColor: "#fff",paddingTop:50, },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f53d2d",
  },
  statusContainer: {
    padding: 20,
    backgroundColor: "#f53d2d",
    alignItems: "center",
  },
  statusTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  statusText: { fontSize: 15, color: "#fff", textAlign: "center", marginVertical: 10, fontWeight:'500' },
  buttonContainer: { flexDirection: "row", gap: 10 },
  primaryButton: { backgroundColor: "#fff", padding: 10, borderRadius: 5 },
  secondaryButton: { backgroundColor: "#ffebeb", padding: 10, borderRadius: 5 },
  buttonText: { fontSize: 14, fontWeight: "bold", color: "#f53d2d" },
  banner: { width: "100%", height: 100, marginVertical: 10 },
  productCard: { padding: 10, alignItems: "center" },
  productImage: { width: 100, height: 100, borderRadius: 5 },
  productName: { fontSize: 12, textAlign: "center" },
  discount: { color: "red", fontWeight: "bold" },
});

export default AfterOrder;
