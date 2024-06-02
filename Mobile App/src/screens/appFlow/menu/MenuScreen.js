import React, {useRef, useState, useEffect} from 'react'
import {StyleSheet, View, Linking, FlatList, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useSelector, useDispatch} from 'react-redux'
import {useIsFocused} from '@react-navigation/native'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import BottomSheet from '../../../components/components/common/BottomSheet'
import UsersListItem from '../../../components/components/common/UsersListItem'
import {storeLogInOrLogOut} from '../../../services/store/actions'
import {removeLocalUser, getHeaders} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import Loader from '../../../components/components/common/Spinner'

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        images: require('../../../assets/icons/bottomtab/account.png'),
        title: 'Account',
        navigation: 'ProfileDetail'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d7271233',
        images: require('../../../assets/icons/screens/cartLogo.png'),
        title: 'Cart',
        navigation: 'CartScreen',
        change: true
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d74333',
        images: require('../../../assets/icons/screens/reviews.png'),
        title: 'My Posts',
        navigation: 'UserPostScreen'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d74334',
        images: require('../../../assets/icons/bottomtab/calender.png'),
        title: 'My Events',
        navigation: 'MyEvents'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d7433300000',
        images: require('../../../assets/icons/screens/pInfo.png'),
        title: 'My Products',
        navigation: 'MyProductsScreen',
        product: true
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d78',
        images: require('../../../assets/icons/screens/like.png'),
        title: 'My Network',
        navigation: 'FavouriteProductsScreen'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e71234654334543',
        images: require('../../../assets/icons/screens/information.png'),
        title: 'Sold Products',
        navigation: 'SoldProductsScreen'
    },

    {
        id: '58694a0f-3da1-471f-bd96-145571e29d769973',
        images: require('../../../assets/icons/bottomtab/product.png'),
        title: 'Product Purchased',
        navigation: 'ProductPurchasedScreen',
        product: true
    },
    // {
    //     id: '58694a0f-3da1-471f-bd96-145571e29d72',
    //     images: require('../../../assets/icons/bottomtab/notification.png'),
    //     title: 'Notification',
    //     navigation: 'NotificationSetting'
    // },
    // {
    //     id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    //     images: require('../../../assets/icons/bottomtab/payment.png'),
    //     title: 'Payment',
    //     navigation: 'PaymentScreen'
    // },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d723',
        images: require('../../../assets/icons/bottomtab/chat.png'),
        title: 'Chat',
        navigation: 'ChatScreen'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d75',
        images: require('../../../assets/icons/bottomtab/support.png'),
        title: 'Help'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d7533',
        images: require('../../../assets/icons/screens/logout.png'),
        title: 'Log Out'
    }

    // {
    //     id: '58694a0f-3da1-471f-bd96-145571e29d79',
    //     images: require('../../../assets/icons/bottomtab/delete.png'),
    //     title: 'Disable Account'
    // }
]

const MenuScreen = ({navigation}) => {
    const [menuData, setManueData] = useState(DATA)
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    const deleteSheetRef = useRef()
    const logoutSheetRef = useRef()

    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                await countsHandler()
            }
            func()
        }
    }, [isFocused])
    const countsHandler = async () => {
        setLoading(true)
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .get('user/posts/side_bar_count', headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        const _menuData = menuData.map((item) => {
                            item.title.includes('My Products') ? (item.title = `My Products (${response.data.data.myproduct})`) : item.title
                            item.title.includes('My Posts') ? (item.title = `My Posts (${response.data.data.mypost})`) : item.title
                            item.title.includes('My Events') ? (item.title = `My Events (${response.data.data.myevent})`) : item.title
                            item.title.includes('My Network') ? (item.title = `My Network (${response.data.data.myfevSeller})`) : item.title
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

    const onPressHanlder = (item) => {
        if (item.title.match(/My Events/g)) {
            navigation.navigate(item.navigation, {menu: true})
        } else if (item.navigation) {
            navigation.navigate(item.navigation)
        }
        //  else if (item.title.match(/Delete/g)) {
        //     deleteSheetRef.current.open()
        // }
        else if (item.title.match(/Log Out/g)) {
            logoutSheetRef.current.open()
        } else {
            openMapUrl()
        }
    }

    const renderItem = ({item, onPress}) => {
        return <UsersListItem item={item} menu={true} onPress={() => onPressHanlder(item)} />
    }
    const openMapUrl = () => {
        const mapLink = 'http://gambaui.s3-website.us-east-2.amazonaws.com/'
        Linking.openURL(mapLink)
    }

    const doDeleteAccount = () => {
        deleteSheetRef.current.close()
        setTimeout(() => {
            dispatch(storeLogInOrLogOut(false))
        }, 200)
    }

    const onLogout = () => {
        logoutSheetRef.current.close()
        setTimeout(async () => {
            await removeLocalUser()
            dispatch(storeLogInOrLogOut(false))
        }, 200)
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header />
            <View style={styles.dataListCard}>
                <View style={styles.backgroundContainer}>
                    <FlatList data={menuData} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.bottomPadding} showsVerticalScrollIndicator={false} />
                </View>
            </View>

            <BottomSheet
                setRef={deleteSheetRef}
                title={'Are you sure you want to delete account?'}
                continueTitle={'Yes'}
                continueButtonCB={() => {
                    doDeleteAccount()
                }}
                skipTitle={'Cancel'}
                skipButtonCB={() => deleteSheetRef.current.close()}
            />

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
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('100%')
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        borderRadius: wp('2%'),
        shadowColor: Colors.Shadow_Color,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 5
    },
    bottomPadding: {
        paddingBottom: Platform.OS == 'android' ? hp('20') : hp('22')
    },

    dataListCard: {
        alignItems: 'center',
        paddingBottom: hp('10'),
        width: wp('100%'),
        height: Platform.OS == 'ios' ? hp('100%') : hp('100%'),
        backgroundColor: Colors.BackgroundColor,
        marginTop: hp('2%')
    }
})

export default MenuScreen
