import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flexed, Text } from '../styled/shared'
import { palette } from '../styled/colors'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { colorPicker } from '../components/utils'
import { setIsLoading, randerGambaNetworkList, addFav } from '../actions/authActions'
import { addFavSeller } from '../apis/apis'
import { toastError } from '../styled/toastStyle'
import HideModal from './modals/HideModal'
import LoginPopupModel from './modals/LoginPopupModel'

const MyNetworkList = ({ data, setSellerId, getFevSellerData }: any) => {
	const _dispatch = useDispatch()
	const [name, setName] = useState(data?.first_name)
	const [lName, setLName] = useState(data?.last_name)
	const [isFav, setIsFav] = useState(false)
	const [profileImg, setProfileImg] = useState(data?.image)
	const [color, setColor] = useState<any>()
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [toggle, setToggle] = useState(false)
	const [isHideModalOpen, setIsHideModalOpen] = useState(false)
	const [loginPopup, setLoginPopup] = useState(false)

	let _navigate = useNavigate()

	useEffect(() => {
		setName(data?.first_name)
		setLName(data?.last_name)
		setProfileImg(data?.image)
		setIsFav(data?.isFev == 1 ? true : false)
	}, [data])

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

	const doAddFavSeller = async () => {
		_dispatch(setIsLoading(true))
		const response = await addFavSeller(data?.id)
		_dispatch(addFav(data?.id))
		if (response.success === true) {
			setToggle(!toggle)
			_dispatch(randerGambaNetworkList(!toggle))
			await getFevSellerData()
		}
		_dispatch(setIsLoading(false))
	}

	return (
		<Wrapper direction="row" justify="space-between" gap={1} align="center">
			<Flexed direction="row" justify="space-between" gap={0.5} align="center">
				<div>
					<Profile
						onClick={() => {
							_navigate('/products')
							setSellerId(data?.id)
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
				<Text
					pointer
					type="normal"
					color="black"
					textTransform="capitalize"
					onClick={() => {
						_navigate('/products')
						setSellerId(data?.id)
					}}>
					{data?.first_name ? name + ' ' + lName : ''}
				</Text>
			</Flexed>
			<Flexed direction="row" justify="space-between" gap={0.5} align="center">
				{isFav ? (
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
				) : (
					<Heart
						src="/images/icons/network_newS.svg"
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
				)}
				<Drop>
					<Dots src="/images/icons/dots.svg" alt="dots" />
					<DropContent>
						<DropMenu
							onClick={() => {
								if (isUserLogIn !== null) {
									setIsHideModalOpen(true)
								} else {
									setLoginPopup(true)
								}
							}}>
							Block
						</DropMenu>
					</DropContent>
				</Drop>
			</Flexed>
			{isHideModalOpen && (
				<HideModal
					community={false}
					setSellerId={setSellerId}
					getAllSellers={getFevSellerData}
					setIsSellerSelfProfileOpen={false}
					sellerId={data?.id}
					sellerProfile={true}
					onClose={() => {
						setIsHideModalOpen(false)
					}}
				/>
			)}

			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</Wrapper>
	)
}

const Wrapper = styled(Flexed) <any>`
	border-radius: 1.25rem;
	padding: 1rem;
	border: 1px solid ${palette.stroke};
`

const Profile = styled.div<any>`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 100%;
	overflow: hidden;
	background: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.Btn_dark_green)};
	position: relative;
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	& > img {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 3rem;
		object-fit: cover;
	}
`

const CustomText = styled(Text)`
	color: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.red)};
`

const Heart = styled.img`
	cursor: pointer;
	width: 1.8rem;
	height: 1.8rem;
`

const DropContent = styled.div<any>`
	display: none;
	margin-top: 0rem;
	position: absolute;
	right: 0;
	background-color: ${({ isDarkTheme }) => (isDarkTheme ? palette.black : palette.white)};
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
`

const Dots = styled.img<any>`
	cursor: pointer;
	width: 18px;
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

export default MyNetworkList
