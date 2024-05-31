import React, { useState, useEffect } from 'react'
import { Flexed, Text, getDistanceFromLatLonInMiles } from '../styled/shared'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { colorPicker } from './utils'
import { useNavigate } from 'react-router-dom'
import { addFav, saveRoute, setIsLoading } from '../actions/authActions'
import { toastError } from '../styled/toastStyle'
import { useDispatch } from 'react-redux'
import { addFavSeller, addUserProfileDisike, addUserProfileLike, removeUserProfileDislike, removeUserProfileLike } from '../apis/apis'

const PopularSellersCard = ({ social, product, setSellerId, setSelectCategory, setUserId, data, updateUsers }: any) => {
	const dispatch = useDispatch()
	const [color, setColor] = useState<any>('')
	const [distanceInMiles, setDistanceInMiles]: any = useState('')
	const _navigate = useNavigate()
	const _dispatch = useDispatch()
	const [isFav, setIsFav] = useState(data?.isFev ? true : false)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')

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
		} else {
			_dispatch(saveRoute('/products'))
			if (product) {
				setSelectCategory('')
				setSelectCategory('sellers')
			}
			setUserId(data.id)
			_navigate('/products')
		}
	}

	const doGetDistanceFromLatLonInMiles = async () => {
		if (data?.lat && data?.log && _userLocation.lat && _userLocation.log) {
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

	const doAddLikeUser = async () => {
		await addUserProfileLike(data?.id)
		updateUsers()
	}

	const doRemoveLikeUser = async () => {
		await removeUserProfileLike(data?.id)
		updateUsers()
	}

	const doAddDisLikeUser = async () => {
		await addUserProfileDisike(data?.id)
		updateUsers()
	}

	const doRemoveDisLikeUser = async () => {
		await removeUserProfileDislike(data?.id)
		updateUsers()
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
							<Name color="black_200" type="normal" pointer lineHeight={1.2} fontWeight={500} textTransform="capitalize" onClick={() => handleTextClick(data)} title={data.first_name ? data.first_name + ' ' + data.last_name : ''}>
								{data.first_name ? data.first_name + ' ' + data.last_name : ''}
							</Name>
							<Distance color="text_description" type="xsmall">
								{distanceInMiles && <img src="/images/icons/location.svg" alt="location" />}
								<>{distanceInMiles ? `${distanceInMiles}` : 'N / A'}</>
							</Distance>
						</Flexed>
						<div style={{ width: '40%' }}>
							<Flexed direction="row" gap={0.625} align="center" justify={'space-between'}>
								<Flexed direction="row" gap={0.313} align="center">
									<Like
										active={data?.isLiked}
										src="/images/icons/like.svg"
										alt="like"
										onClick={() => {
											if (isUserLogIn !== null) {
												if (data?.isLiked) {
													doRemoveLikeUser()
												} else {
													doAddLikeUser()
												}
											}
										}}
									/>
									<Text type="small" color={data?.isLiked ? 'green_200' : 'gray'} fontWeight={500}>
										{data?.profile_likes}
									</Text>
								</Flexed>
								<Flexed direction="row" gap={0.313} align="center">
									<DisLike
										active={data?.isDisLiked}
										src="/images/icons/dislike.svg"
										alt="dislike"
										onClick={() => {
											if (isUserLogIn !== null) {
												if (data?.isDisLiked) {
													doRemoveDisLikeUser()
												} else {
													doAddDisLikeUser()
												}
											}
										}}
									/>
									<Text type="small" color={data?.isDisLiked ? 'red' : 'gray'} fontWeight={500}>
										{data?.profile_dislikes}
									</Text>
								</Flexed>

								{/* <Chat
									src="/images/icons/chat-dots-svg.svg"
									alt="chat-dots"
									onClick={() => {
										if (isUserLogIn !== null) {
											_navigate(`/chat/${data?.chat_id}`)
										} else {
											toastError('Please LogIn First')
										}
									}}
								/> */}

								{/* {isFav ? (
									<HeartFilled
										src="/images/icons/filled_heart.svg"
										onClick={() => {
											if (isUserLogIn !== null) {
												setIsFav(!isFav)
												doAddFavSeller()
											} else {
												toastError('Please LogIn First')
											}
										}}
									/>
								) : (
									<HeartEmpty
										src="/images/icons/empty_heart.svg"
										onClick={() => {
											if (isUserLogIn !== null) {
												setIsFav(!isFav)
												doAddFavSeller()
											} else {
												toastError('Please LogIn First')
											}
										}}
									/>
								)} */}
							</Flexed>
						</div>
					</Details>
				</Flex>
			</CustomFlex>
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
export const Like = styled.img<any>`
	cursor: pointer;
	filter: ${({ active }) => (active ? 'invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);' : '')};
`
export const DisLike = styled.img<any>`
	cursor: pointer;
	filter: ${({ active }) => (active ? 'invert(1) sepia(1) saturate(100) hue-rotate(0deg) brightness(1) contrast(1) drop-shadow(0 0 0 red)' : 'none')};
`
const HeartEmpty = styled.img``
const HeartFilled = styled.img``

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

export default PopularSellersCard
