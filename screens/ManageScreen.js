import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {Avatar} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const ManageScreen = ({navigation, route}) => {
    const userData = route.params.userInfo;
    return (
        <View>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                    marginTop: 20,
                }}>
                <Avatar.Image
                    source={
                    userData.photo == '' 
                    ? require('../assets/profile.png')
                    : {uri: userData.photo}
                    }
                    size={110}
                />
                <Text
                    style={{
                    marginTop: 10,
                    color: 'black',
                    fontSize: 22,
                    fontWeight: '700',
                    }}>
                    {userData.name}
                </Text>
                <View style ={{flexDirection: 'row', gap : 4}}>
                    <Icons name="star-circle" size={24} color="green" />
                    <Text style ={{fontSize: 18}}>Certified Seller</Text>
                </View>
            </View>

            <View style={styles.infoBoxWrapper}>
                <View
                    style={styles.infoBox}>
                    <TouchableOpacity style={{backgroundColor: '#E5e4e2', borderRadius: 15, paddingVertical: 15, width: '100%', alignItems: 'center'}} onPress={() => {navigation.navigate('Orders')}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>Orders Received</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoBox}>
                    <TouchableOpacity style={{backgroundColor: '#E5e4e2', borderRadius: 15, paddingVertical: 15, width: '100%', alignItems: 'center'}} onPress={() => {navigation.navigate('EditProducts')}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>Edit Products</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.infoBoxWrapper}>
                <View
                    style={styles.infoBox}>
                    <TouchableOpacity style={{backgroundColor: '#E5e4e2', borderRadius: 15, paddingVertical: 15, width: '100%', alignItems: 'center'}} onPress={() => {navigation.navigate('FormList', {userData: userData})}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>List New Product</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoBox}>
                    <TouchableOpacity style={{backgroundColor: '#E5e4e2', borderRadius: 15, paddingVertical: 15, width: '100%', alignItems: 'center'}} onPress={() => {navigation.navigate('ProductList')}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>Products List</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.infoBoxWrapper}>
                <View
                    style={styles.infoBox}>
                    <TouchableOpacity style={{backgroundColor: '#E5e4e2', borderRadius: 15, paddingVertical: 15, width: '100%', alignItems: 'center'}} onPress={() => {}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>Transactions</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoBox}>
                    <TouchableOpacity style={{backgroundColor: '#E5e4e2', borderRadius: 15, paddingVertical: 15, width: '100%', alignItems: 'center'}} onPress={() => {}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ManageScreen;

const styles = StyleSheet.create({
    infoBoxWrapper: {
        width: '100%',
        flexDirection: 'row',
        height: 65,
        marginBottom: 15,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    infoBox: {
        width: '45%',
        alignItems: 'center',
        justifyContent: 'center',
    },
})