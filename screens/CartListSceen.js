import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { addItemCart } from '../screens/Redux/actions/Actions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useState } from 'react'
const CartListScreen = ({ item, handleChange }) => {
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(item.quantityAdded);

  const handleInc = (event) => {
    const prod = {category: item.category, productId: item.id, quantity: item.quantityAdded};
    handleChange({prod, event});
  }

  return (
    <View style={{marginTop: 10, marginHorizontal: 10,padding: 10, borderRadius: 15, backgroundColor: 'white' }}>
      <Pressable onPress={() => navigation.navigate('MenuScreen', {item: item})} style={{ flexDirection: 'row' }}>
        <View style={{marginRight: 5, height: 150, width: 150, borderRadius: 15}}>
          <ImageBackground
            imageStyle={{ borderRadius: 6 }}
            resizeMode='contain'
            style={{width: '100%', height: undefined, aspectRatio: 1}}
            source={
              (item.photos.length == 0) ? 
              require('../assets/shopping.png') :
              {uri: item.photos[0]}
            }>
          </ImageBackground>
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.name}</Text>
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
          <View style={styles.descStyle}>
            <Pressable style={styles.addToCart} onPress={()=>{handleInc(1)}}>
              <Text style={{color:'white' , fontWeight:'700', fontSize: 25, textAlign: 'center'}}>+</Text>
            </Pressable>
            <Text style={{fontSize:18,marginHorizontal:12}}> {item.quantityAdded}</Text>
            <Pressable style={styles.addToCart} onPress={()=>{handleInc(-1)}}>
              <Text style={{color:'white' , fontWeight:'bold', fontSize: 25, textAlign: 'center'}}>-</Text>
            </Pressable>
            <Pressable style={{marginLeft: 17, padding: 3, borderRadius: 20, backgroundColor: '#E52B50'}} onPress={()=>{handleInc(0)}}>
              <MaterialCommunityIcons name='delete' size={30} color='white'/>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  )
}

export default CartListScreen

const styles = StyleSheet.create({
    addToCart:{
      backgroundColor:'#E52B50',
      borderRadius:50,
      width:35,
      height:35,
    },
    addRemoveView:{
      flexDirection:'row',
    },
    descStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 3,
    },
})