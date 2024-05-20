import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const ListItem = ({title, descitption = '', noDetail = '', style}) => {
    return (
        <TouchableOpacity style={{...styles.card, ...style}} onPress={() => props.onSelect()} activeOpacity={0.8}>
            <View style={styles.leftContainer}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    {descitption != '' && <Text style={styles.descriptionText}>{descitption}</Text>}
                </View>
            </View>
            <View style={styles.iconView}>
                {noDetail != '' && <Text style={styles.descriptionText}>{noDetail}</Text>}
                <FastImage source={require('../../assets/icons/screens/right.png')} resizeMode="contain" tintColor={Colors.DarkPepper_60} style={styles.iconStyle} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        width: wp('88%'),
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.White,
        borderBottomColor: Colors.GrayLight,
        borderBottomWidth: wp('0.3%'),
        paddingVertical: hp('1')
    },
    leftContainer: {
        flexDirection: 'row',
        maxWidth: wp('70')
    },
    title: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontWeight: Typography.FONT_WEIGHT_BOLD,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },

    descriptionText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    iconView: {
        flexDirection: 'row',
        width: wp('25%'),
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    iconStyle: {
        width: wp('6%'),
        height: hp('6%')
    }
})

export default ListItem
