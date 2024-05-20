import {View, StyleSheet, Platform} from 'react-native'
import React, {useState, useEffect} from 'react'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import ActiveButton from '../../../components/components/common/ActiveButton'
import * as Typography from '../../../constants/typography'
import * as Colors from '../../../constants/colors'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import Header from '../../../components/components/common/Header'
import ValidateInput from '../../../utils/ValidateInput'
import {separatorHeight} from '../../../utils/helpers'

const AddCardPaymentScreen = (props) => {
    const [errorTextExpiry, setErrorTextExpiry] = useState(null)

    const [cardNumber, setCardNumber] = useState('')
    const [cardNumberFocus, setCardNumberFocus] = useState(false)
    const [cardHolder, setCardHolder] = useState('')
    const [cardHolderFocus, setCardHolderFocus] = useState(false)
    const [cardCcv, setCardCcv] = useState('')
    const [cardCcvFocus, setCardCcvFocus] = useState(false)
    const [expiryMonthYear, setExpiryMonthYear] = useState('')
    const [focusExpiry, setFocusExpiry] = useState(false)
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
    const submitExpiry = () => {
        resetAllFocus()
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
        // onUpdateState(name, cardNumber);
    }

    const resetAllFocus = () => {
        setCardNumberFocus(false)
        setCardHolderFocus(false)
        setCardCcvFocus(false)
        setFocusExpiry(false)
    }
    const onChangeExpiry = (text) => {
        setExpiryMonthYear(text)
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

    const backHandler = () => {
        props.navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Header back={true} backCB={backHandler} title={'Add Card'} />
            <View style={styles.outsideContainer}>
                <View style={styles.backgroundContainer}>
                    {separatorHeight()}
                    <InputWithLabels
                        placeholder={'Card No'}
                        isFocus={cardNumberFocus}
                        isError={false}
                        showLabelCB={true}
                        showPlaceHolder={true}
                        placeholderInner={'Enter card no.'}
                        value={cardNumber}
                        onBlur={() => resetAllFocus()}
                        onChangeText={(val) => {
                            onCardNumberChange(val)
                        }}
                        onFocus={() => onFocusCardNumber()}
                        keyboardType="number-pad"
                        maxLength={19}
                        minLength={14}
                        style={styles.inputStyle}
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
                        style={styles.inputStyle}
                    />
                    <InputWithLabels
                        placeholderC={'CCV'}
                        isFocus={cardCcvFocus}
                        showPlaceHolder={true}
                        placeholderInner={'Enter ccv'}
                        isError={false}
                        showLabelCB={true}
                        value={cardCcv}
                        onBlur={() => {
                            resetAllFocus()
                        }}
                        onChangeText={setCardCcv}
                        keyboardType="number-pad"
                        onFocus={() => onFocusCardCcv()}
                        maxLength={3}
                        minLength={3}
                        style={styles.inputStyle}
                    />
                    <InputWithLabels
                        placeholderC={'Expiry (MM/YY)'}
                        showPlaceHolder={true}
                        placeholderInner={'Enter expiry'}
                        isFocus={focusExpiry}
                        isError={errorTextExpiry}
                        showLabelCB={true}
                        value={expiryMonthYear}
                        onBlur={() => {
                            submitExpiry()
                        }}
                        onChangeText={onChangeExpiry}
                        onFocus={() => onFocusExpiry()}
                        maxLength={5}
                        style={styles.inputStyle}
                    />
                </View>
                {cardNumber.length >= 14 && expiryMonthYear && cardHolder && cardCcv.length > 2 ? <ActiveButton title={'Add card'} onPress={() => {}} /> : <ActiveButton title={'Add card'} onPress={() => {}} />}
            </View>
            {separatorHeight()}
            {separatorHeight()}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        flex: 1
    },
    outsideContainer: {
        width: wp('100%'),
        flex: 1,
        alignItems: 'center'
    },

    addCard: {
        width: wp('86%'),
        alignItems: 'flex-end'
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('3%'),
        backgroundColor: Colors.White
    },
    inputStyle: {
        width: wp('86%'),
        backgroundColor: Colors.White
    }
})

export default AddCardPaymentScreen
