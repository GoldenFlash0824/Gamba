import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import FastImage from 'react-native-fast-image'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const TabView = ({title, selected = true, onPress, style, iconStyle, source}) => {
    return (
        <TouchableOpacity style={selected ? {...styles.buttonSelected} : {...styles.button}} activeOpacity={0.8} onPress={onPress}>
            <FastImage source={source} style={[styles.iconsStyle, iconStyle]} tintColor={selected ? Colors.MainThemeColor : Colors.Black} />
            {title && <Text style={selected ? styles.buttonTextSelected : styles.buttonText}>{title}</Text>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: hp('1'),
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    buttonSelected: {
        paddingVertical: hp('1'),
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    buttonTextSelected: {
        alignSelf: 'center',
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingTop: hp(0.5)
    },
    buttonText: {
        alignSelf: 'center',
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingTop: hp(0.5)
    },
    iconsStyle: {
        height: wp('8%'),
        width: wp('8%')
    }
})

export default TabView
