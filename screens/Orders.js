import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Orders = () => {

  const getDatabase = async () => {
    try {
      console.log('hi');
      const currUser = auth().currentUser;
      const res = await firestore()
      .collection('users')
      .doc('u2f6ac89rbf4XsZIO39DkdHewcg2')
      .collection('ordersPlaced')
      .onSnapshot(snapshot => {
        snapshot.docs.map(snap => {
          console.log(snap.data());
        })
      });
      // .get()
      // .then(querySnapshot => {
      //   console.log('Total users: ', querySnapshot.size);
    
      //   querySnapshot.forEach(documentSnapshot => {
      //     console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
      //   });
      // });
    }
    catch(err) {
      console.log(err);
    }
  }

  useEffect(()=>{getDatabase()}, [])
  return (
    <View>
      <Text>Orders</Text>
    </View>
  )
}

export default Orders

const styles = StyleSheet.create({})