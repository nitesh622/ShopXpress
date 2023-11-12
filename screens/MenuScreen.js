import { StyleSheet,ImageBackground,ScrollView,Text, View, Pressable, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { useState, useEffect } from 'react'
import { Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {SliderBox} from 'react-native-image-slider-box';
import { Item } from 'react-native-paper/lib/typescript/src/components/Drawer/Drawer'
import ReviewCard from './ReviewCard';
import Star from 'react-native-star-view';

const MenuScreen = ({navigation,route}) => {
  const item = route.params.item;
  const [isAdded, setIsAdded] = useState(false);
  const [addFav, setAddFav] = useState(false);
  const [topReviews, setTopReviews] = useState([]);

  useEffect(()=>{getDatabase()}, []);
  
  const getDatabase = async () => {
    try {
      const currUser = auth().currentUser;
      const res = await firestore().collection('users').doc(currUser.uid).get();
      const arr = res._data.cartItems;
      const arr1 = res._data.favourites;
    
      for(let i=0; i<arr.length; i++) {
        if(arr[i].category == item.category) {
          if(arr[i].productId == item.id) {
            setIsAdded(true);
            break;
          }
        }
      }

      for(let i=0; i<arr1.length; i++) {
        if(arr1[i].category == item.category) {
          if(arr1[i].productId == item.id) {
            setAddFav(true);
            break;
          }
        }
      }

      const reviews = [];
      let len = 3;
      if(item.reviews.length < len) {
        len = item.reviews.length;
      }

      for(let i=0; i<len; i++) {
        const review = {...item.reviews[i], key: i}
        reviews.push(review);
      }
      
      setTopReviews(reviews);
      // console.log(reviews);
    }
    catch(err) {
      console.log(err);
    }
  }

  const addToCart = async () => {
    try {
      const currUser = auth().currentUser;
      const newItem = {category: item.category, productId: item.id, quantity: 1};
      await firestore()
      .collection('users')
      .doc(currUser.uid)
      .update({'cartItems': firestore.FieldValue.arrayUnion(newItem)});

      setIsAdded(true);
      ToastAndroid.show('Product added to cart', ToastAndroid.BOTTOM);
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
      
      if(addFav) {
        ToastAndroid.show('Product removed from Favourites', ToastAndroid.BOTTOM);
      }
      else {
        ToastAndroid.show('Product added to Favourites', ToastAndroid.BOTTOM);
      }
      setAddFav(!addFav);
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{flex:1, height: undefined, width: '100%',paddingHorizontal: 10}}>
      <View style={styles.childContainer}>
        <View style={{}}>
          <SliderBox images={item.photos}
            dotColor = '#E52B50'
            sliderBoxHeight={500}
            inactiveDotColor = 'white'
            resizeMode='contain'
            ImageComponentStyle = {styles.image}
            borderRadius={15}
          >
            <Pressable onPress={() => {addToFav()}}>
              {addFav
                ? <Icon name="heart" style={{ position: "absolute", right: 10, top: 10 }} color="red" size={24} />
                : <Icon name="hearto" style={{ position: "absolute", right: 10, top: 10 }} color="white" size={24} />
              }
            </Pressable>
          </SliderBox>
        </View>

        <View style = {{borderBottomWidth: 2, borderColor: '#E0E0E0', paddingVertical: 10}}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginRight: 5}}>{item.rating.toFixed(1)}</Text>
            <Star score={item.rating} style={{height: 20, width: 100}}/>
            <Text style={{marginLeft: 10, color: 'blue'}}>{item.totalReviews + ' reviews'}</Text>
          </View>
        </View>

        <View style={{borderBottomWidth: 2, borderColor: '#E0E0E0', paddingVertical: 10}}>
          <Text style ={styles.title}>{'₹' + item.price}</Text> 
          <View style = {{flexDirection: 'row'}}>
            <Fontisto name = "motorcycle" size ={24} style = {{marginTop:8}}/>
            <Text style ={{margin: 8, fontSize: 17, fontWeight: 'bold'}}>Free Delivery</Text>
          </View>
          <Text style = {{marginVertical: 5, fontSize: 17, fontWeight: 'bold'}}>{'Delivery in ' + item.deliveryTime.days + ' days, ' + (parseFloat(item.deliveryTime.hours)+parseFloat(item.deliveryTime.minutes/60)).toFixed(1) + ' hrs'}</Text>
          <Text style={{marginVertical: 5, fontSize: 17, fontWeight: 'bold'}}>{'Sold By: ' + item.sellerName}</Text>
          <View style={{marginVertical: 10}}>
            {
              isAdded ? 
              <Button 
                theme={{ colors: { primary: '#E52B50' } }} 
                rippleColor={'pink'} 
                textColor='white' 
                isAddedicon="cart" 
                mode="contained" 
                onPress={() => {navigation.navigate('CartNavigator')}}
              >View Cart</Button>
              :
              <Button 
                theme={{ colors: { primary: '#E52B50' } }} 
                rippleColor={'pink'} 
                textColor='white' 
                isAddedicon="cart"
                mode="contained" 
                onPress={() =>addToCart()}
              >Add to cart</Button>
            }
          </View>
        </View>
        
        <View style={{borderBottomWidth: 2, borderColor: '#E0E0E0', paddingVertical: 10}}>
          <Text style={{fontSize: 26, fontWeight: 'bold', color: 'black'}}>{'Product Details:'}</Text>
          <Text style={styles.subTitle}>{item.details}</Text>
        </View>
      </View>

      <View style={{width: '95%', margin: 10, borderWidth: 1, borderRadius: 15, borderColor: '#E0E0E0', backgroundColor: 'white'}}>
        <View style={{padding: 10, paddingLeft: 20,borderBottomWidth: 1, borderColor: '#E0E0E0'}}>
          <Text style={{fontSize: 22, color: 'black', fontWeight: 'bold'}}>{'Customer Reviews'}</Text>
        </View>
        
        <View style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: 20}}>
          {
            topReviews.map((review) => {
              return (
                <ReviewCard review={review} key={review.key}/>
              );
            }) 
          }
        </View>
        <TouchableOpacity onPress={()=> {navigation.navigate('ReviewPage', {reviews: item.reviews})}} style={{borderTopWidth: 1, borderColor: '#E0E0E0', padding: 10, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>{'See More Reviews >>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{width: '95%', margin: 10, borderWidth: 1, marginBottom: 80, borderRadius: 15, borderColor: '#E0E0E0', backgroundColor: 'white'}}>
        <TouchableOpacity onPress={()=> {navigation.navigate('WriteReview', {product: item})}} style={{padding: 10, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>{'Write Review'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default MenuScreen

const styles = StyleSheet.create({
  childContainer:{
    width:'100%',
    paddingVertical:10,
  },
  rootContainer:{
    margin:0,
    padding:1
  },
  descStyle : {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  image:{
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  title:{
    fontWeight:'bold',
    fontSize:26,
    marginBottom:5,
    textAlign:'left',
    color:'black'
  },
  subTitle:{
    fontSize:17,
    color:'black',
    maxWidth:'95%',
    marginVertical: 10
  }
})