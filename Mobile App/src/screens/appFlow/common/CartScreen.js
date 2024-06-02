import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Platform, ScrollView} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import axios from 'axios'
import {connect, useSelector} from 'react-redux'
import {useIsFocused} from '@react-navigation/native'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import CartItems from '../../../components/components/common/CartItems'
import ActiveButton from '../../../components/components/common/ActiveButton'
import Loader from '../../../components/components/common/Spinner'
import ShowAlert from '../../../components/components/common/ShowAlert'
import MainHeader from '../../../components/components/common/MainHeader'
import {separatorHeight, getHeaders} from '../../../utils/helpers'

const CartScreen = ({navigation}) => {
    const {cartData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [client, setClient] = useState('')
    const [items, setItems] = useState([1])
    const [_data, _setData] = useState([])
    const [subTotal, setSubTotal] = useState(0)
    const [gratuity, setGratuity] = useState('')
    const [paymentMetohd, setPaymentMethod] = useState('')
    const [label, setLabel] = useState('')
    const [currency, setCurrency] = useState('$')
    const sum = cartData.reduce((accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity, 0)

    const doCheckOut = async () => {
        let finalCartData = []
        for (let i = 0; i < cartData.length; i++) {
            finalCartData.push({id: cartData[i].id, quantity: cartData[i].quantity, price: +cartData[i].price, user: cartData[i].user, discountPrice: +cartData[i].price})
        }
        navigation.navigate('PaymentMethodScreen', {
            _cartData: finalCartData,
            total: sum
        })
    }

    const doUpdateSale = async () => {
        const data = {}
        try {
        } catch (error) {
            setLoading(false)
            ShowAlert({type: 'error', description: error?.response?.data?.message})
        }
    }
    // “delivery_charges”: 0,
    // “service_charges”: 0,
    // “total”:10,
    // “products”:[
    //             {
    //             “id”:1,
    //             “quantity”:1
    //         },
    //         {
    //             “id”:2,
    //             “quantity”:2
    //         }]

    const paymentMethodNavigationHandler = () => {
        if (items.length > 0) {
            navigation.setParams({type: null})
            navigation.navigate('PaymentMethodScreen', {
                total: subTotal,
                gratuity: gratuity,
                method: paymentMetohd,
                label: label
            })
        }
    }

    const rightDrawerHandler = () => navigation.getParent('RightDrawer').openDrawer()

    const leftDrawerHandler = () => navigation.getParent('LeftDrawer').openDrawer()

    const notificationHandler = () => navigation.navigate('NotificationScreen')

    const chatHandler = () => navigation.navigate('ChatScreen')

    return (
        <View style={styles.screen}>
            <MainHeader back={true} notificationCount={0} rightDrawerCB={rightDrawerHandler} leftDrawerCB={leftDrawerHandler} notificationCB={notificationHandler} chatCB={chatHandler} />
            <Loader visible={loading} />
            <View style={styles.topArea}>
                {cartData.length > 0 ? (
                    <>
                        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                            {cartData.map((item, index) => {
                                return <CartItems item={item} key={index} />
                            })}
                            {separatorHeight()}
                            <View style={styles.midTextContainer}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cartText}>{'Subtotal:'}</Text>
                                    <Text style={styles.totalText}>
                                        {currency}
                                        {parseFloat(subTotal).toFixed(2)}
                                    </Text>
                                </View>

                                <View style={styles.textContainer}>
                                    <Text style={styles.cartText}>{'Delivery Charges:'}</Text>
                                    <Text style={styles.totalText}>
                                        {currency}
                                        {parseFloat(subTotal).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cartText}>{'Discount:'}</Text>
                                    <Text style={styles.totalText}>
                                        {currency}
                                        {parseFloat(subTotal).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.totTextBold}>{'Total'}</Text>
                                <Text style={styles.totalAmountBold}>
                                    {currency}
                                    {parseFloat(sum ? sum : 0).toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.bottomArea}>
                                <ActiveButton title={'CheckOut'} onPress={() => doCheckOut()} style={styles.button} textStyle={styles.buttonText} />
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    <View style={styles.midContainer}>
                        <View style={styles.backgroundContainer}>
                            <FastImage source={require('../../../assets/icons/screens/cartLogo.png')} resizeMode="contain" style={styles.cartIcon} tintColor={Colors.GrayLight} />
                            <Text style={styles.noItemText}>{'empty cart'}</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        flex: 1,
        alignItems: 'center'
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('5%'),
        backgroundColor: Colors.White,

        paddingVertical: hp('1%')
    },
    scrollBody: {alignItems: 'center', paddingBottom: hp('10')},

    topArea: {
        width: wp('100%'),
        flex: 1,
        alignItems: 'center'
    },

    itemText: {
        width: wp('40%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },

    qntText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    midTextContainer: {
        width: wp('92'),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: Colors.BorderGrey,
        borderBottomWidth: wp(0.2),
        borderTopColor: Colors.BorderGrey,
        borderTopWidth: wp(0.2),
        paddingVertical: hp('1')
    },
    midContainer: {
        flex: 1,
        height: hp('30%'),
        width: wp('100'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartIcon: {
        width: wp('20%'),
        height: wp('20%')
    },
    noItemText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingVertical: hp('1%')
    },

    cartText: {
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    textContainer: {
        alignSelf: 'center',
        width: wp('92%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: hp('.5')
    },

    totalText: {
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    totTextBold: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    totalAmountBold: {
        color: Colors.MainThemeColor,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    button: {
        width: wp('92%'),
        backgroundColor: Colors.White,
        borderColor: Colors.MainThemeColor,
        borderWidth: wp('.3'),
        marginTop: hp('2%')
    },
    buttonText: {
        color: Colors.MainThemeColor,
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_FAMILY_BOLD
    }
})

export default CartScreen
