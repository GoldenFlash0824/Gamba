import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import UsersListItem from '../../../components/components/common/UsersListItem'

import FastImage from 'react-native-fast-image'
import React, {useState} from 'react'
import {StyleSheet, Text, View, FlatList} from 'react-native'

import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

const PaypalPaymentScreen = ({navigation}) => {
    return (
        <View style={styles.body}>
            <Header back={true} backCB={() => navigation.goBack()} title={'Paypal'} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        flex: 1,
        backgroundColor: Colors.White
    }
})

export default PaypalPaymentScreen
