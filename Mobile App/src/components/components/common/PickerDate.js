import React from 'react'
import {TouchableOpacity, Text, StyleSheet, View, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import DatePicker from 'react-native-date-picker'
import FastImage from 'react-native-fast-image'
import moment from 'moment'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const PickerDate = ({mode = 'datetime', showText = true, bodyStyle, modeDate = false, showSteric = false, errorText, fromDate, onPress, styleErrorText, open, selectedDate, handleDateChange, onCancel, style, stylePicker, minimumDate, showCheck, onSelect, selected, icon}) => {
    return (
        <View style={[styles.body, bodyStyle]}>
            <View style={styles.titleWithSteric}>
                <Text style={styles.pickFromTo}>{fromDate}</Text>
                {showSteric ? <Text style={styles.staricLable}>{'*'}</Text> : null}
                {showCheck && (
                    <View style={styles.rememberContainer}>
                        <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
                            {selected ? <FastImage source={require('../../../assets/icons/screens/checked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../../assets/icons/screens/unchecked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.LightGrayColor} />}
                        </TouchableOpacity>
                        <Text style={styles.pickUpText}>Unlimited</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity style={[styles.pickDateImage, style]} onPress={onPress}>
                <Text style={[styles.pickOption, stylePicker]}> {showText ? (modeDate ? moment(selectedDate).format('MM/DD/YY') : moment(selectedDate).format('MM/DD/YY, hh:mm A')) : ' '}</Text>
                <FastImage source={icon ? require('../../../assets/icons/screens/future_post.png') : require('../../../assets/icons/screens/down_b.png')} resizeMode={'contain'} style={styles.icons} />
            </TouchableOpacity>
            {errorText && <Text style={[styles.errorTextIcon, styleErrorText]}>{errorText}</Text>}
            {open && minimumDate ? <DatePicker modal open={open} date={selectedDate} mode={mode} onConfirm={handleDateChange} onCancel={onCancel} minimumDate={minimumDate} /> : <DatePicker modal open={open} date={selectedDate} mode={mode} onConfirm={handleDateChange} onCancel={onCancel} />}
        </View>
    )
}

export default PickerDate

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.White
    },
    pickFromTo: {
        // paddingLeft: wp('2'),
        color: Colors.Black,
        fontSize: Platform.OS == 'android' ? Typography.FONT_SIZE_13 : Typography.FONT_SIZE_15,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    titleWithSteric: {
        flexDirection: 'row'
    },
    staricLable: {
        color: Colors.RedColor,
        fontSize: Platform.OS == 'android' ? Typography.FONT_SIZE_13 : Typography.FONT_SIZE_15,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    pickDateImage: {
        width: wp('92%'),
        height: hp('6%'),
        backgroundColor: Colors.White,
        borderRadius: wp('8%'),
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: wp(0.3),
        borderColor: Colors.BorderGrey,
        marginTop: hp('0.5')
    },
    pickOption: {
        width: wp('70'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    icons: {
        width: wp('5%'),
        height: wp('5%')
    },
    errorTextIcon: {
        fontSize: Typography.FONT_SIZE_12,
        width: wp('86%'),
        paddingLeft: wp('3%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText,
        marginRight: 0,
        marginTop: wp('0.5%'),
        marginBottom: wp('0.5%')
    },
    rememberContainer: {
        paddingLeft: wp('1%'),
        flexDirection: 'row',
        alignItems: 'center'
    },
    pickUpText: {
        paddingLeft: wp('1%'),
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_14
    },
    rememberImage: {
        width: wp('6%'),
        height: wp('6%')
    }
})
