import React, {useState} from 'react'
import {StyleSheet, View, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useSelector} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import {confirmPasswordErrorText} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import Loader from '../../../components/components/common/Spinner'
import ValidateInput from '../../../utils/ValidateInput'
import ActiveButton from '../../../components/components/common/ActiveButton'
import {separatorHeight, getHeaders} from '../../../utils/helpers'
import DisableButton from '../../../components/components/common/DisableButton'

const ChangePasswordScreen = ({navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [password, setPassword] = useState('')
    const [passwordC, setPasswordC] = useState('')
    const [passwordP, setPasswordP] = useState('')

    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorC, setPasswordErrorC] = useState(false)
    const [passwordErrorP, setPasswordErrorp] = useState(false)

    const [focusPassword, setFocusPassword] = useState(false)
    const [focusPasswordC, setFocusPasswordC] = useState(false)
    const [focusPasswordP, setFocusPasswordP] = useState(false)

    const [errorTextPassword, setErrorTextPassword] = useState(null)
    const [errorTextPasswordC, setErrorTextPasswordC] = useState(null)
    const [errorTextPasswordP, setErrorTextPasswordP] = useState(null)

    const [isValidRequest, setIsValidRequest] = useState(false)
    const [loading, setLoading] = useState(false)

    const onPasswordFocus = () => {
        setFocusPassword(true)
    }

    const onPasswordFocusP = () => {
        setFocusPasswordP(true)
    }

    const onChangePassword = async (text) => {
        setPassword(text)
        checkIsValidRequest(text, passwordC)
    }

    const onChangePasswordC = async (text) => {
        setPasswordC(text)
        checkIsValidRequest(password, text)
    }

    const onChangePasswordP = async (text) => (setPasswordP(text), checkIsValidRequest(password, passwordC))

    const resetAllFocus = () => {
        setFocusPassword(false)
        setFocusPasswordC(false)
        setFocusPasswordP(false)
    }
    const submitPasswordP = () => {
        const error = ValidateInput('password', passwordP)
        setPasswordErrorp(error ? true : false)
        setErrorTextPasswordP(error ? error : null)
        setFocusPasswordP(false)
        checkIsValidRequest(password, passwordC)
    }

    const submitPassword = () => {
        const error = ValidateInput('password', password)
        setPasswordError(error ? true : false)
        setErrorTextPassword(error ? error : null)
        setFocusPassword(false)
        checkIsValidRequest(password, passwordC)
    }
    const submitPasswordC = () => {
        if (passwordC.length >= 8) {
            const error = ValidateInput('password', passwordC)
            if (passwordC == password) {
                setErrorTextPasswordC(error ? error : null)
                setPasswordErrorC(error ? true : false)
                setFocusPasswordC(false)
                setErrorTextPassword(null)
                setPasswordError(false)
                setFocusPassword(false)
                checkIsValidRequest(password, passwordC)
            } else {
                setErrorTextPasswordC(confirmPasswordErrorText)
                setPasswordErrorC(true)
                setFocusPasswordC(false)
                setIsValidRequest(false)
            }
        } else {
            setErrorTextPasswordC(confirmPasswordErrorText)
            setPasswordErrorC(true)
            setFocusPasswordC(false)
            setIsValidRequest(false)
        }
    }

    const checkIsValidRequest = (password, passwordC) => {
        if (!ValidateInput('passwordP', passwordP) && password !== '' && passwordC !== '' && password === passwordC) {
            setIsValidRequest(true)
            setErrorTextPassword(null)
            setErrorTextPasswordC(null)
            setPasswordError(false)
            setPasswordErrorC(false)
            return true
        } else {
            setIsValidRequest(false)
            return false
        }
    }

    const changePasswardApi = async () => {
        const headers = getHeaders(userData.auth_token)
        const data = {
            previousPassword: passwordP,
            newPassword: password
        }
        setLoading(true)
        try {
            await axios
                .post('user/update_user_password', data, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setLoading(false)
                        ShowAlert({type: 'success', description: response.data.message})
                        navigation.navigate('ProfileDetail')
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

    return (
        <View style={styles.body}>
            <Header back={true} backCB={() => navigation.goBack()} title={'Change Password'} />
            <Loader visible={loading} />
            <View style={styles.toopWrapper}>
                <InputWithLabels
                    showLabelCB={true}
                    value={passwordP}
                    placeholder="Current Password"
                    showPlaceHolder={true}
                    placeholderInner={'Current Password'}
                    isError={passwordErrorP}
                    isFocus={focusPasswordP}
                    onFocus={() => {
                        resetAllFocus()
                        onPasswordFocusP()
                    }}
                    onBlur={() => submitPasswordP()}
                    errorText={errorTextPasswordP}
                    onChangeText={(text) => {
                        onChangePasswordP(text.trimStart())
                    }}
                    type={true}
                    icon={true}
                    style={styles.inputStyle}
                    lableStyle={styles.lables}
                />

                <InputWithLabels
                    showLabelCB={true}
                    value={password}
                    placeholder="New Password"
                    showPlaceHolder={true}
                    placeholderInner={'New Password'}
                    isError={passwordError}
                    isFocus={focusPassword}
                    onFocus={() => {
                        resetAllFocus()
                        onPasswordFocus()
                    }}
                    onBlur={() => submitPassword()}
                    errorText={errorTextPassword}
                    onChangeText={(text) => {
                        onChangePassword(text.trimStart())
                    }}
                    type={true}
                    icon={true}
                    style={styles.inputStyle}
                    lableStyle={styles.lables}
                />

                <InputWithLabels
                    showLabelCB={true}
                    value={passwordC}
                    placeholder="Confirm Password"
                    showPlaceHolder={true}
                    placeholderInner={'Confirm Password'}
                    isError={passwordErrorC}
                    isFocus={focusPasswordC}
                    onFocus={() => {
                        resetAllFocus()
                        setFocusPasswordC(true)
                    }}
                    onBlur={() => submitPasswordC()}
                    errorText={errorTextPasswordC}
                    onChangeText={(text) => {
                        onChangePasswordC(text.trimStart())
                    }}
                    type={true}
                    icon={true}
                    style={styles.inputStyle}
                    lableStyle={styles.lables}
                />
            </View>
            <View style={styles.buttonContainer}>{isValidRequest ? <ActiveButton onPress={() => changePasswardApi()} title="Save Changes" /> : <DisableButton title="Save Changes" />}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        flex: 1
    },

    toopWrapper: {
        alignItems: 'center',
        marginTop: hp('3%')
    },
    buttonContainer: {
        width: wp('100'),
        alignItems: 'center',
        marginTop: hp('2%')
    },
    inputStyle: {
        backgroundColor: Colors.White
    },
    lables: {
        marginTop: hp('2%')
    }
})

export default ChangePasswordScreen
