import React, { useEffect, useState } from 'react'
import { palette } from '../../styled/colors'
import styled from 'styled-components'
import { Text, Flexed, getDistanceFromLatLonInMiles } from '../../styled/shared'
import { BsThreeDots } from 'react-icons/bs'
import { IoLocation } from 'react-icons/io5'
import SocialShareModal from '../modals/SocialShareModal'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import EditPostModal from '../modals/EditPostModal'
import { useNavigate } from 'react-router-dom'
import { BsFillChatSquareTextFill } from 'react-icons/bs'
import EditPost from '../modals/EditPost'
import { colorPicker } from '../utils'
import ReportModal from '../modals/ReportModal'
import { deletePost } from '../../apis/apis'
import { toastError, toastSuccess } from '../../styled/toastStyle'
import DeleteModal from '../modals/DeleteModal'
import HideModal from '../modals/HideModal'
import { setIsLoading } from '../../actions/authActions'
import { useDispatch } from 'react-redux'
import LoginPopupModel from '../modals/LoginPopupModel'
import moment from 'moment-timezone'

const PostProfile = ({ data, setSellerId, events, getAllUserAndPosts, setUserId, userId, postData, onEdit }: any) => {
	const [name, setName] = useState(data?.first_name + ' ' + data?.last_name)
	const [city, setCity] = useState(data?.location)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const _navigate = useNavigate()
	const _dispatch = useDispatch()
	const [profileImg, setProfileImg] = useState(data?.image)
	const [openSocialModal, setOpenSocialModal] = useState(false)
	const [reportPostModel, setreportPostModel] = useState(false)
	const [openEditPostModal, setOpenEditPostModal] = useState(false)

	const [isHideModalOpen, setIsHideModalOpen] = useState(false)
	const [openEditEventModal, setOpenEditEventModal] = useState(false)
	const [openDeletePostModal, setOpenDeletePostModal] = useState(false)
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')
	const [color, setColor] = useState<any>('')
	const [distanceInMiles, setDistanceInMiles]: any = useState('')
	const [loginPopup, setLoginPopup] = useState(false)
	const startDate = moment()

	const diffrenceInSeconds = moment(startDate).diff(moment(data?.createdAt), 'second')
	const _days = moment(startDate).diff(moment(data?.createdAt), 'day')
	const _minutes = moment(startDate).diff(moment(data?.createdAt), 'minutes')
	const _hours = moment(startDate).diff(moment(data?.createdAt), 'hour')
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

	useEffect(() => {
		if (data) {
			getColor()
			setCity(data?.location)
			setName(data?.first_name + ' ' + data?.last_name)
			setProfileImg(data?.image)
			doGetDistanceFromLatLonInMiles()
		}
	}, [data])

	const doGetDistanceFromLatLonInMiles = async () => {
		if (data?.lat && data?.log && _userLocation.lat && _userLocation.log) {
			const res = await getDistanceFromLatLonInMiles(data?.lat, data?.log, _userLocation.lat, _userLocation.log)
			setDistanceInMiles(res)
		}
	}

	const getColor = async () => {
		let color = await colorPicker(name[0].toLowerCase())
		setColor(color)
		return color
	}

	const reportPostHandler = async () => {
		isUserLogIn !== null ? setreportPostModel(true) : setLoginPopup(true)
	}
	const onDeletePost = async () => {
		_dispatch(setIsLoading(true))
		setOpenDeletePostModal(false)

		const response: any = await deletePost(postData?.id)
		if (response?.success) {
			await getAllUserAndPosts()
			toastSuccess(response?.message)
			_dispatch(setIsLoading(false))
		} else {
			_dispatch(setIsLoading(false))
			toastError(response?.message)
		}
	}

	return (
		<CustomFlex direction="row" align="center" gap="1" justify="space-between">
			<Flexed direction="row" align="center" gap="0.675">
				<div>
					<Profile
						onClick={() => {
							setSellerId(data?.id)
						}}
						color={color}>
						{profileImg ? (
							<img src={process.env.REACT_APP_PUBLIC_IMAGE_URL + profileImg} alt="profile" />
						) : (
							<CustomText styledColor={palette.white} type="large">
								{name && name[0].toUpperCase()}
							</CustomText>
						)}
					</Profile>
				</div>

				<div>
					<Text
						textTransform="capitalize"
						type="normal"
						margin="0rem 0rem 0rem 0rem"
						pointer
						color="black_100"
						fontWeight={700}
						onClick={() => {
							setSellerId(data?.id)
						}}>
						{name ? name : 'Nate Kestner'}
					</Text>
					{/* {city ? (
						<>
							<Text type="small" margin="0rem 0rem 0rem 0.2rem" color="gray" fontWeight={400}>
								{city}
							</Text>
							</>
					) : null} */}
					{/* {userId !== data?.id && ( */}
					<>
						{/* {distanceInMiles ? ( */}
						<Flexed direction="row" gap="0.2" align="center" pointer>
							<Text type="small" color="gray" fontWeight={400}>
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
									<span>1 day ago</span>
								)}
							</Text>
							<svg width="14" height="14" viewBox="0 0 384 512"><path d="M336 192c0-79.5-64.5-144-144-144S48 112.5 48 192c0 12.4 4.5 31.6 15.3 57.2c10.5 24.8 25.4 52.2 42.5 79.9c28.5 46.2 61.5 90.8 86.2 122.6c24.8-31.8 57.8-76.4 86.2-122.6c17.1-27.7 32-55.1 42.5-79.9C331.5 223.6 336 204.4 336 192zm48 0c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192zm-160 0a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-112 0a80 80 0 1 1 160 0 80 80 0 1 1 -160 0z" fill="#5B626A" /></svg>

							<Text type="small" color="gray" fontWeight={400}>
								{distanceInMiles ? `${distanceInMiles}` : '0 milesx.'}
							</Text>

						</Flexed>
						{/* ) : null} */}
					</>
					{/* )} */}
				</div>
			</Flexed>

			<Flexed direction="row" align="center" gap="0.5">
				<Drop className='dots-hover'>
					<img style={{ cursor: 'pointer' }} src="/images/icons/dots.svg" alt="dots" />
					<DropContent>
						{userId === data?.id && (
							<DropMenu className="d-flex align-items-center gap-2"
								onClick={() => {
									isUserLogIn !== null ? setOpenEditPostModal(true) : setLoginPopup(true)
								}}>
								<svg width="14" height="14" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" fill='#5B626A' /></svg>
								Edit

							</DropMenu>
						)}
						<DropMenu className="d-flex align-items-center gap-2"
							onClick={() => {
								setOpenSocialModal(true)
							}}>
							<svg width="14" height="14" viewBox="0 0 448 512"><path d="M448 128c0 53-43 96-96 96c-28.9 0-54.8-12.8-72.4-33l-89.7 44.9c1.4 6.5 2.1 13.2 2.1 20.1s-.7 13.6-2.1 20.1L279.6 321c17.6-20.2 43.5-33 72.4-33c53 0 96 43 96 96s-43 96-96 96s-96-43-96-96c0-6.9 .7-13.6 2.1-20.1L168.4 319c-17.6 20.2-43.5 33-72.4 33c-53 0-96-43-96-96s43-96 96-96c28.9 0 54.8 12.8 72.4 33l89.7-44.9c-1.4-6.5-2.1-13.2-2.1-20.1c0-53 43-96 96-96s96 43 96 96zM96 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM400 128a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM352 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" fill='#5B626A' /></svg>
							Share

						</DropMenu>

						{userId === data?.id && (
							<DropMenu className="d-flex align-items-center gap-2"
								onClick={() => {
									isUserLogIn !== null ? setOpenDeletePostModal(true) : setLoginPopup(true)
								}}>
								<svg width="14" height="14" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" fill='#5B626A' /></svg>
								Delete

							</DropMenu>
						)}
						{userId !== data?.id && (
							<DropMenu className="d-flex align-items-center gap-2"
								onClick={() => {
									isUserLogIn !== null ? setIsHideModalOpen(true) : setLoginPopup(true)
								}}>
								<svg width="16" height="14" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" fill='#5B626A' /></svg>
								Hide

							</DropMenu>
						)}
						{userId !== data?.id && (
							<DropMenu className="d-flex align-items-center gap-2"
								onClick={() => {
									reportPostHandler()
								}}>
								<svg width="14" height="14" viewBox="0 0 512 512"><path d="M248.4 84.3c1.6-2.7 4.5-4.3 7.6-4.3s6 1.6 7.6 4.3L461.9 410c1.4 2.3 2.1 4.9 2.1 7.5c0 8-6.5 14.5-14.5 14.5H62.5c-8 0-14.5-6.5-14.5-14.5c0-2.7 .7-5.3 2.1-7.5L248.4 84.3zm-41-25L9.1 385c-6 9.8-9.1 21-9.1 32.5C0 452 28 480 62.5 480h387c34.5 0 62.5-28 62.5-62.5c0-11.5-3.2-22.7-9.1-32.5L304.6 59.3C294.3 42.4 275.9 32 256 32s-38.3 10.4-48.6 27.3zM288 368a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-8-184c0-13.3-10.7-24-24-24s-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24V184z" fill='#5B626A' /></svg>
								Report

							</DropMenu>
						)}
					</DropContent>
				</Drop>
			</Flexed>
			{/* )} */}
			{openSocialModal && (
				<SocialShareModal
					postProfile={true}
					data={postData}
					onClose={() => {
						setOpenSocialModal(false)
					}}
				/>
			)}

			{reportPostModel && (
				<ReportModal
					data={postData}
					button={'Report Post'}
					onClose={() => {
						setreportPostModel(false)
					}}
				/>
			)}

			{openEditEventModal && (
				<EditPostModal
					openEditEventModal={openEditEventModal}
					onClose={() => {
						setOpenEditEventModal(false)
					}}
				/>
			)}
			{openDeletePostModal && (
				<DeleteModal
					onClose={() => setOpenDeletePostModal(false)}
					title={'Delete Post?'}
					body={'Are you sure you wan to delete this Post?'}
					onClick={() => {
						onDeletePost()
					}}
				/>
			)}
			{openEditPostModal && (
				<EditPost
					postData={postData}
					// openEditPostModal={openEditPostModal}
					onClose={() => {
						setOpenEditPostModal(false)
					}}
					onEdit={onEdit}
				/>
			)}
			{isHideModalOpen && (
				<HideModal
					getAllUserAndPosts={getAllUserAndPosts}
					post={true}
					postId={postData?.id}
					onClose={() => {
						setIsHideModalOpen(false)
					}}
				/>
			)}

			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</CustomFlex>
	)
}

