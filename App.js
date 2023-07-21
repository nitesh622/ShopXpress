import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MyTabs} from './navigation/BottomNavigation';
import {OnboardingScreenNavigation} from './navigation/BottomNavigation';
import { Provider } from 'react-redux';
import store from './screens/Redux/store/Store';
import { useSelector } from 'react-redux';

const App = () => {
  return (
    <>
    <Provider store={store}>
      <NavigationContainer>
        <OnboardingScreenNavigation />
      </NavigationContainer>
    </Provider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
