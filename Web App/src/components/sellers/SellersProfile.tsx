import React, {useEffect, useState} from 'react'
import {letterColors, palette} from '../../styled/colors'
import styled from 'styled-components'
import {Text, Flexed, Spacer} from '../../styled/shared'
import {IoLocation} from 'react-icons/io5'
import SocialShareModal from '../modals/SocialShareModal'
import CartItemDeleteModal from '../modals/CartItemDeleteModal'
import EditPostModal from '../modals/EditPostModal'
import {useNavigate} from 'react-router-dom'
import SellersReview from './SellersReview'
import {BiDotsVerticalRounded} from 'react-icons/bi'
import {media} from 'styled-bootstrap-grid'
import {colorPicker} from '../utils'
import {useSelector, useDispatch} from 'react-redux'
import HideModal from '../modals/HideModal'
import {toastError} from '../../styled/toastStyle'
import {addFavSeller} from '../../apis/apis'
import {setIsLoading, randerGambaNetworkList, addFav} from '../../actions/authActions'
import LoginPopupModel from '../modals/LoginPopupModel'
import moment from 'moment-timezone'

const SellersProfile = ({sellerCard, setSellerId, community, sellersCardOpen, distanceInMiles, getAllSellers, data, seller, events, setIsSellerSelfProfileOpen, setSelectedSeller}: any) => {
	const [name, setName] = useState(data?.first_name)
	const [lName, setLName] = useState(data?.last_name)
	const [isFav, setIsFav] = useState(false)

	useEffect(() => {
		setName(data?.first_name)
		setLName(data?.last_name)
		setProfileImg(data?.image)
		setIsFav(data?.isFev == 1 ? true : false)
	}, [data])

	let _navigate = useNavigate()
	const userId = useSelector<any>((state: any) => state.auth.userId)
	const [isHideModalOpen, setIsHideModalOpen] = useState(false)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const useWindowSize = () => {
		const [size, setSize] = useState([window.innerHeight, window.innerWidth])

		useEffect(() => {
			const handleResize = () => {
				setSize([window.innerHeight, window.innerWidth])
			}
			window.addEventListener('resize', handleResize)
		}, [])
		return size
	}

	const [screenHeight, screenWidth] = useWindowSize()

	const [profileImg, setProfileImg] = useState(data?.image)
	const [openSocialModal, setOpenSocialModal] = useState(false)
	const [toggle, setToggle] = useState(false)

	const [openEditEventModal, setOpenEditEventModal] = useState(false)
	const [openDeletePostModal, setOpenDeletePostModal] = useState(false)
	const [color, setColor] = useState<any>()
	const [loginPopup, setLoginPopup] = useState(false)
	const _dispatch = useDispatch()

	const doAddFavSeller = async () => {
		_dispatch(setIsLoading(true))
		const response = await addFavSeller(data?.id)
		_dispatch(addFav(data?.id))
		if (response.success === true) {
			setToggle(!toggle)
			_dispatch(randerGambaNetworkList(!toggle))
		}
		_dispatch(setIsLoading(false))
	}

	useEffect(() => {
		if (data?.first_name) {
			getColor()
		}
	}, [data])

	const getColor = async () => {
		let color = await colorPicker(data?.first_name[0]?.toLowerCase())
		setColor(color)
		return color
	}

	return (
		<>
			<Wrapper direction="row" align="center" gap="1" justify="space-between">
				<StyledFlexed direction="row" align="center" >
					<div style={{position: 'relative'}}>
						<Profile
							onClick={() => {
								// _navigate('/sellers-product')
								if (sellerCard) {
									setIsSellerSelfProfileOpen(true)
									setSelectedSeller(data)
								}
								if (sellersCardOpen) {
									_navigate('/')
									setSellerId(data?.id)
								}
							}}
							styledColor={color}>
							{profileImg ? (
								<img src={process.env.REACT_APP_PUBLIC_IMAGE_URL + profileImg} alt="profile" />
							) : (
								<CustomText styledColor={palette.white} type="large">
									{data?.first_name ? data?.first_name[0]?.toUpperCase() : ''}
								</CustomText>
							)}
						</Profile>
					</div>

					<div>
						<Text
							pointer
							type="normal"
							color="black_100"
							textTransform="capitalize"
							margin="0rem 0rem 0.2rem 0.1rem"
							fontWeight={700}
							onClick={() => {
								if (sellerCard) {
									setIsSellerSelfProfileOpen(true)
									setSelectedSeller(data)
								}
								if (sellersCardOpen) {
									_navigate('/')
									setSellerId(data?.id)
								}
							}}>
							{data?.first_name ? name + ' ' + lName : ''}
							{/* {seller && ( */}
							<Flexed direction="row" gap="0.2" align="center" pointer>
								<img src="/images/icons/location.svg" alt="location" />
								<Text type="small" color="gray" fontWeight={400}>
									{distanceInMiles ? distanceInMiles : '0 miles.'}
								</Text>
							</Flexed>
							{/* )} */}

							<Text type="small" color="gray">
								{data?.display_location && data?.address && data?.address}
							</Text>
						</Text>
					</div>
				</StyledFlexed>

				<Flexed className="hover-chat-heart" direction="row" gap={0.25} align="center">
					{userId !== data?.id && (
						<span>
							<Chat
							// todo online functionlity here
							online={false}
							src="/images/icons/chat-dots-svg.svg"
							alt="chat-dots"
							onClick={() => {
								if (isUserLogIn !== null) {
									_navigate(`/chat/${data?.chat_id}`)
								} else {
									setLoginPopup(true)
								}
							}}
						/>
						</span>
					)}
					{userId !== data?.id && (
						<FavoriteWrapper>
							{isFav ? (
								<span>
									<Heart
									src="/images/network_new.svg"
									alt="heart"
									onClick={() => {
										if (isUserLogIn !== null) {
											setIsFav(!isFav)
											doAddFavSeller()
										} else {
											setLoginPopup(true)
										}
									}}
								/>
								</span>
							) : (
								<span>
									<Heart
									src="/images/network_newS.svg"
									alt="heart"
									onClick={() => {
										if (isUserLogIn !== null) {
											setIsFav(!isFav)
											doAddFavSeller()
										} else {
											setLoginPopup(true)
										}
									}}
								/>
								</span>
							)}
						</FavoriteWrapper>
					)}
					{seller && (
						<Drop className='dropdown-seller'>
							<Dots className="dots-hover" src="/images/icons/dots.svg" alt="dots" />
							<DropContent>
								<DropMenu  className="d-flex align-items-center gap-2"
									onClick={() => {
										setOpenSocialModal(true)
									}}>
										<svg width="14" height="14" viewBox="0 0 448 512"><path d="M448 128c0 53-43 96-96 96c-28.9 0-54.8-12.8-72.4-33l-89.7 44.9c1.4 6.5 2.1 13.2 2.1 20.1s-.7 13.6-2.1 20.1L279.6 321c17.6-20.2 43.5-33 72.4-33c53 0 96 43 96 96s-43 96-96 96s-96-43-96-96c0-6.9 .7-13.6 2.1-20.1L168.4 319c-17.6 20.2-43.5 33-72.4 33c-53 0-96-43-96-96s43-96 96-96c28.9 0 54.8 12.8 72.4 33l89.7-44.9c-1.4-6.5-2.1-13.2-2.1-20.1c0-53 43-96 96-96s96 43 96 96zM96 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM400 128a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM352 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" fill='#5B626A'/></svg>
									Share
								</DropMenu>
								{userId !== data?.id && <DropMenu className="d-flex align-items-center gap-2" onClick={() => setIsHideModalOpen(true)}>
								<svg width="16" height="14" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" fill='#5B626A'/></svg>
									Hide
									</DropMenu>}
							</DropContent>
						</Drop>
					)}
				</Flexed>
				{openSocialModal && (
					<SocialShareModal
						sellersProfile
						sellersProfileData={data}
						onClose={() => {
							setOpenSocialModal(false)
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
					<CartItemDeleteModal
						openDeletePostModal={openDeletePostModal}
						onClose={() => {
							setOpenDeletePostModal(false)
						}}
					/>
				)}
				{isHideModalOpen && (
					<HideModal
						community={community}
						setSellerId={setSellerId}
						getAllSellers={getAllSellers}
						setIsSellerSelfProfileOpen={setIsSellerSelfProfileOpen}
						sellerId={data?.id}
						sellerProfile={true}
						onClose={() => {
							setIsHideModalOpen(false)
						}}
					/>
				)}

				{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
			</Wrapper>
			{data?.display_email || data?.display_phone || data?.display_dob ? (
				<CustomFlex direction="column" gap="1" justify="space-between">
					<Text type="small" color="gray">
						{data?.display_email && <div>{data?.email}</div>}
						{data?.display_phone && <div>{data?.phone}</div>}
						{data?.display_dob && <div>{data?.display_dob_full_format && data?.dob ? moment(data?.dob).format('MM/DD/YY') : moment(data?.dob).format('MM/DD')}</div>}
					</Text>
				</CustomFlex>
			) : (
				''
			)}
		</>
	)
}

const Wrapper = styled(Flexed)`
	padding-bottom: 0.5rem;
	width: 100%;
	margin-right: 0.5rem;
	@media (max-width: 450px) {
		flex-wrap: wrap;
	}
`

const CustomFlex = styled(Flexed)`
	padding-bottom: 1rem;
	width: 100%;
	margin-right: 0.5rem;
	@media (max-width: 450px) {
		flex-wrap: wrap;
	}
`

const CustomText = styled(Text)`
	color: ${({styledColor}) => (styledColor ? `${styledColor}` : palette.red)};
`

const StyledFlexed = styled(Flexed)`
	gap: .675rem;
	@media (max-width: 768px) {
		gap: 0.5rem;
	}
`

const Chat = styled.img<any>`
	width: 20px;
	cursor: pointer;
	filter: ${({online}) => (online ? 'invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);' : '')};
`

const Heart = styled.img`
	width: 20px;
	cursor: pointer;
`
const Flex = styled(Flexed)`
	flex-wrap: wrap;
`
const StyledFlex = styled(Flexed)`
	display: flex;
	${media.sm`
		display: none;
	`};
`
const Profile = styled.div<any>`
	width: 3.125rem;
	height: 3.125rem;
	border-radius: 100%;
	overflow: hidden;
	background: ${({styledColor}) => (styledColor ? `${styledColor}` : palette.Btn_dark_green)};
	position: relative;
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	& > img {
		width: 3.125rem;
		height: 3.125rem;
		border-radius: 3rem;
		object-fit: cover;
	}
`

const Dots = styled.img<any>`
	cursor: pointer;
`

const DropContent = styled.div<any>`
	display: none;
	margin-top: 0rem;
	position: absolute;
	right: 0;
	background-color: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	min-width: max-content;
	box-shadow: ${palette.shadow};
	z-index: 1;
	border-radius: 0.5rem;
	overflow: hidden;
`

const Drop = styled.div`
	position: relative;
	&:hover ${DropContent} {
		display: block;
	}
	&:hover ${Dots} {
		background: #f0f2f5;
		border-radius: 50%;
	}
`

const FavoriteWrapper = styled.div`
	// position: absolute;
	// right: -0.4rem;
	// bottom: -0.5rem;
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
		background: ${palette.fbBg};
		color: ${palette.orange};
		transition: color 0.1s ease 0.1s;
	}
`
export default SellersProfile
