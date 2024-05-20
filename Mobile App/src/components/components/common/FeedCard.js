import React, {useState, useCallback, useRef} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Platform, Linking} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import Carousel, {Pagination} from 'react-native-snap-carousel'
import {useSelector} from 'react-redux'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ImagesCard from './ImagesCard'
import {letterColors} from '../../../services/helpingMethods'
import {IMAGES_BASE_URL} from '../../../services/constants'
import {separatorHeight, getHeaders} from '../../../utils/helpers'
import ShareButton from './ShareButton'
import moment from 'moment'

const FeedCard = ({community = false, seller, myProductView = false, chatS, postUnLikeCB, sellerLike, allLikesS, editPost = false, item, editPostPress, profileShow = false, navigateProfile, postLikeCB, allPostShow = false, userId, onDotPress, index, loadingC = false, postId = ''}) => {
    const {userData} = useSelector((state) => state.user)
    const [textShown, setTextShown] = useState(false)
    const [lengthMoreLength, setLengthMoreLength] = useState(3)
    const [truncatedDesc, setTruncatedDesc] = useState()
    const [lastThree, setLastThree] = useState()
    const [_index, setIndex] = useState(0)
    const myCarousel = useRef()

    const toggleNumberOfLines = () => {
        setTextShown(!textShown)
    }

    const onTextLayout = useCallback((e) => {
        if (lengthMoreLength == e.nativeEvent.lines.length) {
            setLengthMoreLength()
        } else {
            if (Platform.OS === 'android') {
                if (e.nativeEvent.lines.length > 3) {
                    const truncatedDescriptionO = e.nativeEvent.lines[0].text
                    const truncatedDescriptionT = e.nativeEvent.lines[1].text
                    const truncatedDescription = e.nativeEvent.lines[2].text
                    const words = truncatedDescription?.split(' ')
                    const withoutLastThreeWords = words?.slice(0, -3).join(' ')
                    const lastThreeWords = words?.slice(-3).join(' ')
                    const withoutLastThreeWordsD = truncatedDescriptionO + truncatedDescriptionT + withoutLastThreeWords
                    setTruncatedDesc(withoutLastThreeWordsD)
                    setLastThree(lastThreeWords)

                    setLengthMoreLength(e.nativeEvent.lines.length)
                } else {
                    setLengthMoreLength()
                }
            } else {
                if (e.nativeEvent.lines.length > 3) {
                    const truncatedDescriptionO = e.nativeEvent.lines[0].text
                    const truncatedDescriptionT = e.nativeEvent.lines[1].text
                    const truncatedDescription = e.nativeEvent.lines[2].text
                    const words = truncatedDescription?.split(' ')
                    const withoutLastThreeWords = words?.slice(0, -3).join(' ')
                    const lastThreeWords = words?.slice(-3).join(' ')
                    const withoutLastThreeWordsD = truncatedDescriptionO + truncatedDescriptionT + withoutLastThreeWords
                    setTruncatedDesc(withoutLastThreeWordsD)
                    setLastThree(lastThreeWords)
                    setLengthMoreLength(e.nativeEvent.lines.length)
                } else {
                    setLengthMoreLength()
                }
            }
        }
    }, [])

    const openMapUrl = (user) => {
        const mapLink = Platform.OS === 'android' ? `https://www.google.com/maps/dir/${userData.lat},${userData.log}/@${user.lat},${user.log}/${user.location}` : `http://maps.apple.com/?saddr=${userData.lat},${userData.log}&daddr=@${user.lat},${user.log}`
        Linking.openURL(mapLink)
    }
    const renderItem = (item, index) => {
        return <ImagesCard setRef={myCarousel} item={item} type={'Seller'} />
    }

    return (
        <View style={[styles.cardContainer]}>
            <View style={styles.emptyView} />
            {loadingC && postId == item.id && <View style={styles.indicator} />}
            <View style={[styles.card]}>
                {profileShow ? (
                    <View style={styles.cardHeader}>
                        <TouchableOpacity activeOpacity={0.8} onPress={navigateProfile} style={[styles.avatarContainer]}>
                            <FastImage source={{uri: item?.user?.image ? IMAGES_BASE_URL + item?.user?.image : IMAGES_BASE_URL + item?.user?.first_name[0]?.toLowerCase() + '.png'}} resizeMode="cover" style={styles.avatar} />
                        </TouchableOpacity>
                        {/* <View style={styles.nameFounderWrapper}>? */}
                        <View style={community ? styles.titleRelationWrapperSocial : styles.titleRelationWrapperSocialS}>
                            <TouchableOpacity activeOpacity={0.8} onPress={navigateProfile}>
                                <Text style={styles.nameText} numberOfLines={1}>
                                    {item?.user?.first_name + ' ' + item?.user?.last_name}
                                </Text>
                            </TouchableOpacity>
                            {/* {(item?.user?.location || item?.user?.address) && item?.user?.display_location && item?.user?.distance && userId != item.user.id ? ( */}
                            <View style={styles.locationContainer}>
                                <TouchableOpacity onPress={() => openMapUrl(item.user)} activeOpacity={0.8}>
                                    <FastImage source={require('../../../assets/icons/bottomtab/pin.png')} resizeMode="contain" style={styles.mapPin} tintColor={Colors.Black} />
                                </TouchableOpacity>

                                <Text style={styles.milesText} onPress={() => openMapUrl(item.user)} numberOfLines={1}>
                                    {item?.user?.distance}
                                </Text>
                            </View>
                            {/* ) : null} */}
                        </View>

                        {community || allPostShow ? (
                            <TouchableOpacity style={styles.verticalDots} onPress={onDotPress}>
                                <View style={styles.dot} />
                                <View style={styles.dot} />
                                <View style={styles.dot} />
                            </TouchableOpacity>
                        ) : null}
                        {!community && userId != item.u_id && (
                            <TouchableOpacity style={styles.sellerPressN} onPress={sellerLike}>
                                {userId != item.u_id && item?.user?.isFev == 1 ? <FastImage source={require('../../../assets/icons/screens/network_new.png')} style={styles.followSeller} resizeMode="contain" /> : <FastImage source={require('../../../assets/icons/screens/network_newS.png')} style={styles.followSeller} resizeMode="contain" />}
                            </TouchableOpacity>
                        )}
                    </View>
                ) : null}
                <View style={[styles.titleWithDots, {paddingTop: !profileShow ? hp('1') : hp('0')}]}>
                    <View style={styles.titleTimeConatiner} />

                    {editPost && userId != item.u_id && (
                        <TouchableOpacity style={styles.verticalDotC} onPress={editPostPress}>
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                        </TouchableOpacity>
                    )}
                </View>

                {!seller && (
                    <>
                        <Text style={styles.titleText}>
                            {item?.title}
                            {'  '}
                            <Text style={styles.timeText}>{moment(item.createdAt).fromNow()}</Text>
                        </Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={toggleNumberOfLines}>
                            {truncatedDesc && !textShown ? (
                                <Text style={styles.discriptionText}>
                                    {truncatedDesc}
                                    <Text style={styles.discriptionTextF}> {lastThree}</Text>
                                </Text>
                            ) : (
                                <Text onTextLayout={onTextLayout} ellipsizeMode="clip" style={styles.discriptionText}>
                                    {item?.description.trimEnd()}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}

                {/* {lengthMore && (
                    <Text onPress={toggleNumberOfLines} style={styles.textButton}>
                        {textShown ? 'See Less' : 'See More'}
                    </Text>
                )} */}

                {item?.images?.length > 0 && (
                    <>
                        <View style={seller ? styles.midImageWraperS : styles.midImageWraper}>
                            <Carousel ref={myCarousel} data={item?.images ? item?.images : []} renderItem={renderItem} sliderWidth={wp('100%')} itemWidth={wp('100%')} onSnapToItem={(index) => setIndex(index)} />
                        </View>
                        <Pagination dotsLength={item?.images?.length > 5 ? 5 : item?.images.length} activeDotIndex={_index} containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)', paddingTop: hp('1'), paddingBottom: hp('0'), width: wp('40%')}} dotStyle={styles._dotStyle} inactiveDotStyle={styles._inactiveDotStyle} inactiveDotOpacity={1} inactiveDotScale={0.6} />
                    </>
                )}

                <View style={styles.bottomRowWraper}>
                    {!community ? (
                        <>
                            {myProductView ? (
                                <View style={styles.viewProfileEmptyView}></View>
                            ) : (
                                <TouchableOpacity style={styles.viewProfile} onPress={navigateProfile}>
                                    <FastImage source={require('../../../assets/icons/screens/eye_open.png')} tintColor={Colors.Black} style={styles.starIcon} />
                                    <Text style={[styles.nameText]}>{' My products'}</Text>
                                </TouchableOpacity>
                            )}

                            <View style={[styles.bottomRightWraper]}>
                                <View style={styles.bottomContainer}>
                                    {/* <TouchableOpacity onPress={() => null}>
                                        <FastImage source={require('../../../assets/icons/screens/thumbsup.png')} tintColor={true != true ? Colors.MainThemeColor : Colors.LightGrayColor} style={styles.shieldIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={allLikesS}>
                                        <Text style={styles.bottomText}>{0}</Text>
                                    </TouchableOpacity> */}
                                </View>
                                <View style={styles.bottomContainer}>
                                    {/* <TouchableOpacity onPress={() => null}>
                                        <FastImage source={require('../../../assets/icons/screens/thumb_down.png')} tintColor={true != true ? Colors.MainThemeColor : Colors.LightGrayColor} style={styles.shieldIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => null}>
                                        <Text style={styles.bottomText}>{0}</Text>
                                    </TouchableOpacity> */}
                                </View>
                                <View style={styles.bottomContainer}>
                                    <TouchableOpacity onPress={() => ShareButton({link: `products/sellers/${item.user?.id ? item.user.id : item.id}`, fullname: userData.first_name + ' ' + userData.last_name})}>
                                        <FastImage source={require('../../../assets/icons/screens/share_feed.png')} tintColor={true != true ? Colors.MainThemeColor : Colors.LightGrayColor} style={styles.shieldIcon} />
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity>
                                        <Text style={styles.bottomText}>{0}</Text>
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                        </>
                    ) : (
                        <View style={styles.contShare}>
                            <View style={[styles.bottomLeftWraper, {justifyContent: 'flex-end'}]}>
                                <TouchableOpacity onPress={() => (item.isLiked == 1 ? postUnLikeCB() : postLikeCB())}>
                                    <FastImage source={item.isLiked == 1 ? require('../../../assets/icons/screens/likes.png') : require('../../../assets/icons/screens/like.png')} tintColor={item.isLiked == 1 ? Colors.MainThemeColor : Colors.LightGrayColor} style={styles.filledHeartIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={allLikesS}>
                                    <Text style={styles.bottomText}>{item?.total_likes_count ? item?.total_likes_count.toString().trimStart() : 0}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.bottomLeftWraper, {justifyContent: 'flex-end'}]}>
                                <TouchableOpacity onPress={chatS}>
                                    <FastImage source={require('../../../assets/icons/screens/comments.png')} tintColor={Colors.LightGrayColor} style={styles.iconsStyles} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={chatS}>
                                    <Text style={styles.bottomText}>{item?.total_comments_count ? item.total_comments_count : 0}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.bottomLeftWraper, {justifyContent: 'flex-end'}]}>
                                <TouchableOpacity onPress={() => ShareButton({link: `post/${item.id}`, fullname: userData.first_name + ' ' + userData.last_name})}>
                                    <FastImage source={require('../../../assets/icons/screens/share_feed.png')} tintColor={Colors.LightGrayColor} style={styles.iconsStyles} />
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => null} style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                                    <Text style={styles.bottomText} numberOfLines={1}>
                                        {item?.total ? item?.total : 0}
                                    </Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    )}
                    {/* {!community && (
                            <TouchableOpacity style={styles.viewProfile} onPress={navigateProfile}>
                                <FastImage source={require('../../../assets/icons/screens/visible.png')} tintColor={Colors.Black} style={styles.starIcon} />
                                <Text style={[styles.nameText]}>{' My products'}</Text>
                            </TouchableOpacity>
                        )} */}
                    {/* <View style={styles.bottomRightWraper}>
                        <>
                            <View style={styles.bottomRightWraperInner}>
                                {community && (
                                    <>
                                        <TouchableOpacity onPress={() => (item.isLiked == 1 ? postUnLikeCB() : postLikeCB())}>
                                            <FastImage source={item.isLiked == 1 ? require('../../../assets/icons/screens/likeF.png') : require('../../../assets/icons/screens/likeF.png')} tintColor={item.isLiked == 1 ? Colors.MainThemeColor : Colors.DarkPepper_80} style={styles.filledHeartIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={allLikesS}>
                                            <Text style={styles.bottomText}>{item?.total_likes_count ? item?.total_likes_count : 0}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>

                            <TouchableOpacity style={styles.bottomRightWraperInner} onPress={chatS}>
                                {community && (
                                    <>
                                        <FastImage source={require('../../../assets/icons/screens/cooments.png')} tintColor={true ? Colors.DarkPepper_80 : Colors.DarkPepper_80} style={styles.iconsStyles} />

                                        <Text style={styles.bottomText}>{item?.total_comments_count ? item.total_comments_count : 0}</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.bottomRightWraperInner} onPress={() => ShareButton({link: seller ? `products/sellers/${item.user?.id ? item.user.id : item.id}` : `post/${item.id}`})}>
                                <FastImage source={require('../../../assets/icons/screens/share.png')} tintColor={true ? Colors.DarkPepper_80 : Colors.DarkPepper_80} style={styles.iconsStyles} />
                            </TouchableOpacity>
                        </>
                    </View> */}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: wp('92%'),
        // borderRadius: wp('3'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BackgroundColor
        // shadowColor: Colors.Shadow_Color,
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
        // marginTop: hp('2')
    },
    viewProfile: {
        width: '50%',
        flexDirection: 'row',
        paddingHorizontal: wp('2'),
        paddingVertical: hp('1'),
        alignItems: 'center',
        borderColor: Colors.MainThemeColor
    },
    viewProfileEmptyView: {
        width: '50%',
        flexDirection: 'row',
        paddingHorizontal: wp('2'),
        paddingVertical: hp('1'),
        alignItems: 'center',
        borderColor: Colors.MainThemeColor
    },
    buyCard: {
        width: wp('12%'),
        height: wp('7%'),
        backgroundColor: Colors.OrangeColor,
        borderRadius: wp('1.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        top: hp('0.4%')
    },
    priceDoller: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_10,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    ratedTagSoldView: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: wp('36%')
    },
    containerView: {
        width: wp('36%'),
        marginTop: hp('2')
    },
    sellerChatView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileView: {
        justifyContent: 'center',
        marginTop: hp('2%'),
        alignItems: 'center'
    },
    indicator: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        zIndex: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleWithDots: {
        width: wp('88'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    card: {
        width: wp('92%'),
        // borderRadius: wp('2%'),
        backgroundColor: Colors.BackgroundColor,
        borderColor: Colors.LightCream_60,
        overflow: 'hidden',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: hp('1')
    },
    cardHeader: {
        width: wp('92%'),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    avatarContainer: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('7%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyView: {
        width: wp('100%'),
        height: hp('1'),
        backgroundColor: Colors.White
    },
    nameContainer: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('7%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: wp('.8%'),
        borderColor: Colors.LightCream_10,
        marginLeft: wp('1')
    },
    avatar: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('7%'),
        overflow: 'hidden'
    },
    mapPin: {
        width: wp('4%'),
        height: wp('4%')
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    nameFounderWrapper: {
        flexDirection: 'row',
        paddingLeft: wp('2%'),
        width: wp('72%'),
        justifyContent: 'space-between'
    },
    titleRelationWrapperSocial: {
        maxWidth: wp('74%'),
        width: wp('74%'),
        justifyContent: 'space-between',
        paddingLeft: wp('2')
    },
    titleRelationWrapperSocialS: {
        maxWidth: wp('70%'),
        width: wp('70%'),
        justifyContent: 'space-between',
        paddingLeft: wp('1')
    },
    titleRelationWrapper: {
        width: wp('34%'),
        maxWidth: wp('34%'),
        marginTop: hp('3%')
    },
    dotWrapperSocial: {
        alignItems: 'center',
        width: wp('18'),
        maxWidth: wp('18%'),
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    dotWrapper: {
        width: wp('38'),
        maxWidth: wp('38%'),
        justifyContent: 'flex-end',
        flexDirection: 'row',
        backgroundColor: Colors.White
    },
    arrowCircle: {
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BorderGrey
    },
    dot: {
        marginTop: hp(0.3),
        width: wp('1.5%'),
        height: wp('1.5%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.LightGrayColor
    },
    _dotStyle: {
        width: wp('2%'),
        height: wp('2%'),
        marginHorizontal: wp('0%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.HTextColor
    },
    _inactiveDotStyle: {
        width: wp('3%'),
        height: wp('3%'),
        borderRadius: wp('2%'),
        marginHorizontal: wp('0%'),
        backgroundColor: Colors.LightGrayColor
    },
    nameText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    addressText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    timeTitleStyle: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_7,
        fontFamily: Typography.FONT_FAMILY_Italic,
        left: wp('2%')
    },
    titleTimeConatiner: {
        flexDirection: 'row',
        alignItems: 'baseline',
        maxWidth: wp('84%'),
        width: wp('86')
    },
    nameTextImage: {
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_BOLD,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        textAlign: 'center'
    },

    milesText: {
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginLeft: wp('.5%')
    },
    timeText: {
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_11,
        fontFamily: Typography.FONT_FAMILY_REGULAR,

        width: wp('88%'),
        maxWidth: wp('88%')
    },
    shieldIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    starIcon: {
        width: wp('4%'),
        height: wp('4%')
    },
    iconsStyles: {
        width: wp('6%'),
        height: wp('6%')
    },
    followSeller: {
        width: wp('6%'),
        height: wp('6%')
    },
    followSellerN: {
        width: wp('9%'),
        height: wp('9%')
    },
    sellerPress: {
        position: 'absolute',
        left: wp('9%'),
        bottom: hp('1.5%')
    },
    sellerPressN: {
        // bottom: hp('2%'),
        // right: wp('5%')
    },
    filledHeartIcon: {
        width: wp('6%'),
        height: wp('6%')
    },
    iconsStylesWithMargin: {
        width: wp('6%'),
        height: wp('6%')
    },
    titleText: {
        width: wp('88%'),
        maxWidth: wp('88%'),
        color: Colors.Black,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        marginTop: hp('1%')
    },
    discriptionText: {
        marginTop: hp('1'),
        width: wp('88%'),
        maxWidth: wp('88%'),
        color: Colors.Black,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    discriptionTextF: {
        marginTop: hp('1'),
        width: wp('88%'),
        maxWidth: wp('88%'),
        color: Colors.TextGray,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    textButton: {
        width: wp('20%'),
        alignSelf: 'flex-end',
        textAlign: 'center',
        alignItems: 'flex-end',
        color: Colors.TextGray,
        fontSize: Typography.FONT_SIZE_13
    },
    bottomRowWraper: {
        height: hp('6%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: wp('92')
    },
    bottomLeftWraper: {
        minWidth: wp('18%'),

        flexDirection: 'row',
        alignItems: 'center'
    },
    contShare: {
        width: wp('92%'),
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    bottomText: {
        paddingLeft: wp('1'),
        color: Colors.LightGrayColor,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bottomRightWraper: {
        width: '40%',
        maxWidth: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    soldText: {
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    sellerText: {
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    titleSocial: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },

    bottomRightWraperInner: {
        width: wp('15%'),
        flexDirection: 'row',
        alignItems: 'center'
    },

    midImageWraper: {
        width: wp('100%'),
        height: Platform.OS == 'android' ? hp('32') : hp('25'),
        marginTop: hp('1'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    midImageWraperS: {
        width: wp('100%'),
        height: Platform.OS == 'android' ? hp('32') : hp('20'),
        marginTop: hp('1'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    updatebutton: {
        height: hp('7%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    arrowConatiner: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1
    },
    arrowLeftC: {
        width: wp('38%'),
        alignItems: 'flex-start'
    },
    arrowLeftR: {
        width: wp('38%'),
        alignItems: 'flex-end'
    },
    sellerChat: {
        marginLeft: wp('2%')
    },
    chatIcon: {
        width: wp('4.5%'),
        height: wp('4.5%')
    },
    verticalDots: {
        alignItems: 'center',
        justifyContent: 'center'
        // width: wp('6%')
    },
    verticalDotC: {
        alignItems: 'center',
        justifyContent: 'center',
        right: wp('1%'),
        width: wp('6%')
    }
})

export default FeedCard
