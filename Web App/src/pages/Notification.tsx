import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import { Flexed, Spacer, Text, MiddleLayout } from '../styled/shared'
import { useSelector } from 'react-redux'
import { palette } from '../styled/colors'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCommentOpen, setIsLoading } from '../actions/authActions'
import { deleteAllNotification, deleteNotification, notificationApi, readAllNotifications } from '../apis/apis'
import NotificationCard from '../components/NotificationCard'
import moment from 'moment-timezone'
import { toastError, toastSuccess } from '../styled/toastStyle'
import DeleteModal from '../components/modals/DeleteModal'

const Notification = ({ getAllNotificationCount }) => {
	const _isDarkTheme = useSelector<any>((state: any) => state.auth.isDarkTheme)
	let _navigate = useNavigate()
	const _dispatch = useDispatch()
	const [userNotifications, setUserNotification]: any = useState([])
	const [deleteNotificationModal, setDeleteNotificationModal] = useState(false)
	const [deleteAllNotificationsModal, setDeleteAllNotificationModal] = useState(false)
	const getNotification = async () => {
		_dispatch(setIsLoading(true))
		let response = await notificationApi()
		const groupedNotifications = response?.data?.data?.reduce((acc, notification) => {
			const type: any = moment(notification.createdAt).format('MMM D, YYYY')

			if (!acc[type]) {
				acc[type] = { label: type, data: [] }
			}

			acc[type].data.push(notification)

			return acc
		}, {})
		let finalArray = Object.values(groupedNotifications)

		setUserNotification(finalArray)
		_dispatch(setIsLoading(false))
	}

	useEffect(() => {
		getNotification()
	}, [])

	const markReadAll = async () => {
		_dispatch(setIsLoading(true))
		let response = await readAllNotifications()
		const groupedNotifications = response?.data?.data?.reduce((acc, notification) => {
			const type: any = moment(notification.createdAt).format('MMM D, YYYY')
			if (!acc[type]) {
				acc[type] = { label: type, data: [] }
			}
			acc[type].data.push(notification)
			return acc
		}, {})
		let finalArray = Object.values(groupedNotifications)
		setUserNotification(finalArray)
		_dispatch(setIsLoading(false))
		getAllNotificationCount()
	}

	const onDeleteNotification = async (id: any) => {
		_dispatch(setIsLoading(true))
		setDeleteNotificationModal(false)
		const response: any = await deleteNotification(id)
		if (response?.success) {
			getNotification()
			toastSuccess(response?.message)
			_dispatch(setIsLoading(false))
		} else {
			_dispatch(setIsLoading(false))
			toastError(response?.message)
		}
	}

	const onDeleteAllNotifications = async () => {
		setDeleteAllNotificationModal(false)
		_dispatch(setIsLoading(true))
		const response: any = await deleteAllNotification()
		if (response?.success) {
			getNotification()
			toastSuccess(response?.message)
			_dispatch(setIsLoading(false))
		} else {
			_dispatch(setIsLoading(false))
			toastError(response?.message)
		}
	}

	return (
		<Wrapper>
			<Main fluid>
				<Spacer height={1.25} />
				<Row justifyContent="center">
					<MiddleLayout xxl={7} xl={6} lg={10} >
						<Flexed direction="row" align="center" gap="0.5" justify="space-between">
							<Flexed direction="row" align="center" gap="0.5" >
								<Text
									pointer
									type="normal"
									fontWeight="500"
									color="gray"
									onClick={() => {
										_navigate('/products')
									}}>
									Home
								</Text>

								<img src="/images/icons/arrow.svg" alt="arrow" />

								<Text type="normal" fontWeight="500" color="black_100">
									Notification
								</Text>
							</Flexed>
							<Flexed direction="row">
								<Text
									fontSize="1"
									color="green_a"
									margin="1rem 0rem 0rem 0rem"
									pointer={true}
									onClick={() => {
										markReadAll()
									}}>
									Mark all as read
								</Text>
								<Text
									fontSize="1"
									color="green_a"
									margin="1rem 0rem 0rem 1rem"
									pointer={true}
									onClick={() => {
										setDeleteAllNotificationModal(true)
									}}>
									Delete all notifications
								</Text>
							</Flexed>
						</Flexed>
						<Spacer height={1.25} />
					</MiddleLayout>
				</Row>
				<Row justifyContent="center">
					<MiddleLayout xxl={7} xl={6} lg={10}>
						<NotificationSection isDarkTheme={_isDarkTheme} >
							<NotificationWrapper isDarkTheme={_isDarkTheme} className='p-md-4 p-2 rounded-4'>
								<NotificationBody>
									{userNotifications?.map((data, index) => {
										const isToday = moment(data.label).isSame(moment(), 'day')
										const isYesterday = moment(data.label).isSame(moment().subtract(1, 'days'), 'day')
										const formattedDate = isToday ? 'New' : isYesterday ? 'Yesterday' : moment(data.label).format('MMM D, YYYY')

										return (
											<ListWrapper key={index}>
												<Text type="normal" style={{ color: '#050505', fontWeight: "500" }} margin="0rem 0rem 0.625rem 0.625rem">
													{formattedDate}
												</Text>
												{data?.data?.map((re: any, ind: any) => {
													return <NotificationCard deleteNotificationModal={deleteNotificationModal} setDeleteNotificationModal={setDeleteNotificationModal} getAllNotificationCount={getAllNotificationCount} setCommentOpen={setCommentOpen} onDeleteNotification={onDeleteNotification} data={re} key={ind} />
												})}
											</ListWrapper>
										)
									})}
								</NotificationBody>
							</NotificationWrapper>
						</NotificationSection>
					</MiddleLayout>
				</Row>
				<Spacer height={2} />
			</Main>

			{deleteAllNotificationsModal && (<DeleteModal onClose={() => { setDeleteAllNotificationModal(false) }} title="Delete All Notifications"
				body="Are you sure you want to delete all notification?" onClick={() => { onDeleteAllNotifications() }} />)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	// background: ${palette.fbBg};
`

const Main = styled(Container)`
	padding-right: 0rem;
	padding-left: 0rem;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
`

const NotificationSection = styled.div<any>`
	overflow: hidden;
	position: -webkit-sticky; /* Safari */
	position: -webkit-sticky;
	position: sticky;
	top: 10rem;
`

const NotificationWrapper = styled.div<any>`
	background: ${palette.white};
`

const ListWrapper = styled.div<any>`
	&:not(:first-child) {
		margin-top: 1.25rem;
	}
`

const NotificationBody = styled.div`
	overflow-x: hidden;
	overflow-y: scroll;
	padding-bottom: 1rem;
	height: calc(100vh - 250px);
`

export default Notification
