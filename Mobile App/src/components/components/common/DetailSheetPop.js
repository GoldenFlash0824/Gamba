import React, {useState, useRef} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'
import {useSelector} from 'react-redux'
import Carousel, {Pagination} from 'react-native-snap-carousel'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {separatorHeight} from '../../../utils/helpers'
import FastImage from 'react-native-fast-image'
import {IMAGES_BASE_URL} from '../../../services'
import ModalContect from '../../../components/components/common/ModalContect'

const DetailSheetPop = ({itemCB, setRef, height, OnPressChem, onPress, addToCartCBD, chatCb}) => {
    const [expanded, setExpanded] = useState(false)

    const {userData} = useSelector((state) => state.user)

    const [modalVisible, setModalVisible] = useState(false)
    const [_index, setIndex] = useState(0)
    const numberOfLinesToShow = 6

    const [count, setCount] = useState(0)
    const myCarousel = useRef()
    const increment = (count) => {
        let _count = parseInt(count) + 1
        setCount(_count)
    }
    const decrement = (count) => {
        if (count > 1) {
            setCount(parseInt(count) - 1)
        }
    }

    const contactHandler = () => {
        setModalVisible(true)
    }

    const closeModal = (typ) => {
        setModalVisible(!modalVisible)
        typ === 'chat' ? setTimeout(() => chatCb(itemCB.user), 200) : null
    }

    const renderItem = (itemCB, index) => {
        return (
            <Pressable style={styles.imageContainer} activeOpacity={0.8}>
                <FastImage source={itemCB ? {uri: IMAGES_BASE_URL + itemCB.item} : image} style={styles.midImage} resizeMode={'cover'}></FastImage>
            </Pressable>
        )
    }

    const toggleTextExpansion = () => setExpanded((prevState) => !prevState)

    return (
        <RBSheet
            animationType={'slide'}
            ref={setRef}
            closeOnPressMask={true}
            openDuration={100}
            closeDuration={100}
            height={height}
            customStyles={{
                container: {
                    backgroundColor: Colors.White
                }
            }}>
            <View style={styles.body}>
                <View style={styles.backgroundContainer}>
                    <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                        <View style={styles.closeSheet}>
                            <TouchableOpacity onPress={onPress}>
                                <FastImage source={require('../../../assets/icons/screens/cancel_b.png')} resizeMode="contain" style={styles.crossIcon} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>Product Details</Text>

                        <View style={styles.imageWithProductName}>
                            <View style={styles.postionAbsolute}>
                                <Pressable style={[styles.cartIconCircle, {backgroundColor: itemCB?.is_trade ? Colors.tradeColor : itemCB?.is_donation ? Colors.White : itemCB?.discount ? Colors.White : Colors.White}]}>
                                    <FastImage source={itemCB?.is_donation ? require('../../../assets/icons/screens/donation_b.png') : itemCB?.discount ? require('../../../assets/icons/screens/salee_b.png') : itemCB?.is_trade ? require('../../../assets/icons/screens/trade.png') : require('../../../assets/icons/screens/dollarNew.png')} style={itemCB?.is_donation ? styles.addIconSD : styles.addIconS} tintColor={itemCB?.is_donation ? Colors.MainThemeColor : itemCB?.discount ? Colors.saleColor : Colors.saleColor} />
                                </Pressable>
                            </View>

                            {itemCB?.images?.length > 0 && (
                                <View style={styles.midImageWraperS}>
                                    <Carousel ref={myCarousel} data={itemCB ? itemCB.images : _images} renderItem={renderItem} sliderWidth={wp('40%')} itemWidth={wp('40%')} onSnapToItem={(index) => setIndex(index)} />
                                    <Pagination dotsLength={itemCB?.images?.length} activeDotIndex={_index} containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)', paddingTop: hp('0'), paddingBottom: hp('0')}} dotStyle={styles._dotStyle} inactiveDotStyle={styles._inactiveDotStyle} inactiveDotOpacity={1} inactiveDotScale={0.6} />
                                </View>
                            )}

                            <View style={styles.nameProductDis}>
                                <View style={styles.textWithVertical}>
                                    <Text style={styles.titleProduct}>{itemCB?.name}</Text>
                                    {/* <TouchableOpacity>
                                        <FastImage source={require('../../../assets/icons/screens/vertical.png')} style={styles.verticalIcon} />
                                    </TouchableOpacity> */}
                                </View>

                                <Text style={styles.titleDiscrition} onPress={toggleTextExpansion} numberOfLines={expanded ? undefined : numberOfLinesToShow}>
                                    {itemCB?.caption}
                                </Text>
                            </View>
                        </View>

                        {itemCB ? (
                            <>
                                <View style={styles.informationConatiner}>
                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Name</Text>
                                        <Text style={styles.titleProd}>{itemCB?.name}</Text>
                                    </View>

                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Product is for</Text>

                                        <Text style={styles.titleProd}>{itemCB?.is_donation ? 'Giveaway' : itemCB?.discount > 0 ? 'Sale' : itemCB?.is_trade ? 'Trade' : 'Sell'}</Text>
                                    </View>
                                </View>

                                <View style={styles.informationConatiner2nd}>
                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Chemicals: </Text>

                                        <TouchableOpacity onPress={() => (itemCB?.chemical_data?.length >> 0 ? OnPressChem() : null)}>
                                            <Text style={styles.titleProd}>{itemCB?.chemical_data?.length > 0 ? 'Used chemicals' : !itemCB.is_organic ? 'N/A' : 'No chemical used'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {itemCB?.is_trade ? (
                                        <>
                                            {itemCB?.trade?.length > 0 ? (
                                                <>
                                                    <View style={styles.productNameConatiner}>
                                                        {itemCB?.trade[0].title.map((tradeOption, index) => (
                                                            <View key={index}>
                                                                <Text style={styles.titleName}>Trade with</Text>
                                                                <Text style={styles.titleProd}>
                                                                    {tradeOption.trade_quantity} {tradeOption.trade_unit} {tradeOption.trade_title}
                                                                </Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </>
                                            ) : null}
                                        </>
                                    ) : (
                                        <View style={styles.productNameConatiner}>
                                            <Text style={styles.titleName}>Cost: </Text>

                                            {itemCB?.is_donation ? (
                                                <Text style={styles.titleProd}>${'0.00'}</Text>
                                            ) : itemCB?.discount ? (
                                                <View style={styles.titleProd}>
                                                    <Text style={styles.titleProd}>{`$${itemCB?.price} a ${itemCB?.unit}` + ' '}</Text>
                                                    <Text style={styles.titleProdSale}>
                                                        On sale {itemCB?.discount ? `$${(itemCB?.price - (itemCB?.price * itemCB?.discount) / 100).toFixed(1)}` + ' ' : `$${itemCB?.price}.00 `}a {itemCB?.unit}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text style={styles.titleProduct}> {itemCB?.price}</Text>
                                            )}
                                        </View>
                                    )}
                                </View>

                                <View style={styles.informationConatiner2nd}>
                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Available from</Text>

                                        <Text style={styles.titleProd}>{itemCB?.available_from}</Text>
                                    </View>

                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Ends on</Text>

                                        <Text style={styles.titleProd}>{itemCB.isUnlimitted ? 'N/A' : itemCB?.available_to}</Text>
                                    </View>
                                </View>

                                <View style={styles.informationConatiner2nd}>
                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Category</Text>

                                        <Text style={styles.titleProd}>{itemCB?.category?.title}</Text>
                                    </View>

                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Delivery type</Text>

                                        <Text style={styles.titleProd}>{itemCB?.is_delivery && itemCB?.is_pickUp ? 'Delivery, Pick_Up' : itemCB?.is_delivery ? 'Delivery' : itemCB?.is_pickUp ? 'Pick_Up' : 'N/A'}</Text>
                                    </View>
                                </View>

                                <View style={styles.informationConatiner2nd}>
                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Delivery distance</Text>

                                        <Text style={styles.titleProd}>{itemCB?.distance && itemCB?.is_delivery ? `${itemCB?.distance}` + ' miles' : 'N/A'}</Text>
                                    </View>
                                    {itemCB?.is_donation ? (
                                        <View style={styles.productNameConatiner}>
                                            <Text style={styles.titleName}>Allow per persons</Text>
                                            <Text style={styles.titleProd}>{itemCB?.allow_per_person}</Text>
                                        </View>
                                    ) : null}

                                    {itemCB?.is_donation || itemCB?.is_trade ? null : (
                                        <View style={styles.productNameConatiner}>
                                            <Text style={styles.titleName}>Allow to order</Text>
                                            <View style={styles.allowStyleOrder}>
                                                <Text style={styles.titleProd}>{itemCB?.allow_to_0rder_advance}</Text>
                                                <Text style={styles.titleProd}>{itemCB?.allow_to_0rder?.includes('Day(s)') ? itemCB?.allow_to_0rder?.replace('Day(s)', ' day(s)') : itemCB?.allow_to_0rder?.replace('Hour(s)', ' hour(s)')}</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.informationConatiner2nd}>
                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Sold by</Text>

                                        <Text style={styles.titleProd}>{itemCB?.unit}</Text>
                                    </View>

                                    <View style={styles.productNameConatiner}>
                                        <Text style={styles.titleName}>Discount</Text>

                                        <Text style={styles.titleProd}>{itemCB?.discount + '%'}</Text>
                                    </View>
                                </View>

                                {separatorHeight()}
                                {userData.id != itemCB?.u_id && (
                                    <>
                                        {itemCB?.is_donation || itemCB?.is_trade ? (
                                            <TouchableOpacity style={styles.donationConnect} onPress={contactHandler}>
                                                <Text style={styles.swapText}>{'Connect'}</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View>
                                                <View style={styles.backgroundColorContainer}>
                                                    <Text style={styles.priceText}>${itemCB?.discount > 0 ? (itemCB?.price - (itemCB?.price * itemCB?.discount) / 100).toFixed() : `${itemCB?.price}` + ' '}</Text>

                                                    <View style={styles.cartQContainerS}>
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
                                                    </View>

                                                    <TouchableOpacity
                                                        style={styles.swapButtonTrade}
                                                        onPress={() => {
                                                            addToCartCBD(itemCB, count)
                                                            setCount('1')
                                                        }}>
                                                        <Text style={styles.swapText}>{'+   Cart'}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    </>
                                )}
                            </>
                        ) : null}
                    </ScrollView>
                </View>
                {modalVisible && <ModalContect modalVisible={modalVisible} onRequestClose={closeModal} />}
            </View>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.White
    },
    closeSheet: {
        width: wp('90%'),
        alignItems: 'flex-end',
        marginTop: hp('1%'),
        position: 'relative'
    },

    imageWithProductName: {
        width: wp('90%'),
        marginTop: hp('4%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative'
    },
    imageContainer: {
        width: wp('35'),
        height: '90%',
        overflow: 'hidden'
    },
    _dotStyle: {
        width: wp('2%'),
        height: wp('2%'),
        marginHorizontal: wp('0%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.HTextColor
    },
    allowStyleOrder: {
        flexDirection: 'row'
    },
    _inactiveDotStyle: {
        width: wp('2%'),
        height: wp('2%'),
        borderRadius: wp('2%'),
        marginHorizontal: wp('0%'),
        backgroundColor: Colors.DarkPepper_40
    },
    cartIconCircle: {
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: wp(4.5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    addIconSD: {
        width: wp('6%'),
        height: wp('6%')
    },
    addIconS: {
        width: wp('5%'),
        height: wp('5%')
    },
    midImageWraperS: {
        width: wp('40%'),
        height: hp('20')
    },
    postionAbsolute: {
        width: wp('33%'),
        alignItems: 'flex-end',
        position: 'absolute',
        marginTop: hp('1%'),
        zIndex: 1
    },
    nameProductDis: {
        width: wp('50%')
    },
    verticalIcon: {
        width: wp('5%'),
        height: wp('5')
    },
    textWithVertical: {
        width: wp('50%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    midImage: {
        width: '100%',
        height: '100%',
        borderRadius: wp(4)
    },
    informationConatiner: {
        width: wp('90%'),
        paddingBottom: hp('2%'),
        paddingTop: hp('2%'),
        borderTopWidth: wp(0.2),
        borderBottomWidth: wp(0.2),
        borderColor: Colors.LightGrayColor,
        marginTop: hp('2%'),
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    informationConatiner2nd: {
        width: wp('90%'),
        paddingBottom: hp('2%'),
        paddingTop: hp('2%'),
        borderBottomWidth: wp(0.2),
        borderColor: Colors.LightGrayColor,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    ImageConatiner: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonContaoner: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: wp('25%'),
        height: wp('12%')
    },
    swapText: {
        color: Colors.MainThemeColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    priceText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    swapButtonTrade: {
        width: wp('29%'),
        height: hp('6%'),
        borderWidth: 1,
        borderColor: Colors.MainThemeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('9'),
        marginLeft: wp('4%')
    },
    arrowQ: {
        width: wp('10%'),
        alignItems: 'center'
    },
    addIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    qunatiyAccount: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        left: wp('1%')
    },
    detail: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    countValue: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,

        borderRadius: wp('5')
    },
    scrollBody: {
        paddingBottom: Platform.OS === 'android' ? hp('5') : hp('20'),
        alignItems: 'center'
    },
    productNameConatiner: {
        width: wp('45%'),
        justifyContent: 'center'
    },
    priceSale: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    backgroundColorContainer: {
        width: wp('88%'),
        height: hp('6%'),
        backgroundColor: Colors.White,
        borderRadius: wp('3%'),
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginTop: hp('2%')
    },
    imageCotainerInner: {
        width: wp('40%'),
        height: hp('18%')
    },
    tardeTitle: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13
    },
    priceDoller: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_10,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    innerContainer: {
        width: wp('50%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
        // borderWidth: 1
    },
    lowPrice: {
        backgroundColor: Colors.OrangeColor,
        width: wp('8%'),
        height: wp('8'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('5%'),
        left: wp('2')
    },
    titleDiscrition: {
        maxWidth: wp('45%'),
        color: Colors.LightGrayColor,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_13,
        alignItems: 'flex-start',
        marginTop: hp('1%')
    },
    textButton: {
        color: Colors.BorderGrey,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_13
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
        width: wp('5%'),
        height: wp('5%')
    },
    leftConatiner: {
        // left: wp('4%')
    },
    title: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_20
    },
    titleName: {
        textAlign: 'left',
        maxWidth: wp('40%'),
        color: Colors.LightGrayColor,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_16
    },
    titleProduct: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_14
    },
    titleProd: {
        textAlign: 'left',
        maxWidth: wp('40%'),
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_14
    },
    titleProdSale: {
        color: Colors.RedColor,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_14
    },
    titleChem: {
        color: Colors.Blue,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13
    },
    titleProductSale: {
        color: Colors.RedColor,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        left: wp('1%')
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
        width: wp('95%'),
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        backgroundColor: Colors.White,
        borderRadius: wp('4%'),
        paddingVertical: hp('0%'),
        marginTop: Platform.OS == 'android' ? hp('2%') : hp('7%')
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
    countValue: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    detail: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    arrowQ: {
        width: wp('12%'),
        alignItems: 'center',
        alignItems: 'flex-end'
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
    swapText: {
        color: Colors.MainThemeColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    }
})

export default DetailSheetPop
