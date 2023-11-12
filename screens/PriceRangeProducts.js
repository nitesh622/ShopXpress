import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import MenuItem from '../components/MenuItem'

const PriceRangeProducts = ({navigation, route}) => {
    const items = route.params.productsData;
    return (
        
        <View style={{flex:1, marginHorizontal: 10}}>
            {
                items.length == 0
                ? <Text>{"No Product Found!"}</Text>
                : <FlatList
                    data={items}
                    renderItem={({item, key})=>{
                        return (
                            <MenuItem key={key} item={item} navigation={navigation}/>
                        )
                    }}
                    >
                </FlatList>
            }

      </View>
    )
}

export default PriceRangeProducts

const styles = StyleSheet.create({})