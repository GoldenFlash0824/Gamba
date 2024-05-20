import React, {useEffect, useState, useRef} from 'react'
import {FlatList, Platform, StyleSheet, Text, View, Share, RefreshControl, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import FeedCard from '../../../components/components/common/FeedCard'
import MainHeader from '../../../components/components/common/MainHeader'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import Loader from '../../../components/components/common/Spinner'
import EditBottomSheet from '../../../components/components/common/EditBottomSheet'
import CommunityList from '../../../components/components/common/CommunityList'
import {getHeaders, separatorHeightH, getDistanceFromLatLonInMiles, separatorHeight} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import ReportedBottomSheet from '../../../components/components/common/ReportedBottomSheet'
import AddSheet from '../../../components/components/common/AddSheet'
import {storeLinkUrl, storeNotification} from '../../../services/store/actions/user'
import EventSheetProfile from '../../../components/components/common/EventSheetProfile'
import ShareButton from '../../../components/components/common/ShareButton'
import ActiveButton from '../../../components/components/common/ActiveButton'
import {Chat_Api} from '../../../services/constants/index'

const HomeScreen = ({navigation, route}) => {
    const [showSearch, setShowSearch] = useState(true)
    const {userData, linkingUrl, chatToken} = useSelector((state) => state.user)
    const headers = getHeaders(userData.auth_token)

    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [cardLoading, setCardLoading] = useState(false)
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)
    const [_nextPageToken, _setNextPageToken] = useState(1)
    const [loadMore, setLoadMore] = useState(false)

    const [postData, setPostData] = useState()
    const [serachBar, setserachBar] = useState('')
    const [focusSearch, setFocusSearch] = useState(false)
    const [isLiked, setIsLiked] = useState('')
    const [notificationCount, setNotificationCount] = useState('0')

    const [comunityData, setCommunityData] = useState([])
    const [comunityDataCopy, setCommunityDataCopy] = useState([])
    const [topUserData, setTopUsersData] = useState([])

    const hideShareSheetref = useRef()
    const reportedSheetref = useRef()
    const productSheetref = useRef()
    const isFocused = useIsFocused()
    const addSheetRef = useRef()
    const dispatch = useDispatch()
    const allLikesSheetref = useRef()

    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                await commintyHandler()
                await getUnreadMessagesCount()
            }
            func()
        } else {
            setCommunityData([])
            setNextPageToken(1)
            setShowLoadMore(false)
            setserachBar('')
            setFocusSearch(false)
        }
    }, [isFocused])

    useEffect(() => {
        if (linkingUrl !== null) {
            const func = async () => {
                const route = linkingUrl.replace(/.*?:\/\//g, '')
                const id = route.match(/\/([^\/]+)\/?$/)[1]
                if (id != '' && id) {
                    dispatch(storeLinkUrl(null))
                    setLoading(false)
                    setTimeout(() => {
                        if (route.includes('post')) {
                            navigation.navigate('PostDetailScreen', {id: id})
                        } else if (route.includes('calendar')) {
                            navigation.navigate('EventDetailScreen', {id: id})
                        } else if (route.includes('sellers')) {
                            navigation.navigate('ProfileScreen', {userId: id})
                        } else {
                            navigation.navigate('ProductDetailScreen', {id: id})
                        }
                    }, 200)
                }
            }
            func()
        }
    }, [linkingUrl])

    const postHandler = async (page = 1) => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .get(`user/posts/get_all_posts?page=${page}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let postsData = response.data.data.viewAllPosts
                        for (let i = 0; i < postsData.length; i++) {
                            let _distance = null

                            postsData[i].user.lat && postsData[i].user.log && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, postsData[i].user.lat, postsData[i].user.log)) : null
                            postsData[i].user.distance = _distance ? _distance : 0
                        }
                        if (page > 1) {
                            setCommunityData(comunityData.concat(postsData))
                            setCommunityDataCopy(comunityDataCopy.concat(postsData))
                        } else {
                            await doGetTopUsers()
                            setCommunityData(postsData)
                            setCommunityDataCopy(postsData)
                        }

                        dispatch(storeNotification(response.data.data.notification_count))
                        // setNotificationCount(response.data.data.notification_count)
                        setShowLoadMore(postsData.length >= 15)
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

    const doGetTopUsers = async (page = 1) => {
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .get(`user/get_user_with_max_posts?page=${page}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        _setNextPageToken(page)
                        setLoadMore(response.data.data.data.length >= 15)
                        if (page > 1) {
                            setTopUsersData(topUserData.concat(response.data.data.data))
                        } else {
                            setTopUsersData(response.data.data.data)
                        }
                    } else {
                        // setLoading(false)
                        // ShowAlert({type: 'error', description: response.data.message})
                    }
                })
                .catch((error) => {
                    // setLoading(false)
                    // ShowAlert({type: 'error', description: error.message})
                })
        } catch (e) {
            // setLoading(false)
            ShowAlert({type: 'error', description: e.message})
        }
    }

    const onRefresh = async () => {
        await postHandler(nextPageToken)
        setRefreshing(false)
    }
    const onChangeSearchBar = async (text) => {
        text = text.toLowerCase()
        setserachBar(text)
        if (text.length >= 2) {
            const headers = getHeaders(userData.auth_token)
            try {
                await axios
                    .get(`user/posts/search_posts?filter=${text}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            let postsData = response.data.data
                            for (let i = 0; i < postsData.length; i++) {
                                let _distance = null
                                postsData[i].user.lat && postsData[i].user.log && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, postsData[i].user.lat, postsData[i].user.log)) : null
                                postsData[i].user.distance = _distance ? _distance : 0
                            }
                            setCommunityData(postsData)
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
        } else if (text.length == 0) {
            setCommunityData(comunityDataCopy)
        }
    }

    const onSubmitPosts = async () => {
        const headers = getHeaders(userData.auth_token)
        setFocusSearch(false)
        if (serachBar.length >= 2) {
            setLoading(true)
            try {
                await axios
                    .get(`user/posts/search_posts?filter=${serachBar}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            let postsData = response.data.data
                            for (let i = 0; i < postsData.length; i++) {
                                let _distance = null
                                postsData[i].user.lat && postsData[i].user.log && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, postsData[i].user.lat, postsData[i].user.log)) : null
                                postsData[i].user.distance = _distance ? _distance : 0
                            }
                            setCommunityData(postsData)
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
    const getUnreadMessagesCount = async () => {
        const url = `${Chat_Api}api/conversations/badge`
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${chatToken}`
        }
        await axios
            .get(url, {headers})
            .then(async (response) => {
                const countMessages = response.data
            })
            .catch((error) => {
                console.log('countMessages Error:', error)
            })
    }
    const onSearchBarFocus = () => setFocusSearch(true)

    const commintyHandler = async () => {
        setFocusSearch(false)
        setserachBar('')
        await postHandler()
    }

    const commentScreenNavigate = (item) => navigation.navigate('CommentScreen', {id: item.id})

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
                            const _comunityDataCopy = comunityDataCopy.map((itm) => {
                                if (item.id == itm.id) {
                                    itm.isLiked = 1
                                    itm.total_likes_count = response.data.data.count
                                }
                                return itm
                            })
                            setCommunityData(_comunityData)
                            setCommunityDataCopy(_comunityDataCopy)
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
                            const _comunityDataCopy = comunityDataCopy.map((itm) => {
                                if (item.id == itm.id) {
                                    itm.isLiked = 0
                                    itm.total_likes_count = response.data.data.count
                                }
                                return itm
                            })
                            setCommunityData(_comunityData)
                            setCommunityDataCopy(_comunityDataCopy)
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

    const reportHandlerApi = (reason = '') => {
        reportedSheetref.current.close()
        setTimeout(async () => {
            const headers = getHeaders(userData.auth_token)
            setLoading(true)
            try {
                await axios
                    .post('admin/reported_post', {u_id: userData.id, post_id: postData.id, reason: reason}, headers)
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

    const postAlllikeHandler = async (item) => {
        setCardLoading(true)
        const headers = getHeaders(userData.auth_token)
        if (item.id) {
            try {
                await axios
                    .post('user/posts/all_likes', {post_id: item.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setPostData(response.data.data)
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

    const closeHandler = () => {
        addSheetRef.current.close()
        setPostData()
    }

    const closeHandlerLikes = () => {
        allLikesSheetref.current.close()
    }
    const onCloseAllLikes = () => {
        allLikesSheetref.current.close()
    }
    const handlerOpenAllLikesShow = (item) => {
        postAlllikeHandler(item)
    }

    const onDotPressHanlder = (itm) => {
        userData?.id == itm?.user?.id ? (hideShareSheetref.current.open(), setPostData(itm)) : (productSheetref.current.open(), setPostData(itm))
    }

    const renderItem = ({item, index}) => {
        return <FeedCard item={item} index={index} community={true} seller={false} chatS={() => commentScreenNavigate(item)} allLikesS={() => handlerOpenAllLikesShow(item)} navigateProfile={() => sellerProfile(item)} editCB={() => {}} deleteEventCB={() => {}} postUnLikeCB={() => (postUn_likeedHandler(item), setIsLiked(item.id))} postLikeCB={() => (postlikeHandler(item), setIsLiked(item.id))} onDotPress={() => onDotPressHanlder(item)} myData={userData.id == item.user.id} profileShow={true} userId={userData.id} loadingC={cardLoading} postId={isLiked} />
    }

    const deleteHandler = () => {
        hideShareSheetref.current.close()
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .delete(`user/posts/delete_post/${postData.id}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            const _comunityData = comunityData.filter((item) => {
                                return item.id !== postData.id
                            })
                            const _comunityDataCopy = comunityDataCopy.filter((item) => {
                                return item.id !== postData.id
                            })
                            setCommunityDataCopy(_comunityDataCopy)
                            setCommunityData(_comunityData)
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
                            const _comunityDataCopy = comunityDataCopy.filter((item) => {
                                return item.id !== postData.id
                            })
                            setCommunityDataCopy(_comunityDataCopy)
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

    const reportHandler = () => {
        productSheetref.current.close()
        setTimeout(() => {
            reportedSheetref.current.open()
        }, 200)
    }

    const searchShowHandler = () => {
        setShowSearch(!showSearch)
    }

    const notificationHandler = () => {
        navigation.navigate('NotificationScreen')
    }
    const leftDrawerHandler = () => {
        navigation.getParent('LeftDrawer', {ik: 'jjJJJJJJJJJjjj'}).openDrawer()
    }
    const rightDrawerHandler = () => {
        navigation.getParent('RightDrawer').openDrawer()
    }
    const chatHandler = () => {
        navigation.navigate('ChatScreen')
    }
    const editHandler = () => {
        hideShareSheetref.current.close()
        setTimeout(() => {
            addSheetRef.current.open()
        }, 200)
    }

    const sellerProfile = (item) => {
        navigation.navigate('ProfileScreen', {userId: item.user?.id ? item.user.id : item.id})
    }
    const shareHandler = () => {
        ShareButton({link: `post/${postData.id}`, fullname: userData.first_name + ' ' + userData.last_name})
    }
    const doFetchMorePosts = async () => {
        setNextPageToken(nextPageToken + 1)
        await postHandler(nextPageToken + 1)
    }
    const renderFooter = () => {
        return showLoadMore && serachBar == '' && <ActiveButton style={styles.moreButton} title="Load More" onPress={() => doFetchMorePosts()} />
    }
    const chatScreenHandler = (currentUser) => {
        allLikesSheetref.current.close()
        setTimeout(() => {
            navigation.navigate('ChatRoomScreen', {userId: currentUser})
        }, 200)
    }

    const profileScreenHandler = (item) => {
        allLikesSheetref.current.close()
        setTimeout(() => navigation.navigate('ProfileScreen', {userId: item.id}), 200)
    }

    const doGetTopUsersMore = async () => {
        if (loadMore) {
            doGetTopUsers(_nextPageToken + 1)
        }
    }
    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <MainHeader back={true} notificationCount={notificationCount} rightDrawerCB={rightDrawerHandler} leftDrawerCB={leftDrawerHandler} right={true} noti={true} chatCB={chatHandler} notificationCB={notificationHandler} showSearch={true} searchCB={searchShowHandler} homeChat={true} />
            <View style={styles.topContainer}>
                <>
                    {separatorHeightH()}
                    <View style={styles.searchToglleRowView}>
                        <InputWithLabels
                            showLabelCB={false}
                            value={serachBar}
                            inputStyles={{width: wp('86'), paddingRight: wp('4'), backgroundColor: Colors.BorderGrey}}
                            style={{width: wp('92'), backgroundColor: Colors.BorderGrey}}
                            autoCapitalize={'none'}
                            placeholder={'Search'}
                            isError={false}
                            isFocus={focusSearch}
                            onBlur={onSubmitPosts}
                            onFocus={() => onSearchBarFocus()}
                            icon={true}
                            onChangeText={(text) => {
                                onChangeSearchBar(text)
                            }}
                            showPlaceHolder={true}
                            leftIcon={false}
                            clearIcon={true}
                            onPress={onSubmitPosts}
                        />
                    </View>
                </>

                <View style={styles.communityList}>
                    <FlatList data={topUserData} horizontal renderItem={({item}) => <CommunityList item={item} onProfile={() => sellerProfile(item)} userId={userData.id} />} key={(item, index) => index} keyExtractor={(item, index) => index} showsHorizontalScrollIndicator={false} onEndReached={doGetTopUsersMore} onEndReachedThreshold={0.5} />
                </View>
            </View>

            {/* <Pressable onPress={() => addSheetRef.current.open()} style={styles.buttonContainer}>
                <Text style={styles.postText}>What’s on your mind...</Text>
            </Pressable> */}

            {comunityData.length == 0 ? (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            ) : (
                <View style={styles.listContainercommunity}>
                    <FlatList data={comunityData} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} renderItem={renderItem} contentContainerStyle={styles.flatListBottom} showsVerticalScrollIndicator={false} ListFooterComponent={renderFooter} />
                </View>
            )}
            <EditBottomSheet
                setRef={hideShareSheetref}
                share={'Share'}
                hide={'Delete'}
                report={'Edit'}
                skipTitle={'Cancel'}
                hideShow={true}
                reportThis={true}
                skipButtonCB={() => hideShareSheetref.current.close()}
                height={hp('35%')}
                editCB={() => {
                    hideShareSheetref.current.close()
                    setTimeout(() => {
                        shareHandler()
                    }, 200)
                }}
                deleteEvent={true}
                editEvent={true}
                editSheet={true}
                cancelTrue={true}
                shareShow={true}
                deleteEventCB={deleteHandler}
                reportCB={editHandler}
            />
            <EditBottomSheet
                setRef={productSheetref}
                skipTitle={'Cancel'}
                share={'Share'}
                hide={'Hide'}
                report={'Report'}
                reportThis={true}
                skipButtonCB={() => productSheetref.current.close()}
                // height={hp('35%')}
                editSheet={true}
                cancelTrue={true}
                reportCB={reportHandler}
                shareShow={true}
                hideShow={true}
                deleteEventCB={doHideHandler}
                editCB={() => {
                    productSheetref.current.close()
                    setTimeout(() => {
                        shareHandler()
                    }, 200)
                }}
            />
            <ReportedBottomSheet setRef={reportedSheetref} height={hp('40%')} reportCB={reportHandlerApi} title={'Report Post'} />
            <AddSheet setRef={addSheetRef} onCloseCB={closeHandler} title={'Share Post'} editPostData={postData} />
            <EventSheetProfile setRef={allLikesSheetref} onCloseCB={closeHandlerLikes} height={hp('100%')} onJoinX={onCloseAllLikes} itemEvent={postData} title={'All Likes'} chatCB={chatScreenHandler} profileNavigationCB={(item) => profileScreenHandler(item)} />
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

    flatListBottom: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('30') : hp('34')
    },

    searchToglleRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('92%'),
        paddingBottom: hp('1')
    },
    communityList: {
        paddingBottom: hp('1'),
        width: wp('98%'),
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
        paddingBottom: hp('20')
    },
    noDataWraper: {
        width: wp('100%'),
        height: hp('62%'),
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
        width: wp('92')
    },
    buttonContainer: {
        width: wp('92'),
        backgroundColor: Colors.White,
        justifyContent: 'center',
        borderRadius: wp('8'),
        height: hp('6'),
        alignSelf: 'center'
    },
    postText: {
        paddingLeft: wp('2'),
        color: Colors.placeholderTextColor,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default HomeScreen
