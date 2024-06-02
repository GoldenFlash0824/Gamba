import {CometChat} from '@cometchat-pro/react-native-chat'

import {colors} from '../utilities/colors'
import {appStyles} from '../utilities/appStyles'

export const IMAGES_BASE_URL = 'https://imagescontent.s3.us-east-1.amazonaws.com/'
export const BASE_URL = 'http://localhost:5000/gamba/'
// for testing
// export const BASE_URL = 'https://b92c-103-12-199-142.ngrok-free.app/gamba/'

export const Chat_Api = 'https://b8f07be37ad04ff6886053e8766c8ca0.weavy.io/'
export const Chat_Key = 'wys_pddpVmu7sawucsDxzsG1HSjzDGZ85d2GRR42'

// export const Chat_Api = 'https://2a512ce83c264511897b4e3d377afb04.weavy.io/'
// export const Chat_Key = 'wys_Z3mZFjI3DXqAsPpoydYAKq8GXK81QH3pjs3D'

export const endPoints = {
    logIn: 'login',
    signUp: 'signUp'
}
export const routes = {
    Auth: 'Auth',
    App: 'App',
    Splash: 'Splash',
    Signin: 'Signin',
    Signup: 'Signup',
    Home: 'Home',
    WelcomeScreen: 'WelcomeScreen',
    LoginScreen: 'LoginScreen',
    RegisterScreen: 'RegisterScreen',
    CodeScreen: 'CodeScreen',
    CreateAccountScreen: 'CreateAccountScreen',
    ForgotPasswordScreen: 'ForgotPasswordScreen'
}
export const headers = {
    screenOptions: {
        // headerShown: false,
        title: 'Title',
        headerTitleAlign: 'left',
        headerStyle: [appStyles.headerStyle],
        headerTitleStyle: appStyles.headerTitleStyle,
        headerTintColor: colors.appTextColor4,
        headerBackTitle: ' '
    }
}
export const tabs = {
    tabBarOptions: {
        showLabel: false,
        tabBarActiveTintColor: colors.appColor1,
        tabBarInactiveTintColor: colors.appBgColor3,
        allowFontScaling: true,
        tabBarStyle: appStyles.tabBarStyle,
        activeBackgroundColor: '#FFFFFF40',
        tabStyle: {borderRadius: 20, marginHorizontal: 7.5, marginVertical: 2}
    }
}
