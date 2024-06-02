import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const RadioButton = ({selected, text, onSelect}) => {
    return (
        <View style={styles.radioButtonWrapper}>
            <TouchableOpacity
                style={selected ? styles.radioButtonS : styles.radioButton}
                onPress={() => {
                    onSelect()
                }}>
                {selected && <View style={styles.filledRadioButton}></View>}
            </TouchableOpacity>
            <Text style={styles.bookingText}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    radioButtonWrapper: {
        width: wp('92%'),
        height: hp('3%'),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%')
    },
    radioButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('4.6%'),
        height: wp('4.6%'),
        borderColor: Colors.LightGrayColor,
        borderWidth: wp('.3%'),
        borderRadius: wp('2.3%')
    },
    radioButtonS: {
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('4.6%'),
        height: wp('4.6%'),
        borderColor: Colors.HTextColor,
        borderWidth: wp('.3%'),
        borderRadius: wp('2.3%')
    },
    filledRadioButton: {
        width: wp('3%'),
        height: wp('3%'),
        borderColor: Colors.HTextColor,
        backgroundColor: Colors.HTextColor,
        borderRadius: wp('1.5%')
    },
    bookingText: {
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        color: Colors.LightGrayColor,
        marginLeft: hp('1%')
    }
})

export default RadioButton
