import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import 'react-responsive-modal/styles.css'
import {Text, Flexed} from '../styled/shared'
import {palette} from '../styled/colors'
import {useNavigate} from 'react-router-dom'
import {BsCircleFill} from 'react-icons/bs'
import {colorPicker} from './utils'

const EventJoinersCard = ({setUserId, event}: any) => {
	const _navigate = useNavigate()
	const [color, setColor] = useState<any>('')

	useEffect(() => {
		if (event) {
			getColor()
		}
	}, [event])

	const getColor = async () => {
		let color = await colorPicker(event.joinEventUser.first_name[0].toLowerCase())
		setColor(color)
		return color
	}

	return (
		<>
			<StyledFlex direction="row" align="center" justify="space-between">
				<Flexed direction="row" align="center" gap={1}>
					<div
						onClick={() => {
							_navigate('/products')
							setUserId(event.joinEventUser?.id)
						}}>
						<Profile styledColor={color}>
							{event.joinEventUser.image ? (
								<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${event.joinEventUser.image}`} />
							) : (
								<CustomText styledColor={palette.white} type="large" fontSize="1.4">
									{event.joinEventUser.first_name && event.joinEventUser.first_name[0].toUpperCase()}
								</CustomText>
							)}
							<IconWrapper>
								<BsCircleFill color={palette.online} />
							</IconWrapper>
						</Profile>
					</div>
					<VerticalDivider></VerticalDivider>
					<Text type="normal" textTransform="capitalize" fontWeight={500} color="black">
						{event.joinEventUser.first_name}
					</Text>
				</Flexed>
				<JoinButton
					onClick={() => {
						_navigate(`/chat/${event.joinEventUser?.chat_id}`)
					}}>
					Chat
				</JoinButton>
			</StyledFlex>
		</>
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
	height: 4rem;
	width: 4rem;
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
	border-bottom: 1px solid ${palette.silver};
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

const VerticalDivider = styled.div`
	width: 1px;
	height: 3.5rem;
	background: ${palette.silver};
`

export default EventJoinersCard
