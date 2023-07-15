import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { addItemCart } from '../screens/Redux/actions/Actions'
import { useState } from 'react'
import { Card } from 'react-native-paper'
import { useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const MenuItem = ({ item }) => {
  const navigation = useNavigation();
  const [addFav, setAddFav] = useState(false);

  useEffect(() => {getFav()}, []);

  const getFav = async () => {
    try {
      const currUser = auth().currentUser;
      const res = await firestore().collection('users').doc(currUser.uid).get();
      const arr = res._data.favourites;

      for(let i=0; i<arr.length; i++) {
        if(arr[i].category == item.category) {
          if(arr[i].productId == item.id) {
            setAddFav(true);
            break;
          }
        }
      }
    }
    catch(err) {
      console.log(err);
    }
  }

  const addToFav = async () => {
    try {
      const currUser = auth().currentUser;
      const newItem = {category: item.category, productId: item.id};
      await firestore()
      .collection('users')
      .doc(currUser.uid)
      .update({'favourites': addFav ? firestore.FieldValue.arrayRemove(newItem) : firestore.FieldValue.arrayUnion(newItem)});

      setAddFav(!addFav);
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <View style={{marginTop: 10, padding: 10, borderRadius: 15, backgroundColor: 'white' }}>
      <Pressable onPress={() => navigation.navigate('MenuScreen', {item: item})} style={{ flexDirection: 'row' }}>
        <View style={{marginRight: 5, height: 150, width: 150, borderRadius: 15}}>
          <ImageBackground
            imageStyle={{ borderRadius: 6 }}
            style={{    width: '100%', height: undefined, aspectRatio: 1}}
            resizeMode='contain'
            source={
              (item.photos.length == 0) ? 
              require('../assets/shopping.png') :
              {uri: item.photos[0]}
            }
          >
            <Pressable onPress={() => {addToFav()}}>
              {addFav
                ? <Icon name="heart" style={{ position: "absolute", right: 10, top: 10 }} color="red" size={24} />
                : <Icon name="hearto" style={{ position: "absolute", right: 10, top: 10 }} color="white" size={24} />
              }
            </Pressable>
          </ImageBackground>
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.name}</Text>
          <View style={styles.descStyle}>
            <MaterialCommunityIcons name="star-circle" size={24} color="green" />
            <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: '400' }}>{item.rating}</Text>
            <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: '400' }}>{'( ' + item.totalReviews + ' )'}</Text>
          </View>
          {/* <Text style={{ marginTop: 6 }}>{item.adress}</Text> */}
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <FontAwesome name="rupee" size={22} style={{ marginLeft: 3 }} />
            <Text style={{ marginHorizontal: 10, fontSize: 15, }}>{item.price}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Fontisto name="clock" size={20} style={{ marginTop: 7 }} />
            <Text style={{ marginTop: 9, marginLeft: 10, fontSize: 15,}}>{item.deliveryTime}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Fontisto name="motorcycle" size={24} style={{ marginTop: 7 }} />
            <Text style={{ marginTop: 9, marginLeft: 10, fontSize: 15, }}>Free Delivery</Text>
          </View>
        </View>

      </Pressable>
    </View>
  )
}

export default MenuItem

const styles = StyleSheet.create({
  descStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
})