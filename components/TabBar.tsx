import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '@/redux/slices/notificationSlice';
import { AppDispatch } from '@/redux/store';
import { useFocusEffect } from 'expo-router';

type TabBarProps = BottomTabBarProps & {
  cartCount?: number;
};

export function TabBar({ state, descriptors, navigation, cartCount = 0 }: TabBarProps) {
  const insets = useSafeAreaInsets();

  // Lấy thông báo từ Redux
  const unreadCount = useSelector((state: any) => state.notification.unreadCount);

  const dispatch = useDispatch<AppDispatch>();  // Đảm bảo dispatch có kiểu AppDispatch

  // Fetch thông báo khi app được load lên lần đầu
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Khi focus vào tab sẽ gọi lại hàm fetchNotifications
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchNotifications()); // Tự động gọi lại mỗi lần focus tab
    }, [dispatch])
  );

  const getIconName = (routeName: string): 'home-outline' | 'notifications-outline' | 'cart-outline' | 'search-outline' | 'person-outline' => {
    switch (routeName.toLowerCase()) {
      case 'notifications':
        return 'notifications-outline';
      case 'cart':
        return 'cart-outline';
      case 'explore':
        return 'search-outline';
      case 'profile':
        return 'person-outline';
      case 'index':
      default:
        return 'home-outline';
    }
  };

  return (
    <View style={[styles.tabbar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? route.name;

        const isFocused = state.index === index;
        const iconName = getIconName(route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarBtn}
          >
            <View>
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? Colors.primary : Colors.black}
              />

              {/* Hiển thị chấm đỏ nếu có thông báo chưa đọc */}
              {route.name.toLowerCase() === 'notifications' && unreadCount > 0 && (
                <View style={styles.dot} />
              )}

              {/* Hiển thị badge cho giỏ hàng */}
              {route.name.toLowerCase() === 'cart' && cartCount > 0 && (
                <View style={styles.badgeWrapper}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={{ color: isFocused ? Colors.primary : Colors.black }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 15,
    backgroundColor: Colors.white,
  },
  tabbarBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  badgeWrapper: {
    position: 'absolute',
    backgroundColor: Colors.highlight,
    top: -5,
    right: 20,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    zIndex: 10,
  },
  badgeText: {
    color: Colors.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
