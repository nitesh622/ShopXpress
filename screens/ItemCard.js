import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const ItemCard = ({item}) => {
  return (
    <View style={{marginTop: 10, padding: 10, borderRadius: 15, borderWidth: 1,borderColor: '#E0E0E0', backgroundColor: 'white', flexDirection: 'row' }}>
        <View style={{marginRight: 5, height: 80, width: 80, borderRadius: 15}}>
          <ImageBackground
            imageStyle={{ borderRadius: 6 }}
            style={{    width: '100%', height: undefined, aspectRatio: 1}}
            resizeMode='contain'
            source={
              (item.photo == '') ? 
              require('../assets/shopping.png') :
              {uri: item.photo}
            }
          >
          </ImageBackground>
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="rupee" size={16} style={{ marginLeft: 3, marginTop: 5}} color='black'/>
            <Text style={{fontSize: 16, marginHorizontal: 5, fontWeight: 'bold', color: 'black'}}>{item.price}</Text>
          </View>
          <Text style={{ fontSize: 14, color: 'black' }}>{'Sold by: ' + item.seller}</Text>
          <Text style={{ fontSize: 14, color: 'black' }}>{'Quantity: ' + item.quantity}</Text>
        </View>
    </View>
  )
}

export default ItemCard

const styles = StyleSheet.create({})