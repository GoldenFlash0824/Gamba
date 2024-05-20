import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const SmallPicker = ({data, visible = false, onPress, pickerHandler, selectedItem, style, styleDropDown, title, styleTitle, leftContainerStyle, downIconCircleStyle, listTextStyle, titleTextStyle, listContainerStyle}) => {
    return (
        <View>
            {title && <Text style={[styles.byText, styleTitle]}>{title}</Text>}
            <TouchableOpacity style={[styles.dropDwonContainer, style]} onPress={onPress} activeOpacity={0.8}>
                <Text style={[styles.titleText, titleTextStyle]}>{selectedItem}</Text>
                <FastImage source={require('../../../assets/icons/screens/down_arrow.png')} resizeMode="contain" style={styles.downIcon} />
            </TouchableOpacity>
            {visible && (
                <View style={[styles.dropDownList, styleDropDown]}>
                    {data.map((item, ind) => {
                        return (
                            <TouchableOpacity style={[styles.listContainer, {...listContainerStyle, ...{marginTop: ind == 0 ? hp('0') : hp('1')}}]} key={ind} onPress={() => pickerHandler(item)} activeOpacity={0.8}>
                                <View style={[styles.leftContainer, leftContainerStyle]}>
                                    {item.image && <FastImage source={item.image} resizeMode="contain" style={styles.downIcon} tintColor={Colors.HTextColor} />}
                                    <Text style={[styles.listText, listTextStyle]}>{item.name}</Text>
                                </View>
                                {selectedItem == item.name && <FastImage source={require('../../../assets/icons/screens/check-circle.png')} resizeMode="contain" style={[styles.downIconCircle, downIconCircleStyle]} tintColor={Colors.HTextColor} />}
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
        width: wp('27%'),
        // height: hp('5'),
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: wp('0.3'),
        borderRadius: wp('8'),
        justifyContent: 'space-around',
        marginTop: hp('.5')
    },
    byText: {
        fontFamily: Typography.FONT_FAMILY_BOLD,
        color: Colors.Black,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16
    },
    absoluteView: {
        width: wp('10%'),
        alignItems: 'center',
        marginStart: 3,
        zIndex: 1,
        bottom: 35
    },
    titleText: {
        width: wp('24'),
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        color: Colors.DarkPepper_60,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_12 : Typography.FONT_SIZE_12
        // borderWidth: 1
    },
    downIcon: {
        width: wp('4%'),
        height: wp('4%')
    },
    downIconCircle: {
        width: wp('4%'),
        height: wp('4%')
    },
    dropDownList: {
        marginTop: hp('0.5'),
        width: wp('27%'),
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        alignItems: 'center',
        borderWidth: wp('0.3'),
        borderRadius: wp('4'),
        justifyContent: 'center',
        shadowOffset: {width: 0, height: 1},
        paddingVertical: hp('1'),
        shadowColor: Colors.Description,
        shadowOpacity: 0.28,
        elevation: 5,
        shadowRadius: 4,
        // position: 'absolute',
        zIndex: 0
    },
    listContainer: {
        // height: hp('5'),
        backgroundColor: Colors.White,
        width: wp('23%'),
        borderWidth: wp('0.2'),
        borderColor: Colors.BorderGrey,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: wp('1'),
        paddingVertical: hp('1'),
        borderRadius: wp('8')
    },
    leftContainer: {
        width: wp('18%'),
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    listText: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13
    }
})

export default SmallPicker
