import { StyleSheet, Text, View, Image } from 'react-native'
import React, {useEffect} from 'react'
import user from '../data/Schema/userSchema';
import firestore from '@react-native-firebase/firestore';


const Payment = (props) => {

    return (
        <View style={{flex:1}}>
            {
                props.paymentStatus == 'Success'
                ?   <View style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        <Image source={require('../assets/success.png')} style={{height: 150, width: 150}} />
                        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black', marginVertical: 20}}>{'Your order has been placed'}</Text>
                    </View>
                : props.paymentStatus == 'Failed'
                ?   <View style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        <Image source={require('../assets/failed.png')} style={{height: 150, width: 150}} />
                        <Text style={{fontSize: 26, fontWeight: 'bold', color: 'black', marginVertical: 20}}>{'Payment ' + props.paymentStatus}</Text>
                        <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black', marginVertical: 20, textAlign: 'center'}}>{'Please make payment again \n or \n Try again later'}</Text>
                    </View>
                :   <View>
                        <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black', margin: 20}}>{'Total amount to be paid: ₹' + props.totalAmount}</Text>
                        <View style={{height: '85%', justifyContent: 'center'}}>
                            <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                                <Image source={require('../assets/file.png')} style={{height: 150, width: 150}} />
                                <Text style={{fontSize: 26, fontWeight: 'bold', color: 'black', margin: 20, marginLeft: 35}}>{'Payment ' + props.paymentStatus}</Text>
                            </View>
                            <Text style={{fontSize: 20, fontWeight: 'bold', margin: 20}}>{'* Please make a Successful Payment to confirm your Order.'}</Text>
                        </View>
                    </View>
            }

        </View>
    )
}

export default Payment;

const styles = StyleSheet.create({})