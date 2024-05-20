import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {Platform, Linking, View} from 'react-native'
export const locationTextError = 'Valid address format is city, state, country'
export const phoneTextError = 'Valid phone number is required'
export const passwordTextError = 'Password must contains 8 letters or more!'
export const confirmPasswordErrorText = `Password must match`
export const GOOGLE_API = 'AIzaSyD31HOTkMlXjv1_qalpkNI-VHguHkb4ITA'
export const STRIPE_P_KEY = 'pk_test_51NJT6bFTGN1PiHJ87vlSPQTqOHC4E2yaM2i5QCFTSY4YDjssbvOXsNBqK2FRlz2YBW6inHFbJdLox4TXuSS7g2ZZ002n5O8Q9g'

export const openWebUrl = () => {
    Linking.openURL('---')
}

export const openPrivacy = () => {
    Linking.openURL('---')
}

export const openTerms = () => {
    Linking.openURL('=----')
}

export const getHeaders = (auth_token) => {
    return {
        headers: {
            authorization: `bearer ${auth_token}`
        }
    }
}

export const makeid = async () => {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (var i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export const separatorHeight = () => {
    return <View style={{height: hp('2%')}} />
}
export const separatorHeightH = () => {
    return <View style={{height: hp('1%')}} />
}

export const separatorWidth = () => {
    return <View style={{widht: wp('2%')}} />
}

export const setLocalUser = async (auth_token) => {
    try {
        await AsyncStorage.setItem('authToken', auth_token)
    } catch (error) {
        console.log('error', error.message)
    }
}

export const getLocalAuthToken = async () => {
    const login_token = await AsyncStorage.getItem('authToken')
    if (login_token !== null) {
        return {
            headers: {
                authorization: `bearer ${login_token}`
            }
        }
    } else {
        return false
    }
}

export const removeLocalUser = async () => {
    try {
        await AsyncStorage.removeItem('authToken')
    } catch (exception) {
        console.log(exception)
    }
}

const R = 6371 // Radius of the earth in miles
export const getDistanceFromLatLonInMiles = async (lat1, lon1, lat2, lon2) => {
    const dLat = deg2rad(lat1 - lat2)
    const dLon = deg2rad(lon1 - lon2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distanceInKm = R * c

    // Convert distance to miles
    const distanceInMiles = distanceInKm * 0.621371

    // Determine the appropriate unit (miles or feet) based on the magnitude
    const distance = distanceInMiles < 0.1 ? `${(distanceInMiles * 5280).toFixed(2)} ft.` : `${distanceInMiles.toFixed(2)} miles.`

    return distance
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
