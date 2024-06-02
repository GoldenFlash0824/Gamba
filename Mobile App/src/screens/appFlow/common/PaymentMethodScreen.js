import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native'
import React, {useState, useEffect} from 'react'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {CardField, useStripe, createToken, CardForm} from '@stripe/stripe-react-native'
import {connect, useDispatch, useSelector} from 'react-redux'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'
import axios from 'axios'

import ActiveButton from '../../../components/components/common/ActiveButton'
import * as Typography from '../../../constants/typography'
import * as Colors from '../../../constants/colors'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import RadioButton from '../../../components/components/common/RadioButton'
import Header from '../../../components/components/common/Header'
import ValidateInput, {ValidateEmail} from '../../../utils/ValidateInput'
import {getHeaders, separatorHeight} from '../../../utils/helpers'
import SuccessModal from '../../../components/components/common/SuccessModal'
import ShowAlert from '../../../components/components/common/ShowAlert'
import Loader from '../../../components/components/common/Spinner'
import DisableButton from '../../../components/components/common/DisableButton'
import {emptyCartData} from '../../../services/store/actions'

const PaymentMethodScreen = ({route, navigation}) => {
    const {userData, cartData} = useSelector((state) => state.user)
    const paramsData = route.params ? route.params : null

    const [cashOnDelivery, setCashOnDelivery] = useState(true)
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const [fullNameError, setFullNameError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [addressError, setAddressError] = useState(false)

    const [focusFullName, setFocusFullName] = useState(false)
    const [focusPhone, setFocusPhone] = useState(false)
    const [focusEmail, setFocusEmail] = useState(false)
    const [focusAddress, setFocusAddress] = useState(false)

    const [errorTextFullName, setErrorTextFullName] = useState(null)
    const [errorTextPhone, setErrorTextPhone] = useState(null)
    const [errorTextEmail, setErrorTextEmail] = useState(null)
    const [errorTextAddress, setErrorTextAddress] = useState(null)
    const [errorTextExpiry, setErrorTextExpiry] = useState(null)

    const [debitCard, setDebitCard] = useState(false)
    const [cardNumber, setCardNumber] = useState('')
    const [cardNumberFocus, setCardNumberFocus] = useState(false)
    const [cardHolder, setCardHolder] = useState('')
    const [cardHolderFocus, setCardHolderFocus] = useState(false)
    const [cardCcv, setCardCcv] = useState('')
    const [cardCcvFocus, setCardCcvFocus] = useState(false)
    const [expiryMonthYear, setExpiryMonthYear] = useState('')
    const [focusExpiry, setFocusExpiry] = useState(false)
    const [expiryYear, setExpiryYear] = useState('')

    const [cardDetail, setCardDetail] = useState(null)
    const dispatch = useDispatch()

    const [isValidRequest, setIsValidRequest] = useState(false)

    useEffect(() => {}, [])
    const onFocusCardNumber = () => {
        resetAllFocus()
        setCardNumberFocus(true)
    }

    const onFocusCardHolder = () => {
        resetAllFocus()
        setCardHolderFocus(true)
    }

    const onFocusCardCcv = () => {
        resetAllFocus()
        setCardCcvFocus(true)
    }
    const onFocusExpiry = () => {
        resetAllFocus()
        setFocusExpiry(true)
    }
    const submitFulName = () => {
        resetAllFocus()
        // const error = ValidateInput('fullName', fullName)
        // setErrorTextFullName(error ? error : null)
        // setFullNameError(error ? true : false)
        // setFocusFullName(false)
        // checkIsValidRequest()
        // if (!error && !isValidRequest) {
        //     setFocusEmail(true)
        // }
    }

    const submitPhone = () => {
        resetAllFocus()
        // if (phone.length > 11 && phone.length < 13) {
        //     const error = ValidateInput('phone', phone)
        //     setErrorTextPhone(error ? error : null)
        //     setPhoneError(error ? true : false)
        //     setFocusPhone(false)
        //     checkIsValidRequest()
        // } else {
        //     setErrorTextPhone(phoneTextError)
        //     setPhoneError(true)
        //     setFocusPhone(false)
        //     setIsValidRequest(false)
        // }
    }
    const submitExpiry = () => {
        resetAllFocus()
        // const error = ValidateInput('expiry', expiryMonthYear)
        // setErrorTextExpiry(error ? error : null)
        // setPhoneError(error ? true : false)
        // setFocusPhone(false)
        // checkIsValidRequest()
    }

    const submitEmail = () => {
        resetAllFocus()
        // const error = ValidateEmail(email)
        // setErrorTextEmail(error ? 'Valid email is required' : null)
        // setEmailError(error ? true : false)
        // setFocusEmail(false)
        // checkIsValidRequest()
        // if (!error && !isValidRequest) {
        //     setFocusPhone(true)
        // }
    }
    const submitAddress = () => {
        resetAllFocus()

        // const error = ValidateInput('city', address)
        // setErrorTextAddress(error ? error : null)
        // setAddressError(error ? true : false)
        // setFocusAddress(false)
        // checkIsValidRequest()
    }

    const doUpdate = async () => {
        const result = cartData?.some((res) => !res?.user?.stripe_account_verified)
        result ? doError() : debitHanadler()
    }
    const doError = async () => {
        let showUser = []
        let showText = `It seems that seller accepts only cash. Please contact seller for further information.`
        for (let i = 0; i < cartData.length; i++) {
            cartData[i].user.stripe_account_verified ? null : showUser.push(`\n` + cartData[i].user.first_name + ' ' + cartData[i].user.last_name)
        }
        let uniqueList = [...new Set(showUser)]
        ShowAlert({type: 'error', description: showText + uniqueList.join(',')})
    }
    const onSave = async () => {
        setLoading(true)
        const resToken = await createToken({...cardDetail, type: 'Card'})
        const headers = getHeaders(userData.auth_token)
        if (resToken?.token?.id) {
            const data = {products: paramsData._cartData, token: resToken.token, payment_method: 'debitOrCreditCard', total: paramsData.total, delivery_charges: 0, service_charges: 0}
            try {
                await axios
                    .post(`user/checkout/payment_stripe`, data, headers)
                    .then((response) => {
                        if (response.data.success === true) {
                            dispatch(emptyCartData())
                            setLoading(false)
                            setTimeout(() => setModalVisible(true), 200)
                        } else {
                            setLoading(false)
                            ShowAlert({type: 'error', description: 'Something went wrong. Please try again.'})
                        }
                    })
                    .catch((error) => {
                        ShowAlert({type: 'error', description: error.message})
                        console.error(error)
                    })
            } catch (e) {
                setLoading(false)
                ShowAlert({type: 'error', description: e.message})
            }
        } else {
            setLoading(false)
            ShowAlert({type: 'error', description: 'Something went wrong please try again'})
        }
    }
    const onCash = async () => {
        const headers = getHeaders(userData.auth_token)
        let cartD = {
            delivery_charges: 0,
            service_charges: 0,
            total: paramsData.total,
            products: paramsData._cartData
        }
        setLoading(true)
        try {
            await axios
                .post(`user/checkout/payment`, cartD, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        dispatch(emptyCartData())
                        setLoading(false)
                        setTimeout(() => {
                            setModalVisible(true)
                        }, 200)
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

    const changeEmail = (text) => {
        text = text.toLowerCase().trim()
        setEmail(text)
    }
    const changeCCV = (text) => {
        if (text.length > 0) {
            let reg = new RegExp(`^[0-9]{1,45}$`)
            if (reg.test(text)) {
                setCardCcv(text)
            }
        } else {
            setCardCcv(text)
        }
    }

    const onCardNumberChange = (value) => {
        let cardNumber = value
        value = value.replace(/\D/g, '')
        if (/^3[47]\d{0,13}$/.test(value)) {
            cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
            // diner's club, 14 digits
            cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        } else if (/^\d{0,16}$/.test(value)) {
            // regular cc number, 16 digits
            cardNumber = value
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
                .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        }
        setCardNumber(cardNumber.trimRight())
    }
    const cashHandler = () => {
        setCashOnDelivery(true)
        setDebitCard(false)
    }
    const debitHanadler = () => {
        setCashOnDelivery(false)
        setDebitCard(true)
    }

    const resetAllFocus = () => {
        setFocusFullName(false)
        setFocusPhone(false)
        setFocusEmail(false)
        setFocusAddress(false)
        setCardNumberFocus(false)
        setCardHolderFocus(false)
        setCardCcvFocus(false)
        setFocusExpiry(false)
    }

    const formatExpiry = (input) => {
        const formattedInput = input.replace(/\W/g, '').substring(0, 4)
        if (formattedInput.length > 2) {
            return `${formattedInput.slice(0, 2)}/${formattedInput.slice(2)}`
        } else {
            return formattedInput
        }
    }

    // Event handler when text changes in the input
    const onChangeExpiry = (text) => {
        setExpiryMonthYear(formatExpiry(text))
    }
    const checkIsValidRequest = () => {
        if (!ValidateInput('email', email) && !ValidateInput('fullName', fullName) && !ValidateInput('phone', phone) && ValidateInput('city', address)) {
            setIsValidRequest(true)
            return true
        } else {
            setIsValidRequest(false)
            return false
        }
    }
    const closeModalHandler = () => {
        setModalVisible(false)
        setTimeout(() => {
            navigation.navigate('HomeStack')
        }, 200)
    }

    const backHandler = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Loader visible={loading} />
            <Header back={true} backCB={backHandler} title={'Add Payment'} />

            <View style={styles.inputView}>
                <KeyboardAwareScrollView enableOnAndroid={true} showsVerticalScrollIndicator={false}>
                    {/* <View style={styles.backgroundContainer}>
                        <InputWithLabels
                            showLabelCB={true}
                            value={fullName}
                            placeholder="Name"
                            showPlaceHolder={true}
                            placeholderInner={'Enter name'}
                            isError={fullNameError}
                            isFocus={focusFullName}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusFullName(true)
                            }}
                            onBlur={() => submitFulName()}
                            errorText={errorTextFullName}
                            onChangeText={(text) => setFullName(text.trimStart())}
                            style={styles.inPutStyle}
                        />
                        <InputWithLabels
                            showLabelCB={true}
                            value={email}
                            placeholder="Email"
                            showPlaceHolder={true}
                            placeholderInner={'Enter email'}
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
                            style={styles.inPutStyle}
                        />
                        <InputWithLabels
                            showLabelCB={true}
                            value={phone}
                            showPlaceHolder={true}
                            placeholderInner={'Enter phone no.'}
                            placeholder="Phone Number"
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
                            onChangeText={(text) => changeCCV(text)}
                            style={styles.inPutStyle}
                        />
                        <InputWithLabels
                            showLabelCB={true}
                            value={address}
                            placeholder="Address"
                            showPlaceHolder={true}
                            placeholderInner={'Enter your address'}
                            secure={false}
                            isError={addressError}
                            onBlur={() => submitAddress()}
                            isFocus={focusAddress}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusAddress(true)
                            }}
                            errorText={errorTextAddress}
                            onChangeText={(text) => setAddress(text)}
                            style={styles.inPutStyle}
                        />
                    </View> */}
                    <RadioButton text={'Cash on Delivery'} selected={cashOnDelivery} onSelect={cashHandler} />
                    <RadioButton text={'Debit / Credit card'} selected={debitCard} onSelect={doUpdate} />

                    {debitCard && (
                        <View style={styles.backgroundContainer}>
                            {separatorHeight()}
                            {/* <InputWithLabels
                                    placeholder={'Card Number'}
                                    isFocus={cardNumberFocus}
                                    isError={false}
                                    showPlaceHolder={true}
                                    placeholderInner={'Enter card no.'}
                                    showLabelCB={true}
                                    value={cardNumber}
                                    onBlur={() => resetAllFocus()}
                                    onChangeText={(val) => {
                                        onCardNumberChange(val)
                                    }}
                                    onFocus={() => onFocusCardNumber()}
                                    keyboardType="number-pad"
                                    maxLength={19}
                                    minLength={14}
                                    style={styles.inPutStyle}
                                />
                                <InputWithLabels
                                    placeholder={'Card holder name'}
                                    isFocus={cardHolderFocus}
                                    showPlaceHolder={true}
                                    placeholderInner={'Enter name'}
                                    isError={false}
                                    showLabelCB={true}
                                    value={cardHolder}
                                    onBlur={() => {
                                        resetAllFocus()
                                    }}
                                    onChangeText={setCardHolder}
                                    onFocus={() => onFocusCardHolder()}
                                    style={styles.inPutStyle}
                                />
                                <InputWithLabels
                                    placeholderC={'CCV'}
                                    isFocus={cardCcvFocus}
                                    showPlaceHolder={true}
                                    placeholderInner={'Enter Ccv'}
                                    isError={false}
                                    showLabelCB={true}
                                    value={cardCcv}
                                    onBlur={() => {
                                        resetAllFocus()
                                    }}
                                    onChangeText={changeCCV}
                                    keyboardType="number-pad"
                                    onFocus={() => onFocusCardCcv()}
                                    maxLength={3}
                                    minLength={3}
                                    style={styles.inPutStyle}
                                />
                                <InputWithLabels
                                    placeholderC={'Expiry'}
                                    showPlaceHolder={true}
                                    placeholderInner={'Enter expiry(MM/YY)'}
                                    isFocus={focusExpiry}
                                    isError={errorTextExpiry}
                                    keyboardType="number-pad"
                                    showLabelCB={true}
                                    value={expiryMonthYear}
                                    onBlur={() => {
                                        submitExpiry()
                                    }}
                                    onChangeText={onChangeExpiry}
                                    onFocus={() => onFocusExpiry()}
                                    maxLength={5}
                                    style={styles.inPutStyle}
                                /> */}
                            <CardField
                                postalCodeEnabled={false}
                                placeholders={{
                                    number: '1212 1212 1212 1212'
                                }}
                                cardStyle={{
                                    backgroundColor: '#FFFFFF',
                                    textColor: '#000000',
                                    placeholderColor: '#B1A8A8'
                                }}
                                style={{
                                    width: '100%',
                                    height: 60,
                                    marginTop: hp(10)
                                }}
                                onCardChange={(cardDetails) => {
                                    cardDetails.complete ? setCardDetail(cardDetails) : setCardDetail(null)
                                }}
                                onFocus={(focusedField) => {
                                    // console.log('focusField', focusedField)
                                }}
                            />
                        </View>
                    )}
                </KeyboardAwareScrollView>
            </View>
            {/* {separatorHeight()} */}

            {/* {(cardNumber.length >= 14 && expiryMonthYear && cardHolder && cardCcv.length > 2) || paramsData ? <ActiveButton title={'Place Order'} onPress={() => onSave()} style={styles.button} /> : <DisableButton title={'Place Order'} style={styles.button} />} */}
            {cardDetail || cashOnDelivery ? <ActiveButton title={'Place Order'} onPress={() => (cashOnDelivery ? onCash() : onSave())} style={styles.button} /> : <DisableButton title={'Place Order'} style={styles.button} />}
            {modalVisible && <SuccessModal visible={modalVisible} callBack={closeModalHandler} />}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        height: hp('100%'),
        alignItems: 'center',
        flex: 1
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        borderRadius: wp('2%'),
        alignItems: 'center'
    },
    imageWraper: {
        width: wp('92%'),
        height: hp('20%'),
        marginBottom: hp('2%'),
        alignSelf: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: wp('3%')
    },
    inputView: {
        width: wp('100%'),
        flex: 1,
        alignItems: 'center'
    },
    inPutStyle: {
        width: wp('92'),
        backgroundColor: Colors.White
    },
    monthView: {
        width: wp('92%'),
        height: hp('7%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: hp('0.05%'),
        borderBottomColor: Colors.BorderColor,
        alignItems: 'center'
    },

    checkIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    bottomArea: {
        height: hp('15%')
    },
    button: {
        width: wp(92)
    }
})

export default PaymentMethodScreen
