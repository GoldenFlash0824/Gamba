import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const ActiveButton = ({onPress, title, style, textStyle}) => {
    return (
        <TouchableOpacity style={{...styles.buttonEnable, ...style}} activeOpacity={0.8} onPress={onPress}>
            <Text style={{...styles.buttontext, ...textStyle}}>{title}</Text>
        </TouchableOpacity>
    )
}

export default ActiveButton

const styles = StyleSheet.create({
    buttonEnable: {
        backgroundColor: Colors.MainThemeColor,
        width: wp('86%'),
        height: hp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('8%'),
        shadowColor: Colors.White,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.0,
        shadowRadius: 10,
        elevation: 10
    },
    buttontext: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_FAMILY_BOLD
    }
})
