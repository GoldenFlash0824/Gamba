import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import moment from 'moment'
import FastImage from 'react-native-fast-image'

import Avatar from './Avatar'
import {IMAGES_BASE_URL} from '../../../services/constants'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const ReplyComment = ({replies, onReplyPress, moreRepliesCB, currentMessage, onLongPress, profileShow, disLikeCommentDB, replyEditPress, removeDislikeCommentDB, onNestedReply, doLikeCommentCB, doUnLikeCommentCB, commentsLikedListCB, commentsDisLikedListDB, stateUpdate}) => {
    const [showReply, setShowReply] = useState(currentMessage.commentsHide)
    const [likeComment, setLikeComment] = useState(currentMessage.likeByMe)

    let [likeCommentCount, setLikeCommentCount] = useState(currentMessage.likesCount)

    const [disLikeComment, setDisLikeComment] = useState(currentMessage.disLikeByMe)
    let [disLikeCommentCount, setDisLikeCommentCount] = useState(currentMessage.disLikesCount)
    const showReplyHandler = () => {
        moreRepliesCB()
        setShowReply(!showReply)
    }
    const handleLikeOrUnLike = (liked) => {
        liked ? doUnLikeCommentCB(currentMessage) : doLikeCommentCB(currentMessage)
        liked ? setLikeComment(false) : setLikeComment(true)
        let _likeCommentCount = liked ? +likeCommentCount - 1 : +likeCommentCount + 1
        setLikeCommentCount(_likeCommentCount)
    }

    const handleDisLike = (disLiked) => {
        disLiked ? disLikeCommentDB(currentMessage) : removeDislikeCommentDB(currentMessage)
        disLiked ? setDisLikeComment(false) : setDisLikeComment(true)
        let _disLikeCommentCount = disLiked ? +disLikeCommentCount - 1 : +disLikeCommentCount + 1
        setDisLikeCommentCount(_disLikeCommentCount)
    }
    // const replyRender = useCallback(
    //     (values) => {
    //         values.map((reply, index) => {
    //             console.log('===reply', reply)
    //             return (
    //                 <View key={index.toString()}>
    //                     <View style={styles.replyContainer}>
    //                         <Avatar img={{uri: reply.repliedUser.image ? IMAGES_BASE_URL + reply.repliedUser.image : IMAGES_BASE_URL + reply.repliedUser.first_name[0].toLowerCase() + '.png'}} avatarStyle={styles.image} />
    //                         <View>
    //                             <View style={styles.nameTimeContainerR}>
    //                                 <Text style={styles.replyuserName} numberOfLines={1}>
    //                                     {reply.repliedUser.first_name + ' ' + reply.repliedUser.last_name}
    //                                 </Text>
    //                                 {/* <Text style={styles.replyuserTime} numberOfLines={1}>
    //                                                 {moment(reply.createdAt).format('hh:mm A')}
    //                                             </Text> */}
    //                             </View>
    //                             <View style={styles.innerReplyTextConaitner}>
    //                                 <Text style={styles.replyText}>{reply.reply}</Text>
    //                             </View>
    //                         </View>
    //                     </View>
    //                     <View style={styles.replytTimeContainerR}>
    //                         <Text style={styles.replyTime}>{moment(reply.createdAt).fromNow()}</Text>
    //                         <View style={styles.replyLeftC}>
    //                             <TouchableOpacity onPress={() => onNestedReply(reply)} activeOpacity={0.8}>
    //                                 <Text style={styles.innerReply}>{'Reply'}</Text>
    //                             </TouchableOpacity>
    //                             {reply.isMeReply == 1 && (
    //                                 <TouchableOpacity activeOpacity={0.8} style={styles.iconConatiner} onPress={() => replyEditPress(reply)}>
    //                                     <FastImage source={require('../../../assets/icons/screens/vertical.png')} style={styles.verticalIcon} />
    //                                 </TouchableOpacity>
    //                             )}
    //                         </View>
    //                     </View>
    //                 </View>
    //             )
    //         })
    //     },
    //     [updt, currentMessage]
    // )

    const replyRender = useCallback(
        (values) => {
            return values.map((reply, index) => (
                <React.Fragment key={index.toString()}>
                    <View>
                        <View style={styles.replyContainer}>
                            <Avatar img={{uri: reply.repliedUser.image ? IMAGES_BASE_URL + reply.repliedUser.image : IMAGES_BASE_URL + reply.repliedUser.first_name[0].toLowerCase() + '.png'}} avatarStyle={styles.image} />
                            <View>
                                <TouchableOpacity style={styles.nameTimeContainerR} activeOpacity={0.8} onPress={() => profileShow(reply)}>
                                    <Text style={styles.replyuserName} numberOfLines={1}>
                                        {reply.repliedUser.first_name + ' ' + reply.repliedUser.last_name}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.innerReplyTextConaitner}>
                                    {reply.image && <FastImage source={{uri: IMAGES_BASE_URL + reply.image}} style={{width: '100%', height: hp(30), borderRadius: wp(2)}} />}
                                    {reply.reply && <Text style={styles.replyText}>{reply.reply}</Text>}
                                </View>
                            </View>
                        </View>
                        <View style={styles.replytTimeContainerR}>
                            <Text style={styles.replyTime}>{moment(reply.createdAt).fromNow()}</Text>
                            <View style={styles.replyLeftC}>
                                <TouchableOpacity onPress={() => onNestedReply(reply)} activeOpacity={0.8}>
                                    <Text style={styles.innerReply}>{'Reply'}</Text>
                                </TouchableOpacity>
                                {reply.isMeReply == 1 && (
                                    <TouchableOpacity activeOpacity={0.8} style={styles.iconConatiner} onPress={() => replyEditPress(reply)}>
                                        <FastImage source={require('../../../assets/icons/screens/vertical.png')} style={styles.verticalIcon} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </React.Fragment>
            ))
        },
        [currentMessage]
    )
    return (
        <View>
            <View>
                <TouchableOpacity style={styles.nameTimeContainer} activeOpacity={0.8} onPress={() => profileShow(currentMessage.user)}>
                    <Text style={styles.replyuserName} numberOfLines={1}>
                        {currentMessage.user.name}
                    </Text>
                    {/* <Text style={styles.replyuserTime} numberOfLines={1}>
                            {moment(currentMessage.createdAt).format('hh:mm A')}
                        </Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={styles.replyTextConaitner}>
                    {currentMessage.image && <FastImage source={{uri: currentMessage.image}} style={{width: '100%', height: hp(30), borderRadius: wp(2)}} />}
                    {currentMessage.text && <Text style={styles.replyText}>{currentMessage.text}</Text>}
                </TouchableOpacity>
                <View style={styles.replytTimeContainer}>
                    <Text style={styles.replyTime}>{moment(currentMessage.createdAt).fromNow()}</Text>

                    {/* <TouchableOpacity onPress={() => handleLikeOrUnLike(likeComment)}>
                        <FastImage source={likeComment ? require('../../../assets/icons/screens/thumbsup.png') : require('../../../assets/icons/screens/thumbsup.png')} tintColor={likeComment ? Colors.MainThemeColor : Colors.DarkPepper_80} style={styles.filledHeartIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => commentsLikedListCB()}>
                        <Text style={styles.bottomText}>{likeCommentCount.toString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDisLike(disLikeComment)}>
                        <FastImage source={disLikeComment ? require('../../../assets/icons/screens/thumb_down.png') : require('../../../assets/icons/screens/thumb_down.png')} tintColor={disLikeComment ? Colors.MainThemeColor : Colors.DarkPepper_80} style={styles.filledHeartIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => commentsDisLikedListDB()}>
                        <Text style={styles.bottomText}>{disLikeCommentCount}</Text>
                    </TouchableOpacity> */}
                    <View style={styles.replyLeftC}>
                        <TouchableOpacity onPress={() => onReplyPress()} activeOpacity={0.8}>
                            <Text style={styles.reply}>{'Reply'}</Text>
                        </TouchableOpacity>
                        {currentMessage.isMeComment && (
                            <TouchableOpacity activeOpacity={0.8} style={styles.iconConatiner} onPress={onLongPress}>
                                <FastImage source={require('../../../assets/icons/screens/vertical.png')} style={styles.verticalIcon} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
            <View>
                {currentMessage.quickReplies.values.length > 0 &&
                    // (showReply ? (
                    //     <TouchableOpacity onPress={() => showReplyHandler()} activeOpacity={0.8}>
                    //         <Text style={styles.moreReply}>{`--------View ${currentMessage.quickReplies.values.length} more ${currentMessage.quickReplies.values.length > 1 ? 'replies' : 'reply'}`} </Text>
                    //     </TouchableOpacity>
                    // ) : (
                    replyRender(currentMessage.quickReplies.values)}
                {/* {!showReply && (
                    <TouchableOpacity onPress={() => showReplyHandler()} activeOpacity={0.8}>
                        <Text style={styles.moreReply}>{`--------Hide ${currentMessage.quickReplies.values.length > 1 ? 'replies' : 'reply'}`} </Text>
                    </TouchableOpacity>
                )} */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    replyTextConaitner: {
        marginLeft: wp('1'),
        backgroundColor: Colors.BackgroundColor,
        padding: wp('1'),
        minWidth: wp('80'),
        maxWidth: wp('80'),
        borderRadius: wp('2'),
        paddingHorizontal: wp(2),
        paddingVertical: hp('1')
    },
    innerReplyTextConaitner: {
        marginLeft: wp('1'),
        backgroundColor: Colors.BackgroundColor,
        padding: wp('1'),
        minWidth: wp('70'),
        maxWidth: wp('70'),
        borderRadius: wp('2'),
        paddingHorizontal: wp(2),
        paddingVertical: hp('1')
    },
    nameTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: wp('1'),
        maxWidth: wp('78')
    },
    nameTimeContainerR: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: wp('2'),
        maxWidth: wp('70')
    },
    replyuserName: {
        maxWidth: wp('40'),
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_11,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    replyuserTime: {
        // maxWidth: wp('15'),
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_10,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    reply: {
        paddingLeft: wp('2%'),
        paddingVertical: hp('1'),
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    replyTime: {
        // paddingLeft: wp('1%'),
        paddingVertical: hp('1'),
        // maxWidth: wp('20'),
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_9,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    verticalIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    iconConatiner: {
        width: wp('7%'),
        alignItems: 'flex-end'
        // borderWidth:
    },
    replyLeftC: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    replyText: {
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    replyContainer: {
        marginTop: hp('1'),
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    innerReply: {
        paddingLeft: wp('2%'),
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    moreReply: {
        marginBottom: hp('1'),
        color: Colors.DarkPepper_80,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    replytTimeContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: wp('75'),
        maxWidth: wp('75')

        // maxWidth: wp('40')
    },
    replytTimeContainerR: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: wp('65'),
        maxWidth: wp('65')

        // maxWidth: wp('40')
    },
    filledHeartIcon: {
        marginLeft: wp('1%'),
        width: wp('4.5%') * 1.1,
        height: wp('4.5%')
    },
    image: {
        width: wp('9'),
        height: wp('9%')
    },

    bottomText: {
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.DarkPepper_60,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingLeft: wp('1%')
    }
})
export default ReplyComment
