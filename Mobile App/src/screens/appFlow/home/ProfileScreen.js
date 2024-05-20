import React, {useState, useEffect, useRef} from 'react'
import {View, StyleSheet, FlatList, Text, TouchableOpacity, ScrollView, LogBox, Linking, Alert} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import {useIsFocused} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Loader from '../../../components/components/common/Spinner'
import Header from '../../../components/components/common/Header'
import EditBottomSheet from '../../../components/components/common/EditBottomSheet'
import FeedCard from '../../../components/components/common/FeedCard'
import ProductCard from '../../../components/components/common/ProductCard'
import {getHeaders, separatorHeightH, getDistanceFromLatLonInMiles} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import ReportedBottomSheet from '../../../components/components/common/ReportedBottomSheet'
import DetailSheetPop from '../../../components/components/common/DetailSheetPop'
import ChemicalsDetailUsed from '../../../components/components/common/ChemicalsDetailUsed'
import TradeDetailSheet from '../../../components/components/common/TradeDetailSheet'
import AddSheetSell from '../../../components/components/common/AddSheetSell'

import {storeCartData} from '../../../services/store/actions'
import {IMAGES_BASE_URL} from '../../../services/constants'
import {letterColors} from '../../../services/helpingMethods'
import ShareButton from '../../../components/components/common/ShareButton'
import ActiveButton from '../../../components/components/common/ActiveButton'
import EventSheetProfile from '../../../components/components/common/EventSheetProfile'
import ModalContect from '../../../components/components/common/ModalContect'

