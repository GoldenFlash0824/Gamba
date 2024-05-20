import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Text, View, FlatList, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import {getHeaders, getDistanceFromLatLonInMiles} from '../../../utils/helpers'
import Loader from '../../../components/components/common/Spinner'
import ProductCard from '../../../components/components/common/ProductCard'
import ShowAlert from '../../../components/components/common/ShowAlert'
import DetailSheetPop from '../../../components/components/common/DetailSheetPop'
import ChemicalsDetailUsed from '../../../components/components/common/ChemicalsDetailUsed'

const SoldProductsScreen = ({navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [productsData, setProductsData] = useState([])
    const [productDetailItem, setProductDetailItem] = useState({})
    const [loading, setLoading] = useState(false)
    const isFocused = useIsFocused()
    const detailSheetRef = useRef()
    const chemicalDetailSheetRef = useRef()

    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                await allProductsHandler()
            }
            func()
        }
    }, [isFocused])

    const allProductsHandler = async () => {
        await postHandler()
    }

    const postHandler = async () => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .get(`user/seller_order_data`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let sold = response.data.data.data
                        for (let i = 0; i < sold.length; i++) {
                            let _distance = null
                            sold[i].user.lat && sold[i].user.log && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, sold[i].user.lat, sold[i].user.log)) : null
                            sold[i].userDistance = _distance ? _distance : 0
                            sold[i].user = userData
                        }
                        setProductsData(sold)
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

    const markFavouriteHandlerApi = async (item) => {
        setLoading(true)
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .post('user/product/mark_favorite', {product_id: item.id}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        const _productData = productsData.map((itm) => {
                            if (item.id == itm.id) {
                                itm.isFev = itm.isFev == 0 ? 1 : 0
                            }
                            return itm
                        })
                        setProductsData(_productData)
                        setLoading(false)
                        // ShowAlert({type: 'success', description: response.data.message})
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

    const handlerOpenSheet = (item) => {
        setProductDetailItem(item)
        setTimeout(() => {
            detailSheetRef.current.open()
        }, 200)
    }
    const closeHandlerDetail = () => {
        detailSheetRef.current.close()
    }
    const onClose = () => {
        detailSheetRef.current.close()
    }

    const handlerOpenChemSheet = () => {
        detailSheetRef.current.close()
        setTimeout(() => {
            chemicalDetailSheetRef.current.open()
        }, 200)
    }
    const closeHandlerChemicalDetail = () => {
        chemicalDetailSheetRef.current.close()
    }
    const onCloseChem = () => {
        chemicalDetailSheetRef.current.close()
    }

    const renderSoldProducts = ({item, index}) => {
        return <ProductCard index={index} item={item} type={'Products'} userId={userData.id} soldBy={true} favouriteP={() => markFavouriteHandlerApi(item)} openDetail={() => handlerOpenSheet(item)} productPP={() => handlerOpenSheet(item)} onPressDS={() => handlerOpenSheet(item)} cardSecTrue={false} />
    }

    return (
        <View style={styles.bodyM}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title={'Sold Products'} />
            {productsData.length > 0 ? (
                <View style={styles.listContainer}>
                    <FlatList data={productsData} renderItem={renderSoldProducts} contentContainerStyle={styles.flatListBottom} showsVerticalScrollIndicator={false} />
                </View>
            ) : (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            )}
            <DetailSheetPop setRef={detailSheetRef} onCloseCB={closeHandlerDetail} height={hp('100%')} onPress={onClose} itemCB={productDetailItem} postShowCB={true} titleTab={'Product'} OnPressChem={handlerOpenChemSheet} />
            <ChemicalsDetailUsed setRef={chemicalDetailSheetRef} onCloseCB={closeHandlerChemicalDetail} height={hp('100%')} onChe={onCloseChem} itemCB={productDetailItem} />
        </View>
    )
}

const styles = StyleSheet.create({
    bodyM: {
        width: wp('100%'),
        flex: 1,
        backgroundColor: Colors.White
    },

    listContainer: {
        width: wp('100%'),
        alignItems: 'center',
        top: hp('1%'),
        paddingBottom: Platform.OS == 'android' ? hp('8') : hp('15')
    },
    flatListBottom: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('5') : hp('10')
    },
    noDataWraper: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('70%'),
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SoldProductsScreen
