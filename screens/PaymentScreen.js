import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useRef } from 'react'
import StepsCheckBar from './StepsCheckBar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AddressConfirm from './AddressConfirm';
import OrderDetails from './OrderDetails';
import Payment from './Payment';

const PaymentScreen = ({navigation, route}) => {
    const childRef = useRef();
    const items = route.params.items;

    const [selectedStep, setSelectedStep] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleNext = async () => {
        if(selectedStep == 2) {
            childRef.current.func();
        }
        else if(selectedStep == 3) {
            childRef.current.func();
        }

        if(selectedStep+1 < 5) {
            setSelectedStep(selectedStep + 1);
        }
    }

    return (
        <View style={{flex: 1, marginBottom: 60}}>
            <StepsCheckBar selectedStep={selectedStep}/>

            <View style={{margin: 20, height: '75%'}}>
            {
                selectedStep==1
                ? <AddressConfirm/>
                : selectedStep==2
                ? <OrderDetails items={items} setTotalAmount={setTotalAmount} ref={childRef}/>
                : selectedStep==3
                ? <Payment totalAmount={totalAmount} ref={childRef}/>
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
                    <Text style={styles.buttonTitle}>Next</Text>
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