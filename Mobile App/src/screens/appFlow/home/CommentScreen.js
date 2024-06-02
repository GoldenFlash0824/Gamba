import React, {useState, useEffect, useRef} from 'react'
import {View, StyleSheet, useWindowDimensions, PermissionsAndroid, Pressable, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {GiftedChat, Send} from 'react-native-gifted-chat'
import {useIsFocused} from '@react-navigation/native'
import ImagePicker from 'react-native-image-crop-picker'
import FastImage from 'react-native-fast-image'
import {useSelector} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Loader from '../../../components/components/common/Spinner'
import Header from '../../../components/components/common/Header'
import {getHeaders} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import ReplyComment from '../../../components/components/common/ReplyComment'
import BottomSheet from '../../../components/components/common/BottomSheet'
import {IMAGES_BASE_URL} from '../../../services/constants/index'

const CommentScreen = ({navigation, route}) => {
    const {userData, linkingUrl} = useSelector((state) => state.user)
    const param = route.params
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [delComment, setDelComment] = useState('')
    const [commentType, setCommentType] = useState('')
    const [commentText, setCommentText] = useState('')
    const [commentImage, setCommentImage] = useState('')
    const [replyingUser, setReplyingUser] = useState('')
    const [userName, setUserName] = useState('')
    const isFocused = useIsFocused()
    const deleteSheetRef = useRef()

    useEffect(() => {
        if (isFocused) {
            func()
        }
    }, [isFocused])
    const func = async () => await doGetAllComents()

    const doGetAllComents = async () => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .post('user/view_all_post_comments', {p_id: param?.id, order: 'desc'}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let _allComments = []
                        let allComments = response.data.data.all_post_comments
                        for (let i = 0; i < allComments.length; i++) {
                            allComments[i].user.avatar = allComments[i].user.avatar ? allComments[i].user.avatar : IMAGES_BASE_URL + allComments[i].user.name[0].toLowerCase() + '.png'
                            const data = {
                                _id: allComments[i]._id,
                                createdAt: allComments[i]._id,
                                id: allComments[i].id,
                                text: allComments[i].text,
                                user: allComments[i].user,
                                commentsHide: true,
                                image: allComments[i].media?.match(/png|jpeg|jpg/g) ? IMAGES_BASE_URL + allComments[i].media : '',
                                likeByMe: allComments[i].isLiked,
                                disLikeByMe: allComments[i].isMeDisLike,
                                disLikesCount: allComments[i].disLiked ? allComments[i].disLiked : '0',
                                likesCount: allComments[i].likes ? allComments[i].likes : '0',
                                isMeComment: allComments[i].isMeComment,
                                quickReplies: {type: 'radio', keepIt: true, values: []}
                            }
                            for (let j = 0; j < allComments[i].reply.length; j++) {
                                data.quickReplies.values.push(allComments[i].reply[j])
                            }
                            _allComments.push(data)
                        }
                        setComments(_allComments)
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

    const submitComment = async (comment) => {
        setReplyingUser('')
        setDelComment('')
        setCommentImage('')
        if (replyingUser != '' || (delComment != '' && commentType === 'reply')) {
            setCommentType('')
            const data = delComment.id ? {id: delComment.id, reply: comment[0].text.replace(userName, ''), page: 1, order: 'desc', p_id: param.id, imageData: commentImage} : {p_id: param.id, c_id: replyingUser.id, reply: comment[0].text.replace(userName, ''), page: 1, order: 'desc', imageData: commentImage}
            if (data.reply == '' && data.imageData == '') {
                return
            }
            setLoading(true)
            const headers = getHeaders(userData.auth_token)
            let url = delComment.id ? 'user/update_post_reply' : 'user/add_post_reply'
            try {
                await axios
                    .post(url, data, headers)
                    .then((response) => {
                        setLoading(false)
                        if (response.data.success === true) {
                            let _allComments = []
                            let allComments = response?.data?.data?.reply?.allComments ? response.data?.data?.reply?.allComments : response.data?.data?.comment
                            for (let i = 0; i < allComments.length; i++) {
                                allComments[i].user.avatar = allComments[i].user.avatar ? allComments[i].user.avatar : IMAGES_BASE_URL + allComments[i].user.name[0].toLowerCase() + '.png'
                                const data = {
                                    _id: allComments[i]._id,
                                    createdAt: allComments[i]._id,
                                    id: allComments[i].id,
                                    text: allComments[i].text,
                                    user: allComments[i].user,
                                    commentsHide: false,
                                    disLikeByMe: allComments[i].isMeDisLike,
                                    disLikesCount: allComments[i].disLiked ? allComments[i].disLiked : '0',
                                    likeByMe: allComments[i].isLiked,
                                    likesCount: allComments[i].likes ? allComments[i].likes : '0',
                                    isMeComment: allComments[i].isMeComment,
                                    image: allComments[i].media?.match(/png|jpeg|jpg/g) ? IMAGES_BASE_URL + allComments[i].media : '',
                                    quickReplies: {type: 'radio', keepIt: true, values: []}
                                }
                                for (let j = 0; j < allComments[i].reply.length; j++) {
                                    data.quickReplies.values.push(allComments[i].reply[j])
                                }
                                _allComments.push(data)
                            }
                            setComments(_allComments)
                        } else {
                            ShowAlert({type: 'error', description: response.data.message})
                        }
                    })
                    .catch((err) => {
                        setLoading(false)
                        ShowAlert({type: 'error', description: err.message})
                    })
            } catch (error) {
                setLoading(false)
                ShowAlert({type: 'error', description: error.message})
            }
        } else {
            setCommentText('')
            setCommentType('')
            setLoading(true)
            const data = delComment.id ? {id: delComment.id, comment: comment[0].text, page: 1, order: 'desc', imageData: commentImage} : {p_id: param?.id, comment: comment[0].text, page: 1, order: 'desc', imageData: commentImage}
            const headers = getHeaders(userData.auth_token)
            let url = delComment.id ? 'user/update_post_comment' : 'user/add_post_comments'
            try {
                await axios
                    .post(url, data, headers)
                    .then((response) => {
                        setLoading(false)
                        if (response.data.success === true) {
                            let _allComments = []
                            let allComments = response.data.data.comment.allComments ? response.data.data.comment.allComments : response.data.data.comment
                            for (let i = 0; i < allComments.length; i++) {
                                allComments[i].user.avatar = allComments[i].user.avatar ? allComments[i].user.avatar : IMAGES_BASE_URL + allComments[i].user.name[0].toLowerCase() + '.png'
                                const data = {
                                    _id: allComments[i]._id,
                                    createdAt: allComments[i]._id,
                                    id: allComments[i].id,
                                    text: allComments[i].text,
                                    user: allComments[i].user,
                                    image: allComments[i].media?.match(/png|jpeg|jpg/g) ? IMAGES_BASE_URL + allComments[i].media : '',
                                    commentsHide: true,
                                    disLikeByMe: allComments[i].isMeDisLike,
                                    disLikesCount: allComments[i].disLiked ? allComments[i].disLiked : '0',
                                    likeByMe: allComments[i].isLiked,
                                    likesCount: allComments[i].likes ? allComments[i].likes : '0',
                                    isMeComment: allComments[i].isMeComment,
                                    quickReplies: {
                                        type: 'radio',
                                        keepIt: true,
                                        values: []
                                    }
                                }
                                for (let j = 0; j < allComments[i].reply.length; j++) {
                                    data.quickReplies.values.push(allComments[i].reply[j])
                                }
                                _allComments.push(data)
                            }
                            setComments(_allComments)
                        } else {
                            ShowAlert({type: 'error', description: response.data.message})
                        }
                    })
                    .catch((err) => {
                        setLoading(false)
                        ShowAlert({type: 'error', description: err.message})
                    })
            } catch (error) {
                setLoading(false)
                ShowAlert({type: 'error', description: error.message})
            }
        }
    }
    const doLikeComment = async (item) => {
        const _likedData = {c_id: item.id, p_id: item.user.p_id}
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .post('user/like_comment', _likedData, headers)
                .then((response) => {
                    if (response.data.success === true) {
                        const _comments = comments.map((msg) => {
                            if (item.id == msg.id) {
                                msg.likeByMe = true
                            }
                            return msg
                        })
                        setComments(_comments)
                    }
                })
                .catch((error) => {})
        } catch (error) {
            ShowAlert({type: 'error', description: error.message})
        }
    }

    const doDisLike = async (item) => {
        const _DisLikedData = {
            c_id: item.id,
            p_id: item.user.p_id
        }
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .post('user/disLike_comment', _DisLikedData, headers)
                .then((response) => {
                    if (response.data.success === true) {
                        const _comments = comments.map((msg) => {
                            if (item.id == msg.id) {
                                msg.disLikeByMe = true
                            }
                            return msg
                        })

                        setComments(_comments)
                    }
                })
                .catch((error) => {})
        } catch (error) {
            ShowAlert({type: 'error', description: error.message})
        }
    }
    const doDisLikeRemove = async (item) => {
        const _DisLikedData = {
            c_id: item.id,
            p_id: item.user.p_id
        }
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .post('user/remove_disLike_comment', _DisLikedData, headers)
                .then((response) => {
                    if (response.data.success === true) {
                        const _comments = comments.map((msg) => {
                            if (item.id == msg.id) {
                                msg.disLikeByMe = false
                            }
                            return msg
                        })

                        setComments(_comments)
                    }
                })
                .catch((error) => {})
        } catch (error) {
            ShowAlert({type: 'error', description: error.message})
        }
    }

    const doUnLikeComment = async (item) => {
        const _likedData = {c_id: item.id, p_id: item.user.p_id}
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .post(`user/unlike_comment`, _likedData, headers)
                .then((response) => {
                    if (response.data.success === true) {
                        const _comments = comments.map((msg) => {
                            if (item.id == msg.id) {
                                msg.likeByMe = false
                            }
                            return msg
                        })
                        setComments(_comments)
                    }
                })
                .catch((error) => {})
        } catch (error) {
            ShowAlert({type: 'error', description: error.message})
        }
    }
    const moreRepliesViewHandler = async (id) => {
        const _comments = comments.map((msg) => {
            if (id == msg.id) {
                msg.commentsHide = !msg.commentsHide
            }
            return msg
        })
        setComments(_comments)
    }
    const openDeleteSheetHandler = (data) => {
        setDelComment(data)
        setCommentType('comment')
        deleteSheetRef.current.open()
    }

    const openReplySheetHandler = (reply) => {
        setDelComment(reply)
        setCommentType('reply')
        setTimeout(() => deleteSheetRef.current.open(), 200)
    }

    const doUpdateComment = async () => {
        deleteSheetRef.current.close()
        setCommentText(delComment?.reply ? delComment.reply : delComment.text)
    }

    const sellerProfile = (item) => navigation.navigate('ProfileScreen', {userId: item._id ? item._id : item.repliedUser.id})

    const doDeleteComment = () => {
        deleteSheetRef.current.close()
        setTimeout(async () => {
            setCommentType('')
            setLoading(true)
            const headers = getHeaders(userData.auth_token)
            if (commentType === 'reply') {
                try {
                    await axios
                        .post('user/delete_post_reply', {id: delComment.id}, headers)
                        .then(async (response) => {
                            if (response.data.success === true) {
                                const _comments = comments.map((itm) => {
                                    let newItem = itm.quickReplies.values.filter((item) => {
                                        return item.id != delComment.id
                                    })
                                    itm.quickReplies.values = newItem
                                    return itm
                                })
                                setComments(_comments)
                                setLoading(false)
                            } else {
                                setLoading(false)
                                ShowAlert({type: 'error', description: response.data.message})
                            }
                        })
                        .catch((err) => {
                            setLoading(false)
                            ShowAlert({type: 'error', description: err.message})
                        })
                } catch (err) {
                    setLoading(false)
                    ShowAlert({type: 'error', description: err.message})
                }
            } else {
                try {
                    await axios
                        .post('user/delete_post_comment', {id: delComment.id}, headers)
                        .then(async (response) => {
                            if (response.data.success === true) {
                                const _comments = comments.filter((item) => {
                                    return item.id != delComment.id
                                })
                                setComments(_comments)
                                setLoading(false)
                            } else {
                                setLoading(false)
                                ShowAlert({type: 'error', description: response.data.message})
                            }
                        })
                        .catch((err) => {
                            setLoading(false)
                            ShowAlert({type: 'error', description: err.message})
                        })
                } catch (err) {
                    setLoading(false)
                    ShowAlert({type: 'error', description: err.message})
                }
            }
        }, 200)
    }

    const openGallery = async () => {
        ImagePicker.openPicker({
            smartAlbums: ['UserLibrary'],
            mediaType: 'photo',
            multiple: false,
            includeBase64: true,
            compressImageQuality: 1
        })
            .then((response) => {
                let _data = 'data:image/png;base64,' + response.data
                setCommentImage(_data)
            })
            .catch((error) => {
                console.log('gallery error', error.message)
            })
    }
    const checkPermissions = async (type) => {
        if (Platform.OS === 'ios') {
            openGallery()
        } else if (Platform.OS === 'android') {
            if (Platform.OS === 'android' && Platform.constants['Release'] >= 13) {
                openGallery()
            } else {
                const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
                if (result === 'granted') {
                    openGallery()
                }
            }
        }
    }
    const CustomSendButton = (props) => {
        return (
            <Send {...props} containerStyle={{borderTopWdidth: 0, bottom: Platform.OS === 'android' ? hp(1.5) : hp(0)}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: wp(20)}}>
                    <Pressable onPress={checkPermissions}>
                        <FastImage source={require('../../../assets/icons/screens/gallery.png')} style={styles.gallery} resizeMode="contain" tintColor={Colors.LightGrayColor} />
                    </Pressable>
                    {commentText == '' && commentImage ? (
                        <Pressable onPress={() => submitComment([{text: ''}])}>
                            <FastImage source={require('../../../assets/icons/bottomtab/send.png')} style={styles.sendIcon} resizeMode="contain" tintColor={Colors.Green} />
                        </Pressable>
                    ) : (
                        <FastImage source={require('../../../assets/icons/bottomtab/send.png')} style={styles.sendIcon} resizeMode="contain" tintColor={Colors.Green} />
                    )}
                </View>
            </Send>
        )
    }

    const CustomFooter = (props) => {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: wp(100), paddingLeft: wp(2)}}>
                <Pressable style={styles.crossIconDirection} onPress={() => setCommentImage('')}>
                    <FastImage source={require('../../../assets/icons/screens/del_image.png')} resizeMode="contain" style={styles.crossIcon} />
                </Pressable>
                <FastImage source={{uri: commentImage}} style={styles.pickImage} resizeMode="cover" />
            </View>
        )
    }

    return (
        <View style={styles.screen}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title="Comments" />
            <GiftedChat
                renderUsernameOnMessage={true}
                onSend={(comments) => submitComment(comments)}
                messages={comments}
                showAvatarForEveryMessage={true}
                onPressAvatar={(message) => {}}
                showUserAvatar={true}
                renderAvatarOnTop={true}
                alwaysShowSend={true}
                renderSend={(props) => <CustomSendButton {...props} />}
                renderChatFooter={() => (commentImage ? <CustomFooter /> : null)}
                onInputTextChanged={(txt) => setCommentText(txt)}
                isCustomViewBottom={true}
                renderBubble={(props) => {
                    return (
                        <ReplyComment
                            currentMessage={props.currentMessage}
                            onLongPress={() => openDeleteSheetHandler(props.currentMessage)}
                            replyEditPress={(reply) => openReplySheetHandler(reply)}
                            onReplyPress={() => {
                                setReplyingUser(props.currentMessage)
                                setCommentText('@' + props.currentMessage.user.name + ' ')
                                setUserName('@' + props.currentMessage.user.name + '')
                            }}
                            onNestedReply={(reply) => {
                                setReplyingUser(props.currentMessage)
                                setCommentText('@' + reply.repliedUser.first_name + ' ' + reply.repliedUser.last_name + ' ')
                                setUserName('@' + reply.repliedUser.first_name + ' ' + reply.repliedUser.last_name + '')
                            }}
                            moreRepliesCB={() => moreRepliesViewHandler(props.currentMessage.id)}
                            doLikeCommentCB={(item) => doLikeComment(item)}
                            doUnLikeCommentCB={(item) => doUnLikeComment(item)}
                            disLikeCommentDB={(item) => doDisLike(item)}
                            removeDislikeCommentDB={(item) => doDisLikeRemove(item)}
                            commentsLikedListCB={() => null}
                            commentsDisLikedListDB={() => null}
                            profileShow={(reply) => sellerProfile(reply)}
                        />
                    )
                }}
                containerStyle={{
                    backgroundColor: Colors.White,
                    borderTopWidth: wp(0.2),
                    borderTopColor: Colors.BorderGrey,
                    bottom: 0,
                    left: 0,
                    right: 0
                }}
                textInputStyle={{
                    maxWidth: wp(80),
                    backgroundColor: Colors.White
                }}
                textInputProps={{
                    placeholderTextColor: Colors.DarkPepper_20,
                    color: Colors.Black,
                    placeholder: 'Type a comment',
                    returnKeyType: 'done',
                    value: commentText,
                    width: wp(80)
                }}
            />
            <BottomSheet setRef={deleteSheetRef} continueTitle={'Delete'} commentShow={true} continueTitleE={'Edit'} continueButtonCB={() => doDeleteComment()} continueButtonEC={() => doUpdateComment()} skipTitle={'Cancel'} skipButtonCB={() => deleteSheetRef.current.close()} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        flex: 1
    },
    sendText: {
        paddingBottom: hp('2'),
        paddingHorizontal: wp('2'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    tabViewText: {
        paddingBottom: hp('1'),
        paddingHorizontal: wp('2'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    sendIcon: {
        width: wp('6%'),
        height: wp('6%'),
        right: wp('4%')
    },
    gallery: {
        width: wp('6%'),
        height: wp('6%')
    },
    pickImage: {
        width: wp('25%'),
        height: hp('12%'),
        borderRadius: wp(2)
    },
    normalStyle: {
        width: wp('70%'),
        height: hp('7%'),
        paddingLeft: wp('1%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.White
    },
    crossIconDirection: {
        top: hp(0.4),
        left: wp(20),
        position: 'absolute',
        zIndex: 1
    },
    crossIcon: {
        width: wp('6%'),
        height: wp('6%')
    }
})

export default CommentScreen
