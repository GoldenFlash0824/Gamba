import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {CardStyleInterpolators} from '@react-navigation/stack'

import {createDrawerNavigator} from '@react-navigation/drawer'
import {StyleSheet, useWindowDimensions} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../constants/colors'
import * as Typography from '../../constants/typography'
import AddEventScreen from '../../screens/appFlow/events/AddEventScreen'
import CartScreen from '../../screens/appFlow/common/CartScreen'
import HomeScreen from '../../screens/appFlow/home/HomeScreen'
import NotificationScreen from '../../screens/appFlow/home/NotificationScreen'
import OrderSuccessfullScreen from '../../screens/appFlow/home/OrderSuccessfullScreen'
import ProfileScreen from '../../screens/appFlow/home/ProfileScreen'
import ProductsScreen from '../../screens/appFlow/home/ProductsScreen'
import ChatScreen from '../../screens/appFlow/chat/ChatScreen'
import MenuScreen from '../../screens/appFlow/menu/MenuScreen'
import MyProductsScreen from '../../screens/appFlow/menu/MyProductsScreen'
import UserPostScreen from '../../screens/appFlow/menu/UserPostScreen'
import PostDetailScreen from '../../screens/appFlow/home/PostDetailScreen'
import EventDetailScreen from '../../screens/appFlow/home/EventDetailScreen'
import ProductDetailScreen from '../../screens/appFlow/home/ProductDetailScreen'
import MyEvents from '../../components/components/common/MyEvents'

import RightDrawerContent from '../../components/components/common/RightDrawer'
import LeftDrawerContent from '../../components/components/common/LeftDrawer'

import NotificationSetting from '../../screens/appFlow/menu/NotificationSetting'
import PrivacyScreen from '../../screens/appFlow/menu/PrivacyScreen'
import PaymentMethodScreen from '../../screens/appFlow/common/PaymentMethodScreen'
import PaymentScreen from '../../screens/appFlow/menu/PaymentScreen'
import FavouriteProductsScreen from '../../screens/appFlow/menu/FavouriteProductsScreen'
import EventsScreen from '../../screens/appFlow/events/EventsScreen'
import EditProfile from '../../screens/appFlow/menu/EditProfile'
import ProfileDetail from '../../screens/appFlow/menu/ProfileDetail'
import SoldProductsScreen from '../../screens/appFlow/menu/SoldProductsScreen'
import ProductPurchasedScreen from '../../screens/appFlow/menu/ProductPurchasedScreen'
import AccountSecurityScreen from '../../screens/appFlow/menu/AccountSecurityScreen'
import ChangePasswordScreen from '../../screens/appFlow/menu/ChangePasswordScreen'
import PromosScreen from '../../screens/appFlow/menu/PromosScreen'
import AddCardPaymentScreen from '../../screens/appFlow/menu/AddCardPaymentScreen'
import VenoPaymentScreen from '../../screens/appFlow/menu/VenoPaymentScreen'
import PaypalPaymentScreen from '../../screens/appFlow/menu/PaypalPaymentScreen'
import ApplepayPaymentScreen from '../../screens/appFlow/menu/ApplepayPaymentScreen'
import ContactScreen from '../../screens/appFlow/menu/ContactScreen'
import AboutScreen from '../../screens/appFlow/menu/AboutScreen'
import MamberAgreementScreen from '../../screens/appFlow/menu/MamberAgreementScreen'
import PrivacyPolicyScreen from '../../screens/appFlow/menu/PrivacyPolicyScreen'
import SellersRefundAgreementScreen from '../../screens/appFlow/menu/SellersRefundAgreementScreen'

import TabBar from '../../components/components/common/TabBar'
import AddModal from '../../components/components/common/AddModal'

const AppStack = createNativeStackNavigator()
const BottomTab = createBottomTabNavigator()
const LeftDrawer = createDrawerNavigator()
const RightDrawer = createDrawerNavigator()

