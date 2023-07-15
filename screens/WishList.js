import { StyleSheet, Text, View,FlatList, RefreshControl} from 'react-native'
import React, { useState } from 'react'
import MenuItem from '../components/MenuItem';
import CartListScreen from './CartListSceen';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from './Redux/actions/Actions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useEffect } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

const WishList = () => {
  const [cartValue, setCartValue] = useState(0);
  const [items, setItems] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(()=>{getDatabase()}, []);

  const getDatabase = async () => {
    try {
      const currUser = auth().currentUser;
      const res = await firestore().collection('users').doc(currUser.uid).get();
      const arr = res._data.cartItems;

      let data = [];
      let total = 0.0;
      let cnt=0;
      await Promise.all(arr.map(async (item) => {
        const res = await firestore().collection('products').doc(item.category)
        .collection('categoryProducts').doc((item.productId).toString()).get();
        const dataobj = res._data;
        dataobj.quantityAdded = item.quantity;
        cnt += item.quantity;
        total += (dataobj.price*item.quantity);
        data.push(dataobj);
      }));
      
      setTotalItems(cnt);
      setItems(data);
      setCartValue(total);
    }
    catch(err) {
      console.log(err);
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    getDatabase();
    setIsRefreshing(false);
  }

  const handleChange = async ({prod, event}) => {
    try {
      setShowLoader(true);
      const newProd = {category: prod.category, productId: prod.productId, quantity: parseInt(prod.quantity) + parseInt(event)};
      const currUser = auth().currentUser;
      await firestore()
      .collection('users')
      .doc(currUser.uid)
      .update({'cartItems': firestore.FieldValue.arrayRemove(prod)});

      if(event == 0 || newProd.quantity == 0) {
        getDatabase();
        setShowLoader(false);
        return;
      }

      await firestore()
      .collection('users')
      .doc(currUser.uid)
      .update({'cartItems': firestore.FieldValue.arrayUnion(newProd)});

      getDatabase();
      setShowLoader(false);
    }
    catch(err) {
      setShowLoader(false);
      console.log(err);
    }
  }

  return (
    <View style={{flex:1, backgroundColor: '#DDE6ED'}}>
      <Spinner
        visible={showLoader}
        size={50}
      />
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing = {isRefreshing}
            onRefresh={() => handleRefresh()} 
          />
        } 
        data={items}
        renderItem={({item, key})=>{
          return (
            <CartListScreen key={key} item={item} handleChange={handleChange}/>
          )
        }}
      >
      </FlatList>

     <View style={styles.checkoutView}>
      <View style={{flexDirection:'row',marginTop:25,justifyContent:'space-between'}}>
      <View style={{flexDirection:'column'}}>
      <Text style={{fontSize:17,color:'grey',fontWeight:'700'}}>Items:{totalItems}</Text>
      <Text style={{fontSize:17,color:'grey',fontWeight:'700'}}>Total: ₹{cartValue}</Text>
      </View>
      <View style={{paddingLeft:30,paddingBottom:60}}>
      <TouchableOpacity style={styles.addToCart}>
        <Text style={{color:'white',fontWeight:'700'}}>{"Proceed To CheckOut ->"}</Text>
     </TouchableOpacity>
      </View>
      </View>
     </View>
    </View>
  )
}

export default WishList

const styles = StyleSheet.create({
  checkoutView:{
    width:'100%',
    height:150,
    backgroundColor:'#fff',
    position:'absolute',
    bottom:0,
    elevation:8,
    flexDirection:'row',
    justifyContent:'space-evenly',
  },
  addToCart:{
    backgroundColor:'#E52B50',
    padding:16,
    borderRadius:10,
    width:200,
    height:50,
  },
})