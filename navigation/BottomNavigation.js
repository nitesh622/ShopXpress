import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfilePage from '../screens/ProfilePage';
import HomeScreen from '../screens/HomeScreen';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import MenuScreen from '../screens/MenuScreen';
import Account from '../screens/Account';
import EditProfile from '../screens/EditProfile';
import FormList from '../components/Seller/FormList';
import ProductList from '../components/Seller/ProductList';
import Onboarding from '../components/Animation/Onboarding';
import Categories from '../screens/Categories';
import CategoriesItemsList from '../screens/CategoriesItemsList';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import OtpVerify from '../screens/OtpVerify';
import WishList from '../screens/WishList';
import Cart from '../screens/Cart';
import CartListScreen from '../screens/CartListSceen';
import { useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import FavouritesList from '../screens/FavouritesList';
import PaymentScreen from '../screens/PaymentScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const OnboardingScreenNavigation = () => {
  const [isUserLogin, setIsUserLogin] = useState(false);
  auth().onAuthStateChanged((user) => {
    if(user) setIsUserLogin(true);
  });

  // const items = useSelector(state => state);
  // console.log(items);
  return (
    <Stack.Navigator>
      {!isUserLogin ? 
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{headerShown: false}}
        />
        : null
      }

      {!isUserLogin ? 
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        : null
      }

      {!isUserLogin ? 
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        : null
      }

      <Stack.Screen
        name="MyTabs"
        component={MyTabs}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="OtpVerify"
        component={OtpVerify}
        options={{headerShown: false}}
      /> */}
      
    </Stack.Navigator>
  );
};

const MyTabs = () => {
  const [isUserLogin, setIsUserLogin] = useState(false);
  auth().onAuthStateChanged((user) => {
    if(user) setIsUserLogin(true);
  });

  if(isUserLogin) {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#E52B50',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {
            backgroundColor: 'white',
            borderRadius: 20,
            margin: 15,
            position: 'absolute',
            height: 50,
          },
        }}
      >
      <Tab.Screen
        name="Home"
        component={StackNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="home" size={25} color={'#E52B50'} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="list" size={25} color={'#E52B50'} />
              </View>
            );``
          },
        }}
      />
      <Tab.Screen
        name="MyCart"
        component={CartNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="shopping-cart" size={25} color={'#E52B50'} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({}) => {
            return (
              <Ionicons name="person-circle" size={25} color={'#E52B50'} />
            );
          },
        }}
      />
      </Tab.Navigator>
    </>
  );
  }
  else {
    <Stack.Navigator>
      <Stack.Screen
        name="OnboardingScreenNavigation"
        component={OnboardingScreenNavigation}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  }
};

const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name="CartListScreen"
        component={CartListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomePageCategory"
        component={CategoriesItemsList}
        options={({route}) => ({title: route.params.name})}
      />
    </Stack.Navigator>
  );
};

const CategoriesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CategoriesList"
        component={Categories}
        options={{
          title: 'Categories',
          headerLeft: () => null,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="CategoriesItemsList"
        component={CategoriesItemsList}
        options={({route}) => ({title: route.params.name})}
      />
        <Stack.Screen
        name="Cart"
        component={Cart}
        options={
          {
            title: 'Cart',
          headerLeft: () => null,
          headerTitleAlign: 'center',
          }
        }
      />
    </Stack.Navigator>
  );
};
const CartNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WishList"
        component={WishList}
        options={{
          title: 'MyCart',
          headerLeft: () => null,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={
          {
            title: 'Cart',
          headerLeft: () => null,
          headerTitleAlign: 'center',
          }
        }
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={
          {
            title: 'Payment Screen',
            headerLeft: () => null,
            headerTitleAlign: 'center',
          }
        }
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FormList"
        component={FormList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductList}
        options={{
          title: 'Items Listed',
          headerLeft: () => null,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="FavouritesList"
        component={FavouritesList}
        options={{
          title: 'Favourites',
          headerLeft: () => null,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export {MyTabs, OnboardingScreenNavigation};
