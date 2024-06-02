import React, {useEffect, useState, useRef} from 'react'
import {FlatList, Platform, StyleSheet, Text, View, Switch} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import ToggleSwitch from 'toggle-switch-react-native'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import {useNavigation} from '@react-navigation/native'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import FeedCard from '../../../components/components/common/FeedCard'
import Header from '../../../components/components/common/Header'
import Loader from '../../../components/components/common/Spinner'
import {storeCartData} from '../../../services/store/actions'
import ShowAlert from '../../../components/components/common/ShowAlert'
import TabViews from '../../../components/components/common/TabViews'
import SaleData from '../../../components/components/common/SaleData'
import {separatorHeight, separatorHeightH} from '../../../utils/helpers'
import ActiveButton from '../../../components/components/common/ActiveButton'
import DisableButton from '../../../components/components/common/DisableButton'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import ValidateInput from '../../../utils/ValidateInput'

const TradeDetailInfo = (props) => {
    const [contact, setContact] = useState('')
    const [discription, setDiscription] = useState('')

    const [focusContact, setFocusContact] = useState(false)
    const [focusDiscription, setFocusDiscription] = useState(false)

    const [contactError, setContactError] = useState(false)
    const [discriptionError, setDiscriptionError] = useState(false)

    const [errorTextContact, setErrorTextContact] = useState(null)
    const [errorTextDiscription, setErrorTextDiscription] = useState(null)

    const [isValidRequest, setIsValidRequest] = useState(false)

    const onChangeContact = (text) => {
        let reg = new RegExp(`^[.0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setContact(text)
            }
        } else {
            setContact(text)
        }
    }

    const submitContactNumber = () => {
        const error = ValidateInput('contact', contact)
        setErrorTextContact(error ? error : null)
        setContactError(error ? true : false)
        setFocusContact(false)
        // checkIsValidRequest(contact)
        // if (!error && !isValidRequest) {
        //     setFocusEmail(true)
        // }
    }
    const submitDiscription = () => {
        const error = ValidateInput('discription', discription)
        setErrorTextDiscription(error ? error : null)
        setDiscriptionError(error ? true : false)
        setFocusDiscription(false)
        // checkIsValidRequest(discription)
        // if (!error && !isValidRequest) {
        //     setFocusDiscription(true)
        // }
    }

    const resetAllFocus = () => {
        setFocusContact(false)
        setFocusDiscription(false)
    }
    return (
        <View style={styles.body}>
            <View style={styles.heightContainer}>
                <View style={styles.backgroundContainer}>
                    <Text style={styles.tardeTitle}>{props.route.title == 'Contact Trader' ? `Let's swap products` : 'Get your Donation'}</Text>
                    {separatorHeight()}
                    {separatorHeight()}
                    <InputWithLabels
                        textError={styles.errorText}
                        showLabelCB={true}
                        value={contact}
                        placeholder="Contact number"
                        keyboardType={'decimal-pad'}
                        secure={false}
                        isError={contactError}
                        onBlur={submitContactNumber}
                        isFocus={focusContact}
                        onFocus={() => {
                            resetAllFocus()
                            setFocusContact(true)
                        }}
                        errorText={errorTextContact}
                        onChangeText={(text) => onChangeContact(text)}
                    />

                    <InputWithLabels
                        showLabelCB={true}
                        value={discription}
                        placeholder="Description"
                        isError={discriptionError}
                        isFocus={focusDiscription}
                        onFocus={() => {
                            resetAllFocus()
                            setFocusDiscription(true)
                        }}
                        onBlur={submitDiscription}
                        errorText={errorTextDiscription}
                        onChangeText={(text) => setDiscription(text.trimStart())}
                        multiline={true}
                        maxHeight={110}
                        minHeight={100}
                    />
                </View>
            </View>
            {isValidRequest ? <ActiveButton title={'Send'} onPress={postHandler} /> : <DisableButton title={'Send'} />}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.White,
        width: wp('100%'),
        height: hp('100%'),
        alignItems: 'center'
    },
    heightContainer: {
        width: wp('100%'),
        height: Platform.OS == 'android' ? hp('78') : hp('70')
    },
    tardeTitle: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    backgroundContainer: {
        width: wp('92%'),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        backgroundColor: Colors.White,
        borderRadius: wp('4%'),
        paddingVertical: hp('1%'),
        marginTop: hp('1%')
    }
})

export default TradeDetailInfo
