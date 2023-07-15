import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const OfferList = ({title, Secondtitle}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleStyle}>
        <TouchableOpacity>
          <Text style={styles.titleTextStyle}>{title}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleStyle}>
        <TouchableOpacity>
          <Text style={styles.titleTextStyle}>{Secondtitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OfferList;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 10,
    gap: 4,
  },
  titleStyle: {
    padding: 7,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  titleTextStyle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#cb202d',
  },
});
