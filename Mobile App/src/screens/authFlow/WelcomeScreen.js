import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import * as Colors from '../../constants/colors'
import * as Typography from '../../constants/typography'
// import Loader from '../../components/common/Spinner'
import Loader from '../../components/components/common/Spinner'

import ActiveButton from '../../components/components/common/ActiveButton'

const WelocomeScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false)

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <View style={styles.topWrapper}>
                <View style={styles.outerLine}>
                    <View style={styles.leftTopWrapper}>
                        <FastImage source={require('../../assets/icons/screens/profile_image.jpeg')} style={styles.avatat} />
                    </View>
                    <View style={styles.midTopWrapper}>
                        <FastImage source={require('../../assets/icons/screens/pin.png')} style={styles.avatat} tintColor={Colors.IconsColor} />
                    </View>
                    <View style={styles.rightTopWrapper}>
                        <FastImage source={require('../../assets/icons/screens/profile_image.jpeg')} style={styles.avatat} />
                    </View>
                    <View style={styles.outerCircle}>
                        <View style={styles.innerRightTopWrapper}>
                            <FastImage source={require('../../assets/icons/screens/profile_image.jpeg')} style={styles.avatat} />
                        </View>
                        <View style={styles.innerLeftWrapper}>
                            <FastImage source={require('../../assets/icons/screens/phone_call.png')} style={styles.avatat} tintColor={Colors.IconsColor} />
                        </View>
                        <View style={styles.innerLeftBottomWrapper}>
                            <FastImage source={require('../../assets/icons/screens/profile_image.jpeg')} style={styles.avatat} />
                        </View>
                        <View style={styles.midCircle}>
                            <View style={styles.avatarWrapper}>
                                <FastImage source={require('../../assets/icons/screens/profile_image.jpeg')} style={styles.avatat} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.leftBottomWrapper}>
                        <FastImage source={require('../../assets/icons/screens/profile_image.jpeg')} style={styles.avatat} />
                    </View>
                    <View style={styles.midBottompWrapper}>
                        <FastImage source={require('../../assets/icons/screens/chat.png')} style={styles.avatat} tintColor={Colors.IconsColor} resizeMode={'contain'} />
                    </View>
                    <View style={styles.rightBottomWrapper}>
                        <FastImage source={require('../../assets/icons/screens/profile_image.jpeg')} style={styles.avatat} />
                    </View>
                </View>
                <View style={styles.headingWrapper}>
                    <Text style={styles.haedingText}>{`It's easy to find a soul mate nearby & around you`}</Text>
                </View>
                <View style={styles.sliderDotsWrapper}>
                    <View style={styles.activeDot} />
                    <View style={styles.midDot} />
                    <View style={styles.disableDot} />
                </View>
            </View>
            <ActiveButton
                title={'Next'}
                onPress={() => {
                    navigation.navigate('loginScreen')
                }}
                style={styles.button}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: Colors.White,
        width: wp('100%'),
        alignItems: 'center'
    },
    topWrapper: {
        flex: 1,
        backgroundColor: Colors.White,
        width: wp('100%'),
        alignItems: 'center'
    },
    outerLine: {
        width: wp('90%'),
        height: wp('90%'),
        borderRadius: wp('45%'),
        borderStyle: 'dashed',
        borderWidth: wp('1'),
        borderColor: Colors.LightestPurple,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('2')
    },
    outerCircle: {
        width: wp('60%'),
        height: wp('60%'),
        borderRadius: wp('30%'),
        backgroundColor: Colors.LightestPurple_S,
        alignItems: 'center',
        justifyContent: 'center'
    },
    midCircle: {
        width: wp('40%'),
        height: wp('40%'),
        borderRadius: wp('20%'),
        backgroundColor: Colors.LightestPurple,
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftTopWrapper: {
        position: 'absolute',
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: wp('8'),
        overflow: 'hidden',
        borderWidth: wp('.8'),
        borderColor: Colors.LimeText,
        zIndex: 1,
        left: wp('0'),
        top: hp('2')
    },
    midTopWrapper: {
        position: 'absolute',
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4'),
        zIndex: 1,
        top: hp('-2')
    },
    innerLeftWrapper: {
        position: 'absolute',
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4'),
        zIndex: 1,
        left: wp('-3')
    },
    innerRightTopWrapper: {
        position: 'absolute',
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: wp('7'),
        overflow: 'hidden',
        borderWidth: wp('.3'),
        borderColor: Colors.LimeText,
        zIndex: 1,
        right: wp('5'),
        top: hp('0')
    },
    innerLeftBottomWrapper: {
        position: 'absolute',
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: wp('7'),
        overflow: 'hidden',
        borderWidth: wp('.3'),
        borderColor: Colors.LimeText,
        zIndex: 1,
        left: wp('8'),
        bottom: hp('-2')
    },
    rightTopWrapper: {
        position: 'absolute',
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: wp('8'),
        overflow: 'hidden',
        borderWidth: wp('.5'),
        borderColor: Colors.LimeText,
        zIndex: 1,
        right: wp('0'),
        top: hp('2')
    },
    leftBottomWrapper: {
        position: 'absolute',
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: wp('8'),
        overflow: 'hidden',
        borderWidth: wp('.5'),
        borderColor: Colors.LimeText,
        zIndex: 1,
        left: wp('0'),
        bottom: hp('5')
    },
    midBottompWrapper: {
        position: 'absolute',
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4'),
        zIndex: 1,
        bottom: hp('-2')
    },
    rightBottomWrapper: {
        position: 'absolute',
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: wp('8'),
        overflow: 'hidden',
        borderWidth: wp('.8'),
        borderColor: Colors.LimeText,
        zIndex: 1,
        right: wp('0'),
        bottom: hp('3')
    },
    avatarWrapper: {
        width: wp('22%'),
        height: wp('22%'),
        borderRadius: wp('11'),
        overflow: 'hidden',
        borderWidth: wp('.8'),
        borderColor: Colors.LimeText
    },
    avatat: {
        width: '100%',
        height: '100%'
    },
    headingWrapper: {
        marginTop: hp('3'),
        alignSelf: 'center',
        width: wp('92%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    haedingText: {
        textAlign: 'center',
        color: Colors.HeadingTextColor,
        fontSize: Typography.FONT_SIZE_32,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    sliderDotsWrapper: {
        marginTop: hp('3'),
        flexDirection: 'row',
        width: wp('100%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeDot: {
        width: wp('8%'),
        height: hp('1'),
        borderRadius: wp('1'),
        backgroundColor: Colors.SliderDotActive
    },
    midDot: {
        width: wp('2%'),
        height: wp('2'),
        borderRadius: wp('1.5'),
        backgroundColor: Colors.SliderDotInActive,
        marginHorizontal: wp('1')
    },
    disableDot: {
        width: wp('2%'),
        height: wp('2'),
        borderRadius: wp('1.5'),
        backgroundColor: Colors.SliderDotInActive
    },
    button: {
        bottom: hp('2')
    }
})

export default WelocomeScreen
