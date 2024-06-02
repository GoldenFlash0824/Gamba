import React, {useState} from 'react'
import {StyleSheet, Text, View, FlatList, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import ToggelButton from '../../../components/components/common/ToggleButton'
import {getHeaders, separatorWidth, separatorHeightH} from '../../../utils/helpers'

const SellerSoldProductsCard = ({item}) => {
    return (
        <View style={styles.body}>
            <View style={styles.cardContainer}>
                <View style={styles.productsVege}>
                    <View style={styles.productsName}>
                        <FastImage source={item.images1} resizeMode="contain" style={styles.image} />
                        <View style={styles.nameTitel}>
                            <Text style={styles.buyersText}>2 buyers</Text>
                            <Text style={styles.totalPrice}>Total $120</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.namesSellerAll}>
                    <View style={styles.sellerName}>
                        <View style={styles.buyersName}>
                            <Text style={styles.totalPrice}>Randall Goldy</Text>
                        </View>
                        <View style={styles.quantity}>
                            <Text style={styles.buyersText}>2qt</Text>
                        </View>
                        <View style={styles.quantity}>
                            <Text style={styles.buyersText}>$70</Text>
                        </View>
                        <View style={styles.buyersName}>
                            <Text style={styles.buyersText}>02/11/23</Text>
                        </View>
                    </View>
                    <View style={styles.sellerName}>
                        <View style={styles.buyersName}>
                            <Text style={styles.totalPrice}>Kevin Mckaey</Text>
                        </View>
                        <View style={styles.quantity}>
                            <Text style={styles.buyersText}>2qt</Text>
                        </View>
                        <View style={styles.quantity}>
                            <Text style={styles.buyersText}>$50</Text>
                        </View>
                        <View style={styles.buyersName}>
                            <Text style={styles.buyersText}>04/10/23</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.totalPriceAmountPurchased}>
                    <View style={styles.totalPriceView}>
                        <Text style={styles.totalView}>Total </Text>
                    </View>
                    <View style={styles.totalqtP}>
                        <Text style={styles.totalView}>4pt</Text>

                        <Text style={styles.totalView}>$120</Text>
                    </View>
                </View>
                {separatorHeightH()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bodyM: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.BackgroundColor
    },
    dataListCard: {
        alignItems: 'center',
        width: wp('100%'),
        backgroundColor: Colors.BackgroundColor,
        height: Platform.OS === 'ios' ? hp('80') : hp('85')
    },
    noDataWraper: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('70%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    body: {
        width: wp('100%'),
        height: hp('21%'),
        backgroundColor: Colors.BackgroundColor
    },
    cardContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        borderRadius: wp('3'),
        marginTop: hp('1%'),
        backgroundColor: Colors.White,
        shadowColor: Colors.Shadow_Color,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    productsVege: {
        flexDirection: 'row'
    },
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
        fontSize: Typography.FONT_SIZE_9,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    totalPrice: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    purchaseName: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_9,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    totalView: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('30%')
    },
    sellerName: {
        width: wp('88%'),
        height: hp('3%'),
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    namesSellerAll: {
        marginTop: hp('2%')
    },
    buyersName: {
        justifyContent: 'center',
        alignItems: 'center'
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
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    smallImage: {
        width: wp('6%'),
        height: hp('3%'),
        borderRadius: wp('6')
    },
    buttonBuy: {
        width: wp('18%'),
        height: hp('2.6%'),
        borderRadius: wp('6'),
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buyText: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_9,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    totalPriceAmount: {
        width: wp('60%'),
        height: hp('4%'),
        marginLeft: wp('4%'),
        flexDirection: 'row'
    },
    totalPriceView: {
        width: wp('28%'),
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: hp('1%')
    },
    totalqt: {
        width: wp('16%'),
        height: hp('4%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    totalPriceAmountPurchased: {
        flexDirection: 'row'
    },
    totalqtP: {
        width: wp('30%'),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        alignItems: 'flex-start',
        left: hp('3.5%')
    }
})

export default SellerSoldProductsCard
