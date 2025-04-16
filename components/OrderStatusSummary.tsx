import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchOrderStats } from '@/services/orderService'

export default function OrderStatusSummary({ userId }: { userId: number }) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        if (!token) throw new Error('Token not found')
        const result = await fetchOrderStats(userId)
        // Lấy dữ liệu từ stats
        if(result?.success && result.stats) {
          setStats(result.stats)
        } else {
          console.error('Failed to fetch order stats:', result?.message)
        }
      } catch (err) {
        console.error('Failed to fetch order stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [userId])

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA500" />
  }

  // Lấy dữ liệu từ stats
  const totalByStatus = stats?.totalByStatus || {}
  const statusBreakdown = stats?.statusBreakdown || {}
  const totalRevenue = stats?.totalRevenue || 0
  const totalOrders = stats?.totalOrders || 0

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total amount by order status</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>Pending Confirmation</Text>
          <Text style={styles.amount}>
            ${ (totalByStatus['New Order'] || 0).toFixed(2) }
          </Text>
          <Text style={styles.orderCount}>
            Orders: { statusBreakdown['New Order'] || 0 }
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Shipping</Text>
          <Text style={styles.amount}>
            ${ (totalByStatus['Shipping'] || 0).toFixed(2) }
          </Text>
          <Text style={styles.orderCount}>
            Orders: { statusBreakdown['Shipping'] || 0 }
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Delivered</Text>
          <Text style={styles.amount}>
            ${ (totalByStatus['Delivered'] || 0).toFixed(2) }
          </Text>
          <Text style={styles.orderCount}>
            Orders: { statusBreakdown['Delivered'] || 0 }
          </Text>
        </View>
      </View>

      {/* Hiển thị tổng đơn hàng và tổng doanh thu */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total Orders: {totalOrders}</Text>
        <Text style={styles.summaryText}>Total Revenue: ${totalRevenue.toFixed(2)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    paddingTop:20,
  },
  cardContainer: {
    flexDirection: 'column',
    gap: 12,
    padding:12,
  },
  card: {
    backgroundColor: '#FDF3E7',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  orderCount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  summary: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding:12,

  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
})
