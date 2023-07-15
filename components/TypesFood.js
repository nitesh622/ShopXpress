import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import items from '../data/Category';

const TypesFood = () => {
  const types = [
    {
      id: '1',
      image:
        'https://hips.hearstapps.com/hmg-prod/images/09dce7b7-ea40-406b-a2c0-a3f57c420b17-1657946362.jpeg?crop=0.660xw:1.00xh;0.0794xw,0&resize=1200:*',
      name: 'Groceries',
    },
    {
      id: '7',
      image:
        'https://img.freepik.com/free-photo/top-view-ping-pong-paddles-with-boxing-gloves-sport-essentials_23-2148523213.jpg?w=996&t=st=1686508319~exp=1686508919~hmac=4c2ef1cd543df826c97c4dc39852629d997cd93f11fb53107b61b0588540941b',
      name: 'Sports',
    },
    {
      id: '8',
      image:
        'https://todaysparent.mblycdn.com/tp/resized/2017/11/767x431/retro-toys-80s-1280x960.jpg',
      name: 'Toys',
    },
    {
      id: '4',
      image:
        'https://github.com/PranjalSrivastava01/MealsApp/assets/96906907/613ca292-972d-4afb-8a79-e8a8001f6741',
      name: 'Electronics',
    },
    {
      id: '3',
      image:
        'https://github.com/PranjalSrivastava01/MealsApp/assets/96906907/ac8a978c-7ff9-4cfe-84da-e83ec5c71eef',
      name: 'Fashion',
    },
  ];

  const navigation = useNavigation();

  const HandleHomeCategory = index => {
    items.map(item => {
      console.log(index, item.Catid);
      if (index === item.Catid) {
        return navigation.navigate('HomePageCategory', {name: item.name});
      }
    });
  };
  return (
    <View>
      <Text style={styles.heading}>What's on your mind ?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {types.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{margin: 10}}
            onPress={() => HandleHomeCategory(item.id)}>
            <Image
              source={{uri: item.image}}
              style={{width: 60, height: 60, borderRadius: 30}}
            />
            <Text style={styles.textStyle}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TypesFood;

const styles = StyleSheet.create({
  textStyle: {
    marginTop: 6,
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
  },
  heading: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    fontWeight: '900',
    color: 'black',
    fontSize: 17,
    alignItems: 'center',
  },
});
