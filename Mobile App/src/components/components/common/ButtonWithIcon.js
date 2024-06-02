import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const ButtonWithIcon = ({onPress, title, style, image, showTitle = true}) => {
    return (
        <TouchableOpacity style={!showTitle ? {...styles.buttonIcon, ...style} : {...styles.buttonEnable, ...style}} activeOpacity={0.8} onPress={onPress}>
            <FastImage source={image} style={styles.icon} />
            {showTitle && <Text style={styles.buttontext}>{title}</Text>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonIcon: {
        backgroundColor: Colors.White,
        width: wp('10%'),
        height: wp('10%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('4%'),
        borderWidth: wp('.3'),
        borderColor: Colors.GrayLight
    },
    buttonEnable: {
        backgroundColor: Colors.White,
        width: wp('92%'),
        height: hp('7%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('4%'),
        borderWidth: wp('.3'),
        borderColor: Colors.GrayLight
    },
    buttontext: {
        paddingLeft: wp('2%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    icon: {
        width: wp('5%'),
        height: wp('5%')
    }
})
export default ButtonWithIcon
