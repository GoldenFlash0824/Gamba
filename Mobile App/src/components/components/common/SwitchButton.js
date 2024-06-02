import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const SwitchButton = ({defaultSelected, toggleSwitch, swicthSelected, switchToggle, defaultSelectedText, swicthSelectedText, style}) => {
    return (
        <View style={styles.buttonsContainer}>
            <View style={{...styles.buttonWraper, style}}>
                <TouchableOpacity style={defaultSelected ? {...styles.buttonSelected} : {...styles.button}} activeOpacity={0.8} onPress={() => toggleSwitch()}>
                    <Text style={swicthSelected ? styles.buttonText : styles.buttonTextSelected}>{defaultSelectedText}</Text>
                </TouchableOpacity>
            </View>

            <View style={{...styles.buttonWraper}}>
                <TouchableOpacity style={swicthSelected ? {...styles.buttonSelected} : {...styles.button}} activeOpacity={0.8} onPress={() => switchToggle()}>
                    <Text style={defaultSelected ? styles.buttonText : styles.buttonTextSelected}>{swicthSelectedText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        height: hp('8%'),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    buttonWraper: {
        width: wp('45%'),
        height: hp('6%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: wp('42%'),
        height: hp('6%'),
        backgroundColor: Colors.GrayLight,
        justifyContent: 'center',
        borderRadius: wp('2%')
    },
    buttonSelected: {
        width: wp('42%'),
        height: hp('6%'),
        backgroundColor: Colors.LimeGreen,
        justifyContent: 'center',
        borderRadius: wp('2%')
    },
    buttonTextSelected: {
        alignSelf: 'center',
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    buttonText: {
        alignSelf: 'center',
        color: Colors.DarkPepper_40,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default SwitchButton