const CustomFlex = styled(Flexed)`
	width: 100%;
`

const CustomText = styled(Text)`
	/* text-transform: capitalize; */
	color: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.red)};
`

const Profile = styled.div<any>`
	width: 3.125rem;
	height: 3.125rem;
	border-radius: 6rem;
	overflow: hidden;
	background: ${({ color }) => (color ? `${color}` : palette.Btn_dark_green)};
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	& > img {
		width: 4rem;
		height: 4rem;
		border-radius: 3rem;
		object-fit: cover;
	}
`

export const Dots = styled(BsThreeDots) <any>`
	color: ${palette.text};
	font-size: 1.5rem;
	cursor: pointer;
	margin-left: 1rem;
	transform: rotate(90deg);
`

const Location = styled(IoLocation) <any>`
	color: ${palette.text_description};
	font-size: 1rem;
	cursor: pointer;
`

export const DropContent = styled.div<any>`
	display: none;
	margin-top: 0rem;
	position: absolute;
	right: 0;
	background-color: ${({ isDarkTheme }) => (isDarkTheme ? palette.black : palette.white)};
	min-width: 10rem;
	box-shadow: ${palette.shadow};
	z-index: 2;
	border-radius: 0.5rem;
	overflow: hidden;
	padding:  8px;
`

export const Drop = styled.div`
	position: relative;

	&:hover ${DropContent} {
		display: block;
	}
`

export const DropMenu = styled.span<any>`
	color: ${palette.text};
	font-size: 0.875rem;
	padding: 0.425rem 0.8rem 0.425rem 0.8rem;
	text-decoration: none;
	// margin: 8px 12px;
	display: block;
	border-radius: 4px;
	background-color: ${palette.white};
	text-align: left;
	cursor: pointer;
	&:hover {
		// color: ${palette.orange};
		background: #f2f2f2;
		transition: color 0.1s ease 0.1s;
	}
`
export default PostProfile
