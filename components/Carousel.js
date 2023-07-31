import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const Carousel = () => {
  const [images, setImages] = useState([]);

  const getDatabase = async () => {
    try {
      const res = await firestore().collection('promos').doc('links').get();
      setImages(res._data.linksArr);
    }
    catch(err) {
      console.log(err);
    }
  }

  useEffect(()=>{getDatabase()}, []);

  return (
    <View style={{marginLeft: 4}}>
      <SliderBox 
        images={images} 
        autoplay
        circleLoop
        borderRadius={15}
        dotColor = '#E52B50'
        inactiveDotColor = 'white'
        ImageComponentStyle = {{
          width: "98%"
        }}
      />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({});
