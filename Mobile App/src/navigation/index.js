import React, {useEffect, useState} from 'react'
import {StatusBar, Linking, Platform} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
// import SplashScreen from 'react-native-splash-screen'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import * as Colors from '../constants/colors'
import AuthNavigation from './authNavigation'
import AppNavigation from './appNavigation'
import {routes} from '../services'
import {navigationRef} from './rootNavigation'
import {Chat_Api, Chat_Key} from '../services/constants/index'
import ChatRoomScreen from '../screens/appFlow/chat/ChatRoomScreen'
import CommentScreen from '../screens/appFlow/home/CommentScreen'
import {storeLinkUrl} from '../services/store/actions/user'
import {setLocalUser, getLocalAuthToken} from '../utils/helpers'
import {storeLogInOrLogOut, storeUserData, storeCategoryData, storeCehmicalData, storeChatToken} from '../services/store/actions'
import SplashScreen from '../screens/authFlow/SplashScreen'

const MainStack = createNativeStackNavigator()

export default function Navigation() {
    const {isLogedIn} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(true)

    const dispatch = useDispatch()

    useEffect(() => {
        setLoading(true)
        getDeepLinking()
    }, [])
    const getDeepLinking = async () => {
        await setDeepLinking()
        const usertoken = await getLocalAuthToken()
        await doLogin(usertoken)
        // SplashScreen.hide()
    }

    const setDeepLinking = async () => {
        Linking.getInitialURL().then((url) => {
            if (url != null) {
                dispatch(storeLinkUrl(url))
            }
        })
        const subscription = Linking.addEventListener('url', (event) => {
            if (event.url != null) {
                dispatch(storeLinkUrl(event.url))
            }
        })

        return () => subscription.remove()
    }

    const doLogin = async (usertoken) => {
        if (usertoken) {
            try {
                await axios
                    .post('user/auto_login', {}, usertoken)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            if (response.data.data.user.user.disable || response.data.data.user.user.two_fector_auth_check_detail) {
                                setTimeout(() => setLoading(false), 2000)
                            } else {
                                let _categories = []
                                let _chemical = []
                                for (let i = 0; i < response.data.data.user.categoryData.length; i++) {
                                    _categories.push({name: response.data.data.user.categoryData[i].title, id: response.data.data.user.categoryData[i].id})
                                }
                                for (let j = 0; j < response.data.data.user.chemicalData.length; j++) {
                                    _chemical.push({label: response.data.data.user.chemicalData[j].title, value: response.data.data.user.chemicalData[j].title, id: response.data.data.user.chemicalData[j].id})
                                }
                                await setLocalUser(response.data.data.user.user.auth_token)
                                await creatingChatUser(response.data.data.user.user)
                                dispatch(storeCategoryData(_categories))
                                dispatch(storeCehmicalData(_chemical))
                                dispatch(storeUserData(response.data.data.user.user))
                                setTimeout(() => (setLoading(false), dispatch(storeLogInOrLogOut(true))), 2000)
                            }
                        } else {
                            // ShowAlert({type: 'error', description: response.data.message})
                            setTimeout(() => setLoading(false), 2000)
                        }
                    })
                    .catch((error) => {
                        // ShowAlert({type: 'error', description: error.message})
                        setTimeout(() => setLoading(false), 2000)
                    })
            } catch (e) {
                // ShowAlert({type: 'error', description: e.message})
                setTimeout(() => setLoading(false), 2000)
            }
        } else {
            setTimeout(() => setLoading(false), 2000)
        }
    }

    const creatingChatUser = async (user) => {
        const url = `${Chat_Api}api/users/${user.id}a/tokens`
        const data = {expires_in: 14400}
        const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${Chat_Key}`}
        await axios
            .post(url, data, {headers})
            .then(async (response) => {
                const accessToken = response.data.access_token
                dispatch(storeChatToken(accessToken))
            })
            .catch((error) => {
                console.log('createdUse Error:', error)
            })
    }
    if (loading) {
        return <SplashScreen />
    }

    return (
        <SafeAreaProvider>
            <StatusBar backgroundColor={Colors.White} barStyle={'dark-content'} />
            <NavigationContainer ref={navigationRef}>
                <MainStack.Navigator screenOptions={{headerShown: false}} initialRouteName={routes.Auth}>
                    {!isLogedIn ? (
                        <MainStack.Screen name={routes.Auth} component={AuthNavigation} />
                    ) : (
                        <>
                            <MainStack.Screen name={routes.App} component={AppNavigation} />
                            <MainStack.Screen name={'ChatRoomScreen'} component={ChatRoomScreen} options={{headerShown: false}} />
                            <MainStack.Screen name={'CommentScreen'} component={CommentScreen} options={{headerShown: false}} />
                        </>
                    )}
                </MainStack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
