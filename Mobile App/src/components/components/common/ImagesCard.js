import React from 'react'
import {StyleSheet, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import {IMAGES_BASE_URL} from '../../../services'

const ImagesCard = ({image, item, onPress, type, cardSecTrue}) => {
    return (
        <>
            <Pressable onLongPress={onPress} style={type == 'Seller' ? styles.imageContainerSeller : cardSecTrue ? styles.imageContainerSeller : styles.imageContainer} activeOpacity={0.8}>
                <FastImage source={item ? {uri: IMAGES_BASE_URL + item.item} : image} style={type == 'product' && !cardSecTrue ? styles.midImageP : styles.midImage} resizeMode={'cover'}></FastImage>
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    midImage: {
        width: '100%',
        height: '100%'
    },
    midImageP: {
        width: '100%',
        height: '100%',
        borderRadius: hp('1%')
    },

    imageContainerTrade: {
        width: wp('90'),
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    imageContainer: {
        width: wp('40'),
        height: hp('18%'),
        alignSelf: 'center'
    },
    swapConatiner: {
        alignItems: 'center'
    },
    imageContainerSeller: {
        width: wp('91.7'),
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        borderTopRightRadius: wp('5%'),
        borderTopLeftRadius: wp('5%'),
        overflow: 'hidden'
    },
    tradeImage: {
        width: wp('45'),
        height: wp('45')
    }
})

export default ImagesCard
