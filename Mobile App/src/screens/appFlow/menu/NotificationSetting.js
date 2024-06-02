import React, {useState, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import ToggelButton from '../../../components/components/common/ToggleButton'
import {getHeaders, separatorHeight} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import ActiveButton from '../../../components/components/common/ActiveButton'
import Loader from '../../../components/components/common/Spinner'

const NotificationSetting = ({navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [promo, setPromo] = useState(false)
    const [emailNotification, setEmailNotification] = useState(false)
    // const [smsNotification, setSmsNotification] = useState(false)
    const [messageReceived, setMessageReceived] = useState(false)
    const [twoFactor, setTwoFactor] = useState(false)
    const isFocused = useIsFocused()

    // setSmsNotification(response.data.data.data.sms_notification)

    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                await getNotificatcion()
            }
            func()
        }
    }, [isFocused])

    const getNotificatcion = async () => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .get(`user/get_notification_setting`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        response.data.data.data ? (setPromo(response.data.data.data.promotional_offers), setEmailNotification(response.data.data.data.email_notification), setMessageReceived(response.data.data.data.recieve_msg), setTwoFactor(response.data.data.data.two_fector_auth)) : null
                        setLoading(false)
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

    const updateSettings = async (item) => {
        setLoading(true)
        const headers = getHeaders(userData.auth_token)
        const data = {
            email_notification: emailNotification,
            recieve_msg: messageReceived,
            promotional_offers: promo,
            two_fector_auth: twoFactor
        }
        try {
            await axios
                .post('user/notification_setting', data, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setLoading(false)
                        navigation.goBack()
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

    const handleToggleEmail = (newIsOn) => {
        setPromo(newIsOn)
    }
    const handleToggleAllow = (newIsOn) => {
        setEmailNotification(newIsOn)
    }
    // const handleToggleSms = (newIsOn) => {
    //     setSmsNotification(newIsOn)
    // }
    const handleToggleMsg = (newIsOn) => {
        setMessageReceived(newIsOn)
    }
    const handleToggleFactor = (newIsOn) => {
        setTwoFactor(newIsOn)
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title={'Settings'} />
            <View style={{flex: 1}}>
                <View style={styles.backgroundContainer}>
                    <View style={styles.notification}>
                        <ToggelButton text={'Allow promotional offers'} isOn={promo} handleToggle={handleToggleEmail} />
                        {separatorHeight()}
                        <ToggelButton text={'Email Notifications'} isOn={emailNotification} handleToggle={handleToggleAllow} />
                        {separatorHeight()}
                        {/* <ToggelButton text={'Receive SMS Notification'} isOn={smsNotification} handleToggle={handleToggleSms} /> */}
                        {/* {separatorHeight()} */}
                        <ToggelButton text={'Receive messages'} isOn={messageReceived} handleToggle={handleToggleMsg} />
                        {separatorHeight()}
                        <ToggelButton text={'Two factor Authentication'} isOn={twoFactor} handleToggle={handleToggleFactor} />
                    </View>
                </View>
                <View style={styles.activeContainer}>
                    <ActiveButton title="Save" onPress={() => updateSettings()} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        flex: 1,
        backgroundColor: Colors.White
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('5%'),
        backgroundColor: Colors.White
    },
    notification: {
        alignSelf: 'center'
    },
    activeContainer: {
        marginTop: hp('2'),
        width: wp('100'),
        alignItems: 'center'
    }
})

export default NotificationSetting
