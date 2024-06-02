import React, {useState, useEffect, useRef} from 'react'
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin'
import {AppleButton, appleAuth} from '@invertase/react-native-apple-authentication'
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import {CometChat} from '@cometchat-pro/react-native-chat'
import Geolocation from 'react-native-geolocation-service'
import Geocoder from 'react-native-geocoding'

import * as Colors from '../../constants/colors'
import * as Typography from '../../constants/typography'
import ActiveButton from '../../components/components/common/ActiveButton'
import ButtonWithIcon from '../../components/components/common/ButtonWithIcon'
import DisableButtonDark from '../../components/components/common/DisableButtonDark'
import FastImage from 'react-native-fast-image'
import Header from '../../components/components/common/Header'
import InputWithLabels from '../../components/components/common/InputWithLabels'
import ConfermModal from '../../components/components/common/ConfermModal'
import Loader from '../../components/components/common/Spinner'
import ShowAlert from '../../components/components/common/ShowAlert'
import {Chat_Api, Chat_Key} from '../../services/constants/index'

import Styles from '../../constants/styles'
import ValidateInput from '../../utils/ValidateInput'
import {setLocalUser, GOOGLE_API, getHeaders} from '../../utils/helpers'
import {routes} from '../../services'
import {signIn} from '../../services/apicalls/auth'
import {storeLogInOrLogOut, storeUserData, storeCategoryData, storeDisableData, storeCehmicalData, storeChatToken} from '../../services/store/actions'
import BottomSheet from '../../components/components/common/BottomSheet'

