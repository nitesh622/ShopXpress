import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import items from '../data/Category'
import { useSelector } from 'react-redux'
const Categories = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {
                    items.map((obj) => {
                        return (
                            <View style={styles.outerBox} key={obj.name}>
                                <TouchableOpacity onPress={() => navigation.navigate('CategoriesItemsList', {name: obj.name})} key={obj.name}>
                                    <View style={styles.mainItem} >
                                        <Image source={obj.imagesrc} style={styles.image} />
                                        <Text style={styles.text}>{obj.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 65
    },
    scrollView: {
        marginHorizontal: 20,
    },
    outerBox: {
        borderBottomWidth: 0.5,
        // borderBottomColor: '#9BA4B5',
        borderBottomColor: 'grey'
    },
    mainItem: {
        flexDirection: 'row',
        margin: 10,
        padding: 10,
    },
    image: {
        height: 40,
        width: 40,
    },
    text:{
        paddingLeft: 20,
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black'
    }
})

export default Categories;
