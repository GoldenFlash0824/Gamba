import React, { useEffect, useState } from 'react'
import { palette } from '../../styled/colors'
import styled from 'styled-components'
import { Text, Flexed, Spacer } from '../../styled/shared'
import { RxCrossCircled } from 'react-icons/rx'
import { RiMore2Fill } from 'react-icons/ri'
import SocialShareModal from '../modals/SocialShareModal'
import { media } from 'styled-bootstrap-grid'
import { AiFillHeart } from 'react-icons/ai'
import { AiOutlineHeart } from 'react-icons/ai'
import { colorPicker } from '../utils'

import {
	addPostLikesApi,
	doAddPostComment,
	doAddPostCommentDisLike,
	doAddPostCommentLike,
	doAddPostReply,
	doAddPostReplyDisLike,
	doAddPostReplyLike,
	doDeletePostComment,
	doDeletePostReply,
	doGetPostComment,
	doPostCommentRemoveDisLike,
	doPostCommentUnLike,
	doPostReplyUnLike,
	doPostReplyremoveDisLike,
	doUnlikePost,
	doUpdatePostComment,
	doUpdatePostReply
} from '../../apis/apis'
import { IoSend } from 'react-icons/io5'
import CommentsModal from '../modals/CommentsModal'
import moment from 'moment-timezone'
import { RiDeleteBin6Line } from 'react-icons/ri'
import Loader from '../common/Loader'
import { toastError } from '../../styled/toastStyle'
import ComentEditDeleteModal from '../modals/ComentEditDeleteModal'

import { GoComment } from 'react-icons/go'
import { TbShare3 } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import AllLikesModal from '../modals/AllLikesModal'
import ProfileImg from '../ProfileImg'
import PostCommentComponent from '../PostCommentComponent'
import { useDispatch } from 'react-redux'
import { commentCount } from '../../actions/authActions'
import CommentList from './CommentList'
import LoginPopupModel from '../modals/LoginPopupModel'

