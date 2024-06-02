import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import FastImage from 'react-native-fast-image'

const HistoryCardRendem = ({item, navigationCB}) => {
    let statusColor = Colors.ErrorText
    switch (item.status) {
        case 'Complete':
            statusColor = Colors.HTextColor
            break
        case 'Pending':
            statusColor = Colors.OrangeColor
            break
        case 'Cancel':
            statusColor = Colors.RedColor
            break
        default:
            break
    }
    return (
        <TouchableOpacity style={styles.containerOpacity}>
            <FastImage source={item.images} style={styles.image} resizeMode={'contain'} />
            <View style={styles.textTitle}>
                <Text style={styles.orderId} numberOfLines={1}>
                    {'#IdEEFF0000'}
                </Text>
                <Text style={styles.titleVegetableName} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.titleVegetableName}>{'$5.00'}</Text>
            </View>
            <TouchableOpacity style={[styles.touchableOpacityButton, {backgroundColor: statusColor}]}>
                <Text style={styles.touchableOpacityText}>{item.status}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.touchableOpacityButton, {backgroundColor: Colors.HTextColor}]} onPress={navigationCB}>
                <Text style={styles.touchableOpacityText}>{'View'}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        width: wp('12%'),
        height: wp('12%')
    },
    textTitle: {
        width: wp('27%')
    },
    containerOpacity: {
        width: wp('92%'),
        height: hp('10%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: '2%',
        shadowOffset: {width: 0, height: 6},
        shadowColor: Colors.Description,
        shadowOpacity: 0.28,
        elevation: 5,
        shadowRadius: 4
    },
    titleVegetableName: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_10,
        color: Colors.Black,
        fontWeight: Typography.FONT_FAMILY_REGULAR
    },
    orderId: {
        fontSize: Typography.FONT_SIZE_10,
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontWeight: Typography.FONT_FAMILY_REGULAR
        // paddingBottom: hp('.5')
    },
    touchableOpacityButton: {
        width: wp('20%'),
        height: hp('4%'),
        justifyContent: 'center'
    },
    touchableOpacityText: {
        textAlign: 'center',
        fontSize: Typography.FONT_SIZE_10,
        color: Colors.White,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default HistoryCardRendem
