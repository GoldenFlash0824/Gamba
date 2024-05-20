import React, {useRef, useState} from 'react'
import {ScrollView, StyleSheet, View, Linking, FlatList, Text, TouchableOpacity, TextInput} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import ActiveButton from '../../../components/components/common/ActiveButton'

const OrderSuccessfullScreen = ({navigation}) => {
    return (
        <View style={styles.body}>
            <Header
                back={true}
                backCB={() => {
                    navigation.goBack()
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('100%')
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('5%'),
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
        paddingVertical: hp('1%')
    }
})

export default OrderSuccessfullScreen
