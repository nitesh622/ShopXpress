import { StyleSheet, Text, View, TouchableOpacity, TextInput, ToastAndroid, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Spinner from 'react-native-loading-spinner-overlay';
import user from '../data/Schema/userSchema';

const Login = ({navigation}) => {
    const [fdata, setFdata] = useState({
        email: '',
        password: ''
    });

    const [showLoader, setShowLoader] = useState(false);

    const sendToBackend = async () => {
        if(fdata.email == '') {
            ToastAndroid.show('Please Enter Email', ToastAndroid.BOTTOM);
        }
        else if(fdata.password == '') {
            ToastAndroid.show('Please Enter Password', ToastAndroid.BOTTOM);
        }
        else {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if(reg.test(fdata.email) == true) {
                fetch('http://10.0.2.2.:3000/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fdata)
                })
                .then(res => res.json())
                .then(data => {
                    if(data.error) {
                        ToastAndroid.show(`${data.error}`, ToastAndroid.BOTTOM);
                    }
                    else {
                        console.log(fdata);
                        navigation.navigate('MyTabs');
                        // navigation.goBack();
                    }
                });
            }
            else {
                ToastAndroid.show('Please Enter A Valid Email', ToastAndroid.BOTTOM);
            }
        }

        // navigation.navigate('MyTabs');
    }

    const loginFirebase = async () => {
        if(fdata.email == '') {
            ToastAndroid.show('Please Enter Email', ToastAndroid.BOTTOM);
        }
        else if(fdata.password == '') {
            ToastAndroid.show('Please Enter Password', ToastAndroid.BOTTOM);
        }
        else {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if(reg.test(fdata.email) == true) {
                try {
                    setShowLoader(true);
                    const userLogin = await auth().signInWithEmailAndPassword(fdata.email, fdata.password);
                    navigation.navigate('MyTabs');
                    setShowLoader(false);
                }
                catch(err) {
                    setShowLoader(false);
                    console.log(err);
                    ToastAndroid.show('Credentials do not match or User does not Exist', ToastAndroid.BOTTOM);
                }
            }
            else {
                ToastAndroid.show('Please Enter A Valid Email', ToastAndroid.BOTTOM);
            }
        }
    }

    useEffect(()=>{
        GoogleSignin.configure(
            {
                offlineAccess: false,
                webClientId : '615140932127-lqmpvj5579a6ojubhd3a8v1egj0bdcc9.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            }
        );
    }, [])

    const googleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const googleRes = await GoogleSignin.signIn();
            setShowLoader(true);
            const googleCredentials = auth.GoogleAuthProvider.credential(googleRes.idToken);
            const res = await auth().signInWithCredential(googleCredentials);
            const userRes = res.additionalUserInfo;

            if(userRes.isNewUser) {
                user.name = userRes.profile.name;
                user.email = userRes.profile.email;
                user.photo = userRes.profile.picture;
                await firestore().collection('users').doc(res.user.uid).set(user);
            }
            
            navigation.navigate('MyTabs');
            setShowLoader(false);
        } 
        catch (error) {
            setShowLoader(false);
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={showLoader}
                size={50}
            />
            <Text style={styles.title}>Welcome to ShopXpress</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#AAAAAA"
                onChangeText={text => setFdata({...fdata, email: text})}
                autoCapitalize="words"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#AAAAAA"
                onChangeText={text => setFdata({...fdata, password: text})}
                maxLength={10}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={() => {loginFirebase()}}> 
                <Text style={styles.buttonTitle}>Log in</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => {navigation.navigate('SignUp')}}>
                    <Text style={styles.footerLink}>Sign up</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={{textAlign: 'center', color: '#9DB2BF'}}>--------------- OR ---------------</Text>
                <TouchableOpacity onPress={() => googleLogin()}>
                    <View style={styles.googleBox}>
                        <Image source={require('../assets/google.png')} style={{height: 30, width: 30}} />
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>Sign in with Google</Text>
                    </View>
                </TouchableOpacity>
            </View>
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
        color: 'black',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 48,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#ECF2FF',
        marginTop: 20,
        marginBottom: 10,
        paddingLeft: 16,
        width: '100%',
        fontSize: 16,
    },
    ImagePic: {
        width: 110,
        height: 110,
        borderRadius: 24,
        shadowColor: '#202020',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 5,
    },
    button: {
        backgroundColor: '#E52B50',
        width: '100%',
        height: 48,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonTitle: {
        fontSize: 20,
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
        color: '#E52B50',
        marginLeft: 5,
        fontSize: 16,
    },
    googleBox: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 25,
        borderWidth: 1,
        width: '100%',
        paddingVertical: 8,
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 15,
        borderColor: 'grey',
    }
});

export default Login;