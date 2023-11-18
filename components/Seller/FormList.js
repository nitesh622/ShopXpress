import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ToastAndroid,
  Image
} from 'react-native';
import {Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import items from '../../data/Category';
import { useEffect } from 'react';
import product from '../../data/Schema/productSchema';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';

const SellProductForm = ({navigation, route}) => {
  const [finalProduct, setFinalProduct] = useState(product);
  const [showLoader, setShowLoader] = useState(false);
  // console.log(finalProduct);

  const userData = route.params.userData;

  let categories = [];
  items.map((item) => categories.push(item.name));

  const openGallery = async () => {
    ImagePicker.openPicker({
      cropping: true,
      multiple: true,
      maxFiles: 4,
      compressImageQuality: 0.5,
      compressImageMaxHeight: 500,
      compressImageMaxWidth: 500,
    })
    .then (
      async (res) => {
        if(res.length > 4) {
          ToastAndroid.show('You can only select a maximum of 4 Images.', ToastAndroid.BOTTOM);
        }
        else {
          let arr = []
          res.map(img => {
            arr.push(img.path);
          });
          console.log(arr);
          setFinalProduct({...finalProduct, photos: arr});
        }
      }
    )
    .catch(err => console.log(err));
  }

  const getLinks = async () => {
    try {
      let linkArray = [];
      for(let i=0; i<finalProduct.photos.length; i++) {
        const img = finalProduct.photos[i];
        const imgname = i.toString() + '.jpg';
        const reference = storage().ref(`products/${finalProduct.category}/${finalProduct.id}/${imgname}`);
        await reference.putFile(img);
        let url = await reference.getDownloadURL();
        linkArray.push(url);
      }

      return linkArray;
    }
    catch(err) {
      console.log(err);
    }
  }

  const handleSellProduct = async () => {
    // console.log(finalProduct);
    if(finalProduct.name == '') {
      ToastAndroid.show('Please Enter the Name of the Product', ToastAndroid.BOTTOM);
    }
    else if(finalProduct.price == 0.0) {
      ToastAndroid.show('Please Enter the Price of the Product', ToastAndroid.BOTTOM);
    }
    else if(finalProduct.quantity == 0) {
      ToastAndroid.show('Please Enter the Quantity of the Product', ToastAndroid.BOTTOM);
    }
    else if(finalProduct.details == '') {
      ToastAndroid.show('Please Enter some details of the Product', ToastAndroid.BOTTOM);
    }
    else if(finalProduct.category == '') {
      ToastAndroid.show('Please select a category of the Product', ToastAndroid.BOTTOM);
    }
    else if(finalProduct.photos.length == 0) {
      ToastAndroid.show('Please select atleast 1 Image of your Product', ToastAndroid.BOTTOM);
    }
    else if(finalProduct.deliveryTime.days == 0 && finalProduct.deliveryTime.hours == 0 && finalProduct.deliveryTime.minutes == 0) {
      ToastAndroid.show('Please add a Expected delivery Time of your Product', ToastAndroid.BOTTOM);
    }
    else {
      setShowLoader(true);
      try {
        const currUser  = auth().currentUser;
        const res = await firestore().collection('products').doc(finalProduct.category).get();
        finalProduct.id = (res._data.totalProducts).toString();
        finalProduct.sellerid = currUser.uid;
        finalProduct.sellerName = userData.name;

        let linkArray = await getLinks();

        finalProduct.photos = linkArray;

        await firestore()
        .collection('products')
        .doc(finalProduct.category)
        .update({'totalProducts': res._data.totalProducts+1});
        
        await firestore()
        .collection('products')
        .doc(finalProduct.category)
        .collection('categoryProducts')
        .doc((finalProduct.id).toString())
        .set(finalProduct);
        
        const newProd = {category: finalProduct.category, productId: finalProduct.id};
        await firestore()
        .collection('users')
        .doc(currUser.uid)
        .update({'productsListed': firestore.FieldValue.arrayUnion(newProd)});

        await firestore()
        .collection('productsList')
        .doc('list')
        .update({'listArray': firestore.FieldValue.arrayUnion({productCategory: finalProduct.category, productId: finalProduct.id})});

        navigation.goBack();
        alert('Product Listed');
        setShowLoader(false);
      }
      catch(err) {
        setShowLoader(false);
        console.log(err);
      }
    }
  };

  return (
    <SafeAreaView>
      <Spinner
          visible={showLoader}
          size={50}
      />
      <ScrollView>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            marginTop: 20,
          }}>
          <Avatar.Image
            source={
              userData.photo == '' 
              ? require('../../assets/profile.png')
              : {uri: userData.photo}
            }
            size={110}
          />
          <Text
            style={{
              marginTop: 10,
              color: 'black',
              fontSize: 20,
              fontWeight: '700',
            }}>
            {userData.name}
          </Text>
          <View style ={{flexDirection: 'row', gap : 4}}>
          <Icons name="star-circle" size={22} color="green" />
          <Text style ={{fontSize: 16}}>Certified Seller </Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.imgbox}>
            {
              finalProduct.photos.length == 0 
              ? 
              <TouchableOpacity style={styles.imgboxbtn} onPress={() => {openGallery()}}>
                <MaterialCommunityIcons name="file-image-plus-outline" size={30} />
                <Text>Choose some Images of your Product</Text>
              </TouchableOpacity>
              :
              finalProduct.photos.map((img) => <Image style={{height: 70, width: 70}} source={{uri: img}}/>)
            }

          </View>

          <TextInput
            style={styles.input}
            placeholder="Product Name"
            onChangeText={text => setFinalProduct({...finalProduct, name: text})}
          />

          <TextInput
            style={styles.input}
            placeholder="Product Price"
            onChangeText={text => setFinalProduct({...finalProduct, price: text})}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Product Quantity"
            onChangeText={text => setFinalProduct({...finalProduct, quantity: text})}
            keyboardType="numeric"
          />

          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginHorizontal:5}}>{'Expected Delivery Time'}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextInput
              style={{...styles.input, width: '25%', textAlign: 'center'}}
              placeholder="Days"
              onChangeText={text => setFinalProduct({...finalProduct, deliveryTime: {...finalProduct.deliveryTime, days: text}})}
              keyboardType="numeric"
            />
            <TextInput
              style={{...styles.input, width: '25%', textAlign: 'center'}}
              placeholder="Hours"
              onChangeText={text => setFinalProduct({...finalProduct, deliveryTime: {...finalProduct.deliveryTime, hours: text}})}
              keyboardType="numeric"
            />
            <TextInput
              style={{...styles.input, width: '25%', textAlign: 'center'}}
              placeholder="Minutes"
              onChangeText={text => setFinalProduct({...finalProduct, deliveryTime: {...finalProduct.deliveryTime, minutes: text}})}
              keyboardType="numeric"
            />
          </View>

          <TextInput
            editable
            multiline
            style={styles.biginput}
            placeholder="Product Details"
            onChangeText={text => setFinalProduct({...finalProduct, details: text})}
          />

          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={finalProduct.category}
              onValueChange={itemValue => setFinalProduct({...finalProduct, category: itemValue})}>
              <Picker.Item label="Select Category" value="" />
              {categories.map(
                category => (
                  <Picker.Item key={category} label={category} value={category} />
                ))
              }
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => handleSellProduct()}>
            <Icon
              name="cart-plus"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Sell Product</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 0,
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    marginBottom: 50,
  },
  imgbox: {
    flex: 1,
    flexDirection: 'row',
    height: 100,
    marginBottom: 20,
    backgroundColor: '#E5e4e2',
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    // justifyContent: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  imgboxbtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 45,
    marginBottom: 15,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#E5e4e2',
  },
  biginput: {
    height: 100,
    marginBottom: 15,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#E5e4e2',
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    marginBottom: 10,
    borderColor: '#E5e4e2',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#E5e4e2',
  },
  picker: {
    flex: 1,
  },
  pickerIcon: {
    marginLeft: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#E52B50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SellProductForm;