const LoginScreen = (props) => {
    const {userData, disableReason} = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [userLat, setUserLat] = useState(null)
    const [userLng, setUserLng] = useState(null)
    const [location, setLocation] = useState(null)
    const [focusEmail, setFocusEmail] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [errorTextEmail, setErrorTextEmail] = useState(null)
    const [errorTextPassword, setErrorTextPassword] = useState(null)
    const [isRemember, setIsRemember] = useState(false)
    const [isValidRequest, setIsValidRequest] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const dispatch = useDispatch()
    const enableSheetRef = useRef()

    useEffect(() => {
        func()
    }, [])
    const func = async () => {
        Geocoder.init(GOOGLE_API)
        // await requestLocationPermissions()
        // GoogleSignin.configure()
    }
    const requestLocationPermissions = async () => {
        if (Platform.OS === 'ios') {
            const result = await Geolocation.requestAuthorization('whenInUse')
            if (result == 'granted') {
                await fetchCurrentLocation()
            } else if (result == 'denied') {
                ShowAlert({type: 'error', description: 'Location  App permissions to use Gamba'})
            }
        }
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Access Location',
                message: 'You can search nearby products in Gamba by sharing access to your location.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'No Thanks',
                buttonPositive: 'Allow Access'
            })
            if (result == 'granted') {
                await fetchCurrentLocation()
            } else if (result == 'denied') {
                ShowAlert({type: 'error', description: 'Location  App permissions to use Gamba'})
            }
        }
    }
    const fetchCurrentLocation = async () => {
        try {
            Geolocation.getCurrentPosition(
                async (position) => {
                    Geocoder.from({lat: position.coords.latitude, lng: position.coords.longitude})
                        .then(async (json) => {
                            const formatted_address = json.results[6].formatted_address
                            setUserLat(parseFloat(position.coords.latitude))
                            setUserLng(parseFloat(position.coords.longitude))
                            setLocation(formatted_address)
                        })
                        .catch((error) => {
                            console.log('address error is  ' + error.message)
                            ShowAlert({type: 'error', description: 'Error while fetching location, check your network connection'})
                        })
                },
                (error) => {
                    const value = error.message.includes('denied')
                    if (value) {
                        ShowAlert({type: 'error', description: 'You need to allow access location from App permissions to get the full benefit of Gamba.'})
                    }
                    console.log(error.code, error.message)
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
            )
        } catch (e) {
            setLoading(false)
            console.log('location fetching error is ' + e)
        }
    }

    const onEmailFocus = () => setFocusEmail(true)

    const onPasswordFocus = () => setFocusPassword(true)

    const submitEmail = () => {
        const error = ValidateInput('email', email)
        setErrorTextEmail(error ? 'Valid email is required' : null)
        setEmailError(error ? true : false)
        setFocusEmail(false)
        checkIsValidRequest(email, password)
        if (!error && !isValidRequest) {
            setFocusPassword(true)
        }
    }

    const submitPassword = () => {
        const error = ValidateInput('password', password)
        setPasswordError(error ? true : false)
        setErrorTextPassword(error ? error : null)
        setFocusPassword(false)
        checkIsValidRequest(email, password)
    }

    const onChangeEmail = async (text) => {
        text = text.toLowerCase().trim()
        setEmail(text)
        await checkIsValidRequest(text, password)
    }

    const onChangePassword = async (text) => {
        setPassword(text)
        await checkIsValidRequest(email, text)
    }

    const checkIsValidRequest = async (_email = '', _password = '') => {
        if (!ValidateInput('email', _email) && !ValidateInput('password', _password)) {
            setIsValidRequest(true)
        } else {
            setIsValidRequest(false)
        }
    }

    const doLogin = async () => {
        const data = {
            email: email,
            password: password,
            lat: userLat,
            log: userLng,
            address: location,
            fcm_token: ''
        }
        setLoading(true)
        try {
            await axios
                .post('user/login', data)
                .then(async (response) => {
                    if (response.data.success === true) {
                        // let _categories = []
                        let _chemical = []
                        if (!response.data.data.user.is_verified) {
                            // for (let i = 0; i < response.data.data.categoryData.length; i++) {
                            //     _categories.push({name: response.data.data.categoryData[i].title, id: response.data.data.categoryData[i].id})
                            // }
                            for (let j = 0; j < response.data.data.chemicalData.length; j++) {
                                _chemical.push({label: response.data.data.chemicalData[j].title, value: response.data.data.chemicalData[j].title, id: response.data.data.chemicalData[j].id})
                            }
                            isRemember ? await setLocalUser(response.data.data.user.auth_token) : null
                            await creatingChatUser(response.data.data.user)
                            // dispatch(storeCategoryData(_categories))
                            dispatch(storeCehmicalData(_chemical))
                            dispatch(storeUserData(response.data.data.user))
                            setLoading(false)
                            props.navigation.navigate('CodeScreen', {twoFactor: false})
                        } else {
                            // for (let i = 0; i < response.data.data.categoryData.length; i++) {
                            //     _categories.push({name: response.data.data.categoryData[i].title, id: response.data.data.categoryData[i].id})
                            // }
                            for (let j = 0; j < response.data.data.chemicalData.length; j++) {
                                _chemical.push({label: response.data.data.chemicalData[j].title, value: response.data.data.chemicalData[j].title, id: response.data.data.chemicalData[j].id})
                            }
                            await creatingChatUser(response.data.data.user)
                            // dispatch(storeCategoryData(_categories))
                            dispatch(storeCehmicalData(_chemical))
                            dispatch(storeUserData(response.data.data.user))
                            response.data.data.user.disable ? (setLoading(false), setModalVisible(true)) : (setLoading(false), response.data.data.user.two_fector_auth_check_detail ? props.navigation.navigate('CodeScreen', {twoFactor: true}) : setTimeout(() => dispatch(storeLogInOrLogOut(true)), 200))
                        }
                    } else {
                        setLoading(false)
                        ShowAlert({type: 'error', description: response.data.message})
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    ShowAlert({type: 'error', description: error.message})
                })
        } catch (e) {
            setLoading(false)
            ShowAlert({type: 'error', description: e.message})
        }
    }
    const doEnableAccount = async () => {
        const headers = getHeaders(userData.auth_token)
        setModalVisible(false)
        setTimeout(async () => {
            setLoading(true)
            const data = {
                u_id: userData.id,
                enable: true
            }
            try {
                await axios
                    .post('user/enable_user_web', data, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            setTimeout(() => {
                                dispatch(storeDisableData({disableText: ''}))
                            }, 100)
                            userData.two_fector_auth_check_detail ? props.navigation.navigate('CodeScreen', {twoFactor: true}) : setTimeout(() => dispatch(storeLogInOrLogOut(true)), 200)
                        } else {
                            setLoading(false)
                            ShowAlert({type: 'error', description: response.data.message})
                        }
                    })
                    .catch((error) => {
                        setLoading(false)
                        ShowAlert({type: 'error', description: error.message})
                    })
            } catch (e) {
                setLoading(false)
                ShowAlert({type: 'error', description: e.message})
            }
        }, 200)
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
    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            console.log('userInfo', userInfo)
            // socialLogin('google', userInfo.user.email, userInfo.user.name, userInfo.user.id)
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('cancelled by user')
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('operation (e.g. sign in) is in progress already')
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('play services not available or outdated')
            } else {
                console.log('===', error)
                ShowAlert({type: 'error', description: error.message})
            }
        }
    }

    async function onAppleButtonPress() {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            // Note: it appears putting FULL_NAME first is important, see issue #293
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
        })

        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)

        // use credentialState response to ensure the user is authenticated
        if (credentialState === appleAuth.State.AUTHORIZED) {
            // user is authenticated
        }
    }

    return (
        <View style={styles.screen}>
            <Header />
            <Loader visible={loading} />
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: (Platform.OS === 'android' && focusEmail) || (Platform.OS === 'android' && focusPassword) ? hp('0%') : focusEmail || focusPassword ? hp('15%') : hp('0%'),
                    alignItems: 'center'
                }}
                style={{flex: 1}}>
                {/* <FastImage source={require('../../assets/icons/screens/gamba_logo.png')} resizeMode="contain" style={styles.logoArea} /> */}
                {/* <View style={styles.body}> */}
                {disableReason?.disableText ? (
                    <View style={styles.disableReasonText}>
                        <Text style={styles.textDisable}>{disableReason?.disableText}</Text>
                    </View>
                ) : null}
                <Text style={[styles.titleSignIn, {marginTop: hp('4%')}]}>Login</Text>
                <View style={styles.backgroundContainer}>
                    <InputWithLabels
                        showLabelCB={true}
                        image={require('../../assets/icons/screens/mail.png')}
                        value={email}
                        showPlaceHolder={true}
                        placeholder="Email"
                        placeholderInner={'Enter your email address'}
                        secure={false}
                        isError={emailError}
                        isFocus={focusEmail}
                        onFocus={() => onEmailFocus()}
                        onBlur={() => submitEmail()}
                        errorText={errorTextEmail}
                        onChangeText={(text) => {
                            onChangeEmail(text)
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <InputWithLabels
                        showLabelCB={true}
                        value={password}
                        showPlaceHolder={true}
                        placeholder="Password"
                        placeholderInner={'Enter your password'}
                        isError={passwordError}
                        isFocus={focusPassword}
                        onFocus={() => onPasswordFocus()}
                        onBlur={() => submitPassword()}
                        errorText={errorTextPassword}
                        onChangeText={(text) => {
                            onChangePassword(text.trimStart())
                        }}
                        type={true}
                        icon={true}
                    />
                    <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate('ForgotPasswordScreen')} style={styles.forgotContainer}>
                        <Text style={styles.forgot}>Forgot Password</Text>
                    </TouchableOpacity>
                    {/* <View style={styles.rememberArea}>
                            <View style={styles.rememberContainer}>
                                <TouchableOpacity onPress={() => setIsRemember(!isRemember)} activeOpacity={0.8}>
                                    {isRemember ? <FastImage source={require('../../assets/icons/screens/checked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../assets/icons/screens/unchecked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} />}
                                </TouchableOpacity>
                                <Text style={styles.remember}>Remember Me</Text>
                            </View>
                        </View> */}
                    <View style={styles.loginButton}>{isValidRequest ? <ActiveButton title="Sign in" onPress={() => doLogin()} /> : <DisableButtonDark title="Sign in" />}</View>
                    {/* <View style={styles.rowLine}>
                        <View style={styles.row} />
                        <Text style={styles.or}>{'or'}</Text>
                        <View style={styles.row} />
                    </View>
                    <View style={styles.bottomButtonC}>
                        {Platform.OS != 'android' ? <ButtonWithIcon onPress={() => doAppleSignIn()} showTitle={false} image={require('../../assets/icons/screens/apple.png')} style={styles.button} /> : null}
                        <ButtonWithIcon onPress={() => null} showTitle={false} image={require('../../assets/icons/screens/instagram.png')} style={styles.button} />
                        <ButtonWithIcon onPress={() => null} showTitle={false} image={require('../../assets/icons/screens/tiktok.png')} style={styles.button} />
                        <ButtonWithIcon onPress={() => null} showTitle={false} image={require('../../assets/icons/screens/facebook.png')} style={styles.button} />
                        <ButtonWithIcon onPress={() => null} showTitle={false} image={require('../../assets/icons/screens/google.png')} style={styles.button} />
                    </View> */}
                </View>
                {/* </View> */}

                <View style={styles.bottomText}>
                    <Text style={styles.alreadyAccount}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate('RegisterScreen')} activeOpacity={0.8}>
                        <Text style={styles.forgot}> Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomSheet setRef={enableSheetRef} title={'Your account is disable'} continueTitle={'Enable ?'} continueButtonCB={() => doEnableAccount()} skipTitle={'Cancel'} skipButtonCB={() => enableSheetRef.current.close()} />
            {modalVisible && <ConfermModal visible={modalVisible} onRequestClose={() => setModalVisible(false)} closeModal={() => setModalVisible(false)} closeModalNo={() => doEnableAccount()} />}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        flex: 1
    },
    title: {
        color: Colors.MainThemeColor,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_16
    },
    titleSignIn: {
        textAlign: 'center',
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_20
    },
    textDisable: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_14
    },
    logoArea: {
        width: wp('40%'),
        height: wp('40%')
    },
    body: {
        flex: 1,
        backgroundColor: 'red'
        // bottom: hp('5'),
        // borderTopLeftRadius: wp('6'),
        // borderTopRightRadius: wp('6'),
        // backgroundColor: Colors.BackgroundColor
    },
    upperTextTitle: {
        width: wp('92%'),
        alignItems: 'flex-start',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: hp('2')
    },
    upperText: {
        width: wp('86%'),
        alignItems: 'flex-start',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    backgroundContainer: {
        width: wp('100%'),
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        borderRadius: wp('2%'),
        shadowColor: Colors.Shadow_Color,
        alignItems: 'center',
        marginTop: hp('6'),
        flex: 1

        // shadowOffset: {
        //     width: 0,
        //     height: 0
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 1,
        // elevation: 5,
        // paddingVertical: hp('1%'),
        // marginTop: hp('1')
    },

    rememberArea: {
        marginTop: hp('2'),
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('86%'),
        maxWidth: wp('86%'),
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: wp('80')
    },
    rememberImage: {
        width: wp('6%'),
        height: wp('6%')
    },
    disableReasonText: {
        marginTop: hp('2'),
        alignItems: 'center',
        width: wp('86%'),
        maxWidth: wp('86%')
    },
    remember: {
        paddingLeft: wp('1%'),
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    loginButton: {
        marginTop: hp('2%')
    },
    forgotContainer: {
        marginTop: hp('1%'),
        alignSelf: 'center',
        width: wp('86%'),
        maxWidth: wp('86%'),
        alignItems: 'flex-end'
    },
    forgot: {
        color: Colors.BlueColor,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textDecorationLine: 'underline'
    },
    rowLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('3%'),
        width: wp('88'),
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    row: {
        width: wp('40%'),
        backgroundColor: Colors.BorderGrey,
        height: wp('0.5%'),
        marginTop: hp('1%'),
        marginBottom: 0
    },
    or: {
        marginTop: hp('1%'),
        color: Colors.Description
    },
    bottomArea: {
        width: wp('100%'),
        marginTop: hp('10%')
    },
    bottomText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'android' ? hp('24%') : hp('16%')
    },
    bottomButtonC: {
        marginTop: hp('3%'),
        width: wp('70'),
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    alreadyAccount: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    signin: {
        color: Colors.Blue,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default LoginScreen
