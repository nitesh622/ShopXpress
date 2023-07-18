import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native'
import React, { useState ,useEffect} from 'react'
import user from '../data/Schema/userSchema';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import ItemCard from './ItemCard';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const OrderDetails = (props, ref) => {

    const navigation = useNavigation();
    const [items, setItems] = useState([]);
    const [cartValue, setCartValue] = useState(0);

    const getProducts = async (cartarr) => {
        let itemsarr = [];
        let total=0;
        for(let i=0; i<cartarr.length; i++) {
            let item = cartarr[i];
            let product = {
                key: i,
                name: '',
                price: '',
                seller: '',
                quantity: '',
                photo: '',
            }

            product.name = item.name;
            product.price = item.price*item.quantityAdded;
            total += product.price;
            product.quantity = item.quantityAdded;
            product.photo = item.photos[0];

            const sellerData = await firestore().collection('users').doc(item.sellerid).get();
            product.seller = sellerData._data.name;
            itemsarr.push(product);
        }

        setCartValue(total);
        props.setTotalAmount(total);
        return itemsarr
    }

    const getDatabase = async () => {
        try {
            const cartarr = props.items;

            let itemsarr = await getProducts(cartarr);
            setItems(itemsarr);
            
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {getDatabase()}, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Cart Items</Text>
            {
                items.map((item) => <ItemCard key={item.key} item={item}/>)
            }

            <Text style={{...styles.heading, marginTop: 30}}>Pricing Details</Text>
            <View style={styles.priceBox}>
                <View style={{padding: 12}}>
                    <View style={styles.rowBox}>
                        <Text style={{fontSize: 18}}>Cart Value: </Text>
                        <View style={{flexDirection: 'row'}}>
                            <FontAwesome name="rupee" size={18} style={{ marginRight: 3, marginTop: 5}}/>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{cartValue}</Text>
                        </View>
                    </View>
                    <View style={styles.rowBox}>
                        <Text style={{fontSize: 18}}>Delivery Charge: </Text>
                        <View style={{flexDirection: 'row'}}>
                            <FontAwesome name="rupee" size={18} style={{ marginRight: 3, marginTop: 5}}/>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>0</Text>
                        </View>
                    </View>
                    <View style={styles.rowBox}>
                        <Text style={{fontSize: 18}}>Total: </Text>
                        <View style={{flexDirection: 'row'}}>
                            <FontAwesome name="rupee" size={18} style={{ marginRight: 3, marginTop: 5}}/>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{cartValue}</Text>
                        </View>
                    </View>
                    <View style={styles.rowBox}>
                        <Text style={{fontSize: 18}}>Discount: </Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{'- '}</Text>
                            <FontAwesome name="rupee" size={18} style={{ marginRight: 3, marginTop: 5}}/>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>0</Text>
                        </View>
                    </View>
                </View>
                <View style={{width: '100%', borderTopWidth: 1, borderColor: '#E0E0E0'}}></View>
                <View style={{padding: 10}}>
                    <View style={styles.rowBox}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color:'black'}}>Order Total: </Text>
                        <View style={{flexDirection: 'row'}}>
                            <FontAwesome name="rupee" size={20} style={{ marginRight: 3, marginTop: 5}} color='black'/>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color:'black'}}>{cartValue}</Text>
                        </View>
                    </View>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default OrderDetails;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center', 
        flex:1, 
        padding: 10,

    },
    heading: {
        fontSize: 26, 
        fontWeight: 'bold', 
        color: 'black'
    },
    priceBox: {
        width: '100%', 
        borderWidth: 1, 
        marginTop: 10, 
        borderRadius: 10, 
        backgroundColor: 'white', 
        borderColor: '#E0E0E0'
    },
    rowBox: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 5
    }
})