import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React from 'react'
import { CategoryType } from '@/types/type'
import { Colors } from '@/constants/Colors'

type Props = {
  categories: CategoryType[]
}

const Categories = ({ categories }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.titleBtn}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        nestedScrollEnabled={true} // Thêm dòng này
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{  paddingRight: 20 }} 
        renderItem={({ item, index }) => (
          <TouchableOpacity>
            <View style={styles.item}>
              <Image source={{ uri: item.image }} style={styles.itemImg} />
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: 0.6,
    color: Colors.black,
  },
  titleBtn: {
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0.6,
    color: Colors.gray,
  },
  item: {
    marginVertical: 10,
    gap: 5,
    alignItems: 'center',
    marginLeft: 20,
  },
  itemImg: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
  },
})
