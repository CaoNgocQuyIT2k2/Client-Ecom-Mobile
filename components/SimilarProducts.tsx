import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getSimilarProducts } from '@/services/productService';
import { ProductType } from '@/types/type';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const SimilarProducts = ({ productId }: { productId: string }) => {
  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      setIsLoading(true);
      const products = await getSimilarProducts(productId);
      setSimilarProducts(products);
      setIsLoading(false);
    };
    
    fetchSimilarProducts();
  }, [productId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Similar Products</Text>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : similarProducts.length === 0 ? (
        <Text>No similar products available</Text>
      ) : (
        <FlatList
          data={similarProducts}
          horizontal
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => router.push({ pathname: "/product-details/[id]", params: { id: item.id } })}
            >
              <Image source={{ uri: item.images[0] }} style={styles.image} />
              <Text numberOfLines={1} style={styles.productName}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default SimilarProducts;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productCard: {
    width: 140,
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 5,
  },
});
