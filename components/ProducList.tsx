import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import ProductItem from './ProductItem'
import { ProductType } from '@/types/type'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';

type Props = {
  products: ProductType[]
  flatlist: boolean
  
}

const ProducList = ({ products, flatlist = true }: Props) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc') // Mặc định tăng dần
  const [sortedProducts, setSortedProducts] = useState<ProductType[]>([])
  const actionSheetRef = useRef<ActionSheetRef>(null)

  // Hàm sắp xếp sản phẩm theo giá
  const sortProducts = (order: 'asc' | 'desc') => {
    const sorted = [...products].sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    )
    setSortedProducts(sorted)
    setSortOrder(order)
  }

  // Sắp xếp mặc định khi component được render lần đầu
  useEffect(() => {
    sortProducts('asc')
  }, [products])

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>For You</Text>
        {/* Nút mở ActionSheet */}
        <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
          <Text style={styles.titleBtn}>
            Sort by: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
          </Text>
        </TouchableOpacity>
      </View>

      {flatlist ? (
        <FlatList
          numColumns={2}
          nestedScrollEnabled={true} // Thêm dòng này
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
          data={sortedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ index, item }) => <ProductItem item={item} index={index} />}
        />
      ) : (
        <View style={styles.itemsWrapper}>
          {sortedProducts.map((item, index) => (
            <View key={index} style={styles.productWrapper}>
              <ProductItem item={item} index={index} />
            </View>
          ))}
        </View>
      )}

      {/* ActionSheet với lựa chọn Giá tăng dần & Giá giảm dần */}
      <ActionSheet ref={actionSheetRef}>
        <View style={styles.actionSheetContainer}>
          {/* Giá tăng dần */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              sortProducts('asc')
              actionSheetRef.current?.hide()
            }}
          >
            <Text style={styles.optionText}>Low to High</Text>
          </TouchableOpacity>

          {/* Giá giảm dần */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              sortProducts('desc')
              actionSheetRef.current?.hide()
            }}
          >
            <Text style={styles.optionText}>High to Low</Text>
          </TouchableOpacity>

          {/* Hủy */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => actionSheetRef.current?.hide()}
          >
            <Text style={[styles.optionText, { color: 'red' }]}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  )
}

export default ProducList

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  titleWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
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
})
