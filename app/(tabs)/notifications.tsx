import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useNavigation } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer'
import NotificationsList from '@/components/NotificationsList';



const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState<number | null>(null);
  useEffect(() => {
    navigation.setOptions({ title: "Notifications" });
    
    const loadUserId = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decoded = decodeJWT(token);
        if (decoded?.idUser) {
          setUserId(decoded.idUser);
        }
      }
    };

    loadUserId();
  }, [navigation]);

  const headerHeight = useHeaderHeight();



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

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
      {userId !== null ? <NotificationsList userId={userId} /> : null}
      </View>

    </>
  );
};

export default NotificationsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor:Colors.white
  },
  notificationWrapper: {
    flexDirection: 'row', // Đảm bảo icon và nội dung nằm ngang
  alignItems: 'center', // Căn giữa theo chiều dọc
    padding: 10,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.extraLightGray,
    borderRadius: 5,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 10, // Thêm khoảng cách giữa icon và text
  },
  notificationInfo: {
    flex: 1,
  },
  
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.black,
  },
  
  notificationMessage: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 5,
    lineHeight: 20,
  },
  
})
