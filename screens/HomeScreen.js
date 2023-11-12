import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image
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
  const [under99, setUnder99] = useState([]);
  const [under499, setUnder499] = useState([]);
  const [under999, setUnder999] = useState([]);
  const [under4999, setUnder4999] = useState([]);

  const getProducts = async (arr) => {
    let finalarr = [];
    let len = arr.length;

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

      let len = 3;
      if(finalarr.length < len) len = finalarr.length;
      
      let finalProductArr = [];
      for(let i=0; i<len; i++) {
        finalProductArr.push(finalarr[i]);
      }

      let arr1 = [];
      let arr2 = [];
      let arr3 = [];
      let arr4 = [];

      for(let i=0; i<finalarr.length; i++) {
        if(finalarr[i].price < 100) {
          arr1.push(finalarr[i]);
        }
        else if(finalarr[i].price < 500) {
          arr2.push(finalarr[i]);
        }
        else if(finalarr[i].price < 1000) {
          arr3.push(finalarr[i]);
        }
        else if(finalarr[i].price < 5000) {
          arr4.push(finalarr[i]);
        }
      }
      
      setUnder99(arr1);
      setUnder499(arr2);
      setUnder999(arr3);
      setUnder4999(arr4);
      setData(finalProductArr);
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 15}}>
          <TouchableOpacity style={{width: '48%'}} onPress={() => {navigation.navigate('PriceRangeProducts', {productsData: under99, title: "Products Under ₹99"})}}>
            <Image source={require('../assets/under99.jpg')} style={{height: 100, width: '100%', borderRadius: 15}}/>
          </TouchableOpacity>
          <TouchableOpacity style={{width: '48%'}} onPress={() => {navigation.navigate('PriceRangeProducts', {productsData: under499, title: "Products Under ₹499"})}}>
            <Image source={require('../assets/under499.jpg')} style={{height: 100, width: '100%', borderRadius: 15}}/>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15}}>
          <TouchableOpacity style={{width: '48%'}} onPress={() => {navigation.navigate('PriceRangeProducts', {productsData: under999, title: "Products Under ₹999"})}}>
            <Image source={require('../assets/under999.jpg')} style={{height: 100, width: '100%', borderRadius: 15}}/>
          </TouchableOpacity>
          <TouchableOpacity style={{width: '48%'}} onPress={() => {navigation.navigate('PriceRangeProducts', {productsData: under4999, title: "Products Under ₹4999"})}}>
            <Image source={require('../assets/under4999.jpg')} style={{height: 100, width: '100%', borderRadius: 15}}/>
          </TouchableOpacity>
        </View>
      {/* <OfferList title ={"Below ₹ 99"} Secondtitle = {"₹ 100 to ₹ 199"}/>
      <OfferList title ={"₹ 100 to ₹ 199"} Secondtitle = {"₹ 100 to ₹ 199"}/>
      <OfferList title ={"₹ 100 to ₹ 199"} Secondtitle = {"Above ₹ 1000"}/> */}
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
    color: 'black',
  },
  myStyle:{
    color:'#E52B50',
  }
});
