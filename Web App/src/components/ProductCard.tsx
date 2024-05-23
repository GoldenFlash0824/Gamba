import React, { useState, useEffect } from 'react'
import { palette } from '../styled/colors'
import styled from 'styled-components'
import { Text, Flexed, getDistanceFromLatLonInMiles } from '../styled/shared'
import { media } from 'styled-bootstrap-grid'
import { BsThreeDots } from 'react-icons/bs'
import EditPostModal from './modals/EditPostModal'
import { useNavigate } from 'react-router-dom'
import ReportModal from './modals/ReportModal'
import { useSelector } from 'react-redux'
import SocialShareModal from './modals/SocialShareModal'
import TradeDetailsModal from './modals/TradeDetailsModal'
import ProductDetailsModal from './modals/ProductDetailsModal'
import DeleteModal from './modals/DeleteModal'
import { toastSuccess } from '../styled/toastStyle'
import { deleteProduct } from '../apis/apis'
import { setIsLoading } from '../actions/authActions'
import { useDispatch } from 'react-redux'
import LoginPopupModel from './modals/LoginPopupModel'
import { IconWrapper, TextBelowUser, TopIcon } from './StyledCard'
import Lightbox from 'react-image-lightbox'
import moment from 'moment-timezone'

const ProductsCard = ({ cardIndex, productPurchase, soldProducts, sale, myProducts, onClose, content, addToCart, donation, trade, category, tradeCard }: any) => {
	const [showImg, setShowImg] = useState(false)
	const userId = useSelector<any>((state: any) => state.auth.userId)
	const _dispatch = useDispatch()

	const startDate = moment()
	const diffrenceInSeconds = moment(startDate).diff(moment(content?.createdAt), 'second')
	const _days = moment(startDate).diff(moment(content?.createdAt), 'day')
	const _minutes = moment(startDate).diff(moment(content?.createdAt), 'minutes')
	const _hours = moment(startDate).diff(moment(content?.createdAt), 'hour')

	const [minutes, setMinutes]: any[] = useState()
	const [seconds, setSeconds]: any[] = useState()
	const [hours, setHours]: any[] = useState()
	const [days, setDays]: any[] = useState()


	const [openSocialModal, setOpenSocialModal] = useState(false)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false)
	const [openProductEditModal, setOpenProductEditModal] = useState(false)
	const [reportProduct, setReportProduct] = useState(false)
	const _navigate = useNavigate()
	const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false)
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')
	const [distanceInMiles, setDistanceInMiles]: any = useState('')
	const [loginPopup, setLoginPopup] = useState(false)
	const [lightBoxOpen, setLightBoxOpen] = useState(false)
	const [photoIndex, setPhotoIndex] = useState(0)
	useEffect(() => {
		if (!Number.isNaN(diffrenceInSeconds)) {
			setSeconds(diffrenceInSeconds)
			setMinutes(_minutes)
			setHours(_hours)
			setDays(_days)
		}
	}, [diffrenceInSeconds, _days, _hours, _minutes])

	useEffect(() => {
		doGetDistanceFromLatLonInMiles()
	}, [])

	const doGetDistanceFromLatLonInMiles = async () => {
		if (content?.user?.lat && content?.user?.log && _userLocation.lat && _userLocation.log) {
			const res = await getDistanceFromLatLonInMiles(content?.user?.lat, content?.user?.log, _userLocation.lat, _userLocation.log)
			setDistanceInMiles(res)
		}
	}

	const onDeleteProduct = async () => {
		setIsDeleteProductModalOpen(false)
		_dispatch(setIsLoading(true))

		const response: any = await deleteProduct(content?.id)
		if (response?.success) {
			setIsDeleteProductModalOpen(false)
			onClose()
		}
		_dispatch(setIsLoading(false))
		toastSuccess(response?.message)
	}

	return (
		<>
			<CardWrapper
				trade={trade}
				onMouseEnter={() => {
					setShowImg(true)
				}}
				onMouseLeave={() => {
					setShowImg(false)
				}}>
				<TopIcon direction="row" justify="center">
					<IconWrapper
						status="trade"
						direction="row"
						align="center"
						justify="center"
						onClick={() => {
							if (isUserLogIn !== null) {
								setIsProductDetailsModalOpen(true)
							}
						}}>
						<img src="/images/icons/swap.svg" alt="trade" />
					</IconWrapper>
				</TopIcon>
				<ImgWrapper direction={'row'} align={'center'} justify={'center'}>

					{content?.images?.length ? (
						<Img
							src={process.env.REACT_APP_PUBLIC_IMAGE_URL + content.images[0]}
							alt="img"
							trade={trade}
							onClick={() => {
								setIsDetailsModalOpen(true)
							}}
						/>
					) : (
						<ImgPlaceHolder />
					)}

				</ImgWrapper>
				<CardBody direction={'column'} gap={0.688} className='position-relative'>
					<Flexed align="flex-end" justify="flex-end" className='position-absolute top-0  end-0 mr-4'>
						{myProducts ? (
							<Flexed align="flex-start" justify="flex-start">
								<Drop className='dots-v-hover'>
									<Dots />
									<DropContent>
										<DropMenu className="d-flex align-items-center gap-2"
											onClick={() => {
												isUserLogIn !== null ? setOpenSocialModal(true) : setLoginPopup(true)
											}}>
											<svg width="14" height="14" viewBox="0 0 448 512"><path d="M448 128c0 53-43 96-96 96c-28.9 0-54.8-12.8-72.4-33l-89.7 44.9c1.4 6.5 2.1 13.2 2.1 20.1s-.7 13.6-2.1 20.1L279.6 321c17.6-20.2 43.5-33 72.4-33c53 0 96 43 96 96s-43 96-96 96s-96-43-96-96c0-6.9 .7-13.6 2.1-20.1L168.4 319c-17.6 20.2-43.5 33-72.4 33c-53 0-96-43-96-96s43-96 96-96c28.9 0 54.8 12.8 72.4 33l89.7-44.9c-1.4-6.5-2.1-13.2-2.1-20.1c0-53 43-96 96-96s96 43 96 96zM96 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM400 128a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM352 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" fill='#5B626A' /></svg>
											Share
										</DropMenu>

										<DropMenu className="d-flex align-items-center gap-2"
											onClick={() => {
												isUserLogIn !== null ? setOpenProductEditModal(true) : setLoginPopup(true)
											}}>
											<svg width="14" height="14" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" fill='#5B626A' /></svg>
											Edit
										</DropMenu>
										<DropMenu className="d-flex align-items-center gap-2"
											onClick={() => {
												isUserLogIn !== null ? setIsDeleteProductModalOpen(true) : setLoginPopup(true)
											}}>
											<svg width="14" height="14" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" fill='#5B626A' /></svg>
											Delete
										</DropMenu>
									</DropContent>
								</Drop>
							</Flexed>
						) : (
							<>
								{userId !== content?.u_id && (
									<Drop className='dots-v-hover'>
										<Dots />
										<DropContent>
											<DropMenu className="d-flex align-items-center gap-2"
												onClick={() => {
													isUserLogIn !== null ? setReportProduct(true) : setLoginPopup(true)
												}}>
												<svg width="14" height="14" viewBox="0 0 512 512"><path d="M248.4 84.3c1.6-2.7 4.5-4.3 7.6-4.3s6 1.6 7.6 4.3L461.9 410c1.4 2.3 2.1 4.9 2.1 7.5c0 8-6.5 14.5-14.5 14.5H62.5c-8 0-14.5-6.5-14.5-14.5c0-2.7 .7-5.3 2.1-7.5L248.4 84.3zm-41-25L9.1 385c-6 9.8-9.1 21-9.1 32.5C0 452 28 480 62.5 480h387c34.5 0 62.5-28 62.5-62.5c0-11.5-3.2-22.7-9.1-32.5L304.6 59.3C294.3 42.4 275.9 32 256 32s-38.3 10.4-48.6 27.3zM288 368a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-8-184c0-13.3-10.7-24-24-24s-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24V184z" fill='#5B626A' /></svg>
												Report
											</DropMenu>
										</DropContent>
									</Drop>
								)}
							</>
						)}
					</Flexed>
					<div>
						<div >
							<TextBelowImg onClick={() => setIsDetailsModalOpen(true)} type="normal" textTransform="capitalize" fontWeight={700} color="black" title={content?.name + '/' + content?.category?.title}>
								{content?.name} / {content?.category?.title}
							</TextBelowImg>
							{content?.trade[0]?.title?.length ? (
								<Text fontWeight={700} type="normal" color="gray" fontSize={0.6} whiteSpaces={'nowrap'} style={{ fontStyle: 'oblique' }}>
									&nbsp;&nbsp; trade with &nbsp;&nbsp;
								</Text>
							) : (
								''
							)}
							<CardContent>
								<Flexed align="center" gap={0.5}>
									<Content className="d-flex" direction="" gap={0.2} justify="space-between">
										<StyledDiv tradeCard={tradeCard || myProducts}>
											{content?.trade[0]?.title && (() => {
												const tradeArray = JSON.parse(content.trade[0].title);
												return tradeArray.map((data: any, index: number) => (
													<>
														<Text
															fontWeight={700}
															key={index}
															textTransform="capitalize"
															type="normal"
															color="black"
														>
															{data?.trade_title}
														</Text>
														{index < tradeArray.length - 1 ? <span>,&nbsp;</span> : ''}
													</>
												));
											})()}
										</StyledDiv>
									</Content>
								</Flexed>
							</CardContent>
						</div>
						{!myProducts && (
							<Flexed className="" direction={'row'} align={'center'} gap={0.25}>
								<TextBelowUser
									onClick={() => {
										setIsProductDetailsModalOpen(true)
									}}
									type="small"
									textTransform="capitalize"
									color="text_description">
									<span style={{ fontWeight: 'bold' }}>by</span> {content?.user?.first_name} {content?.user?.last_name}
								</TextBelowUser>
								<LocationIcons src="/images/icons/location.svg" />
								<Distance>{distanceInMiles ? `${distanceInMiles}` : '0 miles.'}</Distance>
							</Flexed>
						)}

						{userId !== content?.u_id && (
							<Flexed direction="row" justify="flex-end">
								<ConnectButton
									onClick={() => {
										if (isUserLogIn !== null) {
											setIsProductDetailsModalOpen(true)
										} else if (isUserLogIn == null) {
											setLoginPopup(true)
										}
									}}
									disabled={isUserLogIn === null}>
									Connect
								</ConnectButton>
							</Flexed>
						)}
					</div>


				</CardBody>
			</CardWrapper>
			{openProductEditModal && (
				<EditPostModal
					productContent={content}
					onUpdate={onClose}
					openProductEditModal={openProductEditModal}
					onClose={() => {
						setOpenProductEditModal(false)
					}}
				/>
			)}
			{isDeleteProductModalOpen && <DeleteModal onClose={() => setIsDeleteProductModalOpen(false)} title={'Delete Product?'} body={'Are you sure you wan to delete this Product?'} onClick={() => onDeleteProduct()} />}
			{isProductDetailsModalOpen && (
				<TradeDetailsModal
					isTrade={true}
					content={content}
					addToCart={addToCart}
					sale={sale}
					productPurchase={productPurchase}
					soldProducts={soldProducts}
					donation={donation}
					onClose={() => {
						setIsProductDetailsModalOpen(false)
					}}
				/>
			)}
			{isDetailsModalOpen && (
				<ProductDetailsModal
					isTrade={true}
					content={content}
					addToCart={addToCart}
					sale={sale}
					productPurchase={productPurchase}
					soldProducts={soldProducts}
					donation={donation}
					onClose={() => {
						setIsDetailsModalOpen(false)
					}}
				/>
			)}
			{openSocialModal && (
				<SocialShareModal
					product={true}
					productData={content}
					onClose={() => {
						setOpenSocialModal(false)
					}}
				/>
			)}
			{reportProduct && (
				<ReportModal
					data={content}
					button={'Report Product'}
					onClose={() => {
						setReportProduct(false)
					}}
				/>
			)}
			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}

			{lightBoxOpen && (
				<Lightbox
					mainSrc={`https://imagescontent.s3.us-east-1.amazonaws.com/${content?.images[photoIndex]}`}
					nextSrc={content?.images?.length > 1 ? content?.images[(photoIndex + 1) % content?.images?.length] : false}
					prevSrc={content?.images.length > 1 ? content?.images[(photoIndex + content?.images.length - 1) % content?.images.length] : false}
					onCloseRequest={() => setLightBoxOpen(false)}
					onMovePrevRequest={() => setPhotoIndex((photoIndex + content?.images.length - 1) % content?.images.length)}
					onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % content?.images.length)}
				/>
			)}
		</>
	)
}

