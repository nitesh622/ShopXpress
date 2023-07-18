import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import StepsCheckBar from './StepsCheckBar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AddressConfirm from './AddressConfirm';
import OrderDetails from './OrderDetails';
import Payment from './Payment';
import RNUpiPayment from 'react-native-pay-by-upi';

const PaymentScreen = ({navigation, route}) => {
    const items = route.params.items;

    const [selectedStep, setSelectedStep] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleNext = async () => {
        if(selectedStep == 2) {
            console.log(totalAmount);
            heandlePayment();
        }

        if(selectedStep+1 < 3) {
            setSelectedStep(selectedStep + 1);
        }
    }

    const successCallback = (data) => {
        alert('Transaction Completed Successfully');
        console.log(data);
    }

    const failureCallback = (data) => {
        alert('Transaction Failed');
        console.log(data);
    }

    const heandlePayment = () => {
        RNUpiPayment.initializePayment(
            {
              vpa: "7015590264@paytm", // or can be john@ybl or mobileNo@upi
              payeeName: "ShopXpress",
              amount: totalAmount.toString(),
              transactionRef: "aasf-332-aoei-fn",
            },
            successCallback,
            failureCallback
        );
    }

    return (
        <View style={{flex: 1, marginBottom: 60}}>
            <StepsCheckBar selectedStep={selectedStep}/>

            <View style={{margin: 20, height: '75%'}}>
            {
                selectedStep==1
                ? <AddressConfirm/>
                : selectedStep==2
                ? <OrderDetails items={items} setTotalAmount={setTotalAmount}/>
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
                    <Text style={styles.buttonTitle}>{ selectedStep == 2 ? 'Pay' : 'Next' }</Text>
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