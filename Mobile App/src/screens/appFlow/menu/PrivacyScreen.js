import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import ToggelButton from '../../../components/components/common/ToggleButton'
import {getHeaders, separatorHeight} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import ActiveButton from '../../../components/components/common/ActiveButton'
import Loader from '../../../components/components/common/Spinner'

const PrivacyScreen = ({navigation}) => {
    const {userData, linkingUrl} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [isOnEmail, setIsOnEmail] = useState(false)
    const [isPhoneNo, setIsPhoneNo] = useState(false)
    const [isBod, setIsBod] = useState(false)
    const [onlyDM, setOnlyDM] = useState(false)
    const [dayMoYear, setdayMoYear] = useState(false)
    const [islocation, setIsLOcation] = useState(false)
    const isFocused = useIsFocused()

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
                .get(`user/get_user_privacy_setting`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        response.data.data ? (setIsPhoneNo(response.data.data.display_phone), setIsOnEmail(response.data.data.display_email), setIsBod(response.data.data.display_dob), setIsLOcation(response.data.data.display_location), setdayMoYear(response.data.data.display_dob_full_format), setOnlyDM(response.data.data.display_dob_full_format ? false : true)) : null
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
            display_phone: isPhoneNo,
            display_email: isOnEmail,
            display_dob: isBod,
            display_location: islocation,
            display_dob_full_format: dayMoYear
        }
        try {
            await axios
                .post('user/privacy_setting', data, headers)
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
        setIsOnEmail(newIsOn)
    }
    const handleTogglePhoneNumber = (newIsOn) => {
        setIsPhoneNo(newIsOn)
    }
    const handleToggleBOD = (newIsOn) => {
        setIsBod(newIsOn)
    }
    const handleToggleLocation = (newIsOn) => {
        setIsLOcation(newIsOn)
    }
    const handleOnlyDM = (newIsOn) => {
        setOnlyDM(newIsOn)
        setdayMoYear(!newIsOn)
    }
    const handleDayMoYear = (newIsOn) => {
        setOnlyDM(!newIsOn)
        setdayMoYear(newIsOn)
    }
    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title={'Privacy'} />

            <View style={styles.notification}>
                <ToggelButton text={'Display my phone no.'} isOn={isPhoneNo} handleToggle={handleTogglePhoneNumber} />

                <ToggelButton text={'Display my location'} isOn={islocation} handleToggle={handleToggleLocation} />
                <ToggelButton text={'Display my email address'} isOn={isOnEmail} handleToggle={handleToggleEmail} />
                <ToggelButton text={'Display my birthday'} isOn={isBod} handleToggle={handleToggleBOD} />
                {isBod && (
                    <>
                        <ToggelButton text={'DOB, Only day & month'} isOn={onlyDM} handleToggle={handleOnlyDM} />
                        <ToggelButton text={'DOB, day, month & year'} isOn={dayMoYear} handleToggle={handleDayMoYear} />
                    </>
                )}
            </View>

            <View style={styles.activeContainer}>
                <ActiveButton title="Save" onPress={() => updateSettings()} />
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
    notification: {
        alignSelf: 'center'
    },

    activeContainer: {
        width: wp('100'),
        alignItems: 'center',
        marginTop: hp('2%')
    }
})

export default PrivacyScreen
