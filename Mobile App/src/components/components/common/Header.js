import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import FastImage from 'react-native-fast-image'

const Header = ({back = false, style, backCB, title, titlleLeft, rightText, onRightPress}) => {
    return (
        <View style={{...styles.wrapper, ...style}}>
            <View style={titlleLeft ? styles.leftContainerL : styles.leftContainer}>
                {back && (
                    <TouchableOpacity onPress={backCB} style={styles.goBack} activeOpacity={0.8}>
                        <FastImage resizeMode="contain" style={styles.back} tintColor={Colors.Black} source={require('../../../assets/icons/screens/left.png')} />
                    </TouchableOpacity>
                )}
                {titlleLeft && <Text style={styles.titleNameLeft}>{titlleLeft}</Text>}
            </View>
            <View style={titlleLeft ? {} : styles.midContainer}>{!titlleLeft && <>{title ? <Text style={styles.titleName}>{title}</Text> : <FastImage source={require('../../../assets/icons/screens/gamba_logo.png')} resizeMode="contain" style={styles.logoContainer} />}</>}</View>
            <TouchableOpacity style={styles.rightContainer} onPress={onRightPress} activeOpacity={0.8}>
                <Text style={styles.markText}>{rightText}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: wp('100%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.White,
        paddingHorizontal: wp('2'),
        minHeight: hp('8')
    },
    back: {
        width: wp('6%'),
        height: wp('6%')
    },
    goBack: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    backText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    iconsStyle: {
        height: wp('5%'),
        width: wp('5%')
    },
    titleProfile: {
        width: wp('56%'),
        alignItems: 'flex-end'
    },
    leftContainer: {
        width: wp('32%'),
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    leftContainerL: {
        maxWidth: wp('65%'),
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    editRight: {
        width: wp('66%'),
        alignItems: 'center'
    },

    rightContainer: {
        minWidth: wp('32%'),
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingRight: wp('4%')
    },
    rightText: {
        fontSize: Typography.FONT_SIZE_13,
        color: Colors.Black,

        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    logoContainer: {
        width: wp('32%'),
        height: hp('10%')
    },
    icons: {
        width: wp('6%'),
        height: wp('6%')
    },
    cartIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    cart: {
        width: wp('8%'),
        height: wp('8%')
    },

    messagesCounter: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_8,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    titleNameLeft: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    titleName: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    markText: {
        color: Colors.MainThemeColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    gmailName: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    editIcon: {
        width: wp('7%'),
        height: wp('7%')
    },
    circleContainer: {
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BorderGrey,
        marginHorizontal: wp('.5')
    },
    midContainer: {
        minWidth: wp('32%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    midContainerI: {
        // width: wp('32%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    goBackContainer: {
        width: wp('33%'),
        paddingLeft: wp('2'),
        flexDirection: 'row'
    },
    titleNameContainer: {
        width: wp('34%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImages: {
        width: wp('9%'),
        height: hp('4%'),
        borderRadius: hp('5%')
    }
})

export default Header
