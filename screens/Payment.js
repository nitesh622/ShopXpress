import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useImperativeHandle, forwardRef} from 'react'
import user from '../data/Schema/userSchema';
import firestore from '@react-native-firebase/firestore';

const Payment = (props, ref) => {
    useImperativeHandle(ref, () => ({
        func: () => { func() }
    }));

    const func = () => {
        console.log('Payment');
    }

    return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex:1, borderWidth: 1}}>
            <Text>Payment</Text>
        </View>
    )
}

export default forwardRef(Payment);

const styles = StyleSheet.create({})