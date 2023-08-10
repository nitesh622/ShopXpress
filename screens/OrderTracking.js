import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native'
import React, {useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import ItemCard from './ItemCard';
import user from '../data/Schema/userSchema';
import auth from '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const OrderTracking = ({navigation, route}) => {
  const item = route.params?.item;
  // console.log(item);
  const [userInfo, setUserInfo] = useState(user);
  const [orderedItems, setOrderedItems] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState({
    min: 0,
    hours: 0,
    date: 0,
    month: 0,
    year: 0
  });

  const monthDateArr = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthNameArr = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  

  let selectedStep = 1;

  const getProducts = async (cartarr) => {
    let itemsarr = [];
    for(let i=0; i<cartarr.length; i++) {
      const res = await firestore().collection('products').doc(cartarr[i].category).collection('categoryProducts').doc(cartarr[i].productId.toString()).get();
      const pData = res._data;
      // console.log(pData);
      let product = {
        key: i,
        name: '',
        price: '',
        seller: '',
        quantity: '',
        photo: '',
      }

      product.name = pData.name;
      product.price = pData.price*cartarr[i].quantity;
      product.quantity = cartarr[i].quantity;
      product.photo = pData.photos[0];

      const sellerData = await firestore().collection('users').doc(pData.sellerid).get();
      product.seller = sellerData._data.name;
      itemsarr.push(product);
    }

    return itemsarr
  }

  const getDatabase = async () => {
    try {
      const currUser = auth().currentUser;
      const data = await firestore().collection('users').doc(currUser.uid).get();
      setUserInfo(data._data);
      let itemsarr = await getProducts(item.productsIds);
      setOrderedItems(itemsarr);
    }
    catch(err) {
      console.log(err);
    }
  }

  const getDeliveryDate = () => {
    const newDeliveryDate = {
      min: 0,
      hours: 0,
      date: 0,
      month: 0,
      year: 0
    }

    let min = item.orderTime.min + item.deliveryTime.minutes;
    newDeliveryDate.min = min%60;

    let hours = item.orderTime.hours + item.deliveryTime.hours;
    if(min >= 60) hours++;
    newDeliveryDate.hours = hours%24;

    let date = item.orderDate.date + item.deliveryTime.days;
    if(hours >= 24) date++;
    let year = item.orderDate.year;
    if(year%4 == 0) monthDateArr[2] = 29;
    let month = item.orderDate.month;

    if(date > monthDateArr[month]) {
      newDeliveryDate.date = date%monthDateArr[month];
      month++;
    }
    else {
      newDeliveryDate.date = date;
    }

    if(month > 12) {
      newDeliveryDate.month = month%12;
      year++;
    }
    else {
      newDeliveryDate.month = month;
    }

    newDeliveryDate.year = year;
    setDeliveryDate(newDeliveryDate);
    // console.log(newDeliveryDate);
  }

  useEffect(
    () => {
      getDeliveryDate();
      getDatabase();
    },
    []
  );

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex:1, width: '100%', paddingHorizontal: 10, paddingBottom: 70}}>
          <View style={{width: '100%', marginVertical: 15,padding: 10, borderWidth: 1, borderRadius: 15, backgroundColor: 'white', borderColor: '#E0E0E0', flexDirection: 'row'}}>
            <View style={{margin: 5}}>
              <Text style={{fontSize: 17, marginBottom: 5}}>{'Ordered on: '}</Text>
              <Text style={{fontSize: 17, marginBottom: 5}}>{'Order Id: '}</Text>
              <Text style={{fontSize: 17, marginBottom: 5}}>{'Order Total: '}</Text>
            </View>
            <View style={{margin: 5}}>
              <Text style={{fontSize: 17, fontWeight: 'bold', marginBottom: 5, color: 'black'}}>{' ' + item.orderDate.date + '-' + monthNameArr[item.orderDate.month] + '-' + item.orderDate.year}</Text>
              <Text style={{fontSize: 17, fontWeight: 'bold', marginBottom: 5, color: 'black'}}>{item.orderId}</Text>
              <Text style={{fontSize: 17, fontWeight: 'bold', marginBottom: 5, color: 'black'}}>{' ₹ ' + item.totalPrice}</Text>
            </View>
          </View>

          <View style={{width: '100%', padding: 10, borderWidth: 1, borderRadius: 15, backgroundColor: 'white', borderColor: '#E0E0E0'}}>
            <View style={{margin: 10}}>
              <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: 'black'}}>{'Arriving on ' + deliveryDate.date + '-' + monthNameArr[deliveryDate.month] + '-' + deliveryDate.year}</Text>
              <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: 'black'}}>{'by ' + deliveryDate.hours + ':' + deliveryDate.min}</Text>
            </View>
            <View>
              <View style={styles.mainBox}>
                <View style={{
                  ...styles.circle,
                  backgroundColor: (selectedStep>0 ? 'green' : '#BBBBBB'),
                }}>
                  {selectedStep > 1
                      ? <MaterialCommunityIcons name='check-bold' size={24} color='white' />
                      : <Text style={{fontWeight: 'bold', fontSize: 22, color: 'white'}}>1</Text>
                  }
                </View>

                <View style={{
                  ...styles.line,
                    backgroundColor: (selectedStep>1 ? 'green' : '#BBBBBB'),
                  }}>
                </View>

                <View style={{
                    ...styles.circle,
                    backgroundColor: (selectedStep>1 ? 'green' : '#BBBBBB'),
                }}>
                    {selectedStep > 2
                        ? <MaterialCommunityIcons name='check-bold' size={24} color='white' />
                        : <Text style={{fontWeight: 'bold', fontSize: 22, color: 'white'}}>2</Text>
                    }
                </View>

                <View style={{
                    ...styles.line,
                    backgroundColor: (selectedStep>2 ? 'green' : '#BBBBBB'),
                }}>
                </View>

                <View style={{
                  ...styles.circle,
                  backgroundColor: (selectedStep>2 ? 'green' : '#BBBBBB'),
                }}>
                  {selectedStep > 3
                      ? <MaterialCommunityIcons name='check-bold' size={24} color='white' />
                      : <Text style={{fontWeight: 'bold', fontSize: 22, color: 'white'}}>3</Text>
                    }
                </View>

                <View style={{
                    ...styles.line,
                    backgroundColor: (selectedStep>2 ? 'green' : '#BBBBBB'),
                  }}>
                </View>

                <View style={{
                    ...styles.circle,
                    backgroundColor: (selectedStep>2 ? 'green' : '#BBBBBB'),
                }}>
                  {selectedStep > 4
                      ? <MaterialCommunityIcons name='check-bold' size={24} color='white' />
                      : <Text style={{fontWeight: 'bold', fontSize: 22, color: 'white'}}>4</Text>
                    }
                </View>
              </View>
              <View style={styles.textBox}>
                <Text style={styles.textStyle}>{'Ordered ' + item.orderDate.date + '-' + monthNameArr[item.orderDate.month] + '-' + item.orderDate.year}</Text>
                <Text style={styles.textStyle}>{'Order Status'}</Text>
                <Text style={styles.textStyle}>{'Out for Delivery'}</Text>
                <Text style={styles.textStyle}>{'Order Delivered'}</Text>
              </View>
            </View>
          </View>
            
          <View style={{width: '100%', marginVertical: 15,padding: 10, borderWidth: 1, borderRadius: 15, backgroundColor: 'white', borderColor: '#E0E0E0'}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: 'black'}}>{'Ordered Items'}</Text>
            <View>
              {
                orderedItems.map((product) => <ItemCard key={product.key} item={product}/>)
              }
            </View>
          </View>

          <View style={{width: '100%', padding: 10, borderWidth: 1, borderRadius: 15, backgroundColor: 'white', borderColor: '#E0E0E0'}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', margin: 5, color: 'black'}}>{'Shipping Address'}</Text>
            <View style={{margin: 5}}>
              <Text style={styles.addressText}>{userInfo.name}</Text>
              <Text style={styles.addressText}>{userInfo.locality}</Text>
              <Text style={styles.addressText}>{userInfo.city + ', ' + userInfo.state}</Text>
              <Text style={styles.addressText}>{userInfo.pincode}</Text>
            </View>
          </View>

          <View style={{width: '100%', marginVertical: 15,padding: 10, borderWidth: 1, borderRadius: 15, backgroundColor: 'white', borderColor: '#E0E0E0'}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', margin: 5, color: 'black'}}>{'Order Summary'}</Text>
            <View style={styles.priceBox}>
              <View style={{padding: 12}}>
                <View style={styles.rowBox}>
                  <Text style={{fontSize: 18}}>Cart Value: </Text>
                  <View style={{flexDirection: 'row'}}>
                    <FontAwesome name="rupee" size={18} style={{ marginRight: 3, marginTop: 5}}/>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.totalPrice}</Text>
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
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.totalPrice}</Text>
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
                    <Text style={{fontSize: 20, fontWeight: 'bold', color:'black'}}>{item.totalPrice}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderTracking

const styles = StyleSheet.create({
  mainBox: {
    width: '20%',
    alignItems: 'center', 
    marginVertical: 10,
    // padding: 20,
    // justifyContent: 'center'
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent:'center'
  },
  line: {
    width: 5,
    height: 50,
    backgroundColor: 'green',
  },
  textBox: {
    // borderWidth: 1,
    height: '100%',
    padding: 20,
    paddingLeft: 60,
    justifyContent: 'space-between',
    position: 'absolute',
  },
  textStyle: {
    fontSize: 17, 
    fontWeight: 'bold'
  },
  addressText: {
    fontSize: 17, 
    color:'black'
  },
  priceBox: {
    width: '100%', 
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