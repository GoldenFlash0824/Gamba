import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import FastImage from 'react-native-fast-image'
import React, {useState} from 'react'
import ToggleSwitch from 'toggle-switch-react-native'
import {Platform, StyleSheet, Text, View} from 'react-native'

import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

const ToggelButton = ({text, handleToggle, isOn, trade = false, style = false}) => {
    return (
        <View style={[trade ? styles.tradeContainerStyle : styles.container, style]}>
            <Text style={styles.title}>{text}</Text>
            <ToggleSwitch isOn={isOn} onColor={Colors.MainThemeColor} offColor={Colors.GrayLight} size="small" onToggle={handleToggle} thumbOffStyle={{backgroundColor: Colors.White}} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: hp('1'),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        height: hp('8%'),
        width: wp('86%'),
        borderWidth: wp('.2'),
        borderColor: Colors.BorderGrey,
        justifyContent: 'space-between',
        paddingHorizontal: wp('2'),
        alignItems: 'center',
        borderRadius: wp(4),
        zIndex: -1
    },
    tradeContainerStyle: {
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('86%'),
        height: hp('6')
    },
    title: {
        maxWidth: wp('78%'),
        fontSize: Platform.OS == 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        color: Colors.Black
    }
})

export default ToggelButton
