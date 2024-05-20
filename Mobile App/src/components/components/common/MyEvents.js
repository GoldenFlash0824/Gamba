import React, {useState, useEffect, useRef} from 'react'
import {FlatList, StyleSheet, Text, View, Platform, RefreshControl} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useSelector} from 'react-redux'
import axios from 'axios'
import {useNavigation} from '@react-navigation/native'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import EditBottomSheet from './EditBottomSheet'
import EventsCard from './EventsCard'
import {separatorHeight, getHeaders, getDistanceFromLatLonInMiles} from '../../../utils/helpers'
import ShowAlert from './ShowAlert'
import Loader from './Spinner'
import EventSheetProfile from './EventSheetProfile'
import ShareButton from './ShareButton'
import Header from './Header'
import ActiveButton from './ActiveButton'

const MyEvents = ({route}) => {
    const params = route.params
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [eventsData, setEventsData] = useState([])
    const [eventsDataCopy, setEventsDataCopy] = useState([])
    const [eventItem, setEventItem] = useState()
    const navigation = useNavigation()
    const editDeleteShhetRef = useRef()
    const [refreshing, setRefreshing] = useState(false)
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)
    const joinEventSheetref = useRef()

    useEffect(() => {
        if ((route.ind == 1 && route.searching == '') || (route.params?.ind == 1 && route.params?.searching == '')) {
            const func = async () => {
                await doGetAllEvents()
            }
            func()
        } else if (route.ind == 1 && route.searching != '') {
            onChangeSearchBar(route.searching)
        } else {
            setShowLoadMore(false)
        }
    }, [route.ind, route.searching, route.params?.ind, route.params?.searching])

    const doGetAllEvents = async (page = 1) => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        let url = `user/event/event?page=${page}`
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
                        if (page > 1) {
                            setEventsData(eventsData.concat(dataEvent))
                            setEventsDataCopy(eventsData.concat(dataEvent))
                            setLoading(false)
                        } else {
                            setEventsData(dataEvent)
                            setEventsDataCopy(dataEvent)
                            setLoading(false)
                        }
                        setShowLoadMore(dataEvent.length >= 15)
                        setNextPageToken(page)
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
                    .get(`user/event/search_my_events?page=1&filter=${text}`, headers)
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
    const editOrJoinhandler = (item) => {
        setEventItem(item)
        editDeleteShhetRef.current.open()
    }
    const closeHandlerJoinEvent = () => joinEventSheetref.current.close()

    const onCloseJoinEvent = () => joinEventSheetref.current.close()

    const handlerOpenJoinEvent = (item) => {
        setEventItem(item)
        setTimeout(() => joinEventSheetref.current.open(), 200)
    }
    const renderItem = ({item, index}) => {
        return <EventsCard item={item} index={index} editCB={() => editOrJoinhandler(item)} allEventCB={() => editOrJoinhandler(item)} userId={userData.id} joinEventPress={() => handlerOpenJoinEvent(item)} />
    }

    const editHandler = () => {
        editDeleteShhetRef.current.close()
        setTimeout(() => navigation.navigate('AddEventScreen', {item: eventItem}), 200)
    }

    const deleteHandler = async (user) => {
        editDeleteShhetRef.current.close()
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .delete(`user/event/delete_event/${eventItem.id}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            const _eventsData = eventsData.filter((item) => {
                                return item.id !== eventItem.id
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
        editDeleteShhetRef.current.close()
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
    const backHandler = () => navigation.goBack()

    const profileScreenHandler = (item) => {
        joinEventSheetref.current.close()
        setTimeout(() => navigation.navigate('ProfileScreen', {userId: item.id}), 200)
    }
    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            {params && <Header back={true} backCB={backHandler} title={'My Events'} />}
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
            <EventSheetProfile setRef={joinEventSheetref} onCloseCB={closeHandlerJoinEvent} height={hp('100%')} onJoinX={onCloseJoinEvent} itemEvent={eventItem} chatCB={chatScreenHandler} title={'Participants'} profileNavigationCB={(item) => profileScreenHandler(item)} />
            <EditBottomSheet setRef={editDeleteShhetRef} share={'Share'} hide={'Delete'} report={'Edit'} skipTitle={'Cancel'} skipButtonCB={() => editDeleteShhetRef.current.close()} height={hp('35%')} deleteEventCB={deleteHandler} editSheet={true} cancelTrue={true} reportCB={editHandler} shareShow={true} hideShow={true} reportThis={true} deleteEvent={true} editEvent={true} editCB={shareHandler} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        flex: 1
    },
    cardList: {
        alignItems: 'center',
        backgroundColor: Colors.BackgroundColor,
        paddingBottom: Platform.OS == 'android' ? hp('0') : hp('5'),
        width: wp('100%'),
        flex: 1
    },
    flatListBottom: {
        width: wp('100%'),
        alignItems: 'center',
        paddingBottom: Platform.OS == 'android' ? hp('10') : hp('30')
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

export default MyEvents
