import { useEffect, useState } from 'react'
import { palette } from '../../styled/colors'
import styled from 'styled-components'
import { Text, Flexed, Spacer } from '../../styled/shared'
import PostProfile, { Drop, DropContent, DropMenu } from './PostProfile'
import PostAction from './PostAction'
import { BsCartPlus } from 'react-icons/bs'
import PostsCarosel from '../community/PostsCarosel'
import { useSelector } from 'react-redux'
import moment from 'moment-timezone'
import { useNavigate } from 'react-router-dom'
import DeleteModal from '../modals/DeleteModal'
import EditPost from '../modals/EditPost'
import { deletePost } from '../../apis/apis'
import { toastError, toastSuccess } from '../../styled/toastStyle'
import SocialShareModal from '../modals/SocialShareModal'
import { setIsLoading } from '../../actions/authActions'
import { useDispatch } from 'react-redux'
import LoginPopupModel from '../modals/LoginPopupModel'
import TextWithSeeMore from '../common/SeeMoreText'

const ProductPost = ({ cardIndex, data, setSellerId, getAllUserAndPosts, commentsModal, index, addToCart, community, userData, setUserId, onEdit, parent }: any) => {
	const userId = useSelector<any>((state: any) => state.auth.userId)
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const [readMore, setReadMore] = useState(false)
	const startDate = moment()
	const _dispatch = useDispatch()

	const diffrenceInSeconds = moment(startDate).diff(moment(data?.createdAt), 'second')
	const _days = moment(startDate).diff(moment(data?.createdAt), 'day')
	const _minutes = moment(startDate).diff(moment(data?.createdAt), 'minutes')
	const _hours = moment(startDate).diff(moment(data?.createdAt), 'hour')

	const [minutes, setMinutes]: any[] = useState()
	const [seconds, setSeconds]: any[] = useState()
	const [hours, setHours]: any[] = useState()
	const [days, setDays]: any[] = useState()
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const _navigate = useNavigate()
	const [openSocialModal, setOpenSocialModal] = useState(false)
	const [openEditPostModal, setOpenEditPostModal] = useState(false)
	const [openDeletePostModal, setOpenDeletePostModal] = useState(false)
	const [loginPopup, setLoginPopup] = useState(false)

	useEffect(() => {
		if (!Number.isNaN(diffrenceInSeconds)) {
			setSeconds(diffrenceInSeconds)
			setMinutes(_minutes)
			setHours(_hours)
			setDays(_days)
		}
	}, [diffrenceInSeconds, _days, _hours, _minutes])

	const onDeletePost = async () => {
		_dispatch(setIsLoading(true))
		setOpenDeletePostModal(false)
		const response: any = await deletePost(data?.id)
		if (response?.success) {
			toastSuccess(response?.message)
		} else {
			toastError(response?.message)
		}
		_dispatch(setIsLoading(false))
	}

	return (
		<CardWrapper className="seller-post" key={index + 'productList'} commentsModal={commentsModal}>
			{!parent && (
				<CustomFlex className='p-125' direction="row" align="center" justify="space-between">
					<PostProfile setSellerId={setSellerId} getAllUserAndPosts={getAllUserAndPosts} data={userData} setUserId={setUserId} userId={userId} postData={data} onEdit={onEdit} />
				</CustomFlex>
			)}
			<Flexed className='p-125 py-0 ' direction="row" gap={1} justify="space-between">
				<div>
					<Text color="black_100" fontWeight={700} type="normal" textTransform="capitalize">
						{data.title}
					</Text>

					{parent && data?.status && (
						<div>
							status: <span style={{ color: 'red' }}>Blocked</span>
						</div>
					)}
					<DiscriptionContent>
						<TextWithSeeMore text={data.description} maxLength={250} background="" />
					</DiscriptionContent>
				</div>
				{parent && (
					<Drop className='dots-hover'>
						<img src="/images/icons/dots.svg" alt="dots" />
						<DropContent>
							{userId === userData?.id && (
								<DropMenu className="d-flex align-items-center gap-2"
									onClick={() => {
										isUserLogIn !== null ? setOpenEditPostModal(true) : setLoginPopup(true)
									}}>
									<svg width="14" height="14" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" fill='#5B626A' /></svg>
									Edit
								</DropMenu>
							)}
							<DropMenu className="d-flex align-items-center gap-2"
								onClick={() => {
									isUserLogIn !== null ? setOpenSocialModal(true) : setLoginPopup(true)
								}}>
								<svg width="14" height="14" viewBox="0 0 448 512"><path d="M448 128c0 53-43 96-96 96c-28.9 0-54.8-12.8-72.4-33l-89.7 44.9c1.4 6.5 2.1 13.2 2.1 20.1s-.7 13.6-2.1 20.1L279.6 321c17.6-20.2 43.5-33 72.4-33c53 0 96 43 96 96s-43 96-96 96s-96-43-96-96c0-6.9 .7-13.6 2.1-20.1L168.4 319c-17.6 20.2-43.5 33-72.4 33c-53 0-96-43-96-96s43-96 96-96c28.9 0 54.8 12.8 72.4 33l89.7-44.9c-1.4-6.5-2.1-13.2-2.1-20.1c0-53 43-96 96-96s96 43 96 96zM96 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM400 128a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM352 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" fill='#5B626A' /></svg>
								Share
							</DropMenu>
							{userId === userData?.id && (
								<DropMenu className="d-flex align-items-center gap-2"
									onClick={() => {
										isUserLogIn !== null ? setOpenDeletePostModal(true) : setLoginPopup(true)
									}}>
									<svg width="14" height="14" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" fill='#5B626A' /></svg>
									Delete
								</DropMenu>
							)}
						</DropContent>
					</Drop>
				)}
			</Flexed>
			<Text className='p-125 py-0' isDarkTheme={_isDarkTheme} type="small" color="gray" fontWeight={400}>
				{days && days >= 0 && diffrenceInSeconds > 0 ? (
					<span>
						{days} {days === 1 ? ' day ago' : ' days ago'}
					</span>
				) : hours && hours >= 0 && diffrenceInSeconds > 0 ? (
					<span>
						{hours}
						{hours === 1 ? ' hour ago' : ' hours ago'}
					</span>
				) : minutes && minutes >= '0' && diffrenceInSeconds > 0 ? (
					<span>
						{minutes}
						{minutes === 1 ? ' minute ago' : ' minutes ago'}
					</span>
				) : seconds && seconds >= '0' && diffrenceInSeconds > 0 ? (
					<span>{seconds} seconds ago </span>
				) : (
					<span></span>
				)}
			</Text>
			<Spacer height={1.25} />
			{data?.images?.length > 0 && <PostsCarosel className='p-125' cardIndex={cardIndex} addToCart={addToCart} data={data?.images} />}

			<PostAction className='p-125 py-0' setUserId={setUserId} commentsModal={commentsModal} data={data} userData={userData} setSellerId={setSellerId} />

			{openDeletePostModal && <DeleteModal onClose={() => setOpenDeletePostModal(false)} title={'Delete Post?'} body={'Are you sure you wan to delete this Post?'} onClick={() => onDeletePost()} />}

			{openEditPostModal && (
				<EditPost
					postData={data}
					onClose={() => {
						setOpenEditPostModal(false)
					}}
					onEdit={onEdit}
				/>
			)}

			{openSocialModal && (
				<SocialShareModal
					postProfile={true}
					data={data}
					onClose={() => {
						setOpenSocialModal(false)
					}}
				/>
			)}

			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</CardWrapper>
	)
}

