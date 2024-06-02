import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import Styles from '../../constants/styles'
import * as Colors from '../../constants/colors'
import * as Typography from '../../constants/typography'
import Loader from '../../components/components/common/Spinner'
import ValidateInput from '../../utils/ValidateInput'
import DisableButtonDark from '../../components/components/common/DisableButtonDark'
import ActiveButton from '../../components/components/common/ActiveButton'
import Input from '../../components/components/common/Input'
import PasswordInput from '../../components/components/common/PasswordInput'

import ButtonWithIcon from '../../components/components/common/ButtonWithIcon'

const CreateAccountScreen = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const [focusEmail, setFocusEmail] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)

    const [errorTextEmail, setErrorTextEmail] = useState(null)
    const [errorTextPassword, setErrorTextPassword] = useState(null)

    const [isRemember, setIsRemember] = useState(false)
    const [isValidRequest, setIsValidRequest] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fcmToken, setFmcToken] = useState('')

    const onEmailFocus = () => {
        setFocusEmail(true)
    }

    const onPasswordFocus = () => {
        setFocusPassword(true)
    }

    const submitEmail = () => {
        const error = ValidateInput('email', email)
        setErrorTextEmail(error ? 'Valid email is required' : null)
        setEmailError(error ? true : false)
        setFocusEmail(false)
        checkIsValidRequest()
        if (!error && !isValidRequest) {
            setFocusPassword(true)
        }
    }

    const submitPassword = () => {
        const error = ValidateInput('password', password)
        setPasswordError(error ? true : false)
        setErrorTextPassword(error ? error : null)
        setFocusPassword(false)
        checkIsValidRequest()
    }

    const onChangeEmail = (text) => {
        text = text.toLowerCase().trim()
        setEmail(text)
    }

    const onChangePassword = (text) => {
        setPassword(text)
    }

    const checkIsValidRequest = () => {
        if (!ValidateInput('email', email) && !ValidateInput('password', password)) {
            setIsValidRequest(true)
        } else {
            setIsValidRequest(false)
        }
    }

    const doSignUp = async () => {
        props.navigation.navigate('codeScreen')
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: (Platform.OS === 'android' && focusEmail) || (Platform.OS === 'android' && focusPassword) ? hp('0%') : focusEmail || focusPassword ? hp('15%') : hp('0%')
                }}>
                <View style={styles.logoArea}>
                    {/* <FastImage
            source={require('../../assets/icons/screens/logo.png')}
            resizeMode="contain"
            style={Styles.logoImage}
          /> */}
                </View>
                <View style={styles.upperText}>
                    <Text style={[Styles.sectionTitle, {marginVertical: hp('2%')}]}>Create Your Account</Text>
                    <Input
                        image={require('../../assets/icons/screens/mail.png')}
                        value={email}
                        placeholder="Email"
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
                    />

                    <PasswordInput
                        value={password}
                        placeholder="Password"
                        isError={passwordError}
                        isFocus={focusPassword}
                        onFocus={() => onPasswordFocus()}
                        onBlur={() => submitPassword()}
                        errorText={errorTextPassword}
                        onChangeText={(text) => {
                            onChangePassword(text.trimStart())
                        }}
                    />
                    <View style={styles.rememberArea}>
                        <TouchableOpacity onPress={() => setIsRemember(!isRemember)} activeOpacity={0.8}>
                            {isRemember ? <FastImage source={require('../../assets/icons/screens/checked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.IconsColor} /> : <FastImage source={require('../../assets/icons/screens/unchecked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.IconsColor} />}
                        </TouchableOpacity>
                        <Text style={styles.remember}>Remember Me</Text>
                    </View>
                    <View style={styles.signUpButton}>{isValidRequest ? <ActiveButton title="Sign up" onPress={() => doSignUp()} /> : <DisableButtonDark title="Sign up" />}</View>
                </View>
                {/* <View style={styles.rowLine}>
                    <View style={styles.row} />
                    <Text style={styles.or}>or continue with</Text>
                    <View style={styles.row} />
                </View>
                <View style={styles.bottomButtonC}>
                    <ButtonWithIcon onPress={() => {}} showTitle={false} image={require('../../assets/icons/screens/facebook.png')} style={styles.button} />
                    <ButtonWithIcon onPress={() => {}} showTitle={false} image={require('../../assets/icons/screens/google.png')} style={styles.button} />
                    <ButtonWithIcon onPress={() => {}} showTitle={false} image={require('../../assets/icons/screens/apple.png')} style={styles.button} />
                </View> */}
                <View style={styles.bottomArea}>
                    <View style={styles.bottomText}>
                        <Text style={styles.alreadyAccount}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('loginScreen')} activeOpacity={0.8}>
                            <Text style={styles.signin}> Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: Colors.White,
        width: wp('100%'),
        height: hp('100%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoArea: {
        width: wp('100%'),
        height: hp('15%'),
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    upperText: {
        width: wp('90%'),
        // backgroundColor: 'red',
        // height: hp('60%'),
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    middleArea: {
        width: wp('100%'),
        height: hp('44%'),
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    rememberArea: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        width: wp('90%'),
        alignSelf: 'center'
    },
    rememberImage: {
        marginLeft: wp('3%'),
        marginRight: wp('1%'),
        width: wp('6%'),
        height: wp('6%')
    },
    remember: {
        color: Colors.Description,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    signUpButton: {
        marginTop: hp('3%')
    },
    forgot: {
        color: Colors.TextColorLimeGreen,
        fontWeight: Typography.FONT_WEIGHT_BOLD,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        marginTop: hp('2%')
    },
    rowLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('3%')
    },
    row: {
        width: wp('30%'),
        backgroundColor: Colors.BorderGrey,
        height: wp('0.5%'),
        margin: wp('3%'),
        marginBottom: 0
    },
    or: {
        marginTop: hp('1%'),
        color: Colors.HeadingTextColor
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
    bottomButtonC: {
        marginTop: hp('3%'),
        width: wp('96'),
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    alreadyAccount: {
        color: Colors.Description,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    signin: {
        color: Colors.TextColorLimeGreen,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default CreateAccountScreen
