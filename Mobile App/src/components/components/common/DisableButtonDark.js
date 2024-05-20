import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const DisableButtonDark = ({title, style}) => {
    return (
        <TouchableOpacity style={{...styles.buttonEnable, ...style}} activeOpacity={1}>
            <Text style={styles.buttontext}>{title}</Text>
        </TouchableOpacity>
    )
}

export default DisableButtonDark

const styles = StyleSheet.create({
    buttonEnable: {
        backgroundColor: Colors.DisableBtColor,
        width: wp('86%'),
        height: hp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('8%')
    },
    buttontext: {
        color: Colors.GrayLight,
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})
