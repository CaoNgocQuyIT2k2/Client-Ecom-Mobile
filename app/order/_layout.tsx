import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import IndexScreen from './index'
import ShippingScreen from './shipping'
import PreparingScreen from './preparing'
import DeliveredScreen from './delivered'
import CancelledScreen from './cancelled'
import ConfirmedScreen from './confirmed'
import { Colors } from '@/constants/Colors'
import OrderChart from '../OrderChart'

const Tab = createMaterialTopTabNavigator()

export default function OrderTabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: 'white' },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
          color: Colors.lightGray,
        }, // Tăng fontSize
        tabBarIndicatorStyle: { backgroundColor: 'black' },
        tabBarScrollEnabled: true, // Cho phép kéo ngang nếu quá dài
        tabBarItemStyle: { width: 'auto', paddingHorizontal: 15 }, // Giãn khoảng cách giữa các tab
      }}
    >
      <Tab.Screen name="Pending" component={IndexScreen} />
      <Tab.Screen name="Confirmed" component={ConfirmedScreen} />
      <Tab.Screen name="Preparing" component={PreparingScreen} />
      <Tab.Screen name="Shipping" component={ShippingScreen} />
      <Tab.Screen name="Delivered" component={DeliveredScreen} />
    </Tab.Navigator>
  )
}