const CardContent = styled.div<any>`
	width: 100%;
`

const Content = styled(Flexed) <any>`
	width: 100%;
`

const ImgWrapper = styled(Flexed)`
	width: 100%;
	cursor: pointer;
	background: #ebebeb;
	border-top-left-radius: 1.25rem;
	border-top-right-radius: 1.25rem;
	overflow: hidden;
`

const Img = styled.img<any>`
	width: 100%;
	 height: 15.625rem;
	object-fit: cover;
	/* background: #ebebeb; */
`

const TextBelowImg = styled(Text)`
	width: inherit;
	white-space: nowrap;
	cursor: pointer;
`

const Distance = styled(Text)`
	width: 6.5rem;
	font-size: 12px;
	font-weight: 400;
	overflow: hidden;
	white-space: nowrap;
	cursor: pointer;
`

const StyledDiv = styled.div<any>`
	display: flex;
	flex-grow: ${({ tradeCard }) => tradeCard && 'wrap'};
	align-items: left;
	overflow: hidden;
	
`

const DropContent = styled.div<any>`
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

const Drop = styled.div`
	position: relative;
	&:hover ${DropContent} {
		display: block;
	}
`
const Dots = styled(BsThreeDots) <any>`
	color: ${palette.gray};
	cursor: pointer;
	
	font-size: 1.25rem;