const PostAction = ({ data, sellersData, setUserId, userData, commentsModal, sellersCardOpen, setSellerId }: any) => {
	const { pathname }: any = useLocation()
	const _navigate = useNavigate()
	const [postComment, setPostComment] = useState([])
	const [likes, setLikes] = useState(0)
	const [comments, setComments] = useState(0)
	const [deleteHover, setDeleteHover] = useState(false)
	const [imageData, setImageData] = useState<any>(null)
	const commentOpen = useSelector<any>((state: any) => state.auth.commentOpen)
	const countComment: any = useSelector<any>((state: any) => state.auth.countComment)

	const [openAllLikesModal, setOpenAllLikesModal] = useState(false)
	// alert(commentOpen)
	const [sharePost, setSharePost] = useState(data?.sharePosts)
	const [myComment, setMyComment] = useState('')
	const [isAllCommentsModalOpen, setIsAllCommentsModalOpen] = useState(false)
	const [isLike, setIsLike] = useState(false)
	const [openComment, setOpenComment] = useState(commentsModal)
	const [openSocialModal, setOpenSocialModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const [totalLikes, setTotalLikes] = useState(0)
	const [totalReplyLikes, setTotalReplyLikes] = useState(0)
	const [commentId, setCommentId] = useState('')
	const [selectedComment, setSelectedComment] = useState('')
	const [color, setColor] = useState<any>('')
	const [openModel, setOpenModel] = useState(false)
	const [onEditComment, setOnEditComment] = useState<any>('')
	const [deleteCommentModel, setDeleteCommentModel] = useState<any>(false)
	const [allComment, setAllComments] = useState(0)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const userDetails: any = useSelector<any>((state: any) => state.auth.userDetails)
	const dispatch = useDispatch()
	const [loginPopup, setLoginPopup] = useState(false)

	const getSlugPost = async () => {
		if (pathname.includes('/post/')) {
			if (!commentsModal && commentOpen) {
				setOpenComment(true)
				setIsAllCommentsModalOpen(true)
			}
		}
	}

	useEffect(() => {
		getSlugPost()
	}, [])

	const addPostLikes = async () => {
		const response = await addPostLikesApi(data.id)
		if (response?.data) {
			dispatch(commentCount(1))
			setLikes(response?.data?.count)
		}
	}

	const unLikePost = async () => {
		const response = await doUnlikePost(data.id)
		if (response?.data) {
			dispatch(commentCount(1))
			setLikes(response?.data?.count)
		}
	}

	const getColor = async () => {
		let color = await colorPicker(data?.user?.first_name ? data?.user?.first_name[0].toUpperCase() : 'S')
		setColor(color)
		return color
	}

	const getForUserColor = async () => {
		let color = await colorPicker(userDetails?.first_name ? userDetails?.first_name[0].toUpperCase() : 'S')
		return color
	}

	useEffect(() => {
		getColor()
		if (data?.id && !commentsModal) {
			setAllComments(data?.total_comments_count)
			setLikes(data?.total_likes_count)
			setIsLike(data?.isLiked == 1 ? true : false)
		}
	}, [data])

	useEffect(() => {
		if (isAllCommentsModalOpen) {
			setAllComments(allComment)
		}
	}, [isAllCommentsModalOpen, allComment, commentsModal])

	useEffect(() => {
		if (data?.id && commentsModal && countComment === 0) {
			getPostComments(data?.id, 1)
		}
	}, [data])

	useEffect(() => {
		if (selectedComment) {
			setMyComment(selectedComment && `${selectedComment} `)
		}

		moment.updateLocale('en', {
			relativeTime: {
				future: 'in %s',
				past: '%s ago',
				s: function (number, withoutSuffix) {
					return withoutSuffix ? 'now' : 'a few seconds'
				},
				m: '1m',
				mm: '%dm',
				h: '1h',
				hh: '%dh',
				d: '1d',
				dd: '%dd',
				M: '1mth',
				MM: '%dmth',
				y: '1y',
				yy: '%dy'
			}
		})
	}, [selectedComment])

	const getPostComments = async (id: any, page: any, loading = true) => {
		setLoading(loading)
		const response = await doGetPostComment(id, page)
		if (response?.data) {
			setCommentId('')
			setTotalLikes(0)
			setTotalReplyLikes(0)
			setPostComment(response?.data?.all_post_comments)
			setLikes(response?.data?.all_post_comments[0]?.postLikes ? response?.data?.all_post_comments[0]?.postLikes : 0)
			setAllComments(response?.data?.all_post_comments[0]?.postComments ? response?.data?.all_post_comments[0]?.postComments : 0)
			setComments(response?.data?.all_post_comments[0]?.postComments ? response?.data?.all_post_comments[0]?.postComments : 0)
			setIsLike(response?.data?.all_post_comments[0]?.isPostLike == 1 ? true : false)

			if (response?.data?.all_post_comments.length == 0) {
				setLikes(data?.total_likes_count)
				setIsLike(data?.isLiked == 1 ? true : false)
			}

			setLoading(false)
		}
		setLoading(false)
	}

	const addPostComments = async (page: any) => {
		setLoading(true)
		const response = await doAddPostComment(data?.id, myComment, page, imageData ? imageData : null)
		if (response?.data) {
			setMyComment('')
			setImageData('')
			setLoading(false)
			setPostComment(response?.data?.comment?.allComments)
			setLikes(response?.data?.comment?.allComments[0]?.postLikes)
			setAllComments(response?.data?.comment?.allComments[0]?.postComments)
			dispatch(commentCount(response?.data?.comment?.allComments[0]?.postComments))
			setComments(response?.data?.comment?.allComments[0]?.postComments ? response?.data?.comment?.allComments[0]?.postComments : 0)
			setIsLike(response?.data?.comment?.allComments[0]?.isPostLike === 1 ? true : false)
		}
		setLoading(false)
	}

	const addPostCommentLike = async (comment_id: any) => {
		const response = await doAddPostCommentLike(data?.id, comment_id)
		if (response?.data) {
			getPostComments(data?.id, 1, false)
		}
	}

	const postCommentUnLike = async (comment_id: any) => {
		const response = await doPostCommentUnLike(data?.id, comment_id)
		if (response?.data) {
			getPostComments(data?.id, 1, false)
		}
	}

	const addPostReply = async (page: any) => {
		setLoading(true)
		const response: any = await doAddPostReply(data?.id, commentId, myComment?.replace(`${selectedComment} `, ''), page, imageData ? imageData : null)
		if (response?.data) {
			setMyComment('')
			setSelectedComment('')
			setImageData('')
			setLoading(false)
			setPostComment(response?.data?.reply?.allComments)
		}
		setLoading(false)
	}

	const updatePostComment = async (page: any) => {
		setLoading(true)
		const response: any = onEditComment?.isComment ? await doUpdatePostComment(onEditComment?.id, myComment, page, imageData ? imageData : null) : await doUpdatePostReply(onEditComment?.id, myComment, page, data?.id, imageData ? imageData : null)
		if (response?.data) {
			setMyComment('')
			setOnEditComment('')
			setImageData('')
			setLoading(false)
			setPostComment(response?.data?.comment)
		}
		setLoading(false)
	}

	const onDeleteComment = async (is_reply = false, id: any) => {
		if (id) {
			const response: any = is_reply ? await doDeletePostReply(id) : await doDeletePostComment(id)
			if (response?.success) {
				setMyComment('')
				setOnEditComment('')
				setDeleteCommentModel(false)
				getPostComments(data?.id, 1)
			}
		}
	}

	const postCommentDisLike = async (comment_id: any) => {
		const response = await doAddPostCommentDisLike(data?.id, comment_id)
		if (response?.data) {
			getPostComments(data?.id, 1, false)
		}
	}

	const postCommentRemoveDisLike = async (comment_id: any) => {
		const response = await doPostCommentRemoveDisLike(data?.id, comment_id)
		if (response?.data) {
			getPostComments(data?.id, 1, false)
		}
	}

	const postReplyDisLike = async (reply_id: any) => {
		const response = await doAddPostReplyDisLike(data?.id, reply_id)
		if (response?.data) {
			getPostComments(data?.id, 1, false)
		}
	}

	const postReplyRemoveDisLike = async (reply_id: any) => {
		const response = await doPostReplyremoveDisLike(data?.id, reply_id)
		if (response?.data) {
			getPostComments(data?.id, 1, false)
		}
	}

	const handleCapture = ({ target }: any) => {
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
		let _isValidFile = false
		if (target.files[0] && allowedTypes.includes(target.files[0].type)) {
			const reader = new FileReader()
			reader.readAsDataURL(target.files[0])
			reader.onload = () => {
				if (reader.readyState === 2) {
					setImageData(reader.result)
					// setImageData((prev): any => [reader.result, ...prev])
					// setImageData(reader?.result)
				}
			}
			_isValidFile = true
		}
		if (!_isValidFile) {
			toastError('Please upload a valid image file (JPEG, PNG, GIF).')
		}
	}

	// const deleteSelectImage = (index: any) => {
	// 	const deleteImage = imageData.filter((value, ind) => {
	// 		return ind !== index
	// 	})
	// 	setImageData(deleteImage)
	// }

	const sendCommentCaseFirst = () => {
		if (myComment?.length > 0 || imageData !== null) {
			if (isUserLogIn) {
				if (onEditComment?.id) {
					updatePostComment(1)
				} else {
					myComment?.search(`${selectedComment} `) === 0 ? addPostReply(1) : addPostComments(1)
				}
			} else {
				setLoginPopup(true)
				// _navigate('/sign-in')
			}
		}
	}

	const sendCommentCaseSecond = () => {
		if (myComment?.length > 0 || imageData !== null) {
			if (isUserLogIn) {
				addPostComments(1)
			} else {
				setLoginPopup(true)
				// _navigate('/sign-in')
			}
		}
	}

	return (
		<>
			<Flexed direction="row" align="center">
				{loading && <Loader visible={loading} />}
				<PostCommentComponent
					openComment={openComment}
					isLike={isLike}
					isUserLogIn={isUserLogIn}
					addPostLikes={addPostLikes}
					setIsLike={setIsLike}
					unLikePost={unLikePost}
					data={data}
					likes={likes}
					setOpenAllLikesModal={setOpenAllLikesModal}
					setOpenComment={setOpenComment}
					allComment={allComment}
					setOpenSocialModal={setOpenSocialModal}
					sharePost={sharePost}
					setIsAllCommentsModalOpen={setIsAllCommentsModalOpen}
					commentsModal={commentsModal}
				/>
			</Flexed>

			<CommentWrapper>
				{commentsModal && (
					<Wrapper>
						<SrollView>
							{postComment?.map((comment: any, index: any) => {
								// eslint-disable-next-line no-lone-blocks
								return (
									<Flexed className="p-125 pb-0 mb-0" margin="0rem 0rem 0.5rem 0rem" direction="column" onMouseEnter={() => setDeleteHover(index)} onMouseLeave={() => setDeleteHover(false)} key={index.toString()}>
										<Flexed gap={0.625} direction="row">
											<ProfileImg comment={comment} setSellerId={setSellerId} />
											<InnerContent>
												<Box>
													<UserName type="normal" textTransform="capitalize" fontWeight={500} color="black_200">
														{comment.user.name}
													</UserName>
													<BoxAction direction="row" align="center">
														<Reply
															color={palette.text_description}
															margin={'0'}
															cursor={'pointer'}
															onClick={() => {
																setSelectedComment(comment?.user?.name)
																setCommentId(comment?.id)
															}}>
															Reply
														</Reply>
														<UserMessage color={palette.text_description} margin="0">
															{moment(comment.createdAt).fromNow(true)}
														</UserMessage>
													</BoxAction>
												</Box>
												<CommentText margin="0.656rem 0rem 0rem 0rem" type="normal" color="gray" fontWeight={500} lineHeight={1.5}>
													{' '}
													{comment.text}{' '}
													<ImageSection direction="row" gap={0.3} flexWrap="wrap">
														{comment?.media && (
															<ImgWrapper>
																<Img src={process.env.REACT_APP_PUBLIC_IMAGE_URL + comment?.media} />
															</ImgWrapper>
														)}
													</ImageSection>
												</CommentText>
											</InnerContent>
											<DeleteComment>
												{comment?.isMeComment && (
													<>
														<Drop className="dots-v-hover align-items-baseline ">
															<Dots />
															<DropContent>
																<DropMenu className="d-flex align-items-center gap-2"
																	onClick={() => {
																		setOnEditComment({ ...comment, isComment: true })
																		setMyComment(comment?.text)
																	}}>
																	<svg width="14" height="14" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" fill="#5B626A"></path></svg>
																	Edit
																</DropMenu>
																<DropMenu className="d-flex align-items-center gap-2"
																	onClick={() => {
																		onDeleteComment(false, comment?.id)
																	}}>
																	<svg width="14" height="14" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" fill="#5B626A"></path></svg>
																	Delete
																</DropMenu>
															</DropContent>
														</Drop>
													</>
												)}
											</DeleteComment>
										</Flexed>

										<Flexed margin="0rem 1rem 0rem 3rem">
											{comment?.reply?.length
												? comment?.reply?.map((e: any, i: any) => {
													return (
														<Flexed margin="0rem 0rem 1rem 0rem" gap={0.625} direction="row">
															<ProfileImg commentReply={e} reply={true} setSellerId={setSellerId} />
															<InnerContent>
																<Box>
																	<UserName type="normal" textTransform="capitalize" fontWeight={500} color="black_200">
																		{e.repliedUser.first_name + ' ' + e.repliedUser.last_name}
																	</UserName>
																	<BoxAction direction="row" align="center">
																		<Reply
																			color={palette.text_description}
																			margin={'0'}
																			cursor={'pointer'}
																			onClick={() => {
																				setSelectedComment(e?.repliedUser?.first_name ? e?.repliedUser?.first_name + ' ' + e?.repliedUser?.last_name : '')
																				setCommentId(e?.c_id)
																			}}>
																			Reply
																		</Reply>
																		<UserMessage color={palette.text_description} margin="0">
																			{moment(e?.createdAt).from(moment(), true)}
																		</UserMessage>
																	</BoxAction>
																</Box>
																<CommentText margin="0.656rem 0rem 0rem 0rem" type="normal" color="gray" fontWeight={500} lineHeight={1.5}>
																	{e.reply}
																	<ImageSection direction="row" gap={0.3} flexWrap="wrap">
																		{e?.image && (
																			<ImgWrapper>
																				<Img src={process.env.REACT_APP_PUBLIC_IMAGE_URL + e?.image} />
																			</ImgWrapper>
																		)}
																	</ImageSection>
																</CommentText>
															</InnerContent>

															{e?.isMeReply === 1 && (
																<>
																	<Drop className="dots-v-hover">
																		<Dots />
																		<DropContent>
																			<DropMenu className="d-flex align-items-center gap-2"
																				onClick={() => {
																					setOnEditComment({ ...e, isComment: false })

																					setMyComment(onEditComment?.reply)
																				}}>
																				<svg width="14" height="14" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" fill="#5B626A"></path></svg>
																				Edit
																			</DropMenu>
																			<DropMenu className="d-flex align-items-center gap-2"
																				onClick={() => {
																					onDeleteComment(true, e?.id)
																				}}>
																				<svg width="14" height="14" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" fill="#5B626A"></path></svg>
																				Delete
																			</DropMenu>
																		</DropContent>
																	</Drop>
																</>
															)}
														</Flexed>
													)
												})
												: ''}
										</Flexed>
									</Flexed>
								)
							})}
						</SrollView>
						<Spacer height={0.5} />

						<>
							<CommentWriteBox direction="row" align="center" gap={0.625}>
								<div className='img-40'>
									<Profile styledColor={getForUserColor}>
										{userDetails?.image ? (
											<UserProfileImg src={`${process.env.REACT_APP_PUBLIC_IMAGE_URL + userDetails?.image}`} alt="" />
										) : (
											<UserProfileImg src={`${userDetails?.first_name ? process.env.REACT_APP_PUBLIC_IMAGE_URL + userDetails?.first_name[0].toLowerCase() + '.png' : '/images/icons/user_logo.png'}`} alt="" />
										)}
									</Profile>
								</div>
								<InputWrapper>
									<Input value={myComment} onChange={(e) => setMyComment(e.target.value)} placeholder='Comment ...' />
									<Icon direction="row" align="center" gap={3.65}>
										<Label>
											<FileInput
												// multiple
												// multiple
												id="faceImage"
												accept="image/jpeg/png"
												type="file"
												onChange={(e) => {
													handleCapture(e)
												}}
											/>
											{/* <MiniIcons src="/images/icons/attach_fille.svg" alt="attach_fille.svg" /> */}
										</Label>
										<Flexed direction="row" align="center" gap={0.75}>
											<Label>
												<FileInput
													// multiple
													// multiple
													id="faceImage"
													accept="image/jpeg/png"
													type="file"
													onChange={(e) => {
														handleCapture(e)
													}}
												/>
												<MiniIcons src="/images/icons/img_icon.svg" alt="img_icon.svg" />
											</Label>
											<Send
												value={myComment?.length > 0 || imageData !== null}
												onClick={() => {
													sendCommentCaseFirst()
												}}
											/>
										</Flexed>
									</Icon>
								</InputWrapper>
							</CommentWriteBox>
							{onEditComment && myComment && (
								<CustomDiv
									onClick={() => {
										setMyComment('')
										setOnEditComment('')
									}}>
									cancel
								</CustomDiv>
							)}
						</>
						<ImageSection direction="row" gap={0.3} flexWrap="wrap">
							{/* {imageData.map((value: any, index: any) => {
								return ( */}
							{imageData && (
								<ImgWrapper>
									<Img src={imageData} />
									<IconWrapper
										onClick={() => {
											setImageData(null)
										}}>
										<img src="/images/icons/image_cross.svg" alt="image_cross" />
									</IconWrapper>
								</ImgWrapper>
							)}
							{/* )
							})} */}
						</ImageSection>
					</Wrapper>
				)}

				{!commentsModal && (
					<>
						{data?.userComments?.length
							? data?.userComments?.map((res) => {
								return (
									<CommentList
										data={res}
										user={userDetails}
										onLikeClick={() => {
											if (isUserLogIn) {
												if (res?.likeComment?.some((like) => like['u_id'] === userDetails?.id)) {
													dispatch(commentCount(1))
													postCommentUnLike(res?.id)
												} else {
													dispatch(commentCount(1))
													addPostCommentLike(res?.id)
												}
											}
										}}
										onDisLikeClick={() => {
											if (isUserLogIn) {
												if (res?.dislikeComment?.some((like) => like['u_id'] === userDetails?.id)) {
													dispatch(commentCount(1))
													postCommentRemoveDisLike(res?.id)
												} else {
													dispatch(commentCount(1))
													postCommentDisLike(res?.id)
												}
											}
										}}
									/>
								)
							})
							: ''}

						<CommentWriteBox className="seller-post-comment" direction="row" padding="8px 0.875rem" margin="0rem 0rem 0rem 0rem" align="" gap={0.625}>
							<div className='img-40'>
								<Profile styledColor={getForUserColor}>
									{userDetails?.image ? (
										<UserProfileImg src={`${process.env.REACT_APP_PUBLIC_IMAGE_URL + userDetails?.image}`} alt="" />
									) : (
										<UserProfileImg src={`${userDetails?.first_name ? process.env.REACT_APP_PUBLIC_IMAGE_URL + userDetails?.first_name[0].toLowerCase() + '.png' : '/images/icons/user_logo.png'}`} alt="" />
									)}
								</Profile>
							</div>
							<InputWrapper>
								<Input value={myComment} onChange={(e) => setMyComment(e.target.value)} placeholder='Comment ...' />
								<Icon direction="row" align="center" gap={3.65}>
									<Label>
										<FileInput
											id="faceImage"
											accept="image/jpeg/png"
											type="file"
											onChange={(e) => {
												handleCapture(e)
											}}
										/>
									</Label>
									<Flexed direction="row" align="center" className="img-icon-gap">
										<Label>
											<FileInput
												// multiple
												// multiple
												id="faceImage"
												accept="image/jpeg/png"
												type="file"
												onChange={(e) => {
													handleCapture(e)
												}}
											/>
											<MiniIcons src="/images/icons/img_icon.svg" alt="img_icon.svg" />
										</Label>
										<Send
											value={myComment?.length > 0 || imageData !== null}
											onClick={() => {
												sendCommentCaseSecond()
											}}
										/>
									</Flexed>
								</Icon>
							</InputWrapper>
						</CommentWriteBox>
						<ImageSection direction="row" gap={0.3} flexWrap="wrap">
							{imageData && (
								<ImgWrapper>
									<Img src={imageData} />
									<IconWrapper
										onClick={() => {
											setImageData(null)
										}}>
										<img src="/images/icons/image_cross.svg" alt="image_cross" />
									</IconWrapper>
								</ImgWrapper>
							)}
							{/* )
							})} */}
						</ImageSection>
					</>
				)}
			</CommentWrapper>

			{isAllCommentsModalOpen && <CommentsModal setUserId={setUserId} sellersData={sellersData} data={data} sellersCardOpen={sellersCardOpen} userData={userData} onClose={() => setIsAllCommentsModalOpen(false)} totalComments={allComment} />}
			{openSocialModal && (
				<SocialShareModal
					postProfile={true}
					data={data}
					onClose={() => {
						setOpenSocialModal(false)
					}}
				/>
			)}

			{openModel && (
				<ComentEditDeleteModal
					onClose={() => {
						setOpenModel(false)
					}}
					onEdit={() => {
						setOpenModel(false)
						setMyComment(onEditComment?.isComment == true ? onEditComment?.text : onEditComment?.reply)
					}}
					onDelete={() => {
						setOpenModel(false)
						setDeleteCommentModel(true)
					}}
				/>
			)}
			{openAllLikesModal && <AllLikesModal setUserId={setUserId} data={data} onClose={() => setOpenAllLikesModal(false)} />}

			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</>
	)
}

const StyledFlex = styled(Flexed)`
	background-color: ${palette.fbBg};
	padding: 8px 12px;
	border-radius: 18px;
`
const Wrapper = styled.div`
	/* padding-bottom: 1rem; */
`
const Heart = styled(AiOutlineHeart) <any>`
	color: ${palette.text};
	${media.xs`font-size:0.85rem !important;`}
	font-size: 1.2rem;
	cursor: pointer;
`
const Profile = styled.div<any>`
	// height: 3.125rem;
	// width: 3.125rem;
	border-radius: 100%;
	background: ${({ styledColor }) => (styledColor ? `${styledColor} !important` : palette.Btn_dark_green)};
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	position: relative;
`

const UserProfileImg = styled.img<any>`
	object-fit: cover;
	border-radius: 100%;
	width: 100%;
	height: 100%;
`
const ProfileText = styled(Text)`
	color: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.red)};
`

const CommentWrapper = styled.div`
	// padding-top: 1.25rem;
`
const Flex = styled(Flexed) <any>``
export const CustomFlex = styled(Flexed) <any>`
	width: 100%;
	padding: 1.25rem;
	border-bottom: 1px solid rgba(3, 7, 30, 0.5);
`

export const DropContent = styled.div<any>`
	display: none;
	margin-top: 0rem;
	position: absolute;
	right: 0;
	background-color: ${({ isDarkTheme }) => (isDarkTheme ? palette.black : palette.white)};
	min-width: 8rem;
	box-shadow: ${palette.shadow};
	z-index: 2;
	border-radius: 0.5rem;
	overflow: hidden;
`

export const Drop = styled.div`
	position: relative;

	&:hover ${DropContent} {
		display: block;
	}
`

export const DropMenu = styled.span<any>`
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

const DeleteComment = styled.div`
	/* position: relative; */
`

export const Dots = styled(RiMore2Fill) <any>`
	color: ${palette.text};
	cursor: pointer;
	margin-top: 0.75rem;
`

const DeleteIcon = styled(RiDeleteBin6Line) <any>`
	color: ${palette.danger};
	cursor: pointer;
	display: ${({ visible }) => (visible === true ? 'block' : 'none')};
	/* position: absolute; */
`

const EditIcon = styled(RiMore2Fill) <any>`
	/* color: ${palette.danger}; */
	margin-top: 0.8rem;
	cursor: pointer;
	display: ${({ visible }) => (visible === true ? 'block' : 'none')};
	/* position: absolute; */
`

export const ImageSection = styled(Flexed) <any>`
	margin-top: 0rem !important;
	${media.xs`margin-top: 0rem;`}
`

const HeartFill = styled(AiFillHeart) <any>`
	color: ${palette.Btn_dark_green};
	${media.xs`font-size:0.85rem !important;`}
	font-size: 1.2rem;
	cursor: pointer;
`
export const ImgWrapper = styled.div`
	position: relative;
	width: 6.25rem;
	height: 6.25rem;
	background: ${palette.gray_100};
	border-radius: 0.25rem;
`
export const Img = styled.img`
	width: 6.25rem;
	height: 6.25rem;
	border-radius: 0.25rem;
	object-fit: cover;
`

export const IconWrapper = styled.div`
	position: absolute;
	top: 0.225rem;
	right: 0.625rem;
	cursor: pointer;
`

const CrossIcon = styled(RxCrossCircled)``

export const Comment = styled(GoComment) <any>`
	color: ${({ active }) => (active ? palette.Btn_dark_green : palette.text)};
	${media.xs`font-size:0.85rem !important;`}
	font-size: 1.2rem;
	cursor: pointer;
`
const CommentWriteBox = styled(Flexed) <any>`
	${media.xs`margin-bottom: 2rem;`}
	padding: 8px 0.875rem; 
`

const Icon = styled(Flexed) <any>`
	position: absolute;
	right: 0.938rem;
	top: 0;
	bottom: 0;
	margin: auto;
	z-index: 1;
	gap:1.90rem;
	${media.xs`bottom: 0rem;`}
`

export const Share = styled(TbShare3) <any>`
	font-weight: 400 !important;
	color: ${palette.text};
	${media.xs`font-size:0.85rem !important;`}
	font-size: 1.2rem;
	cursor: pointer;
`

const UserMessage = styled.p<any>`
	text-align: left;
	font-size: 0.8rem;
	margin: ${({ margin }) => (margin ? margin : '')};
	cursor: ${({ cursor }) => (cursor ? cursor : '')};
	color: ${({ color }) => (color ? color : 'palette.text_description')};
	margin: 0;
	overflow-wrap: anywhere;
`
const Reply = styled.p<any>`
	text-align: left;
	font-size: 0.8rem;
	margin: ${({ margin }) => (margin ? margin : '')};
	cursor: ${({ cursor }) => (cursor ? cursor : '')};
	color: ${({ color }) => (color ? color : 'palette.text_description')};
	margin: 0;
	overflow-wrap: anywhere;

	&:hover {
		color: ${palette.orange};
		text-decoration: underline;
	}
`

export const CustomText = styled(Text)`
	${media.xs`font-size:0.75rem !important;`}
`

const Send = styled(IoSend) <any>`
	font-size: 1.4rem;
	cursor: pointer;
	color: ${({ value }) => (value ? palette.Btn_dark_green : palette.silver)};
`
const InputWrapper = styled.div`
	position: relative;
	width: 100%;
`

const Input = styled.input`
	font-family: 'Lato-Regular', sans-serif;
	line-height: normal;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1.15rem;
	padding: 0.45rem 5.5rem 0.45rem 1.25rem;
	color: ${palette.black};
	width: 100%;
	&::placeholder {
		color: ${palette.gray_100};
	}
`

const FileUploadInput = styled.input`
	display: none !important;
`

const Upload = styled.label`
	display: flex;
	flex-direction: column;
	justify-content: center;
	cursor: pointer;
	margin-bottom: 0;
`

const SrollView = styled.div`
	overflow-x: hidden;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	max-height: 18rem;
	::-webkit-scrollbar {
		width: 0.2rem !important;
		height: 0.2rem;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #e5e6e9;
		border-radius: 1rem;
		border: 0.02rem solid ${palette.gray_100};
		border-width: 0rem 0.2rem 0rem 0rem;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: ${palette.gray};
		border-radius: 1rem;
	}
	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		/* background: #e5e6e9; */
	}
`
const CustomDiv = styled.div`
	padding: 0.4rem;
	font-size: 0.8rem;
	cursor: pointer;
	color: ${palette.danger};
`

const MiniIcons = styled.img`
	cursor: pointer;
`

const InnerContent = styled(Flexed)`
	margin-top: 0.55rem;
	width: 100%;
`

const Box = styled(Flexed)`
	width: 100%;
	${media.sm`
	flex-direction: row;
	justify-content: space-between;
	`}
`

const BoxAction = styled(Flexed)`
	gap: 0.5rem;
	${media.sm`
		justify-content: flex-end;
		gap:1rem;
	`}
`

const UserName = styled(Text)`
	overflow: hidden;
	white-space: nowrap;
	width: 9rem;
	${media.md`width: 12rem`};
	text-overflow: ellipsis;
`

const Icons = styled.img<any>`
	cursor: pointer;
	filter: ${({ active }) => (active ? 'invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);' : '')};
`

const CommentText = styled(Text)`
	letter-spacing: 0.32px;
	text-transform: capitalize;
`

const FileInput = styled.input`
	display: none !important;
`

const Label = styled.label`
	margin: 0rem;
`

export default PostAction
