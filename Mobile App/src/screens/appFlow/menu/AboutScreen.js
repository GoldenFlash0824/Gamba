import React, {useState} from 'react'
import {StyleSheet, Text, View, FlatList, ScrollView, Dimensions, Platform} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import Pdf from 'react-native-pdf'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'

const AboutScreen = ({navigation}) => {
    return (
        <View style={styles.body}>
            <Header back={true} backCB={() => navigation.goBack()} titlleLeft={'About'} />
            <View style={styles.container}>
                <Pdf
                    trustAllCerts={false}
                    source={Platform.OS === 'ios' ? require('../../../assets/Gamba_Final.pdf') : {uri: 'bundle-assets://GambaFinal.pdf'}}
                    onError={(error) => {
                        console.log(error)
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`)
                    }}
                    style={styles.pdf}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center'
    },
    scrollBody: {
        paddingBottom: hp('5'),
        alignItems: 'center'
    },
    viewCotainer: {
        width: wp('92%'),
        alignItems: 'center'
    },
    detailAbout: {
        color: Colors.DarkGrey,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    imageIon: {
        width: wp('92%'),
        height: hp('65%'),
        borderRadius: wp(2),
        marginTop: hp('2%')
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.White,
        alignItems: 'center'
        // marginTop: 25
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
})

export default AboutScreen
