import FastImage from 'react-native-fast-image'
import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
const InputWithLabels = ({showLabelCB, placeholder, onChangeText, onBlur, icon, onFocus, value, isError, isFocus, errorText, editable, onPress, keyboardType, minHeight, maxHeight, numberOfLines, multiline, returnKeyType, maxLength, minLength, autoCapitalize = 'none', normal = false, type = false, style, placeholderC, inputStyles, clearIcon, showPlaceHolder = false, textError, lableStyle, placeholderInner, showAstaric = false, leftIcon}) => {
    const [showLabel, setShowLabel] = useState(false)
    useEffect(() => {
        setShowLabel(showLabelCB)
    }, [showLabelCB])
    const [visible, setVisible] = useState(true)
    const CheckVisible = () => {
        setVisible(!visible)
    }
    if (!icon) {
        return (
            <View>
                <View style={styles.labelContainer}>
                    {showLabel && <Text style={placeholderC ? [styles.labelNormal, lableStyle] : [styles.label, lableStyle]}>{placeholderC ? placeholderC : placeholder.toUpperCase()}</Text>}
                    {showAstaric && <Text style={styles.staricLable}>{'*'}</Text>}
                </View>
                <View style={[styles.inputContainer, style]}>
                    <TextInput autoCapitalize={autoCapitalize} placeholderTextColor={Colors.placeholderTextColor} style={isFocus === true ? (normal ? [styles.focusNormalStyle, style] : [styles.focusStyle, style]) : isError === true ? [styles.errorStyle, style] : [styles.normalStyle, style]} placeholder={showPlaceHolder ? (placeholderInner ? placeholderInner : placeholderC ? placeholderC : placeholder) : ''} value={value} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} editable={editable} keyboardType={keyboardType ? keyboardType : 'default'} returnKeyType="done" minHeight={minHeight} maxHeight={maxHeight} numberOfLines={numberOfLines} multiline={multiline} minLength={minLength ? minLength : null} maxLength={maxLength ? maxLength : null} secureTextEntry={type} />
                    <Text style={[styles.errorText, textError]}>{errorText}</Text>
                </View>
            </View>
        )
    }
    return (
        <View>
            <View style={styles.labelContainerIcon}>
                {showLabel && <Text style={placeholderC ? [styles.labelNormal, lableStyle] : [styles.label, lableStyle]}>{placeholderC ? placeholderC : placeholder.toUpperCase()}</Text>}
                {showAstaric && <Text style={styles.staricLable}>{'*'}</Text>}
            </View>
            <View style={isFocus === true ? [styles.focusStyleIcon, style] : isError === true ? [styles.errorStyleIcon, style] : [styles.normalStyleIcon, style]}>
                <View style={styles.inputContainerIcon}>
                    {leftIcon && (
                        <TouchableOpacity style={leftIcon ? styles.iconViewL : styles.iconView} onPress={onPress}>
                            <FastImage source={require('../../../assets/icons/screens/search.png')} resizeMode="contain" style={styles.iconStyle} />
                        </TouchableOpacity>
                    )}
                    <TextInput style={[styles.inputStylesIcon, inputStyles]} autoCapitalize={autoCapitalize} placeholderTextColor={Colors.placeholderTextColor} returnKeyType="done" underlineColorAndroid="transparent" placeholder={showPlaceHolder ? (placeholderInner ? placeholderInner : placeholderC ? placeholderC : placeholder) : ''} value={value} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} editable={editable} minHeight={minHeight} maxHeight={maxHeight} numberOfLines={numberOfLines} multiline={multiline} secureTextEntry={clearIcon ? false : visible} />
                    {!type ? (
                        <TouchableOpacity style={clearIcon ? styles.iconViewC : styles.iconView} onPress={onPress}>
                            {clearIcon ? <FastImage source={require('../../../assets/icons/screens/search.png')} resizeMode="contain" style={styles.iconStyle} /> : <FastImage source={require('../../../assets/icons/screens/search.png')} resizeMode="contain" style={styles.iconStyle} />}
                        </TouchableOpacity>
                    ) : (
                        !clearIcon && (
                            <TouchableOpacity style={styles.iconView} onPress={() => CheckVisible()} activeOpacity={0.8}>
                                {visible ? <FastImage source={require('../../../assets/icons/screens/eye_closed.png')} resizeMode="contain" style={styles.iconStyle} /> : <FastImage source={require('../../../assets/icons/screens/eye_open.png')} resizeMode="contain" style={styles.iconStyle} />}
                            </TouchableOpacity>
                        )
                    )}
                </View>
            </View>
            {errorText && <Text style={clearIcon ? styles.errorTextIconC : styles.errorTextIcon}>{errorText}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    labelContainer: {
        backgroundColor: Colors.White,
        alignSelf: 'flex-start',
        marginStart: 0,
        flexDirection: 'row'
    },
    labelContainerIcon: {
        backgroundColor: Colors.White,
        alignSelf: 'flex-start',
        marginStart: 0,
        flexDirection: 'row'
    },
    staricLable: {
        color: Colors.RedColor,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    labelNormal: {
        color: Colors.Black,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    label: {
        color: Colors.Black,
        textTransform: 'capitalize',
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    inputContainer: {
        zIndex: 0,
        marginTop: hp('.5')
    },
    normalStyle: {
        width: wp('86%'),
        height: hp('6%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.SearchBG,
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        borderRadius: wp('8%')
    },
    focusStyle: {
        width: wp('86%'),
        height: hp('6%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.White,
        borderColor: Colors.MainThemeColor,
        borderWidth: wp('0.5'),
        borderRadius: wp('8%')
    },
    focusNormalStyle: {
        width: wp('86%'),
        height: hp('6%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.White,
        borderColor: Colors.LightGreen,
        borderWidth: wp('0.5'),
        borderRadius: wp('8%')
    },
    errorStyle: {
        width: wp('86%'),
        height: hp('6%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.LightCream_20,
        borderColor: Colors.ErrorBorder,
        borderWidth: wp('0.5'),
        borderRadius: wp('8%')
    },
    errorText: {
        fontSize: Typography.FONT_SIZE_11,
        width: wp('86%'),
        paddingLeft: wp('3%'),
        // paddingBottom: wp('2%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText,
        marginRight: 0
    },
    inputContainerIcon: {
        flexDirection: 'row',
        zIndex: 0
    },
    iconView: {
        width: wp('6%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconViewL: {
        width: wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: wp('4%')
    },
    iconViewC: {
        width: wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: wp('10%')
    },
    iconStyle: {
        width: wp('6%'),
        height: hp('6%')
    },
    inputStylesIcon: {
        width: wp('77%'),
        paddingLeft: wp('3%'),
        // height: hp('7%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        borderRadius: wp('8%')
    },
    focusStyleIconInput: {
        width: wp('77%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        borderRadius: wp('8%')
    },
    normalStyleIcon: {
        width: wp('86%'),
        height: hp('6%'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        backgroundColor: Colors.SearchBG,
        borderWidth: wp(0.3),
        borderRadius: wp('8%'),
        marginTop: hp('.5')
    },

    focusStyleIcon: {
        width: wp('86%'),
        height: hp('6%'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.White,
        borderColor: Colors.MainThemeColor,
        borderWidth: wp(0.5),
        borderRadius: wp('8%'),
        marginTop: hp('.5')
    },
    errorStyleIcon: {
        width: wp('86%'),
        height: hp('6%'),

        flexDirection: 'row',
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_11,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.LightCream_20,
        borderColor: Colors.ErrorBorder,
        borderWidth: wp(0.5),
        borderRadius: wp('8%'),
        marginTop: hp('.5')
    },
    errorTextIcon: {
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        width: wp('86%'),
        paddingLeft: wp('3%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText
        // marginRight: 0,
        // marginBottom: wp('0.5%')
    },
    errorTextIconC: {
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        width: wp('84%'),
        paddingLeft: wp('3%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText
        // marginBottom: wp('0.5%')
    }
})

export default InputWithLabels
