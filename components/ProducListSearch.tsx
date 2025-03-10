import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import ProductItem from './ProductItem'
import { ProductType } from '@/types/type'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import FilterModal from './FilterModal' // Import component FilterModal
import { Ionicons } from '@expo/vector-icons'

type Props = {
  products: ProductType[]
  flatlist?: boolean
}


// Component danh sách sản phẩm
type ProductListProps = {
  products: ProductType[];
  flatlist?: boolean;
  isFilterModalVisible: boolean;
  setFilterModalVisible: (visible: boolean) => void;
  filters: { minPrice: string; maxPrice: string; selectedRatings: number[] };
  setFilters: (filters: { minPrice: string; maxPrice: string; selectedRatings: number[] }) => void;
};

const ProductListSearch: React.FC<ProductListProps> = ({ products, flatlist = true }) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(products);
  const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ minPrice: string; maxPrice: string; selectedRatings: number[] }>({
    minPrice: "",
    maxPrice: "",
    selectedRatings: [],
  });

  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    let filtered = [...products];
  
    // Lọc theo giá
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }
  
    // Lọc theo đánh giá (tìm từ 1.0 đến 1.9 nếu chọn 1 sao)
    if (filters.selectedRatings.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedRatings.some(rating => 
          p.ratings.average >= rating && p.ratings.average < rating + 1
        )
      );
    }
  
    // Sắp xếp theo giá
    filtered.sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));
  
    setFilteredProducts(filtered);
  }, [products, sortOrder, filters]);
  



  
  return (
    <View style={styles.container}>
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Enter search content</Text>
        </View>
      ) : (
        <>
          {/* Sort & Filter Buttons */}
          <View style={styles.titleWrapper}>
  {/* Nút sắp xếp */}
  <TouchableOpacity onPress={() => actionSheetRef.current?.show()} style={styles.sortButton}>
    <Ionicons name="swap-vertical" size={20} color={Colors.darkRed} />
    <Text style={styles.titleBtn}>
      Sort by: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
    </Text>
  </TouchableOpacity>

  {/* Nút lọc */}
  <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButton1}>
    <Ionicons name="filter" size={20} color={Colors.darkRed} />
    <Text style={styles.titleBtn}>Filter</Text>
  </TouchableOpacity>
</View>


          {/* Product List */}
          {flatlist ? (
            <FlatList
              numColumns={2}
              nestedScrollEnabled={true}
              columnWrapperStyle={{ justifyContent: 'flex-start', gap: 15 }}
              data={filteredProducts}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : `fallback-key-${index}`
              }
              renderItem={({ index, item }) => (
                <View style={styles.productWrapper}>
                  <ProductItem item={item} index={index} />
                </View>
              )}
            />
          ) : (
            <View style={styles.itemsWrapper}>
              {filteredProducts.map((item, index) => (
                <View key={index} style={styles.productWrapper}>
                  <ProductItem item={item} index={index} />
                </View>
              ))}
            </View>
          )}

          {/* Sort Options */}
          <ActionSheet ref={actionSheetRef}>
            <View style={styles.actionSheetContainer}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setSortOrder('asc')
                  actionSheetRef.current?.hide()
                }}
              >
                <Text style={styles.optionText}>Low to High</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setSortOrder('desc')
                  actionSheetRef.current?.hide()
                }}
              >
                <Text style={styles.optionText}>High to Low</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => actionSheetRef.current?.hide()}
              >
                <Text style={[styles.optionText, { color: 'red' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ActionSheet>

          {/* Filter Modal */}
          <View style={styles.container}>
      <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButton}>
        <Text>🔍 Open Filters</Text>
      </TouchableOpacity>

      {/* Modal Filter */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={(selectedFilters) => setFilters(selectedFilters)}
      />
    </View>
        </>
      )}
    </View>
  )
}

export default ProductListSearch

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // Khoảng cách giữa icon và text
  },
  
  filterButton1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  
  filterButton: {
    padding: 15,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.gray,
    fontWeight: '500',
  },
  titleWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  titleBtn: {
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0.6,
    color: Colors.darkRed,
  },
  itemsWrapper: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  productWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  actionSheetContainer: {
    padding: 20,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    textAlign: 'center',
  },
})
