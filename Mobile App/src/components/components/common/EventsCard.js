import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View, Platform, Linking} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
// import moment from 'moment'
import {useSelector} from 'react-redux'
const moment = require('moment-timezone')
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {IMAGES_BASE_URL} from '../../../services/constants'
import {separatorHeight} from '../../../utils/helpers'

const EventsCard = ({item, allevents, editCB, index, joinEventPress, locationHandler, userId, allEventCB, joinAdd, unJoin}) => {
    const {userData} = useSelector((state) => state.user)
    const parseStartdDate = moment(item?.start_date)
    const parsedDate = moment(item?.end_date)

    let _startDate = moment(item?.start_date).format('MM-DD-YYYY')
    let _endDate = moment(item?.end_date).format('MM-DD-YYYY')

    const openMapUrl = (item) => {
        const mapLink = Platform.OS === 'android' ? `https://www.google.com/maps/dir/${userData.lat},${userData.log}/@${item.latitude},${item.longitude}/${item.location}` : `http://maps.apple.com/?saddr=${userData.lat},${userData.log}&daddr=@${item.latitude},${item.longitude}`
        Linking.openURL(mapLink)
    }
    return (
        <View style={[styles.card, {marginTop: index == 0 ? 0 : hp('2')}]}>
            <View style={styles.emptyView} />
            <View style={styles.cardContainer}>
                <FastImage source={{uri: IMAGES_BASE_URL + item?.image}} resizeMode={'contain'} style={[styles.midImageWraper, {height: undefined, aspectRatio: 16 / 7.6}]} />
                <View style={styles.titleView}>
                    <View style={styles.innerTitleView}>
                        <Text style={styles.titleText}>{item.title}</Text>
                        <Text style={styles.tardeBy}>
                            {' By '}
                            <Text style={styles.userNameProduct}> {item?.eventUser?.first_name + ' ' + item?.eventUser?.last_name}</Text>
                        </Text>
                    </View>

                    {!allevents ? (
                        <TouchableOpacity onPress={editCB} activeOpacity={0.8}>
                            <FastImage source={require('../../../assets/icons/screens/vertical.png')} style={styles.vertical} />
                        </TouchableOpacity>
                    ) : userId != item.u_id ? (
                        <View style={styles.dotsJoinCotainer}>
                            <TouchableOpacity onPress={allEventCB}>
                                <FastImage source={require('../../../assets/icons/screens/vertical.png')} style={styles.vertical} />
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
                <View style={styles.dateCalendar}>
                    <FastImage source={require('../../../assets/icons/bottomtab/create_event.png')} style={styles.image} />
                    <Text style={[styles.date]}>{_startDate === _endDate ? parseStartdDate.format('MM-DD-YY [at] hh:mm A') + ' ends ' + parsedDate.format('hh:mm A') : parseStartdDate.format('MM-DD-YY [at] hh:mm A') + ' ends ' + parsedDate.format('MM-DD-YY [at] hh:mm A')}</Text>
                </View>
                <View style={styles.dateCalendar} activeOpacity={0.8}>
                    <TouchableOpacity style={styles.priceview} onPress={() => openMapUrl(item)}>
                        <FastImage source={require('../../../assets/icons/bottomtab/pin.png')} style={styles.image} tintColor={Colors.Black} />
                        <Text style={styles.smallText}>
                            {item.is_private && item.location.includes(',') ? item.location.slice(item.location, item.location.length).trimStart() : item.location}
                            <Text style={styles.smallText}>
                                {', '}
                                {item.distance}
                                {' miles'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dateCalendarS}>
                    <View style={styles.priceviewS}>
                        <FastImage source={require('../../../assets/icons/screens/sell_post.png')} style={styles.image} />
                        <Text style={[styles.eventPrice]}>${item?.price}</Text>
                    </View>
                    {item.joinEvent.length > 0 ? (
                        <TouchableOpacity activeOpacity={0.8} style={styles.seeContainer} onPress={joinEventPress}>
                            <FastImage source={require('../../../assets/icons/screens/participants.png')} style={styles.participants} resizeMode="contain" tintColor={Colors.LightGrayColor} />
                            <Text style={styles.seeMoreTitle}>{item?.joinEvent.length > 0 ? '(' + item?.joinEvent.length + ')' : ''}</Text>
                        </TouchableOpacity>
                    ) : null}
                    <View>
                        {!allevents ? null : userId != item.u_id ? (
                            <TouchableOpacity style={item?.isJoinMe === 0 ? styles.joinContainer : styles.unJoinContainer} onPress={item?.isJoinMe === 0 ? joinAdd : unJoin}>
                                <Text style={item?.isJoinMe === 0 ? styles.joinTextW : styles.joinText}>{item?.isJoinMe === 0 ? `Join` : `Joined`}</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
                <Text style={styles.textDescription}>{item?.summary}</Text>
                {separatorHeight()}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    card: {
        width: wp('92%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        marginTop: hp('2%'),
        backgroundColor: Colors.BackgroundColor,
        // shadowColor: Colors.Shadow_Color,
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // elevation: 5,
        // shadowRadius: 4,
        paddingTop: hp('1')
    },
    emptyView: {
        width: wp('100%'),
        height: hp('1'),
        backgroundColor: Colors.White
    },
    line: {
        width: wp('86%'),
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        right: wp('1%')
    },
    seeContainer: {
        // width: wp('30%'),
        // top: hp('2%'),
        // left: wp('4%'),
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: wp('2')
    },
    seeMoreTitle: {
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    joinImageConatiner: {
        width: wp('100%'),
        flexDirection: 'row',
        marginLeft: wp('6%'),
        marginTop: hp('1')
    },
    cardContainer: {
        width: wp('92%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: Colors.BackgroundColor
    },
    titleView: {
        width: wp('92%'),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1%')
    },
    innerTitleView: {
        width: wp('83%')
    },
    titleText: {
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        color: Colors.Black,
        maxWidth: wp('83%')
    },
    dotsJoinCotainer: {
        width: wp('20%'),
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    joinContainer: {
        borderRadius: wp('6'),
        backgroundColor: Colors.White,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: wp('1%'),
        minWidth: wp('20'),
        borderWidth: wp('.2'),
        borderColor: Colors.MainThemeColor
    },
    unJoinContainer: {
        borderRadius: wp('6'),
        paddingVertical: wp('1%'),
        backgroundColor: Colors.MainThemeColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tardeBy: {
        maxWidth: wp('83%'),
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_Italic,
        right: wp('0.8%')
    },
    userNameProduct: {
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginLeft: wp('1.5')
    },
    image: {
        width: wp('5%'),
        height: wp('5%')
    },
    participants: {
        width: wp('10%'),
        height: wp('10%')
    },
    vertical: {
        width: wp('7%'),
        height: wp('7%')
    },
    joinContainerEmpty: {
        width: wp('15')
    },
    date: {
        maxWidth: wp('80'),
        paddingLeft: wp('2'),
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    smallText: {
        maxWidth: wp('78'),
        paddingLeft: wp('2'),
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    eventPrice: {
        paddingLeft: wp('2'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    joinText: {
        paddingLeft: wp('2'),
        paddingRight: wp('2'),
        paddingTop: hp('.5'),
        paddingBottom: hp('.5'),
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    joinTextW: {
        paddingLeft: wp('2'),
        paddingRight: wp('2'),
        paddingTop: hp('.5'),
        paddingBottom: hp('.5'),
        color: Colors.MainThemeColor,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    dateCalendar: {
        width: wp('92%'),
        maxWidth: wp(92),
        marginTop: hp('0.8%'),
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    dateCalendarS: {
        width: wp('92%'),
        maxWidth: wp(92),
        marginTop: hp('0.8%'),
        flexDirection: 'row',
        alignItems: 'center'
    },
    priceview: {
        width: wp('80%'),
        flexDirection: 'row',
        alignItems: 'center'
    },
    priceviewS: {
        width: wp('35%'),
        flexDirection: 'row',
        alignItems: 'center'
    },

    textDescription: {
        marginTop: hp('1'),
        width: wp('88%'),
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    midImageWraper: {
        marginTop: hp('1'),
        width: wp('92%'),
        height: Platform.OS == 'android' ? hp('32') : hp('23'),
        borderRadius: hp('2%')
    },
    arrowConatiner: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        top: hp('12'),
        zIndex: 1
    },
    iconsStylesWithMargin: {
        width: '100%',
        height: '100%'
    },
    arrowCircle: {
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BorderGrey
    },
    arrowLeftC: {
        width: wp('38%'),
        alignItems: 'flex-start'
    },
    arrowLeftR: {
        width: wp('38%'),
        alignItems: 'flex-end'
    },
    _dotStyle: {
        width: wp('2%'),
        height: wp('2%'),
        marginHorizontal: wp('0%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.HTextColor
    },
    _inactiveDotStyle: {
        width: wp('2%'),
        height: wp('2%'),
        borderRadius: wp('2%'),
        marginHorizontal: wp('0%'),
        backgroundColor: Colors.DarkPepper_40
    },
    feedImage: {
        marginTop: hp('1'),
        width: wp('92%'),
        height: hp('20%')
    },
    listContainer: {
        width: wp('16%'),
        alignItems: 'center',
        marginLeft: wp('1'),
        alignItems: 'center'
    },
    imagNameContainer: {
        height: wp('14%'),
        width: Platform.OS == 'android' ? wp('14%') : wp('14%'),
        borderRadius: hp('7%'),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.LightCream_10
    },
    imageContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    nameText: {
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_BOLD,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        textAlign: 'center'
    }
})

export default EventsCard
