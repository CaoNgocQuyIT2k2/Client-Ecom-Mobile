import { BASE_URL } from '@/constants/api'
import { ProductType } from '@/types/type'
import axios from 'axios'
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import ImageSlider from '../imageslider' // If exported as an object
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { useHeaderHeight } from '@react-navigation/elements'
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated'
import ThreeLatestProductReviews from '@/components/ThreeLatestProductReviews';
import SimilarProducts from '@/components/SimilarProducts';

const ProductDetails = () => {
  const { id } = useLocalSearchParams() // Get id from URL
  const [product, setProduct] = useState<ProductType | null>(null)
  const [cartCount, setCartCount] = useState(0); // State to store cart item count


  useEffect(() => {
    getProductDetails();
    fetchCartCount(); // Fetch initial cart count
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCartCount(); // Update cart count whenever screen is focused
    }, [])
  );

  const fetchCartCount = async () => {
    try {
      const cartString = await AsyncStorage.getItem('cart');
      const cart = cartString ? JSON.parse(cartString) : [];
      
      const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      
      setCartCount(totalItems);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };
  
  const getCart = async () => {
    try {
      const cartString = await AsyncStorage.getItem('cart')
      return cartString ? JSON.parse(cartString) : []
    } catch (error) {
      console.error('Error fetching cart:', error)
      return []
    }
  }

  const addToCart = async () => {
    if (!product) return;

    try {
      let cart = await getCart();
      
      const index = cart.findIndex((item: any) => item.id === product.id);
      if (index !== -1) {
        cart[index].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      fetchCartCount();
      Alert.alert('🛒 Added to Cart', 'Product has been added to the cart!', [
        { text: 'OK' }
      ]);

    } catch (error) {
      console.error('❌ Error adding to cart:', error);
    }
  };

  const getProductDetails = async () => {
    try {
      const URL = `${BASE_URL}/products/getProductById/${id}`
      const response = await axios.get(URL)
      if (response.data) {
        setProduct(response.data)
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
    }
  }
  
  const headerHeight = useHeaderHeight() || 0

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Product Details',
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/(tabs)/cart')}>
              <View>
                <Ionicons name="cart-outline" size={24} color={Colors.black} />
                {cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={{ marginTop: headerHeight, marginBottom: 90 }}>
        {product && (
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <ImageSlider imageList={product.images} />
          </Animated.View>
        )}
        {product && (
          <View style={styles.container}>
            <Animated.View
              style={styles.ratingWrapper}
              entering={FadeInDown.delay(500).duration(500)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={20} color={'#D4AF37'} />
                <Text style={styles.rating}>
                  {product.ratings.average.toFixed(1)} <Text>({product.soldCount})</Text>
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={20} color={Colors.black} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.Text style={styles.title} entering={FadeInDown.delay(700).duration(500)}>{product.title}</Animated.Text>
            <Animated.View style={styles.priceWrapper} entering={FadeInDown.delay(900).duration(500)}>
              <Text style={styles.price}>${product.price}</Text>
              <View style={styles.priceDiscount}>
                <Text style={styles.priceDiscountText}>6% Off</Text>
              </View>
              <Text style={styles.oldPrice}>
                ${Math.round((product.price * 100) / 94)}
              </Text>
            </Animated.View>
            <Animated.Text entering={FadeInDown.delay(1100).duration(500)} style={styles.description}>{product.description}</Animated.Text>
            {/* {product && <ThreeLatestProductReviews productId={product._id} />} */}
            <ThreeLatestProductReviews productId={product?._id ?? ''} />
            {product && <SimilarProducts productId={product._id} />}
          </View>
        )}


      </ScrollView>
      <Animated.View entering={SlideInDown.delay(500).duration(500)} style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.white, borderColor: Colors.primary, borderWidth: 1, flexDirection: 'row', alignItems: 'center' }]}
          onPress={addToCart}
        >
          <Ionicons name="cart-outline" size={20} color={Colors.primary} />
          <Text style={[styles.buttonText, { color: Colors.primary }]}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  )
}

export default ProductDetails


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.gray,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.black,
    letterSpacing: 0.6,
    lineHeight: 32,
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  priceDiscount: {
    backgroundColor: Colors.extraLightGray,
    padding: 5,
    borderRadius: 5,
  },

  priceDiscountText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 17,
    fontWeight: '400',
    textDecorationLine: 'line-through',
    color: Colors.gray,
  },
  description: {
    marginTop: 20,
    fontSize: 17,
    fontWeight: '400',
    color: Colors.black,
    letterSpacing: 0.6,
    lineHeight: 24,
  },
  productVariationWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    flexWrap: 'wrap',
  },

  productVariationType: {
    width: '50%',
    gap: 5,
    marginBottom: 10,
  },

  productVariationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
  },
  productVariationValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },

  productVariationColorValue: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.extraLightGray,
  },
  productVariationSizeValue: {
    width: 50,
    height: 30,
    borderRadius: 5,
    backgroundColor: Colors.extraLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.lightGray,
    borderWidth: 1,
  },

  productVariationSizeValueText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.black,
  },
  buttonWrapper: {
    position: 'absolute',
    height: 90,
    padding: 28,
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    gap: 5,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
})
