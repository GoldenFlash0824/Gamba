import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, View, Keyboard, Platform, TouchableOpacity} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import {CometChat} from '@cometchat-pro/react-native-chat'

import ActiveButton from '../../components/components/common/ActiveButton'
import DisableButton from '../../components/components/common/DisableButton'
import InputWithLabels from '../../components/components/common/InputWithLabels'
import ButtonWithIcon from '../../components/components/common/ButtonWithIcon'
import Loader from '../../components/components/common/Spinner'
import ValidateInput, {ValidateEmail} from '../../utils/ValidateInput'
import {getHeaders} from '../../utils/helpers'
import Styles from '../../constants/styles'
import * as Colors from '../../constants/colors'
import * as Typography from '../../constants/typography'
import ShowAlert from '../../components/components/common/ShowAlert'
import Header from '../../components/components/common/Header'
import {storeUserData, storeCategoryData, storeCehmicalData, storeLogInOrLogOut, storeChatToken} from '../../services/store/actions'
import {Chat_Api, Chat_Key, IMAGES_BASE_URL} from '../../services/constants/index'
import DisableButtonDark from '../../components/components/common/DisableButtonDark'

const RegisterScreen = (props) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [passwordC, setPasswordC] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [privacy, setPrivacy] = useState(false)
    const [notification, setNotification] = useState(false)

    //states for handling errors
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorC, setPasswordErrorC] = useState(false)

    //states for handling focus
    const [focusFirstName, setFocusFirstName] = useState(false)
    const [focusLastName, setFocusLastName] = useState(false)
    const [focusPhone, setFocusPhone] = useState(false)
    const [focusEmail, setFocusEmail] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [focusPasswordC, setFocusPasswordC] = useState(false)

    //states for setting error text
    const [errorTextFirstName, setErrorTextFirstName] = useState(null)
    const [errorTextLastName, setErrorTextLastName] = useState(null)
    const [errorTextPhone, setErrorTextPhone] = useState(null)
    const [errorTextEmail, setErrorTextEmail] = useState(null)
    const [errorTextPassword, setErrorTextPassword] = useState(null)
    const [errorTextPasswordC, setErrorTextPasswordC] = useState(null)

    const [isValidRequest, setIsValidRequest] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const [keyboardStatus, setKeyboardStatus] = useState(false)

    useEffect(() => {
        if (Platform.OS === 'android') {
            const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
                setKeyboardStatus(true)
            })
            const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
                setKeyboardStatus(false)
                Keyboard.dismiss()
            })

            return () => {
                showSubscription.remove()
                hideSubscription.remove()
            }
        }
    }, [])

    const submitFirstName = () => {
        const error = ValidateInput('firstName', firstName)
        setErrorTextFirstName(error ? error : null)
        setFirstNameError(error ? true : false)
        setFocusFirstName(false)
        checkIsValidRequest(privacy, notification)
        if (!error && !isValidRequest) {
            setFocusLastName(true)
        }
    }
    const submitLastName = () => {
        const error = ValidateInput('lastName', lastName)
        setErrorTextLastName(error ? error : null)
        setLastNameError(error ? true : false)
        setFocusLastName(false)
        checkIsValidRequest(privacy, notification)
        if (!error && !isValidRequest) {
            setFocusEmail(true)
        }
    }

    const submitPhone = () => {
        const error = ValidateInput('phone', phone)
        setErrorTextPhone(error ? error : null)
        setPhoneError(error ? true : false)
        setFocusPhone(false)
        checkIsValidRequest(privacy, notification)
    }

    const submitEmail = () => {
        const error = ValidateEmail(email)
        setErrorTextEmail(error ? 'Valid email is required' : null)
        setEmailError(error ? true : false)
        setFocusEmail(false)
        checkIsValidRequest(privacy, notification)
        if (!error && !isValidRequest) {
            setFocusPhone(true)
        }
    }
    const submitPassword = () => {
        const error = ValidateInput('password', password)
        setPasswordError(error ? true : false)
        setErrorTextPassword(error ? error : null)
        setFocusPassword(false)
        checkIsValidRequest(privacy, notification)
    }

    const onPasswordFocus = () => {
        setFocusPassword(true)
    }
    const changeFirstName = (text) => {
        text = text.trimStart()
        setFirstName(text)
    }
    const changeLastName = (text) => {
        text = text.trimStart()
        setLastName(text)
    }

    const changePhone = (text) => {
        let reg = new RegExp(`^[0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setPhone(text)
            }
        } else {
            setPhone(text)
        }
    }
    const onChangePassword = async (text) => {
        setPassword(text)
        checkIsValidRequest(privacy, notification)
    }

    const changeEmail = (text) => {
        text = text.toLowerCase().trim()
        setEmail(text)
    }

    const resetAllFocus = () => {
        setFocusFirstName(false)
        setFocusLastName(false)
        setFocusPhone(false)
        setFocusEmail(false)
        setFocusPassword(false)
        setFocusPasswordC(false)
    }
    const checkIsValidRequest = (_privacy, _notification) => {
        if (!ValidateInput('email', email) && !ValidateInput('firstName', firstName) && !ValidateInput('lastName', lastName) && !ValidateInput('phone', phone) && !ValidateInput('password', password)) {
            setIsValidRequest(true)
            return true
        } else {
            setIsValidRequest(false)
            return false
        }
    }

    const doRegister = async () => {
        const result = checkIsValidRequest(privacy, notification)
        const data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            password: password,
            confirmPassword: password,
            fcm_token: ''
        }
        if (result) {
            setLoading(true)
            try {
                await axios
                    .post('user/register', data)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            // let _categories = []
                            let _chemical = []
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
                            setLoading(false)
                            props.navigation.navigate('CodeScreen')
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
    }
    const creatingChatUser = async (user) => {
        const url = `${Chat_Api}api/users/${user.id}a/tokens`
        const data = {expires_in: 14400}
        const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${Chat_Key}`}
        await axios
            .post(url, data, {headers})
            .then(async (response) => {
                const accessToken = response.data.access_token
                await upDateChatUser(user, accessToken)
                dispatch(storeChatToken(accessToken))
            })
            .catch((error) => {
                console.log('createdUse Error:', error)
            })
    }

    const upDateChatUser = async (user) => {
        const url = `${Chat_Api}api/users/${user.id}a`
        const data = {name: user.first_name + ' ' + user.last_name, email: user.email, picture: IMAGES_BASE_URL + user.first_name[0]?.toLowerCase() + '.png'}
        const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${Chat_Key}`}
        await axios
            .put(url, data, {headers})
            .then(async (response) => {
                const updateUse = response.data
                await updateProfileH(user, updateUse)
            })
            .catch((error) => {
                console.log('createdUse Error:', error)
            })
    }
    const updateProfileH = async (user, chatu) => {
        const headers = getHeaders(user.auth_token)
        const data = {chat_id: chatu.id}
        try {
            await axios
                .post('user/update', data, headers)
                .then(async (response) => {})
                .catch((error) => {})
        } catch (e) {}
    }

    return (
        <View style={styles.screen}>
            <Loader visible={loading} />
            <Header />
            <View style={styles.scrollBody}>
                <KeyboardAwareScrollView enableOnAndroid={true} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: hp('20'), marginTop: hp('2')}}>
                    <Text style={[styles.titleSignUp, {marginVertical: hp('0%')}]}>Register</Text>
                    <View style={styles.backgroundContainer}>
                        <InputWithLabels
                            showLabelCB={true}
                            value={firstName}
                            placeholder="First name"
                            showPlaceHolder={true}
                            placeholderInner={'Enter your first name'}
                            isError={firstNameError}
                            isFocus={focusFirstName}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusFirstName(true)
                            }}
                            onBlur={() => submitFirstName()}
                            errorText={errorTextFirstName}
                            onChangeText={(text) => changeFirstName(text)}
                        />
                        <InputWithLabels
                            showLabelCB={true}
                            value={lastName}
                            placeholder="Last Name"
                            showPlaceHolder={true}
                            placeholderInner={'Enter your last name'}
                            isError={lastNameError}
                            isFocus={focusLastName}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusLastName(true)
                            }}
                            onBlur={() => submitLastName()}
                            errorText={errorTextLastName}
                            onChangeText={(text) => changeLastName(text)}
                        />
                        <InputWithLabels
                            showLabelCB={true}
                            value={email}
                            placeholder="Email"
                            showPlaceHolder={true}
                            placeholderInner={'Enter your email address'}
                            keyboardType="email-address"
                            secure={false}
                            isError={emailError}
                            onBlur={() => submitEmail()}
                            isFocus={focusEmail}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusEmail(true)
                            }}
                            errorText={errorTextEmail}
                            autoCapitalize="none"
                            onChangeText={(text) => changeEmail(text)}
                        />
                        <InputWithLabels
                            showLabelCB={true}
                            value={phone}
                            placeholder="Phone Number"
                            showPlaceHolder={true}
                            placeholderInner={'Enter your phone number'}
                            keyboardType="number-pad"
                            secure={false}
                            isError={phoneError}
                            onBlur={() => submitPhone()}
                            isFocus={focusPhone}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusPhone(true)
                            }}
                            errorText={errorTextPhone}
                            onChangeText={(text) => changePhone(text)}
                        />
                        <InputWithLabels
                            showLabelCB={true}
                            value={password}
                            placeholder="Password"
                            showPlaceHolder={true}
                            placeholderInner={'Enter password'}
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
                        {/* <InputWithLabels
                            showLabelCB={true}
                            value={passwordC}
                            placeholder="Confirm Password"
                            isError={passwordErrorC}
                            isFocus={focusPasswordC}
                            onFocus={() => setFocusPasswordC(true)}
                            onBlur={() => submitPasswordC()}
                            errorText={errorTextPasswordC}
                            onChangeText={(text) => {
                                onChangePasswordC(text.trimStart())
                            }}
                            type={true}
                            icon={true}

                        /> */}
                        {Platform.OS === 'android' ? (
                            !keyboardStatus && (
                                <>
                                    {/* isValidRequest */}
                                    {isValidRequest ? (
                                        <View style={styles.buttonContainer}>
                                            <ActiveButton onPress={() => doRegister()} title="Register" />
                                        </View>
                                    ) : (
                                        <View style={styles.buttonContainer}>
                                            <DisableButtonDark title="Register" />
                                        </View>
                                    )}
                                </>
                            )
                        ) : (
                            <>
                                {isValidRequest ? (
                                    <View style={styles.buttonContainer}>
                                        <ActiveButton onPress={() => doRegister()} title="Register" />
                                    </View>
                                ) : (
                                    <View style={styles.buttonContainer}>
                                        <DisableButtonDark title="Register" />
                                    </View>
                                )}
                            </>
                        )}
                        {/* <View style={styles.rowLine}>
                            <View style={styles.row} />
                            <Text style={styles.or}>{'or'}</Text>
                            <View style={styles.row} />
                        </View>
                        <View style={styles.bottomButtonC}>
                            {Platform.OS != 'android' ? <ButtonWithIcon onPress={() => null} showTitle={false} image={require('../../assets/icons/screens/apple.png')} style={styles.button} /> : null}
                            <ButtonWithIcon onPress={() => null} showTitle={false} image={require('../../assets/icons/screens/instagram.png')} style={styles.button} />
                            <ButtonWithIcon onPress={() => null} showTitle={false} image={require('../../assets/icons/screens/tiktok.png')} style={styles.button} />
                            <ButtonWithIcon onPress={() => null} showTitle={false} image={require('../../assets/icons/screens/facebook.png')} style={styles.button} />
                            <ButtonWithIcon onPress={() => null} showTitle={false} image={require('../../assets/icons/screens/google.png')} style={styles.button} />
                        </View> */}

                        {/* <View style={styles.rememberArea}>
                            <TouchableOpacity
                                onPress={() => {
                                    setPrivacy(!privacy), checkIsValidRequest(privacy ? false : true, notification)
                                }}
                                activeOpacity={0.8}>
                                {privacy ? <FastImage source={require('../../assets/icons/screens/checked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../assets/icons/screens/unchecked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} />}
                            </TouchableOpacity>
                            <Text style={styles.remember}>I have read this term and privacy.</Text>
                        </View>
                        <View style={styles.rememberArea}>
                            <TouchableOpacity
                                onPress={() => {
                                    setNotification(!notification), checkIsValidRequest(privacy, notification ? false : true)
                                }}
                                activeOpacity={0.8}>
                                {notification ? <FastImage source={require('../../assets/icons/screens/checked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../assets/icons/screens/unchecked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} />}
                            </TouchableOpacity>
                            <Text style={styles.remember}>I consent to getting notifications about discounted products, events, and new blogs.</Text>
                        </View> */}
                        <View style={styles.bottomText}>
                            <Text style={styles.alreadyAccount}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => props.navigation.goBack()} activeOpacity={0.8}>
                                <Text style={styles.forgot}> Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {/* </View> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.White,
        flex: 1
    },
    scrollBody: {
        flex: 1,
        alignItems: 'center'
    },
    titleSignUp: {
        textAlign: 'center',
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_20
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        alignItems: 'center',
        marginTop: hp('2'),
        flex: 1
        // borderRadius: wp('2%'),
        // shadowColor: Colors.Shadow_Color,
        // shadowOffset: {
        //     width: 0,
        //     height: 0
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 1,
        // paddingVertical: hp('1.8%')
    },
    body: {
        paddingLeft: wp('4'),
        bottom: hp('5'),
        width: wp('100'),
        alignItems: 'flex-start',
        borderTopLeftRadius: wp('10'),
        borderTopRightRadius: wp('10'),
        backgroundColor: Colors.BackgroundColor,
        overflow: 'hidden'
    },
    logoArea: {
        width: wp('40%'),
        height: wp('40%')
    },
    rememberArea: {
        flexDirection: 'row',
        width: wp('86%'),
        alignSelf: 'center',
        top: hp('1%')
    },
    rememberImage: {
        // marginRight: wp('1%'),
        width: wp('5%'),
        height: wp('5%')
    },
    remember: {
        maxWidth: wp('80'),
        paddingLeft: wp('1'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    bottomButtonC: {
        marginTop: hp('1%'),
        width: wp('60'),
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    buttonContainer: {
        bottom: hp('1%'),
        alignSelf: 'center',
        marginTop: hp('6')
    },
    rowLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%'),
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
    forgot: {
        color: Colors.BlueColor,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textDecorationLine: 'underline'
    },
    bottomArea: {
        width: wp('100%')
        // marginTop: hp('10%')
    },
    bottomText: {
        marginTop: Platform.OS === 'android' ? hp('12%') : hp('6%'),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default RegisterScreen
