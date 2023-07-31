import { StyleSheet,ImageBackground,ScrollView,Text, View, Pressable, Image, TouchableOpacity } from 'react-native'
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
import ReviewCard from './ReviewCard'

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

        <View style = {{padding: 10}}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style ={styles.title}>{'₹' + item.price}</Text> 
          <Text style={{marginBottom: 5}}>{'Sold By: ' + item.sellerName}</Text>
          <View style={{height: 30, width: 150, borderWidth: 1}}>
            <View style={{height: '100%', width: `${((item.rating/5)*100)}%`, backgroundColor: 'red', position: 'absolute'}}></View>
            <View style={{height: '100%', width: '100%', flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white'}}>
              <Icon name='staro' size={30} style={{}} />
              <Icon name='staro' size={30}/>
              <Icon name='staro' size={30}/>
              <Icon name='staro' size={30}/>
              <Icon name='staro' size={30}/>
            </View>
          </View>
        </View>

        <View style={{marginHorizontal: 10, marginVertical: 10, marginBottom: 30}}>
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
        <Text style={styles.subTitle}>{item.details}</Text>
      </View>



      <View style = {{marginLeft: 20, marginTop:10}}>
        <Text style = {{fontSize:16, marginBottom: 7}}>Details:</Text>
        <View style = {styles.descStyle}>
          <MaterialCommunityIcons name="star-circle" size={24} color="green" />
          <Text style = {{marginLeft: 3, fontSize: 15 ,fontWeight: '400'}}>{item.rating.toFixed(1)}</Text>
          <Text style = {{marginLeft: 3, fontSize: 15 ,fontWeight: '400'}}>{'( ' + item.totalReviews + ' )'}</Text>
        </View>
        <Text style = {{marginLeft: 3, fontSize: 15 ,fontWeight: '400'}}>{item.deliveryTime.days + ' days, ' + (item.deliveryTime.hours+(item.deliveryTime.minutes/60)).toFixed(1) + ' hrs'}</Text>
        <View style = {{flexDirection: 'row'}}>
          <Fontisto name = "motorcycle" size ={24} style = {{marginTop:7}}/>
          <Text style ={{marginTop:9, marginLeft: 10,marginBottom:25}}>Free Delivery</Text>
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
    fontSize:18,
    color:'black',
    fontWeight:'400',
    letterSpacing:1,
    opacity:0.5,
    maxWidth:'95%',
    marginBottom:18,
    paddingHorizontal:8,
  }
})