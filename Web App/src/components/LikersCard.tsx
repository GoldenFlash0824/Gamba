import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import 'react-responsive-modal/styles.css'
import {Text, Flexed} from '../styled/shared'
import {palette} from '../styled/colors'
import {useNavigate} from 'react-router-dom'
import {BsCircleFill} from 'react-icons/bs'
import {toastError} from '../styled/toastStyle'
import {colorPicker} from './utils'
import {useSelector} from 'react-redux'
import LoginPopupModel from './modals/LoginPopupModel'

const LikersCard = ({likeUser, setUserId}: any) => {
	const _navigate = useNavigate()
	const [color, setColor] = useState<any>('')
	const userId = useSelector<any>((state: any) => state.auth.userId)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [loginPopup, setLoginPopup] = useState(false)

	useEffect(() => {
		if (likeUser) {
			getColor()
		}
	}, [likeUser])

	const getColor = async () => {
		let color = await colorPicker(likeUser?.first_name[0].toLowerCase())
		setColor(color)
		return color
	}

	return (
		<StyledFlex direction="row" align="center" justify="space-between">
			<Flexed direction="row" align="center" gap={1}>
				<div
					onClick={() => {
						_navigate('/products')
						setUserId(likeUser?.id)
					}}>
					<Profile styledColor={color}>
						{likeUser?.image ? (
							<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${likeUser?.image}`} />
						) : (
							<CustomText styledColor={palette.white} type="large" fontSize="1.4">
								{likeUser?.first_name && likeUser?.first_name[0]?.toUpperCase()}
							</CustomText>
						)}
						<ActiveStaus active={false} />
					</Profile>
				</div>
				<Text
					pointer
					type="normal"
					textTransform="capitalize"
					fontWeight={500}
					color="black_200"
					onClick={() => {
						_navigate('/products')
						setUserId(likeUser?.id)
					}}>
					{likeUser?.first_name}
				</Text>
			</Flexed>
			{userId !== likeUser?.id && (
				<Chat
					src="/images/icons/chat-dots-svg.svg"
					alt="chat-dots"
					onClick={() => {
						if (isUserLogIn !== null) {
							_navigate(`/chat/${likeUser?.chat_id}`)
						} else {
							setLoginPopup(true)
							// _navigate(`/sign-in`)
						}
					}}
				/>
			)}

			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</StyledFlex>
	)
}

const CustomText = styled(Text)<any>`
	color: ${({styledColor}) => (styledColor ? `${styledColor} !important` : palette.red)};
`

const IconWrapper = styled.div`
	position: absolute;
	top: 0;
	right: 0rem;
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
const Img = styled.img<any>`
	object-fit: cover;
	border-radius: 100%;
	width: 100%;
	height: 100%;
`

const StyledFlex = styled(Flexed)`
	padding: 0.8rem 0;
`

const JoinButton = styled.div`
	background-color: ${palette.orange};
	color: ${palette.white};
	padding: 0.3rem 1.2rem;
	font-size: 1rem;
	border-radius: 2rem;
	height: 100%;
	display: flex;
	font-weight: 600;
	gap: 0.5rem;
	align-items: center;
	cursor: pointer;
	&:hover {
		opacity: 0.7;
		transition: background-color 0.3s ease 0.2s;
		background-color: ${palette.orange};
	}
`

const ActiveStaus = styled.div<any>`
	position: absolute;
	bottom: 0rem;
	right: 0;
	width: 0.719rem;
	height: 0.719rem;
	border-radius: 100%;
	border: 0.094rem solid ${palette.white};
	background: ${({active}) => (active ? palette.Btn_dark_green : palette.gray_100)};
`

const Chat = styled.img``

export default LikersCard
