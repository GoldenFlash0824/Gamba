import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {Text} from '../styled/shared'
import {colorPicker} from './utils'
import {useNavigate} from 'react-router-dom'

const ProfileImg = ({comment, commentReply, reply}: any) => {
	const [color, setColor] = useState<any>('')
	const _navigate = useNavigate()

	useEffect(() => {
		if (comment || commentReply) {
			getColor()
		}
	}, [comment, commentReply])

	const getColor = async () => {
		let color = await colorPicker(reply ? commentReply?.repliedUser.first_name[0].toLowerCase() : comment?.user?.name[0].toLowerCase())
		setColor(color)
		return color
	}

	return (
		<div>
			<Profile styledColor={color} onClick={() => _navigate(`products?id=${reply ? commentReply?.repliedUser?.id : comment.user?.id}`)}>
				{reply ? (
					<>
						{commentReply?.repliedUser?.image ? (
							<Img src={`${process.env.REACT_APP_PUBLIC_IMAGE_URL + commentReply?.repliedUser?.image}`} />
						) : (
							<Text color="white" type="normal">
								{commentReply?.repliedUser.first_name && commentReply?.repliedUser.first_name[0].toUpperCase()}
							</Text>
						)}
					</>
				) : (
					<>
						{comment.user.avatar ? (
							<Img src={comment.user.avatar} />
						) : (
							<Text color="white" type="normal">
								{comment?.user?.name && comment?.user?.name[0].toUpperCase()}
							</Text>
						)}
					</>
				)}
			</Profile>
		</div>
	)
}

const Img = styled.img<any>`
	object-fit: cover;
	border-radius: 100%;
	width: 100%;
	height: 100%;
`

const Profile = styled.div<any>`
	height: 2.5rem;
	width: 2.5rem;
	min-width: 1.8rem;
	border-radius: 1.563rem;
	margin-top: 0.15rem;
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

export default ProfileImg
