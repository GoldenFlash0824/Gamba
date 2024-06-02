import React, {useRef} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import {IMAGES_BASE_URL} from '../../../services'
import FastImage from 'react-native-fast-image'
import ChemicalsDetailUsed from './ChemicalsDetailUsed'

const ProductDetailTrade = (props) => {
    const chemicalDetailSheetRef = useRef()

    closeHandlerChemicalDetail = () => chemicalDetailSheetRef.current.close()
    onCloseChem = () => chemicalDetailSheetRef.current.close()
    handlerOpenChemSheet = () => setTimeout(() => chemicalDetailSheetRef.current.open(), 200)

    return (
        <View style={styles.body}>
            <View style={styles.backgroundContainer}>
                <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                    <View style={styles.imageContainer}>
                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleName}>Name: </Text>

                            <Text style={styles.titleProduct}>{props.route.tradeData ? props.route.tradeData?.name : 'mango'}</Text>
                        </View>
                        {props?.route?.tradeData?.trade?.length > 0 ? (
                            <>
                                {props.route.tradeData?.trade[0].title?.map((tradeOption, index) => (
                                    <View style={styles.productNameConatiner} key={index}>
                                        <Text style={styles.titleName}>Trade With: </Text>
                                        <Text style={styles.titleProduct}>
                                            {tradeOption.trade_quantity} {tradeOption.trade_unit} {tradeOption.trade_title}
                                        </Text>
                                    </View>
                                ))}
                            </>
                        ) : null}
                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleName}>Product is for: </Text>
                            <Text style={styles.titleProduct}>{props.route.tradeData?.is_donation ? 'Giveaway' : 'Trade'}</Text>
                        </View>
                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleName}>Chemicals:</Text>
                            <TouchableOpacity onPress={() => (props?.route?.tradeData?.chemical_data?.length > 0 ? handlerOpenChemSheet() : null)}>
                                <Text style={styles.titleChem}>{props?.route?.tradeData?.chemical_data?.length > 0 ? 'Used chemicals' : props?.route?.tradeData?.is_organic ? 'No chemical used' : 'N/A'}</Text>
                            </TouchableOpacity>
                        </View>
                        {props?.route?.tradeData.is_trade ? null : (
                            <View style={styles.productNameConatiner}>
                                <Text style={styles.titleName}>Price: </Text>

                                <Text style={styles.titleProduct}>${'0.00'}</Text>
                            </View>
                        )}

                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleName}>Category: </Text>
                            <Text style={styles.titleProduct}>{props.route.tradeData ? props.route.tradeData?.category?.title : 'Fruits'}</Text>
                        </View>

                        {/* {props?.route?.tradeData.is_trade || props.route.tradeData?.is_donation ? null : (
                            <View style={styles.productNameConatiner}>
                                <Text style={styles.titleName}>Quantity: </Text>
                                <Text style={styles.titleProduct}>{props.route.tradeData ? props.route.tradeData?.quantity : 'no quantity add'}</Text>
                            </View>
                        )} */}

                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleName}>Sold By: </Text>
                            <Text style={styles.titleProduct}>{props.route.tradeData ? props.route.tradeData?.unit : 'no weight select'}</Text>
                        </View>

                        {/* {props.route.tradeData.is_trade ? (
                            <>
                                <View style={styles.productNameConatiner}>
                                    <Text style={styles.titleName}>Allow To Order: </Text>
                                    <Text style={styles.titleProduct}>{props.route.tradeData?.allow_to_0rder}</Text>
                                </View>
                                <View style={styles.productNameConatiner}>
                                    <Text style={styles.titleName}>Allow To Order In Advance: </Text>
                                    <Text style={styles.titleProduct}>{props.route.tradeData?.allow_to_0rder_advance}</Text>
                                </View>
                            </>
                        ) : null} */}
                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleName}>Delivery Type</Text>
                        </View>
                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleProduct}>Delivery: </Text>
                            <Text style={styles.titleProduct}>{props.route.tradeData?.is_delivery ? 'Yes' : 'No'}</Text>
                        </View>
                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleProduct}>PickUp: </Text>
                            <Text style={styles.titleProduct}>{props.route.tradeData?.is_pickUp ? 'Yes' : 'No'}</Text>
                        </View>
                        {props.route.tradeData?.distance ? (
                            <View style={styles.productNameConatiner}>
                                <Text style={styles.titleName}>Delivery Distance: </Text>
                                <Text style={styles.titleProduct}>{props.route.tradeData?.distance}</Text>
                            </View>
                        ) : null}
                        {props.route.tradeData?.is_donation ? (
                            <>
                                <View style={styles.productNameConatiner}>
                                    <Text style={styles.titleName}>Allow Per Person: </Text>
                                    <Text style={styles.titleProduct}>{props.route.tradeData?.allow_per_person}</Text>
                                </View>
                            </>
                        ) : null}

                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleName}>Availibility From: </Text>

                            <Text style={styles.titleProduct}>{props.route.tradeData?.available_from}</Text>
                        </View>

                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleName}>Ends On: </Text>
                            <Text style={styles.titleProduct}>{props.route.tradeData?.available_to}</Text>
                        </View>

                        {props?.route?.tradeData.is_trade ? null : (
                            <View style={styles.productNameConatiner}>
                                <Text style={styles.titleName}>Discount: </Text>
                                <Text style={styles.titleProduct}>{props.route.tradeData ? props.route.tradeData?.discount + '%' : 'no disCount'}</Text>
                            </View>
                        )}

                        <View style={styles.productNameConatiner}>
                            <Text style={styles.titleName}> </Text>
                            <Text style={styles.titleDiscrition}>
                                <Text style={styles.titleName}>Caption: </Text>
                                {props.route.tradeData ? props.route.tradeData?.caption : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.ImageConatiner}>
                        {props?.route?.tradeData?.images?.map((image, index) => (
                            <View style={styles.imageCotainerInner} key={index}>
                                <FastImage key={index} source={{uri: IMAGES_BASE_URL + image}} resizeMode="cover" style={styles.logoArea} />
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.donationConnect}>
                        <Text style={styles.swapText}>{'Contact'}</Text>
                    </TouchableOpacity>

                    {/* <View>
                            {userData.id != props.route.u_id && (
                                <View style={styles.backgroundColorContainer}>
                                    <View style={styles.innerContainer}>
                                        <View style={styles.buttonContaoner}>
                                            <TouchableOpacity style={styles.minusContainer} onPress={() => decrement(count)} activeOpacity={0.8}>
                                                <FastImage tintColor={Colors.White} source={require('../../../assets/icons/screens/minus-sign.png')} style={styles.addIcon} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.countValue} activeOpacity={0.8}>
                                                <Text style={styles.detail}>{count}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.addContainer} onPress={() => increment(count)} activeOpacity={0.8}>
                                                <FastImage tintColor={Colors.White} source={require('../../../assets/icons/screens/add.png')} style={styles.addIcon} />
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.swapButton}
                                            // onPress={() => {
                                            //     addToCartCBD(itemCB, count)
                                            //     setCount('1')
                                            // }}
                                            activeOpacity={0.8}>
                                            <FastImage tintColor={Colors.OrangeColor} source={require('../../../assets/icons/bottomtab/cart.png')} style={styles.cartIcon} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View> */}
                </ScrollView>
            </View>
            <ChemicalsDetailUsed setRef={chemicalDetailSheetRef} onCloseCB={closeHandlerChemicalDetail} height={hp('100%')} onChe={onCloseChem} itemCB={props} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.White
    },
    scrollBody: {
        paddingBottom: Platform.OS === 'ios' ? hp('20') : hp(5),
        alignItems: 'center'
    },
    titleChem: {
        color: Colors.Blue,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    imageContainer: {
        width: wp('86%')
    },
    imageCotainerInner: {
        width: wp('40%'),
        height: hp('18%')
    },
    ImageConatiner: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    productNameConatiner: {
        width: wp('80%'),
        flexDirection: 'row',
        paddingVertical: hp('0.4%')
    },
    priceSale: {flexDirection: 'row', alignItems: 'center'},
    backgroundColorContainer: {
        width: wp('88%'),
        height: hp('6%'),
        backgroundColor: '#f4f7f8',
        borderRadius: wp('1%'),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    tardeTitle: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    innerContainer: {
        width: wp('50%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleDiscrition: {
        width: wp('85%'),
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    buttonContaoner: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: wp('25%'),
        backgroundColor: Colors.White,
        borderRadius: wp('4'),
        borderWidth: wp('0.5'),
        borderColor: Colors.GrayLight
    },
    swapButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    minusContainer: {
        width: wp('7%'),
        height: wp('7%'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.GrayminusColor,
        borderRadius: wp('4')
    },
    addIcon: {
        width: wp('3%'),
        height: wp('3%')
    },
    countValue: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,

        borderRadius: wp('5')
    },
    detail: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
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
    cartIcon: {
        width: wp('8%'),
        height: wp('8%')
    },
    crossIcon: {
        width: wp('6%'),
        height: hp('6%')
    },
    leftConatiner: {
        // left: wp('4%')
    },
    title: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_BOLD
    },
    titleName: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_BOLD
    },
    titleProduct: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    titleProductSale: {
        color: Colors.OrangeColor,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        textDecorationLine: 'line-through'
    },
    headingContainer: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logoArea: {
        width: '100%',
        height: '100%',
        borderRadius: hp('1%')
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        backgroundColor: Colors.White,
        borderRadius: wp('4%'),
        paddingVertical: hp('1%'),
        marginTop: Platform.OS == 'android' ? hp('1%') : hp('1%')
    },
    donationConnect: {
        width: wp('87%'),
        height: hp('6%'),
        borderWidth: 1,
        borderColor: Colors.MainThemeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('7'),
        marginTop: hp('4%')
    },
    swapText: {
        color: Colors.MainThemeColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    }
})

export default ProductDetailTrade
