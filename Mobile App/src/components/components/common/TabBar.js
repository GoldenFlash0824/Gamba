import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import {useSelector} from 'react-redux'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const TabBar = ({focused, icon, label, tintColorInactive, tintColor, change = false, cart}) => {
    const {cartData} = useSelector((state) => state.user)
    return <>{focused ? <FastImage source={icon} altresizeMode="contain" tintColor={tintColor} style={change ? styles.activeIconC : styles.activeIcon} /> : cart ? <FastImage source={cartData.length > 0 ? require('../../../assets/icons/bottomtab/cart_b.png') : require('../../../assets/icons/bottomtab/cart.png')} altresizeMode="contain" style={change ? styles.activeIconC : styles.activeIcon} /> : <FastImage source={icon} altresizeMode="contain" tintColor={tintColorInactive} style={change ? styles.activeIconC : styles.activeIcon} />}</>
}

const styles = StyleSheet.create({
    titleIconContainer: {
        backgroundColor: Colors.LimeGreen,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: wp('8'),
        paddingHorizontal: wp('2'),
        paddingVertical: hp('1'),
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 10,
        shadowRadius: hp(2)
    },
    label: {
        fontSize: Typography.FONT_SIZE_11,
        color: Colors.White,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingLeft: wp('1')
    },
    activeIcon: {
        width: wp('7%'),
        height: wp('7%')
    },

    activeIconC: {
        width: wp('8%') * 0.89,
        height: wp('8%')
    }
})

export default TabBar
