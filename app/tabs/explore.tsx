import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'expo-router';

type Props = {}

const ExploreScreen = (props: Props) => {

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Explore" });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>Explore Screen</Text>
    </View>
  )
}

export default ExploreScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})