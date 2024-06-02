import React, {useRef, useState} from 'react'
import {StyleSheet, Platform, View, Text, Pressable, Linking} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import MenuOption from './MenuOption'
import BottomSheet from './BottomSheet'
import DisableSheet from './DisableSheet'
import {storeLogInOrLogOut, storeDisableData} from '../../../services/store/actions'
import {removeLocalUser, getHeaders} from '../../../utils/helpers'
import Loader from './Spinner'
import ShowAlert from './ShowAlert'
import {ContinousBaseGesture} from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture'
import {IMAGES_BASE_URL} from '../../../services/constants'
import ConfermModal from '../../../components/components/common/ConfermModal'

const RightDrawerContent = ({navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [reasonDelete, setReasonDelete] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [reasonSet, setReasonSet] = useState('')

    const DATA = [
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            image: {uri: userData?.image ? IMAGES_BASE_URL + userData.image : IMAGES_BASE_URL + userData?.first_name[0]?.toLowerCase() + '.png'},
            title: 'My Account',
            navigation: 'ProfileDetail'
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa9ssss7f63',
            image: require('../../../assets/icons/bottomtab/payment.png'),
            title: 'Payment',
            navigation: 'PaymentScreen'
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29ddddd72',
            image: require('../../../assets/icons/bottomtab/notification.png'),
            title: 'Notification',
            navigation: 'NotificationSetting'
        },

        // {
        //     id: '58694a0f-3da1-471f-bd96-145571e29d789892',
        //     image: require('../../../assets/icons/screens/agreement.png'),
        //     title: 'Mamber Agreement',
        //     navigation: 'MamberAgreementScreen'
        // },
        // {
        //     id: '58694a0f-3da1-471f-bd96-145571e29d783339',
        //     image: require('../../../assets/icons/screens/refund.png'),
        //     title: 'Refund Agreement',
        //     navigation: 'SellersRefundAgreementScreen'
        // },
        // {
        //     id: '58694a0f-3da1-471f-bd96-145571e29d78999',
        //     image: require('../../../assets/icons/screens/insurance.png'),
        //     title: 'Privacy Policy',
        //     navigation: 'PrivacyPolicyScreen'
        // },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d78934',
            image: require('../../../assets/icons/bottomtab/support.png'),
            title: 'Contact',
            navigation: 'ContactScreen'
        },

        {
            id: '58694a0f-3da1-471f-bd96-145571e29d79',
            image: require('../../../assets/icons/bottomtab/delete.png'),
            title: 'Disable Account'
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d7899977',
            image: require('../../../assets/icons/screens/about.png'),
            title: 'About',
            navigation: 'AboutScreen'
        }

        // {
        //     id: '58694a0f-3da1-471f-bd96-145571e29d72',
        //     image: require('../../../assets/icons/screens/visible.png'),
        //     title: 'Privacy',
        //     navigation: 'PrivacyScreen'
        // },

        // {
        //     id: '58694a0f-3da1-471f-bd96-145571e29d78',
        //     image: require('../../../assets/icons/screens/like.png'),
        //     title: 'My Network',
        //     navigation: 'FavouriteProductsScreen'
        // }
    ]

    const dispatch = useDispatch()
    const deleteSheetRef = useRef()
    const navigationHandelr = () => {
        setTimeout(() => navigation.navigate('MenuScreen'))
    }
    const closeHandler = () => {
        navigation.getParent('RightDrawer').closeDrawer()
    }

    const onPressHanlder = (item) => {
        if (item.navigation) {
            // navigation.getParent('RightDrawer').closeDrawer()
            navigation.navigate(item.navigation)
        } else if (item.title.match(/Disable Account/g)) {
            deleteSheetRef.current.open()
        } else {
            // navigation.getParent('RightDrawer').closeDrawer()
            openMapUrl()
        }
    }
    const openMapUrl = () => {
        const mapLink = 'http://gambaui.s3-website.us-east-2.amazonaws.com/'
        Linking.openURL(mapLink)
    }

    const doDeleteAccount = () => {
        deleteSheetRef.current.close()
        setTimeout(async () => {
            setModalVisible(true)
            // await doDisableAccount()
        }, 200)
    }

    const deleteAccountHandler = () => {
        setReasonDelete(true)
        deleteSheetRef.current.close()
        setTimeout(() => {
            deleteSheetRef.current.open()
        }, 200)
    }

    const cancelHandler = () => {
        deleteSheetRef.current.close()
        setReasonDelete(false)
    }
    const confermHandlerPopup = (item) => {
        deleteSheetRef.current.close()
        setReasonSet(item)
        setTimeout(() => {
            setModalVisible(true)
        }, 200)
    }
    const confermDeletHandler = () => {
        const headers = getHeaders(userData.auth_token)
        const data = {
            reason: reasonSet
        }
        setTimeout(async () => {
            setLoading(true)
            try {
                const response = await axios.post(`user/delete_account`, data, headers)
                if (response.data.success === true) {
                    await removeLocalUser()
                    setLoading(false)
                    setTimeout(async () => {
                        dispatch(storeLogInOrLogOut(false))
                    }, 200)
                } else {
                    setLoading(false)
                    ShowAlert({type: 'error', description: response.data.message})
                }
            } catch (error) {
                setLoading(false)
                ShowAlert({type: 'error', description: error.message})
            }
        }, 200)
    }

    const doDisableAccount = async () => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .post(`user/disable_account`, {u_id: userData.id}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        await removeLocalUser()
                        dispatch(storeLogInOrLogOut(false))
                        dispatch(storeDisableData({disableText: 'Your account is now disabled! When you are ready to use Gamba again, simply login and enable your account. Hope to see you soon'}))
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

    const verificationHandler = async (item) => {
        const data = {
            email: item?.email,
            password: item?.password
        }
        setLoading(true)
        try {
            await axios
                .post('user/login', data)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setModalVisible(false)
                        reasonSet ? confermDeletHandler() : doDisableAccount()
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
            <Loader visible={loading} />
            <View style={styles.contentWrapper}>
                <View style={styles.drawerClose}>
                    <Pressable onPress={() => closeHandler()}>
                        <FastImage source={require('../../../assets/icons/screens/multiply.png')} resizeMode="contain" style={styles.close} tintColor={Colors.Black} />
                    </Pressable>
                </View>
                {DATA.map((item, ind) => {
                    return <MenuOption item={item} key={ind} onPress={() => onPressHanlder(item)} />
                })}
            </View>
            <View style={styles.legalContainer}>
                <Text style={styles.textL}>{'Legal'}</Text>

                <View style={styles.priContainer}>
                    <Pressable onPress={() => navigation.navigate('MamberAgreementScreen')}>
                        <Text style={styles.textB}>{'Term of Use |'}</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('SellersRefundAgreementScreen')}>
                        <Text style={styles.textB}>{' Sellers Agreement'}</Text>
                    </Pressable>
                </View>
                <View style={styles.bottomC}>
                    <Pressable onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
                        <Text style={styles.textB}>{'| Privacy Policy'}</Text>
                    </Pressable>
                </View>
            </View>
            {/* <BottomSheet setRef={deleteSheetRef} title={'Are you sure you want to disable account?'} continueTitle={'Yes'} continueButtonCB={() => doDeleteAccount()} skipTitle={'Cancel'} skipButtonCB={() => deleteSheetRef.current.close()} /> */}
            <DisableSheet setRef={deleteSheetRef} height={reasonDelete ? hp('50%') : hp('37%')} confermDelete={reasonDelete ? true : false} title={'Disable Account'} description={'Are you sure you want to delete this account? If you do, you won’t be able to access your account anymore.'} deleteAccount={() => deleteAccountHandler()} continueTitle={'Temporary Account'} continueTitleE={reasonDelete ? 'Confirm Delete' : 'Delete'} temporaryDisable={() => doDeleteAccount()} skipTitle={'Cancel'} skipButtonCB={() => cancelHandler()} deleteAccountC={(item) => confermHandlerPopup(item)} />
            {modalVisible && <ConfermModal visible={modalVisible} onRequestClose={() => setModalVisible(false)} closeModal={() => setModalVisible(false)} varificationUser={true} verifiyOnPress={(item) => verificationHandler(item)} headingVerify={reasonSet ? 'Confirm your login information to delete your account.' : 'Confirm your login information to disable account'} />}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('92'),
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center'
    },
    drawerClose: {
        width: wp('80'),
        paddingLeft: wp('2%')
    },
    contentWrapper: {
        marginTop: hp(5),
        width: wp('92')
    },
    close: {
        width: wp(5),
        height: wp(5)
    },
    textL: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.LightGrayColor
    },
    textB: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_13,
        color: Colors.LightGrayColor
    },
    legalContainer: {
        width: '90%',
        alignSelf: 'center',
        flex: 1,
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
        bottom: hp(2)
    },
    priContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: hp(1)
    },
    bottomC: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: hp(1)
    }
})

export default RightDrawerContent
