import React, {useEffect, useState, useRef} from 'react'
import {FlatList, Platform, StyleSheet, Text, View, RefreshControl} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigation} from '@react-navigation/native'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import Loader from '../../../components/components/common/Spinner'
import ProductCard from '../../../components/components/common/ProductCard'
import {storeCartData} from '../../../services/store/actions'
import {getHeaders, separatorHeightH, getDistanceFromLatLonInMiles} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import DetailSheetPop from './DetailSheetPop'
import ChemicalsDetailUsed from './ChemicalsDetailUsed'
import TradeDetailSheet from './TradeDetailSheet'
import ReportedBottomSheet from './ReportedBottomSheet'
import EditBottomSheet from './EditBottomSheet'
import ActiveButton from './ActiveButton'
import ModalContect from './ModalContect'
import ShareButton from '../../../components/components/common/ShareButton'

const DonationData = ({route}) => {
    const {userData, changeCard} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)

    const [productsData, setProductsData] = useState([])
    const [productsDataCopy, setProductsDataCopy] = useState([])
    const [productDetailItem, setProductDetailItem] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)
    const [modalVisible, setModalVisible] = useState(false)
    const dispatch = useDispatch()
    const {navigate} = useNavigation()

    const detailSheetRef = useRef()
    const chemicalDetailSheetRef = useRef()
    const contactSheetRefTrade = useRef()
    const reportedSheetref = useRef()
    const profileOptionsSheetRef = useRef()

    useEffect(() => {
        if (route.ind == 3 && route.searching == '') {
            const func = async () => {
                route.ind == 3 ? await postHandler(route.organic) : null
            }
            func()
        } else if (route.ind == 3 && route.searching != '') {
            onChangeSearchBar(route.searching)
        } else {
            setShowLoadMore(false)
        }
    }, [route.organic, route.searching, route.ind])
    const postHandler = async (is_organic = false, page = 1) => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .get(`user/product/get_all_products?is_trade=0&is_discount=0&is_donation=1&is_organic=${is_organic}&page=${page}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let allProductsData = response.data.data
                        for (let i = 0; i < allProductsData.length; i++) {
                            let _distance = null
                            allProductsData[i].user.lat && allProductsData[i].user.log && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, allProductsData[i].user.lat, allProductsData[i].user.log)) : null
                            allProductsData[i].userDistance = _distance ? _distance : 0
                        }
                        if (page > 1) {
                            setProductsData(productsData.concat(allProductsData))
                            setProductsDataCopy(productsDataCopy.concat(allProductsData))
                        } else {
                            setProductsData(allProductsData)
                            setProductsDataCopy(allProductsData)
                        }
                        setShowLoadMore(allProductsData.length >= 15)
                        setNextPageToken(page)
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

    const onChangeSearchBar = async (text) => {
        if (text.length > 2) {
            const headers = getHeaders(userData.auth_token)
            try {
                await axios
                    .get(`user/product/search_products?is_trade=0&is_donation=1&is_discount=0&is_organic=${route.organic}&filter=${text}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            let allProductsData = response.data.data
                            for (let i = 0; i < allProductsData.length; i++) {
                                let _distance = null
                                allProductsData[i].user.lat && allProductsData[i].user.log && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, allProductsData[i].user.lat, allProductsData[i].user.log)) : null
                                allProductsData[i].distance = _distance ? _distance : 0
                            }
                            setProductsData(allProductsData)
                            setLoading(false)
                        } else {
                            setLoading(false)
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
        } else if (text.length == 0) {
            setProductsData(productsDataCopy)
        }
    }

    const markFavouriteHandlerApi = async (item) => {
        setLoading(true)
        const headers = getHeaders(userData.auth_token)

        if (item.id) {
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
    }

    const reportHandlerApi = (reason = '') => {
        reportedSheetref.current.close()
        setTimeout(async () => {
            const headers = getHeaders(userData.auth_token)
            setLoading(true)
            try {
                await axios
                    .post('admin/reported_product', {u_id: userData.id, product_id: productDetailItem.id, reason: reason}, headers)
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

    const closeHandlerDetail = () => {
        detailSheetRef.current.close()
    }
    const onCloseD = () => {
        contactSheetRefTrade.current.close()
    }

    const onClose = () => {
        detailSheetRef.current.close()
    }

    const handlerOpenSheet = (item) => {
        setProductDetailItem(item)
        setTimeout(() => {
            detailSheetRef.current.open()
        }, 200)
    }

    const closeHandlerChemicalDetail = () => chemicalDetailSheetRef.current.close()

    const onCloseChem = () => chemicalDetailSheetRef.current.close()

    const handlerOpenChemSheet = () => {
        detailSheetRef.current.close()
        setTimeout(() => chemicalDetailSheetRef.current.open(), 200)
    }

    const cartHandler = (itm, qnt) => {
        let _item = {id: itm.id, name: itm.name.trimStart(), price: 0, quantity: parseInt(qnt), img: itm.images[0], caption: itm.caption, user: itm.user}
        dispatch(storeCartData(_item))
    }
    const reportDotHandler = (item) => {
        setProductDetailItem(item)
        setTimeout(() => profileOptionsSheetRef.current.open(), 200)
    }
    const reportHandlerSheet = () => {
        profileOptionsSheetRef.current.close()
        setTimeout(() => reportedSheetref.current.open(), 200)
    }

    const closeCBProfile = () => profileOptionsSheetRef.current.close()

    const renderProducts = ({item, index}) => {
        return <ProductCard index={index} item={item} organic={route.organic} type={'Products'} donation={true} addToCartCB={cartHandler} allProductInput={true} reportLikeDo={() => null} openDetail={() => handlerOpenSheet(item)} onPressDS={() => handlerOpenSheet(item)} donationP={() => handlerOpenSheet(item)} userId={userData.id} favouriteP={() => markFavouriteHandlerApi(item)} profile={true} onDotPress={() => reportDotHandler(item)} cardSecTrue={changeCard} donationPP={() => handlerOpenSheetDonation(item)} />
    }
    const onRefresh = async () => {
        await postHandler(route.organic, nextPageToken)
        setRefreshing(false)
    }
    const doFetchMoreProducts = async () => {
        await postHandler(route.organic, nextPageToken + 1)
    }
    const renderFooter = () => {
        return showLoadMore && route.searching == '' && <ActiveButton style={styles.moreButton} title="Load More" onPress={() => doFetchMoreProducts()} />
    }

    const handlerOpenSheetDonation = (item) => {
        setProductDetailItem(item)
        setTimeout(() => setModalVisible(true), 200)
    }

    const chatScreenHCB = () => {
        detailSheetRef.current.close()
        setTimeout(() => navigate('ChatRoomScreen', {userId: productDetailItem.user}), 200)
    }
    const closeModal = (typ) => {
        setModalVisible(!modalVisible)
        typ === 'chat' ? setTimeout(() => navigate('ChatRoomScreen', {userId: productDetailItem.user}), 200) : null
    }

    const shareHandler = () => {
        ShareButton({link: `post/${productDetailItem.id}`, fullname: userData.first_name + ' ' + userData.last_name})
    }
    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            {separatorHeightH()}
            {productsData.length == 0 ? (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    <FlatList data={productsData} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} renderItem={renderProducts} contentContainerStyle={styles.flatListBottom} showsVerticalScrollIndicator={false} ListFooterComponent={renderFooter} />
                </View>
            )}
            <EditBottomSheet
                setRef={profileOptionsSheetRef}
                report={'Report'}
                skipButtonCB={closeCBProfile}
                share={'Share'}
                shareShow={true}
                editCB={() => {
                    profileOptionsSheetRef.current.close()
                    setTimeout(() => {
                        shareHandler()
                    }, 200)
                }}
                height={hp('25%')}
                editSheet={true}
                cancelTrue={true}
                reportThis={true}
                reportCB={reportHandlerSheet}
            />
            <ReportedBottomSheet setRef={reportedSheetref} height={hp('40%')} reportCB={reportHandlerApi} title={'Report Product'} />
            <DetailSheetPop setRef={detailSheetRef} onCloseCB={closeHandlerDetail} height={hp('100%')} onPress={onClose} itemCB={productDetailItem} titleTab={'Donation'} OnPressChem={handlerOpenChemSheet} chatCb={chatScreenHCB} />
            <ChemicalsDetailUsed setRef={chemicalDetailSheetRef} onCloseCB={closeHandlerChemicalDetail} height={hp('100%')} onChe={onCloseChem} itemCB={productDetailItem} />
            <TradeDetailSheet setRef={contactSheetRefTrade} onCloseCB={onCloseD} itemCB={productDetailItem} height={hp('100%')} />
            {modalVisible && <ModalContect modalVisible={modalVisible} onRequestClose={closeModal} item={productDetailItem} />}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        height: hp('100%'),
        alignItems: 'center'
    },
    labelStyleSmall: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_11,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        // backgroundColor: 'yellow',
        textTransform: 'capitalize'
    },
    flatListBottom: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('15') : hp('17')
    },
    labelContainer: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        padding: 0
    },
    tabContainerW: {
        width: wp('100%'),
        alignItems: 'center',
        backgroundColor: Colors.White
    },
    tabContainer: {
        width: wp('92%'),
        flexDirection: 'row',
        height: hp(4.2),
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.White
    },
    searchToglleRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('92%'),
        paddingBottom: hp('1'),
        maxWidth: wp('92%')
    },
    toggleStyleView: {
        alignItems: 'center'
        // backgroundColor: 'green'
    },
    communityList: {
        width: wp('98%'),
        paddingVertical: hp('1'),
        backgroundColor: Colors.White
    },
    topContainer: {
        width: wp('100%'),
        backgroundColor: Colors.White,
        alignItems: 'center'
    },
    inputWithHeightView: {
        width: wp('92%'),
        backgroundColor: 'green'
    },
    toggoleContainer: {
        backgroundColor: 'red'
    },
    listContainer: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('25') : hp('30')
    },
    listContainercommunity: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('25') : hp('30')
    },
    topIcons: {
        width: wp('100%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: hp('5'),
        borderBottomColor: Colors.BorderGrey,
        borderBottomWidth: wp('.3')
    },
    iconsStyle: {
        height: wp('8%'),
        width: wp('8%')
    },
    tradeInpute: {
        width: wp('92%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: hp('1')
    },
    tradeTextInput: {
        width: wp('45%'),
        height: hp('6%')
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
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    moreButton: {
        alignSelf: 'center',
        marginTop: hp('1%'),
        width: wp(92)
    }
})

export default DonationData
