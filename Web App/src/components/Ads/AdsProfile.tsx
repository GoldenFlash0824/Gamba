import React, {useEffect, useState} from 'react'
import {letterColors, palette} from '../../styled/colors'
import styled from 'styled-components'
import {Text, Flexed} from '../../styled/shared'
import {BsThreeDots} from 'react-icons/bs'
import SocialShareModal from '../modals/SocialShareModal'
import {useNavigate} from 'react-router-dom'
import {BiWorld} from 'react-icons/bi'
import {colorPicker} from '../utils'
import LoginPopupModel from '../modals/LoginPopupModel'

const AdsProfile = ({data, events, setUserId, userId, postData}: any) => {
	const [name, setName] = useState('Nuu')
	// const [city, setCity] = useState()
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const _navigate = useNavigate()

	const [profileImg, setProfileImg] = useState(data?.image)
	const [openSocialModal, setOpenSocialModal] = useState(false)
	const [color, setColor] = useState<any>('')
	const [loginPopup, setLoginPopup] = useState(false)

	useEffect(() => {
		if (data) {
			getColor()
		}
	}, [data])

	const getColor = async () => {
		let color = await colorPicker(name[0].toLowerCase())
		setColor(color)
		return color
	}

	return (
		<CustomFlex direction="row" align="center" gap="1" justify="space-between">
			<Flexed direction="row" align="center" gap="0.5">
				<div>
					<Profile
						onClick={() => {
							_navigate('/products')
							setUserId(data?.id)
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
						type="normal"
						margin="0rem 0rem 0rem 0.3rem"
						pointer
						color="text"
						onClick={() => {
							_navigate('/products')
							setUserId(data?.id)
						}}>
						{name ? name : 'Nate Kestner'}
					</Text>
					<Flexed direction="row" align="center">
						<Text type="small" color="text_description" margin="0rem 0rem 0rem 0.3rem">
							Sponsored&nbsp;&#183;&nbsp;
						</Text>
						<BiWorld />
					</Flexed>
				</div>
			</Flexed>

			<Flexed direction="row" align="center" gap="0.5">
				<Drop>
					<Dots />
					<DropContent>
						<DropMenu
							onClick={() => {
								isUserLogIn !== null ? _navigate('/') : setLoginPopup(true)
							}}>
							Report
						</DropMenu>
						<DropMenu
							onClick={() => {
								isUserLogIn !== null ? setOpenSocialModal(true) : setLoginPopup(true)
							}}>
							Share
						</DropMenu>

						<DropMenu
							onClick={() => {
								isUserLogIn !== null ? _navigate('/') : setLoginPopup(true)
							}}>
							Hide
						</DropMenu>
					</DropContent>
				</Drop>
			</Flexed>
			{openSocialModal && (
				<SocialShareModal
					onClose={() => {
						setOpenSocialModal(false)
					}}
				/>
			)}

			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</CustomFlex>
	)
}

const CustomFlex = styled(Flexed)`
	width: 100%;
	padding-bottom: 1rem;
	border-bottom: 1px solid ${palette.fbBg};
`

const CustomText = styled(Text)`
	color: ${({styledColor}) => (styledColor ? `${styledColor}` : palette.red)};
`

const Profile = styled.div<any>`
	width: 3.3rem;
	height: 3.3rem;
	border-radius: 3rem;
	overflow: hidden;
	background: ${({color}) => (color ? `${color}` : palette.Btn_dark_green)};
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

const Dots = styled(BsThreeDots)<any>`
	color: ${palette.text};
	font-size: 1.5rem;
	cursor: pointer;
	margin-left: 1rem;
`

const DropContent = styled.div<any>`
	display: none;
	margin-top: 0rem;
	position: absolute;
	right: 0;
	background-color: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	min-width: 8rem;
	box-shadow: ${palette.shadow};
	z-index: 2;
	border-radius: 0.5rem;
	overflow: hidden;
`

const Drop = styled.div`
	position: relative;

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

export default AdsProfile
