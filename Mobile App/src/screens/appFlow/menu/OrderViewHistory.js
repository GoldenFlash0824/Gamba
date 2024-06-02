import React, {useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import Header from '../../../components/components/common/Header'
import OrderProductsCard from '../../../components/components/common/OrderProductsCard'
import ToggelButton from '../../../components/components/common/ToggleButton'

/// code by Riaz
const OrderViewHistory = ({img, text, navigation}) => {
    return (
        <View style={styles.body}>
            <Header
                back={true}
                backCB={() => {
                    navigation.goBack()
                }}
            />
            <View style={styles.orderNumber}>
                <Text style={styles.orderText}>Order No</Text>
                <Text style={styles.orderId}>#IdEEFF0000</Text>
                <Text style={styles.orderId}>03-02-2023</Text>

                <View style={styles.deliverd}>
                    <Text style={styles.deliverdTo}>Delivered To</Text>
                    <Text style={styles.orderId}>XYZ,DownTown street 123</Text>
                </View>
            </View>

            <View style={styles.products}>
                <View style={styles.productsName}>
                    <OrderProductsCard />
                </View>
            </View>
            <View style={{marginTop: '14%'}}>
                <View style={styles.totalOrder}>
                    <Text style={styles.orderId}>Subtotal</Text>
                    <Text style={styles.orderId}>£6.30</Text>
                </View>
                <View style={styles.totalOrder}>
                    <Text style={styles.orderId}>Delivery fee</Text>
                    <Text style={styles.orderId}>£6.30</Text>
                </View>
                <View style={styles.totalOrder}>
                    <Text style={styles.orderId}>Service fee</Text>
                    <Text style={styles.orderId}>£6.30</Text>
                </View>
                <View style={styles.totalOrder}>
                    <Text style={styles.totalAmount}>Total Paid</Text>
                    <Text style={styles.totalAmount}>£11.98</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.White
    },
    orderNumber: {
        width: wp('92%'),
        height: hp('16%'),
        alignSelf: 'center'
    },
    orderText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_17,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    orderId: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    deliverd: {
        width: wp('92%'),
        height: hp('9%'),
        justifyContent: 'center'
    },
    deliverdTo: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    products: {
        width: wp('100%'),
        height: hp('35%'),
        alignItems: 'center'
    },
    productsText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginTop: hp('2%')
    },
    productsName: {
        width: wp('92%'),
        borderBottomColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    vegetableName: {
        width: wp('12%'),
        height: hp('6%')
    },
    totalOrder: {
        width: wp('92%'),
        height: hp('3%'),
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalAmount: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default OrderViewHistory
