import React, {useEffect, useState} from 'react'
import {FlatList, Platform, StyleSheet, Text, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import FeedCard from '../../../components/components/common/FeedCard'
import Loader from '../../../components/components/common/Spinner'
import {getHeaders, separatorHeightH, getDistanceFromLatLonInMiles} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import Header from '../../../components/components/common/Header'
import ActiveButton from '../../../components/components/common/Header'

const FavouriteProductsScreen = ({navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [comunityData, setCommunityData] = useState([])
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)
    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                await doGetMyNetwork()
            }
            func()
        } else {
            setNextPageToken(1)
            setShowLoadMore(false)
        }
    }, [isFocused])

    const doGetMyNetwork = async (page = 1) => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .get(`user/get_all_fev_seller?page=${page}`, headers)
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
                            let _user = {createdAt: response.data.data.data.allSellers[i].createdAt, description: '', id: null, images: _sellerImage, total_comments_count: 0, total_likes_count: 0, u_id: 3, updatedAt: response.data.data.data.allSellers[i].updatedAt, user: {first_name: response.data.data.data.allSellers[i].first_name, id: response.data.data.data.allSellers[i].id, image: response.data.data.data.allSellers[i].image, last_name: response.data.data.data.allSellers[i].last_name, location: response.data.data.data.allSellers[i].address, isFev: response.data.data.data.allSellers[i].isFev, distance: response.data.data.data.allSellers[i].distance}}
                            _updatedData.push(_user)
                        }

                        if (page > 1) {
                            setCommunityData(comunityData.concat(_updatedData))
                        } else {
                            setCommunityData(_updatedData)
                        }
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

    const sellerFollowHandler = async (item) => {
        setLoading(true)
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .post(`user/add_seller_to_fev`, {seller_id: item.user.id}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        const _comunityData = comunityData.filter((itm) => item.user.id != itm.user.id)
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
        return <FeedCard item={item} index={index} community={false} myProductView={true} seller={true} profileShow={true} userId={userData.id} sellerLike={() => sellerFollowHandler(item)} navigateProfile={() => sellerProfile(item)} />
    }
    const doFetchMoreUser = async () => {
        setNextPageToken(nextPageToken + 1)
        await doGetMyNetwork(nextPageToken + 1)
    }
    const renderFooter = () => {
        return showLoadMore && <ActiveButton style={styles.moreButton} title="Load More" onPress={() => doFetchMoreUser()} />
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title={'My Network'} />

            {separatorHeightH()}
            {comunityData.length == 0 ? (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            ) : (
                <View style={styles.listContainercommunity}>
                    <FlatList data={comunityData} renderItem={renderItem} contentContainerStyle={styles.flatListBottom} showsVerticalScrollIndicator={false} ListFooterComponent={renderFooter} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        flex: 1,
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
        paddingBottom: Platform.OS == 'android' ? hp(20) : hp(20)
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
        flex: 1,
        alignItems: 'center'
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

export default FavouriteProductsScreen
