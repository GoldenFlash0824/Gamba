import React, { useState, useEffect } from 'react'
import { Flexed, Text, getCurrentAddress, getDistanceFromLatLonInMiles } from '../styled/shared'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { colorPicker } from './utils'
import { useNavigate, useLocation } from 'react-router-dom'
import { addFav, saveRoute, setIsLoading } from '../actions/authActions'
import { useDispatch } from 'react-redux'
import { addFavSeller } from '../apis/apis'

import LoginPopupModel from './modals/LoginPopupModel'
import { BiEnvelope } from 'react-icons/bi'

const GambaNetworkList = ({ social, product, setSellerId, setSelectCategory, setUserId, data }: any) => {
	const dispatch = useDispatch()
	const { pathname } = useLocation()
	const [color, setColor] = useState<any>('')
	const [distanceInMiles, setDistanceInMiles]: any = useState('')
	const _navigate = useNavigate()
	const _dispatch = useDispatch()
	const [isFav, setIsFav] = useState(data?.isFev ? true : false)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')
	const [loginPopup, setLoginPopup] = useState(false)

	useEffect(() => {
		getColor()
		setIsFav(data?.isFev ? true : false)
		doGetDistanceFromLatLonInMiles()
	}, [data])

	const getColor = async () => {
		let color = await colorPicker(data?.first_name ? data?.first_name[0]?.toLowerCase() : 'n')
		setColor(color)
		return color
	}

	const handleTextClick = (data: any) => {
		if (social) {
			setSellerId(data.id)
			_navigate(`/products?id=${data.id}`)
		} else {
			_dispatch(saveRoute('/products'))
			if (product) {
				setSelectCategory('')
				setSelectCategory('sellers')
			}
			setUserId(data.id)
			_navigate(`/products?id=${data.id}`)
		}
	}

	const doGetDistanceFromLatLonInMiles = async () => {
		if (data?.lat && data?.log && _userLocation?.lat && _userLocation?.log) {
			const res = await getDistanceFromLatLonInMiles(data?.lat, data?.log, _userLocation.lat, _userLocation.log)
			setDistanceInMiles(res)
		}
	}

	const doAddFavSeller = async () => {
		dispatch(setIsLoading(true))
		await addFavSeller(data?.id)
		_dispatch(addFav(data?.id))
		dispatch(setIsLoading(false))
	}

	return (
		<>
			<CustomFlex direction="row" align="center" gap="1" justify="space-between">
				<Flex direction="row" align="center" gap={0.625}>
					<div style={{ position: 'relative' }}>
						<Profile styledColor={color} onClick={() => handleTextClick(data)}>
							{data?.image ? (
								<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${data?.image}`} />
							) : (
								<CustomText styledColor={palette.white} type="large" fontSize="1.4" onClick={() => handleTextClick(data)}>
									{data?.first_name && data?.first_name[0].toUpperCase()}
								</CustomText>
							)}
						</Profile>
						<ActiveStaus active={false} />
					</div>
					<Details direction="row" align="center" justify="space-between">
						<Flexed gap="0.2">
							<Name color="black_200" type="normal" pointer lineHeight={1.2} fontWeight={500} textTransform="capitalize" onClick={() => handleTextClick(data)}>
								{data?.first_name ? data?.first_name + ' ' + data?.last_name : ''}
							</Name>
							<Distance color="text_description" type="xsmall">
								{distanceInMiles && <LocationIcon src="/images/icons/location.svg" alt="location" />}
								<>{distanceInMiles ? `${distanceInMiles}` : '0 miles'}</>
							</Distance>
						</Flexed>
						<div>
							<Flexed className='chat-hover' direction="row" gap={0.125} align="center">
								{/* <BiEnvelope style={{fontSize: '1.3rem'}} onClick={() => {
										if (isUserLogIn !== null) {
											_navigate(`/chat/${data?.chat_id}`)
										} else {
											setLoginPopup(true)
											// toastError('Please LogIn First')
										}
									}} /> */}
								<span>
									<Chat
										src="/images/icons/chat-dots-svg.svg"
										alt="chat-dots"
										onClick={() => {
											if (isUserLogIn !== null) {
												_navigate(`/chat/${data?.chat_id}`)
											} else {
												setLoginPopup(true)
												// toastError('Please LogIn First')
											}
										}}
									/>
								</span>

								{isFav ? (
									<span>
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
									</span>
								) : (
									<span>
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
									</span>
								)}
							</Flexed>
						</div>
					</Details>
				</Flex>
			</CustomFlex>
			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</>
	)
}

const Name = styled(Text) <any>`
	text-overflow: ellipsis;
	overflow: hidden;
	width: 6rem;
	height: 1.2em;
	white-space: nowrap;
`

const Chat = styled.img``
const Like = styled.img``
const DisLike = styled.img``
const HeartEmpty = styled.img`
	width: 20px;
	cursor: pointer;
`
const HeartFilled = styled.img`
	width: 20px;
	cursor: pointer;
`

const Heart = styled.img`
	width: 30px;
	cursor: pointer;
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
	color: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.red)};
`
const Profile = styled.div<any>`
	height: 2.5rem;
	width: 2.5rem;
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

const ActiveStaus = styled.div<any>`
	position: absolute;
	bottom: 0rem;
	right: 0;
	width: 0.719rem;
	height: 0.719rem;
	border-radius: 100%;
	border: 0.094rem solid ${palette.white};
	background: ${({ active }) => (active ? palette.Btn_dark_green : palette.gray_100)};
`

const Distance = styled(Text)`
	font-style: normal;
	min-width: 5rem;
	display: flex;
	align-items: center;
`

const LocationIcon = styled.img`
	width: 16px;
`

export default GambaNetworkList
