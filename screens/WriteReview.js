import { StyleSheet, Text, View, Image, TextInput, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';

const WriteReview = ({navigation,route}) => {
    const product = route.params.product;
    // console.log(product);
    const [userName, setUserName] = useState('')
    const [showLoader, setShowLoader] = useState(false);
    const [review, setReview] = useState({
        productCategory: product.category,
        productId: product.id,
        rating: 0,
        description: '',
    })

    const getDatabase = async () => {
        try {
            const currUser  = auth().currentUser;
            const data = await firestore().collection('users').doc(currUser.uid).get();
            setUserName(data._data.name);
        }
        catch(err) {
            console.log(err);
        }
    }

    const postReview = async () => {
        try {
            if(review.rating == 0) {
                ToastAndroid.show('Please rate the Product', ToastAndroid.BOTTOM);
            }
            else if(review.description == '') {
                ToastAndroid.show('Please write some Review', ToastAndroid.BOTTOM);
            }
            else {
                setShowLoader(true);
                const currUser  = auth().currentUser;
                await firestore()
                .collection('users')
                .doc(currUser.uid)
                .update({'reviews': firestore.FieldValue.arrayUnion(review)});
                
                const productReview = {
                    buyerName: userName,
                    buyerId: currUser.uid,
                    rating: review.rating,
                    description: review.description
                };

                const res = await firestore()
                .collection('products')
                .doc(product.category)
                .collection('categoryProducts')
                .doc(product.id.toString())
                .get();

                const newTotalReviews = res._data.totalReviews + 1;
                const newRating = ((res._data.rating*res._data.totalReviews) + review.rating)/newTotalReviews;

                await firestore()
                .collection('products')
                .doc(product.category)
                .collection('categoryProducts')
                .doc(product.id.toString())
                .update({'reviews': firestore.FieldValue.arrayUnion(productReview), totalReviews: newTotalReviews, rating: newRating});
                
                navigation.goBack();
                alert('Review Posted')
                setShowLoader(false);
            }
        }
        catch(err) {
            setShowLoader(false);
            console.log(err);
        }
    }

    useEffect(()=> {getDatabase()}, [])

    return (
        <View style={{flex: 1, width: '100%', marginBottom: 70}}>
            <Spinner
                visible={showLoader}
                size={50}
            />
            <View style={{flexDirection: 'row', padding: 20, alignItems: 'center'}}>
                <View style={{borderRadius: 25, borderWidth: 1}}>
                    <Image source={require('../assets/profile.png')} style={{height: 40, width: 40}} />
                </View>
                <Text style={{fontSize: 24, paddingLeft: 10, fontWeight: 'bold', color: '#454545'}}>{userName}</Text>
            </View>

            <View style={{padding: 20}}>
                <Text style={{fontSize: 20, paddingBottom: 10,fontWeight: 'bold', color: 'black'}}>{'How much would you rate it?'}</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => {setReview({...review, rating: 1})}}>
                        {
                            review.rating > 0
                            ? <Icon name='star' size={30}  color='#FCDA00'/>
                            : <Icon name='staro' size={30} color='#FCDA00'/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setReview({...review, rating:2})}}>
                        {
                            review.rating > 1
                            ? <Icon name='star' size={30}  color='#FCDA00'/>
                            : <Icon name='staro' size={30} color='#FCDA00'/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setReview({...review, rating:3})}}>
                        {
                            review.rating > 2
                            ? <Icon name='star' size={30}  color='#FCDA00'/>
                            : <Icon name='staro' size={30} color='#FCDA00'/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setReview({...review, rating:4})}}>
                        {
                            review.rating > 3
                            ? <Icon name='star' size={30}  color='#FCDA00'/>
                            : <Icon name='staro' size={30} color='#FCDA00'/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setReview({...review, rating:5})}}>
                        {
                            review.rating > 4
                            ? <Icon name='star' size={30}  color='#FCDA00'/>
                            : <Icon name='staro' size={30} color='#FCDA00'/>
                        }
                    </TouchableOpacity>
                </View>

                <Text style={{fontSize: 20, paddingTop: 25, paddingBottom: 10,fontWeight: 'bold', color: 'black'}}>{'Review'}</Text>
                <TextInput
                    editable
                    multiline
                    style={styles.biginput}
                    placeholder="Write the detailed review..."
                    onChangeText={text => setReview({...review, description: text})}
                />
            </View>
            
            <View style={styles.btnBox}>
                <TouchableOpacity style={styles.submitButton} onPress={()=>postReview()}>  
                    <Text style={styles.submitButtonTitle}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default WriteReview

const styles = StyleSheet.create({
    btnBox: {
        width: '100%', 
        justifyContent: 'center',
        padding: 20,
        position: 'absolute',
        bottom: 0,
    },
    submitButton: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#E52B50',
        alignItems: 'center',
    },
    submitButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    biginput: {
        height: 200,
        marginBottom: 10,
        borderColor: '#ccc',
        padding: 5,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'white',
        textAlignVertical: 'top',
    },
});