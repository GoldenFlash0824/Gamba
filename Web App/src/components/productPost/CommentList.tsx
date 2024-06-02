import React, { useState } from 'react'
import Lightbox from 'react-image-lightbox'
import { media } from 'styled-bootstrap-grid'
import { palette } from '../../styled/colors'
import styled from 'styled-components'
import { Text, Flexed } from '../../styled/shared'

const CommentList = ({ data, user, onLikeClick, onDisLikeClick }: any) => {
	const [lightBoxOpen, setLightBoxOpen] = useState(false);

	return (
		<Flexed className='p-125 py-0 comment-list' direction="row" gap={0.625}>
			<div>
				<Profile styledColor={''}>
					{data?.commentedUser?.image ? (
						<UserProfileImg src={`https://imagescontent.s3.us-east-1.amazonaws.com/${data?.commentedUser?.image}`} alt="" />
					) : (
						<UserProfileImg src={`https://imagescontent.s3.us-east-1.amazonaws.com/${data?.commentedUser?.first_name && data?.commentedUser?.first_name[0]?.toLowerCase() + '.png'}`} alt="" />
					)}
				</Profile>
			</div>
			<InnerContent>
				<Box direction="row" justify="space-between">
					<UserName type="normal" textTransform="capitalize" fontWeight={500} color="black_200">
						{data?.commentedUser?.first_name && data?.commentedUser?.last_name ? data?.commentedUser?.first_name + ' ' + data?.commentedUser?.last_name : data?.commentedUser?.first_name && data?.commentedUser?.first_name}
					</UserName>
				</Box>
				<CommentText type="normal" color="gray" fontWeight={500} lineHeight={1.5}>
					{data?.comment}
					<ImageSection direction="row" gap={0.3} flexWrap="wrap">
						{data?.image && (
							<ImgWrapper onClick={() => { setLightBoxOpen(true) }}>
								<Img src={process.env.REACT_APP_PUBLIC_IMAGE_URL + data?.image} />
							</ImgWrapper>
						)}
					</ImageSection>
				</CommentText>
			</InnerContent>

			{lightBoxOpen && (
				<Lightbox
					mainSrc={process.env.REACT_APP_PUBLIC_IMAGE_URL + data?.image}
					onCloseRequest={() => setLightBoxOpen(false)}
				/>
			)}
		</Flexed>
	)
}

export const ImgWrapper = styled.div`
	position: relative;
	width: 6.25rem;
	height: 6.25rem;
	background: ${palette.gray_100};
	border-radius: 0.5rem;
	margin-bottom:4px;
`
export const Img = styled.img`
	width: 6.25rem;
	height: 6.25rem;
	border-radius: 0.5rem;
	object-fit: cover;
`

export const ImageSection = styled(Flexed) <any>`
	margin-top: 0.25rem;
	${media.xs`margin-top: 0.25rem;`}
	cursor: pointer
`

const Profile = styled.div<any>`
	height: 2.5rem;
	width: 2.5rem;
	border-radius: 100%;
	background: ${({ styledColor }) => styledColor && `${styledColor} !important`};
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	position: relative;
`

const UserProfileImg = styled.img`
	object-fit: cover;
	border-radius: 100%;
	width: 100%;
	height: 100%;
`

const InnerContent = styled(Flexed)`
	width: auto;
	background-color : #fff;
	border-radius: 8px;
	padding:4px 10px
`

const Box = styled(Flexed)`
	width: 100%;
`

const CommentText = styled(Text)`
	letter-spacing: 0.32px;
	text-transform: capitalize;
	font-size:14px;
`

const UserName = styled(Text)`
	overflow: hidden;
	white-space: nowrap;
	font-size: 14px;
	width: auto;
	${media.sm`width: auto`};
	${media.md`width: auto`};
	text-overflow: ellipsis;
`

export default CommentList
