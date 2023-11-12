import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Avatar, Title, Caption} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import {MyTabs} from '../navigation/BottomNavigation';
import user from '../data/Schema/userSchema';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { OnboardingScreenNavigation } from '../navigation/BottomNavigation';
import RNRestart from 'react-native-restart';

const ProfilePage = ({navigation, }) => {
  const [userInfo, setUserInfo] = useState(user);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      RNRestart.restart();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    getDatabase();
    GoogleSignin.configure(
        {
            offlineAccess: false,
            webClientId : '615140932127-lqmpvj5579a6ojubhd3a8v1egj0bdcc9.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
        }
    );
}, [])

  const getDatabase = async () => {
    try {
      const currUser  = auth().currentUser;
      const data = await firestore().collection('users').doc(currUser.uid).get();
      setUserInfo(data._data);
    }
    catch(err) {
      console.log(err);
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    getDatabase();
    setIsRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing = {isRefreshing}
            onRefresh={() => handleRefresh()} 
          />
        }
      >
        <View style={styles.userInfoSectionOne}>
          <View
            style={[
              {flexDirection: 'row', marginTop: 16},
              styles.backgroundStyle,
            ]}>
            <Avatar.Image
              source={
                (userInfo.photo == '') 
                ? require('../assets/profile.png')
                : {uri: userInfo.photo}
              }
              size={80}
            />
            <View style={{marginLeft: 20}}>
              <Title
                style={[
                  styles.title,
                  {
                    marginTop: 16,
                    marginBottom: 5,
                  },
                ]}>
                {userInfo.name}
              </Title>
              <Caption style={styles.caption}>{userInfo.email}</Caption>
            </View>
          </View>
        </View>
        
        <View style={[styles.userInfoSectionTwo, styles.backgroundStyle]}>
          <View style={styles.row}>
            <Text>
              <Icon name="location-pin" size={20} color="#E52B50" />
            </Text>
            <Text style={{marginLeft: 20}}>{userInfo.city + ', ' + userInfo.state}</Text>
          </View>
          <View style={styles.row}>
            <Text>
              <Icon name="phone" size={20} color="#E52B50" />
            </Text>
            <Text style={{marginLeft: 20}}>{"+91 " + userInfo.phoneNo}</Text>
          </View>
          <View style={styles.row}>
            <Text>
              <Icon name="mail" size={20} color="#E52B50" />
            </Text>
            <Text style={{marginLeft: 20}}>{userInfo.email}</Text>
          </View>
        </View>
        
        <View style={[styles.backgroundStyle, {marginHorizontal: 30, padding: 15}]}>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 15,
              fontWeight: '700',
              color: 'black',
            }}>
            {' '}
            Manage your Products!
          </Text>
          <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate('ManageScreen', {userInfo: userInfo})}}> 
            <Text style={{...styles.buttonTitle}}>Manage</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.infoBoxWrapper}>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: '#dddddd',
                borderRightWidth: 1,
              },
            ]}>
            <TouchableOpacity onPress={() => {navigation.navigate('Orders')}}>
              <Text>Orders</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoBox}>
            <TouchableOpacity onPress={() => {navigation.navigate('EditProducts');}}>
              <Text>Edit Products</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoBoxWrapper}>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: '#dddddd',
                borderRightWidth: 1,
              },
            ]}>
            <TouchableOpacity onPress={() => {navigation.navigate('FormList', {userData: userInfo});}}>
              <Text>Sell your Product</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoBox}>
            <TouchableOpacity onPress={() => {navigation.navigate('ProductList');}}>
              <Text>Products List</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <View>
          <View>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {navigation.navigate('PurchaseHistory')}}>
              <Image source={require('../assets/box.png')} style={{height: 20, width: 20}}/>
              <Text style={styles.menuItemText}>Purchase History</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FavouritesList')}>
              <Text>
                <Icon name="shopping-bag" size={20} color="#E52B50" />
              </Text>
              <Text style={styles.menuItemText}>Your Favourite</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={()=> {navigation.navigate('EditProfile', {userInfo: userInfo})}}>
              <Icon name="settings" size={20} color="#E52B50" />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity style={styles.menuItem}>
              <Text>
                <Icon name="help" size={20} color="#E52B50" />
              </Text>
              <Text style={styles.menuItemText}>help</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text>
                <Icon name="logout" size={20} color="#E52B50" />
              </Text>
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 75,
  },
  userInfoSectionOne: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  userInfoSectionTwo: {
    paddingHorizontal: 30,
    marginBottom: 25,
    marginHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 65,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    backgroundColor: '#E5e4e2',
    marginTop: 15,
    marginHorizontal: 30,
    borderRadius: 20,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 26,
  },
  backgroundStyle: {
    backgroundColor: '#E5E4E2',
    borderRadius: 27,
    padding: 10,
  },
  button: {
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
});
