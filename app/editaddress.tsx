import React, { useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { BASE_URL } from "@/constants/api";
import { useHeaderHeight } from "@react-navigation/elements";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

const EditAddress = () => {
  const router = useRouter();
  const { address: addressParam } = useLocalSearchParams();
  const address: Address = addressParam ? JSON.parse(addressParam as string) : null;

  const [fullName, setFullName] = useState(address?.fullName || "");
  const [phone, setPhone] = useState(address?.phone || "");
  const [addressLine, setAddressLine] = useState(address?.addressLine || "");
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [country, setCountry] = useState(address?.country || "");
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);
  const headerHeight = useHeaderHeight() || 0;

  const updateAddress = async () => {
    try {
      const response = await fetch(`${BASE_URL}/address/update/${address._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, addressLine, city, state, country }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Address has been updated");
        router.back();
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error updating address", error);
      Alert.alert("Error", "An error occurred while updating");
    }
  };

  const setDefaultAddress = async () => {
    try {
      const response = await fetch(`${BASE_URL}/address/set-default/${address._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setIsDefault(true); // Cập nhật trạng thái
        Alert.alert("Success", "This address is now the default!");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error setting default address", error);
      Alert.alert("Error", "An error occurred while setting default address");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Address",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerShown: true,
        }}
      />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={addressLine} onChangeText={setAddressLine} />
        <Text style={styles.label}>City</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} />
        <Text style={styles.label}>District</Text>
        <TextInput style={styles.input} value={state} onChangeText={setState} />
        <Text style={styles.label}>Country</Text>
        <TextInput style={styles.input} value={country} onChangeText={setCountry} />
        
        {/* Hiển thị nút Set as Default */}
        {!isDefault && (
          <TouchableOpacity style={styles.defaultButton} onPress={setDefaultAddress}>
            <Text style={styles.defaultButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={updateAddress}>
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default EditAddress;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, marginTop: 5 },
  button: { backgroundColor: "#ff4d4f", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  defaultButton: { backgroundColor: "#007BFF", padding: 12, borderRadius: 5, alignItems: "center", marginTop: 15 },
  defaultButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
