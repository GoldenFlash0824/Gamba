import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const MenuOption = ({item, onPress, style, textStyle}) => {
    return (
        <TouchableOpacity style={[styles.menuContainer, style]} onPress={onPress}>
            <View style={item?.title == 'My Account' ? styles.profileImagesC : styles.image} activeOpacity={0.8}>
                <FastImage resizeMode="cover" style={item?.title == 'My Account' ? styles.profileImages : styles.image} source={item?.image} />
            </View>
            <View style={item?.title == 'My Account' ? styles.textLineAccount : styles.textLine}>
                <Text style={[styles.text, textStyle]}>{item?.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    menuContainer: {
        width: wp('92%'),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('2'),
        paddingLeft: wp('4%')
    },

    image: {
        width: wp('6%'),
        height: wp('6%')
    },

    textLine: {
        width: wp('80%'),
        justifyContent: 'center',
        marginLeft: wp('2')
    },
    textLineAccount: {
        width: wp('80%'),
        justifyContent: 'center'
    },
    text: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.LightGrayColor
    },
    profileImagesC: {
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: wp('4.5%'),
        right: wp('2%')
    },
    profileImages: {
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: wp('4.5%')
    }
})

export default MenuOption