const screenOptions = {
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    tabBarStyle: [{display: 'flex'}, null],
    tabBarHideOnKeyboard: true,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerTintColor: Colors.Black,
    headerBackImage: () => <FastImage style={{width: wp('6%'), height: wp('6%'), marginLeft: wp('2%')}} tintColor={Colors.DarkPepper_60} source={require('../../assets/icons/screens/left.png')} />,
    headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
        backgroundColor: Colors.LightCream_10
    },
    headerTitleAlign: 'center',
    headerTitleStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: Typography.FONT_SIZE_16,
        fontWeight: Typography.FONT_WEIGHT_BOLD
    },
    headerBackTitle: 'Back',
    headerBackTitleStyle: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14
    },
    transparentCard: false,
    cardStyle: {
        backgroundColor: Colors.LightCream_20
    },
    headerBackTitleVisible: false
}
const AddScreenComponent = () => {
    return null
}

const BottomTabStack = () => {
    const {height} = useWindowDimensions()
    return (
        <BottomTab.Navigator
            screenOptions={{
                tabBarHideOnKeyboard: true,
                labelStyle: styles.label,
                tabBarStyle: height > 1000 ? styles.tabStyleTab : styles.tabStyle,
                activeTintColor: Colors.HTextColor,
                inactiveTintColor: Colors.DarkPepper_20
            }}
            initialRouteName={'HomeStack'}>
            <BottomTab.Screen
                name="HomeStack"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    title: () => null,
                    tabBarIcon: ({focused}) => {
                        return <TabBar focused={focused} icon={require('../../assets/icons/bottomtab/home.png')} tintColorInactive={Colors.LightGrayColor} tintColor={Colors.MainThemeColor} />
                    }
                }}
            />
            <BottomTab.Screen
                name="ProductsStack"
                component={ProductsScreen}
                options={{
                    headerShown: false,
                    title: () => null,
                    tabBarIcon: ({focused}) => {
                        return <TabBar focused={focused} icon={require('../../assets/icons/bottomtab/product.png')} tintColorInactive={Colors.LightGrayColor} tintColor={Colors.MainThemeColor} change={true} />
                    }
                }}
            />
            <BottomTab.Screen
                name="AddStack"
                component={AddScreenComponent}
                options={{
                    tabBarButton: () => <AddModal />
                }}
            />

            <BottomTab.Screen
                name="EventsStack"
                component={EventsScreen}
                options={{
                    headerShown: false,
                    title: () => null,
                    tabBarIcon: ({focused}) => {
                        return <TabBar focused={focused} icon={require('../../assets/icons/bottomtab/create_event.png')} tintColorInactive={Colors.LightGrayColor} tintColor={Colors.MainThemeColor} />
                    }
                }}
            />

            <BottomTab.Screen
                name="CartStack"
                component={CartScreen}
                options={{
                    title: () => null,
                    headerShown: false,
                    tabBarIcon: ({focused}) => {
                        return <TabBar focused={focused} icon={require('../../assets/icons/bottomtab/cart.png')} tintColorInactive={Colors.LightGrayColor} tintColor={Colors.MainThemeColor} cart={true} />
                    }
                }}
            />
        </BottomTab.Navigator>
    )
}

const LeftDrawerScreen = () => {
    return (
        <LeftDrawer.Navigator
            id="LeftDrawer"
            drawerContent={(props) => {
                return <LeftDrawerContent {...props} />
            }}
            screenOptions={{drawerPosition: 'left', drawerType: 'back', gestureEnabled: true, gestureDirection: 'horizontal'}}>
            <LeftDrawer.Screen name="BottomTabStack" component={BottomTabStack} options={{headerShown: false}} />
        </LeftDrawer.Navigator>
    )
}

