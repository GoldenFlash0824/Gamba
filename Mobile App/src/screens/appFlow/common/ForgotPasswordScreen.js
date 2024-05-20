import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import axios from 'axios'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Loader from '../../../components/components/common/Spinner'
import ValidateInput from '../../../utils/ValidateInput'
import DisableButton from '../../../components/components/common/DisableButton'
import ActiveButton from '../../../components/components/common/ActiveButton'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import {routes} from '../../../services'
import Header from '../../../components/components/common/Header'
import ShowAlert from '../../../components/components/common/ShowAlert'

const ForgotPasswordScreen = (props) => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)

    const [focusEmail, setFocusEmail] = useState(false)

    const [errorTextEmail, setErrorTextEmail] = useState(null)

    const [isValidRequest, setIsValidRequest] = useState(false)
    const [loading, setLoading] = useState(false)

    const onEmailFocus = () => {
        setFocusEmail(true)
    }

    const submitEmail = () => {
        const error = ValidateInput('email', email)
        setErrorTextEmail(error ? 'Valid email is required' : null)
        setEmailError(error ? true : false)
        setFocusEmail(false)
        checkIsValidRequest(email)
    }

    const onChangeEmail = async (text) => {
        text = text.toLowerCase().trim()
        setEmail(text)
        await checkIsValidRequest(text)
    }

    const checkIsValidRequest = async (_email = '') => {
        if (!ValidateInput('email', email)) {
            setIsValidRequest(true)
        } else {
            setIsValidRequest(false)
        }
    }

    const doSendLink = async () => {
        setLoading(true)
        try {
            const data = {
                email: email
            }
            await axios
                .post('user/reset_password', data)
                .then((response) => {
                    if (response.data.success == true) {
                        setLoading(false)
                        ShowAlert({type: 'Success', description: response.data.message})
                        props.navigation.goBack()
                    } else {
                        ShowAlert({type: 'error', description: response.data.message})
                        setLoading(false)
                    }
                })
                .catch((error) => {
                    ShowAlert({type: 'error', description: error.message})
                    setLoading(false)
                })
        } catch (error) {
            setLoading(false)
            ShowAlert({type: 'error', description: error.message})
        }
    }

    const contactHandler = () => {
        props.navigation.navigate('ContactScreen')
    }

    const backHandler = () => {
        props.navigation.goBack()
    }

    return (
        <View style={styles.screen}>
            <Header back={true} backCB={backHandler} />
            <Loader visible={loading} />
            <View style={styles.body}>
                <ScrollView contentContainerStyle={{paddingBottom: Platform.OS === 'android' && focusEmail ? hp('0%') : focusEmail ? hp('15%') : hp('0%'), alignItems: 'center'}}>
                    {/* <FastImage source={require('../../../assets/icons/screens/gamba_logo.png')} resizeMode="contain" style={styles.logoArea}></FastImage> */}

                    <View style={styles.upperText}>
                        <Text style={[styles.titleForget, {marginTop: hp('2%')}]}>{'Forgot Password'}</Text>
                        <Text style={[styles.issuesText, {marginTop: hp('2%'), marginBottom: hp('2%'), textAlign: 'left', maxWidth: wp('92%'), marginTop: hp('8')}]}>{`Enter your email address and we'll send a code to continue.`}</Text>
                    </View>
                    <View style={styles.backgroundContainer}>
                        <InputWithLabels
                            showLabelCB={true}
                            image={require('../../../assets/icons/screens/mail.png')}
                            value={email}
                            placeholder="Email"
                            showPlaceHolder
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
                            style={styles.inputStyle}
                            keyboardType="email-address"
                        />

                        <View style={styles.loginButton}>{isValidRequest ? <ActiveButton title="Send Link" onPress={() => doSendLink()} style={{width: wp('86%')}} /> : <DisableButton title="Send Link" style={{width: wp('86%')}} />}</View>
                    </View>
                </ScrollView>
                <View style={styles.bottomArea}>
                    <View style={styles.bottomText}>
                        <Text style={styles.issuesText}>{'Still having issues?'}</Text>
                        <TouchableOpacity onPress={() => contactHandler()} activeOpacity={0.8}>
                            <Text style={styles.contactUs}> Contact Us</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleForget: {
        textAlign: 'center',
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_20
    },
    logoArea: {
        width: wp('40%'),
        height: wp('40%')
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
        // backgroundColor: Colors.White
        // borderRadius: wp('2%'),
        // shadowColor: Colors.Shadow_Color,
        // shadowOffset: {
        //     width: 0,
        //     height: 0
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 1,
        // paddingVertical: hp('1%')
    },
    body: {
        flex: 1
    },
    upperText: {
        width: wp('88%'),
        flex: 1,
        alignItems: 'center',
        // paddingLeft: wp('4'),
        alignSelf: 'center',
        justifyContent: 'center',

        backgroundColor: Colors.White,
        marginTop: hp('10')
    },
    inputStyle: {},
    loginButton: {
        marginTop: hp('3%'),
        alignItems: 'center'
    },

    bottomArea: {
        width: wp('100%'),
        height: hp('8%')
    },
    bottomText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    issuesText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    contactUs: {
        color: Colors.BlueColor,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textDecorationLine: 'underline'
    }
})

export default ForgotPasswordScreen
