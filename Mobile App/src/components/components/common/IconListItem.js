import React, {memo} from 'react'
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const IconListItem = ({type}) => {
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.leftElementContainer} disabled={type === 'formCircle' ? true : false} activeOpacity={0.8} onPress={() => {}}>
                <FastImage source={require('../../assets/icons/screens/heart.png')} resizeMode="contain" tintColor={Colors.Purple} style={styles.leftIconStyle} />
            </TouchableOpacity>
            <View style={styles.rightSectionContainer}>
                <Text style={styles.titleText} numberOfLines={2}>
                    mian title
                </Text>
                <Text style={styles.followerText}>{'publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without'}</Text>
            </View>
            <FastImage source={require('../../assets/icons/screens/right.png')} resizeMode="contain" tintColor={Colors.DarkPepper_60} style={styles.iconStyle} />
        </View>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        marginTop: hp('2'),
        backgroundColor: Colors.LightCream_10,
        flexDirection: 'row',
        minHeight: hp('6%'),
        width: wp('96%'),
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.BottomBorder,
        borderRadius: wp('2'),
        paddingVertical: hp('1'),
        shadowColor: Colors.Black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    leftIconStyle: {
        width: wp('10%'),
        height: wp('10%')
    },

    leftElementContainer: {
        justifyContent: 'center',
        alignItems: 'center',

        width: wp('16%')
    },
    rightSectionContainer: {
        paddingLeft: wp('2%'),
        width: wp('70%')
    },

    titleText: {
        maxWidth: wp('35%'),
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    iconStyle: {
        width: wp('6%'),
        height: hp('6%')
    }
})

export default memo(IconListItem)
