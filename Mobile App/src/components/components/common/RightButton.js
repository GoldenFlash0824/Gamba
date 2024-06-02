import React, {useState, useEffect, useRef} from 'react'
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

const RightButton = ({onPress}) => {
    return (
        <TouchableOpacity style={styles.crossIconContainer} onPress={() => onPress()}>
            <FastImage source={require('../../assets/icons/screens/cross.png')} resizeMode="contain" style={styles.crossIcon} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    crossIconContainer: {
        width: wp('7%'),
        height: hp('3.5%'),
        borderRadius: wp('3.5%'),
        overflow: 'hidden',
        marginRight: wp('.8%')
    },
    crossIcon: {
        width: '100%',
        height: '100%'
    }
})

export default RightButton
