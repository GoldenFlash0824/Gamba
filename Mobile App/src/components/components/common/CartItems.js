import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {IMAGES_BASE_URL} from '../../../services'
import {storeCartData, removeCartData, removeCartItem} from '../../../services/store/actions'
import {useDispatch} from 'react-redux'

const CartItems = ({item}) => {
    const dispatch = useDispatch()
    const increment = () => {
        let _item = {id: item.id, quantity: 1}
        dispatch(storeCartData(_item))
    }
    const decrement = () => dispatch(removeCartData({id: item.id}))
    const deleteItemFromCart = () => dispatch(removeCartItem({id: item.id}))

    let _price = item.quantity * item.price
    _price = +_price.toFixed(2)
    return (
        <View disabled={false} style={styles.card} activeOpacity={0.8}>
            <View style={styles.itemIconWraper}>
                <FastImage source={{uri: IMAGES_BASE_URL + item?.img}} resizeMode="cover" style={styles.itemIconStyle} />
            </View>
            <View style={styles.sideContainer}>
                <View>
                    <View style={styles.nameAndPrice}>
                        <Text style={styles.title} numberOfLines={2}>
                            {item.name}
                        </Text>
                        <Pressable onPress={() => deleteItemFromCart()}>
                            <FastImage source={require('../../../assets/icons/screens/del_image.png')} resizeMode="cover" style={styles.addIcon} tintColor={Colors.LightGrayColor} />
                        </Pressable>
                    </View>
                    <Text style={styles.discriptionText} numberOfLines={2}>
                        By {item.user.first_name + ' ' + item.user.last_name}
                    </Text>
                    <Text style={styles.discriptionText} numberOfLines={2}>
                        {item.caption ? item.caption : ''}
                    </Text>
                </View>
                <View style={styles.priceIncraeseContainer}>
                    <View style={styles.buttonContaoner}>
                        <TouchableOpacity style={styles.countValue} activeOpacity={0.8}>
                            <Text style={styles.detail}>{item.quantity}</Text>
                        </TouchableOpacity>
                        <View style={styles.arrowQ}>
                            <TouchableOpacity onPress={() => increment()} activeOpacity={0.8}>
                                <FastImage tintColor={Colors.Black} source={require('../../../assets/icons/screens/up_b.png')} style={styles.addIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => decrement()} activeOpacity={0.8}>
                                <FastImage tintColor={Colors.Black} source={require('../../../assets/icons/screens/down_b.png')} style={styles.addIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.priceText} numberOfLines={1}>
                        ${`${_price}`}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        width: wp('92%'),
        paddingVertical: hp('1'),
        justifyContent: 'space-between',
        paddingHorizontal: wp('1'),
        alignItems: 'center',
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        borderWidth: wp('0.3'),
        borderRadius: wp('4%'),
        marginTop: wp('1%')
    },

    itemIconWraper: {
        width: wp('28%'),
        height: wp('28%'),
        alignItems: 'center'
    },
    minusContainer: {
        width: wp('7%'),
        height: wp('7%'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.OrangeColor,

        borderRadius: wp('5')
    },
    qunatiyAccount: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    addContainer: {
        width: wp('7%'),
        height: wp('7%'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.MainThemeColor,
        borderColor: Colors.GrayLight,
        borderRadius: wp('5')
    },
    sideContainer: {
        width: wp('58')
    },
    priceIncraeseContainer: {
        width: wp('58'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    buttonContaoner: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('2'),
        flexDirection: 'row',
        minWidth: wp('20%'),
        height: hp('6%'),
        borderRadius: wp('8'),
        borderColor: Colors.BorderGrey,
        borderWidth: wp('0.2')
    },
    itemIconStyle: {
        width: '100%',
        height: '100%',
        borderRadius: wp('4%')
    },
    countValue: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        width: wp('35%'),
        maxWidth: wp('35%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    heading: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    detail: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    arrowQ: {
        width: wp('10'),
        height: hp('6'),
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    addIcon: {
        width: wp('4%'),
        height: wp('4%')
    },
    nameAndPrice: {
        width: wp('58%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    discriptionText: {
        paddingVertical: hp('.5'),
        maxWidth: wp('55'),
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    priceText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    }
})

export default CartItems
