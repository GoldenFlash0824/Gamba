import React, {useEffect, useState} from 'react'
import {FlatList, Platform, StyleSheet, Text, View, RefreshControl} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import FeedCard from './FeedCard'
import InputWithLabels from './InputWithLabels'
import Loader from './Spinner'
import {getHeaders, separatorHeightH, getDistanceFromLatLonInMiles} from '../../../utils/helpers'
import ShowAlert from './ShowAlert'
import ActiveButton from './ActiveButton'

const SellerData = ({route}) => {
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [comunityData, setCommunityData] = useState([])
    const [comunityDataCopy, setCommunityDataCopy] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)
    const navigation = useNavigation()

    useEffect(() => {
        if (route.ind == 1 && route.searching == '') {
            const func = async () => {
                await postHandler()
            }
            func()
        } else if (route.ind == 1 && route.searching != '') {
            onChangeSearchBar(route.searching)
        } else {
            setShowLoadMore(false)
        }
    }, [route.searching, , route.ind])
    const postHandler = async (page = 1) => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .get(`user/get_all_sellers?page=${page}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let _updatedData = []
                        for (let i = 0; i < response.data.data.data.allSellers.length; i++) {
                            let _sellerImage = []
                            let _distance = null
                            for (let j = 0; j < response.data.data.data.allSellers[i].userProducts.length; j++) {
                                for (let k = 0; k < response.data.data.data.allSellers[i].userProducts[k].images.length; k++) {
                                    _sellerImage.push(response.data.data.data.allSellers[i].userProducts[j].images[0])
                                    break
                                }
                            }
                            response.data.data.data.allSellers[i].lat && response.data.data.data.allSellers[i].log && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, response.data.data.data.allSellers[i].lat, response.data.data.data.allSellers[i].log)) : null
                            response.data.data.data.allSellers[i]['distance'] = _distance ? _distance : 0

                            let _user = {createdAt: response.data.data.data.allSellers[i].createdAt, description: '', id: null, images: _sellerImage, total_comments_count: 0, total_likes_count: 0, u_id: response.data.data.data.allSellers[i].id, updatedAt: response.data.data.data.allSellers[i].updatedAt, user: {first_name: response.data.data.data.allSellers[i].first_name, id: response.data.data.data.allSellers[i].id, image: response.data.data.data.allSellers[i].image, last_name: response.data.data.data.allSellers[i].last_name, location: response.data.data.data.allSellers[i].address, isFev: response.data.data.data.allSellers[i].isFev, display_location: response.data.data.data.allSellers[i].display_location, distance: response.data.data.data.allSellers[i].distance}}
                            _updatedData.push(_user)
                        }
                        if (page > 1) {
                            setCommunityData(comunityData.concat(_updatedData))
                            setCommunityDataCopy(comunityDataCopy.concat(_updatedData))
                        } else {
                            setCommunityData(_updatedData)
                            setCommunityDataCopy(_updatedData)
                        }
                        setNextPageToken(page)
                        setShowLoadMore(response.data.data.data.allSellers.length >= 15)
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
        if (text.length >= 2) {
            const headers = getHeaders(userData.auth_token)
            await axios
                .get(`user/search_sellers?filter=${text}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let _updatedData = []
                        for (let i = 0; i < response.data.data.data.length; i++) {
                            let _sellerImage = []
                            let _distance = null
                            for (let j = 0; j < response.data.data.data[i].userProducts.length; j++) {
                                for (let k = 0; k < response.data.data.data[i].userProducts[k].images.length; k++) {
                                    _sellerImage.push(response.data.data.data[i].userProducts[j].images[0])
                                    break
                                }
                            }
                            response.data.data.data[i].lat && response.data.data.data[i].log && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, response.data.data.data[i].lat, response.data.data.data[i].log)) : null
                            response.data.data.data[i]['distance'] = _distance ? _distance : 0
                            let _user = {createdAt: response.data.data.data[i].createdAt, description: '', id: null, images: _sellerImage, total_comments_count: 0, total_likes_count: 0, u_id: response.data.data.data[i].id, updatedAt: response.data.data.data[i].updatedAt, user: {first_name: response.data.data.data[i].first_name, id: response.data.data.data[i].id, image: response.data.data.data[i].image, last_name: response.data.data.data[i].last_name, location: response.data.data.data[i].address, isFev: response.data.data.data[i].isFev, display_location: response.data.data.data[i].display_location, distance: response.data.data.data[i].distance}}
                            _updatedData.push(_user)
                        }
                        setCommunityData(_updatedData)
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
        } else if (text.length == 0) {
            setCommunityData(comunityDataCopy)
        }
    }

    const sellerFollowHandler = async (item) => {
        setLoading(true)
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .post(`user/add_seller_to_fev`, {seller_id: item.user.id}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        const _comunityData = comunityData.map((itm) => {
                            if (item.user.id == itm.user.id) {
                                itm.user.isFev = itm.user.isFev == 1 ? 0 : 1
                            }
                            return itm
                        })
                        setCommunityData(_comunityData)
                        setLoading(false)
                    } else {
                        setLoading(false)
                        // ShowAlert({type: 'error', description: response.data.message})
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    // ShowAlert({type: 'error', description: error.message})
                })
        } catch (e) {
            setLoading(false)
            ShowAlert({type: 'error', description: e.message})
        }
    }

    const sellerProfile = (item) => {
        navigation.navigate('ProfileScreen', {userId: item.user?.id ? item.user.id : item.id})
    }
    const renderItem = ({item, index}) => {
        return <FeedCard item={item} index={index} community={false} seller={true} chatS={() => null} sellerLike={() => sellerFollowHandler(item)} navigateProfile={() => sellerProfile(item)} editCB={() => {}} deleteEventCB={() => {}} postLikeCB={() => null} onDotPress={() => null} profileShow={true} userId={userData.id} />
    }
    const onRefresh = async () => {
        await postHandler(nextPageToken)
        setRefreshing(false)
    }
    const doFetchMoreSellers = async () => {
        await postHandler(nextPageToken + 1)
    }
    const renderFooter = () => {
        return showLoadMore && route.searching == '' && <ActiveButton style={styles.moreButton} title="Load More" onPress={() => doFetchMoreSellers()} />
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />

            {separatorHeightH()}
            {comunityData.length == 0 ? (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            ) : (
                <View style={styles.listContainercommunity}>
                    <FlatList data={comunityData} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} renderItem={renderItem} contentContainerStyle={styles.flatListBottomSeller} showsVerticalScrollIndicator={false} ListFooterComponent={renderFooter} />
                </View>
            )}
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
    labelStyle: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textTransform: 'capitalize'
    },
    flatListBottom: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('15') : hp('17')
    },
    flatListBottomSeller: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('40') : hp('48')
    },

    searchToglleRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('92%'),
        paddingBottom: hp('1')
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
    listContainercommunity: {
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
    },
    moreButton: {
        alignSelf: 'center',
        marginTop: hp('1%')
    }
})

export default SellerData
