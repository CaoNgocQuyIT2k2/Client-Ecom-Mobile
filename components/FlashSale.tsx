import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { ProductType } from '@/types/type'
import ProductItem from './ProductItem'

type Props = {
  products: ProductType[]
}

const FlashSale = ({ products }: Props) => {
  const saleEndDate = new Date()
  //   saleEndDate.setFullYear(2025,8,3);
  saleEndDate.setDate(saleEndDate.getDate() + 2)
  saleEndDate.setHours(23, 59, 59)
  const [timeUnits, setTimeUnits] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  useEffect(() => {
    const updateCountdown = () => {
      const calculateTimeUnits = (timeDifference: number) => {
        const seconds = Math.floor(timeDifference / 1000)
        setTimeUnits({
          days: Math.floor((seconds % (365 * 24 * 60 * 60)) / (24 * 60 * 60)),
          hours: Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)),
          minutes: Math.floor((seconds % (60 * 60)) / 60),
          seconds: seconds % 60,
        })
      }
      const currentDate = new Date().getTime()
      const expiryTime = saleEndDate.getTime()
      const timeDifference = expiryTime - currentDate

      if (timeDifference <= 0) {
        calculateTimeUnits(0)
      } else {
        calculateTimeUnits(timeDifference)
      }
    }
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (time: number) => {
    return time.toString().padStart(2, '0')
  }
//   console.log("hehe",products)
//   console.log("Số lượng sản phẩm:", products?.length);
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <View style={styles.timerWrapper}>
          <Text style={styles.title}>Top Sale</Text>
          {/* <View style={styles.timer}>
            <Ionicons name="time-outline" size={16} color={Colors.black} />
            <Text
              style={styles.timerTxt}
            >{`${formatTime(timeUnits.days)}:${formatTime(timeUnits.hours)}:${formatTime(timeUnits.minutes)}:${formatTime(timeUnits.seconds)}`}</Text>
          </View> */}
        </View>
        <TouchableOpacity>
          <Text style={styles.titleBtn}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={products}
        contentContainerStyle={{marginLeft:20,paddingRight:20,}}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
            <View style={{marginRight:20}}>
                <ProductItem index={index} item={item} />
            </View>
        )}
        />
    </View>
  )
}

export default FlashSale

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: 0.6,
    color: Colors.black,
  },
  titleBtn: {
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0.6,
    color: Colors.gray,
  },
  timerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timer: {
    flexDirection: 'row',
    gap: 5,
    backgroundColor: Colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timerTxt: {
    color: Colors.black,
    fontWeight: '500',
  },
  item: {
    marginVertical: 10,
    gap: 5,
    alignItems: 'center',
    marginLeft: 20,
  },
  itemImg: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
  },
})
