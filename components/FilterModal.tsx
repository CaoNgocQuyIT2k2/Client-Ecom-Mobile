import { Colors } from "@/constants/Colors";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";

// Định nghĩa kiểu dữ liệu cho FilterModal
interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedFilters: { 
    minPrice: string; 
    maxPrice: string; 
    selectedRatings: number[]; 
  }) => void;
}

// Component bộ lọc sản phẩm
const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const ratings = [5, 4, 3, 2, 1];

  // Chọn hoặc bỏ chọn rating
  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Filter Products</Text>

          <Text style={styles.sectionTitle}>Price Range (USD)</Text>
          <View style={styles.priceContainer}>
            <TextInput
              style={styles.input}
              placeholder="Min Price ($)"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <Text style={{ marginHorizontal: 10 }}>-</Text>
            <TextInput
              style={styles.input}
              placeholder="Max Price ($)"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>

          <Text style={styles.sectionTitle}>Rating</Text>
          <FlatList
            data={ratings}
            horizontal
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.ratingButton,
                  selectedRatings.includes(item) && styles.selectedButton,
                ]}
                onPress={() => toggleRating(item)}
              >
                <Text style={{ color: selectedRatings.includes(item) ? "#fff" : "#000" }}>
                  {item} ⭐
                </Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setMinPrice("");
                setMaxPrice("");
                setSelectedRatings([]);
              }}
            >
              <Text style={{ color: "#f00" }}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                onApply({ minPrice, maxPrice, selectedRatings });
                onClose();
              }}
            >
              <Text style={{ color: Colors.white }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

// StyleSheet
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    textAlign: "center",
  },
  ratingButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: "#f00",
    borderColor: "#f00",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#FFCDD2", // Màu đỏ nhạt
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10, // Khoảng cách với nút Apply
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.darkRed, // Màu chính của ứng dụng
    borderRadius: 10,
    alignItems: "center",
  },
  resetText: {
    color: "#D32F2F", // Màu đỏ đậm
    fontWeight: "600",
    fontSize: 16,
  },
  applyText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
