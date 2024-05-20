import React, {useRef, useEffect, useState} from 'react'
import {StyleSheet, Platform, View, Text, Pressable, TouchableOpacity, useWindowDimensions, Alert} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import {useSelector, useDispatch} from 'react-redux'
import {useIsFocused} from '@react-navigation/native'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

import {removeLocalUser, getHeaders} from '../../../utils/helpers'
import {storeLogInOrLogOut} from '../../../services/store/actions'
import Loader from '../../../components/components/common/Spinner'
import MenuOption from './MenuOption'
import BottomSheet from './BottomSheet'

const DATA = [
    {
        id: '58694a0f-3da1-471f-bd96-145571e',
        title: 'My Account   ',
        navigation: 'ProfileDetail'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d74333',
        title: 'My Posts',
        navigation: 'UserPostScreen'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d74334',
        title: 'My Events',
        navigation: 'MyEvents'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d7433300000',
        title: 'My Products',
        navigation: 'MyProductsScreen'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d769973',
        title: 'Orders',
        navigation: 'ProductPurchasedScreen'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d78',
        title: 'My Network',
        navigation: 'FavouriteProductsScreen'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e71234654334543',
        title: 'Sold Products',
        navigation: 'SoldProductsScreen'
    }
]

const LeftDrawerContent = ({navigation, state}) => {
    const {userData} = useSelector((state) => state.user)
    const [menuData, setManueData] = useState(DATA)
    const [loading, setLoading] = useState(false)
    const logoutSheetRef = useRef()
    const dispatch = useDispatch()
    const isFocused = useIsFocused()
    const {height} = useWindowDimensions()

    useEffect(() => {
        const func = async () => await countsHandler()

        state.history.length > 1 ? func() : null
    }, [state.history])

    const closeHandler = () => navigation.getParent('LeftDrawer').closeDrawer()

    const sheethandler = () => logoutSheetRef.current.open()

    const onPressHanlder = (item) => {
        if (item.title.match(/My Events/g)) {
            navigation.getParent('LeftDrawer').closeDrawer()
            Platform.OS == 'android' ? navigation.navigate(item.navigation, {menu: true, ind: 1, searching: ''}) : setTimeout(() => navigation.navigate(item.navigation, {menu: true, ind: 1, searching: ''}))
        } else if (item.navigation) {
            navigation.getParent('LeftDrawer').closeDrawer()
            Platform.OS == 'android' ? navigation.navigate(item.navigation) : setTimeout(() => navigation.navigate(item.navigation))
        } else {
            console.log('Invalid item')
        }
    }

    const onLogout = () => {
        logoutSheetRef.current.close()
        setTimeout(async () => {
            await removeLocalUser()
            dispatch(storeLogInOrLogOut(false))
        }, 200)
    }

    const countsHandler = async () => {
        setLoading(true)
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .get('user/posts/side_bar_count', headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        console.log('======', response.data.data)
                        const _menuData = menuData.map((item) => {
                            item.title.includes('My Posts') ? (item.title = `My Posts (${response.data.data.mypost})`) : item.title
                            item.title.includes('My Events') ? (item.title = `My Events (${response.data.data.myevent})`) : item.title
                            item.title.includes('My Products') ? (item.title = `My Products (${response.data.data.myproduct})`) : item.title
                            item.title.includes('My Network') ? (item.title = `My Network (${response.data.data.myfevSeller})`) : item.title
                            item.title.includes('Sold Products') ? (item.title = `Sold Products (${response.data.data.soldProducts})`) : item.title
                            return item
                        })
                        setManueData(_menuData)
                        setLoading(false)
                    } else {
                        setLoading(false)
                        // ShowAlert({type: 'error', description: response.data.message})
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    // ShowAlert({type: 'error', description: error.message})
                })
        } catch (e) {
            setLoading(false)
            // ShowAlert({type: 'error', description: e.message})
        }
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <View style={styles.contentWrapper}>
                <View style={height > 1000 ? styles.addViewClose : styles.drawerClose}>
                    <Pressable onPress={() => closeHandler()}>
                        <FastImage source={require('../../../assets/icons/screens/multiply.png')} resizeMode="contain" style={styles.close} tintColor={Colors.Black} />
                    </Pressable>
                </View>

                {menuData.map((item, ind) => {
                    return <MenuOption item={item} key={ind} style={styles.menuOptionS} textStyle={styles.textStyle} onPress={() => onPressHanlder(item)} />
                })}

                <View style={styles.widthLine}></View>
                <TouchableOpacity onPress={sheethandler}>
                    <Text style={styles.txtLogout}>Logout</Text>
                </TouchableOpacity>
            </View>

            <BottomSheet
                setRef={logoutSheetRef}
                title={'Signing out?'}
                continueTitle={'Sign Out'}
                continueButtonCB={() => {
                    onLogout()
                }}
                skipTitle={'Cancel'}
                skipButtonCB={() => logoutSheetRef.current.close()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: Platform.OS == 'ios' ? wp(75) : wp('80%'),
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center'
    },
    contentWrapper: {
        marginTop: hp(5),
        width: wp('92')
    },
    close: {
        width: wp(5),
        height: wp(5)
    },
    drawerClose: {
        alignItems: 'flex-end',
        width: wp('78')
    },
    addViewClose: {
        alignItems: 'flex-end',
        width: wp('45')
    },
    menuOptionS: {
        width: wp('50'),
        paddingVertical: hp('1.3'),
        paddingLeft: wp('6%')
    },
    textStyle: {
        color: Colors.Black
    },
    widthLine: {
        width: wp('45'),
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        marginLeft: wp('14%'),
        marginTop: hp('2%')
    },
    txtLogout: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.RedColor,
        paddingLeft: wp('14%'),
        marginTop: hp('3%')
    }
})

export default LeftDrawerContent
