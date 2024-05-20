import React, {useState} from 'react'
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'

import ActiveButton from '../../components/components/common/ActiveButton'
import DisableButton from '../../components/components/common/DisableButton'
import Loader from '../../components/components/common/Spinner'
import Styles from '../../constants/styles'
import * as Colors from '../../constants/colors'
import * as Typography from '../../constants/typography'
import {getHeaders} from '../../utils/helpers'
import ShowAlert from '../../components/components/common/ShowAlert'
import Header from '../../components/components/common/Header'
import {storeLogInOrLogOut} from '../../services/store/actions'

const CodeScreen = ({navigation, route}) => {
    const params = route.params
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [isValidRequest, setIsValidRequest] = useState(true)
    const [code, setCode] = useState('')
    const dispatch = useDispatch()

    const doGetRegisterCode = async (resend) => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .post('/user/re_send_verification_code', {email: userData.email, two_fector_auth: params?.twoFactor ? params.twoFactor : false}, headers)
                .then((response) => {
                    setLoading(false)
                    if (resend) {
                        ShowAlert({type: 'success', description: response.data.message})
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    ShowAlert({type: 'error', description: error.message})
                })
        } catch (error) {
            setLoading(false)
            console.log('error', error.message)
        }
    }
    const doAuth = async () => {
        try {
            if (isValidRequest === true) {
                const headers = getHeaders(userData.auth_token)
                setLoading(true)
                await axios
                    .post('/user/verify_register_code', {email: userData.email, verification_code: code, two_fector_auth: params?.twoFactor ? params.twoFactor : false}, headers)
                    .then((response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            setTimeout(() => dispatch(storeLogInOrLogOut(true)), 200)
                        } else {
                            setLoading(false)
                            ShowAlert({type: 'error', description: response.data.message})
                        }
                    })
                    .catch((error) => {
                        setLoading(false)
                        ShowAlert({type: 'error', description: error.message})
                    })
            }
        } catch (error) {
            setLoading(false)
            console.log('error', error.message)
        }
    }

    const openTerms = () => {}

    const submitCode = (length) => {
        if (length < 6) {
            setIsValidRequest(false)
        } else if (length === 0) {
            setIsValidRequest(false)
        } else if (length === 6) {
            setIsValidRequest(true)
        }
    }

    const backHandler = () => navigation.goBack()

    return (
        <View style={styles.container}>
            <Loader visible={loading} />
            <Header back={true} backCB={backHandler} />
            <View style={styles.body}>
                <View style={styles.backgroundContainer}>
                    <Text style={Styles.sectionTitle}>Confirmation</Text>
                    <Text style={[styles.issuesText]}>Enter the confirmation code we sent to</Text>
                    <OTPInputView
                        style={styles.otpInput}
                        pinCount={6}
                        code={code}
                        onCodeChanged={(code) => {
                            setCode(code)
                            submitCode(code.length)
                        }}
                        autoFocusOnLoad={false}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={(code) => {}}
                    />
                    {isValidRequest ? <ActiveButton onPress={() => doAuth()} title="Submit" style={{width: wp('86%'), marginTop: hp(2)}} /> : <DisableButton title="Submit" style={{width: wp('86%')}} />}
                    <TouchableOpacity activeOpacity={0.6} onPress={() => doGetRegisterCode(true)}>
                        <Text style={styles.resendText}>Resend Code</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.6} onPress={() => openTerms()}></TouchableOpacity>
            </View>
        </View>
    )
}

export default CodeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.White,
        width: wp('100%')
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.White,

        marginTop: hp('5')
    },
    body: {
        flex: 1,
        marginTop: hp('2%'),
        width: wp('100%'),
        alignItems: 'center'
    },
    otpInput: {
        width: wp('86%'),
        height: hp('10%')
    },
    resendText: {
        color: Colors.BlueColor,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textDecorationLine: 'underline',
        marginTop: hp('3%')
    },
    agreeText: {
        maxWidth: wp('88'),
        textAlign: 'center',
        fontSize: Typography.FONT_SIZE_13,
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    agreeTextTerms: {
        maxWidth: wp('88'),
        textAlign: 'center',
        fontSize: Typography.FONT_SIZE_13,
        color: Colors.Black,
        marginTop: hp('3%'),
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    termsText: {
        textAlign: 'center',
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        color: Colors.HTextColor,
        marginTop: hp('1%')
    },

    issuesText: {
        marginTop: hp('10'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },

    underlineStyleBase: {
        width: wp('12%'),
        height: hp('6%'),
        borderWidth: 1,
        borderColor: Colors.BorderGrey,
        color: Colors.HTextColor,
        backgroundColor: Colors.SearchBG,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    underlineStyleHighLighted: {
        borderColor: Colors.BorderGrey,
        backgroundColor: Colors.White
    }
})
