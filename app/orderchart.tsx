import React, { useEffect, useState } from 'react'
import { Dimensions, View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchOrderSummary } from '@/services/orderService'
import { Buffer } from 'buffer'
import { Stack } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'
import DropDownPicker from 'react-native-dropdown-picker'
import { Colors } from '@/constants/Colors'
import OrderStatusSummary from '@/components/OrderStatusSummary'

const screenWidth = Dimensions.get('window').width

type TimeRange = 'week' | 'month' | 'year'

export default function OrderChart() {
  const [chartData, setChartData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [items, setItems] = useState([
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Year', value: 'year' },
  ])
  const headerHeight = useHeaderHeight() || 0

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8')
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }

  const loadChartData = async (range: TimeRange) => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('User not authenticated')

      const decoded = decodeJWT(token)
      if (!decoded?.idUser) throw new Error('Invalid token structure')
      setUserId(decoded.idUser)
      const res = await fetchOrderSummary(decoded.idUser, 'all', range)
      const grouped = res.grouped
      let labels: string[] = []
      let values: number[] = []

      if (range === 'week') {
        // Lấy danh sách ngày từ grouped (ví dụ: ["2025-04-07", "2025-04-08", ...])
        const dateKeys = Object.keys(grouped).sort()
        labels = dateKeys.map(dateStr => {
          const date = new Date(dateStr)
          return date.toLocaleDateString('en-US', { weekday: 'short' }) // "Mon", "Tue",...
        })
        values = dateKeys.map(dateStr => {
          const amount = grouped[dateStr]?.totalAmount || 0
          return parseFloat(amount.toFixed(1)) // 👈 Làm tròn 1 chữ số thập phân
        })
        
      } else if (range === 'month') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        values = labels.map((week) => {
          const amount = grouped[week]?.totalAmount || 0
          return parseFloat(amount.toFixed(1))
        })
        
      } else if (range === 'year') {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        values = labels.map((month) => {
          const amount = grouped[month]?.totalAmount || 0
          return parseFloat(amount.toFixed(1))
        })
        
      }

      setChartData({
        labels,
        datasets: [{
          data: values,
          color: () => '#4CAF50',
          strokeWidth: 2,
        }],
      })
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChartData(timeRange)
  }, [timeRange])

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Payment History',
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerShown: true,
        }}
      />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <Text style={styles.title}>Cash Flow Chart</Text>

        <Text style={styles.label}>Select time range:</Text>
        <DropDownPicker
          open={open}
          value={timeRange}
          items={items}
          setOpen={setOpen}
          setValue={(cb) => setTimeRange(cb(timeRange))}
          setItems={setItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#999" style={{ marginTop: 20 }} />
        ) : chartData.labels && chartData.labels.length > 0 ? (
          <BarChart
            data={chartData}
            showValuesOnTopOfBars={true}
            width={screenWidth - 32}
            height={280}
            yAxisLabel="$"
            yAxisSuffix="k"
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              // labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => Colors.primary,
            }}
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noData}>No chart data available.</Text>
        )}
      </View>
      {userId !== null && <OrderStatusSummary userId={userId} />}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
  },
  label: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  chart: {
    borderRadius: 16,
    fontWeight:'600'
  },
  noData: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
})
