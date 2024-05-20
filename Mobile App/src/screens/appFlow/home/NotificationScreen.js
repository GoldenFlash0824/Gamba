import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Text, View, FlatList} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import moment from 'moment'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import Loader from '../../../components/components/common/Spinner'
import NotificationList from '../../../components/components/common/NotificationList'
import ShowAlert from '../../../components/components/common/ShowAlert'
import DetailSheetPop from '../../../components/components/common/DetailSheetPop'
import ChemicalsDetailUsed from '../../../components/components/common/ChemicalsDetailUsed'
import {getHeaders} from '../../../utils/helpers'
import {storeNotification} from '../../../services/store/actions/user'

const NotificationScreen = ({navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [productDetailItem, setProductDetailItem] = useState({})
    const detailSheetRef = useRef()
    const chemicalDetailSheetRef = useRef()
    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    useEffect(() => {
        if (isFocused) {
            const func = async () => await doGetNotification()
            func()
        }
    }, [isFocused])

    const doGetNotification = async () => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .get('user/user_notification', headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let notiData = response.data.data.data
                        let date
                        for (let i = 0; i < notiData.length; i++) {
                            let currnt = moment(notiData[i].createdAt).format('MM/DD/YYYY')
                            if (currnt != date) {
                                date = currnt
                                notiData[i]['isNew'] = true
                            } else {
                                notiData[i]['isNew'] = false
                            }
                        }
                        setNotifications(notiData)
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

    const allMarkNotification = async () => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .get('user/mark_all_read_notification', headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        dispatch(storeNotification(0))
                        const _readData = notifications.map((itm) => {
                            itm.is_read = true
                            return itm
                        })
                        setNotifications(_readData)
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

    const signleMarkNotification = async (noti) => {
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .get(`user/read_notification?id=${noti.id}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                    } else {
                    }
                })
                .catch((error) => {})
        } catch (e) {}
    }
    const doGetProductDetail = async (id) => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .post('user/product/get_product_by_id', {product_id: id}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setProductDetailItem(response.data.data)
                        setLoading(false)
                        setTimeout(() => detailSheetRef.current.open(), 500)
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
    const onPressNotification = async (noti) => {
        if (noti.type.includes('Post')) {
            navigation.navigate('PostDetailScreen', {id: noti.post_id})
        } else if (noti.type.match(/Join your event|Event Information is Updated/g)) {
            navigation.navigate('EventDetailScreen', {id: noti.event_id})
        } else if (noti.type.includes('comments')) {
            navigation.navigate('PostDetailScreen', {id: noti.post_id})
        } else if (noti.type.includes('checkout')) {
            await doGetProductDetail(noti.product_id)
        }
        signleMarkNotification(noti)
    }
    const renderItem = ({item, index}) => {
        return <NotificationList item={item} comment={true} onPress={() => onPressNotification(item)} notifications={notifications} />
    }

    const closeHandlerDetail = () => detailSheetRef.current.close()

    const onClose = () => {
        setTimeout(() => detailSheetRef.current.close(), 100)
    }

    const handlerOpenChemSheet = () => {
        detailSheetRef.current.close()
        setTimeout(() => chemicalDetailSheetRef.current.open(), 200)
    }
    const closeHandlerChemicalDetail = () => chemicalDetailSheetRef.current.close()

    const onCloseChem = () => chemicalDetailSheetRef.current.close()

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} titlleLeft={'Notifications'} rightText={'Mark all as read'} onRightPress={allMarkNotification} />
            {notifications.length == 0 ? (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            ) : (
                <View style={styles.backgroundContainer}>
                    <FlatList data={notifications} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.bottomPadding} showsVerticalScrollIndicator={false} />
                </View>
            )}
            <DetailSheetPop setRef={detailSheetRef} onCloseCB={closeHandlerDetail} height={hp('100%')} onPress={onClose} itemCB={productDetailItem} postShowCB={true} OnPressChem={handlerOpenChemSheet} addToCartCBD={() => null} chatCb={() => null} />
            <ChemicalsDetailUsed setRef={chemicalDetailSheetRef} onCloseCB={closeHandlerChemicalDetail} height={hp('100%')} onChe={onCloseChem} itemCB={productDetailItem} />
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

        backgroundColor: Colors.White
    },
    bottomPadding: {
        paddingBottom: hp('25')
    },
    noDataWraper: {
        width: wp('100%'),
        height: hp('70%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default NotificationScreen
