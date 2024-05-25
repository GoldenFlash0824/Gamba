import React from 'react'
import { Flexed, Text } from '../styled/shared'
import { media } from 'styled-bootstrap-grid'
import styled from 'styled-components'
import { palette } from '../styled/colors'

const PostCommentComponent = ({ openComment, isLike, isUserLogIn, addPostLikes, setIsLike, unLikePost, data, likes, setOpenAllLikesModal, setOpenComment, allComment, setOpenSocialModal, sharePost, setIsAllCommentsModalOpen, commentsModal }: any) => {
	var images = [
		{ id: 'like', img: 'http://i.imgur.com/LwCYmcM.gif' },
		{ id: 'love', img: 'http://i.imgur.com/k5jMsaH.gif' },
		{ id: 'haha', img: 'http://i.imgur.com/f93vCxM.gif' },
		{ id: 'yay', img: 'http://i.imgur.com/a44ke8c.gif' },
		{ id: 'wow', img: 'http://i.imgur.com/9xTkN93.gif' },
		{ id: 'sad', img: 'http://i.imgur.com/tFOrN5d.gif' },
		{ id: 'angry', img: 'http://i.imgur.com/1MgcQg0.gif' }
	]

	return (
		<CustomFlex className="row m-0 d-flex flex-row flex-wrap  post-actions-lcs p-125" openComment={openComment} >
			<div className="m-0 p-0 col-4 d-flex align-items-center justify-content-center " >
				<a className="p-2 w-100 justify-content-center gap-2 d-flex">
					{!isLike ? (
						<Img
							src="/images/icons/empty_heart.svg"
							alt="empty_heart"
							onClick={() => {
								if (isUserLogIn) {
									addPostLikes()
									setIsLike(true)
								}
							}}
						/>
					) : (
						<Img
							src="/images/icons/filled_heart.svg"
							alt="filled_heart"
							onClick={() => {
								if (isUserLogIn) {
									unLikePost()
									setIsLike(false)
								}
							}}
						/>
					)}
					<CustomText
						color="gray"
						type="small"
						fontWeight={600}
						pointer
						onClick={() => {
							// data?.total_likes_count
							if (likes > 0) {
								setOpenAllLikesModal(true)
							}
						}}>
						<span>{likes}&nbsp;</span>
						Like
					</CustomText>
				</a>
			</div>
			<div className="col-4 p-0 m-0 d-flex align-items-center justify-content-center ">
				<a
					className="p-2 w-100 justify-content-center gap-2 d-flex"

					onClick={() => {
						if (isUserLogIn !== null) {
							setOpenComment(!openComment)
						}
						if (!commentsModal) setIsAllCommentsModalOpen(true)
					}}>
					<CommentImg src="/images/icons/comment.svg" alt="comment" style={{ pointerEvents: 'none' }} />
					<CustomText type="small" color="gray" fontWeight={600}>
						{allComment}&nbsp;
						{allComment > 0 ? 'Comments' : 'Comment'}
					</CustomText>
				</a>
			</div>
			<div className="col-4 p-0 m-0 ">
				<a
					className="p-2 w-100 justify-content-center gap-2 d-flex"


					onClick={() => {
						setOpenSocialModal(true)
					}}>
					<Img src="/images/icons/share.svg" alt="share" />
					<CustomText type="small" color="gray" fontWeight={600} pointer>
						{/* {data?.total_share_count ? data?.total_share_count : 0} &nbsp; */}
						Share
					</CustomText>
				</a>
			</div>
		</CustomFlex>
	)
}

const EmojiWrapper = styled.div`
	position: absolute;
	display: none;
	top: -2.5rem;
	width: fit-content;
	align-items: center;
	background: ${palette.white};
	border: 1px solid ${palette.gray_200};
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
	padding: 0.3rem 0.5rem;
	gap: 0.5rem;
	border-radius: 4rem;
	z-index: 2;
`

const LikeWrapper = styled(Flexed)`
	position: relative;
	&:hover ${EmojiWrapper} {
		display: flex !important;
	}
`

const Emoji = styled.img`
	width: 2rem;
	height: 2rem;
	border-radius: 4rem;
	cursor: pointer;
	&:hover {
		transform: scale(1.25);
		transition: all 0.3s;
	}
`

const Title = styled.div`
	position: absolute;
	display: none;
	top: -2rem;
	left: -3px;
	width: fit-content;
	align-items: center;
	justify-content: center;
	background: ${palette.black};
	border-radius: 1rem;
	padding: 0.1rem 0.5rem;
	color: ${palette.white};
	font-size: 14px;
`

const Cover = styled.div`
	position: relative;
	&:hover ${Title} {
		display: flex !important;
	}
`

const Img = styled.img`
	cursor: pointer;
	width: 15px;
`

const CommentImg = styled.img`
	cursor: pointer;
	width: 17px;
`

const CustomFlex = styled(Flexed) <any>`
	width: 100%;
	 padding: 0.55rem 0.875rem;
	 ${media.xs`padding: 0.25rem 0rem;`}
	border-bottom: 1px solid ${palette.stroke};
	// gap: 15%;
`

const CustomText = styled(Text)`
	${media.xs`font-size:0.75rem !important;`}
`

export default PostCommentComponent
