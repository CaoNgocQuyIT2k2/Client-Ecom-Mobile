import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { BASE_URL } from "@/constants/api";
import { useHeaderHeight } from "@react-navigation/elements";

interface Address {
  _id: string;
  idUser: number;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

const AddressList = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const router = useRouter();
  const headerHeight = useHeaderHeight() || 0;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Không tìm thấy token");

        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT để lấy idUser
        fetchAddresses(decoded.idUser); // Gửi idUser thay vì phone
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin user:", error);
      }
    };

    const fetchAddresses = async (idUser: number) => {
      try {
        const response = await fetch(`${BASE_URL}/address/${idUser}`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Lỗi API lấy địa chỉ:", errorText);
          return;
        }

        const data = await response.json();
        if (data.success) {
          setAddresses(data.data);
        } else {
          console.error("API trả về lỗi:", data.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách địa chỉ", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Address",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerShown: true,
        }}
      />

      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.addressItem}
              onPress={() => router.push({ pathname: "/editaddress", params: { address: JSON.stringify(item) } })}
            >
              <Text style={styles.name}>{item.fullName} | {item.phone}</Text>
              <Text style={styles.address}>{item.addressLine}, {item.city}, {item.state}, {item.country}</Text>
              {item.isDefault && <Text style={styles.defaultTag}>Default</Text>}
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/")}>
          <Text style={styles.addButtonText}>+ Add New Address</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  addressItem: { padding: 15, borderBottomWidth: 1, borderColor: "#ddd" },
  name: { fontSize: 16, fontWeight: "bold" },
  address: { fontSize: 14, color: "#555" },
  defaultTag: { color: "red", fontWeight: "bold", marginTop: 5 },
  addButton: { backgroundColor: "#ff4d4f", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 20 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default AddressList;
