import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import FastImage from 'react-native-fast-image'
import React, {useEffect, useState} from 'react'
import {Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

const SmallInputWithLabels = ({showLabelCB, placeholder, onChangeText, onBlur, icon, onFocus, value, isError, isFocus, errorText, editable, onPress, keyboardType, minHeight, maxHeight, numberOfLines, multiline, returnKeyType, maxLength, minLength, autoCapitalize = 'none', normal = false, type = false, style, placeholderC, inputStyles, clearIcon, showPlaceHolder = false, textError}) => {
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
                    {showLabel && <Text style={placeholderC ? styles.labelNormal : styles.label}>{placeholderC ? placeholderC : placeholder.toUpperCase()}</Text>}
                    {showLabel && <Text style={styles.staricLable}>{'*'}</Text>}
                </View>
                <View style={[styles.inputContainer, style]}>
                    <TextInput autoCapitalize={autoCapitalize} placeholderTextColor={Colors.Description} style={isFocus === true ? (normal ? [styles.focusNormalStyle, style] : [styles.focusStyle, style]) : isError === true ? [styles.errorStyle, style] : [styles.normalStyle, style]} placeholder={showPlaceHolder ? (placeholderC ? placeholderC : placeholder) : ''} value={value} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} editable={editable} keyboardType={keyboardType ? keyboardType : 'default'} returnKeyType="done" minHeight={minHeight} maxHeight={maxHeight} numberOfLines={numberOfLines} multiline={multiline} minLength={minLength ? minLength : null} maxLength={maxLength ? maxLength : null} secureTextEntry={type} />
                    <Text style={[styles.errorText, textError]}>{errorText}</Text>
                </View>
            </View>
        )
    }
    return (
        <View style={{...{marginTop: clearIcon ? hp('0') : hp('0')}, ...style}}>
            <View style={isFocus === true ? [styles.focusStyleIcon, style] : isError === true ? [styles.errorStyleIcon, style] : [styles.normalStyleIcon, style]}>
                <View style={styles.labelContainerIcon}>
                    {showLabel && <Text style={placeholderC ? styles.labelNormal : styles.label}>{placeholderC ? placeholderC : placeholder.toUpperCase()}</Text>}
                    {showLabel && <Text style={styles.staricLable}>{'*'}</Text>}
                </View>
                <View style={styles.inputContainerIcon}>
                    <TextInput style={[styles.inputStylesIcon, inputStyles]} autoCapitalize={autoCapitalize} placeholderTextColor={Colors.Description} returnKeyType="done" underlineColorAndroid="transparent" placeholder={showPlaceHolder ? (placeholderC ? placeholderC : placeholder) : ''} value={value} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} minHeight={minHeight} maxHeight={maxHeight} numberOfLines={numberOfLines} multiline={multiline} editable={editable} secureTextEntry={clearIcon ? false : visible} />
                    {!type ? (
                        <TouchableOpacity style={clearIcon ? styles.iconViewC : styles.iconView} onPress={onPress}>
                            {clearIcon ? <FastImage source={require('../../../assets/icons/screens/percentage.png')} resizeMode="contain" style={styles.iconStyle} /> : <FastImage source={require('../../../assets/icons/screens/search.png')} resizeMode="contain" style={styles.iconStyle} />}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.iconView} onPress={() => CheckVisible()} activeOpacity={0.8}>
                            {visible ? <FastImage source={require('../../../assets/icons/screens/visible.png')} resizeMode="contain" style={styles.iconStyle} /> : <FastImage source={require('../../../assets/icons/screens/invisible.png')} resizeMode="contain" style={styles.iconStyle} />}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <Text style={clearIcon ? styles.errorTextIconC : styles.errorTextIcon}>{errorText}</Text>
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
    staricLable: {
        color: Colors.RedColor,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    labelContainerIcon: {
        backgroundColor: Colors.White,
        marginStart: 0,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: 3,
        zIndex: 1,
        elevation: 0,
        shadowColor: 'white',
        position: 'absolute',
        top: -19
    },
    labelNormal: {
        color: Colors.Black,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    label: {
        color: Colors.Black,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        textTransform: 'capitalize'
    },
    inputContainer: {
        zIndex: 0
    },
    normalStyle: {
        width: wp('41%'),
        height: hp('7%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        marginTop: wp('2%'),
        borderRadius: wp('2%')
    },
    focusStyle: {
        width: wp('41%'),
        height: hp('7%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.White,
        borderColor: Colors.LightGreen,
        borderWidth: wp('0.5'),
        marginTop: wp('2%'),
        borderRadius: wp('2%')
    },
    focusNormalStyle: {
        width: wp('25%'),
        height: hp('5%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.White,
        borderColor: Colors.LightGreen,
        borderWidth: wp('0.5'),
        borderRadius: wp('2%'),
        marginTop: wp('2%')
    },
    errorStyle: {
        width: wp('25%'),
        height: hp('5%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.LightCream_20,
        borderColor: Colors.ErrorBorder,
        borderWidth: wp('0.5'),
        borderRadius: wp('2%'),
        marginTop: wp('2%')
    },
    errorText: {
        fontSize: Typography.FONT_SIZE_11,
        width: wp('25%'),
        paddingLeft: wp('3%'),
        paddingBottom: wp('2%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText,
        marginRight: 0,
        marginTop: wp('0%'),
        marginBottom: wp('0%')
    },
    inputContainerIcon: {
        flexDirection: 'row',
        zIndex: 0
    },
    iconView: {
        width: wp('14%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconViewC: {
        width: wp('14%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        width: wp('5%'),
        height: hp('6%')
    },
    inputStylesIcon: {
        width: wp('28%'),
        paddingLeft: wp('3%'),
        height: hp('7%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    focusStyleIconInput: {
        width: wp('38%'),
        paddingLeft: wp('3%'),
        height: hp('6%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    normalStyleIcon: {
        width: wp('25%'),
        height: hp('7%'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        marginTop: wp('2%')
    },

    focusStyleIcon: {
        width: wp('25%'),
        height: hp('7%'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        backgroundColor: Colors.White,
        borderColor: Colors.LightGreen,
        borderWidth: wp(0.5),
        borderRadius: wp(2),
        marginTop: wp('2%')
    },
    errorStyleIcon: {
        width: wp('25%'),
        height: hp('7%'),
        // paddingLeft: wp('2%'),
        flexDirection: 'row',
        // justifyContent: 'center',
        color: Colors.SearchableText,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        backgroundColor: Colors.LightCream_20,
        borderColor: Colors.ErrorBorder,
        borderWidth: wp(0.5),
        borderRadius: wp(2),
        marginTop: wp('3%')
    },
    errorTextIcon: {
        fontSize: Typography.FONT_SIZE_12,
        width: wp('25%'),
        paddingLeft: wp('3%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText,
        marginRight: 0,
        marginTop: wp('0.5%'),
        marginBottom: wp('0.5%')
    },
    errorTextIconC: {
        fontSize: Typography.FONT_SIZE_12,
        width: wp('84%'),
        paddingLeft: wp('3%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText,
        marginRight: 0,
        marginTop: wp('0.5%'),
        marginBottom: wp('0.5%')
    }
})

export default SmallInputWithLabels
