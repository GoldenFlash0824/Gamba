import React, {useState, useRef, useEffect} from 'react'
import {Platform, StyleSheet, Text, View, TouchableOpacity, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import Carousel, {Pagination} from 'react-native-snap-carousel'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ImagesCard from './ImagesCard'
import {IMAGES_BASE_URL} from '../../../services'
import {separatorHeightH} from '../../../utils/helpers'

const ProductCard = ({item, type = 'Seller', donation = false, tradePressSS, donationPP, donationP, tradePress, onPressTP, sale = false, userId, editDeleteProduct = false, onPressDS, trade = false, index, addToCartCB, profile, onDotPress, openDetail, cardSecTrue = true}) => {
    const [count, setCount] = useState(1)
    const [expanded, setExpanded] = useState(false)

    const [_images, setImages] = useState([])
    const [_index, setIndex] = useState(0)
    const myCarousel = useRef()
    const numberOfLinesToShow = 3

    const increment = (count) => {
        let _count = parseInt(count) + 1
        setCount(_count)
    }
    const decrement = (count) => {
        if (count > 1) {
            setCount(parseInt(count) - 1)
        }
    }
    useEffect(() => {
        let updateimages = []
        const _data = {prodI: item?.images[0], tradeI: item?.trade?.length > 0 ? item?.trade[0].image : item?.images[0], prodD: item.quantity + ' ' + item.unit, tradD: item?.trade?.length > 0 ? item.trade[0].quantity + ' ' + item.trade[0].unit : '0 kg'}
        updateimages.push(_data)
        setImages(updateimages)
    }, [])

    const renderItem = (item, index) => {
        return <ImagesCard item={item} image={item?.item?.imge} type={'product'} onPress={trade && cardSecTrue ? tradePress : donation && cardSecTrue ? donationP : onPressDS} cardSecTrue={!trade} />
    }

    const toggleTextExpansion = () => setExpanded((prevState) => !prevState)

    const renderItemTrade = (itm, index) => {
        return (
            <>
                <View style={styles.imageContainerTrade}>
                    <Pressable onPress={onPressTP} style={[styles.cartIconCircle, {backgroundColor: Colors.White}]}>
                        <FastImage source={require('../../../assets/icons/screens/trade.png')} style={donation ? styles.addIconSD : styles.addIconS} tintColor={Colors.saleColor} />
                    </Pressable>
                    <View style={styles.innerImageContainer}>
                        <TouchableOpacity activeOpacity={0.8} onPress={onPressTP}>
                            <FastImage source={{uri: IMAGES_BASE_URL + itm.item.prodI}} style={styles.tradeImage} resizeMode={'cover'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.saleDonationContainerBgTrade}>
                        <TouchableOpacity activeOpacity={0.8} onPress={onPressTP}>
                            <Text style={styles.rootTextBy}>
                                {item?.name?.trimStart()}
                                <Text style={styles.trdWith}>{' trade with '}</Text>
                                {item.trade[0].title?.map((tradeOption, index) => (
                                    <Text key={index} style={styles.rootTextTrade}>
                                        {tradeOption?.trade_title?.trimStart()}
                                        {index != item.trade[0].title.length - 1 ? ', ' : ''}
                                    </Text>
                                ))}
                            </Text>
                        </TouchableOpacity>
                        {profile ? (
                            <>
                                {(userId != item.u_id || editDeleteProduct) && (
                                    <TouchableOpacity style={styles.verticalDots} onPress={onDotPress}>
                                        <FastImage source={require('../../../assets/icons/screens/vertical.png')} style={styles.verticalIcon} />
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : null}
                    </View>
                    <View style={styles.saleDonationContainerBgTradeB}>
                        <View style={styles.tradeWithNameContiner}>
                            <Text style={styles.tardeBy}>
                                {'by '}
                                <Text style={styles.userNameProduct}> {item?.user?.first_name + ' ' + item?.user?.last_name}</Text>
                            </Text>
                        </View>
                        <View style={styles.pinContiner}>
                            <FastImage source={require('../../../assets/icons/bottomtab/pin.png')} style={styles.verticalIcon} resizeMode="contain" tintColor={Colors.Black} />
                            <Text style={styles.milesTextS}>{item?.userDistance}</Text>
                        </View>
                    </View>
                    {userId != item.u_id && (
                        <View style={styles.tradeButtonView}>
                            <TouchableOpacity style={styles.swapButtonTrade} onPress={tradePressSS}>
                                <Text style={styles.swapText}>{'Connect'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </>
        )
    }
    if (!trade) {
        return (
            <View style={[styles.cardProductsS, {marginTop: index == 0 ? hp('0') : hp('1')}]}>
                <Pressable onPress={trade ? tradePress : donation ? donationP : openDetail} style={[styles.cartIconCircle, {backgroundColor: trade ? Colors.tradeColor : donation ? Colors.White : sale ? Colors.White : Colors.White}]}>
                    <FastImage source={donation ? require('../../../assets/icons/screens/donation_b.png') : sale ? require('../../../assets/icons/screens/salee_b.png') : trade ? require('../../../assets/icons/screens/trade.png') : require('../../../assets/icons/screens/dollarNew.png')} style={donation ? styles.addIconSD : styles.addIconS} tintColor={donation ? Colors.MainThemeColor : sale ? Colors.saleColor : Colors.saleColor} />
                </Pressable>
                <View style={styles.midImageWraperS}>
                    <Carousel ref={myCarousel} data={item ? item.images : _images} renderItem={renderItem} sliderWidth={wp('92%')} itemWidth={wp('92%')} onSnapToItem={(index) => setIndex(index)} />
                </View>
                <Pagination dotsLength={item?.images?.length} activeDotIndex={_index} containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)', paddingTop: hp('1'), paddingBottom: hp('0')}} dotStyle={styles._dotStyle} inactiveDotStyle={styles._inactiveDotStyle} inactiveDotOpacity={1} inactiveDotScale={0.6} />
                <View style={styles.priceNameWithVegetableS}>
                    <View style={styles.rootContainerSE}>
                        <TouchableOpacity style={{flexDirection: 'row', maxWidth: wp(82), minWidth: wp(82), flexWrap: 'wrap'}} onPress={trade ? tradePress : donation ? donationP : openDetail}>
                            <Text style={styles.rootTextT}>
                                {item ? item.name?.trimStart() : ''}
                                <Text style={styles.categotyText}>{item ? ` / ${item.category.title?.trimStart()}` : ''}</Text>
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDotPress}>{(userId != item.u_id || editDeleteProduct) && <>{!trade && <FastImage source={require('../../../assets/icons/screens/vertical.png')} style={styles.verticalIcon} />}</>}</TouchableOpacity>
                    </View>
                </View>

                <View style={styles.rootContainerSEP}>
                    <View style={{maxWidth: wp(57), minWidth: wp(57)}}>
                        <Text style={styles.tardeBy}>
                            {'by '}
                            <Text style={styles.userNameProduct}>{item?.user?.first_name + ' ' + item?.user?.last_name}</Text>
                        </Text>
                    </View>
                    <View style={styles.pinContinerNext}>
                        <FastImage source={require('../../../assets/icons/bottomtab/pin.png')} style={styles.verticalIcon} resizeMode="contain" tintColor={Colors.Black} />
                        <Text style={styles.milesTextS}>{item?.userDistance}</Text>
                    </View>
                </View>
                {!donation && (
                    <View style={styles.soldProductView}>
                        <Text style={styles.soldProduct}>
                            {'Sold: '}
                            <Text style={styles.userNameProduct}>{`${item?.totalSold}`}</Text>
                        </Text>
                    </View>
                )}

                <View style={styles.connectButon}>
                    <>
                        {!trade && (
                            <View style={styles.descrition}>
                                <Text style={styles.txtDescrition} onPress={toggleTextExpansion} numberOfLines={expanded ? undefined : numberOfLinesToShow}>
                                    {item.caption}
                                </Text>
                            </View>
                        )}
                        {userId != item.u_id && (
                            <>
                                {!donation && (
                                    <View style={styles.qunaityWithBtn}>
                                        {!trade && (
                                            <View style={styles.priceWithQtnt}>
                                                <Text style={styles.priceTextS}>${sale ? (item.price - (item.price * item.discount) / 100).toFixed() : `${item.price}` + ' '}</Text>
                                                <View style={styles.cartQContainerS}>
                                                    {donation || trade ? null : (
                                                        <>
                                                            <TouchableOpacity style={styles.countValue} activeOpacity={0.8}>
                                                                <Text style={styles.detail}>{count}</Text>
                                                            </TouchableOpacity>
                                                            <View style={styles.arrowQ}>
                                                                <TouchableOpacity onPress={() => increment(count)} activeOpacity={0.8}>
                                                                    <FastImage source={require('../../../assets/icons/screens/up_b.png')} style={styles.addIcon} resizeMode="contain" />
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => decrement(count)} activeOpacity={0.8}>
                                                                    <FastImage source={require('../../../assets/icons/screens/down_b.png')} style={styles.addIcon} resizeMode="contain" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </>
                                                    )}
                                                </View>
                                            </View>
                                        )}

                                        <View style={styles.tradeWithSaleC}>
                                            <TouchableOpacity style={styles.swapButtonS} onPress={() => (trade ? tradePress() : (addToCartCB(item, count), setCount('1')))}>
                                                <Text style={styles.swapTextSale}>{'+ Cart'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}
                        {userId != item.u_id && (
                            <>
                                {donation && (
                                    <>
                                        <TouchableOpacity style={styles.donationConnect} onPress={donationPP}>
                                            <Text style={styles.swapText}>{'Connect'}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </>
                        )}
                    </>
                </View>
                {separatorHeightH()}
            </View>
        )
    }
    return (
        <View style={[styles.cardProducts, {marginTop: index == 0 ? hp('0') : hp('1')}]}>
            <View style={styles.midImageWrapertrade}>
                <Carousel ref={myCarousel} data={_images} renderItem={renderItemTrade} sliderWidth={wp('100%')} itemWidth={wp('100%')} onSnapToItem={(index) => setIndex(index)} />
            </View>
            {separatorHeightH()}
        </View>
    )
}

const styles = StyleSheet.create({
    cardSeller: {
        width: wp('100%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.White,
        alignItems: 'center',
        paddingBottom: hp('.5'),
        overflow: 'hidden'
    },
    nameWithMiles: {
        width: wp('86%'),
        paddingLeft: wp(2)
    },
    tradeButtonView: {
        width: wp('86%'),
        alignItems: 'flex-end',
        marginTop: hp('1'),
        alignSelf: 'center'
    },
    arrowQ: {
        width: wp('12%'),
        alignItems: 'center',
        alignItems: 'flex-end'
    },
    cartQContainer: {
        width: wp('35%'),
        alignItems: 'center',
        justifyContent: 'center',
        top: hp('5%')
    },
    dotsConatiner: {
        flexDirection: 'row'
    },
    folowWithRoot: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    qunaityWithBtn: {
        width: wp('88'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('1%')
    },
    priceWithQtnt: {
        width: wp('44'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: wp(1)
    },
    trdWith: {
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_Italic
    },
    tradeWithSaleC: {
        width: wp('44'),
        alignItems: 'flex-end'
    },
    descrition: {
        alignSelf: 'flex-start',
        paddingLeft: wp(1),
        maxWidth: wp('90'),
        alignItems: 'flex-start',
        marginTop: hp('0.6%')
    },
    chatContainer: {
        width: wp('32%'),
        alignItems: 'flex-end',
        top: Platform.OS == 'android' ? hp('9') : hp('9')
    },

    cardProducts: {
        width: wp('92%'),
        backgroundColor: Colors.White,
        alignItems: 'center',
        marginTop: hp('2'),
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        borderRadius: wp('5%')
    },
    timeTitleStyle: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_10,
        fontFamily: Typography.FONT_FAMILY_Italic
    },
    saleContainer: {
        flexDirection: 'row'
    },
    milesContainer: {
        width: wp('86%'),
        alignItems: 'flex-start'
    },
    donationCard: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    tradeCard: {
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: wp('5'),
        backgroundColor: Colors.YellowColor,
        alignItems: 'center',
        justifyContent: 'center'
    },

    saleCard: {},
    editDeleteConatiner: {
        width: wp('86%')
    },
    editDeleteInnerConatiner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: wp('1%')
    },
    containerImageWithTitle: {
        width: wp('90%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    detailProducts: {
        width: wp('35%'),
        height: hp('18%')
    },
    buttonContaoner: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: wp('25%'),
        height: wp('12%')
    },
    buttonContaoner2: {
        alignItems: 'center',

        flexDirection: 'row',
        width: wp('25%')
    },
    minusContainer: {
        width: wp('6%'),
        height: wp('6%'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.GrayminusColor,
        borderRadius: wp('4')
    },
    minusContainer1: {
        width: wp('7%')
    },
    countValue: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buyCard: {
        width: wp('12%'),
        height: wp('7%'),
        backgroundColor: Colors.OrangeColor,
        borderRadius: wp('1.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        top: hp('0.4%')
    },
    reportB: {
        width: wp('12%'),
        height: wp('7%'),
        left: wp('1.5%'),
        backgroundColor: Colors.OrangeColor,
        borderRadius: wp('1.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        top: hp('0.4%')
    },
    buyCard2: {
        width: wp('12%'),
        height: wp('7%')
    },
    addIcon: {
        width: wp('6%'),
        height: wp('6%')
    },
    verticalIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    cartIcon: {
        width: wp('15%'),
        height: wp('15%')
    },
    organicIcon: {
        width: wp('10%'),
        height: wp('10%'),
        bottom: hp('3.5')
    },
    swapIcon: {
        width: wp('8%'),
        height: wp('8%')
    },
    info: {
        width: wp('7.5%'),
        height: wp('7.5%'),
        left: hp('0.8%')
    },
    detail: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    addContainer: {
        width: wp('6%'),
        height: wp('6%'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.MainThemeColor,
        borderColor: Colors.GrayLight,
        borderRadius: wp('5')
    },

    priceNameWithVegetable: {
        width: wp('86%'),
        maxWidth: wp('86%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    priceChemicals: {
        width: wp('88%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    likeView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    soldBuyC: {
        width: wp('35%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    quantityShow: {
        flexDirection: 'row',
        left: wp('1%')
    },
    quantityCartName: {
        width: wp('88%'),
        justifyContent: 'space-between',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cartIcon: {
        width: wp('12%'),
        height: wp('12')
    },
    swapConatiner1: {
        width: wp('32'),
        height: Platform.OS == 'android' ? hp('15') : hp('14')
    },
    swapConatinerOuter: {
        height: Platform.OS == 'android' ? hp('16') : hp('15'),
        width: wp('35%'),
        alignItems: 'flex-end'
        // borderWidth: 1
    },

    swapIcon: {
        width: wp('8%'),
        height: wp('8'),
        bottom: hp('7%')
    },
    imageContainerTrade: {
        width: wp('92'),
        alignSelf: 'center'
    },
    innerImageContainer: {
        width: wp('91.7'),
        height: hp('25'),
        borderTopRightRadius: wp('5%'),
        borderTopLeftRadius: wp('5%'),
        marginLeft: wp(0.1)
    },
    imageContainer: {
        width: wp('40%'),
        height: wp('40'),
        overflow: 'hidden'
    },
    cartViewSet: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    weightAndChe: {
        width: wp('86%')
    },
    tradeWithView: {
        width: wp('88%'),
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'flex-end',
        marginTop: wp('1%')
    },

    image: {
        width: '100%',
        height: '100%'
    },
    tradeImage: {
        width: '100%',
        height: '100%',
        borderTopRightRadius: wp('5%'),
        borderTopLeftRadius: wp('5%')
    },
    row: {
        marginTop: hp('0.6'),
        width: wp('88%'),
        backgroundColor: Colors.BorderGrey,
        height: wp('0.5%')
    },
    bottomContainer: {
        width: wp('92%'),
        maxWidth: wp('92%'),
        alignItems: 'center'
    },
    rootText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    milesText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_11,
        fontFamily: Typography.FONT_FAMILY_Italic,
        top: hp('0.3')
    },
    rootTextBy: {
        paddingLeft: wp('2'),
        maxWidth: wp('84%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    tradeWith: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },

    rootTextQ: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        right: wp('1%')
    },
    rootTextTrade: {
        maxWidth: wp('26'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    filledHeartIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    messenger: {
        width: wp('5%'),
        height: wp('5%')
    },

    inputHeightWidth: {
        width: wp('75%'),
        height: hp('5%')
    },
    chemicalText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginVertical: hp('0.3%'),
        maxWidth: wp('50%')
    },
    withText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    priceText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    priceSale: {
        color: Colors.RedColor,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    priceTextKg: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_10,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('40%')
    },
    priceTextD: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        paddingRight: wp('1')
    },
    qunatiyAccount: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,

        fontFamily: Typography.FONT_FAMILY_BOLD,
        left: wp('1%')
    },

    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: wp('45%'),
        width: wp('45%')
    },
    RootContainer: {
        alignItems: 'flex-start'
    },
    RootContainerTrade: {
        alignItems: 'flex-start'
    },
    rootNameWithStar: {
        width: wp('86%'),
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row'
    },

    RootContainerImage: {
        width: wp('86%'),
        alignItems: 'center',
        backgroundColor: 'red'
    },

    withContainer: {
        width: wp('12%'),
        alignItems: 'center',
        alignSelf: 'center'
    },
    withTradeContainer: {
        alignItems: 'flex-start',
        height: Platform.OS == 'android' ? hp('16') : hp('15'),
        width: wp('35%'),
        overflow: 'hidden'
    },

    price: {
        flexDirection: 'row',
        marginRight: hp('26%'),
        position: 'absolute',
        right: wp('4'),
        width: wp('30%'),
        height: hp('5%'),
        alignItems: 'center'
    },
    highPrice: {
        width: wp('9%'),
        height: hp('4%'),
        justifyContent: 'center',
        borderRadius: wp('10%')
    },
    lowPrice: {
        backgroundColor: Colors.OrangeColor,
        width: wp('8%'),
        height: wp('8'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('5%')
    },
    containerPostionTag: {
        position: 'absolute',
        zIndex: 1,
        left: wp('1%'),
        top: hp('6%')
    },
    lowPriceDonation: {
        backgroundColor: '#f4f7f8',
        width: wp('8%'),
        height: wp('8'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('5%'),
        left: wp('2')
    },
    priceDoller: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_10,

        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    cartView: {
        justifyContent: 'space-between'
    },

    swapButtonTrade: {
        width: wp('86%'),
        height: hp('6%'),
        borderWidth: 1,
        borderColor: Colors.MainThemeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('9')
    },
    reportButton: {
        backgroundColor: Colors.OrangeColor,
        borderRadius: wp('2'),
        justifyContent: 'center'
    },

    swapInner: {
        width: wp('18%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    swapText: {
        color: Colors.MainThemeColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    swapTextSale: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    likeReportText: {
        paddingLeft: wp('2'),
        paddingRight: wp('2'),
        paddingTop: hp('.5'),
        paddingBottom: hp('.5'),
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_13,

        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    midImageWraper: {
        width: wp('40%'),
        height: hp('18'),
        alignItems: 'center'
    },
    midImageWrapertrade: {
        width: wp('90%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    arrowConatiner: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1
    },
    iconsStylesWithMargin: {
        width: wp('5%'),
        height: wp('5%')
    },
    arrowCircle: {
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BorderGrey
    },
    arrowLeftC: {
        width: wp('38%'),
        alignItems: 'flex-start'
    },
    arrowLeftR: {
        width: wp('38%'),
        alignItems: 'flex-end'
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
    feedImage: {
        marginTop: hp('1'),
        width: wp('92%'),
        height: hp('20%')
    },

    containerDonationSale: {
        width: wp('54%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    backgroundColorSet: {
        marginTop: hp('1%'),
        width: wp('88%'),
        height: hp('6%'),
        backgroundColor: '#f4f7f8',
        borderRadius: wp('1%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    saleDonationContainerBg: {
        marginTop: hp('1%'),
        width: wp('88%'),
        height: hp('6%'),
        backgroundColor: '#f4f7f8',
        borderRadius: wp('1%'),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    saleDonationContainerBgTrade: {
        width: wp('90%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        left: wp('1%'),
        marginTop: hp('1')
    },
    saleDonationContainerBgTradeB: {
        alignSelf: 'flex-start',
        paddingLeft: wp(2.7),
        width: wp('82%'),
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    innerContainer: {
        width: wp('54%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    verticalDots: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        marginTop: hp(0.3),
        width: wp('1.5%'),
        height: wp('1.5%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.DarkPepper_40
    },
    //second style

    cardProductsS: {
        width: wp('92%'),
        backgroundColor: Colors.White,
        alignItems: 'center',
        marginTop: hp('2'),
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        borderRadius: wp('5%')
    },
    midImageWraperS: {
        width: wp('92%'),
        height: hp('25'),
        alignItems: 'center'
    },
    rootContainerS: {
        alignSelf: 'flex-start',
        paddingLeft: wp(2),
        width: wp('90'),
        alignItems: 'flex-start'
    },
    rootContainerSE: {
        alignSelf: 'flex-start',
        paddingLeft: wp(2.7),
        width: wp('80'),
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rootContainerSEP: {
        alignSelf: 'flex-start',
        paddingLeft: wp(2.7),
        width: wp('82%'),
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    pinContiner: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    pinContinerNext: {
        alignItems: 'center',
        flexDirection: 'row'
    },

    tradeWithNameContiner: {
        maxWidth: wp(57),
        minWidth: wp(57)
    },
    rootContainerSS: {
        alignSelf: 'flex-start',
        width: wp(40),
        maxWidth: wp(40),
        alignItems: 'center'
    },
    priceNameWithVegetableS: {
        marginTop: hp('0.8'),
        width: wp('92%'),
        maxWidth: wp('92%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    soldProductView: {
        alignSelf: 'flex-start',
        paddingLeft: wp(2.7),
        width: wp('82%'),
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: hp('0.2')
    },
    unitBy: {
        marginTop: hp('2'),
        width: wp('88%'),
        maxWidth: wp('88%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rootNameWithStarS: {
        width: wp('88%'),
        // justifyContent: 'space-between',
        alignItems: 'center'
        // flexDirection: 'row'
    },
    connectButon: {
        width: wp('88%'),
        alignItems: 'center'
    },

    cartQContainerS: {
        width: wp('25%'),
        height: hp('6%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        borderRadius: wp('9%')
    },
    swapButtonTradeS: {
        width: wp('29%'),
        height: hp('6%'),
        borderWidth: 1,
        borderColor: Colors.MainThemeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('9')
    },
    swapButtonS: {
        width: wp('29%'),
        height: hp('6%'),
        backgroundColor: Colors.MainThemeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('9')
    },
    donationConnect: {
        width: wp('87%'),
        height: hp('6%'),
        borderWidth: 1,
        borderColor: Colors.MainThemeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('7'),
        marginTop: hp('1%')
    },
    rootTextS: {
        color: Colors.Green,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    rootTextT: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    rootTextU: {
        paddingTop: hp('.5'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    qunatiyAccountS: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    milesTextS: {
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    tardeBy: {
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_Italic
    },
    soldProduct: {
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    userNameProduct: {
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingLeft: wp('1.5')
    },
    categotyText: {
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_15,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingLeft: wp('1.5')
    },
    txtDescrition: {
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    cartIconCircle: {
        position: 'absolute',
        width: wp('13%'),
        height: wp('13%'),
        borderRadius: wp(7),
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        top: hp(1),
        right: wp(2)
    },
    cartIconCircleB: {
        position: 'absolute',
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: wp(8),
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        bottom: hp(8),
        alignSelf: 'center'
    },
    priceTextS: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    addIconS: {
        width: wp('7%'),
        height: wp('7%')
    },
    addIconSD: {
        width: wp('6%'),
        height: wp('6%')
    }
})

export default ProductCard
