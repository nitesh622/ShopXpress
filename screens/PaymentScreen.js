import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import StepsCheckBar from './StepsCheckBar';
import AddressConfirm from './AddressConfirm';
import OrderDetails from './OrderDetails';
import Payment from './Payment';
import RNUpiPayment from 'react-native-pay-by-upi';
import RazorpayCheckout from 'react-native-razorpay';
import user from '../data/Schema/userSchema';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, } from '@env';
import orderDetails from '../data/Schema/orderSchema';


const PaymentScreen = ({navigation, route}) => {
    const items = route.params.items;

    const [selectedStep, setSelectedStep] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);
    const [userInfo, setUserInfo] = useState(user);
    const [paymentStatus, setPaymentStatus] = useState('Pending');
    const [newOrderDetails, setNewOrderDetails] = useState(orderDetails);

    const getDatabase = async () => {
        try {
            const curruser = auth().currentUser;
            const res = await firestore().collection('users').doc(curruser.uid).get();
            setUserInfo(res._data);
            
            if(totalAmount != 0) {
                let date = new Date().getDate();
                let month = new Date().getMonth() + 1;
                let year = new Date().getFullYear();
                let hours = new Date().getHours();
                let min = new Date().getMinutes();

                let prodIds = [];
                (res._data.cartItems).map((item) => {
                    prodIds.push(item);
                })

                let orderName = '';

                for(let i=0; i<items.length; i++) {
                    orderName += items[i].name;
                    if(i < items.length - 1) {
                        orderName += ', ';
                    }
                }

                const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = ' ';
                const charactersLength = characters.length;
                for(let i=0; i<20; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }

                let maxTime = 0;
                let maxDeliveryTime = {
                    days: 0,
                    hours: 0,
                    minutes: 0
                };
                items.map((item) => {
                    let num = item.deliveryTime.days + (item.deliveryTime.hours/100) + (item.deliveryTime.minutes/10000);
                    if(num > maxTime) {
                        maxDeliveryTime = item.deliveryTime;
                        maxTime = num;
                    }
                })
                
                let newOrder = orderDetails;
                newOrder.orderDate = {
                    date: date,
                    month: month,
                    year: year
                };
                newOrder.orderTime = {
                    hours: hours,
                    min: min
                };
                newOrder.productsIds = prodIds;
                newOrder.orderId = result;
                newOrder.deliveryTime = maxDeliveryTime;
                newOrder.totalPrice = totalAmount;
                newOrder.paymentId = newOrderDetails.paymentId;
                newOrder.orderName = orderName;
                newOrder.orderPhoto = items[0].photos[0];
                setNewOrderDetails(newOrder);
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(
        () => {
            getDatabase();
        }, [totalAmount]
    );

    const handleNext = async () => {
        if(selectedStep == 3) {
            // heandleGooglePayment();
            if(paymentStatus == 'Success') navigation.goBack();
            else handleRazorPayPayment();
        }

        if(selectedStep+1 < 4) {
            setSelectedStep(selectedStep + 1);
        }
    }

    // const successCallback = (data) => {
    //     alert('Transaction Completed Successfully');
    //     console.log(data);
    // }

    // const failureCallback = (data) => {
    //     alert('Transaction Failed');
    //     console.log(data);
    // }

    // const heandleGooglePayment = () => {
    //     RNUpiPayment.initializePayment(
    //         {
    //           vpa: "7015590264@paytm", // or can be john@ybl or mobileNo@upi
    //           payeeName: "ShopXpress",
    //           amount: totalAmount.toString(),
    //           transactionRef: "aasf-332-aoei-fn",
    //         },
    //         successCallback,
    //         failureCallback
    //     );
    // }

    const handleRazorPayPayment = async () => {
        var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.jpg',
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: totalAmount*100,
            name: 'ShopXpress',
            order_id: '',
            prefill: {
                email: userInfo.email,
                contact: '91'+userInfo.phoneNo,
                name: userInfo.name,
            },
            theme: {color: '#53a20e'}
        }

        RazorpayCheckout.open(options)
        .then(async (data) => {
            // handle success
            // console.log(data);
            setPaymentStatus('Success');
            setNewOrderDetails({...newOrderDetails, paymentId: data.razorpay_payment_id})
            // console.log(newOrderDetails);
            const curruser = auth().currentUser;
            await firestore().collection('users').doc(curruser.uid).collection('ordersPlaced').doc(newOrderDetails.orderId).set(newOrderDetails);
            // alert(`Success: ${data.razorpay_payment_id}`);
        })
        .catch((error) => {
            // handle failure
            console.log(error);
            setPaymentStatus('Failed');
            // alert(`Error: ${error.code} | ${error.description}`);
        });
    }

    return (
        <View style={{flex: 1, marginBottom: 60}}>
            <StepsCheckBar selectedStep={selectedStep} paymentStatus={paymentStatus}/>
            <View style={{margin: 20, height: '75%'}}>
            {
                selectedStep==1
                ? <AddressConfirm userInfo={userInfo}/>
                : selectedStep==2
                ? <OrderDetails items={items} setTotalAmount={setTotalAmount}/>
                : selectedStep==3
                ? <Payment totalAmount={totalAmount} paymentStatus={paymentStatus}/>
                : null
            }
            </View>

            <View style={styles.btnBox}>
                <TouchableOpacity 
                    style={{...styles.button,backgroundColor: '#BBBBBB'}}  
                    onPress={() => {
                        if(selectedStep == 1) navigation.goBack();
                        else setSelectedStep(selectedStep-1);
                    }}
                > 
                    <Text style={{...styles.buttonTitle}}>
                        { selectedStep == 1 ? 'Back' : 'Previous' }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {handleNext()}}
                > 
                    <Text style={styles.buttonTitle}>
                        {   selectedStep == 3 && paymentStatus != 'Success'
                            ? 'Pay' 
                            : selectedStep == 3 && paymentStatus == 'Success'
                            ? 'Back to Cart'
                            : 'Next' 
                        }
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PaymentScreen;

const styles = StyleSheet.create({

    btnBox: {
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        padding: 20,
        // borderWidth: 1,
        position: 'absolute',
        bottom: 0,
    },
    button: {
        backgroundColor: '#E52B50',
        width: 150,
        height: 48,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,

    },
    buttonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        padding: 10,
        // borderWidth: 1,
    },
});