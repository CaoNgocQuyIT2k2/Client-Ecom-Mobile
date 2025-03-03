import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const images = [
  require('@/assets/images/sale-banner.jpg'),
  require('@/assets/images/sale-banner2.jpg'),
  require('@/assets/images/sale-banner3.jpg'),
  require('@/assets/images/sale-banner4.jpg'),
  require('@/assets/images/sale-banner5.jpg'),
];

const { width } = Dimensions.get('window');

const BannerCarousel = () => {
  return (
    <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
      <Carousel
        loop
        width={width - 40}
        height={150}
        autoPlay
        autoPlayInterval={2000}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <Image source={item} style={{ width: width - 40, height: 150, borderRadius: 15 }} />
        )}
      />
    </View>
  );
};

export default BannerCarousel;
