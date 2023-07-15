import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from '../components/Carousel';
import TypesFood from '../components/TypesFood';
import QuickFood from '../components/QuickFood';
import hotels from '../data/hotels';
import MenuItem from '../components/MenuItem';
import OfferList from '../components/OfferList';

const HomeScreen = () => {
  const data = hotels;
  return (
    <ScrollView style={{marginHorizontal: 10}}>
      <View style={styles.mainContainer}>
        <TextInput style={{fontSize: 17}} placeholder="Search your item here" />
        <Icon name="search" size={30} color="#E52B50" />
      </View>
      <Carousel />
      <TypesFood />
      <QuickFood />
      <View style={styles.SortFilterStyle}>
        <Pressable style={styles.filterStyle}>
          <Icon name="filter-sharp" size={24} color="green" />
          <Text style={{marginLeft: 10}}>Filter</Text>
        </Pressable>

        <Pressable style={styles.sortStyle}>
          <Text>Sort by rating</Text>
        </Pressable>

        <Pressable style={styles.sortStyle}>
          <Text>Sort by price</Text>
        </Pressable>
      </View>
      {data.map((item, index) => (
        <MenuItem key={index} item={item} />
      ))}
      <View style= {{marginBottom:80}}>
        <Text style = {styles.offerTextStyle}>Price Ranges!</Text>
      <OfferList title ={"Below ₹ 99"} Secondtitle = {"₹ 100 to ₹ 199"}/>
      <OfferList title ={"₹ 100 to ₹ 199"} Secondtitle = {"₹ 100 to ₹ 199"}/>
      <OfferList title ={"₹ 100 to ₹ 199"} Secondtitle = {"Above ₹ 1000"}/>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: '#C0C0C0',
    borderRadius: 15,
  },
  filterStyle: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    width: 120,
  },
  sortStyle: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  SortFilterStyle: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  offerTextStyle: {
    marginHorizontal: 12,
    fontSize: 17,
    fontWeight: '900',
    color: 'black'
  },
  myStyle:{
    color:'#E52B50',
  }
});
