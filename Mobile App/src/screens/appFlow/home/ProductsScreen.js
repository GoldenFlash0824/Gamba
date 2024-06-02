import React, {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import ToggleSwitch from 'toggle-switch-react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import MainHeader from '../../../components/components/common/MainHeader'
import TabViews from '../../../components/components/common/TabViews'
import AllProducts from '../../../components/components/common/AllProducts'
import TradeData from '../../../components/components/common/TradeData'
import DonationData from '../../../components/components/common/DonationData'
import SaleData from '../../../components/components/common/SaleData'
import SellerData from '../../../components/components/common/SellerData'
import {separatorHeightH} from '../../../utils/helpers'

import InputWithLabels from '../../../components/components/common/InputWithLabels'
const renderScene = {products: AllProducts, trade: TradeData, donation: DonationData, sale: SaleData, sellers: SellerData}

const ProductsScreen = ({navigation}) => {
    const [serachBar, setserachBar] = useState('')
    const [focusSearch, setFocusSearch] = useState(false)
    const [organic, setOrganic] = useState(false)
    const [tradeBy, setTradeBy] = useState('')
    const [focusTradeBy, setFocusTradeBy] = useState(false)
    const [tradeWithSearch, setTradeWithSearch] = useState('')
    const [focustradeWithSearch, setFocusTradeWithSearch] = useState(false)
    const [index, setIndex] = useState(0)

    const routes = [
        {key: 'products', title: 'Products', ind: index, id: 0, organic: organic, searching: serachBar},
        {key: 'sellers', title: 'Sellers', ind: index, id: 1, organic: organic, searching: serachBar},
        {key: 'trade', title: 'Trade', ind: index, id: 2, organic: organic, tradeBy: tradeBy, tradeWithSearch: tradeWithSearch},
        {key: 'donation', title: 'Giveaway', ind: index, id: 3, organic: organic, searching: serachBar},
        {key: 'sale', title: 'Sale', ind: index, id: 4, organic: organic, searching: serachBar}
    ]

    const chatHandler = () => {
        navigation.navigate('ChatScreen')
    }

    const leftDrawerHandler = () => {
        navigation.getParent('LeftDrawer').openDrawer()
    }
    const rightDrawerHandler = () => {
        navigation.getParent('RightDrawer').openDrawer()
    }
    const notificationHandler = () => {
        navigation.navigate('NotificationScreen')
    }

    const handleToggle = async (status) => {
        setOrganic(status)
        index != 1 ? (setserachBar(''), setFocusSearch(false)) : (setTradeBy(''), setFocusTradeBy(false), setTradeWithSearch(''), setFocusTradeWithSearch(false))
    }
    const onChangeSearchBar = async (text) => {
        text = text.toLowerCase()
        setserachBar(text)
    }
    const onSubmitProducts = async () => setFocusSearch(false)

    const onChangeTradeBy = async (text) => {
        text = text.toLowerCase()
        setTradeBy(text)
    }

    const onChangeTradeWith = async (text) => {
        text = text.toLowerCase()
        setTradeWithSearch(text)
    }
    const setIndexHandler = (ind) => {
        setIndex(ind)
        setOrganic(false)
        setserachBar('')
        setFocusSearch(false)
        setTradeBy('')
        setFocusTradeBy(false)
        setTradeWithSearch('')
        setFocusTradeWithSearch(false)
    }
    return (
        <>
            <MainHeader back={true} rightDrawerCB={rightDrawerHandler} leftDrawerCB={leftDrawerHandler} right={true} noti={true} notificationCB={notificationHandler} chatCB={chatHandler} />
            {/* <Header back={false} homeChat={true} changCard={true} changeCart={(val) => cardCahngeHandler(val)} right={true} noti={true} chatCB={chatHandler} cartCB={cartHandler} notificationCB={cartNsHandler} product={true} /> */}
            {index !== 2 ? (
                <View style={styles.topContainer}>
                    {separatorHeightH()}
                    <View style={styles.searchToglleRowView}>
                        <InputWithLabels
                            showLabelCB={false}
                            value={serachBar}
                            inputStyles={{width: index == 1 ? wp('86') : wp('65%'), paddingRight: wp(4), backgroundColor: Colors.BorderGrey}}
                            style={{width: index == 1 ? wp('92') : wp('70%'), backgroundColor: Colors.BorderGrey}}
                            autoCapitalize={'none'}
                            placeholder={index == 1 ? 'Search Sellers' : 'Search Products'}
                            isError={false}
                            isFocus={focusSearch}
                            onBlur={onSubmitProducts}
                            onFocus={() => setFocusSearch(true)}
                            icon={true}
                            onChangeText={(text) => {
                                onChangeSearchBar(text)
                            }}
                            clearIcon={true}
                            showPlaceHolder={true}
                            leftIcon={false}
                        />
                        {index != 1 && <ToggleSwitch isOn={organic} label={'Organic'} labelStyle={styles.labelContainer} onColor={Colors.MainThemeColor} offColor={Colors.GrayLight} size="small" onToggle={handleToggle} thumbOffStyle={{backgroundColor: Colors.OrangeColor}} style={styles.toggleStyleView} />}
                    </View>
                </View>
            ) : (
                <View style={styles.topContainer}>
                    {separatorHeightH()}
                    <View style={styles.tradeInpute}>
                        <InputWithLabels
                            style={styles.tradeTextInput}
                            showLabelCB={false}
                            value={tradeBy}
                            autoCapitalize={'none'}
                            placeholder="Trade By"
                            isError={false}
                            isFocus={focusTradeBy}
                            onBlur={() => setFocusTradeBy(false)}
                            onFocus={() => setFocusTradeBy(true)}
                            onChangeText={(text) => {
                                onChangeTradeBy(text)
                            }}
                            showPlaceHolder={true}
                        />
                        <InputWithLabels
                            style={styles.tradeTextInput}
                            showLabelCB={false}
                            value={tradeWithSearch}
                            autoCapitalize={'none'}
                            placeholder="Trade With"
                            isError={false}
                            isFocus={focustradeWithSearch}
                            onBlur={() => setFocusTradeWithSearch(false)}
                            onFocus={() => setFocusTradeWithSearch(true)}
                            onChangeText={(text) => {
                                onChangeTradeWith(text)
                            }}
                            showPlaceHolder={true}
                        />
                        <ToggleSwitch isOn={organic} label={'Organic'} labelStyle={styles.labelContainerTr} onColor={Colors.MainThemeColor} offColor={Colors.GrayLight} size="small" onToggle={handleToggle} thumbOffStyle={{backgroundColor: Colors.OrangeColor}} style={styles.toggleStyleView} />
                    </View>
                </View>
            )}
            <TabViews renderSceneCB={renderScene} routesCB={routes} indexCB={setIndexHandler} style={styles.labelStyleSmall} styleU={styles.labelStyleU} />
        </>
    )
}

const styles = StyleSheet.create({
    labelStyleSmall: {
        fontSize: 12,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    labelStyleU: {
        color: Colors.LightGrayColor,
        fontSize: 12,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    topContainer: {
        width: wp('100%'),
        backgroundColor: Colors.White,
        alignItems: 'center',
        paddingTop: hp(0.5)
    },
    searchToglleRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('92%'),
        paddingBottom: hp('1'),
        maxWidth: wp('92%')
    },
    labelContainer: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_12,
        paddingBottom: 3
    },
    toggleStyleView: {
        alignItems: 'center'
        // backgroundColor: 'green'
    },
    tradeInpute: {
        width: wp('96%'),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: hp('1'),
        backgroundColor: Colors.White,
        alignSelf: 'center'
    },

    tradeTextInput: {
        width: wp('36%'),
        height: hp('6%'),
        backgroundColor: Colors.BorderGrey,
        borderRadius: wp('6')
    },

    labelContainerTr: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_9,
        padding: 2
    }
})

export default ProductsScreen
