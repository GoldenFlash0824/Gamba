import React, { useEffect, useState } from 'react'
import { palette } from '../styled/colors'
import styled from 'styled-components'
import { Text, Flexed, getDistanceFromLatLonInMiles } from '../styled/shared'
import { AiOutlineSwap } from 'react-icons/ai'
import { media } from 'styled-bootstrap-grid'
import { useDispatch } from 'react-redux'
import { addItemInCart } from '../actions/cartActions'
import { BsThreeDots } from 'react-icons/bs'
import ProductDetailsModal from './modals/ProductDetailsModal'
import { useSelector } from 'react-redux'
import EditPostModal from './modals/EditPostModal'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import ReportModal from './modals/ReportModal'
import DeleteModal from './modals/DeleteModal'
import { deleteProduct } from '../apis/apis'
import { toastSuccess } from '../styled/toastStyle'
import SocialShareModal from './modals/SocialShareModal'
import DonateDetailsModal from './modals/DonateDetailsModal'
import { setIsLoading } from '../actions/authActions'
import { AiOutlineHeart } from 'react-icons/ai'
import { AiFillHeart } from 'react-icons/ai'
import LoginPopupModel from './modals/LoginPopupModel'
import TextWithSeeMore from './common/SeeMoreText'
import Lightbox from 'react-image-lightbox'
//
const StyledCard = ({ cardIndex, sale, myProducts, content, addToCart, donation, trade, productPurchase, soldProducts, report, category, onClose }: any) => {
	const dispatch = useDispatch()
	const userId = useSelector<any>((state: any) => state.auth.userId)

	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false)
	const [openProductEditModal, setOpenProductEditModal] = useState(false)
	const [openSocialModal, setOpenSocialModal] = useState(false)
	const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false)
	const [reportProduct, setReportProduct] = useState(false)
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')
	const [isDonationDetailsModalOpen, setIsDonationDetailsModalOpen] = useState(false)
	const [loginPopup, setLoginPopup] = useState(false)
	const [productData, setProductData] = useState(content)

	const [showImg, setShowImg] = useState(false)
	const [quantity, setQuantity] = useState(1)

	const [distanceInMiles, setDistanceInMiles]: any = useState('')
	const [lightBoxOpen, setLightBoxOpen] = useState(false)
	const [photoIndex, setPhotoIndex] = useState(0)
	const [selectedIndex, setSelectedIndex] = useState(0)

	useEffect(() => {
		doGetDistanceFromLatLonInMiles()
	}, [])

	const doGetDistanceFromLatLonInMiles = async () => {
		if (content?.user?.lat && content?.user?.log && _userLocation.lat && _userLocation.log) {
			const res = await getDistanceFromLatLonInMiles(content?.user?.lat, content?.user?.log, _userLocation?.lat ? _userLocation?.lat : 0, _userLocation?.log ? _userLocation?.log : 0)
			setDistanceInMiles(res)
		}
	}

	const addToCartTrigger = () => {
		if (content.discount > 0) {
			let amount = content.price - (content.discount / 100) * content.price
			content.discountPrice = amount
		} else {
			content.discountPrice = content.price
		}

		dispatch(addItemInCart({ content: content, quantity }))
		setQuantity(1)
	}

	const reportProductFunction = async () => {
		isUserLogIn !== null ? setReportProduct(true) : setLoginPopup(true)
	}

	const onDeleteProduct = async () => {
		dispatch(setIsLoading(true))

		const response: any = await deleteProduct(content?.id)
		if (response?.success) {
			setIsDeleteProductModalOpen(false)
			onClose()
			toastSuccess(response?.message)
		}
		setIsDeleteProductModalOpen(false)
		dispatch(setIsLoading(false))
	}

	let fullName = content?.user?.first_name + ' ' + content?.user?.last_name
	return (
		<>
			<CardWrapper
				productPurchase={productPurchase}
				soldProducts={soldProducts}
				trade={trade}
				onMouseEnter={() => {
					setShowImg(true)
				}}
				onMouseLeave={() => {
					setShowImg(false)
				}}>
				<TopIcon direction="row" justify="center">
					{donation && (
						<IconWrapper
							status="donation"
							direction="row"
							align="center"
							justify="center"
							onClick={() => {
								if (isUserLogIn !== null) {
									setIsProductDetailsModalOpen(true)
								}
							}}>
							<img src="/images/icons/give_away_green.svg" alt="give_away_green" />
						</IconWrapper>
					)}
					{sale && (
						<IconWrapper
							status="sale"
							onClick={() => {
								if (isUserLogIn !== null) {
									setIsProductDetailsModalOpen(true)
								}
							}}
							direction="row"
							align="center"
							justify="center">
							<img src="/images/icons/sale_yellow.svg" alt="sale_yellow" style={{ filter: 'invert(47%) sepia(17%) saturate(549%) hue-rotate(169deg) brightness(25%) contrast(104%)' }} />
						</IconWrapper>
					)}
					{!sale && !donation && (
						<div>
							<IconWrapper
								status="product"
								onClick={() => {
									if (isUserLogIn !== null) {
										setIsProductDetailsModalOpen(true)
									}
								}}
								direction="row"
								align="center"
								justify="center">
								$
							</IconWrapper>
						</div>
					)}
				</TopIcon>
				<ImgWrapper direction={trade ? '' : 'row'} align={trade ? '' : 'center'} justify={trade ? '' : 'center'}>

					<div className='w-100'>
						<div id={`addCartBtn` + cardIndex} onClick={addToCart}></div>
						{trade ? (
							<Flexed direction="row" align="center" justify="center">
								{content?.images.map((d, ind) => (
									<Img
										src={`https://imagescontent.s3.us-east-1.amazonaws.com/${d?.images}`}
										alt="img"
										trade={trade}
										onClick={() => {
											setIsProductDetailsModalOpen(true)
										}}
									/>
								))}
								<AiOutlineSwap size={70} />
								{content?.images.map((d, ind) => (
									<Img
										src={`https://imagescontent.s3.us-east-1.amazonaws.com/${d?.images}`}
										alt="img"
										trade={trade}
										onClick={() => {
											setIsProductDetailsModalOpen(true)
										}}
									/>
								))}
							</Flexed>
						) : (
							<>
								{content?.images?.length ? (
									<div>
										<Img
											src={`https://imagescontent.s3.us-east-1.amazonaws.com/${content.images[0]}`}
											alt="img"
											onClick={() => {
												setIsProductDetailsModalOpen(true)
											}}
										/>{' '}
									</div>
								) : (
									<ImgPlaceHolder />
								)}
							</>
						)}
					</div>

				</ImgWrapper>

				<CardBody>
					<div>
						<div>
							<Flexed direction={'row'} align={'center'} justify={'space-between'}>
								<TextBelowImg
									onClick={() => {
										setIsProductDetailsModalOpen(true)
									}}
									type="normal"
									textTransform="capitalize"
									fontWeight={700}
									color="black"
									margin="0rem 0rem 0.3rem 0rem"
									title={content?.name + '/' + content?.category?.title}>
									{content?.name} <span style={{ fontWeight: 'normal' }}> / {content?.category?.title}</span>
								</TextBelowImg>
								<div>
									{myProducts ? (
										<StyledFlexed>
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
													{userId === content?.u_id && (
														<DropMenu className="d-flex align-items-center gap-2"
															onClick={() => {
																isUserLogIn !== null ? setOpenProductEditModal(true) : setLoginPopup(true)
															}}>
															<svg width="14" height="14" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" fill='#5B626A' /></svg>
															Edit
														</DropMenu>
													)}
													{userId === content?.u_id && (
														<DropMenu className="d-flex align-items-center gap-2"
															onClick={() => {
																isUserLogIn !== null ? setIsDeleteProductModalOpen(true) : setLoginPopup(true)
															}}>
															<svg width="14" height="14" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" fill='#5B626A' /></svg>
															Delete
														</DropMenu>
													)}
												</DropContent>
											</Drop>
										</StyledFlexed>
									) : (
										<>
											{userId !== content?.u_id && (
												<StyledFlexed>
													<Drop className='dots-v-hover'>
														<Dots />
														<DropContent>
															<DropMenu className="d-flex align-items-center gap-2"
																onClick={() => {
																	isUserLogIn !== null ? setOpenSocialModal(true) : setLoginPopup(true)
																}}>
																<svg width="14" height="14" viewBox="0 0 448 512"><path d="M448 128c0 53-43 96-96 96c-28.9 0-54.8-12.8-72.4-33l-89.7 44.9c1.4 6.5 2.1 13.2 2.1 20.1s-.7 13.6-2.1 20.1L279.6 321c17.6-20.2 43.5-33 72.4-33c53 0 96 43 96 96s-43 96-96 96s-96-43-96-96c0-6.9 .7-13.6 2.1-20.1L168.4 319c-17.6 20.2-43.5 33-72.4 33c-53 0-96-43-96-96s43-96 96-96c28.9 0 54.8 12.8 72.4 33l89.7-44.9c-1.4-6.5-2.1-13.2-2.1-20.1c0-53 43-96 96-96s96 43 96 96zM96 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM400 128a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM352 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" fill='#5B626A' /></svg>
																share
															</DropMenu>
															<DropMenu className="d-flex align-items-center gap-2"
																onClick={() => {
																	reportProductFunction()
																}}>
																<svg width="14" height="14" viewBox="0 0 512 512"><path d="M248.4 84.3c1.6-2.7 4.5-4.3 7.6-4.3s6 1.6 7.6 4.3L461.9 410c1.4 2.3 2.1 4.9 2.1 7.5c0 8-6.5 14.5-14.5 14.5H62.5c-8 0-14.5-6.5-14.5-14.5c0-2.7 .7-5.3 2.1-7.5L248.4 84.3zm-41-25L9.1 385c-6 9.8-9.1 21-9.1 32.5C0 452 28 480 62.5 480h387c34.5 0 62.5-28 62.5-62.5c0-11.5-3.2-22.7-9.1-32.5L304.6 59.3C294.3 42.4 275.9 32 256 32s-38.3 10.4-48.6 27.3zM288 368a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-8-184c0-13.3-10.7-24-24-24s-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24V184z" fill='#5B626A' /></svg>
																Report
															</DropMenu>
														</DropContent>
													</Drop>
												</StyledFlexed>
											)}
										</>
									)}
								</div>
							</Flexed>

							{!myProducts && (
								<Flexed margin={"0.3rem 0rem 0rem 0rem"} direction={'row'} align={'center'} justify={'space-between'}>
									<TextBelowUser
										onClick={() => {
											setIsProductDetailsModalOpen(true)
										}}
										type="small"
										textTransform="capitalize"
										color="text_description"
										width={fullName?.length >= 16}
										title={content?.user?.first_name + ' ' + content?.user?.last_name}>
										<span style={{ fontWeight: 'bold' }}>by</span> {content?.user?.first_name} {content?.user?.last_name}
									</TextBelowUser>
									<TextBelowImg color="black">
										{donation ? "Giveaway: " : trade ? "Trade:" : "Sold:"} {content?.totalSold}
									</TextBelowImg>
								</Flexed>
							)}

							{myProducts && content?.is_block && (
								<div>
									status: <span style={{ color: 'red' }}>Blocked</span>
								</div>
							)}

							<Flexed margin="0.8rem 0rem 0rem 0rem" direction="row" align="center">
								<LocationIcons src="/images/icons/location.svg" />
								<Distance>{distanceInMiles ? `${distanceInMiles}` : '0 mile.'}</Distance>
							</Flexed>

							<Flexed margin="0.3rem 0rem 0.625rem 0rem" direction="row" align="center" style={{ minHeight: '1.813rem' }}>
								<Text type="xsmall" fontWeight={500} color="gray">
									<TextWithSeeMore text={content?.caption} maxLength={45} background="white" />
								</Text>
							</Flexed>
						</div>


					</div>

					<Action ifWrap={sale} direction="row" gap={0.5} align="center">
						<Box direction="row" justify="space-between" align="center" gap="1">
							{donation && <span></span>}
							{sale && (
								<Text fontWeight={700} type="large" status="sale">
									$ {((content?.price ?? 0) - (content?.discount ?? 0) / 100 * (content?.price ?? 0)).toFixed(2)}
								</Text>
							)}
							{!sale && !donation && (
								<Text fontWeight={700} type="large" status="product">
									$ {((content?.price ?? 0) - (content?.discount ?? 0) / 100 * (content?.price ?? 0)).toFixed(2)}
								</Text>
							)}
							{!donation && userId !== content?.u_id && (
								<QuantityWrapper direction="row" justify="center" align="center" gap="0.3" soldProducts={soldProducts} productPurchase={productPurchase}>
									<div id="quantity">
										<Input type="number" disabled={content?.quantity > 0 && content?.quantity >= quantity ? false : true || productPurchase || soldProducts} value={quantity} onChange={(e: any) => setQuantity(e.target.value)} />
									</div>
									<CountWrapper justify="space-around">
										{productPurchase || soldProducts ? null : (
											<div>
												<Icons
													onClick={() => {
														setQuantity(quantity + 1)
													}}>
													<img src="/images/icons/arrow_up.svg" alt="arrow_qty" />
												</Icons>
											</div>
										)}
										{productPurchase || soldProducts ? null : (
											<div>
												<Icons
													add
													onClick={() => {
														quantity > 1 && setQuantity(quantity - 1)
													}}>
													<img src="/images/icons/arrow_down.svg" alt="arrow_qty" />
												</Icons>
											</div>
										)}
									</CountWrapper>
								</QuantityWrapper>
							)}
						</Box>
						<Flexed direction="row" justify="flex-end" margin={'0.3rem 0rem 0rem 0rem'}>
							{productPurchase || soldProducts ? null : (
								<>
									{donation ? (
										userId != content?.u_id && (
											<ConnectButton
												onClick={() => {
													if (isUserLogIn !== null) {
														setIsDonationDetailsModalOpen(true)
													} else if (isUserLogIn == null) {
														setLoginPopup(true)
													}
												}}>
												Connect
											</ConnectButton>
										)
									) : (
										<>
											{userId !== content?.u_id && (
												<ActionButton
													onClick={() => {
														if (isUserLogIn !== null && quantity !== 0) {
															addToCartTrigger()
														} else if (isUserLogIn == null) {
															setLoginPopup(true)
														}
													}}>
													<PlusIcons>+</PlusIcons>Cart
												</ActionButton>
											)}
										</>
									)}
								</>
							)}
						</Flexed>
					</Action>
				</CardBody>
			</CardWrapper>

			{isProductDetailsModalOpen && (
				<ProductDetailsModal
					content={content}
					addToCart={addToCartTrigger}
					sale={sale}
					productPurchase={productPurchase}
					soldProducts={soldProducts}
					donation={donation}
					onClose={() => {
						setIsProductDetailsModalOpen(false)
					}}
				/>
			)}

			{isDonationDetailsModalOpen && (
				<DonateDetailsModal
					content={content}
					addToCart={addToCartTrigger}
					sale={sale}
					productPurchase={productPurchase}
					soldProducts={soldProducts}
					donation={donation}
					onClose={() => {
						setIsDonationDetailsModalOpen(false)
					}}
				/>
			)}

			{openProductEditModal && (
				<EditPostModal
					productContent={content}
					openProductEditModal={openProductEditModal}
					onClose={() => {
						setOpenProductEditModal(false)
					}}
					onUpdate={onClose}
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

			{isDeleteProductModalOpen && (
				<DeleteModal onClose={() => setIsDeleteProductModalOpen(false)} title={'Delete Product?'} body={'Are you sure you wan to delete this Product?'} onClick={() => onDeleteProduct()} />
				// <CartItemDeleteModal
				// 	// openDeletePostModal={isDeteleProductModalOpen}
				// 	// id={data.id}
				// 	onClose={() => {
				// 		setIsDeleteProductModalOpen(false)
				// 	}}
				// />
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

const StyledText = styled(Text)`
	& > span {
		font-weight: 600;
		color: ${palette.red};
	}
`

const TextBelowImg = styled(Text)`
	width: fit-content;
	text-overflow: ellipsis;
	overflow: hidden;
	/* white-space: nowrap; */
	cursor: pointer;
`

export const TextBelowUser = styled(Text) <any>`
	width: ${({ width }) => (width ? '9rem' : '7rem')};
	color: rgb(67, 67, 67);
	// text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	cursor: pointer;
`

const Distance = styled(Text)`
	color: ${palette.gray};
	font-size: 12px;
	font-weight: 400;
	overflow: hidden;
	white-space: nowrap;
	line-height: normal;
`

const CardContent = styled.div<any>`
	width: ${({ isProductCard }) => (isProductCard ? '100%' : '100%')};
	margin-left: ${({ isProductCard }) => (isProductCard ? '0' : '0')};
`

const HeartIcon = styled(AiOutlineHeart) <any>`
	cursor: pointer;
	color: ${palette?.Btn_dark_green};

	font-size: 1.2rem;
`
const HeartIconFilled = styled(AiFillHeart) <any>`
	cursor: pointer;
	color: ${palette?.Btn_dark_green};

	font-size: 1.2rem;
`

const StyledDiv = styled.div<any>`
	display: flex;
	flex-direction: column;
	align-items: left;
	justify-content: space-between;
	// min-height: 5rem;
	width: ${({ isProductCard }) => (isProductCard ? 'auto' : 'auto')};
	overflow: hidden;
	gap: 0.4rem;
	margin-right: 0.5rem;
`

export const IconWrapper = styled(Flexed) <any>`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 100%;
	cursor: pointer;
	padding: 0.2rem;
	background: ${palette.white};
`

const PriceWrapper = styled(Text) <any>`
	fontsize: 12px !important;
	color: ${palette.black_100};
`
const LocationIcons = styled.img`
	width: 0.875rem;
`
const Dots = styled(BsThreeDots) <any>`
	font-size: 20px;
	color: ${palette.gray};
	cursor: pointer;
`

const StyledFlexed = styled.div``

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

const Img = styled.img<any>`
	width: 100%;
	height: 15.625rem;
	object-fit: cover;
`

const ImgPlaceHolder = styled.div`
	// width: 100vh;
	height: 14rem;
	background: #ebebeb;
`

const PiecesWrapper = styled.div<any>`
	width: 46%;
	display: flex;
	align-items: center;
	justify-content: center;
`
const ImgWrapper = styled(Flexed)`
	width: 100%;
	background: #ebebeb;
	border-top-left-radius: 1.25rem;
	border-top-right-radius: 1.25rem;
	overflow: hidden;
`
const ProductDetails = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-wrap: wrap;
	// gap: 0.5rem;
	word-break: break-word;
	width: 100%;
`
const ProductName = styled(Text) <any>`
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2; /* start showing ellipsis when 3rd line is reached */
	white-space: pre-wrap;
	cursor: pointer;
	&:hover {
		color: ${palette.text};
		transition: color 0.3s ease 0.5s;
	}
`
const ProductCategory = styled(ProductName) <any>``

const Sale = styled(Flexed) <any>`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 2rem;
	background-color: ${palette.Btn_dark_green};
	cursor: pointer;
`
const Donation = styled.div`
	width: 2rem;
	height: 2rem;
`

const CartIcon = styled.span`
	font-size: 1rem;
	color: ${palette.white};
	/* @media screen and (min-width: 0px) and (max-width: 405px) {
		font-size: 1rem;
	} */
`

const OnSaleText = styled.span<any>`
	font-size: 16px;
`
const Discount = styled.span<any>`
	font-size: 16px;
`

const Flex = styled(Flexed)`
	flex-wrap: wrap;
`
const StyledFlex = styled(Flexed)`
	padding-bottom: 1rem;
`

const Chemicals = styled(Text)`
	cursor: pointer;
	color: ${palette.text_description};
`
const ViewCart = styled.div<any>`
	position: relative;
	// display: none;
	display: flex;
	gap: 0.2rem;
	align-items: center;
	justify-content: center;
	background-color: ${({ disabled }) => (disabled ? 'rgb(164, 164, 164)' : palette.orange)};
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};

	/* min-width: 6rem; */
	padding: 0.2rem 0.7rem;
	height: 2rem;
	border-radius: 0.5rem;
	z-index: 1;

	&:hover:after {
		transition: transform 0.5s ease;
		transform: scaleY(1);
	}
`

const CardBody = styled(Flexed)`
	position: relative;
	padding: 1.25rem;
`

const CardWrapper = styled.div<any>`
	position: relative;
	display: flex;
	flex-direction: column;
	min-height: ${({ soldProducts, productPurchase }) => (soldProducts || productPurchase ? '7rem' : '9.65rem')};
	background-color: ${palette.white};
	border: 0.063rem solid ${palette.stroke};
	margin-bottom: 1rem;
	border-radius: 1.25rem;
	&:hover {
		border: 0.063rem solid ${palette.Btn_dark_green};
	}
	width: 100%;
`
const SwapButton = styled.div`
	opacity: 1;
	text-transform: uppercase;
	border: none;
	padding: 0.65rem 2rem;
	font-size: 1.5rem;
	height: 3rem;
	color: ${palette.white};
	background: ${palette.orange};
	/* font-weight: 600; */
	cursor: pointer;
	min-width: 6rem;
	line-height: 32px;
	white-space: nowrap;
	align-items: center;
	position: relative;
	display: flex;
	justify-content: center;
	transition: all ease 0.25s;
	font-family: 'Roboto';
	${media.xs`height: 2rem;font-size: 1.2rem;min-width: 2rem;`}
`

const Input = styled.input`
	border: none;
	font-family: 'Lato-Regular', sans-serif;
	line-height: 1.3rem;
	outline: none;
	font-weight: 700;
	font-size: 0.875rem;
	padding: 0.2rem 0rem;
	border-radius: 0.2rem;
	color: ${palette.black_100};
	background: ${palette.white};
	width: 1.5rem;
	&:focus {
		border: none;
	}
	&::placeholder {
		color: ${palette.black};
		opacity: 0.5; /* Firefox */
	}
`

const QuantityWrapper = styled(Flexed) <any>`
	border: 1px solid ${palette.stroke};
	border-radius: 1.25rem;
	min-width: 5rem;
	height: 40px;
	padding: 0.2rem;
`

export const MobileCartBtn = styled(SwapButton) <any>`
	${media.xs`display:flex`}
	${media.sm`display:none`};
`

const Price = styled.span`
	display: inline-block;
	color: ${palette.text_description};
	& > span {
		/* font-weight: 700; */
		color: ${palette.text_description};
	}
`

const Icons = styled.div<any>`
	border-radius: 1px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.8rem;
	cursor: pointer;
	color: ${palette.black};
	// background-color: ${({ add }) => (add ? palette.Btn_dark_green : 'rgb(164 164 164)')};
	transform: ${({ rotate }) => (rotate ? 'rotate(180deg)' : 'rotate(0deg)')};
	margin-top: ${({ rotate }) => (rotate ? '2px' : '0px')};
`

const CountWrapper = styled(Flexed) <any>`
	height: 95%;
`

const CardFooter = styled(Flexed)`
	background: #f0f2f5;
	padding: 0.7rem 1rem 1rem;
`
const ActionButton = styled.div<any>`
	padding: 1.25rem 1.3rem;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 1.25rem;
	height: 2.5rem;
	color: ${palette.white};
	font-weight: 700;
	font-family: 'Lato-Regular', sans-serif;
	font-size: 0.875rem;
	text-align: left;
	opacity: 1;
	gap: 0.3rem;
	width: 80px;
	border: 1px solid ${palette.green_200};
	background-color: ${palette.green_200};
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		background-color: ${({ disabled }) => (disabled ? palette.green_200 : palette.white)};
		color: ${({ disabled }) => (disabled ? palette.white : palette.green_200)};
	}
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
	width: 101px;
	border: 1px solid ${palette.green_200};
	background-color: ${palette.white};
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		background-color: ${({ disabled }) => (disabled ? palette.white : palette.green_200)};
		color: ${({ disabled }) => (disabled ? palette.green_200 : palette.white)};
	}
`

const MiddleIcon = styled(Flexed)`
	position: absolute;
	left: 0;
	right: 0;
	top: -2rem;
	margin: auto;
`

export const TopIcon = styled(Flexed)`
	position: absolute;
	right: 0.625rem;
	top: 0.625rem;
	margin: auto;
`
const Action = styled(Flexed)`
	justify-content: space-between;
	flex-wrap: ${({ ifWrap }) => (ifWrap ? 'wrap' : 'no-wrap')};
	@media screen and (min-width: 1200px) and (max-width: 1288px) {
		justify-content: flex-end !important;
	}
`

const Box = styled(Flexed)`
	
@media screen and (min-width: 1200px) and (max-width: 1288px) {
		width: 100% !important;
	}
`

const PlusIcons = styled.span`
	font-size: 18px;
`
export default StyledCard
