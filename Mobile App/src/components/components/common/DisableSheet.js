import React, {useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ActiveButton from './ActiveButton'
import InputWithLabels from './InputWithLabels'
import ValidateInput from '../../../utils/ValidateInput'
const DisableSheet = ({setRef, title, description, height, continueTitle, deleteAccountC, confermDelete, skipTitle, deleteAccount, temporaryDisable, continueTitleE, skipButtonCB, onCloseCB}) => {
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [errorTextPassword, setErrorTextPassword] = useState(null)

    const [reason, setReason] = useState('')
    const [reasonError, setReasonError] = useState(false)
    const [focusReason, setFocusReason] = useState(false)
    const [errorTextReason, setErrorTextReason] = useState(null)
    const [isValidRequest, setIsValidRequest] = useState(false)

    const submitProductName = () => {
        const error = ValidateInput('reason', reason)
        setErrorTextReason(error ? error : null)
        setReasonError(error ? true : false)
        setFocusReason(false)
        checkIsValidRequest(reason, password)
        if (!error) {
            setFocusPassword(true)
        }
    }

    const submitPassword = () => {
        const error = ValidateInput('password', password)
        setPasswordError(error ? true : false)
        setErrorTextPassword(error ? error : null)
        setFocusPassword(false)
        checkIsValidRequest(reason, password)
    }
    const onChangePassword = async (text) => {
        setPassword(text)
    }

    const onPasswordFocus = () => setFocusPassword(true)

    const resetAllFocus = () => {
        setFocusReason(false)
        setFocusPassword(false)
    }
    const checkIsValidRequest = (reason, password) => {
        if (!ValidateInput('reason', reason) && !ValidateInput('password', password)) {
            setIsValidRequest(true)
            setErrorTextReason(null)
            setReasonError(false)
            setFocusReason(false)
            setErrorTextPassword(null)
            setPasswordError(false)
            setFocusPassword(false)
            return true
        } else {
            reason == '' ? (setErrorTextReason('Reason is required'), setReasonError(true), setFocusReason(false)) : (setErrorTextReason(null), setReasonError(false), setFocusReason(false))
            password == '' ? (setErrorTextPassword('Password is required'), setPasswordError(true), setFocusPassword(false)) : (setErrorTextPassword(null), setPasswordError(false), setFocusPassword(false))
            return false
        }
    }
    return (
        <RBSheet
            ref={setRef}
            height={height}
            closeOnDragDown={true}
            closeOnPressMask={true}
            closeDuration={100}
            openDuration={100}
            onClose={onCloseCB}
            customStyles={{
                mask: {
                    backgroundColor: Colors.DarkPepper_80
                },
                draggableIcon: {
                    backgroundColor: Colors.DarkPepper_80
                },
                container: {
                    backgroundColor: Colors.White
                }
            }}>
            <>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                {confermDelete ? (
                    <View style={styles.inputViewCont}>
                        <InputWithLabels
                            showLabelCB={true}
                            value={reason}
                            showAstaric
                            placeholderInner={'What is the reason  deleting the account?'}
                            showPlaceHolder={true}
                            placeholderC={'Reason'}
                            isError={reasonError}
                            isFocus={focusReason}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusReason(true)
                            }}
                            onBlur={submitProductName}
                            errorText={errorTextReason}
                            onChangeText={(text) => setReason(text.trimStart())}
                        />
                    </View>
                ) : null}

                <View style={styles.nextButton}>
                    <View style={styles.nextButtonInner}>
                        <ActiveButton
                            title={continueTitle}
                            onPress={() => {
                                temporaryDisable()
                            }}
                            style={{backgroundColor: Colors.OrangeColor, shadowColor: Colors.OrangeColor, width: wp('45%')}}
                            textStyle={{fontSize: Typography.FONT_SIZE_16}}
                        />
                        <ActiveButton
                            title={continueTitleE}
                            onPress={() => {
                                confermDelete ? deleteAccountC(reason) : deleteAccount()
                            }}
                            style={{backgroundColor: Colors.OrangeColor, shadowColor: Colors.OrangeColor, width: wp('45%')}}
                            textStyle={{fontSize: Typography.FONT_SIZE_16}}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => {
                        skipButtonCB()
                    }}
                    activeOpacity={0.8}>
                    <Text style={styles.skipText}>{skipTitle}</Text>
                </TouchableOpacity>
            </>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    title: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        alignSelf: 'center',
        width: wp('92%'),
        textAlign: 'center'
    },
    description: {
        width: wp('92%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginTop: hp('1%'),
        marginBottom: hp('2%'),
        alignSelf: 'center',
        color: Colors.Description
    },
    nextButton: {
        width: wp('100%'),
        marginTop: hp('1%'),
        alignItems: 'center'
    },
    nextButtonInner: {
        width: wp('92%'),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    skipButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('3%'),
        height: hp('5%'),
        borderWidth: wp(0.2),
        borderColor: Colors.DarkGrey,
        width: wp('88'),
        borderRadius: wp('8'),
        alignSelf: 'center'
    },
    skipText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    inputViewCont: {
        width: wp('100%'),
        alignItems: 'center',
        marginBottom: hp('3%')
    }
})

export default DisableSheet
