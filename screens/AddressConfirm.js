import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {useNavigation} from '@react-navigation/native';

const AddressConfirm = (props) => {
    const navigation = useNavigation();
    const userInfo = props.userInfo;

    const handleEdit = async () => {
        navigation.navigate('EditProfile', {userInfo: userInfo});
    }

    return (
        <View style={{flex:1}}>
            <View style={{padding: 20}}>
                <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>Confirm Delivery Address</Text>
                <View style={styles.addressBox}>
                    <View style={{alignItems: 'center', justifyContent:'center'}}>
                        <View style={styles.bigCircle}></View>
                        <View style={styles.smallCircle}></View>
                    </View>
                    <View style={{marginLeft: 20}}>
                        <Text style={{...styles.addressText, fontWeight: 'bold', marginBottom: 5}}>{userInfo.name}</Text>
                        <Text style={styles.addressText}>{userInfo.locality}</Text>
                        <Text style={styles.addressText}>{userInfo.city + ', ' + userInfo.state}</Text>
                        <Text style={styles.addressText}>{userInfo.pincode}</Text>
                    </View>
                </View>
                <Text style={{textAlign: 'center', color: '#9DB2BF', fontSize: 16}}>
                    {"--------------------- OR --------------------"}
                </Text>
                <TouchableOpacity style={styles.button} onPress={()=>{handleEdit()}}> 
                    <Text style={{...styles.buttonTitle}}>Edit Address</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddressConfirm;

const styles = StyleSheet.create({
    addressBox: {
        borderWidth: 1, 
        padding: 15, 
        borderRadius: 15, 
        marginVertical: 20, 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderColor: '#E0E0E0', 
        backgroundColor: 'white'
    },
    bigCircle: {
        height: 25, 
        width: 25, 
        borderRadius: 30, 
        backgroundColor: '#E52B50'
    },
    smallCircle: {
        height: 10, 
        width: 10, 
        borderRadius: 15, 
        backgroundColor: 'white', 
        position:'absolute'
    },
    addressText: {
        fontSize: 20, 
        color:'black'
    },
    button: {
        marginTop: 20,
        backgroundColor: '#E52B50',
        width: '100%',
        height: 48,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        padding: 10,
    },
})