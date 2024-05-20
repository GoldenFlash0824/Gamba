import React, {useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import moment from 'moment'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import ToggelButton from '../../../components/components/common/ToggleButton'
import {separatorHeight} from '../../../utils/helpers'
import FastImage from 'react-native-fast-image'
import {IMAGES_BASE_URL} from '../../../services/constants'

const SoldProductsCard = ({item, purchased = false, sold = false, soldP = false}) => {
    return (
        <View style={styles.cardContainer}>
            {purchased ? (
                <View style={styles.namesSellerAll}>
                    {item?.order_products?.map((itm, ind) => {
                        return (
                            <View style={ind % 2 === 1 ? styles.sellerNameG : styles.sellerName} key={ind}>
                                <View style={styles.dateView}>
                                    {ind > 0 && itm.createdAt == item.order_products[ind - 1].createdAt ? null : <Text style={styles.dateText}>{moment(itm.createdAt).format('DD/MM/YYYY')}</Text>}
                                    {/* <TouchableOpacity style={styles.buttonBuy}>
                                        <Text style={styles.buyText}>Buy Again</Text>
                                    </TouchableOpacity> */}
                                </View>
                                <View style={styles.imageName}>
                                    <View style={styles.innerImageName}>
                                        <FastImage source={{uri: IMAGES_BASE_URL + itm.product_orders.images[0]}} resizeMode="cover" style={styles.smallImage} />

                                        <Text style={styles.purchaseName} numberOfLines={2}>
                                            {itm?.product_orders?.name}
                                        </Text>
                                    </View>
                                    <View style={styles.qtnWithPrice}>
                                        <Text style={styles.buyersTextPurchase}>{itm?.quantity + 'qt'}</Text>
                                        <Text style={styles.buyersTextPurchase}>{'$' + itm.product_orders.price}</Text>
                                    </View>
                                </View>
                                <View style={styles.buyAgianV}>
                                    {/* <Text style={styles.dateText}>{moment(itm.createdAt).format('DD/MM/YYYY')}</Text> */}
                                    {/* <TouchableOpacity style={styles.buttonBuy}>
                                        <Text style={styles.buyText}>Buy Again</Text>
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                        )
                    })}
                </View>
            ) : null}

            <View style={soldP ? styles.totalPriceAmountPurchased : styles.totalPriceAmount}>
                <View style={soldP ? styles.totalPriceViewPurchased : styles.totalPriceView}>
                    <Text style={styles.totalView}>Total </Text>
                </View>
                <View style={soldP ? styles.totalqunatityPricePurchased : styles.totalqunatityPrice}>
                    <Text style={soldP ? styles.totalViewPurchased : styles.totalView}>{''}</Text>
                    <Text style={soldP ? styles.totalViewPurchased : styles.totalView}>{'$' + item.total}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        borderRadius: wp('3'),
        alignItems: 'center',
        marginTop: hp('2%'),
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        borderRadius: wp('3%')
    },
    dateView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: wp('90')
    },
    productsVege: {
        flexDirection: 'row',
        marginTop: hp('0.5')
    },
    imageName: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: wp('86')},
    innerImageName: {flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: wp('56')},
    qtnWithPrice: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: wp('30')},
    buyAgianV: {flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: wp('86')},
    image: {
        width: wp('20%'),
        height: hp('7%'),
        borderRadius: wp('6')
    },
    nameTitel: {
        width: wp('23%'),
        height: hp('7%'),
        justifyContent: 'center'
    },
    TotalAmount: {
        width: wp('80%'),
        height: hp('4%'),
        alignSelf: 'center',
        justifyContent: 'center'
    },
    productsName: {
        flexDirection: 'row',
        width: wp('45%'),
        justifyContent: 'space-between'
    },
    buyersText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    buyersTextPurchase: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    totalPrice: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('86%')
    },
    purchaseName: {
        marginLeft: wp('2%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('40%')
    },
    dateText: {
        paddingRight: wp('2%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('40%')
    },
    totalView: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        maxWidth: wp('56%')
    },
    totalViewPurchased: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        maxWidth: wp('56%')
    },
    sellerName: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('.5')
    },
    sellerNameG: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: Colors.GrayLight,
        marginTop: hp('.5')
    },
    namesSellerAll: {
        marginTop: hp('1%')
    },
    buyersName: {
        width: wp('30%'),
        justifyContent: 'center'
    },
    buyersNamePurchase: {
        width: wp('20%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantity: {
        width: wp('14%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantityPurchase: {
        width: wp('10%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallImage: {
        width: wp('10%'),
        height: wp('10%'),
        // borderWidth: 1,
        borderRadius: wp('2%')
    },
    buttonBuy: {
        paddingHorizontal: wp('2'),
        paddingVertical: hp('.5'),
        borderRadius: wp('6'),
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buyText: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    totalPriceAmount: {
        width: wp('60%'),
        height: hp('4%'),
        marginLeft: wp('6%'),
        marginLeft: Platform.OS == 'android' ? wp('3%') : wp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalqunatityPricePurchased: {
        width: wp('30'),
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalPriceView: {
        width: wp('32.5%'),
        justifyContent: 'center'
    },
    totalPriceViewPurchased: {
        width: wp('56'),
        justifyContent: 'center'
    },
    totalqunatityPrice: {
        width: Platform.OS == 'android' ? wp('88%') : wp('88%'),

        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalqt: {
        width: Platform.OS == 'android' ? wp('14%') : wp('16%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    totalPriceAmountPurchased: {
        width: Platform.OS == 'android' ? wp('88%') : wp('88%'),
        flexDirection: 'row',
        justifyContent: 'space-between',

        alignItems: 'center',
        paddingVertical: hp('1')
    },
    totalqtP: {
        width: wp('12%'),
        height: hp('4%'),
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SoldProductsCard