const ProfileScreen = ({navigation, route}) => {
    const _userId = route.params ? route.params.userId : null

    const [expanded, setExpanded] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const {userData} = useSelector((state) => state.user)
    const [productsData, setProductsData] = useState([])
    const [currentUser, setCurrentUser] = useState()
    const [productDetailItem, setProductDetailItem] = useState({})
    const [selectedTab, setSelectedTab] = useState(true)
    const [comunityData, setCommunityData] = useState([])
    const [postItem, setPostItem] = useState()
    const [cardLoading, setCardLoading] = useState(false)
    const [isLiked, setIsLiked] = useState('')
    const [loading, setLoading] = useState(false)
    const [productItem, setProductItem] = useState()
    const [postData, setPostData] = useState()
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)

    const isFocused = useIsFocused()
    const editOptionsSheetRef = useRef()
    const profileOptionsSheetRef = useRef()
    const reportedSheetref = useRef()
    const dispatch = useDispatch()
    const detailSheetRef = useRef()
    const chemicalDetailSheetRef = useRef()
    const contactSheetRefTrade = useRef()
    const addSheetRef = useRef()
    const allLikesSheetref = useRef()
    const productSheetref = useRef()

    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                selectedTab ? await doGetUserProfile() : await doGetUserPost()
            }
            func()
            LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
        } else {
            setNextPageToken(1)
            setShowLoadMore(false)
        }
    }, [isFocused])

    const doGetUserProfile = async () => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .post(`user/get_seller_by_id`, {seller_id: parseInt(_userId)}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        const userProduct = response.data?.data?.data?.allSellers?.userProducts || []
                        const distance = response.data.data.data.allSellers.lat && response.data.data.data.allSellers.lat && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, response.data.data.data.allSellers.lat, response.data.data.data.allSellers.log)) : null
                        response.data.data.data.allSellers['distance'] = distance
                        setCurrentUser(response.data.data.data.allSellers)
                        for (let i = 0; i < userProduct.length; i++) {
                            let _distance = null
                            userProduct[i].user.lat && userProduct[i].user.log && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, userProduct[i].user.lat, userProduct[i].user.log)) : null
                            userProduct[i].userDistance = _distance ? _distance : 0
                        }
                        setProductsData(userProduct)
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
    const doGetUserPost = async (page = 1) => {
        setLoading(true)
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .post(`user/posts/seller_all_post?page=${page}`, {u_id: parseInt(_userId)}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setShowLoadMore(response.data.data.length >= 15)
                        let postsData = response.data.data
                        if (page > 1) {
                            setCommunityData(comunityData.concat(postsData))
                            setLoading(false)
                        } else {
                            setCommunityData(response.data.data)
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

    const postlikeHandler = async (item) => {
        setCardLoading(true)
        const headers = getHeaders(userData.auth_token)
        if (item.id) {
            try {
                await axios
                    .post('user/posts/add_like', {post_id: item.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            const _comunityData = comunityData.map((itm) => {
                                if (item.id == itm.id) {
                                    itm.isLiked = 1
                                    itm.total_likes_count = response.data.data.count
                                }
                                return itm
                            })
                            setCommunityData(_comunityData)
                            setCardLoading(false)
                            setIsLiked('')
                        } else {
                            setCardLoading(false)
                            ShowAlert({type: 'error', description: response.data.message})
                        }
                    })
                    .catch((error) => {
                        setCardLoading(false)
                        ShowAlert({type: 'error', description: error.message})
                    })
            } catch (e) {
                setCardLoading(false)
                ShowAlert({type: 'error', description: e.message})
            }
        }
    }

    const postUn_likeedHandler = async (item) => {
        setCardLoading(true)
        const headers = getHeaders(userData.auth_token)
        if (item.id) {
            try {
                await axios
                    .post('user/posts/un_like', {post_id: item.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            const _comunityData = comunityData.map((itm) => {
                                if (item.id == itm.id) {
                                    itm.isLiked = 0
                                    itm.total_likes_count = response.data.data.count
                                }
                                return itm
                            })
                            setCommunityData(_comunityData)
                            setCardLoading(false)
                            setIsLiked('')
                        } else {
                            setCardLoading(false)
                            ShowAlert({type: 'error', description: response.data.message})
                        }
                    })
                    .catch((error) => {
                        setCardLoading(false)
                        ShowAlert({type: 'error', description: error.message})
                    })
            } catch (e) {
                setCardLoading(false)
                ShowAlert({type: 'error', description: e.message})
            }
        }
    }

    const postAlllikeHandler = async (item) => {
        setCardLoading(true)
        const headers = getHeaders(userData.auth_token)
        if (item.id) {
            try {
                await axios
                    .post('user/posts/all_likes', {post_id: item.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setPostItem(response.data.data)
                            setTimeout(() => {
                                allLikesSheetref.current.open()
                            }, 200)
                            setCardLoading(false)
                        } else {
                            setCardLoading(false)
                            ShowAlert({type: 'error', description: response.data.message})
                        }
                    })
                    .catch((error) => {
                        setCardLoading(false)
                        ShowAlert({type: 'error', description: error.message})
                    })
            } catch (e) {
                setCardLoading(false)
                ShowAlert({type: 'error', description: e.message})
            }
        }
    }

    const handlerOpenSheet = (item) => {
        setProductDetailItem(item)
        setTimeout(() => detailSheetRef.current.open(), 200)
    }

    const closeHandlerDetail = () => {
        detailSheetRef.current.close()
    }

    const onClose = () => {
        detailSheetRef.current.close()
    }

    const handlerOpenChemSheet = () => {
        detailSheetRef.current.close()
        setTimeout(() => chemicalDetailSheetRef.current.open(), 200)
    }
    const closeHandlerChemicalDetail = () => chemicalDetailSheetRef.current.close()

    const onCloseChem = () => chemicalDetailSheetRef.current.close()

    const onCloseTrade = () => contactSheetRefTrade.current.close()

    editHandler = () => {
        editOptionsSheetRef.current.close()
        setTimeout(() => addSheetRef.current.open(), 200)
    }

    const closeHandler = () => {
        addSheetRef.current.close()
        setProductItem()
    }

    const handlerOpenSheetDonation = (item) => {
        setProductDetailItem(item)
        setModalVisible(true)
    }

    const closeModal = (typ) => {
        setModalVisible(!modalVisible)

        typ === 'chat' ? setTimeout(() => navigation.navigate('ChatRoomScreen', {userId: currentUser}), 200) : null
    }

    const reportDotHandler = (item) => {
        setProductItem(item)
        setTimeout(() => reportedSheetref.current.open(), 200)
    }
    const handlerOpenAllLikesShow = (item) => {
        postAlllikeHandler(item)
    }
    const commentScreenNavigate = (item) => {
        navigation.navigate('CommentScreen', {id: item.id})
    }

    const toggleTextExpansion = () => {
        setExpanded((prevState) => !prevState)
    }

    const onDotPressHanlder = (itm) => {
        userData?.id == itm?.user?.id ? (hideShareSheetref.current.open(), setPostData(itm)) : (productSheetref.current.open(), setPostData(itm))
    }

    const renderProducts = ({item, index}) => {
        return <ProductCard index={index} item={item} type={'Products'} profile={true} onDotPress={() => HandlerSheeetReport(item)} allProduct={!item.is_donation && !item.is_trade && !item.discount > 0} addToCartCB={cartHandler} donation={item.is_donation} sale={item.discount > 0 ? true : false} trade={item.is_trade} userId={userData.id} onPressDS={() => handlerOpenSheet(item)} openDetail={() => handlerOpenSheet(item)} productPP={() => handlerOpenSheet(item)} onPressTP={() => handlerOpenSheet(item)} tradePress={() => handlerOpenSheet(item)} donationP={() => handlerOpenSheet(item)} reportP={() => reportDotHandler(item)} favouriteP={() => markFavouriteHandlerApi(item)} cardSecTrue={false} donationPP={() => handlerOpenSheetDonation(item)} tradePressSS={() => handlerOpenSheetDonation(item)} />
    }

    const renderItem = ({item, index}) => {
        return <FeedCard item={item} index={index} community={true} editPost={true} loadingC={cardLoading} editPostPress={() => onDotPressHanlder(item)} postLikeCB={() => (postlikeHandler(item), setIsLiked(item.id))} postUnLikeCB={() => (postUn_likeedHandler(item), setIsLiked(item.id))} allLikesS={() => handlerOpenAllLikesShow(item)} chatS={() => commentScreenNavigate(item)} userId={userData.id} postId={isLiked} />
    }

    const cartHandler = (itm, qnt) => {
        let _item = {id: itm.id, name: itm.name.trimStart(), price: itm.discount > 0 ? (itm.price - (itm.price * itm.discount) / 100).toFixed(1) : itm.price, quantity: parseInt(qnt), img: itm.images[0], caption: itm.caption, user: itm.user}
        dispatch(storeCartData(_item))
    }

    const profileHideHandler = () => {
        profileOptionsSheetRef.current.close()
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .post(`user/hide_seller`, {seller_id: _userId}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            navigation.goBack()
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
    const reportHandlerApi = (reason = '') => {
        reportedSheetref.current.close()
        setTimeout(async () => {
            const headers = getHeaders(userData.auth_token)
            setLoading(true)
            if (selectedTab) {
                try {
                    await axios
                        .post('admin/reported_product', {u_id: userData.id, product_id: productItem.id, reason: reason}, headers)
                        .then(async (response) => {
                            if (response.data.success === true) {
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
            } else {
                try {
                    await axios
                        .post('admin/reported_post', {u_id: userData.id, post_id: postData.id, reason: reason}, headers)
                        .then(async (response) => {
                            if (response.data.success === true) {
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
        }, 200)
    }

    const sellerFollowHandler = async () => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .post(`user/add_seller_to_fev`, {seller_id: _userId}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let _currentUser = {...currentUser}
                        _currentUser.isFev = _currentUser.isFev == 1 ? 0 : 1
                        setCurrentUser(_currentUser)
                        setLoading(false)
                        // ShowAlert({type: 'success', description: response.data.message})
                    } else {
                        setLoading(false)
                        // ShowAlert({type: 'error', description: response.data.message})
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

    const profileHandler = () => profileOptionsSheetRef.current.open()

    const closeCBProfile = () => profileOptionsSheetRef.current.close()

    const closeCBProfileRport = () => editOptionsSheetRef.current.close()

    const reportHandlerSheet = () => {
        editOptionsSheetRef.current.close()
        setTimeout(() => reportedSheetref.current.open(), 200)
    }

    const reportHandlerSheetSell = () => {
        productSheetref.current.close()
        setTimeout(() => reportedSheetref.current.open(), 200)
    }

    const reportHandler = (item) => {
        setProductItem(item)
        setTimeout(() => editOptionsSheetRef.current.open(), 200)
    }

    const HandlerSheeetReport = (item) => {
        setProductItem(item)
        setTimeout(() => editOptionsSheetRef.current.open(), 200)
    }

    const shareHandler = () => {
        profileOptionsSheetRef.current.close()
        setTimeout(() => ShareButton({link: `products/sellers/${currentUser.id}`, fullname: userData.first_name + ' ' + userData.last_name}), 200)
    }
    const chatScreenHandler = (likedUser) => {
        navigation.navigate('ChatRoomScreen', {userId: currentUser})
    }

    const chatScreenHCB = () => {
        detailSheetRef.current.close()
        setTimeout(() => navigation.navigate('ChatRoomScreen', {userId: currentUser}), 200)
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

    const doHideHandler = () => {
        productSheetref.current.close()
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .post(`user/posts/hide_post`, {post_id: postData.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            const _comunityData = comunityData.filter((item) => {
                                return item.id !== postData.id
                            })
                            setCommunityData(_comunityData)
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
    const shareHandlerPost = () => {
        ShareButton({link: `post/${postData.id}`, fullname: userData.first_name + ' ' + userData.last_name})
    }
    const cartNavigation = () => {
        navigation.navigate('CartScreen')
    }
    const closeHandlerLikes = () => {
        allLikesSheetref.current.close()
    }

    const onCloseAllLikes = () => {
        allLikesSheetref.current.close()
    }
    const doFetchMoreData = async () => {
        setNextPageToken(nextPageToken + 1)
        selectedTab ? await doGetUserProfile() : doGetUserPost(nextPageToken + 1)
    }
    const renderFooter = () => {
        return showLoadMore && <ActiveButton style={styles.moreButton} title="Load More" onPress={() => doFetchMoreData()} />
    }
    const chatScreenHandlerL = (likedUser) => {
        allLikesSheetref.current.close()
        setTimeout(() => navigation.navigate('ChatRoomScreen', {userId: likedUser}), 200)
    }

    const openMapUrl = (currentUser) => {
        const mapLink = Platform.OS === 'android' ? `https://www.google.com/maps/dir/${userData.lat},${userData.log}/@${currentUser.lat},${currentUser.log}/${currentUser.address}` : `http://maps.apple.com/?saddr=${userData.lat},${userData.log}&daddr=@${currentUser.lat},${currentUser.log}`
        Linking.openURL(mapLink)
    }
    const profileScreenHandler = (item) => {
        allLikesSheetref.current.close()
        setTimeout(() => navigation.push('ProfileScreen', {userId: item.id}), 200)
    }
    return (
        <View style={styles.screen}>
            <Loader visible={loading} />
            {/* <Header back={true} backCB={() => navigation.goBack()} cartCB={cartNavigation} /> */}
            <Header back={true} backCB={() => navigation.goBack()} title={'Profile'} right={true} product={true} />
            <ScrollView contentContainerStyle={{alignItems: 'center'}} showsVerticalScrollIndicator={false}>
                {currentUser && (
                    <View style={styles.profileAbout}>
                        {currentUser?.id != userData.id ? (
                            <View style={{width: wp('88%'), alignItems: 'flex-end'}}>
                                <View style={styles.rowSellerChat}>
                                    <Text style={styles.seller}> {''}</Text>
                                    {currentUser?.id != userData.id && (
                                        <TouchableOpacity style={styles.followS} onPress={sellerFollowHandler}>
                                            {currentUser?.isFev == 1 ? <FastImage source={require('../../../assets/icons/screens/network_new.png')} style={styles.followSeller} resizeMode="contain" /> : <FastImage source={require('../../../assets/icons/screens/network_newS.png')} style={styles.followSeller} resizeMode="contain" />}
                                        </TouchableOpacity>
                                    )}
                                    {currentUser?.id != userData.id && (
                                        <View style={styles.chatDotsContainer}>
                                            <TouchableOpacity onPress={chatScreenHandler}>
                                                <FastImage source={require('../../../assets/icons/screens/chat_enevelope.png')} style={styles.chatIcon} tintColor={Colors.MainThemeColor} resizeMode="contain" />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={profileHandler}>
                                                <FastImage source={require('../../../assets/icons/screens/vertical.png')} style={styles.vertical} resizeMode="contain" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ) : null}

                        <View style={styles.productsView}>
                            <TouchableOpacity style={[currentUser?.image ? styles.leftProfileImageM : styles.nameContainer, {backgroundColor: letterColors[currentUser?.first_name?.charAt(0).toLowerCase()] || Colors.MainThemeColor}]} activeOpacity={0.8}>
                                {currentUser?.image ? <FastImage source={{uri: IMAGES_BASE_URL + currentUser?.image}} resizeMode="cover" style={styles.avatar} /> : <Text style={[styles.nameTextImage, {color: Colors.White}]}>{currentUser?.first_name ? currentUser?.first_name?.charAt(0).toUpperCase() : ''}</Text>}
                            </TouchableOpacity>

                            <View activeOpacity={0.8} style={styles.titelView}>
                                <Text style={styles.titleText} numberOfLines={1}>
                                    {currentUser ? currentUser?.first_name + ' ' + currentUser?.last_name : ''}
                                </Text>
                                {currentUser?.address && currentUser.display_location && (
                                    <Text style={styles.addressText} numberOfLines={1}>
                                        {currentUser?.address}
                                    </Text>
                                )}
                                <View style={styles.locationContainer}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => openMapUrl(currentUser)}>
                                        <FastImage source={require('../../../assets/icons/bottomtab/pin.png')} resizeMode="contain" style={styles.mapPin} tintColor={Colors.Black} />
                                    </TouchableOpacity>

                                    <Text style={styles.milesText} numberOfLines={1} onPress={() => openMapUrl(currentUser)}>
                                        {currentUser?.distance ? currentUser?.distance : 0}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.aboutDetail}>
                            {currentUser?.dob && currentUser.display_dob && (
                                <Text style={styles.textShowTrueDOB} numberOfLines={1}>
                                    {currentUser?.dob}
                                </Text>
                            )}
                            {currentUser?.phone && currentUser.display_phone && (
                                <Text style={styles.textShowTrue} numberOfLines={1}>
                                    {currentUser?.phone}
                                </Text>
                            )}
                            {currentUser?.display_email && (
                                <Text style={styles.textShowTrue} numberOfLines={1}>
                                    {currentUser?.email}
                                </Text>
                            )}
                            <Text style={styles.textAbout} onPress={toggleTextExpansion} numberOfLines={expanded ? undefined : 4}>
                                {currentUser?.about}
                            </Text>
                        </View>
                        <View style={styles.tabContainer}>
                            <View style={selectedTab ? styles.selectedB : styles.selectedC}>
                                <Text style={selectedTab ? styles.unSelectedTitle : styles.selectedTitle} onPress={() => (setSelectedTab(false), doGetUserPost())}>
                                    {currentUser?.first_name + `'s `}
                                    {`Posts`}
                                </Text>
                            </View>
                            <Text style={styles.unSelectedTitle}>{`        `}</Text>
                            <View style={selectedTab ? styles.selectedC : styles.selectedB}>
                                <Text style={selectedTab ? styles.selectedTitle : styles.unSelectedTitle} onPress={() => (setSelectedTab(true), doGetUserProfile())}>
                                    {'Products'}
                                </Text>
                            </View>
                        </View>
                        {separatorHeightH()}
                    </View>
                )}

                {/* <View style={styles.tabContainer}> */}
                {/* <TabView selected={allProduct} source={require('../../../assets/icons/screens/product1.png')} iconStyle={styles.activeIconC} onPress={commintyHandler} />
                    <TabView selected={trade} source={require('../../../assets/icons/screens/trade.png')} onPress={tradeHandler} />
                    <TabView selected={donation} source={require('../../../assets/icons/screens/donation.png')} onPress={donationHandler} />
                    <TabView selected={sale} source={require('../../../assets/icons/screens/sale.png')} onPress={sellHandler} /> */}
                {/* </View> */}
                {!loading && (
                    <>
                        {selectedTab ? (
                            productsData.length == 0 ? (
                                <View style={styles.noDataWraper}>
                                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                                </View>
                            ) : (
                                <View style={styles.listContainer}>
                                    <FlatList data={productsData} renderItem={renderProducts} contentContainerStyle={styles.flatListBottom} showsVerticalScrollIndicator={false} />
                                </View>
                            )
                        ) : comunityData.length == 0 ? (
                            <View style={styles.noDataWraper}>
                                <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                            </View>
                        ) : (
                            <View style={styles.listContainer}>
                                <FlatList data={comunityData} renderItem={renderItem} contentContainerStyle={styles.flatListBottom} showsVerticalScrollIndicator={false} ListFooterComponent={renderFooter} />
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            <EditBottomSheet
                setRef={productSheetref}
                skipTitle={'Cancel'}
                share={'Share'}
                hide={'Hide'}
                report={'Report'}
                reportThis={true}
                skipButtonCB={() => productSheetref.current.close()}
                height={hp('35%')}
                editSheet={true}
                cancelTrue={true}
                reportCB={reportHandlerSheetSell}
                shareShow={true}
                hideShow={true}
                deleteEventCB={doHideHandler}
                editCB={() => {
                    productSheetref.current.close()
                    setTimeout(() => {
                        shareHandlerPost()
                    }, 200)
                }}
            />
            <EventSheetProfile setRef={allLikesSheetref} onCloseCB={closeHandlerLikes} height={hp('100%')} onJoinX={onCloseAllLikes} itemEvent={postItem} title={'All Likes'} chatCB={chatScreenHandlerL} profileNavigationCB={(item) => profileScreenHandler(item)} />
            <EditBottomSheet setRef={editOptionsSheetRef} report={'Report'} skipButtonCB={closeCBProfileRport} height={hp('15%')} editSheet={true} cancelTrue={true} reportThis={true} reportCB={reportHandlerSheet} />
            <EditBottomSheet setRef={profileOptionsSheetRef} share={'Share'} hide={'Hide'} report={'Report'} skipTitle={'Cancel'} skipButtonCB={closeCBProfile} height={hp('32%')} editSheet={true} cancelTrue={true} shareShow={true} hideShow={true} reportCB={reportHandler} reportThis={false} editCB={shareHandler} deleteEventCB={profileHideHandler} />
            <ReportedBottomSheet setRef={reportedSheetref} height={hp('40%')} skipButtonCB={() => reportedSheetref.current.close()} reportCB={reportHandlerApi} title={'Report Product'} />
            <DetailSheetPop setRef={detailSheetRef} onCloseCB={closeHandlerDetail} height={hp('100%')} onPress={onClose} itemCB={productDetailItem} postShowCB={true} titleTab={'Product'} OnPressChem={handlerOpenChemSheet} addToCartCBD={cartHandler} chatCb={chatScreenHCB} />
            <ChemicalsDetailUsed setRef={chemicalDetailSheetRef} onCloseCB={closeHandlerChemicalDetail} height={hp('100%')} onChe={onCloseChem} itemCB={productDetailItem} />
            <TradeDetailSheet setRef={contactSheetRefTrade} onCloseCB={onCloseTrade} itemCB={productDetailItem} height={hp('100%')} />
            <AddSheetSell setRef={addSheetRef} onCloseCB={closeHandler} title={'Sell Goods'} editProductData={productItem} />
            {modalVisible && <ModalContect modalVisible={modalVisible} onRequestClose={closeModal} item={productDetailItem} />}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('100%'),
        alignItems: 'center'
    },
    activeIconC: {
        width: wp('7%'),
        height: wp('7%') * 1.28
    },
    productsView: {
        flexDirection: 'row',
        width: wp('90%'),
        alignItems: 'center',
        marginTop: hp('1%')
    },
    mapPin: {
        width: wp('4%'),
        height: wp('4%')
    },

    milesText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        left: wp('1%')
    },
    mapPin: {
        width: wp('4%'),
        height: wp('4%')
    },
    addressText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    textShowTrue: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginTop: hp(0.4)
    },
    textShowTrueDOB: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    nameContainer: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('7%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: wp('.8%'),
        borderColor: Colors.LightCream_10,
        marginLeft: wp('1')
    },
    chatDotsContainer: {
        width: wp('13%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listContainer: {
        width: wp('100%'),
        alignItems: 'center',
        marginTop: hp('1%'),
        paddingBottom: Platform.OS == 'android' ? hp('10') : hp('20')
    },
    vertical: {
        width: wp('6%'),
        height: wp('6%')
    },
    flatListBottom: {
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('10') : hp('20')
    },
    leftProfileImageM: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('7%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: wp('.8%'),
        borderColor: Colors.LightCream_10,
        marginLeft: wp('1')
    },
    logoArea: {
        width: wp('30%'),
        height: hp('10%')
    },
    titelView: {
        maxWidth: wp('72%'),
        width: wp('72%'),
        justifyContent: 'center',
        left: wp('2%')
    },
    sellerSold: {
        // width: wp('20%'),
    },
    followSeller: {
        width: wp('8%'),
        height: wp('8%')
    },
    followSellerN: {
        width: wp('9%'),
        height: wp('9%')
    },
    followS: {
        // bottom: hp('2%'),
    },
    followSN: {
        position: 'absolute',
        left: wp('10%'),
        bottom: hp('1.6%'),
        zIndex: 1
    },
    titleText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        right: wp('0.5%')
    },
    city: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('35%')
    },
    ratedTagSoldView: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: wp('42%')
    },
    seller: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginTop: hp('0.5%')
    },
    avatar: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('7%'),
        overflow: 'hidden',
        borderWidth: wp('.8%'),
        borderColor: Colors.LightCream_10
    },
    myProduct: {
        width: wp('92%'),
        marginTop: hp('2%')
    },
    nameTextImage: {
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_BOLD,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        textAlign: 'center'
    },
    profileAbout: {
        width: wp('92%'),
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        borderRadius: wp('3%'),
        marginTop: hp('1%'),
        borderWidth: 1
    },
    aboutDetail: {
        width: wp('86%'),
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'center',
        paddingBottom: hp('1%')
    },
    textAbout: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginTop: hp('0.5%'),
        maxWidth: wp('86%')
    },
    unSelectedTitle: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    selectedB: {
        borderBottomColor: Colors.Description,
        // borderBottomWidth: wp('0.3'),
        // marginHorizontal: wp('1'),
        padding: wp('1'),
        alignItems: 'center'
    },
    selectedC: {
        borderBottomColor: Colors.Green,
        borderBottomWidth: wp('0.3'),
        padding: wp('1'),
        alignItems: 'center'
        // paddingHorizontal: wp('1')
    },
    selectedTitle: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },

    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        right: wp('1%')
    },
    mapPin: {
        width: wp('4%'),
        height: wp('4%')
    },
    starIcon: {
        width: wp('4%'),
        height: wp('4%')
    },
    soldText: {
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingLeft: wp('1%')
    },
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    saleSt: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    chatIcon: {
        width: wp('6%'),
        height: wp('6%')
    },
    rowSellerChat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: wp('30%'),
        top: hp('1%')
    },
    tabContainer: {
        left: wp('3'),
        width: wp('60%'),
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    noDataWraper: {
        width: wp('100%'),
        height: hp('50%'),
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
        marginTop: hp('1%')
    }
})

export default ProfileScreen
