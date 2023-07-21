import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign'

const ReviewCard = ({review}) => {
  return ( 
    <View style={{flex: 1, width: '100%', borderBottomWidth: 1, paddingVertical: 20, borderColor: '#E0E0E0',}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{borderRadius: 25, borderWidth: 1}}>
              <Image source={require('../assets/profile.png')} style={{height: 25, width: 25}} />
          </View>
          <Text style={{fontSize: 18, paddingLeft: 10, fontWeight: 'bold', color: '#454545'}}>{review.buyerName}</Text>
      </View>

      <View style={{padding: 10}}>
        <View style={{flexDirection: 'row'}}>
          {
              review.rating > 0
              ? <Icon name='star' size={20}  color='#FCDA00'/>
              : <Icon name='staro' size={20} color='#FCDA00'/>
          }
          {
              review.rating > 1
              ? <Icon name='star' size={20}  color='#FCDA00'/>
              : <Icon name='staro' size={20} color='#FCDA00'/>
          }
          {
              review.rating > 2
              ? <Icon name='star' size={20}  color='#FCDA00'/>
              : <Icon name='staro' size={20} color='#FCDA00'/>
          }
          {
              review.rating > 3
              ? <Icon name='star' size={20}  color='#FCDA00'/>
              : <Icon name='staro' size={20} color='#FCDA00'/>
          }
          {
              review.rating > 4
              ? <Icon name='star' size={20}  color='#FCDA00'/>
              : <Icon name='staro' size={20} color='#FCDA00'/>
          }
        </View>

        <Text style={{fontSize: 16, paddingTop: 10, color: '#454545'}}>{review.description}</Text>
      </View>
    </View>
  )
}

export default ReviewCard

const styles = StyleSheet.create({
})