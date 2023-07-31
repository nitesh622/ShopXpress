import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const PurchaseHistory = ({navigation}) => {
    const [orders, setOrders] = useState([]);

    const getDatabase = async () => {
        try {
            const currUser  = auth().currentUser;
            const data = await firestore().collection('users').doc(currUser.uid).collection('ordersPlaced').get();
            // console.log(data);
            let arr = [];
            data.docs.map((doc) => {
                arr.push(doc._data);
            });

            setOrders(arr);
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {getDatabase()}, []);

    return (
        <View style={{flex: 1, padding: 10, height: '100%', width: '100%'}}>
            <View>

            <FlatList
                keyExtractor = {(item, index) => index}
                data={orders}
                renderItem={({item, key})=>{
                    return(
                        <View style={{height: undefined, width: '100%', borderWidth: 1, borderRadius: 15, backgroundColor: 'white',borderColor: '#E0E0E0', marginVertical: 10, padding: 10}}>
                            <TouchableOpacity 
                                style={{
                                    flexDirection: 'row', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                }} 
                                onPress={()=>{navigation.navigate('OrderTracking', item={item})}}
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={{uri: item.orderPhoto}} style={{height: 100, width: '30%', borderRadius: 15, borderWidth: 1}} />
                                    <View style={{marginLeft: 20, width: '60%'}}>
                                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>{item.orderName}</Text>
                                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{'Ordered on ' + item.orderDate.date + '/' + item.orderDate.month + '/' + item.orderDate.year}</Text>
                                    </View>
                                </View>
                                <Text style={{fontSize: 30, color: 'black', width: '5%'}}>{'>'}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
            </View>
        </View>
    )
}

export default PurchaseHistory

const styles = StyleSheet.create({})