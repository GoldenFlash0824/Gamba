import React, { useEffect, useState } from 'react'
import { palette } from '../../styled/colors'
import styled from 'styled-components'
import { Text, Flexed, Spacer, getDistanceFromLatLonInMiles } from '../../styled/shared'
import { media } from 'styled-bootstrap-grid'
import EventMedia from './EventMedia'
import EditPostModal from '../modals/EditPostModal'
import moment from 'moment-timezone'
import { useNavigate } from 'react-router-dom'
import ReportModal from '../modals/ReportModal'
import { UnJoinEvent, deleteEvent, joinEvent } from '../../apis/apis'
import { toastError, toastSuccess } from '../../styled/toastStyle'
import DeleteModal from '../modals/DeleteModal'
import JoinEventModal from '../modals/JoinEventModal'
import StoriesCardEvent from '../StoryCardEvent'
import { useSelector } from 'react-redux'
import SocialShareModal from '../modals/SocialShareModal'
import HideModal from '../modals/HideModal'
import { setIsLoading } from '../../actions/authActions'
import { useDispatch } from 'react-redux'
import MapModal from '../modals/MapModal'
import { colorPicker } from '../utils'
import LoginPopupModel from '../modals/LoginPopupModel'
import { addEvent, clearEvent } from '../../actions/eventActions'

