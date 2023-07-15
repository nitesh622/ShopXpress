import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const StepsCheckBar = ({selectedStep}) => {
    return (
        <View>
            <View style={styles.mainBox}>
                <View style={{
                    ...styles.circle,
                    backgroundColor: (selectedStep>0 ? 'green' : '#BBBBBB'),
                }}>
                    {selectedStep > 1
                        ? <MaterialCommunityIcons name='check-bold' size={24} color='white' />
                        : <Text style={{fontWeight: 'bold', fontSize: 22, color: 'white'}}>1</Text>
                    }
                </View>

                <View style={{
                    ...styles.line,
                    backgroundColor: (selectedStep>1 ? 'green' : '#BBBBBB'),
                }}>
                </View>

                <View style={{
                    ...styles.circle,
                    backgroundColor: (selectedStep>1 ? 'green' : '#BBBBBB'),
                }}>
                    {selectedStep > 2
                        ? <MaterialCommunityIcons name='check-bold' size={24} color='white' />
                        : <Text style={{fontWeight: 'bold', fontSize: 22, color: 'white'}}>2</Text>
                    }
                </View>

                <View style={{
                    ...styles.line,
                    backgroundColor: (selectedStep>2 ? 'green' : '#BBBBBB'),
                }}>
                </View>
                
                <View style={{
                    ...styles.circle,
                    backgroundColor: (selectedStep>2 ? 'green' : '#BBBBBB'),
                }}>
                    {selectedStep > 3
                        ? <MaterialCommunityIcons name='check-bold' size={24} color='white' />
                        : <Text style={{fontWeight: 'bold', fontSize: 22, color: 'white'}}>3</Text>
                    }
                </View>
            </View>

            <View style={styles.textBox}>
                <Text style={styles.textStyle}>Address</Text>
                <Text style={styles.textStyle}>Order Details</Text>
                <Text style={styles.textStyle}>Payment</Text>
            </View>
        </View>
    )
}

export default StepsCheckBar

const styles = StyleSheet.create({
    mainBox: {
        width: '100%', 
        alignItems: 'center', 
        padding: 20, 
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent:'center'
    },
    line: {
        width: 100,
        height: 5,
        backgroundColor: 'green',
    },
    textBox: {
        paddingTop: 65,
        width: '100%',
        padding: 20, 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        position: 'absolute'
    },
    textStyle: {
        fontSize: 17, 
        fontWeight: 'bold'
    }
})