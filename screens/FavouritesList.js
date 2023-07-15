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

const FavouritesList = () => {
    const [items, setItems] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
  
    useEffect(()=>{getDatabase()}, []);
  
    const getDatabase = async () => {
      try {
        const currUser = auth().currentUser;
        const res = await firestore().collection('users').doc(currUser.uid).get();
        const arr = res._data.favourites;
  
        let data = [];
        await Promise.all(arr.map(async (item) => {
          const res = await firestore().collection('products').doc(item.category)
          .collection('categoryProducts').doc((item.productId).toString()).get();
          const dataobj = res._data;
          data.push(dataobj);
        }));
        
        setItems(data);
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
  
    return (
      <View style={{flex:1, marginHorizontal: 10}}>
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
                    <MenuItem key={key} item={item}/>
                )
            }}
        >
        </FlatList>
      </View>
    )
}

export default FavouritesList

const styles = StyleSheet.create({});