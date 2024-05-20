import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Flexed, Text, getDistanceFromLatLonInMiles} from '../styled/shared'
import {palette} from '../styled/colors'
import {useDispatch} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import {IoChatboxSharp} from 'react-icons/io5'
import {AiOutlineEye} from 'react-icons/ai'
import {colorPicker} from './utils'
import {addFav, setIsLoading} from '../actions/authActions'
import {addFavSeller, getEventById} from '../apis/apis'
import LoginPopupModel from './modals/LoginPopupModel'
import {BiEnvelope} from 'react-icons/bi'

const HappeningAroundYouList = ({item, loadEvents}: any) => {
	const _navigate = useNavigate()
	const router = useLocation()
	const _dispatch = useDispatch()
	const [color, setColor] = useState<any>('')
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')
	const [distanceInMiles, setDistanceInMiles]: any = useState('')
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [isFav, setIsFav] = useState(false)
	const [loginPopup, setLoginPopup] = useState(false)

	useEffect(() => {
		getColor()
		doGetDistanceFromLatLonInMiles()
		setIsFav(item?.isFev ? true : false)
	}, [])

	const getColor = async () => {
		let color = await colorPicker(item?.user?.first_name ? item?.user?.first_name[0].toUpperCase() : 'S')
		setColor(color)
		return color
	}

	const handleTextClick = (id) => {
		// _navigate('/calendar')
		_navigate(`/calendar?id=${id ? id : 0}`)
	}

	const doGetDistanceFromLatLonInMiles = async () => {
		if (item?.latitude && item?.longitude && _userLocation.lat && _userLocation.log) {
			const res = await getDistanceFromLatLonInMiles(item?.latitude, item?.longitude, _userLocation.lat, _userLocation.log)
			setDistanceInMiles(res)
		}
	}

	const doAddFavSeller = async () => {
		_dispatch(setIsLoading(true))
		await addFavSeller(item?.u_id)
		// loadEvents(true)
		_dispatch(setIsLoading(false))
	}

	return (
		<CustomFlex direction="row" align="center" gap="1" justify="space-between">
			<Flex direction="row" align="center" gap={0.625}>
				<div style={{position: 'relative'}}>
					<Profile styledColor={color} onClick={() => handleTextClick(item?.id)}>
						{item?.eventUser?.image ? (
							<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${item?.eventUser?.image}`} alt="" />
						) : (
							<CustomText styledColor={palette.white} type="large" fontSize="1.4" onClick={() => handleTextClick(item?.id)}>
								{item?.user?.first_name ? item?.user?.first_name[0].toUpperCase() : 'S'}
							</CustomText>
						)}
					</Profile>
				</div>
				<Details direction="row" align="center" justify="space-between">
					<Flexed gap="0.2">
						<Name color="black_200" type="normal" pointer lineHeight={1.2} fontWeight={500} textTransform="capitalize" onClick={() => handleTextClick(item?.id)}>
							{item?.title}
						</Name>
						<Distance color="text_description" type="xsmall">
							{distanceInMiles && <img src="/images/icons/location.svg" alt="location" />}
							<>{distanceInMiles ? `${distanceInMiles}` : '0 mile'}</>
						</Distance>
					</Flexed>
					<div>
						<Flexed direction="row" gap={0.625} align="center">
							<Flexed direction="row" gap={0.313}>
								{/* <BiEnvelope
									style={{fontSize: '1.3rem'}}
									onClick={() => {
										if (isUserLogIn !== null) {
											_navigate(`/chat/${item?.eventUser?.chat_id}`)
										} else {
											setLoginPopup(true)
											// toastError('Please LogIn First')
										}
									}}
								/> */}
								<Chat
									src="/images/icons/chat-dots-svg.svg"
									alt="chat-dots"
									onClick={() => {
										if (isUserLogIn !== null) {
											_navigate(`/chat/${item?.eventUser?.chat_id}`)
										} else {
											setLoginPopup(true)
										}
									}}
								/>
								{isFav ? (
									<HeartFilled
										src="/images/network_new.svg"
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
									<HeartEmpty
										src="/images/network_newS.svg"
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
								{/* <AiOutlineEye fontSize="20px" color="#6C757D" onClick={() => handleTextClick(item?.id)} /> */}
							</Flexed>
						</Flexed>
					</div>
				</Details>
			</Flex>
			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</CustomFlex>
	)
}

const Name = styled(Text)<any>`
	text-overflow: ellipsis;
	overflow: hidden;
	width: 8rem;
	height: 1.2em;
	white-space: nowrap;
`

const CustomFlex = styled(Flexed)`
	padding: 1.25rem 0 0;
`

const Flex = styled(Flexed)`
	width: 100%;
`

const Details = styled(Flexed)`
	overflow: hidden;
	cursor: pointer;
	width: 100%;
`

const CustomText = styled(Text)`
	color: ${({styledColor}) => (styledColor ? `${styledColor}` : palette.red)};
`
const Profile = styled.div<any>`
	height: 2.5rem;
	width: 2.5rem;
	border-radius: 100%;
	// overflow: hidden;
	/* background: ${palette.Btn_dark_green}; */
	background: ${({styledColor}) => (styledColor ? `${styledColor} !important` : palette.Btn_dark_green)};
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	position: relative;
`

const Distance = styled(Text)`
	font-style: normal;
	min-width: 5rem;
	display: flex;
	align-items: center;
`

const Img = styled.img<any>`
	object-fit: cover;
	border-radius: 100%;
	width: 100%;
	height: 100%;
`

const Chat = styled.img``
const HeartEmpty = styled.img``
const HeartFilled = styled.img``

export default HappeningAroundYouList
