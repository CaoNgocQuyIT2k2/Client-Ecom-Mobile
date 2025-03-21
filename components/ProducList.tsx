import { 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator 
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import ProductItem from './ProductItem';
import { ProductType } from '@/types/type';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  products: ProductType[];
  flatlist?: boolean;
  loadMoreProducts: () => void; // Hàm load thêm sản phẩm
  isLoadingMore: boolean; // Trạng thái loading
  ListHeaderComponent?: React.ReactElement;
};

const ProductList = ({ 
  products, 
  ListHeaderComponent, 
  flatlist = true, 
  loadMoreProducts, 
  isLoadingMore 
}: Props) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Mặc định tăng dần
  const [sortedProducts, setSortedProducts] = useState<ProductType[]>([]);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  // Loại bỏ sản phẩm trùng lặp theo id
  const uniqueProducts = products.filter(
    (item, index, self) => index === self.findIndex((p) => p.id === item.id)
  );

  useEffect(() => {
    // console.log('🔹 Sorted Products:', sortedProducts);
  }, [sortedProducts]);

  // Hàm sắp xếp sản phẩm theo giá
  const sortProducts = (order: 'asc' | 'desc') => {
    const sorted = [...uniqueProducts].sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
    setSortedProducts(sorted);
    setSortOrder(order);
  };

  // Sắp xếp mặc định khi component được render lần đầu
  useEffect(() => {
    sortProducts('asc');
  }, [products]);

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
      <Text style={styles.title}>For You</Text>
        {/* Nút sắp xếp có icon */}
        <TouchableOpacity 
          onPress={() => actionSheetRef.current?.show()} 
          style={styles.iconButton}
        >
          <Ionicons name="swap-vertical" size={16} color={Colors.gray} />
          <Text style={styles.titleBtn}>
            Sort: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
          </Text>
        </TouchableOpacity>

      
      </View>

      {flatlist ? (
        <FlatList
          numColumns={2}
          nestedScrollEnabled={true}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
          data={sortedProducts}
          keyExtractor={(item, index) => `${item.id || index}`} // Đảm bảo key không bị trùng
          renderItem={({ index, item }) => <ProductItem item={item} index={index} />}
          onEndReached={() => {
            if (!isLoadingMore) {
              loadMoreProducts();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator size="small" color={Colors.darkRed} /> : null
          }
        />
      ) : (
        <View style={styles.itemsWrapper}>
          {sortedProducts.map((item, index) => (
            <View key={item.id || index} style={styles.productWrapper}>
              <ProductItem item={item} index={index} />
            </View>
          ))}
        </View>
      )}

      {/* ActionSheet với lựa chọn Giá tăng dần & Giá giảm dần */}
      <ActionSheet ref={actionSheetRef}>
        <View style={styles.actionSheetContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              sortProducts('asc');
              actionSheetRef.current?.hide();
            }}
          >
            <Text style={styles.optionText}>Low to High</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              sortProducts('desc');
              actionSheetRef.current?.hide();
            }}
          >
            <Text style={styles.optionText}>High to Low</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => actionSheetRef.current?.hide()}
          >
            <Text style={[styles.optionText, { color: 'red' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  titleWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // Khoảng cách giữa icon và text
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: 0.6,
    color: Colors.darkRed,
  },
  titleBtn: {
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0.6,
    color: Colors.gray,
  },
  itemsWrapper: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  productWrapper: {
    width: '50%',
    paddingLeft: 5,
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
});
