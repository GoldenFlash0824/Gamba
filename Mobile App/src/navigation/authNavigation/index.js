import * as Colors from '../../constants/colors'
import * as Typography from '../../constants/typography'
import CodeScreen from '../../screens/authFlow/CodeScreen'
import CreateAccountScreen from '../../screens/authFlow/CreateAccountScreen'
import FastImage from 'react-native-fast-image'
import ForgotPasswordScreen from '../../screens/appFlow/common/ForgotPasswordScreen'
import LoginScreen from '../../screens/authFlow/LoginScreen'
import EditProfile from '../../screens/appFlow/menu/EditProfile'
import AccountSecurityScreen from '../../screens/appFlow/menu/AccountSecurityScreen'
import ContactScreen from '../../screens/appFlow/menu/ContactScreen'
import React from 'react'
import RegisterScreen from '../../screens/authFlow/RegisterScreen'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {CardStyleInterpolators} from '@react-navigation/stack'
import {Platform, StyleSheet} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {headers, routes} from '../../services'

const Stack = createNativeStackNavigator()

const screenOptions = {
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    tabBarHideOnKeyboard: true,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerTintColor: Colors.Black,
    headerBackImage: () => <FastImage style={{width: wp('6%'), height: wp('6%'), marginLeft: wp('2%')}} tintColor={Colors.Black} source={require('../../assets/icons/screens/left.png')} />,
    headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
        backgroundColor: Colors.White
    },
    headerTitleAlign: 'center',
    headerTitleStyle: {
        color: Colors.HTextColor,
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
        backgroundColor: Colors.LimeGreen
    },
    headerBackTitleVisible: true
}
const AuthNavigation = ({initialRouteName}) => {
    return (
        <Stack.Navigator
            screenOptions={screenOptions}
            //screenOptions={{headerStyle:{backgroundColor:'gray',borderBottomWidth:5}}}
            initialRouteName={routes.Signin}>
            <Stack.Screen
                name={routes.LoginScreen}
                component={LoginScreen}
                options={{
                    headerShown: false
                    //   title: 'Sign In',
                }}
            />

            <Stack.Screen
                name={routes.RegisterScreen}
                component={RegisterScreen}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name={routes.CodeScreen}
                component={CodeScreen}
                options={{
                    headerShown: false
                    // title: 'Verify Code'
                }}
            />
            <Stack.Screen
                name={routes.ForgotPasswordScreen}
                component={ForgotPasswordScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name={'AccountSecurityScreen'} component={AccountSecurityScreen} options={{headerShown: false}} />
            <Stack.Screen name={'ContactScreen'} component={ContactScreen} options={{headerShown: false}} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    tabStyle: {
        backgroundColor: Colors.LightCream_20,
        justifyContent: 'center'
    },
    style: {
        backgroundColor: Colors.LightCream_20
    },
    label: {
        fontSize: Typography.FONT_SIZE_10,
        marginBottom: Platform.OS == 'android' ? hp('.3%') : hp('0%')
    },
    iconLeft: {
        width: wp('2%'),
        height: wp('2%')
    }
})
export default AuthNavigation
