import { StyleSheet, Text, View,TouchableOpacity ,ImageBackground,TextInput, PermissionsAndroid} from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';

const EditProfile = ({navigation, route}) => {
  const oldData = route.params.userInfo;
  const [showLoader, setShowLoader] = useState(false);
  const [newData, setNewData] = useState({
    name: oldData.name,
    phoneNo: oldData.phoneNo,
    pincode: oldData.pincode,
    locality: oldData.locality,
    city: oldData.city,
    state: oldData.state,
    photo: oldData.photo,
  });
  const [pPhoto, setPPhoto] = useState(oldData.photo);

  const openGallery = async () => {
    ImagePicker.openPicker({
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.5,
    })
    .then(
      (res) => {
        setNewData({...newData, photo: res.path});
        setPPhoto(res.path);
      }
    )
    .catch(err => console.log(err));
  }

  const handleUpdate = async () => {
    try {
      setShowLoader(true);
      const currUser  = auth().currentUser;
      if(newData.name == oldData.name) delete newData.name;
      if(newData.phoneNo == oldData.phoneNo) delete newData.phoneNo;
      if(newData.pincode == oldData.pincode) delete newData.pincode;
      if(newData.locality == oldData.locality) delete newData.locality;
      if(newData.city == oldData.city) delete newData.city;
      if(newData.state == oldData.state) delete newData.state;
      
      if(newData.photo == oldData.photo) delete newData.photo;
      else {
        const reference = storage().ref(`users/${currUser.uid}/profilePhoto/myPhoto.jpg`);
        await reference.putFile(newData.photo);

        const url =  await storage().ref(`users/${currUser.uid}/profilePhoto/myPhoto.jpg`).getDownloadURL();
        newData.photo = url;
      }

      await firestore()
      .collection('users')
      .doc(currUser.uid)
      .update({...newData});

      alert('Data Updated');
      navigation.goBack();
      setShowLoader(false);
    }
    catch(err) {
      setShowLoader(false);
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>
      <Spinner
          visible={showLoader}
          size={50}
      />
      <View style={{margin:20}}>
        <View style={{alignItems:'center'}}>
          <TouchableOpacity onPress={()=>openGallery()}>
            <View style={{
              height:100,
              width:100,
              borderRadius:50,
              justifyContent:'center',
              alignItems:'center'
            }}>
              <ImageBackground
              source={
                pPhoto == '' 
                ? require('../assets/profile.png')
                : {uri: pPhoto}
              }
              style={{height:100,width:100}}
              imageStyle={{borderRadius:20}}
              >
                <View style={{
                  flex:1,
                  justifyContent:'center',
                  alignItems:'center'
                }}>
                  <Text>
                    <Icon name='camera-alt' color={'white'} size={30}
                    style={{
                      opacity:0.7,
                      alignItems:'center',
                      justifyContent:'center',
                      borderWidth:1,
                      borderColor:'#fff',
                      borderRadius:10,
                    }}
                    ></Icon>
                  </Text>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.action}> 
          <FontAwesome name='user-o' size={20} />
          <TextInput
            placeholder='Name'
            placeholderTextColor={'#666666'}
            style={styles.textInput}
            autoCorrect={false}
            value={newData.name}
            onChangeText={text => setNewData({...newData, name: text})}
          >
          </TextInput>
        </View>

        <View style={styles.action}> 
          <FontAwesome name='mobile-phone' size={30} />
          <TextInput
            placeholder='Phone Number'
            keyboardType='number-pad'
            maxLength={10}
            placeholderTextColor={'#666666'}
            style={styles.textInput}
            autoCorrect={false}
            value={newData.phoneNo}
            onChangeText={text => setNewData({...newData, phoneNo: text})}
          >
          </TextInput>
        </View>

        <View style={styles.action}> 
          <MaterialCommunityIcons name='map-marker' size={25}/>
          <TextInput
            placeholder='Pin Code'
            keyboardType='number-pad'
            maxLength={6}
            placeholderTextColor={'#666666'}
            style={styles.textInput}
            autoCorrect={false}
            value={newData.pincode}
            onChangeText={text => setNewData({...newData, pincode: text})}
          >
          </TextInput>
        </View>

        <View style={styles.action}> 
        <FontAwesome name='home' size={25} />
          <TextInput
            placeholder='Locality'
            placeholderTextColor={'#666666'}
            style={styles.textInput}
            autoCorrect={false}
            value={newData.locality}
            onChangeText={text => setNewData({...newData, locality: text})}
          >
          </TextInput>
        </View>

        <View style={styles.action}> 
          <FontAwesome5 name='city' size={20}/>
          <TextInput
            placeholder='City'
            placeholderTextColor={'#666666'}
            style={styles.textInput}
            autoCorrect={false}
            value={newData.city}
            onChangeText={text => setNewData({...newData, city: text})}
          >
          </TextInput>
        </View>

        <View style={styles.action}> 
          <FontAwesome name='map' size={20} />
          <TextInput
            placeholder='State'
            placeholderTextColor={'#666666'}
            style={styles.textInput}
            autoCorrect={false}
            value={newData.state}
            onChangeText={text => setNewData({...newData, state: text})}
          >
          </TextInput>
        </View>

        <TouchableOpacity style={styles.commandButton} onPress={()=>handleUpdate()}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E52B50',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
});