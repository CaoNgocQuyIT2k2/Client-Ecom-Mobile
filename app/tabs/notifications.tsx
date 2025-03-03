import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'expo-router';

type Props = {}

const NotificationsScreen = (props: Props) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Notifications" });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>Notifications Screen</Text>
    </View>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})