import React, {useState, useEffect} from 'react'
import {Modal, StyleSheet, Text, View, Platform, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import {useDispatch, useSelector} from 'react-redux'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ActiveButton from './ActiveButton'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import DisableButtonDark from '../../../components/components/common/DisableButtonDark'
import ValidateInput from '../../../utils/ValidateInput'

const ConfermModal = ({visible, closeModal, closeModalNo, varificationUser = false, headingVerify, verifiyOnPress, onRequestClose}) => {
    const {userData} = useSelector((state) => state.user)
    const [email, setEmail] = useState(userData?.email ? userData?.email : '')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [focusEmail, setFocusEmail] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [errorTextEmail, setErrorTextEmail] = useState(null)
    const [errorTextPassword, setErrorTextPassword] = useState(null)
    const [isValidRequest, setIsValidRequest] = useState(false)

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

    const onPressFiled = () => {
        setFocusEmail(false)
        setFocusPassword(false)
        verifiyOnPress({email: email, password: password})
    }
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onRequestClose}>
            <Pressable style={styles.bottomView} onPress={onRequestClose}>
                {varificationUser ? (
                    <View style={styles.container}>
                        <View style={styles.viewTitleHeading}>
                            <Text style={styles.headingTextDetail}>{headingVerify}</Text>
                            <Pressable onPress={onRequestClose}>
                                <FastImage source={require('../../../assets/icons/screens/cancel_b.png')} style={styles.checkIcon} tintColor={Colors.DarkGrey} />
                            </Pressable>
                        </View>
                        <InputWithLabels
                            showLabelCB={true}
                            image={require('../../../assets/icons/screens/mail.png')}
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

                        <View style={styles.buttonCont}>{isValidRequest ? <ActiveButton title="Confirm" onPress={onPressFiled} /> : <DisableButtonDark title="Confirm" />}</View>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.viewTitleHeading}>
                            <Text style={styles.headingText}>Enable Account</Text>
                            <Pressable onPress={onRequestClose}>
                                <FastImage source={require('../../../assets/icons/screens/cancel_b.png')} style={styles.checkIcon} tintColor={Colors.DarkGrey} />
                            </Pressable>
                        </View>
                        <Text style={styles.headingTextDeatil}>Please enable your account to continue</Text>
                        <View style={styles.buttonContaoner}>
                            <ActiveButton title={'Close'} onPress={() => closeModal()} style={styles.button} textStyle={styles.buttonText} />
                            <ActiveButton title={'Enable'} onPress={() => closeModalNo()} style={styles.buttonE} />
                        </View>
                    </View>
                )}
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    bottomView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('100%'),
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    container: {
        backgroundColor: Colors.White,
        width: wp('92%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        paddingVertical: hp('2')
    },
    viewTitleHeading: {
        width: wp('78%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    buttonContaoner: {
        width: wp('84%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonCont: {
        marginTop: hp('4%')
    },
    modalView: {
        backgroundColor: Colors.LightCream_40,
        width: wp('92%'),
        borderRadius: wp('2%')
    },
    checkIcon: {
        width: wp('4%'),
        height: wp('4%')
    },
    headingText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        alignSelf: 'center',
        textAlign: 'center'
    },
    headingTextDetail: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        alignSelf: 'center',
        textAlign: 'center'
    },
    headingTextDeatil: {
        width: wp('88%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        paddingTop: hp('1%'),
        marginBottom: hp('2%')
    },
    subHeading: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: hp('1%'),
        width: wp('86%')
    },
    wrapper: {
        flexDirection: 'row',
        width: wp('86%'),
        height: hp('7%'),
        borderWidth: 1.5,
        backgroundColor: Colors.LightCream_60,
        borderColor: Colors.LightCream_60,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: hp('1%')
    },
    okText: {
        width: wp('74%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },

    rightIcon: {
        width: wp('7%'),
        height: wp('7%')
    },
    button: {
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        width: wp('35%'),
        marginTop: hp('1%'),
        shadowOpacity: 0,
        borderWidth: wp('0.3')
    },
    buttonE: {
        backgroundColor: Colors.MainThemeColor,
        borderColor: Colors.BorderGrey,
        width: wp('35%'),
        marginTop: hp('1%'),
        shadowOpacity: 0,
        borderWidth: wp('0.3')
    },
    buttonText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_15,
        fontFamily: Typography.FONT_FAMILY_BOLD
    }
})
export default ConfermModal
