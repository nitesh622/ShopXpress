import { StyleSheet, Text, View, TextInput, FlatList, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const Search = ({navigation, route}) => {
  const [searchText, setSearchText] = useState('');
  const [productsList, setProductsList] = useState([]);

  useEffect(()=>{getDatabase()}, []);

  const getProducts = async (prodarr) => {
    try { 
      let arr = [];
      for(let i=0; i<prodarr.length; i++) {
        let prod = {
          productCategory: prodarr[i].productCategory,
          productId: prodarr[i].productId,
          productName: '',
          productPrice: 0,
          productRating: 0,
        }

        const res = await firestore()
        .collection('products')
        .doc(prodarr[i].productCategory)
        .collection('categoryProducts')
        .doc(prodarr[i].productId.toString()).get();
        prod.productName = res._data.name;
        prod.productPrice = res._data.price;
        prod.productRating = res._data.rating;

        arr.push(prod);
      }

      return arr;
    }
    catch(err) {
      console.log(err);
    }
  }

  const getDatabase = async () => {
    try {
      const res = await firestore().collection('productsList').doc('list').get();
      let arr = await getProducts(res._data.listArray);
      setProductsList(arr);
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <View style={{felx:1, width: '100%', height: '100%'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomWidth: 1, borderColor: '#C0C0C0'}}>
        <Icon name='arrow-back-outline' size={40} style={{width: '10%'}} onPress={()=>{navigation.goBack()}}/>
        <View style={styles.mainContainer}>
            <TextInput 
              style={{fontSize: 17}} 
              placeholder="Search your item here" 
              value={searchText}
              onChangeText={text => setSearchText(text)}
            />
            <Icon name="search" size={30} color="#E52B50" />
        </View>
      </View>

      <View style={{padding: 10, backgroundColor: 'white', height: '100%'}}>
        <FlatList
          keyExtractor = {(item, index) => index}
          data={productsList}
          renderItem={({item, index}) => {
            if(searchText == '') return;
            const res = item.productName.toLowerCase().includes(searchText.toLowerCase());
            if(res) {
              return(
                <Pressable onPress={() => {setSearchText(item.productName)}}>
                  <View style={{padding: 5}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black',padding: 5, borderBottomWidth: 1, borderColor: '#E0E0E0',}}>{item.productName}</Text>
                  </View>
                </Pressable>
              )
            }
          }}
        />
      </View>

      <View style={styles.btnBox}>
        <TouchableOpacity style={styles.submitButton} onPress={()=>{navigation.navigate('ProductsScreen', {searchText: searchText, productsList: productsList})}}>  
          <Text style={styles.submitButtonTitle}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderColor: '#C0C0C0',
    // borderColor: '#E0E0E0',
    borderRadius: 15,
  },
  btnBox: {
    width: '100%', 
    justifyContent: 'center',
    padding: 25,
    position: 'absolute',
    bottom: 0,
    marginBottom: 60
  },
  submitButton: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E52B50',
    alignItems: 'center',
  },
  submitButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
})