const RightDrawerScreen = () => {
    return (
        <RightDrawer.Navigator id="RightDrawer" drawerContent={(props) => <RightDrawerContent {...props} />} screenOptions={{drawerPosition: 'right', headerShown: false, drawerType: 'front'}}>
            <RightDrawer.Screen name="HomeDrawer" component={LeftDrawerScreen} />
        </RightDrawer.Navigator>
    )
}
const AppNavigation = () => {
    return (
        <AppStack.Navigator screenOptions={screenOptions}>
            <AppStack.Screen name="BottomTabStack" component={RightDrawerScreen} options={{headerShown: false}} />
            <AppStack.Screen name="MenuScreen" component={MenuScreen} options={{headerShown: true}} />
            <AppStack.Screen name="EditProfile" component={EditProfile} options={{headerShown: false}} />
            <AppStack.Screen name="PaymentScreen" component={PaymentScreen} options={{headerShown: false}} />
            <AppStack.Screen name="NotificationSetting" component={NotificationSetting} options={{headerShown: false}} />
            <AppStack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{headerShown: false}} />
            <AppStack.Screen name="ProfileDetail" component={ProfileDetail} options={{headerShown: false}} />
            <AppStack.Screen name="PrivacyScreen" component={PrivacyScreen} options={{headerShown: false}} />
            <AppStack.Screen name="UserPostScreen" component={UserPostScreen} options={{headerShown: false}} />
            <AppStack.Screen name="MyEvents" component={MyEvents} options={{headerShown: false}} />
            <AppStack.Screen name="MyProductsScreen" component={MyProductsScreen} options={{headerShown: false}} />
            <AppStack.Screen name="ProductPurchasedScreen" component={ProductPurchasedScreen} options={{headerShown: false}} />
            <AppStack.Screen name="FavouriteProductsScreen" component={FavouriteProductsScreen} options={{headerShown: false}} />
            <AppStack.Screen name="SoldProductsScreen" component={SoldProductsScreen} options={{headerShown: false}} />
            <AppStack.Screen name="ContactScreen" component={ContactScreen} options={{headerShown: false}} />
            <AppStack.Screen name="AboutScreen" component={AboutScreen} options={{headerShown: false}} />
            <AppStack.Screen name="VenoPaymentScreen" component={VenoPaymentScreen} options={{headerShown: false}} />
            <AppStack.Screen name="PaypalPaymentScreen" component={PaypalPaymentScreen} options={{headerShown: false}} />
            <AppStack.Screen name="ApplepayPaymentScreen" component={ApplepayPaymentScreen} options={{headerShown: false}} />
            <AppStack.Screen name="AddCardPaymentScreen" component={AddCardPaymentScreen} options={{headerShown: false}} />
            <AppStack.Screen name="NotificationScreen" component={NotificationScreen} options={{headerShown: false}} />
            <AppStack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{headerShown: false}} />
            <AppStack.Screen name="EventDetailScreen" component={EventDetailScreen} options={{headerShown: false}} />
            <AppStack.Screen name="AddEventScreen" component={AddEventScreen} options={{headerShown: false}} />
            <AppStack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{headerShown: false}} />
            <AppStack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown: false}} />
            <AppStack.Screen name="PaymentMethodScreen" component={PaymentMethodScreen} options={{headerShown: false}} />
            <AppStack.Screen name="OrderSuccessfullScreen" component={OrderSuccessfullScreen} options={{headerShown: false}} />
            <AppStack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown: false}} />
            <AppStack.Screen name="MamberAgreementScreen" component={MamberAgreementScreen} options={{headerShown: false}} />
            <AppStack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{headerShown: false}} />
            <AppStack.Screen name="SellersRefundAgreementScreen" component={SellersRefundAgreementScreen} options={{headerShown: false}} />
        </AppStack.Navigator>
    )
}
const styles = StyleSheet.create({
    tabStyle: {
        // width: wp('92'),
        position: 'absolute',
        backgroundColor: Colors.White,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 0,
        // height: hp('8'),
        // alignSelf: 'center',

        shadowColor: Colors.Shadow_Color,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5
    },
    tabStyleTab: {
        position: 'absolute',
        backgroundColor: Colors.White,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 0,
        height: hp('9'),
        shadowColor: Colors.Shadow_Color,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5
    },
    label: {
        fontSize: Typography.FONT_SIZE_11,
        color: Colors.White,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingLeft: wp('1')
    }
})

export default AppNavigation
