import React, {useState} from 'react'
import {StyleSheet, TextInput, View, Text, TouchableOpacity} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const PasswordInput = ({placeholder, value, onChangeText, onBlur, autoFocus, onFocus, isFocus, isError, errorText}) => {
    const [visible, setVisible] = useState(true)

    const CheckVisible = () => setVisible(!visible)

    return (
        <>
            <View style={isFocus === true ? styles.focusStyle : isError === true ? styles.errorStyle : styles.normalStyle}>
                <FastImage source={require('../../../assets/icons/screens/password.png')} resizeMode="contain" style={styles.iconStyle} tintColor={value.length > 0 && isFocus ? Colors.Black : value.length > 0 ? Colors.Black : Colors.DarkPepper_20} />
                <TextInput returnKeyType="done" underlineColorAndroid="transparent" secureTextEntry={visible} placeholder={placeholder} style={isFocus === true ? styles.inputViewFocus : isError === true ? styles.inputErrorView : styles.inputView} value={value} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} autoCorrect={false} autoFocus={autoFocus} placeholderTextColor={Colors.DarkPepper_20} />
                <TouchableOpacity style={styles.iconView} onPress={() => CheckVisible()} activeOpacity={0.8}>
                    {visible ? <FastImage source={require('../../../assets/icons/screens/visible.png')} resizeMode="contain" style={styles.eyeIcon} tintColor={value.length > 0 && isFocus ? Colors.Black : value.length > 0 ? Colors.Black : Colors.DarkPepper_20} /> : <FastImage source={require('../../../assets/icons/screens/invisible.png')} resizeMode="contain" style={styles.eyeIcon} tintColor={value.length > 0 && isFocus ? Colors.Purple : value.length > 0 ? Colors.Black : Colors.DarkPepper_20} />}
                </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>{errorText}</Text>
        </>
    )
}

const styles = StyleSheet.create({
    normalStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('92%'),
        height: hp('7%'),
        backgroundColor: Colors.SearchBackgorund,
        borderColor: Colors.SearchBackgorund,
        borderWidth: wp('.3%'),
        borderRadius: wp('4%')
    },
    errorStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('92%'),
        height: hp('7%'),
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        borderColor: Colors.ErrorBorder,
        backgroundColor: Colors.SearchBackgorund,
        borderWidth: wp('.3%'),
        borderRadius: wp('4%')
    },
    focusStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('92%'),
        height: hp('7%'),
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.SearchBackgorund,
        borderColor: Colors.BorderColor,
        borderWidth: wp('.3%'),
        borderRadius: wp('4%')
    },
    inputView: {
        width: wp('73%'),
        height: hp('6%'),
        paddingLeft: wp('4%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        borderRadius: wp('4%')
    },
    inputViewFocus: {
        width: wp('73%'),
        height: hp('6%'),
        paddingLeft: wp('4%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        borderRadius: wp('4%')
    },
    inputErrorView: {
        width: wp('73%'),
        height: hp('6.5%'),
        paddingLeft: wp('4%'),
        color: Colors.DarkPepper_20,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD,

        borderRadius: wp('4%')
    },
    iconView: {
        width: wp('14%'),
        height: hp('7%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        fontSize: Typography.FONT_SIZE_12,
        paddingLeft: wp('4%'),
        width: wp('92%'),
        color: Colors.ErrorText,
        marginRight: 0,
        marginTop: wp('0.5%'),
        marginBottom: wp('0.5%')
    },
    eyeIcon: {
        width: wp('5%'),
        height: hp('5%')
    },
    iconStyle: {
        width: wp('5%'),
        height: wp('5%'),
        zIndex: 1,
        left: wp('2%')
    }
})

export default PasswordInput
