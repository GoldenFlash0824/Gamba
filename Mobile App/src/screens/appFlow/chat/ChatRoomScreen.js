import React, {useState, useEffect, useRef, memo} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {GiftedChat} from 'react-native-gifted-chat'
import {useSelector} from 'react-redux'

import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Loader from '../../../components/components/common/Spinner'
import Header from '../../../components/components/common/Header'
import {Chat_Api} from '../../../services/constants/index'

const ChatRoomScreen = ({navigation, route}) => {
    const {chatToken} = useSelector((state) => state.user)
    const params = route.params
    let displ = params?.userId?.title ? params.userId?.title : params?.userId?.first_name + ' ' + params?.userId?.last_name
    const [loading, setLoading] = useState(false)
    const [isNewCaht, setIsNewChat] = useState(true)
    const [messages, setMessages] = useState([])
    const [chatId, setChatId] = useState()
    const timerRef = useRef(null)

    useEffect(() => {
        setLoading(true)
        const func = async () => {
            params?.chatId ? fetchMessagesList([], params?.chatId) : await fecthList()
        }
        func()
    }, [])

    useEffect(() => {
        timerRef.current = setInterval(async () => {
            !isNewCaht ? (params?.chatId ? fetchMessagesList([], params?.chatId) : await fecthList()) : null
        }, 500)

        return () => {
            clearInterval(timerRef.current)
        }
    }, [isNewCaht])

    const fecthList = async () => {
        try {
            const url = `${Chat_Api}api/conversations`
            const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${chatToken}`}
            await axios
                .get(url, {headers})
                .then(async (response) => {
                    const chatList = response.data
                    chatList.count > 0 ? fetchMessages(chatList.data) : await creatChatG()
                })
                .catch((error) => {
                    setLoading(false)
                    console.log('chatList Error:', error)
                })
        } catch (error) {
            setLoading(false)
            console.log('chatList Error:', error)
        }
    }

    const fetchMessages = async (groups) => {
        let isGroup = groups.some((e) => e.display_name === displ)
        isGroup ? await fetchMessagesList(groups) : await creatChatG()
    }
    const fetchMessagesList = async (groups, id) => {
        isNewCaht ? setIsNewChat(false) : null

        if (id) {
            try {
                const url = `${Chat_Api}api/apps/${id}/messages?top=100`
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${chatToken}`
                }
                await axios
                    .get(url, {headers})
                    .then(async (response) => {
                        const messagesList = response.data.count > 0 ? response.data.data : []
                        let _messagesList = []
                        for (let i = 0; i < messagesList.length; i++) {
                            const data = {
                                _id: messagesList[i].created_at,
                                createdAt: messagesList[i].created_at,
                                id: messagesList[i].id,
                                text: messagesList[i].plain ? messagesList[i].plain : messagesList[i].text,
                                image: messagesList[i].attachments ? (messagesList[i].attachments[0].media_type?.match(/png|jpeg|jpg/g) ? messagesList[i].attachments[0].download_url : '') : '',
                                user: {_id: messagesList[i].created_by.id, avatar: messagesList[i].created_by.avatar_url, name: messagesList[i].created_by.name}
                            }
                            let isIncludes = messages.some((e) => e.id == messagesList[i].id)

                            if (!isIncludes) {
                                data.text?.length || messagesList[i].attachments[0].media_type.match(/png|jpeg|jpg/g) ? messages.push(data) : null
                            }
                        }
                        let sorttedArray = messages.sort(function (a, b) {
                            return b.id - a.id
                        })
                        let _sorttedArray = [...sorttedArray]
                        setLoading(false)
                        setMessages(_sorttedArray)
                    })
                    .catch((error) => {
                        setLoading(false)
                        console.log('create chatChannel Error:', error)
                    })
            } catch (error) {
                setLoading(false)
                console.log('chatList Error:', error)
            }
        } else {
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].display_name == displ) {
                    try {
                        const url = `${Chat_Api}api/apps/${groups[i].id}/messages?top=100`
                        const headers = {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${chatToken}`
                        }
                        await axios
                            .get(url, {headers})
                            .then(async (response) => {
                                const messagesList = response.data.count > 0 ? response.data.data : []
                                let _messagesList = []
                                for (let i = 0; i < messagesList.length; i++) {
                                    const data = {
                                        _id: messagesList[i].created_at,
                                        createdAt: messagesList[i].created_at,
                                        id: messagesList[i].id,
                                        text: messagesList[i].plain ? messagesList[i].plain : messagesList[i].text,
                                        user: {_id: messagesList[i].created_by.id, avatar: messagesList[i].created_by.avatar_url, name: messagesList[i].created_by.name}
                                    }
                                    let isIncludes = messages.some((e) => e.id == messagesList[i].id)
                                    if (!isIncludes) {
                                        messages.push(data)
                                    }
                                }
                                let sorttedArray = messages.sort(function (a, b) {
                                    return b.id - a.id
                                })
                                setLoading(false)
                                setMessages(sorttedArray)
                            })
                            .catch((error) => {
                                setLoading(false)
                                console.log('create chatChannel Error:', error)
                            })

                        chatId ? null : setChatId(groups[i].id)
                        break
                    } catch (error) {
                        setLoading(false)
                        console.log('chatList Error:', error)
                    }
                }
            }
            loading ? setLoading(false) : null
        }
    }

    const creatChatG = async () => {
        if (isNewCaht) {
            try {
                const url = `${Chat_Api}api/conversations`
                const data = {
                    name: null,
                    members: [+params.userId.chat_id]
                }
                setLoading(false)
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${chatToken}`
                }
                await axios
                    .post(url, data, {headers})
                    .then((response) => {
                        const create = response.data
                        setIsNewChat(false)
                        setLoading(false)
                    })
                    .catch((error) => {
                        setLoading(false)
                        console.log('create chatChannel Error:', error)
                    })
            } catch (error) {
                setLoading(false)
                console.log('chatList Error:', error)
            }
        } else {
            setIsNewChat(false)
        }
    }
    const sendMessage = async (text) => {
        let id = params?.chatId ? params?.chatId : chatId
        const url = `${Chat_Api}api/apps/${id}/messages`
        const data = {
            text: text[0].text
        }
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${chatToken}`
        }
        await axios
            .post(url, data, {headers})
            .then((response) => {})
            .catch((error) => {
                console.log('send message Error:', error)
            })
    }
    const markedReadmessages = async (idChat, mesId) => {
        const url = `${Chat_Api}api/conversations${idChat}/mark?messageId={${mesId}}`

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${chatToken}`
        }
        await axios
            .put(url, {headers})
            .then(async (response) => {
                console.log('makred response', response.data)
            })
            .catch((error) => {
                setLoading(false)
                console.log('in read makred Error:', error)
            })
    }

    // const CustomSendButton = (props) => {
    //     return (
    //         <Send {...props} containerStyle={{borderWdidth: 0}}>
    //             <View>
    //                 <FastImage source={require('../../../assets/icons/bottomtab/send.png')} style={styles.sendIcon} resizeMode="contain" tintColor={Colors.Green} />
    //             </View>
    //         </Send>
    //     )
    // }

    return (
        <View style={styles.screen}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title="Chat" />
            {messages.length == 0 && (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'Start chating'}</Text>
                </View>
            )}
            <GiftedChat
                onSend={(messages) => sendMessage(messages)}
                renderUsernameOnMessage={true}
                messages={messages}
                scrollToBottom={true}
                showUserAvatar={true}
                renderAvatarOnTop={true}
                showAvatarForEveryMessage={true}
                onPressAvatar={(message) => {}}
                alwaysShowSend={true}
                // renderSend={(props) => <CustomSendButton {...props} />}
                containerStyle={{
                    backgroundColor: Colors.White,
                    borderTopWidth: wp(0.2),
                    borderTopColor: Colors.BorderGrey,
                    bottom: 0,
                    left: 0,
                    right: 0
                }}
                textInputProps={{
                    placeholderTextColor: Colors.DarkPepper_20,
                    color: Colors.Black,
                    returnKeyType: 'done'
                }}
                // textStyle={{
                //     color: Colors.MainThemeColor
                // }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        flex: 1
    },
    noDataWraper: {
        width: wp('100%'),
        top: hp('10'),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    sendIcon: {
        width: wp('6%'),
        height: hp('6%'),
        marginRight: wp('4%')
    }
})

export default memo(ChatRoomScreen)
