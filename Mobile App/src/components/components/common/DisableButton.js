import React from 'react'
import {Text, View, StyleSheet} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const DisableButton = ({title, style}) => {
    return (
        <View style={{...styles.buttonDisable, ...style}}>
            <Text style={styles.buttontext}>{title}</Text>
        </View>
    )
}

export default DisableButton

const styles = StyleSheet.create({
    buttonDisable: {
        backgroundColor: Colors.MainThemeColor,
        width: wp('86%'),
        height: hp('6%'),

        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('8')
    },
    buttontext: {
        fontSize: Typography.FONT_SIZE_18,
        color: Colors.BorderGrey,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})