const Events = ({ data, index, allEvents, selectCategory, onEdit, setUserId, getAllEvents, setSellerId, parent }: any) => {
	const _navigate = useNavigate()
	const _dispatch = useDispatch()

	const userId = useSelector<any>((state: any) => state.auth.userId)
	const authToken = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [isMapModalOpen, setIsMapModalOpen] = useState(false)

	const [isHideModalOpen, setIsHideModalOpen] = useState(false)

	const [openSocialModal, setOpenSocialModal] = useState(false)
	const [openEditEventModal, setOpenEditEventModal] = useState(false)
	const [openDeletePostModal, setOpenDeletePostModal] = useState(false)
	const [reportEvent, setreportEvent] = useState(false)
	const [readMore, setReadMore] = useState(false)
	const [isJoinMe, setIsJoinMe] = useState(data?.isJoinMe)
	const [eventJoinedUsers, setEventJoinedUsers] = useState(data?.joinEvent)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const [openJoinEventModal, setOpenJoinEventModal] = useState(false)
	const [remainingData, setRemainingData] = useState<any[]>([])
	const [loginPopup, setLoginPopup] = useState(false)
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')

	let _startDate = moment(data?.start_date).format('MM-DD-YYYY')
	let _endDate = moment(data?.end_date).format('MM-DD-YYYY')

	const [distanceInMiles, setDistanceInMiles]: any = useState('')

	useEffect(() => {
		doGetDistanceFromLatLonInMiles()
		_dispatch(clearEvent())
	}, [])

	const doGetDistanceFromLatLonInMiles = async () => {
		if (data?.eventUser?.log && data?.eventUser?.lat && _userLocation.lat && _userLocation.log) {
			const res = await getDistanceFromLatLonInMiles(data?.eventUser?.lat, data?.eventUser?.log, _userLocation?.lat ? _userLocation?.lat : 0, _userLocation?.log ? _userLocation?.log : 0)
			setDistanceInMiles(res)
		} else {
			setDistanceInMiles('N / A')
		}
	}

	const onDeleteEvent = async () => {
		_dispatch(setIsLoading(true))
		setOpenDeletePostModal(false)
		const response: any = await deleteEvent(data?.id)
		if (response?.success) {
			toastSuccess(response?.message)
			onEdit()
		} else {
			toastError(response?.message)
		}
		_dispatch(setIsLoading(false))
	}

	const joinEventhandler = async (event_id, payment_id) => {
		if (isUserLogIn == null) {
			setLoginPopup(true)
		} else {
			if (data?.price === 0 || data?.paid.includes(userId)) {
				_dispatch(setIsLoading(true))
				let info: any = await joinEvent(event_id, payment_id)
				if (info?.success) {
					setIsJoinMe(info?.data?.isJoinMe)
					setEventJoinedUsers(info?.data?.joinEvent)
					_dispatch(setIsLoading(false))
					toastSuccess(info.message)
				} else {
					_dispatch(setIsLoading(false))
					toastError(info.message)
				}
			} else {
				toastError('You have to pay first')
			}
		}
	}

	const UnJoinEventhandler = async (event_id, payment_id) => {
		if (isUserLogIn == null) {
			setLoginPopup(true)
		} else {
			_dispatch(setIsLoading(true))

			let info: any = await UnJoinEvent(event_id, payment_id)
			setIsJoinMe(info?.data?.isJoinMe)
			setEventJoinedUsers(info?.data?.joinEvent)

			_dispatch(setIsLoading(false))

			toastSuccess(info.message)

		}
	}

	const handlePay = () => {
		if (isUserLogIn === null) {
			setLoginPopup(true)
		} else {
			_dispatch(addEvent(data))
			_navigate('/place-order', {
				state: 'event'
			})
		}
	}

	const parsedDate = moment(data?.end_date)
	const parseStartdDate = moment(data?.start_date)

	return (
		<>
			<Wrapper key={index + 'productList'}>
				<EventMedia image={data?.image} />
				<CardBody>
					<Flexed direction="row" justify="space-between" align={'baseline'} gap={.5}>
						<div>
							<Title marginBottom="0.675" color="black" fontWeight={700} style={{ gap: '0.2rem', marginBottom: '0.675rem' }} textTransform="capitalize">
								<span style={{ fontSize: '1.125rem' }}>{data?.title}</span>
								<span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'rgb(67, 67, 67)' }}>
									By {data?.eventUser?.first_name} {data?.eventUser?.last_name}
								</span>
							</Title>
							<div className='d-flex align-items-center '>
								<img src="/images/icons/time.svg" alt="time" />
								<Text type="small" opacity='0.5' fontSize="0.8" color="black_100" lineHeight={1.125}>
									{_startDate == _endDate ? (
										<span>
											{parseStartdDate.format('MM-DD-YY [at] hh:mm A')}
											&nbsp; ends {parsedDate.format('hh:mm A')}
										</span>
									) : (
										parseStartdDate.format('MM-DD-YY [at] hh:mm A')
									)}
									&nbsp; {_startDate !== _endDate && `ends ` + parsedDate.format('MM-DD-YY [at] hh:mm A')}
								</Text>
							</div>
						</div>
						<RightFlexed direction="row" align="center" gap={0.25}>
							<ActionFlexed direction="row" align="center">
								{userId !== data?.u_id ? (
									<JoinDrop>
										<JoinButton
											active={isJoinMe}
											onClick={() => {
												if (isJoinMe) {
													UnJoinEventhandler(data?.id, 1)
												} else {
													joinEventhandler(data?.id, 1)
												}
											}}>
											{isJoinMe ? `Joined (${eventJoinedUsers?.length ? eventJoinedUsers?.length : '0'})` : `Join (${eventJoinedUsers?.length ? eventJoinedUsers?.length : '0'})`}
										</JoinButton>
										<JoinContent>
											{eventJoinedUsers?.length
												? eventJoinedUsers.map((user) => {
													return (
														<JointList>
															<Flexed
																direction="row"
																gap={0.5}
																align="center"
																onClick={() => {
																	setSellerId(user?.joinEventUser?.id)
																	_navigate('/products')
																}}>
																<ProfileWrapper user={user} />
																{user.joinEventUser.first_name + ' ' + user.joinEventUser.last_name}
															</Flexed>
															<img
																onClick={() => {
																	_navigate(`/chat/${user?.joinEventUser?.chat_id}`)
																}}
																src="/images/icons/chat-dots-svg.svg"
																alt="chat"
															/>
														</JointList>
													)
												})
												: ''}
										</JoinContent>
									</JoinDrop>
								) : (
									<JoinDrop>
										<JoinButton>Joined ({eventJoinedUsers?.length ? eventJoinedUsers?.length : '0'})</JoinButton>
										<JoinContent>
											{eventJoinedUsers.map((user) => {
												return (
													<JointList>
														<Flexed
															direction="row"
															gap={0.5}
															align="center"
															onClick={() => {
																setSellerId(user?.joinEventUser?.id)
																_navigate('/products')
															}}>
															<ProfileWrapper user={user} />
															{user.joinEventUser.first_name + ' ' + user.joinEventUser.last_name}
														</Flexed>
														<img
															onClick={() => {
																_navigate(`/chat/${user?.joinEventUser?.chat_id}`)
															}}
															src="/images/icons/chat-dots-svg.svg"
															alt="chat"
														/>
													</JointList>
												)
											})}
										</JoinContent>
									</JoinDrop>
								)}
								{isUserLogIn !== null && (
									<>
										<Drop className='dots-v-hover'>
											<img src="/images/icons/dots.svg" alt="dots" />
											<DropContent>
												{userId !== data?.u_id && (
													<DropMenu className="d-flex align-items-center gap-2"
														onClick={() => {
															isUserLogIn !== null ? setIsHideModalOpen(true) : setLoginPopup(true)
														}}>
														<svg width="16" height="14" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" fill='#5B626A' /></svg>
														Hide
													</DropMenu>
												)}

												<DropMenu className="d-flex align-items-center gap-2"
													onClick={() => {
														isUserLogIn !== null ? setOpenSocialModal(true) : setLoginPopup(true)
													}}>
													<svg width="14" height="14" viewBox="0 0 448 512"><path d="M448 128c0 53-43 96-96 96c-28.9 0-54.8-12.8-72.4-33l-89.7 44.9c1.4 6.5 2.1 13.2 2.1 20.1s-.7 13.6-2.1 20.1L279.6 321c17.6-20.2 43.5-33 72.4-33c53 0 96 43 96 96s-43 96-96 96s-96-43-96-96c0-6.9 .7-13.6 2.1-20.1L168.4 319c-17.6 20.2-43.5 33-72.4 33c-53 0-96-43-96-96s43-96 96-96c28.9 0 54.8 12.8 72.4 33l89.7-44.9c-1.4-6.5-2.1-13.2-2.1-20.1c0-53 43-96 96-96s96 43 96 96zM96 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM400 128a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM352 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" fill='#5B626A' /></svg>
													Share{' '}

												</DropMenu>

												{userId !== data?.u_id && (
													<DropMenu className="d-flex align-items-center gap-2"
														onClick={() => {
															isUserLogIn !== null ? setreportEvent(true) : setLoginPopup(true)
														}}>
														<svg width="14" height="14" viewBox="0 0 512 512"><path d="M248.4 84.3c1.6-2.7 4.5-4.3 7.6-4.3s6 1.6 7.6 4.3L461.9 410c1.4 2.3 2.1 4.9 2.1 7.5c0 8-6.5 14.5-14.5 14.5H62.5c-8 0-14.5-6.5-14.5-14.5c0-2.7 .7-5.3 2.1-7.5L248.4 84.3zm-41-25L9.1 385c-6 9.8-9.1 21-9.1 32.5C0 452 28 480 62.5 480h387c34.5 0 62.5-28 62.5-62.5c0-11.5-3.2-22.7-9.1-32.5L304.6 59.3C294.3 42.4 275.9 32 256 32s-38.3 10.4-48.6 27.3zM288 368a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-8-184c0-13.3-10.7-24-24-24s-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24V184z" fill='#5B626A' /></svg>
														Report
													</DropMenu>
												)}

												{userId === data?.u_id && (
													<DropMenu className="d-flex align-items-center gap-2"
														onClick={() => {
															isUserLogIn !== null ? setOpenEditEventModal(true) : setLoginPopup(true)
														}}>
														<svg width="14" height="14" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" fill='#5B626A' /></svg>
														Edit
													</DropMenu>
												)}
												{userId === data?.u_id && (
													<DropMenu className="d-flex align-items-center gap-2"
														onClick={() => {
															isUserLogIn !== null ? setOpenDeletePostModal(true) : setLoginPopup(true)
														}}>
														<svg width="14" height="14" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" fill='#5B626A' /></svg>
														Delete
													</DropMenu>
												)}
												{/* <DropMenu onClick={() => {}}>Hide </DropMenu> */}
											</DropContent>
										</Drop>
									</>
								)}
							</ActionFlexed>
						</RightFlexed>
					</Flexed>
					<Flexed direction="row" gap={0.5} align="center" justify="space-between" flexWrap="wrap">
						<div>
							<Flexed direction="row" gap={0.1} align="flex-start" pointer onClick={() => setIsMapModalOpen(true)}>
								<img src="/images/icons/location.svg" alt="location" />
								<Text type="small" opacity='0.5' fontSize="0.8" color="black_100" lineHeight={1.125}>
									{!data?.is_private && data?.location.includes(',') ? data.location.slice(data.location.indexOf(',') + 1, data?.location.length) : data?.location}, &nbsp; {distanceInMiles ? `${distanceInMiles}` : '0 ft.'}
								</Text>
							</Flexed>
						</div>
					</Flexed>
					<Flexed direction="row" gap={0.5} align="center" className="mt-2">
						<EventPrice direction="row" gap={0.25} align="center">
							<img width="23px" src="/images/icons/price_tag.svg" alt="price_tag" />
							<Text type="large" color="black_100">
								${data?.price}
							</Text>
						</EventPrice>
						{(data?.price > 0 && data?.eventUser?.id !== userId && !data?.paid.includes(userId)) ? <Button className='ml-2' onClick={() => { handlePay() }}>Pay</Button> : <></>}
					</Flexed>
					<Spacer height={0.438} />
					{parent && data?.status && (
						<div>
							status: <span style={{ color: 'red' }}>Blocked</span>
						</div>
					)}

					<Details>
						<Summary readMore={readMore} type="small" color="gray" fontWeight={500}>
							{data?.summary}
						</Summary>
						{!readMore && (
							<ReadMore
								onClick={() => {
									setReadMore(true)
								}}
							/>
						)}
					</Details>
				</CardBody>

				{openEditEventModal && (
					<EditPostModal
						data={data}
						openEditEventModal={openEditEventModal}
						onClose={() => {
							setOpenEditEventModal(false)
						}}
						onUpdate={() => onEdit()}
					/>
				)}
				{reportEvent && (
					<ReportModal
						data={data}
						button={'Report Event'}
						onClose={() => {
							setreportEvent(false)
						}}
					/>
				)}

				{openSocialModal && (
					<SocialShareModal
						event
						eventData={data}
						onClose={() => {
							setOpenSocialModal(false)
						}}
					/>
				)}
				{isMapModalOpen && (
					<MapModal
						data={data}
						onCloseModal={() => {
							setIsMapModalOpen(false)
						}}
					/>
				)}
				{isHideModalOpen && (
					<HideModal
						getAllEvents={getAllEvents}
						event={true}
						eventId={data?.id}
						onClose={() => {
							setIsHideModalOpen(false)
						}}
					/>
				)}

				{openDeletePostModal && <DeleteModal onClose={() => setOpenDeletePostModal(false)} title={'Delete Event?'} body={'Are you sure you wan to delete this Event?'} onClick={() => onDeleteEvent()} />}
				{openJoinEventModal && <JoinEventModal onClose={() => setOpenJoinEventModal(false)} data={remainingData} setUserId={setUserId} />}

				{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
			</Wrapper >
		</>
	)
}

