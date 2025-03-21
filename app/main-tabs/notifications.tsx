import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useNavigation } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Animated, { FadeInDown } from 'react-native-reanimated';



const NotificationsScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Notifications" });
  }, [navigation]);

  const headerHeight = useHeaderHeight();

  const notifications = [
    { id: 1, title: "New Message", timestamp: "10 mins ago", message: "You have a new message." },
    { id: 2, title: "Reminder", timestamp: "1 hour ago", message: "Don't forget your meeting at 3 PM." },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList 
          data={notifications} 
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item ,index}) => (
            <Animated.View style={styles.notificationWrapper} entering={FadeInDown.delay(300+index*100).duration(500)}>
              <View style={styles.notificationIcon}>
                <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.notificationInfo}>
                <View style={{flexDirection:'row', justifyContent:"space-between"}}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text >{item.timestamp}</Text>
                </View>
                <Text style={styles.notificationMessage}>{item.message}</Text>
              </View>
            </Animated.View>
          )}
        />
      </View>
    </>
  );
};

export default NotificationsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16, // Thêm padding 2 bên để đẹp hơn
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
