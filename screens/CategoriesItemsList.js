import { StyleSheet, Text, View, ScrollView, RefreshControl, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import MenuItem from '../components/MenuItem'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const CategoriesItemsList = ({navigation, route}) => {
  const category = route.params?.name;
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    try {
      console.log(category);
      const res = await firestore().collection('products').doc(category).get();
      const n = res._data.totalProducts;
      let arr = await getProducts(n);
      setData(arr);
    }
    catch(err) { 
      console.log(err);
    }
  }

  const getProducts = async (n) => {
    let arr = [];
    for(let i=0; i<n; i++) {
      const res = await firestore().collection('products').doc(category).collection('categoryProducts').doc(i.toString()).get();
      const obj = res._data;
      arr.push(obj);
    }

    return arr;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    getDatabase();
    setIsRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.container}>
        <FlatList
          refreshControl={
              <RefreshControl
              refreshing = {isRefreshing}
              onRefresh={() => handleRefresh()} 
              />
          }
          data={data}
          renderItem={({item, key})=>{
              return (
                  <MenuItem key={key} item={item}/>
              )
          }}
        >
        </FlatList>
    </SafeAreaView>
  )
}

export default CategoriesItemsList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE6ED',
    paddingHorizontal: 10,
  },
});