import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { AirbnbRating } from 'react-native-ratings'
import { createReview, ReviewData } from '@/services/reviewService'
import { getProductDetails } from '@/services/productService'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'

interface ProductType {
  productId: string
  title?: string
  image?: string
}

interface ReviewType {
  productId: string
  productName: string
  productImage: string
  rating: number
  comment: string
}

export default function ReviewProduct() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { idUser, products, orderId, totalAmount } = params
  const headerHeight = useHeaderHeight() || 0
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [loading, setLoading] = useState(true)

  const parsedTotalAmount = Array.isArray(totalAmount) ? totalAmount[0] : totalAmount
  const parsedIdUser = Array.isArray(idUser) ? Number(idUser[0]) : Number(idUser);
  const parsedOrderId = Array.isArray(orderId) ? orderId[0] : orderId
  const parsedProducts: ProductType[] = (() => {
    if (typeof products === "string") {
      try {
        const parsed = JSON.parse(products);
        return Array.isArray(parsed)
          ? parsed.map((p) =>
              typeof p === "string" ? { productId: p } : p
            )
          : [];
      } catch (error) {
        console.error("❌ Error parsing products:", error);
        return [];
      }
    }
    return [];
  })();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productDetails = await Promise.all(
          parsedProducts.map(async (product) => {
            if (!product.productId) {
              console.warn("⚠️ Invalid product, skipping:", product);
              return {
                productId: "unknown",
                productName: "Unknown Product",
                productImage: "https://via.placeholder.com/60",
                rating: 5,
                comment: "",
              };
            }

            try {
              const productData = await getProductDetails(product.productId);
              return {
                productId: productData?._id || "unknown",
                productName: productData?.title || "Unknown Product",
                productImage: productData?.images?.[0] || "https://via.placeholder.com/60",
                rating: 5,
                comment: "",
              };
            } catch (error) {
              console.error(`❌ Error loading product ${product.productId}:`, error);
              return {
                productId: product.productId,
                productName: "Unknown Product",
                productImage: "https://via.placeholder.com/60",
                rating: 5,
                comment: "",
              };
            }
          })
        );
        
        setReviews(productDetails);
      } catch (error) {
        console.error("❌ Error loading product list:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts()
  }, [])

  const updateReview = <K extends keyof ReviewType>(index: number, key: K, value: ReviewType[K]) => {
    const newReviews = [...reviews]
    newReviews[index][key] = value
    setReviews(newReviews)
  }

  const submitReview = async () => {
    if (reviews.some((r) => r.comment.length < 50)) {
      return Alert.alert('Error', 'Each review must have at least 50 characters.')
    }
  
    try {
      if (!parsedOrderId) {
        Alert.alert('Error', 'Missing order ID.')
        return
      }
  
      const reviewData: ReviewData = {
        idUser: parsedIdUser,
        orderId: parsedOrderId,
        reviews: reviews.map(({ productId, rating, comment }) => ({
          productId,
          rating,
          comment,
        })),
      }
  
      console.log("📌 Debug reviewData:", JSON.stringify(reviewData, null, 2))
  
      const response = await createReview(reviewData)
      Alert.alert('Success', response.message)
      router.back()
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unable to submit review')
    }
  }
  
  return (
    <>
      <Stack.Screen options={{ title: 'Product Review', headerTitleAlign: "center",
          headerTransparent: true,
          headerShown: true,}} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff5722" />
        </View>
      ) : (
        <ScrollView style={[styles.container, { marginTop: headerHeight }]}> 
          {reviews.map((item, index) => (
            <View key={`${item.productId}-${index}`} style={styles.reviewContainer}>
              <View style={styles.productContainer}>
                <Image
                  source={{ uri: item.productImage }}
                  style={styles.productImage}
                  onError={() => updateReview(index, 'productImage', 'https://via.placeholder.com/60')}
                />
                <Text style={styles.productName}>{item.productName}</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '500', textAlign: 'right', marginVertical: 10 }}>
                Total Order Value: ${Number(parsedTotalAmount).toLocaleString()}
              </Text>
              <AirbnbRating
                count={5}
                defaultRating={item.rating}
                size={30}
                showRating={false}
                onFinishRating={(rating) => updateReview(index, 'rating', rating)}
              />
              <TextInput
                style={styles.input}
                placeholder="Share your thoughts about this product..."
                multiline
                keyboardType="default"
                value={item.comment}
                onChangeText={(text) => updateReview(index, 'comment', text)}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={submitReview}>
            <Text style={styles.buttonText}>Submit All Reviews</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  )
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  reviewContainer: { marginBottom: 20 },
  productContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  productImage: { width: 60, height: 60, borderRadius: 5, marginRight: 10 },
  productName: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  input: { height: 100, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, textAlignVertical: 'top', marginTop: 10 },
  button: { backgroundColor: '#ff5722', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})
