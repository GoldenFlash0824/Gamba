import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import FastImage from 'react-native-fast-image'

const OrderProductsCard = ({img, text}) => {
    const DATA = [
        {
            id: '1',
            image: require('../../../assets/icons/screens/brocoli.jpg'),
            title: ' Germen brocoli'
        },
        {
            id: '2',
            image: require('../../../assets/icons/screens/potato.jpeg'),
            title: ' Germen potato'
        },
        {
            id: '3',
            image: require('../../../assets/icons/screens/cucumber.jpeg'),
            title: ' Germen cucumber'
        },
        {
            id: '4',
            image: require('../../../assets/icons/screens/cucumber.jpeg'),
            title: ' Germen cucumber'
        }
    ]

    const renderItem = ({item}) => {
        return (
            <View>
                <TouchableOpacity style={styles.productsPrice}>
                    <FastImage source={item.image} resizeMode="cover" style={styles.imageName} />
                    <View style={styles.vegetables}>
                        <Text style={styles.deliverdTo} numberOfLines={2}>
                            {item.title}
                        </Text>
                    </View>

                    <Text style={styles.order}>2x</Text>
                    <Text style={styles.order}>£0.00</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.body}>
            <View style={styles.flatList}>
                <FlatList data={DATA} renderItem={({item}) => renderItem({item})} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: hp('26')}} />
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
    vegetables: {
        width: wp('45%'),
        height: hp('6%'),
        alignSelf: 'center',
        justifyContent: 'center'
    },
    flatList: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        height: hp('40%')
    },

    order: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    deliverdTo: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },

    productsPrice: {
        width: wp('92%'),
        height: hp('10%'),
        borderBottomColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    imageName: {
        width: wp('14%'),
        height: hp('6%'),
        borderRadius: wp('3%')
    }
})

export default OrderProductsCard