const CardWrapper = styled.div<any>`
	background-color: ${({ commentsModal }) => (commentsModal ? '' : palette.white)};
	border-radius: 0.675rem;
	transition: border 0.1s ease 0.1s;
	margin-bottom: ${({ commentsModal }) => (commentsModal ? '' : '1rem')};
	// padding: 1.25rem;
`

const CustomFlex = styled(Flexed) <any>`
	padding-bottom: 1.25rem;
`
const Title = styled(Text)``

const DiscriptionContent = styled(Text)`
	position: relative;
	padding-bottom: 0.5rem;
`

const Discription = styled(Text) <any>`
	letter-spacing: 0.32px;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	white-space: pre-wrap;
	overflow: ${({ showFullText }) => (showFullText ? '' : 'hidden')};
	-webkit-line-clamp: ${({ showFullText }) => (showFullText ? '' : '3')};
`

const SeeMore = styled(Text) <any>`
	position: ${({ showFullText }) => (showFullText ? '' : 'absolute')};
	bottom: 0;
	right: 0;
	background: ${palette.card_bg};
`
const CustomText = styled(Text) <any>``

const CartIcon = styled(BsCartPlus) <any>`
	display: none;
	color: ${palette.white};
`

const ViewCart = styled.div`
	position: absolute;
	display: none;
	align-items: center;
	justify-content: center;
	background-color: ${palette.Btn_dark_green};
	min-width: 10.443rem;
	padding: 0.875rem 1.75rem;
	height: 2.5rem;
	cursor: pointer;
	z-index: 1;

	&:after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transform: scaleY(0);
		transform-origin: bottom center;
		background: ${palette.orange};
		z-index: -1;
	}
	&:hover:after {
		transition: transform 0.5s ease;
		transform: scaleY(1);
	}

	&:hover ${CartIcon} {
		display: flex;
		transition: transform 0.5s ease;
	}

	&:hover ${CustomText} {
		display: none;
	}
`

export default ProductPost
