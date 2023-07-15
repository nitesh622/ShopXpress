import { StyleSheet, Text, View, TouchableOpacity, TextInput, ToastAndroid, } from 'react-native'
import React, { useState } from 'react';

const OtpVerify = ({navigation, route}) => {
    const [otp, setOtp] = useState('');

    const sendToBackend = async () => {
        const userdata = await route.params;
        console.log(userdata, otp);
        if(userdata.otp != otp) {
            ToastAndroid.show('Please Enter a valid code', ToastAndroid.BOTTOM);
        }
        else {
            fetch('http://10.0.2.2.:3000/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userdata.data)
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    ToastAndroid.show(`${data.error}`, ToastAndroid.BOTTOM);
                }
                else {
                    console.log(userdata.data);
                    alert('Account created Successfully');
                    navigation.navigate('Login');
                }
            });
        }

        // navigation.navigate('Login');
    }

    // ToastAndroid.show('Please Enter your email', ToastAndroid.BOTTOM);

    const verifyOtp = async () => {
        try {
            const res = await route.params.otpData.confirm(otp);
            // console.log(res);
            alert('User Verified');
            navigation.navigate('MyTabs');
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP Sent to Your Email</Text>
            <TextInput
                style={styles.input}
                placeholder="OTP"
                placeholderTextColor="#AAAAAA"
                onChangeText={text => setOtp(text)}
                keyboardType="number-pad"
                autoCapitalize="words"
                autoCorrect={false}
            />
            <TouchableOpacity style={styles.button} onPress={()=>sendToBackend()}>
                <Text style={styles.buttonTitle}>Verify</Text>
            </TouchableOpacity>
            {/* <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.footerLink}>Log in</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3D1766',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#ECF2FF',
        marginTop: 20,
        marginBottom: 10,
        paddingLeft: 16,
        width: '100%',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#8F43EE',
        width: '100%',
        height: 48,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    footer: {
        marginTop: 30,
        flexDirection: 'row',
    },
    footerText: {
        color: '#333333',
        fontSize: 16,
    },
    footerLink: {
        color: '#8F43EE',
        marginLeft: 5,
        fontSize: 16,
    },
});

export default OtpVerify;