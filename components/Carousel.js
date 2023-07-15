import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SliderBox} from 'react-native-image-slider-box';
const Carousel = () => {
  const images = [
    'https://github.com/Siddhant422/GFG/assets/96906907/cae53e14-4c88-4389-be30-aedb9aadabe2',
    'https://github.com/PranjalSrivastava01/MealsApp/assets/96906907/573e3936-4825-4940-9c36-36bf95bce9d9',
    'https://github.com/PranjalSrivastava01/MealsApp/assets/96906907/26a9677a-9bf5-4d2d-be25-db814a17379f',
  ];
  return (
    <View>
      <SliderBox images={images} 
      autoplay
      circleLoop
      borderRadius={15}
      dotColor = '#E52B50'
      inactiveDotColor = 'white'
      ImageComponentStyle = {{
        borderRadius: 15,
        width: "100%",
      }}
      />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({});
