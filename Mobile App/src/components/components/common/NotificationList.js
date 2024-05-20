import React from 'react'
import {View, TouchableOpacity, Text, StyleSheet, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import moment from 'moment'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {IMAGES_BASE_URL} from '../../../services'
import Avatar from './Avatar'

const NotificationList = ({item, navigationCB, onPress}) => {
    const getTimeDifferenceString = (createdAt) => {
        const now = moment()
        const duration = moment.duration(now.diff(createdAt))
        const hours = duration.asHours()
        const days = duration.asDays()
        const months = duration.asMonths()
        const minutes = duration.asMinutes()

        if (months >= 1) {
            return `${Math.floor(months)} month${Math.floor(months) !== 1 ? 's' : ''} ago`
        } else if (days >= 1) {
            return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''} ago`
        } else if (hours >= 1) {
            return `${Math.floor(hours)} hr${Math.floor(hours) !== 1 ? 's' : ''} ago`
        } else if (minutes >= 1) {
            return `${Math.floor(minutes)} minute${Math.floor(minutes) !== 1 ? 's' : ''} ago`
        } else {
            return 'Just now'
        }
    }

    const createdAt = moment(item.createdAt)
    const userDataNotification = item.user_data_notification
    const dateToShow = userDataNotification ? getTimeDifferenceString(createdAt) : getTimeDifferenceString(createdAt)
    const isToday = moment(item.createdAt).isSame(moment(), 'day')
    const isYesterday = moment(item.createdAt).isSame(moment().subtract(1, 'days'), 'day')
    const formattedDate = isToday ? 'New' : isYesterday ? 'Yesterday' : moment(item.createdAt).format('MMM D, YYYY')

    return (
        <View>
            {item?.isNew && (
                <Text style={styles.msgCheck} numberOfLines={1}>
                    {formattedDate}
                </Text>
            )}

            <TouchableOpacity style={styles.itemContainerStyle} onPress={onPress}>
                <View style={styles.innerItemConatinerStyle}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {}} style={styles.imageConatiner}>
                        <Avatar img={{uri: item?.user_data_notification.image ? IMAGES_BASE_URL + item?.user_data_notification.image : IMAGES_BASE_URL + item.user_data_notification.first_name[0]?.toLowerCase() + '.png'}} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.profileComment}>
                        <Text style={styles.titleText} numberOfLines={1}>
                            {item.user_data_notification.first_name + ' ' + item.user_data_notification.last_name}
                        </Text>
                        {item?.message && (
                            <Text style={styles.date} numberOfLines={1}>
                                {item?.message}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.followViewChat} activeOpacity={0.8} onPress={navigationCB}>
                    {!item.is_read && <View style={styles.messagesCounterWrapper} />}
                    <Text style={styles.date} numberOfLines={1}>
                        {dateToShow}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    itemContainerStyle: {
        marginTop: hp('0.8'),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        height: hp('10%'),
        width: wp('92%'),
        borderWidth: wp('.2'),
        borderColor: Colors.BorderGrey,
        justifyContent: 'space-between',
        paddingHorizontal: wp('2'),
        alignItems: 'center',
        borderRadius: wp(4)
    },

    innerItemConatinerStyle: {
        flexDirection: 'row',
        height: hp('10%'),
        width: wp('60%'),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imageConatiner: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileComment: {
        width: wp('51%'),
        maxWidth: wp('51%'),
        alignSelf: 'center',
        paddingLeft: wp('2')
    },
    date: {
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        maxWidth: wp('51%')
    },
    msgCheck: {
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        marginTop: hp('1.5%')
    },

    titleText: {
        color: Colors.Black,
        fontSize: Platform.OS == 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        maxWidth: wp('51%')
    },

    followViewChat: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    messagesCounterWrapper: {
        alignSelf: 'flex-end',
        minWidth: wp('3%'),
        minHeight: wp('3%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.UreadDot,
        justifyContent: 'center',
        alignItems: 'center',
        right: wp('1%'),
        bottom: hp('2%')
    }
})

export default NotificationList
