import React, {useEffect, useState} from 'react'
import {Platform, StyleSheet, View, TouchableOpacity} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import FastImage from 'react-native-fast-image'
import TabViews from '../../../components/components/common/TabViews'
import ProductDetailTrade from '../../../components/components/common/ProductDetailTrade'
import TradeDetailInfo from '../../../components/components/common/TradeDetailInfo'

const renderScene = {tradeInfo: TradeDetailInfo, productsDetail: ProductDetailTrade}

const TradeDetailInfoScreen = (props) => {
    const [index, setIndex] = useState(0)
    const [tradeData, setTradeData] = useState('')

    const routes = [
        {key: 'productsDetail', title: 'Product Details ', ind: index, tradeData},
        {key: 'tradeInfo', title: props.itemCB?.is_donation ? 'Contact Donator' : 'Contact Trader', ind: index}
    ]
    useEffect(() => {
        setTradeData(props.itemCB)
    }, [])

    return (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity activeOpacity={0.8} onPress={props.onCloseCB} style={styles.leftContainer}>
                    <FastImage source={require('../../../assets/icons/screens/left.png')} style={styles.backIcon} tintColor={Colors.Black} />
                </TouchableOpacity>
            </View>
            <TabViews renderSceneCB={renderScene} routesCB={routes} indexCB={(ind) => setIndex(ind)} style={styles.labelStyleSmall} />
        </>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('100%'),
        alignItems: 'center'
    },
    headerContainer: {
        marginTop: Platform.OS == 'android' ? hp('0') : hp('6'),
        width: wp('96'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center'
    },
    backIcon: {
        width: wp('6%'),
        height: wp('6%')
    },
    leftContainer: {
        width: wp('32')
    },
    labelStyleSmall: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textTransform: 'capitalize'
    }
})

export default TradeDetailInfoScreen
