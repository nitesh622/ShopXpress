import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useImperativeHandle, forwardRef} from 'react'
import user from '../data/Schema/userSchema';
import firestore from '@react-native-firebase/firestore';

const OrderDetails = (props, ref) => {
    useImperativeHandle(ref, () => ({
        func: () => { func() }
    }));

    const func = () => {
        console.log('Order Details');
    }

    return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex:1, borderWidth: 1}}>
            <Text>OrderDetails</Text>
        </View>
    )
}

export default forwardRef(OrderDetails);

const styles = StyleSheet.create({})