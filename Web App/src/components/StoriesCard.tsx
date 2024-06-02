import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Text} from '../styled/shared'
import {BsCircleFill} from 'react-icons/bs'
import {palette} from '../styled/colors'
import {useNavigate} from 'react-router-dom'
import {colorPicker} from './utils'

const StoriesCard = ({data, setSellerId, setUserId}: any) => {
	const _navigate = useNavigate()
	const [color, setColor] = useState<any>('')
	useEffect(() => {
		if (data) {
			getColor()
		}
	}, [data])

	const getColor = async () => {
		let color = await colorPicker(data?.first_name[0].toLowerCase())
		setColor(color)
		return color
	}

	return (
		<>
			<Card
				onClick={() => {
					// _navigate('/products')
					// setUserId(data?.id)
					setSellerId(data?.id)
				}}>
				<div>
					<Profile styledColor={color}>
						{data?.image ? (
							<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${data?.image}`} />
						) : (
							<CustomText styledColor={palette.white} type="large" fontSize="1.4">
								{data?.first_name && data?.first_name[0].toUpperCase()}
							</CustomText>
						)}
						<IconWrapper>
							<BsCircleFill color={palette.online} />
						</IconWrapper>
					</Profile>
				</div>
				<NameWrapper>
					<StyledText type="small" color="text" lineHeight="1.7">
						{data?.first_name}
					</StyledText>
					{/* <MessageIcon /> */}
				</NameWrapper>
			</Card>
		</>
	)
}

const CustomText = styled(Text)<any>`
	color: ${({styledColor}) => (styledColor ? `${styledColor} !important` : palette.white)};
`
const Card = styled.div`
	cursor: pointer;
	width: 5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
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

const NameWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	word-break: break-word;
	border-bottom-left-radius: 1rem;
	border-bottom-right-radius: 1rem;
`

const StyledText = styled(Text)`
	white-space: nowrap;
	overflow: hidden;
	width: 5rem;
	text-overflow: ellipsis;
	text-transform: capitalize;
	text-align: center;
`

export default StoriesCard
