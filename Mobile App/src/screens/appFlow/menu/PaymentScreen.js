import {View, Text, StyleSheet, Linking, TouchableOpacity, Pressable} from 'react-native'
import React, {useState, useEffect} from 'react'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {WebView} from 'react-native-webview'
import FastImage from 'react-native-fast-image'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import * as Typography from '../../../constants/typography'
import * as Colors from '../../../constants/colors'
import Header from '../../../components/components/common/Header'
import {getHeaders} from '../../../utils/helpers'
import {storeUserData} from '../../../services/store/actions'
import ShowAlert from '../../../components/components/common/ShowAlert'
import Loader from '../../../components/components/common/Spinner'

const PaymentScreen = ({navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [showStripe, setShowStripe] = useState('')
    const [loading, setLoading] = useState(false)
    const [alreadyConnected, setAlreadyConnected] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setAlreadyConnected(userData.stripe_account_verified)
    }, [])
    const backHandler = () => navigation.goBack()

    const connectToStripe = async () => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .get(`user/checkout/connect_to_stripe`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setShowStripe(response.data.data.url)
                        setLoading(false)
                    } else {
                        setLoading(false)
                        ShowAlert({type: 'error', description: response.data.message})
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    ShowAlert({type: 'error', description: error.message})
                })
        } catch (e) {
            setLoading(false)
            ShowAlert({type: 'error', description: e.message})
        }
    }
    const retirvUserAccount = async (id) => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .post(`user/checkout/user_account`, {id}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        dispatch(storeUserData(response.data.data))
                        setAlreadyConnected(response.data.data.stripe_account_verified)

                        setLoading(false)
                    } else {
                        setLoading(false)
                        ShowAlert({type: 'error', description: response.data.message})
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    ShowAlert({type: 'error', description: error.message})
                })
        } catch (e) {
            setLoading(false)
            ShowAlert({type: 'error', description: e.message})
        }
    }

    const removeConnectedAccount = async () => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .get(`user/checkout/remove_connected_account`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        dispatch(storeUserData(response.data.data))
                        setAlreadyConnected(response.data.data.stripe_account_verified == 0 ? false : true)
                        setLoading(false)
                    } else {
                        setLoading(false)
                        ShowAlert({type: 'error', description: response.data.message})
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    ShowAlert({type: 'error', description: error.message})
                })
        } catch (e) {
            setLoading(false)
            ShowAlert({type: 'error', description: e.message})
        }
    }

    const handleWebViewNavigationStateChange = async (newNavState) => {
        const {url} = newNavState
        if (!url) return
        if (url.includes('gambaui')) {
            setShowStripe('')
            const id = url.substring(url.lastIndexOf('=') + 1)
            await retirvUserAccount(id)
        }
    }

    const openStripUrl = () => {
        const mapLink = 'https://dashboard.stripe.com/register'
        Linking.openURL(mapLink)
    }

    return showStripe == '' ? (
        <View style={styles.container}>
            <Loader visible={loading} />
            <Header back={true} backCB={backHandler} title={'Payment'} />
            <View style={styles.heightContainerBtn}>
                <Text style={styles.itemSoldTxt}>
                    {'If you are a seller and would like to sell your products on Gamba, you need to have a Strip account. If you do not have an account, please go to'} {/* <Pressable > */}
                    <Text style={styles.stirpeColor} onPress={() => openStripUrl()}>
                        {' Stripe'}
                    </Text>
                    {' to create one. If you have an account '}
                    <Text style={styles.stirpeColor} onPress={() => connectToStripe()}>
                        {'Link'}
                    </Text>
                    {' it here. Every product that is sold is processed by Stripe, and the money is transferred straight into your Stripe account. Please refer to the'}
                    <Text style={styles.sellerAgrementColor} onPress={() => navigation.navigate('SellersRefundAgreementScreen')}>
                        {' seller agreement '}
                    </Text>
                    {'for additional information regarding payments and fees.'}
                </Text>
                <View style={styles.backgroundContainer}>
                    <TouchableOpacity style={styles.itemContainer}>
                        <View style={styles.stripeStyle}>
                            <FastImage source={require('../../../assets/icons/screens/st.png')} style={styles.iconStyle} resizeMode="contain" />
                        </View>

                        <Text style={styles.titleMentioned} numberOfLines={1}>
                            {'Stripe'}
                        </Text>
                        <View style={styles.linkContainer}>
                            <Text style={styles.linkTxt} numberOfLines={1} onPress={alreadyConnected ? removeConnectedAccount : connectToStripe}>
                                {alreadyConnected ? 'Remove Linked Account' : 'Link Card'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* <Text style={styles.itemSoldPer}>{"You must submit a valid credit card to cover Gamba's 12% fee in order to sell products on Gamba."}</Text> */}
                </View>
            </View>
        </View>
    ) : (
        <WebView source={{uri: showStripe}} style={{flex: 1}} javaScriptEnabled={true} domStorageEnabled={true} startInLoadingState={true} onNavigationStateChange={handleWebViewNavigationStateChange} onContentProcessDidTerminate={(event) => (console.log('===event', event), setShowStripe(''))} />
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        flex: 1,
        alignItems: 'center'
    },

    heightContainerBtn: {
        width: wp('100%'),
        alignItems: 'center',
        flex: 1
    },
    outsideContainer: {
        width: wp('100%'),
        flex: 1
    },
    titleAdd: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    addCard: {
        width: wp('86%'),
        alignItems: 'flex-end',
        marginTop: hp('1%')
    },

    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('3%'),
        backgroundColor: Colors.White
    },
    activeBtn: {
        width: wp('92%')
    },
    itemContainer: {
        backgroundColor: Colors.White,
        flexDirection: 'row',
        paddingTop: hp('2%'),
        paddingBottom: hp('2%'),
        width: wp('92%'),
        borderWidth: wp(0.2),
        borderColor: Colors.BorderGrey,
        justifyContent: 'space-between',
        paddingHorizontal: wp('2'),
        alignItems: 'center',
        borderRadius: wp(4)
    },
    iconStyle: {
        width: wp('3%'),
        height: wp('3%')
    },
    stripeStyle: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: wp('1%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.DarkPepper_20,
        borderWidth: 1
    },
    titleMentioned: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        width: wp('30%')
    },
    itemSoldTxt: {
        width: wp('92%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    stirpeColor: {
        color: Colors.Blue,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },

    itemSoldPer: {
        width: wp('92%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        marginTop: hp('4%')
    },
    linkContainer: {
        width: wp('50%'),
        alignItems: 'flex-end'
    },
    linkTxt: {
        color: Colors.Blue,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textDecorationLine: 'underline'
    },
    sellerAgrementColor: {
        color: Colors.Blue,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        textDecorationLine: 'underline'
    }
})

export default PaymentScreen
