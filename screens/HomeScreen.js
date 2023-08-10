import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from '../components/Carousel';
import TypesFood from '../components/TypesFood';
import QuickFood from '../components/QuickFood';
import hotels from '../data/hotels';
import MenuItem from '../components/MenuItem';
import OfferList from '../components/OfferList';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({navigation}) => {

  const [data, setData] = useState([]);

  const getProducts = async (arr) => {
    let finalarr = [];
    let len = 3;
    if(arr.length < len) len = arr.length;

    for(let i=0; i<len; i++) {
      const res = await firestore()
      .collection('products')
      .doc(arr[i].productCategory)
      .collection('categoryProducts')
      .doc(arr[i].productId.toString())
      .get();

      finalarr.push(res._data);
    }

    return finalarr
  }

  const getDatabase = async () => {
    try {
      const res = await firestore()
      .collection('productsList')
      .doc('list')
      .get();

      let arr = res._data.listArray;

      const finalarr = await getProducts(arr);
      finalarr.sort((a, b) => {
        return b.rating - a.rating;
      })

      setData(finalarr);
    }
    catch(err) {
      console.log(err);
    }
  }

  useEffect(()=>{getDatabase()}, []);
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      style={{}}
    >
      <Pressable onPress={() => {navigation.navigate('Search')}}>
        <View style={styles.mainContainer}>
          <Text style={{fontSize: 17}}>{"Search your item here"}</Text>
          <Icon name="search" size={30} color="#E52B50" />
        </View>
      </Pressable>
      <Carousel />
      <TypesFood />
      <QuickFood />

      <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: 30, marginLeft: 10}}>{'Top Rated Products'}</Text>
      <View style={{marginHorizontal: 10}}>
        {
          data.map((item, index) => (
            <MenuItem key={index} item={item} navigation={navigation}/>
          ))
        }
      </View>
      <View style= {{marginBottom:80, marginTop: 30}}>
        <Text style = {styles.offerTextStyle}>Price Ranges!</Text>
      <OfferList title ={"Below ₹ 99"} Secondtitle = {"₹ 100 to ₹ 199"}/>
      <OfferList title ={"₹ 100 to ₹ 199"} Secondtitle = {"₹ 100 to ₹ 199"}/>
      <OfferList title ={"₹ 100 to ₹ 199"} Secondtitle = {"Above ₹ 1000"}/>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: '#C0C0C0',
    borderRadius: 15,
  },
  filterStyle: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    width: 120,
  },
  sortStyle: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  SortFilterStyle: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  offerTextStyle: {
    marginHorizontal: 12,
    fontSize: 20,
    fontWeight: '900',
    color: 'black'
  },
  myStyle:{
    color:'#E52B50',
  }
});
