import { View, LayoutChangeEvent, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Colors } from "@/constants/Colors";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect, useState } from "react";
import TabBarButton from "./TabBarButton";
import { icon } from "@/constants/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabBarProps = BottomTabBarProps & {
  cartCount?: number; // ✅ Thêm cartCount vào props
};

export function TabBar({ state, descriptors, navigation, cartCount = 0 }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });

  const buttonWidth = dimensions.width / state.routes.length;
  const tabPositionX = useSharedValue(0);

  useEffect(() => {
    tabPositionX.value = withTiming(buttonWidth * state.index, { duration: 200 });
  }, [state.index, buttonWidth]); // Thêm `buttonWidth` để tránh lỗi kích thước chưa cập nhật
  

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  return (
    <View onLayout={onTabBarLayout} style={[styles.tabbar, { paddingBottom: insets.bottom }]}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: Colors.primary,
            top: 0,
            left: 20,
            height: 2,
            width: buttonWidth / 2,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        if (!(route.name in icon)) return null;

        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === "string" ? options.tabBarLabel : options.title ?? route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: "tabLongPress", target: route.key });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            label={label}
            routeName={route.name as keyof typeof icon}
            cartCount={route.name === "cart" ? cartCount : 0} // ✅ Truyền cartCount vào Cart tab
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    paddingTop: 16,
    paddingBottom: 15,
    backgroundColor: Colors.white,

  },
});
