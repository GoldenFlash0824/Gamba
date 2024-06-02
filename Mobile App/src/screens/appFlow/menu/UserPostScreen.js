import React, {useRef, useState, useEffect} from 'react'
import {StyleSheet, View, FlatList, Text, Platform, Alert} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useSelector, useDispatch} from 'react-redux'
import {useIsFocused} from '@react-navigation/native'
import axios from 'axios'
import {useNavigation} from '@react-navigation/native'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import FeedCard from '../../../components/components/common/FeedCard'
import EditBottomSheet from '../../../components/components/common/EditBottomSheet'
import AddSheet from '../../../components/components/common/AddSheet'
import {getHeaders} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import Loader from '../../../components/components/common/Spinner'
import EventSheetProfile from '../../../components/components/common/EventSheetProfile'
import ShareButton from '../../../components/components/common/ShareButton'
import ActiveButton from '../../../components/components/common/ActiveButton'

const UserPostScreen = (props) => {
    const {userData} = useSelector((state) => state.user)
    const _tabView = props.route.homeScreen
    const [postsData, setPostsData] = useState([])
    const [loading, setLoading] = useState(false)
    const [postItem, setPostItem] = useState()
    const [cardLoading, setCardLoading] = useState(false)
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)

    const [isLiked, setIsLiked] = useState('')
    const dispatch = useDispatch()
    const editDeleteShhetRef = useRef()
    const addSheetRef = useRef()
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const allLikesSheetref = useRef()

    useEffect(() => {
        isFocused ? func() : (setNextPageToken(1), setShowLoadMore(false))
    }, [isFocused])
    const func = async () => {
        await postHandler()
    }
    const postHandler = async (page = 1) => {
        setLoading(true)
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .get(`user/posts/view_single_user?page=${page}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setShowLoadMore(response.data.data.length >= 15)
                        if (page > 1) {
                            setPostsData(postsData.concat(response.data.data))
                            setLoading(false)
                        } else {
                            setPostsData(response.data.data)
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

    const commentScreenNavigate = (item) => {
        navigation.navigate('CommentScreen', {id: item.id})
    }
    const sellerProfile = () => {}
    const editHandler = () => {
        editDeleteShhetRef.current.close()
        setTimeout(() => {
            addSheetRef.current.open()
        }, 200)
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
                            const _postsData = postsData.map((itm) => {
                                if (item.id == itm.id) {
                                    itm.isLiked = 0
                                    itm.total_likes_count = response.data.data.count
                                }
                                return itm
                            })
                            setPostsData(_postsData)
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
    const deleteHandler = () => {
        editDeleteShhetRef.current.close()
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .delete(`user/posts/delete_post/${postItem.id}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            const _postsData = postsData.filter((item) => {
                                return item.id !== postItem.id
                            })
                            setPostsData(_postsData)
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
    const editOrDeleteHandler = (item) => {
        editDeleteShhetRef.current.open()
        setPostItem(item)
    }
    const closeCB = () => {
        editDeleteShhetRef.current.close()
    }
    const closeHandler = () => {
        addSheetRef.current.close()
        setPostItem()
    }
    const handlerOpenAllLikesShow = (item) => {
        postAlllikeHandler(item)
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
    const postlikeHandler = async (item) => {
        setCardLoading(true)
        const headers = getHeaders(userData.auth_token)
        if (item.id) {
            try {
                await axios
                    .post('user/posts/add_like', {post_id: item.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            const _postsData = postsData.map((itm) => {
                                if (item.id == itm.id) {
                                    itm.isLiked = 1
                                    itm.total_likes_count = response.data.data.count
                                }
                                return itm
                            })
                            setPostsData(_postsData)
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

    const closeHandlerLikes = () => {
        allLikesSheetref.current.close()
    }
    const onCloseAllLikes = () => {
        allLikesSheetref.current.close()
    }
    const shareHandler = () => {
        ShareButton({link: `post/${postItem.id}`, fullname: userData.first_name + ' ' + userData.last_name})
    }
    const renderItem = ({item, index}) => {
        return <FeedCard item={item} index={index} community={true} editPost={true} loadingC={cardLoading} allLikesS={() => handlerOpenAllLikesShow(item)} chatS={() => commentScreenNavigate(item)} navigateProfile={sellerProfile} editCB={() => {}} deleteEventCB={() => {}} editPostPress={() => editOrDeleteHandler(item)} postLikeCB={() => postlikeHandler(item)} postUnLikeCB={() => postUn_likeedHandler(item)} />
    }
    const doFetchMoreProducts = async () => {
        setNextPageToken(nextPageToken + 1)
        await postHandler(nextPageToken + 1)
    }
    const renderFooter = () => {
        return showLoadMore && <ActiveButton style={styles.moreButton} title="Load More" onPress={() => doFetchMoreProducts()} />
    }
    const chatScreenHandler = (currentUser) => {
        allLikesSheetref.current.close()
        setTimeout(() => {
            navigation.navigate('ChatRoomScreen', {userId: currentUser})
        }, 200)
    }
    const profileScreenHandler = (item) => {
        allLikesSheetref.current.close()
        setTimeout(() => navigation.push('ProfileScreen', {userId: item.id}), 200)
    }
    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            {!_tabView && <Header back={true} backCB={() => navigation.goBack()} title={'My Posts'} />}
            {postsData.length == 0 ? (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    <FlatList data={postsData} renderItem={renderItem} contentContainerStyle={styles.flatListBottom} showsVerticalScrollIndicator={false} ListFooterComponent={renderFooter} />
                </View>
            )}
            <EditBottomSheet
                setRef={editDeleteShhetRef}
                share={'Share'}
                hide={'Delete'}
                report={'Edit'}
                skipTitle={'Cancel'}
                skipButtonCB={closeCB}
                height={hp('35%')}
                editCB={() => {
                    editDeleteShhetRef.current.close()
                    setTimeout(() => {
                        shareHandler()
                    }, 200)
                }}
                deleteEventCB={deleteHandler}
                editSheet={true}
                cancelTrue={true}
                reportCB={editHandler}
                reportThis={true}
                shareShow={true}
                hideShow={true}
                deleteEvent={true}
                editEvent={true}
            />
            <EventSheetProfile setRef={allLikesSheetref} onCloseCB={closeHandlerLikes} height={hp('100%')} onJoinX={onCloseAllLikes} itemEvent={postItem} title={'All Likes'} chatCB={chatScreenHandler} profileNavigationCB={(item) => profileScreenHandler(item)} />
            <AddSheet setRef={addSheetRef} onCloseCB={closeHandler} title={'Share Post'} editPostData={postItem} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        flex: 1
        // height: hp('100%')
    },
    listContainer: {
        width: wp('100%'),
        alignItems: 'center',
        paddingTop: Platform.OS == 'android' ? hp('1') : hp('1')
    },
    flatListBottom: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('20') : hp('30'),
        backgroundColor: Colors.BackgroundColor
    },
    noDataWraper: {
        width: wp('100%'),
        height: hp('80%'),
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

export default UserPostScreen
