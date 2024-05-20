import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Text, View, Platform, ScrollView} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import EditBottomSheet from '../../../components/components/common/EditBottomSheet'
import EventsCard from '../../../components/components/common/EventsCard'
import {getHeaders} from '../../../utils/helpers'
import ShowAlert from '../../../components/components/common/ShowAlert'
import Loader from '../../../components/components/common/Spinner'
import ReportedBottomSheet from '../../../components/components/common/ReportedBottomSheet'
import Header from '../../../components/components/common/Header'
import EventSheetProfile from '../../../components/components/common/EventSheetProfile'
import ShareButton from '../../../components/components/common/ShareButton'

const EventDetailScreen = ({navigation, route}) => {
    const {userData} = useSelector((state) => state.user)
    const params = route.params
    const [loading, setLoading] = useState(false)
    const [allevents, setAllEvents] = useState(false)
    const [eventData, setEventData] = useState()
    const editDeleteShhetRef = useRef()
    const allEventShhetRef = useRef()
    const reportedSheetref = useRef()
    const joinEventSheetref = useRef()
    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                params?.id ? await getEventDetail() : null
            }
            func()
        }
    }, [isFocused])
    const getEventDetail = async (user) => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .post(`user/event/get_event_by_id`, {event_id: params?.id}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setAllEvents(response.data.data.u_id != userData.id)
                        setEventData(response.data.data)
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

    const editOrJoinhandler = (item) => {
        allevents ? allEventShhetRef.current.open() : editDeleteShhetRef.current.open()
    }

    const editHandler = () => {
        editDeleteShhetRef.current.close()
        setTimeout(() => {
            navigation.navigate('AddEventScreen', {item: eventData})
        }, 200)
    }

    const reportHandler = () => {
        allEventShhetRef.current.close()
        setTimeout(() => {
            reportedSheetref.current.open()
        }, 200)
    }
    const deleteHandler = async (user) => {
        editDeleteShhetRef.current.close()
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .delete(`user/event/delete_event/${eventData.id}`, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            navigation.goBack()
                            ShowAlert({type: 'success', description: response.data.message})
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
    const reportHandlerApi = (reason = '') => {
        reportedSheetref.current.close()
        setTimeout(async () => {
            const headers = getHeaders(userData.auth_token)
            setLoading(true)
            try {
                await axios
                    .post(
                        'admin/reported_event',
                        {
                            u_id: userData.id,
                            event_id: eventData.id,
                            reason: reason
                        },
                        headers
                    )
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            ShowAlert({type: 'success', description: response.data.message})
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
    const joinHandlerApi = async () => {
        const headers = getHeaders(userData.auth_token)
        setLoading(true)
        try {
            await axios
                .post('user/event/join_event', {event_id: eventData.id, payment_id: 1}, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setLoading(false)
                        ShowAlert({type: 'success', description: response.data.message})
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

    const closeHandlerJoinEvent = () => {
        joinEventSheetref.current.close()
    }
    const onCloseJoinEvent = () => {
        joinEventSheetref.current.close()
    }
    const handlerOpenJoinEvent = () => {
        setTimeout(() => {
            joinEventSheetref.current.open()
        }, 200)
    }
    const backHandler = () => {
        navigation.goBack()
    }
    const shareHandler = () => {
        editDeleteShhetRef.current.close()
        setTimeout(() => {
            ShareButton({link: `calendar/${eventData.id}`, fullname: userData.first_name + ' ' + userData.last_name})
        }, 200)
    }
    const chatScreenHandler = (currentUser) => {
        joinEventSheetref.current.close()
        setTimeout(() => {
            navigation.navigate('ChatRoomScreen', {userId: currentUser})
        }, 200)
    }
    const profileScreenHandler = (item) => {
        joinEventSheetref.current.close()
        setTimeout(() => navigation.navigate('ProfileScreen', {userId: item.id}), 200)
    }
    return (
        <View style={styles.body}>
            <Header back={true} backCB={backHandler} right={false} />
            <Loader visible={loading} />
            {eventData ? (
                <ScrollView contentContainerStyle={styles.cardList} showsVerticalScrollIndicator={false}>
                    <EventsCard item={eventData} index={0} allevents={allevents} editCB={() => editOrJoinhandler(eventData)} allEventCB={() => editOrJoinhandler(eventData)} userId={userData.id} joinAdd={() => null} unJoin={() => null} joinEventPress={() => handlerOpenJoinEvent()} />
                </ScrollView>
            ) : (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            )}
            <EventSheetProfile setRef={joinEventSheetref} onCloseCB={closeHandlerJoinEvent} height={hp('100%')} onJoinX={onCloseJoinEvent} itemEvent={eventData} chatCB={chatScreenHandler} profileNavigationCB={(item) => profileScreenHandler(item)} />
            <EditBottomSheet setRef={editDeleteShhetRef} share={'Share'} hide={'Delete'} report={'Edit'} skipTitle={'Cancel'} skipButtonCB={() => editDeleteShhetRef.current.close()} height={hp('35%')} deleteEventCB={deleteHandler} editSheet={true} cancelTrue={true} reportCB={editHandler} shareShow={true} hideShow={true} reportThis={true} deleteEvent={true} editEvent={true} editCB={shareHandler} />
            <EditBottomSheet setRef={allEventShhetRef} share={'Report'} skipTitle={'Cancel'} skipButtonCB={() => allEventShhetRef.current.close()} height={hp('30%')} editSheet={true} cancelTrue={true} shareShow={true} editCB={reportHandler} />
            <ReportedBottomSheet setRef={reportedSheetref} height={hp('40%')} skipButtonCB={() => reportedSheetref.current.close()} reportCB={reportHandlerApi} title={'Report Event'} />
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
        backgroundColor: Colors.BackgroundColor
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
    }
})

export default EventDetailScreen
