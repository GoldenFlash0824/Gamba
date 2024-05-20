import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import FastImage from 'react-native-fast-image'
import React from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

const Input = ({rightImagePress, imageLeft, secure, image, placeholder, value, imageRight, onChangeText, autoCapitalize, onBlur, autoFocus, onFocus, isFocus, isError, errorText, keyboardType, maxLength, editable = true, flag = false, style}) => {
    return (
        <>
            <View style={styles.inputWrapper}>
                {image && <FastImage source={image} resizeMode="contain" style={styles.iconStyle} tintColor={value?.length > 0 && isFocus ? Colors.Black : value?.length > 0 ? Colors.Black : Colors.DarkPepper_20} />}
                <TextInput returnKeyType="done" underlineColorAndroid="transparent" placeholder={placeholder} style={isFocus === true ? {...styles.focusStyle, ...style} : isError === true ? {...styles.errorStyle, ...style} : {...styles.normalStyle, ...style}} value={value} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} maxLength={maxLength} keyboardType={keyboardType} autoCorrect={false} autoCapitalize={'none'} autoFocus={autoFocus} placeholderTextColor={Colors.DarkPepper_20} editable={editable} />
                <TouchableOpacity style={styles.iconRightOuter} onPress={rightImagePress}>
                    {imageRight && <FastImage source={imageRight} resizeMode="contain" style={styles.iconRight} tintColor={value?.length > 0 && isFocus ? Colors.Black : value?.length > 0 ? Colors.Black : Colors.DarkPepper_20} />}
                </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>{errorText}</Text>
        </>
    )
}

const styles = StyleSheet.create({
    inputWrapper: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    normalStyle: {
        width: wp('92%'),
        height: hp('7%'),
        paddingLeft: wp('9%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.SearchBackgorund,
        borderColor: Colors.SearchBackgorund,
        borderWidth: wp('.3%'),
        borderRadius: wp('4%'),
        paddingRight: wp('4%')
    },
    focusStyle: {
        width: wp('92%'),
        height: hp('7%'),
        paddingLeft: wp('9%'),
        color: Colors.DarkPepper_60,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        backgroundColor: Colors.SearchBackgorund,
        borderColor: Colors.BorderColor,
        borderWidth: wp('.3%'),
        borderRadius: wp('4%'),
        paddingRight: wp('4%')
    },
    errorStyle: {
        width: wp('92%'),
        height: hp('7%'),
        paddingLeft: wp('9%'),
        color: Colors.DarkPepper_60,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        backgroundColor: Colors.SearchBackgorund,
        borderColor: Colors.ErrorBorder,
        borderWidth: wp('.3%'),
        borderRadius: wp('4%'),
        paddingRight: wp('4%')
    },
    errorText: {
        fontSize: Typography.FONT_SIZE_12,
        width: wp('92%'),
        paddingLeft: wp('4%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText,
        marginRight: 0,
        marginTop: wp('0.5%'),
        marginBottom: wp('0.5%')
    },
    iconStyle: {
        width: wp('5%'),
        height: wp('5%'),
        position: 'absolute',
        zIndex: 1,
        left: wp('2%')
    },
    iconRight: {
        width: wp('5%'),
        height: wp('5%'),
        position: 'absolute',
        zIndex: 1
        // right: wp('2%')
    },
    iconRightOuter: {
        height: wp('5%'),
        width: wp('5%'),
        position: 'absolute',
        // backgroundColor: 'red',
        zIndex: 1,
        right: wp('2%')
    }
})

export default Input
