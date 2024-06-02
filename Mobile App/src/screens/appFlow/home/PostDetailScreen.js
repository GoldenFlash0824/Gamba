import React, {useEffect, useState, useRef} from 'react'
import {StyleSheet, Text, View, ScrollView} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import FeedCard from '../../../components/components/common/FeedCard'
import Header from '../../../components/components/common/Header'
import Loader from '../../../components/components/common/Spinner'
import EditBottomSheet from '../../../components/components/common/EditBottomSheet'
import {getHeaders} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import ReportedBottomSheet from '../../../components/components/common/ReportedBottomSheet'
import AddSheet from '../../../components/components/common/AddSheet'
import ShareButton from '../../../components/components/common/ShareButton'
import EventSheetProfile from '../../../components/components/common/EventSheetProfile'

const PostDetailScreen = ({navigation, route}) => {
    const {userData} = useSelector((state) => state.user)
    const params = route.params

    const [loading, setLoading] = useState(false)
    const [likesData, setLikesData] = useState()
    const [comunityData, setCommunityData] = useState()
    const hideShareSheetref = useRef()
    const reportedSheetref = useRef()
    const productSheetref = useRef()
    const isFocused = useIsFocused()
    const addSheetRef = useRef()
    const allLikesSheetref = useRef()

    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                params?.id ? await getPostDetail() : null
            }
            func()
        }
    }, [isFocused])

    const getPostDetail = async () => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .post(`user/posts/get_post_by_id`, {post_id: params.id}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setCommunityData(response.data.data.viewAllPosts)
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

    const commentScreenNavigate = () => {
        navigation.navigate('CommentScreen', {id: params.id})
    }

    const postlikeHandler = async (item) => {
        // setLoading(true)
        const headers = getHeaders(userData.auth_token)
        if (item.id) {
            try {
                await axios
                    .post('user/posts/add_like', {post_id: item.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            comunityData.isLiked = 1
                            comunityData.total_likes_count = response.data.data.count
                            const _new = {...comunityData}
                            setCommunityData(_new)
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

    const postUn_likeedHandler = async (item) => {
        const headers = getHeaders(userData.auth_token)
        if (item.id) {
            try {
                await axios
                    .post('user/posts/un_like', {post_id: item.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            comunityData.isLiked = 0
                            comunityData.total_likes_count = response.data.data.count
                            const _new = {...comunityData}
                            setCommunityData(_new)
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
                    .post('admin/reported_post', {u_id: userData.id, post_id: comunityData.id, reason: reason}, headers)

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

    const onDotPressHanlder = (itm) => {
        userData?.id == itm?.user?.id ? hideShareSheetref.current.open() : productSheetref.current.open()
    }

    const deleteHandler = () => {
        hideShareSheetref.current.close()
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .delete(`user/posts/delete_post/${comunityData.id}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            navigation.goBack()
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

    const reportHandler = () => {
        productSheetref.current.close()
        setTimeout(() => {
            reportedSheetref.current.open()
        }, 200)
    }

    const backHandler = () => {
        navigation.goBack()
    }

    const editHandler = () => {
        hideShareSheetref.current.close()
        setTimeout(() => {
            addSheetRef.current.open()
        }, 200)
    }

    const closeHandler = () => {
        addSheetRef.current.close()
    }

    const sellerProfile = (item) => {
        navigation.navigate('ProfileScreen', {userId: item.user?.id ? item.user.id : item.id})
    }
    const shareHandler = () => {
        ShareButton({link: `post/${comunityData.id}`})
    }
    const doHideHandler = () => {
        productSheetref.current.close()
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .post(`user/posts/hide_post`, {post_id: comunityData.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            navigation.goBack()
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
    const postAlllikeHandler = async () => {
        const headers = getHeaders(userData.auth_token)
        if (comunityData.id) {
            try {
                await axios
                    .post('user/posts/all_likes', {post_id: comunityData.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLikesData(response.data.data)
                            setTimeout(() => {
                                allLikesSheetref.current.open()
                            }, 200)
                        } else {
                            ShowAlert({type: 'error', description: response.data.message})
                        }
                    })
                    .catch((error) => {
                        ShowAlert({type: 'error', description: error.message})
                    })
            } catch (e) {
                ShowAlert({type: 'error', description: e.message})
            }
        }
    }
    const chatScreenHandler = (currentUser) => {
        allLikesSheetref.current.close()
        setTimeout(() => {
            navigation.navigate('ChatRoomScreen', {userId: currentUser})
        }, 200)
    }
    const closeHandlerLikes = () => {
        allLikesSheetref.current.close()
    }
    const profileScreenHandler = (item) => {
        allLikesSheetref.current.close()
        setTimeout(() => navigation.navigate('ProfileScreen', {userId: item.id}), 200)
    }

    return (
        <View style={styles.body}>
            <Header back={true} backCB={backHandler} right={false} title={'Post Detail'} />
            <Loader visible={loading} />
            {!comunityData ? (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContainercommunity}>
                    <FeedCard item={comunityData} index={1} community={true} seller={false} chatS={commentScreenNavigate} navigateProfile={() => sellerProfile(comunityData)} postUnLikeCB={() => postUn_likeedHandler(comunityData)} postLikeCB={() => postlikeHandler(comunityData)} onDotPress={() => onDotPressHanlder(comunityData)} myData={userData.id == comunityData.user.id} profileShow={true} userId={userData.id} allLikesS={() => postAlllikeHandler()} />
                </ScrollView>
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
                height={hp('35%')}
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
            <AddSheet setRef={addSheetRef} onCloseCB={closeHandler} title={'Share Post'} editPostData={comunityData} />
            <EventSheetProfile setRef={allLikesSheetref} onCloseCB={closeHandlerLikes} height={hp('100%')} onJoinX={closeHandlerLikes} itemEvent={likesData} title={'All Likes'} chatCB={chatScreenHandler} profileNavigationCB={(item) => profileScreenHandler(item)} />
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
    listContainercommunity: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: hp('20')
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
    }
})

export default PostDetailScreen
