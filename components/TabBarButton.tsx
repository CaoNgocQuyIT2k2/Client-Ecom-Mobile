import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { icon } from '@/constants/icons';

type Props = {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  label: string;
  routeName: keyof typeof icon; // Chỉ nhận các key hợp lệ từ `icon`
};

const TabBarButton = ({ onPress, onLongPress, isFocused, label, routeName }: Props) => {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.tabbarBtn}>
      {/* Hiển thị badge cho Cart */}
      {routeName === 'cart' && (
        <View style={styles.badgeWrapper}>
          <Text style={styles.badgeText}>3</Text>
        </View>
      )}
      
      {/* Hiển thị icon từ object `icon` */}
      {icon[routeName] && icon[routeName]({ color: isFocused ? Colors.primary : Colors.black })}
      <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>{label}</Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabbarBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
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
  },
});
