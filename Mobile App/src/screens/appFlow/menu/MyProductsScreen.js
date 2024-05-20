import React, {useEffect, useState, useRef} from 'react'
import {FlatList, Platform, StyleSheet, Text, View, Switch, RefreshControl} from 'react-native'
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
import {getHeaders, separatorHeightH} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import EditBottomSheet from '../../../components/components/common/EditBottomSheet'
import AddSheetSell from '../../../components/components/common/AddSheetSell'
import DetailSheetPop from '../../../components/components/common/DetailSheetPop'
import ChemicalsDetailUsed from '../../../components/components/common/ChemicalsDetailUsed'
import ShareButton from '../../../components/components/common/ShareButton'
import ActiveButton from '../../../components/components/common/ActiveButton'

const MyProductsScreen = ({route, navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [productItem, setProductItem] = useState()
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)

    const editDeleteShhetRef = useRef()
    const addSheetRef = useRef()
    const detailSheetRef = useRef()

    const [productsData, setProductsData] = useState([])
    const [productDetailItem, setProductDetailItem] = useState({})
    const [refreshing, setRefreshing] = useState(false)

    const dispatch = useDispatch()
    const isFocused = useIsFocused()
    const chemicalDetailSheetRef = useRef()
    const contactSheetRefTrade = useRef()

    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                await postHandler()
            }
            func()
        } else {
            setNextPageToken(1)
            setShowLoadMore(false)
        }
    }, [isFocused])
    //
    const postHandler = async (page = 1) => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .get(`user/product/get_user_products?page=${page}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setShowLoadMore(response.data.data.length >= 15)

                        let produc = response.data.data
                        for (let i = 0; i < produc.length; i++) {
                            produc[i].user = userData
                            produc[i].userDistance = 0.0
                        }
                        if (page > 1) {
                            setProductsData(productsData.concat(produc))
                            setLoading(false)
                        } else {
                            setProductsData(produc)
                            setLoading(false)
                        }
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

    const deleteHandler = async (user) => {
        editDeleteShhetRef.current.close()
        const headers = getHeaders(userData.auth_token)

        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .delete(`user/product/delete_product_good/${productItem.id}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            const _productsData = productsData.filter((item) => {
                                return item.id != productItem.id
                            })
                            setProductsData(_productsData)
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
        }, 200)
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

    const onRefresh = async () => {
        await postHandler(nextPageToken)
        setRefreshing(false)
    }
    openConferHnadler = (item) => {
        setProductItem(item)
        setTimeout(() => {
            editDeleteShhetRef.current.open()
        }, 200)
    }

    editHandler = () => {
        editDeleteShhetRef.current.close()
        setTimeout(() => {
            addSheetRef.current.open()
        }, 200)
    }

    const closeHandler = () => {
        addSheetRef.current.close()
        setProductItem()
    }
    const closeHandlerChemicalDetail = () => {
        chemicalDetailSheetRef.current.close()
    }
    const onCloseChem = () => {
        chemicalDetailSheetRef.current.close()
    }
    const handlerOpenChemSheet = () => {
        detailSheetRef.current.close()
        setTimeout(() => {
            chemicalDetailSheetRef.current.open()
        }, 200)
    }

    const cartHandler = (itm, qnt) => {
        let _item = {id: itm.id, name: itm.name.trimStart(), price: itm.price, quantity: parseInt(qnt), img: itm.images[0], caption: itm.caption, user: itm.user}
        dispatch(storeCartData(_item))
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
    // const handlerOpenSheetTrade = (item) => {
    //     setProductDetailItem(item)
    //     setTimeout(() => {
    //         contactSheetRefTrade.current.open()
    //     }, 200)
    // }
    const onClose = () => {
        setTimeout(() => {
            detailSheetRef.current.close()
        }, 100)
    }

    const shareHandler = () => {
        editDeleteShhetRef.current.close()
        setTimeout(() => {
            ShareButton({link: `products/${productItem.is_donation ? 'donation' : productItem.discount > 0 ? 'sale' : productItem.is_trade ? 'trade' : 'product'}/${productItem.id}`, fullname: userData.first_name + ' ' + userData.last_name})
        }, 200)
    }
    // const onCloseTrade = () => {
    //     contactSheetRefTrade.current.close()
    // }

    const renderProducts = ({item, index}) => {
        return <ProductCard index={index} item={item} organic={false} favouriteP={() => markFavouriteHandlerApi(item)} type={'Products'} editDeleteProduct={true} donation={item.is_donation} sale={item.discount > 0 ? true : false} trade={item.is_trade} addToCartCB={cartHandler} allProductInput={true} reportLikeDo={() => null} openDetail={() => handlerOpenSheet(item)} productPP={() => handlerOpenSheet(item)} onPressDS={() => handlerOpenSheet(item)} profile={true} onDotPress={() => openConferHnadler(item)} userId={userData.id} tradePress={() => handlerOpenSheet(item)} onPressTP={() => handlerOpenSheet(item)} donationP={() => handlerOpenSheet(item)} cardSecTrue={false} />
    }
    const doFetchMoreProducts = async () => {
        setNextPageToken(nextPageToken + 1)
        await postHandler(nextPageToken + 1)
    }
    const renderFooter = () => {
        return showLoadMore && <ActiveButton style={styles.moreButton} title="Load More" onPress={() => doFetchMoreProducts()} />
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title={'My Products'} />
            {separatorHeightH()}
            {productsData.length == 0 ? (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    <FlatList data={productsData} renderItem={renderProducts} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={styles.flatListBottom} showsVerticalScrollIndicator={false} ListFooterComponent={renderFooter} />
                </View>
            )}
            <EditBottomSheet setRef={editDeleteShhetRef} share={'Share'} hide={'Delete'} report={'Edit'} skipTitle={'Cancel'} skipButtonCB={() => editDeleteShhetRef.current.close()} height={hp('35%')} deleteEventCB={deleteHandler} editSheet={true} cancelTrue={true} reportCB={editHandler} hideShow={true} reportThis={true} deleteEvent={true} editEvent={true} shareShow={true} editCB={shareHandler} />
            <AddSheetSell setRef={addSheetRef} onCloseCB={closeHandler} title={'Sell Goods'} editProductData={productItem} />
            <DetailSheetPop setRef={detailSheetRef} onCloseCB={closeHandlerDetail} height={hp('100%')} onPress={onClose} itemCB={productDetailItem} postShowCB={true} titleTab={'Product'} OnPressChem={handlerOpenChemSheet} />
            <ChemicalsDetailUsed setRef={chemicalDetailSheetRef} onCloseCB={closeHandlerChemicalDetail} height={hp('100%')} onChe={onCloseChem} itemCB={productDetailItem} />
            {/* <TradeDetailSheet setRef={contactSheetRefTrade} onCloseCB={onCloseTrade} itemCB={productDetailItem} height={hp('100%')} /> */}
        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        flex: 1,
        alignItems: 'center'
    },
    flatListBottom: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('6') : hp('3')
    },
    tabContainer: {
        width: wp('92%'),
        flexDirection: 'row',
        height: hp(4.2),
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.White
    },
    listContainer: {
        width: wp('100%'),
        alignItems: 'center',
        flex: 1
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
    },
    moreButton: {
        alignSelf: 'center',
        marginTop: hp('1%'),
        width: wp(92)
    }
})

export default MyProductsScreen
