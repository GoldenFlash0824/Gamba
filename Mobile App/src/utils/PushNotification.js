import messaging from '@react-native-firebase/messaging'

const allowPushNotification = async () => {
    if (Platform.OS === 'android') {
        await messaging().registerDeviceForRemoteMessages()
        const token = await getFcmToken()
        return token
    } else {
        return requestiOSPushPermission()
    }
}

const requestiOSPushPermission = async () => {
    const authStatus = await messaging().requestPermission()
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
    if (enabled) {
        const token = await getFcmToken()
        return token
    } else {
        return false
    }
}

const getFcmToken = async () => {
    const fcmToken = await messaging().getToken()
    if (fcmToken) {
        // AsyncStorage.setItem(Common.FCMToken, fcmToken)
        return fcmToken
    } else {
        console.log('Failed', 'No token received')
        return false
    }
}

export {allowPushNotification, getFcmToken}
