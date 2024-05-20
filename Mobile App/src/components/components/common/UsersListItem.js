import React from 'react'
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'
import Avatar from './Avatar'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import moment from 'moment'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {IMAGES_BASE_URL} from '../../../services'
import {letterColors} from '../../../services/helpingMethods'

const UsersListItem = ({item, navigationCB, chat = false, comment = false, menu = false, chatName = false, onPress, bank = false, payment = false}) => {
    return (
        <TouchableOpacity style={menu || comment ? [styles.itemContainerStyle, {height: comment ? hp('11') : hp('8')}] : styles.itemContainer} onPress={onPress}>
            <TouchableOpacity style={menu ? styles.leftProfileImageM : styles.leftProfileImage} activeOpacity={0.8} onPress={() => {}}>
                {menu ? <Avatar img={item?.user_data_notification ? {uri: IMAGES_BASE_URL + item?.user_data_notification?.image} : item.images} resizeMode={item.product ? 'contain' : 'cover'} avatarStyle={item.change ? styles.activeIconC : item.product ? styles.productsIcon : styles.avatar} /> : <Avatar img={comment ? {uri: item?.user_data_notification.image ? IMAGES_BASE_URL + item?.user_data_notification.image : IMAGES_BASE_URL + item.user_data_notification.first_name[0]?.toLowerCase() + '.png'} : chat ? {uri: item.images} : item.images} />}
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={menu || comment ? styles.menuTitle : styles.profileComment}>
                <Text style={menu || comment ? styles.titleTextMenu : chatName ? styles.titleTextChat : styles.titleText} numberOfLines={menu ? 1 : 2}>
                    {item?.user_data_notification ? item.user_data_notification.first_name + ' ' + item.user_data_notification.last_name : item.title}
                </Text>
                {!menu && (
                    <>
                        {item?.user_data_notification || item.comment ? (
                            <>
                                {comment ||
                                    (chat && (
                                        <>
                                            <Text style={styles.titleMentioned} numberOfLines={1}>
                                                {item?.user_data_notification ? item?.message : item.comment}
                                            </Text>
                                        </>
                                    ))}
                                {!chat && (
                                    <Text style={styles.date} numberOfLines={1}>
                                        {item?.user_data_notification ? moment(item.createdAt).fromNow() : item.date}
                                    </Text>
                                )}
                            </>
                        ) : null}
                    </>
                )}
                {chat && (
                    <View style={styles.locationContainer}>
                        <Text style={styles.milesText} numberOfLines={1}>
                            {item?.msgText}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {chat && (
                <TouchableOpacity style={styles.followViewChat} activeOpacity={0.8} onPress={navigationCB}>
                    {/* {item?.unreadCount && item?.unreadCount == 0 ? (
                        <View style={styles.messagesCounterWrapper}>
                            <Text style={styles.messagesCounter}>{item.unreadCount}</Text>
                        </View>
                    ) : null} */}
                    <Text style={styles.chatText}>Chat</Text>
                    {/* <FastImage source={require('../../../assets/icons/screens/chat_b.png')} style={styles.chatIcon} tintColor={Colors.MainThemeColor}></FastImage> */}
                </TouchableOpacity>
            )}
            {payment || menu ? (
                <TouchableOpacity>
                    <FastImage source={require('../../../assets/icons/screens/right.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.Black} />
                </TouchableOpacity>
            ) : null}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: Colors.White,
        flexDirection: 'row',
        height: hp('10%'),
        width: wp('88%'),
        borderWidth: wp(0.2),
        borderColor: Colors.BorderGrey,
        justifyContent: 'space-between',
        paddingHorizontal: wp('2'),
        alignItems: 'center',
        marginTop: hp('1%'),
        borderRadius: wp(4)
    },

    onlineIcon: {
        width: wp('3%'),
        height: wp('3%'),
        borderRadius: hp('1.5%'),
        backgroundColor: Colors.Green,
        position: 'absolute',
        left: wp('11%'),
        top: hp('6%'),
        zIndex: 1
    },

    profileComment: {
        width: wp('60%'),
        alignSelf: 'center'
    },
    menuTitle: {
        width: wp('70%'),
        alignSelf: 'center'
    },
    date: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_Italic,
        marginTop: hp('0.3%'),
        paddingLeft: wp('4%')
    },
    chatIcon: {
        width: wp('6.5%'),
        height: wp('6.5%')
    },
    itemContainerStyle: {
        marginTop: hp('1'),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        height: hp('8%'),
        width: wp('92%'),
        borderWidth: wp('.2'),
        borderColor: Colors.BorderGrey,
        justifyContent: 'space-between',
        paddingHorizontal: wp('2'),
        alignItems: 'center',
        borderRadius: wp(4)
    },
    leftProfileImage: {
        width: wp('10%'),
        position: 'relative'
    },
    leftProfileImageM: {
        width: wp('7%')
    },
    titleText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('55%'),
        paddingLeft: wp('2%')
    },
    titleTextChat: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('68%'),
        paddingLeft: wp('3%')
    },
    titleTextMenu: {
        maxWidth: wp('70%'),
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.Black
    },

    titleMentioned: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('55%'),
        paddingLeft: wp('2%')
    },
    followViewChat: {
        // width: wp('8%'),
        backgroundColor: Colors.MainThemeColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('1%'),
        borderRadius: wp(8),
        paddingVertical: hp(0.8),
        paddingHorizontal: wp(2)
    },
    activeIconC: {
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: wp('0%')
    },
    productsIcon: {
        width: wp('8%') * 0.89,
        height: wp('8%'),
        borderRadius: wp('0%')
    },
    chatText: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    rememberImage: {
        width: wp('6%'),
        height: wp('6%')
    },
    messagesCounterWrapper: {
        position: 'absolute',
        alignSelf: 'flex-end',
        minWidth: wp('4%'),
        minHeight: wp('4%'),
        borderRadius: wp('2%'),
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        right: wp('1.5%'),
        bottom: hp('2.5%')
    },
    messagesCounter: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_10,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    avatar: {
        width: wp('6%'),
        height: wp('6%'),
        borderRadius: wp('0%')
    },
    bankTitle: {
        alignSelf: 'center',
        paddingLeft: wp('4%')
    },
    imagNameContainer: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: hp('7%'),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.LightCream_10
        // backgroundColor: Colors.MainThemeColor
    },
    nameText: {
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        textAlign: 'center'
    },
    locationContainer: {
        paddingHorizontal: wp('3%'),
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: wp('68%'),
        paddingTop: hp('0.3%')
    },
    mapPin: {
        width: wp('4%'),
        height: wp('4%')
    },
    milesText: {
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginLeft: wp('.5%')
    }
})

export default UsersListItem
