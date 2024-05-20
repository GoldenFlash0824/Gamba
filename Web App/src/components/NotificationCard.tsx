import React, {useEffect, useState} from 'react'
import {palette} from '../styled/colors'
import styled from 'styled-components'
import {Flexed, Text} from '../styled/shared'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {colorPicker} from './utils'
import moment from 'moment-timezone'
import {readSingleNotifications} from '../apis/apis'

const NotificationCard = ({data, setCommentOpen, getAllNotificationCount}: any) => {
	let _navigate = useNavigate()
	const _dispatch = useDispatch()

	const startDate = moment()
	const diffrenceInSeconds = moment(startDate).diff(moment(data?.createdAt), 'second')
	const _days = moment(startDate).diff(moment(data?.createdAt), 'day')
	const _minutes = moment(startDate).diff(moment(data?.createdAt), 'minutes')
	const _hours = moment(startDate).diff(moment(data?.createdAt), 'hour')
	const [name, setName] = useState(data?.user_data_notification?.first_name + ' ' + data?.user_data_notification?.last_name)

	const [minutes, setMinutes]: any[] = useState()
	const [seconds, setSeconds]: any[] = useState()
	const [hours, setHours]: any[] = useState()
	const [days, setDays]: any[] = useState()

	useEffect(() => {
		if (!Number.isNaN(diffrenceInSeconds)) {
			setSeconds(diffrenceInSeconds)
			setMinutes(_minutes)
			setHours(_hours)
			setDays(_days)
		}
	}, [diffrenceInSeconds, _days, _hours, _minutes])
	const [color, setColor] = useState<any>('')

	useEffect(() => {
		if (data) {
			getColor()
			setName(data?.user_data_notification?.first_name)
			// setProfileImg(data?.user_data_notification?.image)
		}
	}, [data])

	const getColor = async () => {
		let color = await colorPicker(name[0].toLowerCase())
		setColor(color)
		return color
	}

	const CircularNotificationIcon = () => {
		const createdAtDate = moment(data.createdAt).startOf('day')
		const today = moment().startOf('day')
		const yesterday = moment().subtract(1, 'days').startOf('day')

		let notificationText = ''
		if (createdAtDate.isSame(today, 'd')) {
			notificationText = 'New'
		} else if (createdAtDate.isSame(yesterday, 'd')) {
			notificationText = 'Yesterday'
		} else {
			notificationText = createdAtDate.format('MM/DD/YYYY')
		}

		return <div className="notification-icon">{notificationText}</div>
	}

	return (
		<>
			<Notifications
				// key={index}
				//##
				onClick={() => {
					if (data?.type === 'comments on your post') {
						_navigate(`/post/${data?.post_data_notification?.id}`)
						_dispatch(setCommentOpen(true))
						readSingleNotifications(data?.id)
						getAllNotificationCount()
					}
					if (data?.type === 'checkout successfull') {
						_navigate(`/products/${data?.product_detail_notification?.id}`)
						readSingleNotifications(data?.id)
						getAllNotificationCount()
					}
					if (data?.type === 'replied on your comments') {
						_navigate(`/post/${data?.post_data_notification?.id}`)
						_dispatch(setCommentOpen(true))
						readSingleNotifications(data?.id)
						getAllNotificationCount()
					} else if (data?.type === 'like your Post') {
						_navigate(`/post/${data?.post_data_notification?.id}`)
						readSingleNotifications(data?.id)
						getAllNotificationCount()
					} else if (data?.type === 'Join your event') {
						_navigate(`/calendar?id=${data?.event_id}`)
						readSingleNotifications(data?.id)
						getAllNotificationCount()
					} else if (data?.type === 'Event Information is Updated') {
						_navigate(`/calendar?id=${data?.event_id}`)
						readSingleNotifications(data?.id)
						getAllNotificationCount()
					}
				}}>
				<Flexed direction="row" style={{justifyContent: 'space-between', width: '100%'}} gap={0.5}>
					<div className='d-flex gap-2'>
					<CommentsUserProfile styledColor={color}>
						{data?.user_data_notification?.image && data?.user_data_notification?.image !== null ? (
							<img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${data?.user_data_notification?.image}`} alt="profile" />
						) : (
							<CustomText type="small" color="white">
								{name && name[0].toUpperCase()}
							</CustomText>
						)}
					</CommentsUserProfile>

					<div style={{display: 'flex', justifyContent: ''}} className='gap-1 flex-column '>
						<div className='d-flex align-items-start gap-1'>
							<Text type="" color="black"  style={{color: "#050505" , fontWeight: '600'}}>
								{data?.user_data_notification?.first_name}
							</Text>
							<CustomStyledText  fontSize="0.85">{data?.message}</CustomStyledText>
						</div>
						<div style={{display: 'block', justifyContent: 'flex-end', alignContent: 'flex-end', alignItems: 'flex-end'}}>
					
					<Text style={{color: "#0866ff" , fontWeight: '600'}} fontSize="0.75">
						{days && days >= 0 && diffrenceInSeconds > 0 ? (
							<span>
								{days} {days === 1 ? ' day ago' : ' days ago'}
							</span>
						) : hours && hours >= 0 && diffrenceInSeconds > 0 ? (
							<span>
								{hours}
								{hours === 1 ? ' hour ago' : ' hours ago'}
							</span>
						) : minutes && minutes >= '0' && diffrenceInSeconds > 0 ? (
							<span>
								{minutes}
								{minutes === 1 ? ' minute ago' : ' minutes ago'}
							</span>
						) : seconds && seconds >= '0' && diffrenceInSeconds > 0 ? (
							<span>{seconds} seconds ago </span>
						) : (
							<span>expired</span>
						)}
					</Text>
				</div>
					</div>
					</div>
					<div className='d-block'>
					{!data?.is_read && <NewMessageCircle />}
					</div>
				</Flexed>
						
					{/* <div style={{display: 'block', justifyContent: 'flex-end', alignContent: 'flex-end', alignItems: 'flex-end'}}>
						{!data?.is_read && <NewMessageCircle />}
						<Text color="comment_text_col" fontSize="0.825">
							{days && days >= 0 && diffrenceInSeconds > 0 ? (
								<span>
									{days} {days === 1 ? ' day ago' : ' days ago'}
								</span>
							) : hours && hours >= 0 && diffrenceInSeconds > 0 ? (
								<span>
									{hours}
									{hours === 1 ? ' hour ago' : ' hours ago'}
								</span>
							) : minutes && minutes >= '0' && diffrenceInSeconds > 0 ? (
								<span>
									{minutes}
									{minutes === 1 ? ' minute ago' : ' minutes ago'}
								</span>
							) : seconds && seconds >= '0' && diffrenceInSeconds > 0 ? (
								<span>{seconds} seconds ago </span>
							) : (
								<span>expired</span>
							)}
						</Text>
					</div> */}
			</Notifications>
		</>
	)
}

const CustomText = styled(Text)`
	color: ${palette?.white};
`

const CustomStyledText = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	// width: 16.813rem;
	white-space: nowrap;
	color: rgb(140 140 140);
`

const Notifications = styled.div<any>`
	color: ${({isDarkTheme}) => (isDarkTheme ? palette.text_black : palette.text_black)};
	font-size: 0.875rem;
	padding: 0.875rem 0.625rem;
	text-decoration: none;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: ${palette.white};
	// border: 0.063rem solid ${palette.stroke};
	border-radius: 12px;
	margin-bottom: 0.1325rem;
	gap: 0.5rem;
	&:hover {
		background-color: ${palette.gray_200};
		cursor: pointer;
		transition: color 0.1s ease 0.1s;
	}
`

const CommentsUserProfile = styled.div<any>`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 100%;
	overflow: hidden;
	background-color: ${({styledColor}) => (styledColor ? `${styledColor}` : palette.red)};

	color: ${palette.text};
	display: flex;
	align-self: center;
	justify-content: center;
	align-items: center;
	& > img {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 100%;
		object-fit: cover;
	}
`

const NewMessageCircle = styled.circle`
	background-color: #0866ff;
	width: 12px;
	height: 12px;
	border-radius: 100%;
	display: inline-block;
	position: relative;
	border-radius: 50%;
	// right: -2.5rem;
	// top: -0.5rem;
`

export default NotificationCard
