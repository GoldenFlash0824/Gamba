import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, View, ImageBackground, SafeAreaView, Text} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import FastImage from 'react-native-fast-image'
import * as Progress from 'react-native-progress'

import * as Colors from '../../constants/colors'
import * as Typography from '../../constants/typography'

const SplashScreen = () => {
    let [progress, setProgress] = useState(0.1)
    const timerRef = useRef(null)

    useEffect(() => {
        let _progress = 0
        timerRef.current = setInterval(async () => {
            _progress = _progress + 0.3
            setProgress(_progress)
        }, 500)
        return () => {
            clearInterval(timerRef.current)
        }
    }, [])

    return (
        <View style={styles.body}>
            <ImageBackground source={require('../../assets/images/splash.png')} style={styles.bgImage} />
            <View style={styles.logcontainer}>
                <FastImage source={require('../../assets/icons/screens/gamba_logo.png')} style={styles.logo} resizeMode="contain" />
                <Progress.Bar progress={progress} width={wp(55)} color={Colors.MainThemeColor} animated={true} unfilledColor={Colors.White} borderWidth={0} animationType="spring" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.textStyle}>Gamba © 2023 All right reserved.</Text>
                <Text style={styles.textStyle}>Version 2.0</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        flex: 1,
        height: hp('100%'),
        backgroundColor: Colors.White
    },
    bgImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        opacity: 0.2
    },
    logcontainer: {
        alignItems: 'center',
        position: 'absolute',
        top: '45%',
        alignSelf: 'center'
    },
    logo: {
        width: wp('40'),
        height: wp('15'),
        marginBottom: hp(0.5)
    },
    textContainer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: '5%',
        alignSelf: 'center'
    },
    textStyle: {
        textAlign: 'center',
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_12
    }
})

export default SplashScreen
