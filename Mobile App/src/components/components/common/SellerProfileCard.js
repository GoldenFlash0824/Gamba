import React, {useState, useCallback, useRef} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Platform, FlatList, Image, Share, Linking} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import Carousel, {Pagination} from 'react-native-snap-carousel'
import {SliderBox} from 'react-native-image-slider-box'
import moment from 'moment'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ImagesCard from './ImagesCard'
import ProductCard from './ProductCard'
import EditBottomSheet from './EditBottomSheet'
import ValidateInput from '../../../utils/ValidateInput'
import InputWithLabels from '../../../components/components/common/InputWithLabels'

const SellerProfileCard = ({item}) => {
    const [quantity, setQuantity] = useState('')
    const [focusQuantity, setFocusQuantity] = useState(false)
    const [quantityError, setQuantityError] = useState(false)
    const [errorTextQuantity, setErrorTextQuantity] = useState(null)

    const onChangeQuantity = (text) => {
        let reg = new RegExp(`^[.0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setQuantity(text)
            }
        } else {
            setQuantity(text)
        }
    }

    const submitQuantity = () => {
        const error = ValidateInput('quantity', quantity)
        setErrorTextQuantity(error ? error : null)
        setQuantityError(error ? true : false)
        setFocusQuantity(false)
        // checkIsValidRequest(quantity)
    }

    const resetAllFocus = () => {
        setFocusQuantity(false)
    }
    return (
        <View style={styles.cardContainer}>
            <View style={styles.products}>
                <View style={styles.productsView}>
                    <TouchableOpacity style={styles.leftProfileImageM} activeOpacity={0.8}>
                        <FastImage source={item.images} resizeMode="contain" style={styles.logoArea} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.titelView}>
                        <Text style={styles.titleText}> {item.title}</Text>
                        <Text style={styles.pound}>{'Chemical (4)'}</Text>
                        <Text style={styles.poundPrice}>{'$5,25 pound -25% $Unit'}</Text>
                        <View style={styles.buyLike}>
                            <TouchableOpacity>
                                <FastImage source={require('../../../assets/icons/screens/likes.png')} resizeMode="contain" style={styles.like} />
                            </TouchableOpacity>
                            <Text style={styles.pound}>125</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailAboutVeg}>{'We grow our tomatoes 3times a year.We do not use'}</Text>
                </View>

                <View style={styles.buyProducts}>
                    <View style={styles.qtInput}>
                        <Text style={styles.qtText}>qt</Text>
                        <InputWithLabels
                            style={styles.viewInput}
                            showLabelCB={false}
                            value={quantity}
                            placeholder="Quantity"
                            keyboardType={'decimal-pad'}
                            secure={false}
                            isError={quantityError}
                            onBlur={submitQuantity}
                            isFocus={focusQuantity}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusQuantity(true)
                            }}
                            errorText={errorTextQuantity}
                            onChangeText={(text) => onChangeQuantity(text)}
                        />
                    </View>
                    <View style={styles.cartBuyContainer}>
                        <TouchableOpacity style={styles.cartAdd}>
                            <Text style={styles.textcart}>+ cart</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cartBuy}>
                            <Text style={styles.BuyNow}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: wp('92%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.CardBg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {width: 0, height: 4},
        shadowColor: Colors.Description,
        shadowOpacity: 0.28,
        elevation: 5,
        shadowRadius: 4,
        marginTop: hp('2')
    },
    products: {
        width: wp('92%'),
        height: hp('25%'),
        marginTop: hp('1%')
    },
    productsView: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    productsTitle: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    productView: {
        width: wp('92%'),
        marginTop: hp('2%')
    },
    leftProfileImageM: {
        width: wp('35%')
    },
    logoArea: {
        width: wp('32%'),
        height: hp('10%')
    },
    titelView: {
        width: wp('50%'),
        height: hp('10%'),
        justifyContent: 'center',
        marginTop: hp('1%')
    },
    titleText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        right: wp('1%'),
        maxWidth: wp('57%')
    },
    pound: {
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_11,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('57%'),
        marginTop: hp('0.5%')
    },
    poundPrice: {
        color: Colors.PriceColor,
        fontSize: Typography.FONT_SIZE_11,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('57%'),
        marginTop: hp('0.5%')
    },
    qtText: {
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_11,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    BuyNow: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_10,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    detailAboutVeg: {
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_11,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('57%')
    },
    detail: {
        width: wp('80%'),
        alignSelf: 'center'
    },
    like: {
        width: wp('5%'),
        height: hp('3%')
    },
    cartAdd: {
        width: wp('22%'),
        height: hp('4%'),
        borderRadius: hp('0.9%'),
        backgroundColor: Colors.OrangeColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartBuy: {
        width: wp('22%'),
        height: hp('4%'),
        borderRadius: hp('0.9%'),
        backgroundColor: Colors.OrangeColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartBuyContainer: {
        width: wp('47%'),
        height: hp('6%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textcart: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    buyProducts: {
        width: wp('80%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('2%'),
        alignItems: 'center',
        alignSelf: 'center'
    },

    buyView: {
        flexDirection: 'row',
        width: wp('24%'),
        alignItems: 'center'
    },
    qtInput: {
        flexDirection: 'row',
        width: wp('30%'),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buyLike: {
        flexDirection: 'row',
        width: wp('13%'),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buyViewAdd: {
        width: wp('25%'),
        borderColor: 'black',
        alignItems: 'center'
    },
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: hp('.6%')
    },
    indicator: {
        width: wp('100%'),
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        zIndex: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        width: wp('92%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.CardBg,
        borderColor: Colors.LightCream_60,
        overflow: 'hidden',
        alignItems: 'center',
        alignSelf: 'center'
    },
    cardHeader: {
        height: hp('10%'),
        width: wp('92%'),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    avatarContainer: {
        width: wp('16%'),
        alignItems: 'center',
        alignSelf: 'center',
        paddingLeft: wp('1%')
    },
    avatar: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('6%'),
        overflow: 'hidden',
        borderWidth: wp('.8%'),
        borderColor: Colors.LightCream_10
    },
    mapPin: {
        width: wp('4%'),
        height: wp('4%')
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    nameFounderWrapper: {
        flexDirection: 'row',
        paddingLeft: wp('1%'),
        width: wp('76%')
    },
    titleRelationWrapper: {
        width: wp('50%')
    },
    dotWrapper: {
        alignItems: 'center',
        width: wp('20%'),
        justifyContent: 'space-evenly'
    },
    arrowCircle: {
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BorderGrey
    },
    dot: {
        marginTop: hp(0.3),
        width: wp('1.5%'),
        height: wp('1.5%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.DarkPepper_40
    },
    _dotStyle: {
        width: wp('2%'),
        height: wp('2%'),
        marginHorizontal: wp('0%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.HTextColor
    },
    _inactiveDotStyle: {
        width: wp('2%'),
        height: wp('2%'),
        borderRadius: wp('2%'),
        marginHorizontal: wp('0%'),
        backgroundColor: Colors.DarkPepper_40
    },
    nameText: {
        maxWidth: wp('54%'),
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    addressText: {
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    milesText: {
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    timeText: {
        color: Colors.DarkPepper_60,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        alignSelf: 'flex-start',
        paddingBottom: wp('1%'),
        marginLeft: wp('1%')
    },
    shieldIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    starIcon: {
        width: wp('4%'),
        height: wp('4%')
    },
    iconsStyles: {
        width: wp('5%'),
        height: wp('5%')
    },
    filledHeartIcon: {
        width: wp('6%') * 1.1,
        height: wp('6%')
    },
    iconsStylesWithMargin: {
        width: wp('6%'),
        height: wp('6%')
    },
    discriptionText: {
        width: wp('88%'),
        marginTop: hp('.8%'),
        color: Colors.DarkPepper_60,
        alignSelf: 'center',
        fontSize: Typography.FONT_SIZE_13
    },
    textButton: {
        width: wp('20%'),
        alignSelf: 'flex-end',
        textAlign: 'center',
        alignItems: 'flex-end',
        color: Colors.TextGray,
        fontSize: Typography.FONT_SIZE_13
    },
    bottomRowWraper: {
        height: hp('7%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: wp('88%')
    },
    bottomLeftWraper: {
        width: wp('40%'),
        height: hp('6%'),
        flexDirection: 'row',
        alignItems: 'center'
    },
    bottomText: {
        width: wp('12%'),
        height: hp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.DarkPepper_60,
        fontSize: Typography.FONT_SIZE_16,
        paddingLeft: wp('1%')
    },
    soldText: {
        // height: hp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.DarkPepper_60,
        fontSize: Typography.FONT_SIZE_10,
        paddingLeft: wp('1%')
    },
    bottomTextS: {
        height: hp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.DarkPepper_60,
        fontSize: Typography.FONT_SIZE_16,
        paddingLeft: wp('1%')
    },
    bottomRightWraper: {
        width: wp('48%'),
        height: hp('6%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    midImageWraper: {
        width: wp('100%'),
        height: Platform.OS == 'android' ? hp('32') : hp('25'),
        marginTop: hp('1'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    midImageWraperS: {
        width: wp('100%'),
        height: Platform.OS == 'android' ? hp('32') : hp('32'),
        marginTop: hp('1'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    updatebutton: {
        height: hp('7%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    arrowConatiner: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1
    },
    arrowLeftC: {
        width: wp('38%'),
        alignItems: 'flex-start'
    },
    arrowLeftR: {
        width: wp('38%'),
        alignItems: 'flex-end'
    },
    viewInput: {
        width: wp('22%'),
        height: hp('4%'),
        marginBottom: hp('2%'),

        fontSize: Typography.FONT_SIZE_8,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    }
})

export default SellerProfileCard