const ProfileWrapper = ({ user }) => {
	const [color, setColor] = useState<any>('')
	const getColor = async () => {
		let color = await colorPicker(user?.joinEventUser?.first_name ? user?.joinEventUser?.first_name[0]?.toLowerCase() : 'n')
		setColor(color)
		return color
	}
	useEffect(() => {
		getColor()
	}, [user])

	return (
		<Profile styledColor={color}>
			{user?.joinEventUser?.image ? (
				<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${user?.joinEventUser.image}`} />
			) : (
				<CustomText styledColor={palette.white} type="small">
					{user?.joinEventUser?.first_name && user.joinEventUser.first_name[0].toUpperCase()}
				</CustomText>
			)}
		</Profile>
	)
}
const Wrapper = styled.div`
	border: 1px solid ${palette.stroke};
	background-color: ${palette.white};
	border-radius: 1.25rem;
	margin-bottom: 1.5rem;
	&:not(:last-child) {
		margin-bottom: 1.5rem;
	}
`
const CardBody = styled(Flexed)`
	padding: 1.25rem;
	${media.md`	padding: 1rem 1rem 1rem 1rem;`};
`
const CardWrapper = styled.div<any>`
	padding: 1rem 1rem;
	/* background-color: ${palette.card_bg}; */
	border-bottom: 0.063rem solid ${palette.fbBg};
	transition: border 0.1s ease 0.1s;
`

const Details = styled.div`
	position: relative;
`

const Summary = styled(Text) <any>`
	max-width: 100%;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	white-space: pre-wrap;
	overflow: hidden;
	-webkit-line-clamp: ${({ readMore }) => (readMore ? 'auto' : '2')};
	// height: ${({ readMore }) => (readMore ? 'auto' : '2.2rem')};
	// min-height: 2.2rem;
`

const ReadMore = styled.div`
	position: absolute;
	background-image: linear-gradient(to right, rgba(255, 0, 0, 0), rgb(255 255 255) 87%);
	width: 8rem;
	height: 1rem;
	cursor: pointer;
	bottom: 0;
	right: 0;
`

const DropContent = styled.div<any>`
	display: none;
	margin-top: 0rem;
	position: absolute;
	right: 0;
	background-color: ${({ isDarkTheme }) => (isDarkTheme ? palette.black : palette.white)};
	min-width: 8rem;
	box-shadow: ${palette.shadow};
	z-index: 1;
	border-radius: 0.5rem;
	overflow: hidden;
`

const Drop = styled.div`
	position: relative;
	& img {
		cursor: pointer;
		width: 23px;
	}
	&:hover ${DropContent} {
		display: block;
	}
`

const DropMenu = styled.span<any>`
	color: ${palette.text};
	font-size: 0.875rem;
	padding: 0.425rem 1rem 0.425rem 0.8rem;
	text-decoration: none;
	display: block;
	background-color: ${palette.white};
	text-align: left;
	cursor: pointer;
	&:hover {
		color: ${palette.orange};
		background: ${palette.fbBg};

		transition: color 0.1s ease 0.1s;
	}
`

const Title = styled(Text)`
	// overflow: hidden;
	// white-space: nowrap;
	// width: 15rem;
	font-size: 16px;
	line-height: normal;
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem;
	flex-direction : column;
	align-items: start;
	${media.sm`width: 20rem;font-size: 16px;`};
	${media.md`width: 22rem;font-size: 20px;`};
	text-overflow: ellipsis;
`

const JoinContent = styled(DropContent) <any>`
	bottom: -2.5srem;
	max-height: 20rem;
	overflow: auto;
	width: max-content;
`

const JoinDrop = styled.div`
	position: relative;
	
	&:hover ${JoinContent} {
		display: block;
	}
`
const JointList = styled(Flexed) <any>`
	color: ${palette.black_200};
	font-size: 0.875rem;
	padding: 0.425rem 1rem 0.425rem 0.8rem;
	text-decoration: none;
	flex-direction: row;
	gap: 1rem;
	align-items: center;
	justify-content: space-between;
	background-color: ${palette.white};
	text-align: left;
	cursor: pointer;
	&:hover {
		transition: color 0.1s ease 0.1s;
		background: ${palette.gray_200};
	}
`

const Button = styled.div`
	background: ${palette.Btn_dark_green};
	color: ${palette.white};
	border: 1px solid ${palette.Btn_dark_green};
	font-weight: 500;
	padding: 0.4rem 2rem;
	font-size: 0.85rem;
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	cursor: pointer;
	justify-content: center;
	&:hover {
		background-color: ${palette.white};
		color: ${palette.Btn_dark_green};
	}
`

const JoinButton = styled.div<any>`
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	padding: 0rem 0.5rem;
	min-height: 1rem;
	justify-content: center;
	text-align: center;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	background: ${palette.green_300};
	color: ${({ active }) => (active ? ` ${palette.gray}; !important` : palette.green_200)};
	border-radius: 1.25rem;
	&:hover {
		color: ${palette.green_200};
	}
	cursor: pointer;

	&:hover ${JoinContent} {
		display: block;
	}
`

const Profile = styled.div<any>`
	height: 1.8rem;
	width: 1.8rem;
	border-radius: 100%;
	// overflow: hidden;
	/* background: ${palette.Btn_dark_green}; */
	background: ${({ styledColor }) => (styledColor ? `${styledColor} !important` : palette.Btn_dark_green)};
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	position: relative;
`

const Img = styled.img<any>`
	object-fit: cover;
	border-radius: 100%;
	width: 100%;
	height: 100%;
`

const CustomText = styled(Text)`
	color: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.red)};
`

const EventPrice = styled(Flexed)`
	${media.sm`margin:0rem 0rem 0rem 0rem`};
	@media screen and (min-width: 0px) and (max-width: 670px) {
		margin-right: 0.5rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1320px) {
		margin-right: 0.5rem;
	}
`

const ActionFlexed = styled(Flexed)`
	${media.sm`gap:1.25rem`};
	${media.lg`gap:1rem`};
	${media.xxl`gap:1.25rem`};
`
const RightFlexed = styled(Flexed)`
	${media.sm`gap:1.25rem`};
	@media screen and (min-width: 0px) and (max-width: 670px) {
		flex-direction: column-reverse;
		align-items: flex-end;
		gap: 0.5rem;
		justify-content: start;
	}
	@media screen and (min-width: 1200px) and (max-width: 1320px) {
		flex-direction: column-reverse;
		align-items: flex-end;
		gap: 0.5rem;
		justify-content: start;
	}
`

export default Events
