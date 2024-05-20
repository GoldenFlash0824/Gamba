import React, { useEffect, useState } from 'react'
import { WeavyClient, WeavyProvider, Chat, Messenger, MessengerProvider, Posts, ConversationList, Conversation, WeavyContext } from '@weavy/uikit-react'
import { Col, Container, Row, media } from 'styled-bootstrap-grid'
import styled from 'styled-components'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Loader from './common/Loader'
import { addUsers, doGetUserProfile } from '../apis/apis'
import { Flexed, Text } from '../styled/shared'
import { useNavigate } from 'react-router-dom'
import useRouter from './useRouterHook'
import { toast } from 'react-toastify'
import { toastError } from '../styled/toastStyle'

function WeavyChat() {
	const userId = useSelector<any>((state: any) => state.auth.userId)
	const [loading, setLoading] = useState(false)
	const [userToken, setUserToken] = useState('')
	const _navigate = useNavigate()
	const environment = process.env.REACT_APP_PUBLIC_WEAVY_URL
	const apiKey = process.env.REACT_APP_PUBLIC_WEAVY_APIKEY
	const clientRef = React.useRef<WeavyClient | null>(null)
	const [conversactionId, setConversationId] = useState(null)
	const router: any = useRouter()
	let id = router.query['*'] ? parseInt(router.query['*']) : null

	useEffect(() => {
		if (userId) {
			initializeWeavyApp()
			// addUsers()
		}
	}, [userId])
	// console.log('router', router.query['*'])

	const initializeWeavyApp = async () => {
		const dbUserResponse: any = await doGetUserProfile()
		const name = dbUserResponse?.data?.first_name + ' ' + dbUserResponse?.data?.last_name
		// eslint-disable-next-line react-hooks/rules-of-hooks

		const headers = {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		}

		const url = `${environment}/api/apps/init`

		const data = {
			app: {
				uid: userId + 'a',
				name: name,
				type: 'chat',
				display_name: name
			},
			user: {
				uid: userId + 'a',
				name: name,
				display_name: name
			}
		}

		try {
			setLoading(true)
			const response = await axios.post(url, data, { headers })
			// const presence = await Weavy.presence.getUserPresence(user.id);

			let userUrl = `${environment}/api/users/${response.data?.uid}/tokens`

			const userResponse = await axios.post(
				userUrl,
				{
					name: name,
					expires_in: 7200
				},
				{ headers }
			)

			await axios
				.put(
					`${environment}/api/users/${response.data?.uid}`,
					{
						name: name,
						email: dbUserResponse?.data?.email,
						phone_number: dbUserResponse?.data?.phone,
						picture: dbUserResponse?.data?.image ? process.env.REACT_APP_PUBLIC_IMAGE_URL + dbUserResponse?.data?.image : process.env.REACT_APP_PUBLIC_IMAGE_URL + dbUserResponse?.data?.first_name[0].toLowerCase() + '.png',
						presence: 'active',
						metadata: {
							lat: dbUserResponse?.data?.lat,
							log: dbUserResponse?.data?.log
						}
					},
					{ headers }
				)
				.then((res) => res.data)
				.catch((err) => {
					setLoading(false)
					if (err?.response?.data?.detail) {
						toast.error(err?.response?.data?.detail)
					}
				})
			const updateHeader = {
				Authorization: `Bearer ${userResponse.data.access_token}`,
				'Content-Type': 'application/json'
			}
			let userDetails = await axios.get(`${environment}/api/users/${response.data?.uid}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userResponse.data.access_token}`
				}
			})
			console.log('userDetails=======', userDetails)

			if (id) {
				const url = `${environment}/api/conversations`
				const headers = {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userResponse.data.access_token}`
				}

				let _userDetails = await axios.get(`${environment}/api/users/${id}`, { headers })
				console.log('=======', _userDetails)
				await axios
					.get(url, { headers })
					.then(async (response) => {
						const chatList = response.data.data
						console.log('======= chatList', chatList)
						let isGroup = chatList?.find((e: any) => e.display_name == _userDetails?.data?.display_name)
						console.log('isGroup', isGroup)
						if (isGroup == null) {
							let conversation = await axios
								.post(`${environment}/api/conversations`, { members: [_userDetails?.data?.id] }, { headers: updateHeader })
								.then((res) => res.data)
								.catch((err) => {
									setLoading(false)
								})
							setConversationId(conversation?.data?.id)
						} else {
							setConversationId(isGroup?.id)
						}
					})
					.catch((error) => {
						setLoading(false)
						console.log('chatList Error:', error)
					})
			}
			console.log(userResponse.data.access_token);
			setUserToken(userResponse.data.access_token)
			setLoading(false)
		} catch (error: any) {
			setLoading(false)
			toastError('Chat initializing failed')
			console.error('App initialization failed:', error)
		}
	}

	useEffect(() => {
		if (userToken && environment) {
			const client = new WeavyClient({
				url: environment,
				tokenFactory: async () => userToken
			})

			clientRef.current = client
			getNotifications()
		}
	}, [userToken, environment])

	const getNotifications = async () => {
		const headers = {
			Authorization: `Bearer ${userToken}`
		}
		// const getConversations = await axios.get(`https://375bda9517554a35abfb864ece0fbb38.weavy.io/api/conversations?contextual=false&skip=0&top=25`, {headers})
		const getNotification = await axios.get(`${environment}/api/notifications`, { headers })
		const response = await axios.get(`${environment}/api/notifications?top=10&unread=true`, { headers })
		const notifications = response.data

		console.log('notifications', notifications)
		console.log('getNotifications', getNotification.data)
	}

	return (
		<>
			{loading && <Loader visible={loading} />}

			<Main fluid>
				<Flexed direction="row" align="center" gap="0.5" margin="1.25rem 0rem">
					<>
						<Text
							pointer
							fontWeight={500}
							type="normal"
							color="gray"
							onClick={() => {
								_navigate('/')
							}}>
							Home
						</Text>
						<img src="/images/icons/arrow.svg" alt="arrow" />
					</>

					<Text fontWeight={500} type="normal" color="black_100">
						Chat
					</Text>
				</Flexed>
				<Row>
					<Col id={'abc'}>
						{userToken && environment ? (
							<WeavyProvider client={clientRef.current}>
								<MessengerProvider>
									<ChatWrapper>
										<ChatList className='chat-list'>
											<ConversationList />
										</ChatList>
										<ChatWindow>
											<Conversation id={conversactionId} />
										</ChatWindow>
									</ChatWrapper>
								</MessengerProvider>
							</WeavyProvider>
						) : (
							<div></div>
						)}
					</Col>
				</Row>
			</Main>
		</>
	)
}

const Main = styled(Container)`
	padding-right: 0rem;
	padding-left: 0rem;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
`

const ChatWrapper = styled.div`
	display: flex;
	flex-direction: row;
	gap: 1rem;
	@media screen and (min-width: 0px) and (max-width: 767px) {
		flex-direction: column;
		
	}
	// height: calc( 100vh - 150px )
	${media.lg`
	height: calc( 100vh - 150px )
	`};
	`

const ChatList = styled.div`
	width: 28.5rem;
	@media screen and (min-width: 0px) and (max-width: 767px) {
		width: 100%;
		margin-bottom: 2rem;
	}
	background-color: #ffffff;
	border-radius: 12px;
	box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
	overflow: hidden;
	border: 1px solid rgb(221 221 234);
	
`

const ChatWindow = styled.div`
	width: calc(100% - 19rem);
	overflow: hidden;
	@media screen and (min-width: 0px) and (max-width: 767px) {
		width: 100%;
	}
	background-color: #ffffff;
	border-radius: 12px;
	margin-bottom: 2rem;
	box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
	height: 100%;
	border: 1px solid rgb(221 221 234);
`

export default WeavyChat
