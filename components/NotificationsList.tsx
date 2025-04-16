import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { connectSocket, disconnectSocket, socket } from '../app/utils/socket';
import { useDispatch } from 'react-redux';
import { markAsRead, setNotifications } from '../redux/actions/notificationActions';
import { Colors } from '@/constants/Colors';
import { getNotifications, markAsReadApi } from '../services/notificationService';  // Import API

const NotificationsList = ({ userId }: { userId: number }) => {
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);
  const dispatch = useDispatch();

  // UseRef to store previous notifications for better handling in socket events
  const notificationsRef = useRef(localNotifications);

  useEffect(() => {
    // Update notificationsRef whenever localNotifications changes
    notificationsRef.current = localNotifications;
  }, [localNotifications]);

  // Calculate unread count from local notifications (for local display if needed)
  const unreadCount = localNotifications.filter((n: any) => !n.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setLocalNotifications(response.data);
        dispatch(setNotifications(response.data));
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
      }
    };

    // Fetch notifications when the component mounts
    fetchNotifications();

    // Connect socket with the provided userId
    connectSocket(userId);

    // Listen to newNotification event and update both Redux & local state
    socket.on('newNotification', (notification: any) => {
      // Update local state with the new notification
      const updatedNotifications = [notification, ...notificationsRef.current];
      setLocalNotifications(updatedNotifications);
      dispatch(setNotifications(updatedNotifications));
    });

    return () => {
      disconnectSocket();
    };
  }, [userId, dispatch]);

  const handleMarkAsRead = async (id: string) => {
    try {
      // Call the API to mark the notification as read
      await markAsReadApi(id);

      // Update Redux and local state after the successful API call
      dispatch(markAsRead(id));
      setLocalNotifications((prevNotifications: any) =>
        prevNotifications.map((noti: any) =>
          noti._id === id ? { ...noti, isRead: true } : noti
        )
      );
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity onPress={() => handleMarkAsRead(item._id)}>
        <View
          style={[
            styles.notificationContainer,
            { backgroundColor: item.isRead ? Colors.lightGray : Colors.primary },
          ]}
        >
          <View style={styles.notificationWrapper}>
            <View style={styles.notificationImageWrapper}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
            </View>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationStatus}>{item.statusText || item.title}</Text>
              <Text style={styles.notificationMessage}>{item.content}</Text>
              <Text style={styles.notificationTime}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Updates</Text>
      <Text>Unread: {unreadCount}</Text>
      <FlatList
        data={localNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default NotificationsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginVertical: 10,
  },
  notificationContainer: {
    marginVertical: 10,
    borderRadius: 5,
    padding: 2,
  },
  notificationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.extraLightGray,
    borderRadius: 5,
  },
  notificationImageWrapper: {
    marginRight: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationStatus: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.primary,
  },
  notificationMessage: {
    fontSize: 12,
    color: Colors.black,
    fontWeight: '500',
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '500',
    marginTop: 2,
  },
});
