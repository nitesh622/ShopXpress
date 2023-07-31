import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import MenuItem from '../components/MenuItem';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import items from '../data/Category.js';

const ProductsScreen = ({navigation, route}) => {
    const searchText = route.params.searchText;
    const productsList = route.params.productsList;
    const [originalProductList, setOriginalProductList] = useState([]);
    const [filteredProductsList, setFilteredProductsList] = useState([]);

    const [sortBtnFlag, setSortBtnFlag] = useState(false);
    const [sortBtnChoice, setSortBtnChoice] = useState(0);
    const [filterBtnFlag, setFilterBtnFlag] = useState(false);
    const [filterBtnChoice, setFilterBtnChoice] = useState([0]);

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [category, setCategory] = useState('');

    let categories = [];
    items.map((item) => categories.push(item.name));

    useEffect(() => {getDatabase()}, []);

    const getDatabase = async () => {
        try {
            let productsArray = [];
            await Promise.all(productsList.map(async (product) => {
                const flag = product.productName.toLowerCase().includes(searchText.toLowerCase());
                if(flag) {
                    const res = await firestore()
                    .collection('products')
                    .doc(product.productCategory)
                    .collection('categoryProducts')
                    .doc(product.productId).get();

                    productsArray.push(res._data);
                }
            }));
            
            setOriginalProductList(productsArray);
            setFilteredProductsList(productsArray);
        }
        catch(err) {
            console.log(err);
        }
    }

    const handleSortClick = (choice) => {
        let arr = filteredProductsList;
        if(choice == 0) {
            arr = originalProductList;
            setFilterBtnChoice([0]);
            setMinPrice('');
            setMaxPrice('');
            setCategory('');
        }
        else if(choice == 1) {
            arr.sort((a, b) => {
                return b.price - a.price;
            })
        }
        else if(choice == 2) {
            arr.sort((a, b) => {
                return a.price - b.price;
            })
        }
        else if(choice == 3) {
            arr.sort((a, b) => {
                return b.rating - a.rating;
            })
        }
        else if(choice == 4) {
            arr.sort((a, b) => {
                return a.rating - b.rating;
            })
        }

        setFilteredProductsList(arr);
    }

    const handleFilterClick = () => {
        const num1 = parseInt(minPrice);
        const num2 = parseInt(maxPrice);
        let arr = [];
        if(filterBtnChoice.length == 1) {
            if(filterBtnChoice[0] == 0) arr = originalProductList;
            else if(filterBtnChoice[0] == 1) {
                for(let i=0; i<filteredProductsList.length; i++) {
                    const price = parseInt(filteredProductsList[i].price);
                    if(price >= num1 && price <= num2) {
                        arr.push(filteredProductsList[i]);
                    }
                }
            }
            else {
                for(let i=0; i<filteredProductsList.length; i++) {
                    if(filteredProductsList[i].category == category) {
                        arr.push(filteredProductsList[i]);
                    }
                }
            }
        }
        else {
            for(let i=0; i<filteredProductsList.length; i++) {
                const price = parseInt(filteredProductsList[i].price);
                if(price >= num1 && price <= num2 && filteredProductsList[i].category == category) {
                    arr.push(filteredProductsList[i]);
                }
            }
        }
        
        setFilteredProductsList(arr);
    }

    return (
        <SafeAreaView style={{flex: 1, width: '100%'}}>
            <View style={{width: '100%', paddingVertical: 20, paddingHorizontal: 10,borderBottomWidth: 1, borderColor: '#C0C0C0', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black', width: '45%'}}>{'Showing Results for: '}</Text>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black', width: '55%'}}>{'\"' + searchText + '\"'}</Text>
            </View>

            <View style={{height: '100%',paddingHorizontal: 10, backgroundColor: '#DDE6ED'}}>
                <View style={{margin: 10, flexDirection: 'row'}}>
                    <TouchableOpacity 
                        style={{
                            width: '30%', 
                            borderRadius: 25, 
                            borderWidth: 1, 
                            borderColor: '#C0C0C0', 
                            padding: 5, 
                            marginRight: 10, 
                            flexDirection: 'row', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            backgroundColor: 'white'
                        }}

                        onPress={() => {setSortBtnFlag(true)}}
                    >
                        <Image source={require('../assets/sort.png')} style={{height: 18, width: 18, marginRight: 5}}/>
                        <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>{'Sort'}</Text>
                    </TouchableOpacity>

                    <Modal 
                        isVisible={sortBtnFlag}
                        style={{
                            width: '100%',
                            marginLeft: 0,
                            marginBottom: 0,
                        }}
                        onBackButtonPress={()=>{setSortBtnFlag(false)}}
                        onBackdropPress={()=>{setSortBtnFlag(false)}}
                    >
                        <View 
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                left: 0,
                                height: '35%',
                                padding: 20,
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                backgroundColor: '#fff',
                                width: '100%'
                            }}
                        >
                            <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>{'Sort'}</Text>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} 
                                onPress={()=> {
                                    setSortBtnChoice(0);
                                    setSortBtnFlag(false);
                                    handleSortClick(0);
                                }}
                            >
                                {
                                    sortBtnChoice==0
                                    ?   <View style={{alignItems: 'center', justifyContent:'center'}}>
                                            <View style={styles.bigCircle}></View>
                                            <View style={styles.smallCircle}></View>
                                        </View>
                                    :   <View style={{height: 20, width: 20, borderRadius: 30, borderWidth: 1, borderColor: 'grey'}}></View>
                                }
                                <Text style={{fontSize: 18, fontWeight: 'bold',paddingLeft: 10, color:'#454545'}}>{'All Products'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} 
                                onPress={()=> {
                                    setSortBtnChoice(1);
                                    setSortBtnFlag(false);
                                    handleSortClick(1);
                                }}
                            >
                                {
                                    sortBtnChoice==1
                                    ?   <View style={{alignItems: 'center', justifyContent:'center'}}>
                                            <View style={styles.bigCircle}></View>
                                            <View style={styles.smallCircle}></View>
                                        </View>
                                    :   <View style={{height: 20, width: 20, borderRadius: 30, borderWidth: 1, borderColor: 'grey'}}></View>
                                }
                                <Text style={{fontSize: 18, fontWeight: 'bold',paddingLeft: 10, color:'#454545'}}>{'Price: High to Low'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} 
                                onPress={()=> {
                                    setSortBtnChoice(2);
                                    setSortBtnFlag(false);
                                    handleSortClick(2);
                                }}
                            >
                                {
                                    sortBtnChoice==2
                                    ?   <View style={{alignItems: 'center', justifyContent:'center'}}>
                                            <View style={styles.bigCircle}></View>
                                            <View style={styles.smallCircle}></View>
                                        </View>
                                    :   <View style={{height: 20, width: 20, borderRadius: 30, borderWidth: 1, borderColor: 'grey'}}></View>
                                }
                                <Text style={{fontSize: 18, fontWeight: 'bold',paddingLeft: 10, color:'#454545'}}>{'Price: Low to High'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} 
                                onPress={()=> {
                                    setSortBtnChoice(3);
                                    setSortBtnFlag(false);
                                    handleSortClick(3);
                                }}
                            >
                                {
                                    sortBtnChoice==3
                                    ?   <View style={{alignItems: 'center', justifyContent:'center'}}>
                                            <View style={styles.bigCircle}></View>
                                            <View style={styles.smallCircle}></View>
                                        </View>
                                    :   <View style={{height: 20, width: 20, borderRadius: 30, borderWidth: 1, borderColor: 'grey'}}></View>
                                }
                                <Text style={{fontSize: 18, fontWeight: 'bold',paddingLeft: 10, color:'#454545'}}>{'Rating: High to Low'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} 
                                onPress={()=> {
                                    setSortBtnChoice(4);
                                    setSortBtnFlag(false);
                                    handleSortClick(4);
                                }}
                            >
                                {
                                    sortBtnChoice==4
                                    ?   <View style={{alignItems: 'center', justifyContent:'center'}}>
                                            <View style={styles.bigCircle}></View>
                                            <View style={styles.smallCircle}></View>
                                        </View>
                                    :   <View style={{height: 20, width: 20, borderRadius: 30, borderWidth: 1, borderColor: 'grey'}}></View>
                                }
                                <Text style={{fontSize: 18, fontWeight: 'bold',paddingLeft: 10, color:'#454545'}}>{'Rating: Low to High'}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    


                    <TouchableOpacity 
                        style={{
                            width: '30%', 
                            borderRadius: 25, 
                            borderWidth: 1, 
                            borderColor: '#C0C0C0', 
                            padding: 5,
                            flexDirection: 'row', 
                            justifyContent: 'center',
                            alignItems: 'center', 
                            backgroundColor: 'white'
                        }}
                        onPress={() => {setFilterBtnFlag(true)}}
                    >
                        <Image source={require('../assets/filter.png')} style={{height: 18, width: 18, marginRight: 5}}/>
                        <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>{'Filter'}</Text>
                    </TouchableOpacity>

                    <Modal 
                        isVisible={filterBtnFlag}
                        style={{
                            width: '100%',
                            marginLeft: 0,
                            marginBottom: 0,
                        }}
                        onBackButtonPress={()=>{setFilterBtnFlag(false)}}
                        onBackdropPress={()=>{setFilterBtnFlag(false)}}
                    >
                        <View 
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                left: 0,
                                height: '45%',
                                padding: 20,
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                backgroundColor: '#fff',
                                width: '100%',
                            }}
                        >
                            <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>{'Filter'}</Text>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} 
                                onPress={()=> {
                                    setFilterBtnChoice([0]);
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setCategory('');
                                }}
                            >
                                {
                                    filterBtnChoice.length==1 && filterBtnChoice[0]==0
                                    ?   <View style={{alignItems: 'center', justifyContent:'center'}}>
                                            <View style={styles.bigCircle}></View>
                                            <View style={styles.smallCircle}></View>
                                        </View>
                                    :   <View style={{height: 20, width: 20, borderRadius: 30, borderWidth: 1, borderColor: 'grey'}}></View>
                                }
                                <Text style={{fontSize: 18, fontWeight: 'bold',paddingLeft: 10, color:'#454545'}}>{'All Products'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{margin: 10}} 
                                onPress={()=> {
                                    if(filterBtnChoice.length == 1) {
                                        if(filterBtnChoice[0] == 0) {
                                            setFilterBtnChoice([1]);
                                        }
                                        else if(filterBtnChoice[0] == 1) {
                                            setFilterBtnChoice([0]);
                                        }
                                        else if(filterBtnChoice[0] == 2) {
                                            setFilterBtnChoice([1, 2]);
                                        }
                                    }
                                    else if(filterBtnChoice.length == 2) {
                                        setFilterBtnChoice([2]);
                                    }
                                }}
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    {
                                        (filterBtnChoice.length==2 && (filterBtnChoice[0]==1 || filterBtnChoice[1]==1)) || (filterBtnChoice.length==1 && filterBtnChoice[0]==1)
                                        ?   <View style={{alignItems: 'center', justifyContent:'center'}}>
                                                <View style={styles.bigCircle}></View>
                                                <View style={styles.smallCircle}></View>
                                            </View>
                                        :   <View style={{height: 20, width: 20, borderRadius: 30, borderWidth: 1, borderColor: 'grey'}}></View>
                                    }
                                    <Text style={{fontSize: 18, fontWeight: 'bold',paddingLeft: 10, color:'#454545'}}>{'Price Range'}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 25}}>
                                    <TextInput 
                                        style={{width: '35%', height: 40, borderWidth: 1, borderRadius: 10, textAlign: 'center', fontSize: 14, }}
                                        placeholder='Min. Price'
                                        keyboardType= 'number-pad'
                                        value={minPrice}
                                        onChangeText={text => setMinPrice(text)}
                                    >
                                    </TextInput>
                                    <View style={{borderBottomWidth: 2, width: '5%', marginHorizontal: 10, borderColor: '#454545', borderRadius: 15}}></View>
                                    <TextInput 
                                        style={{width: '35%', height: 40, borderWidth: 1, borderRadius: 10, textAlign: 'center', fontSize: 14, }}
                                        placeholder='Max. Price'
                                        keyboardType= 'number-pad'
                                        value={maxPrice}
                                        onChangeText={text => setMaxPrice(text)}
                                    >
                                    </TextInput>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ margin: 10, }} 
                                onPress={()=> {
                                    if(filterBtnChoice.length == 1) {
                                        if(filterBtnChoice[0] == 0) {
                                            setFilterBtnChoice([2]);
                                        }
                                        else if(filterBtnChoice[0] == 1) {
                                            setFilterBtnChoice([1, 2]);
                                        }
                                        else if(filterBtnChoice[0] == 2) {
                                            setFilterBtnChoice([0]);
                                        }
                                    }
                                    else if(filterBtnChoice.length == 2) {
                                        setFilterBtnChoice([1]);
                                    }
                                }}
                            >
                                <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                    {
                                        (filterBtnChoice.length==2 && (filterBtnChoice[0]==2 || filterBtnChoice[1]==2)) || (filterBtnChoice.length==1 && filterBtnChoice[0]==2)
                                        ?   <View style={{alignItems: 'center', justifyContent:'center'}}>
                                                <View style={styles.bigCircle}></View>
                                                <View style={styles.smallCircle}></View>
                                            </View>
                                        :   <View style={{height: 20, width: 20, borderRadius: 30, borderWidth: 1, borderColor: 'grey'}}></View>
                                    }
                                    <Text style={{fontSize: 18, fontWeight: 'bold',paddingLeft: 10, color:'#454545'}}>{'Category'}</Text>
                                </View>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        style={styles.picker}
                                        selectedValue={category}
                                        onValueChange={itemValue => setCategory(itemValue)}
                                    >
                                        <Picker.Item label="Select Category" value=""/>
                                        {
                                            categories.map(categ => (
                                                <Picker.Item key={categ} label={categ} value={categ}/>
                                            ))
                                        }
                                    </Picker>
                                </View>
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 20}}>
                                <TouchableOpacity 
                                    style={{width: '30%', alignItems: 'center', backgroundColor: '#E52B50', justifyContent: 'center', padding: 10, borderRadius: 15}}
                                    onPress={() => {
                                        setFilterBtnFlag(false);
                                        handleFilterClick();
                                    }}
                                >
                                    <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold'}}>{'Apply'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>

                <FlatList
                    keyExtractor = {(item, index) => index}
                    data={filteredProductsList}
                    renderItem={({item, index})=>{
                        return (
                            <MenuItem key={index} item={item} navigation={navigation}/>
                            )
                        }}
                        />
            </View>
        </SafeAreaView>
    )
}

export default ProductsScreen

const styles = StyleSheet.create({
    bigCircle: {
        height: 20, 
        width: 20, 
        borderRadius: 30, 
        backgroundColor: '#E52B50'
    },
    smallCircle: {
        height: 8, 
        width: 8, 
        borderRadius: 15, 
        backgroundColor: 'white', 
        position:'absolute'
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        marginTop: 10,
        // borderColor: '#E5e4e2',
        borderWidth: 1,
        borderRadius: 10,
        width: '80%',
        marginLeft: 20,
        // fontWeight: 'bold',
        // backgroundColor: '#E5e4e2',
    },
      picker: {
        flex: 1,
    },
})