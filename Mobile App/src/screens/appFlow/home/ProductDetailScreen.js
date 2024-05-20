import React, {useEffect, useState, useRef} from 'react'
import {Platform, StyleSheet, Text, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import Header from '../../../components/components/common/Header'
import Loader from '../../../components/components/common/Spinner'
import ProductCard from '../../../components/components/common/ProductCard'
import {storeCartData} from '../../../services/store/actions'
import {getHeaders} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import DetailSheetPop from '../../../components/components/common/DetailSheetPop'
import TradeDetailSheet from '../../../components/components/common/TradeDetailSheet'
import ReportedBottomSheet from '../../../components/components/common/ReportedBottomSheet'
import EditBottomSheet from '../../../components/components/common/EditBottomSheet'

const ProductDetailScreen = ({navigation, route}) => {
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [productsData, setProductsData] = useState()
    const params = route.params

    const dispatch = useDispatch()
    const isFocused = useIsFocused()
    const detailSheetRef = useRef()
    const contactSheetRefTrade = useRef()
    const reportedSheetref = useRef()
    const profileOptionsSheetRef = useRef()

    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                params?.id ? await postHandler() : null
            }
            func()
        }
    }, [isFocused])
    const postHandler = async () => {
        const headers = getHeaders(userData.auth_token)
        const config = {
            headers: headers,
            params: {page: 1}
        }
        setLoading(true)
        try {
            await axios
                .post(`user/product/get_product_by_id`, {product_id: params?.id}, config)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setProductsData(response.data.data)
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

    const closeHandlerDetail = () => {
        detailSheetRef.current.close()
    }

    const onClose = () => {
        detailSheetRef.current.close()
    }

    const handlerOpenSheet = () => {
        detailSheetRef.current.open()
    }
    const onCloseTrade = () => {
        contactSheetRefTrade.current.close()
    }
    const handlerOpenSheetTrade = () => {
        contactSheetRefTrade.current.open()
    }

    const reportHandlerApi = (reason = '') => {
        reportedSheetref.current.close()
        setTimeout(async () => {
            const headers = getHeaders(userData.auth_token)
            setLoading(true)
            try {
                await axios
                    .post('admin/reported_product', {u_id: userData.id, product_id: productsData.id, reason: reason}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            ShowAlert({type: 'success', description: response.data.message})
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
        }, 200)
    }

    const cartHandler = (itm, qnt) => {
        let _item = {id: itm.id, name: itm.name.trimStart(), price: itm.discount > 0 ? (itm.price - (itm.price * itm.discount) / 100).toFixed(1) : itm.price, quantity: parseInt(qnt), img: itm.images[0], caption: itm.caption, user: itm.user}
        dispatch(storeCartData(_item))
    }

    const backHandler = () => {
        navigation.goBack()
    }
    const reportHandlerSheet = () => {
        profileOptionsSheetRef.current.close()
        setTimeout(() => {
            reportedSheetref.current.open()
        }, 200)
    }
    return (
        <View style={styles.body}>
            <Header back={false} backCB={backHandler} right={false} />
            <Loader visible={loading} />
            {!productsData ? (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    <ProductCard index={1} item={productsData} type={'Products'} donation={productsData.is_donation} sale={productsData.discount > 0 ? true : false} trade={productsData.is_trade} allProductInput={true} allProduct={!productsData.is_donation && !productsData.is_trade && !productsData.discount > 0} reportLikeDo={() => null} openDetail={() => handlerOpenSheet()} addToCartCB={cartHandler} reportP={() => null} onPressDS={() => handlerOpenSheet()} onDotPress={() => profileOptionsSheetRef.current.open()} userId={userData.id} tradePress={() => handlerOpenSheetTrade()} onPressTP={() => handlerOpenSheet()} donationP={() => handlerOpenSheetTrade()} profile={true} cardSecTrue={false} />
                </View>
            )}
            <EditBottomSheet setRef={profileOptionsSheetRef} report={'Report'} skipButtonCB={() => profileOptionsSheetRef.current.close()} height={hp('32%')} editSheet={true} cancelTrue={true} reportThis={true} reportCB={reportHandlerSheet} />
            <ReportedBottomSheet setRef={reportedSheetref} height={hp('40%')} reportCB={reportHandlerApi} title={'Report Product'} />
            <DetailSheetPop setRef={detailSheetRef} onCloseCB={closeHandlerDetail} height={hp('100%')} onPress={onClose} itemCB={productsData} postShowCB={true} titleTab={'Sale'} />
            <TradeDetailSheet setRef={contactSheetRefTrade} onCloseCB={onCloseTrade} itemCB={productsData} height={hp('100%')} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('100%'),
        alignItems: 'center'
    },
    listContainer: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('25') : hp('30')
    },
    noDataWraper: {
        width: wp('100%'),
        height: hp('70%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    }
})

export default ProductDetailScreen
