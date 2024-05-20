import React, {useState, useEffect} from 'react'
import {StyleSheet, View, FlatList, Text, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import moment from 'moment'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import ShowAlert from '../../../components/components/common/ShowAlert'
import Loader from '../../../components/components/common/Spinner'
import UsersListItem from '../../../components/components/common/UsersListItem'
import {Chat_Api} from '../../../services/constants/index'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import {getDistanceFromLatLonInMiles} from '../../../utils/helpers'

const ChatScreen = (props) => {
    const {chatToken, userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [serachBar, setserachBar] = useState('')
    const [focusSearch, setFocusSearch] = useState(false)
    const [chatList, setChatList] = useState([])
    const [chatListCopy, setChatListCopy] = useState([])
    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                await doGetChatList()
            }
            func()
        } else {
            setFocusSearch(false)
            setserachBar('')
        }
    }, [isFocused])

    const doGetChatList = async () => {
        setLoading(true)
        const url = `${Chat_Api}api/conversations?contextual=false&skip=0&top=100`
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${chatToken}`
        }
        await axios
            .get(url, {headers})
            .then(async (response) => {
                const chatList = response.data
                let _chatList = chatList.count > 0 ? chatList.data : []
                let __chatListUp = []
                for (let i = 0; i < _chatList.length; i++) {
                    const data = {
                        id: '',
                        images: null,
                        title: '',
                        comment: '',
                        date: ''
                    }
                    data.images = _chatList[i].avatar_url
                    data.title = _chatList[i].display_name
                    data.id = _chatList[i].id
                    data.date = moment(_chatList[i].last_message?.created_at).fromNow()
                    data.msgText = _chatList[i].last_message?.plain ? _chatList[i].last_message?.plain : ' '
                    __chatListUp.push(data)
                }
                setChatList(__chatListUp)
                setChatListCopy(__chatListUp)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                console.log('chatList Error:', error)
                ShowAlert({type: 'error', description: error.message})
            })
    }

    const onSubmitPosts = async () => setFocusSearch(false)

    const chatScreenNavigate = (item) => (item.id ? props.navigation.navigate('ChatRoomScreen', {chatId: item.id}) : props.navigation.navigate('ChatRoomScreen', {userId: item}))

    const backHandler = () => props.navigation.goBack()

    const renderItem = ({item}) => {
        return <UsersListItem item={item} navigationCB={() => chatScreenNavigate(item)} chat={true} chatName={true} onPress={() => null} />
    }

    const onChangeSearchBar = async (text) => {
        setserachBar(text)
        if (text.length >= 2) {
            try {
                const url = `${Chat_Api}api/users/autocomplete?q=${text}&skip=0&top=25`
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${chatToken}`
                }
                await axios
                    .get(url, {headers})
                    .then(async (response) => {
                        let chatListData = response.data.data ? response.data.data : []
                        let chatListUp = []
                        for (let i = 0; i < chatListData.length; i++) {
                            let newData = {
                                id: '',
                                images: null,
                                title: '',
                                comment: '',
                                date: '',
                                chat_id: chatListData[i].id,
                                msgText: ' '
                            }
                            for (let j = 0; j < chatListCopy.length; j++) {
                                if (chatListData[i].display_name === chatListCopy[j].title) {
                                    newData.id = chatListCopy[j].id
                                    newData.distance = chatListCopy[j].distance
                                }
                            }
                            newData.images = chatListData[i].avatar_url
                            newData.title = chatListData[i].display_name
                            newData.date = moment(chatListData[i].last_message?.created_at).fromNow()
                            chatListUp.push(newData)
                        }
                        setChatList(chatListUp)
                        setLoading(false)
                    })
                    .catch((error) => {
                        setLoading(false)
                        console.log('chatList Error:', error)
                        ShowAlert({type: 'error', description: error.message})
                    })
            } catch (e) {
                setLoading(false)
                ShowAlert({type: 'error', description: e.message})
            }
        } else if (text.length == 0) {
            setChatList(chatListCopy)
        }
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header backCB={backHandler} back={true} title={'Chat'} />
            <View style={styles.searchToglleRowView}>
                <InputWithLabels
                    showLabelCB={false}
                    value={serachBar}
                    inputStyles={{width: wp('82')}}
                    style={{width: wp('92')}}
                    autoCapitalize={'none'}
                    placeholder={'Search a user'}
                    isError={false}
                    isFocus={focusSearch}
                    onBlur={onSubmitPosts}
                    onFocus={() => setFocusSearch(true)}
                    icon={true}
                    onChangeText={(text) => {
                        onChangeSearchBar(text)
                    }}
                    showPlaceHolder={true}
                    leftIcon={false}
                    clearIcon={true}
                    type={false}
                />
            </View>
            {chatList.length > 0 ? (
                <View style={styles.dataListCard}>
                    <View style={styles.backgroundContainer}>
                        <FlatList data={chatList} renderItem={renderItem} keyExtractor={(item, index) => index} contentContainerStyle={styles.bottomPadding} showsVerticalScrollIndicator={false} />
                    </View>
                </View>
            ) : (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            )}
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
        marginTop: hp('2%'),
        backgroundColor: Colors.White
    },
    dataListCard: {
        alignItems: 'center',
        width: wp('100%'),
        flex: 1,
        backgroundColor: Colors.White
    },
    noDataWraper: {
        width: wp('100%'),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    bottomPadding: {
        // paddingBottom: hp('30')
    },
    searchToglleRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('92%'),
        alignSelf: 'center'
    }
})

export default ChatScreen
