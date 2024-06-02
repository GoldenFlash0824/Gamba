import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'
import FastImage from 'react-native-fast-image'
import {useSelector} from 'react-redux'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {IMAGES_BASE_URL} from '../../../services'

const EventSheetProfile = ({itemEvent, setRef, height, onJoinX, onCloseCB, title, chatCB, profileNavigationCB}) => {
    const {userData} = useSelector((state) => state.user)
    return (
        <RBSheet
            animationType={'slide'}
            ref={setRef}
            closeOnPressMask={true}
            closeDuration={100}
            openDuration={100}
            height={height}
            customStyles={{
                container: {
                    backgroundColor: Colors.White
                }
            }}>
            <View style={styles.body}>
                <View style={styles.backgroundContainer}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onJoinX}>
                            <FastImage source={require('../../../assets/icons/screens/close.png')} resizeMode="contain" style={styles.crossIcon} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                        {itemEvent && itemEvent.length > 0 ? (
                            <>
                                {itemEvent.map((like, index) => (
                                    <View style={styles.profileContainer} key={index}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => profileNavigationCB(like.like_user)} style={[styles.avatarContainer]}>
                                            <FastImage source={{uri: like?.like_user?.image ? IMAGES_BASE_URL + like?.like_user.image : IMAGES_BASE_URL + like?.like_user.first_name.charAt(0).toLowerCase() + '.png'}} resizeMode="cover" style={styles.avatar} />
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => profileNavigationCB(like.like_user)} style={styles.nameConatiner}>
                                            <Text style={styles.nameText} numberOfLines={1}>
                                                {like?.like_user.first_name + ' ' + like?.like_user.last_name}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity activeOpacity={0.8} style={userData.id != like?.like_user.id ? styles.btnContainer : styles.btnContainerH} onPress={() => chatCB(like.like_user)}>
                                            {userData.id != like?.like_user.id && (
                                                <Text style={styles.chatBtn} numberOfLines={1}>
                                                    {'Chat'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </>
                        ) : (
                            <>
                                {itemEvent?.joinEvent?.map((join, index) => (
                                    <View style={styles.profileContainer} key={index}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => profileNavigationCB(join?.joinEventUser)} style={[styles.avatarContainer]}>
                                            <FastImage source={{uri: join?.joinEventUser?.image ? IMAGES_BASE_URL + join?.joinEventUser?.image : IMAGES_BASE_URL + join?.joinEventUser?.first_name.charAt(0).toLowerCase() + '.png'}} resizeMode="cover" style={styles.avatar} />
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => profileNavigationCB(join?.joinEventUser)} style={styles.nameConatiner}>
                                            <Text style={styles.nameText} numberOfLines={1}>
                                                {join?.joinEventUser?.first_name ? join?.joinEventUser?.first_name + ' ' + join?.joinEventUser?.last_name : 'John'}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity activeOpacity={0.8} style={userData.id != join?.joinEventUser.id ? styles.btnContainer : styles.btnContainerH} onPress={() => chatCB(join?.joinEventUser)}>
                                            {userData.id != join?.joinEventUser.id && (
                                                <Text style={styles.chatBtn} numberOfLines={1}>
                                                    {'Chat'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.White
    },
    profileContainer: {
        width: wp('92%'),
        height: hp('9%'),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        borderRadius: wp('3%'),
        marginTop: hp('1%')
    },
    headingContainer: {
        width: wp('88%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: wp('2%')
    },
    btnContainer: {
        width: wp('15%'),
        height: wp('8%'),
        borderRadius: hp('8%'),
        backgroundColor: Colors.MainThemeColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('2%')
    },
    btnContainerH: {
        width: wp('15%'),
        height: wp('8%'),
        borderRadius: hp('8%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarContainer: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('8%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: wp('1')
    },
    nameConatiner: {
        width: wp('58%'),
        height: wp('14%'),
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    scrollBody: {
        paddingBottom: hp('2'),
        alignItems: 'center'
    },
    nameText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    chatBtn: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    avatar: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('7%'),
        overflow: 'hidden',
        borderColor: Colors.LightCream_10
    },
    nameTextImage: {
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_BOLD,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        textAlign: 'center'
    },
    nameContainer: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: hp('7%'),
        alignItems: 'center',
        justifyContent: 'center',

        borderColor: Colors.LightCream_10,
        marginLeft: wp('1')
    },
    title: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_BOLD
    },

    crossIcon: {
        width: wp('6%'),
        height: hp('6%')
    },

    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        paddingVertical: hp('1%'),
        marginTop: Platform.OS == 'android' ? hp('2') : hp('7')
    }
})

export default EventSheetProfile
