import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import React, {useState} from 'react'
import SearchBar from 'react-native-dynamic-search-bar'
import {StyleSheet, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

const SearchBarComponent = (props) => {
    return (
        <View style={styles.body}>
            <SearchBar placeholder="Search Products" onPress={() => alert('onPress')} onChangeText={(text) => console.log(text)} placeholderTextColor={'black'} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.White
    }
})

export default SearchBarComponent
