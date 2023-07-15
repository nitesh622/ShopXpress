import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import quickfood from '../data/quickfood'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const QuickFood = () => {
  const data = quickfood;
  return (
    <View style = {styles.mainContainer}>
      <Text style = {styles.textStyle}>Today's recommendations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item,index) => (
            <Pressable key={index} style = {{margin: 5}}>
                <ImageBackground style = {styles.ScrollStyle} imageStyle = {{borderRadius: 6}} source={{uri:item.image}}>
                    <Text style = {styles.offerStyle}>{item.offer} OFF</Text>
                </ImageBackground>
                <Text style = {styles.nameStyle}>{item.name}</Text>
                <View style = {styles.descStyle}>
                <Icon name="star-circle" size={24} color="green" />
                <Text style = {{marginLeft: 3, fontSize: 15 ,fontWeight: '400'}}>{item.rating}</Text>
                <Text style = {{marginLeft: 3}}>•</Text>
                <Text style = {{marginLeft: 3, fontSize: 15 ,fontWeight: '400'}}>{item.time} reviews</Text>
                </View>
            </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

export default QuickFood

const styles = StyleSheet.create({
    mainContainer: {
        // marginHorizontal: 10,
    },
    textStyle : {
        paddingHorizontal: 5,
        paddingVertical: 12,
        fontWeight: '900',
        color: 'black',
        fontSize: 17,
        alignItems: 'center',
    },
    ScrollStyle: {
        aspectRatio : 5/6,
        height: 170,
    },
    offerStyle:{
        position: "absolute",
        bottom: 10,
        left: 10,
        fontSize: 27,
        fontWeight: "900",
        color: "white",
    },
    nameStyle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
    descStyle : {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    }
})