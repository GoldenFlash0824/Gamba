import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useNavigation} from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import {useSelector} from 'react-redux'

import * as Colors from '../../../constants/colors'
import {IMAGES_BASE_URL} from '../../../services/constants'

const MainHeader = ({back = false, style, leftDrawerCB, rightDrawerCB, chatCB, notificationCB, messagecountCount = '0'}) => {
    const {userData, notiCount} = useSelector((state) => state.user)
    const {navigate} = useNavigation()
    return (
        <View style={{...styles.wrapper, ...style}}>
            <View style={styles.leftContainer}>
                {back && (
                    <TouchableOpacity onPress={leftDrawerCB} style={styles.goBack} activeOpacity={0.8}>
                        <FastImage resizeMode="contain" style={styles.back} tintColor={Colors.Black} source={require('../../../assets/icons/screens/menu_drawer.png')} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => navigate('HomeStack')} activeOpacity={0.8}>
                    <FastImage source={require('../../../assets/icons/screens/gamba_logo.png')} resizeMode="contain" style={styles.logoIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.midContainer}></View>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={rightDrawerCB} style={styles.profileImagesC} activeOpacity={0.8}>
                    <FastImage resizeMode="cover" style={styles.profileImages} source={{uri: userData?.image ? IMAGES_BASE_URL + userData.image : IMAGES_BASE_URL + userData?.first_name[0]?.toLowerCase() + '.png'}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => notificationCB()} activeOpacity={0.8} style={{marginRight: wp('2')}}>
                    <FastImage resizeMode="cover" style={styles.back} source={notiCount > '0' ? require('../../../assets/icons/screens/notificationCount.png') : require('../../../assets/icons/screens/notificationB.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={chatCB} activeOpacity={0.8}>
                    <FastImage resizeMode="cover" style={styles.back} source={messagecountCount > '0' ? require('../../../assets/icons/screens/messageCount.png') : require('../../../assets/icons/screens/messageB.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: wp('100%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.White,
        paddingHorizontal: wp('2')
    },
    back: {
        width: wp('7%'),
        height: wp('7%')
    },

    goBack: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftContainer: {
        width: wp('32%'),
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    rightContainer: {
        width: wp('32%'),
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoIcon: {
        width: wp('40%'),
        height: hp('6%')
    },
    messagesCounterWrapper: {
        position: 'absolute',
        alignSelf: 'flex-end',
        minWidth: wp('3%'),
        minHeight: wp('3%'),
        borderRadius: wp('1.5%'),
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: hp('2.5%')
    },

    midContainer: {
        width: wp('32%'),
        alignItems: 'center',
        justifyContent: 'center'
    },

    profileImagesC: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        marginRight: wp('2')
    },
    profileImages: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%')
    }
})

export default MainHeader
