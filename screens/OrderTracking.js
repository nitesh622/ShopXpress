import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OrderTracking = ({navigation, route}) => {
  const item = route.params.item;
  console.log(item);
  return (
    <View>
      <Text>OrderTracking</Text>
    </View>
  )
}

export default OrderTracking

const styles = StyleSheet.create({})