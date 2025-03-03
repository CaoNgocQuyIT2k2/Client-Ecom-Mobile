import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'expo-router';

type Props = {}

const CartScreen = (props: Props) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Cart" });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>Cart Screen</Text>
    </View>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})