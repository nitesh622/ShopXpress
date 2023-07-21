import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import ReviewCard from './ReviewCard';

const ReviewPage = ({navigation,route}) => {
  const reviews = route.params.reviews;
  return (
    <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>

      <View style={{width: '100%', paddingHorizontal: 20}}>
        <FlatList
          keyExtractor = {(review, index) => index}
          data={reviews}
          renderItem={({item, index})=>{
            // console.log(review);
            return (
              <ReviewCard review={item} key={index} />
            )
          }}
        >
        </FlatList>
      </View>
    </View>
  )
}

export default ReviewPage

const styles = StyleSheet.create({})