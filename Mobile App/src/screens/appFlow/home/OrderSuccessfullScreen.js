import React, {useRef, useState} from 'react'
import {ScrollView, StyleSheet, View, Linking, FlatList, Text, TouchableOpacity, TextInput} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import ActiveButton from '../../../components/components/common/ActiveButton'

const OrderSuccessfullScreen = (props) => {
    const doBack = () => {
        props.navigation.navigate('HomeScreen')
    }
    return (
        <View style={styles.body}>
            <View style={styles.orderContainer}>
                <FastImage source={require('../../../assets/icons/screens/successs.png')} resizeMode="contain" style={styles.cartIcon} />
                <View style={styles.backgroundContainer}>
                    <Text style={styles.titleSuccess}>{'Order Successfull!'}</Text>
                    <Text style={styles.textThankU}>{'We will start work on time Thank You!'}</Text>
                    <View style={styles.buttonContainer}>
                        <ActiveButton title="View Order" style={styles.buttonView} onPress={() => doBack()} />
                        <ActiveButton title="Continue Orders" style={styles.buttonViewOrders} textStyle={styles.buttonTitle} />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('100%')
    },
    orderContainer: {
        alignItems: 'center'
    },
    cartIcon: {
        width: wp('60%'),
        height: wp('60%'),
        marginTop: hp('10%')
    },
    titleSuccess: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    buttonContainer: {
        marginTop: '5%'
    },
    buttonView: {
        width: wp('80%')
    },
    buttonTitle: {
        color: Colors.Yellow
    },
    buttonViewOrders: {
        width: wp('80%'),
        backgroundColor: Colors.LightYellow,
        marginTop: '4%',
        shadowColor: Colors.LightYellow
    },
    textThankU: {
        width: Platform.OS == 'ios' ? wp('56%') : wp('48%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textAlign: 'center',
        marginTop: hp('1%')
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        borderRadius: wp('2%'),
        shadowColor: Colors.Shadow_Color,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 5,
        paddingVertical: hp('2%')
    }
})

export default OrderSuccessfullScreen
