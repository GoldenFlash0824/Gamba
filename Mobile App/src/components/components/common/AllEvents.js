import React, {useState, useEffect, useRef} from 'react'
import {FlatList, StyleSheet, Text, View, Platform, RefreshControl} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useNavigation} from '@react-navigation/native'
import {useSelector} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import EditBottomSheet from './EditBottomSheet'
import EventsCard from './EventsCard'
import {separatorHeight, getHeaders, getDistanceFromLatLonInMiles} from '../../../utils/helpers'
import ShowAlert from './ShowAlert'
import Loader from './Spinner'
import ReportedBottomSheet from './ReportedBottomSheet'
import EventSheetProfile from './EventSheetProfile'
import ShareButton from './ShareButton'
import ActiveButton from './ActiveButton'

const AllEvents = ({route}) => {
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [allevents] = useState(true)
    const [eventsData, setEventsData] = useState([])
    const [eventsDataCopy, setEventsDataCopy] = useState([])
    const [eventItem, setEventItem] = useState()
    const [refreshing, setRefreshing] = useState(false)
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)

    const navigation = useNavigation()
    const editDeleteShhetRef = useRef()
    const allEventShhetRef = useRef()
    const reportedSheetref = useRef()
    const joinEventSheetref = useRef()

    useEffect(() => {
        if (route.ind == 0 && route.searching == '') {
            const func = async () => await doGetAllEvents()
            func()
        } else if (route.ind == 0 && route.searching != '') {
            onChangeSearchBar(route.searching)
        } else {
            setShowLoadMore(false)
        }
    }, [route.ind, route.searching])

    const doGetAllEvents = async (page = 1) => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        let url = `user/event/all_events?page=${page}`
        try {
            await axios
                .get(url, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let dataEvent = response.data.data.event
                        for (let i = 0; i < dataEvent.length; i++) {
                            let _distance = null
                            dataEvent[i].latitude && dataEvent[i].longitude && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, dataEvent[i].latitude, dataEvent[i].longitude)) : null
                            dataEvent[i]['distance'] = _distance ? _distance : 0
                        }
                        page > 1 ? (setEventsData(eventsData.concat(dataEvent)), setEventsDataCopy(eventsDataCopy.concat(dataEvent))) : (setEventsData(dataEvent), setEventsDataCopy(dataEvent))
                        setShowLoadMore(dataEvent.length >= 15)
                        setNextPageToken(page)
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
    const onChangeSearchBar = async (text) => {
        if (text.length >= 2) {
            const headers = getHeaders(userData.auth_token)
            try {
                await axios
                    .get(`user/event/search_events?page=1&filter=${text}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            let dataEvent = response.data.data.event
                            for (let i = 0; i < dataEvent.length; i++) {
                                let _distance = null
                                dataEvent[i].latitude && dataEvent[i].longitude && userData.lat && userData.log ? (_distance = await getDistanceFromLatLonInMiles(userData.lat, userData.log, dataEvent[i].latitude, dataEvent[i].longitude)) : null
                                dataEvent[i]['distance'] = _distance ? _distance : 0
                            }
                            setEventsData(dataEvent)
                            setLoading(false)
                        } else {
                            setLoading(false)
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
        } else if (text.length == 0) {
            setEventsData(eventsDataCopy)
        }
    }
    const reportHandlerApi = (reason = '') => {
        reportedSheetref.current.close()
        setTimeout(async () => {
            const headers = getHeaders(userData.auth_token)
            setLoading(true)
            try {
                await axios
                    .post('admin/reported_event', {u_id: userData.id, event_id: eventItem.id, reason: reason}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            // ShowAlert({type: 'success', description: response.data.message})
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
        }, 200)
    }
    const closeHandlerJoinEvent = () => joinEventSheetref.current.close()
    const onCloseJoinEvent = () => joinEventSheetref.current.close()

    const handlerOpenJoinEvent = (item) => {
        setEventItem(item)
        setTimeout(() => joinEventSheetref.current.open(), 200)
    }

    const editOrJoinhandler = (item) => (allevents ? (allEventShhetRef.current.open(), setEventItem(item)) : (editDeleteShhetRef.current.open(), setEventItem(item)))

    const renderItem = ({item, index}) => {
        return <EventsCard item={item} index={index} allevents={allevents} editCB={() => editOrJoinhandler(item)} allEventCB={() => editOrJoinhandler(item)} userId={userData.id} joinAdd={() => joinHandlerApi(item)} unJoin={() => unJoinHandlerApi(item)} joinEventPress={() => handlerOpenJoinEvent(item)} />
    }

    const reportHandler = () => {
        allEventShhetRef.current.close()
        setTimeout(() => reportedSheetref.current.open(), 200)
    }

    const joinHandlerApi = async (item) => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .post('user/event/join_event', {event_id: item.id, payment_id: 1}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        const _eventsJoin = eventsData.map((itm) => {
                            if (itm.id === response.data.data.id) {
                                itm.isJoinMe = 1
                                itm.joinEvent = response.data.data.joinEvent
                            }
                            return itm
                        })
                        setEventsData(_eventsJoin)
                        setLoading(false)
                        // ShowAlert({type: 'success', description: response.data.message})
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

    const unJoinHandlerApi = async (item) => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .post('user/event/un_join_event', {event_id: item.id}, headers)

                .then(async (response) => {
                    if (response.data.success === true) {
                        const _eventsJoin = eventsData.map((itm) => {
                            if (itm.id === response.data.data.id) {
                                itm.isJoinMe = 0
                                itm.joinEvent = response.data.data.joinEvent
                            }
                            return itm
                        })
                        setEventsData(_eventsJoin)
                        setLoading(false)
                        // ShowAlert({type: 'success', description: response.data.message})
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

    const doHideHandler = () => {
        allEventShhetRef.current.close()
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .post(`user/event/hide_event`, {event_id: eventItem.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            const _eventsData = eventsData.filter((item) => {
                                return item.id != eventItem.id
                            })
                            setEventsData(_eventsData)
                            setLoading(false)
                            // ShowAlert({type: 'success', description: response.data.message})
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
        }, 200)
    }
    const shareHandler = () => {
        allEventShhetRef.current.close()
        setTimeout(() => ShareButton({link: `calendar/${eventItem.id}`, fullname: userData.first_name + ' ' + userData.last_name}), 200)
    }
    const onRefresh = async () => {
        await doGetAllEvents(nextPageToken)
        setRefreshing(false)
    }
    const doFetchMoreEvents = async () => await doGetAllEvents(nextPageToken + 1)

    const renderFooter = () => {
        return showLoadMore && <ActiveButton style={styles.moreButton} title="Load More" onPress={() => doFetchMoreEvents()} />
    }
    const chatScreenHandler = (currentUser) => {
        joinEventSheetref.current.close()
        setTimeout(() => navigation.navigate('ChatRoomScreen', {userId: currentUser}), 200)
    }
    const profileScreenHandler = (item) => {
        joinEventSheetref.current.close()
        setTimeout(() => navigation.navigate('ProfileScreen', {userId: item.id}), 200)
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            {separatorHeight()}
            {eventsData.length > 0 ? (
                <View style={styles.cardList}>
                    <FlatList data={eventsData} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} renderItem={renderItem} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.flatListBottom} ListFooterComponent={renderFooter} />
                </View>
            ) : (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            )}
            <EditBottomSheet setRef={allEventShhetRef} share={'Share'} hide={'Hide'} report={'Report'} skipTitle={'Cancel'} skipButtonCB={() => allEventShhetRef.current.close()} height={hp('35')} editSheet={true} cancelTrue={true} shareShow={true} reportCB={reportHandler} hideShow={true} reportThis={true} deleteEventCB={doHideHandler} editCB={shareHandler} />
            <EventSheetProfile setRef={joinEventSheetref} onCloseCB={closeHandlerJoinEvent} height={hp('100%')} onJoinX={onCloseJoinEvent} itemEvent={eventItem} title={'Participants'} chatCB={chatScreenHandler} profileNavigationCB={(item) => profileScreenHandler(item)} />
            <ReportedBottomSheet setRef={reportedSheetref} height={hp('40%')} reportCB={reportHandlerApi} title={'Report Event'} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('100%')
    },
    cardList: {
        alignItems: 'center',
        backgroundColor: Colors.BackgroundColor,
        paddingBottom: Platform.OS == 'android' ? hp('10') : hp('10'),
        width: wp('100%')
        // height: hp('75%')
    },
    flatListBottom: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('30') : hp('30')
    },
    noDataWraper: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('70%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    moreButton: {
        alignSelf: 'center',
        marginTop: hp('1%'),
        width: wp(92)
    }
})

export default AllEvents
