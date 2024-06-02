import React from 'react'
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const Picker = ({data, visible = false, onPress, showSteric = false, pickerHandler, selectedItem, style, styleDropDown, styleTitle, title}) => {
    return (
        <View>
            <View style={styles.titleWithSteric}>
                <Text style={[styles.byText, styleTitle]}>{title}</Text>
                {showSteric ? <Text style={styles.staricLable}>{'*'}</Text> : null}
            </View>

            <TouchableOpacity style={[styles.dropDwonContainer, style]} onPress={onPress} activeOpacity={0.8}>
                <Text style={styles.titleText}>{selectedItem}</Text>
                <FastImage source={require('../../../assets/icons/screens/down_arrow.png')} resizeMode="contain" style={styles.downIcon} />
            </TouchableOpacity>
            {visible && (
                <View style={[styles.dropDownList, styleDropDown]}>
                    {data.map((item, ind) => {
                        return (
                            <TouchableOpacity style={[styles.listContainer, {marginTop: ind == 0 ? hp(0) : hp(1)}]} key={ind} onPress={() => pickerHandler(item)} activeOpacity={0.8}>
                                <View style={[styles.leftContainer]}>
                                    {item.image && <FastImage source={item.image} resizeMode="contain" style={styles.downIcon} tintColor={Colors.HTextColor} />}
                                    <Text style={styles.listText}>{item.name}</Text>
                                </View>
                                {selectedItem == item.name && <FastImage source={require('../../../assets/icons/screens/check-circle.png')} resizeMode="contain" style={styles.downIcon} tintColor={Colors.HTextColor} />}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    dropDwonContainer: {
        width: wp('92%'),
        height: hp('6'),
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: wp('0.3'),
        borderRadius: wp('8'),
        justifyContent: 'space-around',
        marginTop: hp('.5')
    },
    titleWithSteric: {
        flexDirection: 'row'
    },
    staricLable: {
        color: Colors.RedColor,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    byText: {
        fontFamily: Typography.FONT_FAMILY_BOLD,
        color: Colors.Black,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16
    },
    titleText: {
        width: wp('70'),
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        color: Colors.Black,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16
    },
    downIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    dropDownList: {
        marginTop: hp('0.5'),
        width: wp('92%'),
        backgroundColor: Colors.White,

        alignItems: 'center',

        borderRadius: wp('4'),
        justifyContent: 'center',
        shadowOffset: {width: 0, height: 4},
        shadowColor: Colors.Description,
        shadowOpacity: 0.28,
        elevation: 5,
        shadowRadius: 4,
        zIndex: 1,
        paddingVertical: hp('1')
    },
    listContainer: {
        marginTop: hp('1'),
        backgroundColor: Colors.White,
        width: wp('88%'),

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: wp('8'),
        borderWidth: wp('0.2'),
        borderColor: Colors.BorderGrey,
        paddingVertical: hp('1'),
        paddingHorizontal: wp('2')
    },
    leftContainer: {
        width: wp('74%'),
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    listText: {
        color: Colors.Black,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    }
})

export default Picker
