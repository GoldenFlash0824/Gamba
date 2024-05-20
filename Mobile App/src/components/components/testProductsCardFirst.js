import React, {useState, useRef, useEffect} from 'react'
import {Platform, StyleSheet, Text, View, TouchableOpacity, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import Carousel, {Pagination} from 'react-native-snap-carousel'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ImagesCard from './ImagesCard'
import {IMAGES_BASE_URL} from '../../../services'
import {getHeaders, separatorHeightH} from '../../../utils/helpers'

const ProductCard = ({item, type = 'Seller', donation = false, soldBy = false, favouriteP, shareP, addToCartBuy, donationP, tradePress, onPressTP, sale = false, userId, editP, deleteP, editDeleteProduct = false, onPressDS, trade = false, index, addToCartCB, profile, onDotPress, reportP, openDetail, reportLikeDo, allProduct = false}) => {
    const [count, setCount] = useState(1)
    const [_images, setImages] = useState([])

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

    ////changing write now this
    const [_index, setIndex] = useState(0)
    const myCarousel = useRef()
    const renderItem = (item, index) => {
        return <ImagesCard item={item} image={item?.item?.imge} type={'product'} onPress={onPressDS} />
    }

    const renderItemTrade = (itm, index) => {
        return (
            <>
                <View style={styles.imageContainerTrade}>
                    <Pressable style={styles.swapConatiner1} onLongPress={onPressTP}>
                        <FastImage source={{uri: IMAGES_BASE_URL + itm.item.prodI}} style={styles.tradeImage} resizeMode={'contain'} />
                    </Pressable>

                    {type == 'Trade' && (
                        <TouchableOpacity activeOpacity={0.8} style={styles.tradeCard}>
                            <FastImage source={require('../../../assets/icons/screens/trade.png')} style={styles.cartIcon} resizeMode={'contain'} tintColor={Colors.Black} />
                        </TouchableOpacity>
                    )}
                    {item.trade[0].title ? (
                        <View style={styles.withTradeContainer} key={index}>
                            {type != 'Trade' && trade && (
                                <Text style={styles.tradeWith} numberOfLines={1}>
                                    Trade With
                                </Text>
                            )}

                            {item.trade[0].title?.map((tradeOption, index) => (
                                <Text key={index} style={styles.rootTextTrade}>
                                    {tradeOption?.trade_title?.trimStart()}
                                </Text>
                            ))}
                            {userId != item.u_id && (
                                <>
                                    {type != 'Trade' && trade && (
                                        <TouchableOpacity style={styles.chatContainer}>
                                            <FastImage tintColor={'green'} source={require('../../../assets/icons/screens/messenger.png')} style={styles.messenger} />
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                        </View>
                    ) : null}
                </View>
            </>
        )
    }

    return (
        <View style={[styles.cardProducts, {marginTop: index == 0 ? hp('0') : hp('1')}]}>
            {profile ? (
                <TouchableOpacity style={styles.verticalDots} onPress={onDotPress}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </TouchableOpacity>
            ) : null}

            {separatorHeightH()}
            <View style={styles.priceNameWithVegetable}>
                {!trade && (
                    <View style={styles.rootNameWithStar}>
                        <TouchableOpacity style={styles.RootContainer} onPress={openDetail}>
                            <Text style={styles.rootText} numberOfLines={2}>
                                {item ? item.name?.trimStart() : 'Root Vegetables'}
                            </Text>
                        </TouchableOpacity>
                        {userId != item.u_id && (
                            <View style={styles.dotsConatiner}>
                                <TouchableOpacity onPress={favouriteP}>
                                    <FastImage source={require('../../../assets/icons/screens/follow.png')} tintColor={Colors.DarkPepper_80} style={styles.filledHeartIcon} resizeMode={'contain'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={favouriteP} onPress={reportP}>
                                    <FastImage source={require('../../../assets/icons/screens/vertical.png')} tintColor={Colors.DarkPepper_80} style={styles.filledHeartIcon} resizeMode={'contain'} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>
            {trade ? null : (
                <View style={styles.milesContainer}>
                    <Text style={styles.timeTitleStyle}>{'3 miles'}</Text>
                </View>
            )}
            {separatorHeightH()}
            {separatorHeightH()}
            {(sale || donation || trade) && (
                <Pressable style={styles.containerPostionTag}>
                    {sale && (
                        <View style={styles.lowPrice}>
                            <Text style={styles.priceDoller}>{'Sale'}</Text>
                        </View>
                    )}
                    {donation && (
                        <TouchableOpacity activeOpacity={0.8} style={styles.donationCard} onPress={donationP}>
                            <FastImage tintColor={Colors.Black} source={require('../../../assets/icons/screens/donation.png')} style={styles.cartIcon} resizeMode={'contain'} />
                        </TouchableOpacity>
                    )}

                    {type != 'Trade' && trade && (
                        <TouchableOpacity activeOpacity={0.8} style={styles.donationCard}>
                            <FastImage source={require('../../../assets/icons/screens/trade.png')} style={styles.cartIcon} resizeMode={'contain'} tintColor={Colors.Black} />
                        </TouchableOpacity>
                    )}
                </Pressable>
            )}
            <View style={styles.containerImageWithTitle}>
                {trade ? (
                    <View style={styles.midImageWrapertrade}>
                        {type != 'Trade' && trade && (
                            <View style={{alignItems: 'flex-start', width: wp('86%'), bottom: hp('2%')}}>
                                <View style={styles.folowWithRoot}>
                                    <TouchableOpacity style={styles.RootContainerTrade} onPress={openDetail}>
                                        <Text style={styles.rootText} numberOfLines={2}>
                                            {item ? item.name?.trimStart() : 'Root Vegetables'}
                                        </Text>
                                    </TouchableOpacity>

                                    {userId != item.u_id && (
                                        <View style={styles.dotsConatiner}>
                                            <TouchableOpacity onPress={favouriteP}>
                                                <FastImage source={require('../../../assets/icons/screens/follow.png')} tintColor={Colors.DarkPepper_80} style={styles.filledHeartIcon} resizeMode={'contain'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={favouriteP} onPress={reportP}>
                                                <FastImage source={require('../../../assets/icons/screens/vertical.png')} tintColor={Colors.DarkPepper_80} style={styles.filledHeartIcon} resizeMode={'contain'} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.milesContainer}>
                                    <Text style={styles.timeTitleStyle}>{'3 miles'}</Text>
                                </View>
                            </View>
                        )}
                        <Carousel ref={myCarousel} data={_images} renderItem={renderItemTrade} sliderWidth={wp('100%')} itemWidth={wp('100%')} onSnapToItem={(index) => setIndex(index)} />
                        {type == 'Trade' && (
                            <>
                                {trade ? (
                                    <View style={styles.saleDonationContainerBgTrade}>
                                        {type == 'Trade' && (
                                            <Text style={styles.rootTextBy} numberOfLines={1}>
                                                {item ? item.name.trimStart() : 'Root Vegetables'}
                                            </Text>
                                        )}
                                        <TouchableOpacity style={styles.swapButtonTrade} onPress={tradePress}>
                                            <Text style={styles.swapText}>{'Trade'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : null}
                            </>
                        )}
                    </View>
                ) : type !== 'Seller' ? (
                    <>
                        <View style={styles.midImageWraper}>
                            <>
                                <Carousel ref={myCarousel} data={item ? item.images : _images} renderItem={renderItem} sliderWidth={wp('45%')} itemWidth={wp('45%')} onSnapToItem={(index) => setIndex(index)} />
                                <Pagination dotsLength={item?.images?.length} activeDotIndex={_index} containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)', paddingTop: hp('1'), paddingBottom: hp('0')}} dotStyle={styles._dotStyle} inactiveDotStyle={styles._inactiveDotStyle} inactiveDotOpacity={1} inactiveDotScale={0.6} />
                            </>
                        </View>
                    </>
                ) : (
                    <View style={styles.imageContainer}>
                        <FastImage source={index == 0 ? require('../../../assets/icons/screens/brocoli.jpg') : index == 1 ? require('../../../assets/icons/screens/potato.jpeg') : require('../../../assets/icons/screens/cucumber.jpeg')} style={styles.image} resizeMode={'contain'} />
                    </View>
                )}
                <View style={styles.detailProducts}>
                    <View style={styles.priceContainer}>
                        {sale && <Text style={styles.priceTextD}>{`$${item.price}.00 `}</Text>}

                        {donation ? (
                            <Text style={styles.priceText}>
                                ${'0.00'} {item.unit}
                            </Text>
                        ) : (
                            !trade &&
                            !sale && (
                                <Text style={styles.priceText}>
                                    {sale ? (item.price - (item.price * item.discount) / 100).toFixed(1) + ' ' : `$${item.price}.00 `}
                                    {item.unit}
                                </Text>
                            )
                        )}
                    </View>
                    {sale && (
                        <View style={styles.saleContainer}>
                            <Text style={styles.priceTextD}>{'on sale'}</Text>
                            <Text style={styles.priceSale}>{sale ? (item.price - (item.price * item.discount) / 100).toFixed(1) + ' ' : `$${item.price}.00 `}</Text>
                        </View>
                    )}

                    <View style={styles.cartQContainer}>
                        {trade || donation ? null : (
                            <>
                                {userId != item.u_id && (
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
                                )}
                                <TouchableOpacity
                                    onPress={() => {
                                        addToCartCB(item, count)
                                        setCount('1')
                                    }}
                                    activeOpacity={0.8}>
                                    {userId != item.u_id ? <FastImage tintColor={Colors.OrangeColor} source={require('../../../assets/icons/bottomtab/cart.png')} style={styles.cartIcon} /> : null}
                                </TouchableOpacity>
                            </>
                        )}
                        {trade || donation ? <TouchableOpacity activeOpacity={0.8}>{userId != item.u_id && <FastImage tintColor={'green'} source={require('../../../assets/icons/screens/messenger.png')} style={styles.messenger} />}</TouchableOpacity> : null}
                    </View>
                </View>
            </View>

            <View style={[styles.bottomContainer, {marginTop: item.images?.length == 1 || _images.length == 1 ? hp('1') : hp(0)}]}>
                <View>
                    {!trade ? (
                        <View style={styles.priceChemicals}>
                            <View>
                                <View style={styles.likeView}>
                                    {/* <TouchableOpacity onPress={favouriteP}>
                                        <FastImage source={item.isFev == 1 ? require('../../../assets/icons/screens/heart_filled.png') : require('../../../assets/icons/screens/like.png')} tintColor={item.isFev ? Colors.MainThemeColor : Colors.DarkPepper_80} style={styles.filledHeartIcon} />
                                    </TouchableOpacity> */}
                                    {soldBy ? (
                                        <View style={styles.soldBuyC}>
                                            <View style={styles.quantityShow}>
                                                <Text style={styles.rootTextQ}>{'Quantity'}</Text>
                                                <Text style={styles.rootText}>{item.quantity}</Text>
                                            </View>
                                            <View style={styles.quantityShow}>
                                                <Text style={styles.rootTextQ}>{'Sold'}</Text>
                                                <Text style={styles.rootText}>{item.total_sold} </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                    ) : null}
                </View>
            </View>
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
    cartQContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        right: wp('4%'),
        top: hp('10%')
    },
    dotsConatiner: {
        flexDirection: 'row'
    },
    folowWithRoot: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    chatContainer: {
        width: wp('32%'),
        alignItems: 'flex-end',
        top: Platform.OS == 'android' ? hp('9') : hp('9')
    },

    cardProducts: {
        width: wp('92%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.White,
        alignItems: 'center',
        shadowOffset: {width: 0, height: 0},
        shadowColor: Colors.Description,
        shadowOpacity: 0.28,
        elevation: 5,
        shadowRadius: 4,
        marginTop: hp('2')
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
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('5'),
        backgroundColor: Colors.YellowColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tradeCard: {
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: wp('5'),
        backgroundColor: Colors.YellowColor,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: hp('3%')
    },
    editDeleteConatiner: {
        width: wp('86%')
    },
    editDeleteInnerConatiner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: wp('1%')
    },
    containerImageWithTitle: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative'
    },
    detailProducts: {
        width: wp('45%'),
        height: hp('18%')
    },
    buttonContaoner: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: wp('20%'),
        backgroundColor: Colors.White,
        borderRadius: wp('4'),
        borderWidth: wp('0.5'),
        borderColor: Colors.GrayLight
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
        justifyContent: 'center',
        backgroundColor: Colors.White,

        borderRadius: wp('5')
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
        width: wp('3%'),
        height: wp('3%')
    },
    cartIcon: {
        width: wp('5%'),
        height: wp('5%')
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
        fontSize: Typography.FONT_SIZE_13
        fontFamily: Typography.FONT_FAMILY_REGULAR
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
        alignSelf: 'center',
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
        justifyContent: 'space-between'
    },
    quantityCartName: {
        width: wp('88%'),
        justifyContent: 'space-between',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cartIcon: {
        width: wp('7%'),
        height: wp('7')
    },
    swapConatiner1: {
        alignItems: 'center'
    },

    swapIcon: {
        width: wp('8%'),
        height: wp('8'),
        bottom: hp('7%')
    },
    imageContainerTrade: {
        width: wp('90'),
        height: Platform.OS == 'android' ? hp('17') : hp('15'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        borderWidth: 1
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
        width: wp('40'),
        height: wp('32')
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
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    rootTextBy: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    tradeWith: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontWeight: Typography.FONT_WEIGHT_BOLD
    },

    rootTextQ: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
        right: wp('1%')
    },
    rootTextTrade: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
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
        fontSize: Typography.FONT_SIZE_13
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginVertical: hp('0.3%'),
        maxWidth: wp('50%')
    },
    withText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    priceText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    priceSale: {
        color: Colors.RedColor,
        fontSize: Typography.FONT_SIZE_13
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    priceTextKg: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_10
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('40%')
    },
    priceTextD: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13
        fontFamily: Typography.FONT_FAMILY_BOLD,
        paddingRight: wp('1')
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: wp('45%'),
        width: wp('45%')
    },
    RootContainer: {
        alignSelf: 'center',
        alignItems: 'flex-start'
    },
    RootContainerTrade: {
        alignItems: 'flex-start'
    },
    rootNameWithStar: {
        width: wp('88%'),
        justifyContent: 'space-between',
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
        maxWidth: wp('35%'),
        alignItems: 'flex-start',
        width: wp('40'),
        height: wp('36'),
        top: Platform.OS == 'android' ? hp('0') : hp('1')
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
        fontSize: Typography.FONT_SIZE_10
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    cartView: {
        justifyContent: 'space-between'
    },

    swapButtonTrade: {
        width: wp('30%'),
        height: hp('3.5%'),
        borderWidth: 1,
        borderColor: Colors.MainThemeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('3')
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
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    likeReportText: {
        paddingLeft: wp('2'),
        paddingRight: wp('2'),
        paddingTop: hp('.5'),
        paddingBottom: hp('.5'),
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_13
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    midImageWraper: {
        width: wp('40%'),
        height: Platform.OS == 'android' ? hp('19') : hp('18'),
        alignItems: 'center',
        position: 'relative'
    },
    midImageWrapertrade: {
        width: wp('86%'),
        height: Platform.OS == 'android' ? hp('27') : hp('21'),
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
        width: wp('88%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1
    },

    innerContainer: {
        width: wp('54%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    innerContainerSaleDonation: {
        width: wp('54%'),
        flexDirection: 'row',
        justifyContent: 'space-between',

        right: wp('2%')
        // borderWidth: 1
    },
    innerContainerSaleDonation1: {
        width: wp('66%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        right: wp('2%')
    },
    verticalDots: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp('3%'),
        alignSelf: 'flex-end'
    },
    dot: {
        marginTop: hp(0.3),
        width: wp('1.5%'),
        height: wp('1.5%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.DarkPepper_40
    }
})

export default ProductCard