`

const DropMenu = styled.span<any>`
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
const ImgPlaceHolder = styled.div`
	height: 5rem;
	width: 8rem;
	border-radius: 0.3rem;
	background: #ebebeb;
`

const CardBody = styled(Flexed)`
	position: relative;
	padding: 1.25rem;
`

const CardWrapper = styled.div<any>`
	position: relative;
	// overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: ${({ soldProducts, productPurchase }) => (soldProducts || productPurchase ? '7rem' : '9.65rem')};
	background-color: ${palette.white};
	border: 0.063rem solid ${palette.stroke};
	margin-bottom: 1rem;
	border-radius: 1.25rem;
	&:hover {
		border: 0.063rem solid ${palette.Btn_dark_green};
	}
`

const TradeButton = styled.div<any>`
	padding: 0.2rem 0.7rem;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 1rem;
	height: 2.2rem;
	color: ${palette.dark_black};
	font-weight: 700;
	font-size: 0.875rem;
	line-height: 1.125rem;
	text-align: left;
	opacity: 1;
	width: 7rem;
	text-transform: uppercase;
	letter-spacing: 0.02em;
	border: 1px solid ${palette.Btn_dark_green};
	background-color: ${({ disabled }) => (disabled ? palette.white : palette.white)};
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		background-color: ${({ disabled }) => (disabled ? palette.white : palette.Btn_dark_green)};
	}
`

export const MobileCartBtn = styled(TradeButton) <any>`
	${media.xs`display:flex`}
	${media.sm`display:none`};
`

const LocationIcons = styled.img`
	width: 0.875rem;
`

const ConnectButton = styled.div<any>`
	padding: 1.25rem 1.3rem;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 1.25rem;
	height: 2.5rem;
	color: ${palette.green_200};
	font-weight: 700;
	font-family: 'Lato-Regular', sans-serif;
	font-size: 0.875rem;
	text-align: left;
	opacity: 1;
	width: 7.5rem;
	border: 1px solid ${palette.green_200};
	background-color: ${palette.white};
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		background-color: ${({ disabled }) => (disabled ? palette.white : palette.green_200)};
		color: ${({ disabled }) => (disabled ? palette.green_200 : palette.white)};
	}
`

export default ProductsCard
