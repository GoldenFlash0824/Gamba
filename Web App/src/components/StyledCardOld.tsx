import React, {useEffect, useState} from 'react'
import {palette} from '../styled/colors'
import styled from 'styled-components'
import {Text, Flexed, Spacer, getDistanceFromLatLonInMiles} from '../styled/shared'
import {AiOutlineMinus, AiOutlineSwap} from 'react-icons/ai'
import {media} from 'styled-bootstrap-grid'
import {AiOutlinePlus} from 'react-icons/ai'
import {useDispatch} from 'react-redux'
import {addItemInCart, addDirectItemInCart} from '../actions/cartActions'
import {useNavigate} from 'react-router-dom'
import {BsThreeDots} from 'react-icons/bs'
import ProductDetailsModal from './modals/ProductDetailsModal'
import {useSelector} from 'react-redux'
import EditPostModal from './modals/EditPostModal'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import ReportModal from './modals/ReportModal'
import DeleteModal from './modals/DeleteModal'
import {addFavProducts, deleteProduct} from '../apis/apis'
import {toastError, toastSuccess} from '../styled/toastStyle'
import SocialShareModal from './modals/SocialShareModal'
import DonateDetailsModal from './modals/DonateDetailsModal'
import {BsCart3} from 'react-icons/bs'
import {setIsLoading} from '../actions/authActions'
import {AiOutlineHeart} from 'react-icons/ai'
import {AiFillHeart} from 'react-icons/ai'
import {RiArrowUpSFill} from 'react-icons/ri'
import LoginPopupModel from './modals/LoginPopupModel'
//
const StyledCard = ({cardIndex, sale, myProducts, content, addToCart, donation, trade, productPurchase, soldProducts, report, category, onClose}: any) => {
	const dispatch = useDispatch()
	const _navigate = useNavigate()
	const userId = useSelector<any>((state: any) => state.auth.userId)

	const [isFav, setIsFav] = useState(content?.isFev ? true : false)

	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false)
	const [openProductEditModal, setOpenProductEditModal] = useState(false)
	const [openSocialModal, setOpenSocialModal] = useState(false)
	const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false)
	const [reportProduct, setReportProduct] = useState(false)
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')
	const [isDonationDetailsModalOpen, setIsDonationDetailsModalOpen] = useState(false)
	const [loginPopup, setLoginPopup] = useState(false)

	const [showImg, setShowImg] = useState(false)
	const [quantity, setQuantity] = useState(1)

	const [distanceInMiles, setDistanceInMiles]: any = useState('')

	useEffect(() => {
		doGetDistanceFromLatLonInMiles()
	}, [])

	const doGetDistanceFromLatLonInMiles = async () => {
		if (content?.user?.lat && content?.user?.log && _userLocation.lat && _userLocation.log) {
			const res = await getDistanceFromLatLonInMiles(content?.user?.lat, content?.user?.log, _userLocation.lat, _userLocation.log)
			setDistanceInMiles(res)
		}
	}

	const addToCartTrigger = () => {
		// debugger
		// let _element: any = document.getElementById(`addCartBtn` + cardIndex)
		// _element.click()
		// content['default_quantity'] = defaultQuantity
		// content.quantity = quantity
		// debugger
		// content.quantity++
		if (content.discount > 0) {
			let amount = content.discount ? content.price - (content.discount / 100) * content.price : content.price

			content.discountPrice = amount
		} else {
			content.discountPrice = content.price
		}
		// console.log('discount data', amount)
		setQuantity(1)
		dispatch(addItemInCart({content, quantity}))
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
	//
	// console.log('content', content?.quantity > 0 && content?.quantity >= quantity)
	const doAddFavProducts = async () => {
		dispatch(setIsLoading(true))
		const response = await addFavProducts(content?.id)
		dispatch(setIsLoading(false))
	}
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
				<CardBody gap={0.3}>
					<Flexed direction="row" gap={0.8}>
						<ImgWrapper direction={trade ? '' : 'row'} align={trade ? '' : 'center'} justify={trade ? '' : 'center'}>
							<Flexed gap={0.5}>
								<div>
									<div id={`addCartBtn` + cardIndex} onClick={addToCart}></div>
									{trade ? (
										<Flexed direction="row" align="center" justify="center">
											{content?.images.map((d) => (
												<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${d?.images}`} alt="img" trade={trade} />
											))}
											<AiOutlineSwap size={70} />
											{content?.images.map((d) => (
												<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${d?.images}`} alt="img" trade={trade} />
											))}
										</Flexed>
									) : (
										<>
											{content?.images?.length ? (
												<div
													onClick={() => {
														setIsProductDetailsModalOpen(true)
													}}>
													<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${content.images[0]}`} alt="img" />{' '}
												</div>
											) : (
												<ImgPlaceHolder />
											)}
										</>
									)}
								</div>
							</Flexed>
						</ImgWrapper>

						<Flexed>
							{donation && (
								<IconWrapper
									margin="0.6rem 0rem 0rem 0rem"
									direction="row"
									align="center"
									justify="center"
									onClick={() => {
										if (isUserLogIn !== null) {
											setIsDonationDetailsModalOpen(true)
										}
									}}>
									<Icon src="/icons/donationNew.png" />
								</IconWrapper>
							)}
							{sale && (
								<div>
									<IconWrapper
										onClick={() => {
											if (isUserLogIn !== null) {
												setIsProductDetailsModalOpen(true)
											}
										}}
										margin="0.6rem 0rem 0rem 0rem"
										direction="row"
										align="center"
										justify="center">
										<Icon src="/icons/saleNew.png" />
									</IconWrapper>
								</div>
							)}
							{!sale && !donation && (
								<div>
									<IconWrapper
										onClick={() => {
											if (isUserLogIn !== null) {
												setIsProductDetailsModalOpen(true)
											}
										}}
										margin="0.6rem 0rem 0rem 0rem"
										direction="row"
										align="center"
										justify="center">
										<Icon src="/icons/normalProductNew.png" />
									</IconWrapper>
								</div>
							)}
						</Flexed>

						<CardContent isProductCard={!donation && !sale}>
							<Flexed>
								<Flexed direction="row" justify="space-between" gap={0.2}>
									{/* <ProductDetails
									onClick={() => {
										setIsProductDetailsModalOpen(true)
									}}>
									<ProductCategory type="normal" color="text">
										{content.name}
									</ProductCategory> */}
									{/* <ProductName  type="normal" color="text_description">

							</ProductName> */}
									{/* {!trade && (
									<>
										{!content.is_organic ? (
											<Chemicals type="small" color="text_description">
												Chemical (4)
											</Chemicals>
										) : (
											<Chemicals color="text_description" type="small">
												No Chemical Used
											</Chemicals>
										)}
									</>
								)} */}
									{/* </ProductDetails> */}

									<StyledDiv isProductCard={!donation && !sale}>
										{sale ? (
											<Flex>
												{/* <Flexed direction="row" align="center" gap={0.4}>
											<Text color="text_description">
												<del>${content?.price?.toFixed(2)}</del>
											</Text>
											<Text fontSize={0.813} type="small" color="text_description">
												Was
											</Text>
										</Flexed>
										<Flexed direction="row" align="center" gap={0.4}>
											<Discount color="orange">${(content.price - (content.discount / 100) * content.price).toFixed(2)}</Discount>
											<Text fontSize={0.813} type="small" color="text_description">
												Now
											</Text>
										</Flexed> */}
												<Flexed gap={0.4}>
													<StyledText color="text_description">
														<>${content?.price?.toFixed(2)}</>
													</StyledText>
													<Flexed direction="row">
														<StyledText color="text_description">
															<OnSaleText style={{color: '#273838', fontWeight: '400'}}>on sale </OnSaleText> <Discount> ${(content?.price - (content?.discount / 100) * content?.price)?.toFixed(2)}</Discount>
														</StyledText>
													</Flexed>
												</Flexed>
											</Flex>
										) : donation ? (
											<Flexed>
												<Text color="text_description">
													{content.allow_per_person}
													&nbsp;{content.unit}
												</Text>
												{/* <Text type="small" color="text_description">
											{content.quantity + ' ' + content.unit}
										</Text> */}
											</Flexed>
										) : (
											<div>
												<Text>
													<Spacer height={0.1} />
													<Price>
														<span>${content.price.toFixed(2)}</span> / {content.unit}
													</Price>
												</Text>
												{productPurchase || soldProducts ? (
													<Flexed direction="row" align="center" gap={1}>
														{/* <Text color="text_description">
													<Spacer height={0.1} />
													Quantity {content?.quantity}
												</Text> */}
														<Text color="text_description">
															<Spacer height={0.1} />
															Sold {content?.total_sold}
														</Text>
													</Flexed>
												) : null}
											</div>
										)}
										{!donation && userId !== content?.u_id && (
											<QuantityWrapper direction="row" align="center" gap="0.3" soldProducts={soldProducts} productPurchase={productPurchase}>
												Qty:
												<div id="quantity">
													<Input
														type="number"
														disabled={content?.quantity > 0 && content?.quantity >= quantity ? false : true || productPurchase || soldProducts}
														value={quantity}
														onChange={(e: any) => setQuantity(e.target.value)}
													/>
												</div>
												<CountWrapper justify="space-around">
													{productPurchase || soldProducts ? null : (
														<div>
															<Icons
																onClick={() => {
																	// if (content?.quantity > 0 && content?.quantity > quantity) {
																	// if (content?.quantity > 0) {
																	setQuantity(quantity + 1)
																	// }
																}}>
																<img src="/icons/arrow_qty.png" alt="arrow_qty" />
															</Icons>
														</div>
													)}
													{productPurchase || soldProducts ? null : (
														<div>
															<Icons
																rotate={true}
																add
																onClick={() => {
																	quantity > 1 && setQuantity(quantity - 1)
																}}>
																<img src="/icons/arrow_qty.png" alt="arrow_qty" />
															</Icons>
														</div>
													)}
												</CountWrapper>
											</QuantityWrapper>
										)}
									</StyledDiv>

									{myProducts ? (
										<StyledFlexed>
											{/* <MessageIcon /> */}

											<Drop>
												<Dots />
												<DropContent>
													<DropMenu
														onClick={() => {
															isUserLogIn !== null ? setOpenSocialModal(true) : setLoginPopup(true)
														}}>
															
														Share
													</DropMenu>
													{userId === content?.u_id && (
														<DropMenu
															onClick={() => {
																isUserLogIn !== null ? setOpenProductEditModal(true) : setLoginPopup(true)
															}}>
															Edit
														</DropMenu>
													)}
													{userId === content?.u_id && (
														<DropMenu
															onClick={() => {
																isUserLogIn !== null ? setIsDeleteProductModalOpen(true) : setLoginPopup(true)
															}}>
															Delete
														</DropMenu>
													)}
													{/* <DropMenu
										onClick={() => {
											isUserLogIn !== null ? _navigate('/') : setLoginPopup(true)
										}}>
										Hide
									</DropMenu> */}
													{/* <DropMenu>See Image</DropMenu> */}
												</DropContent>
											</Drop>
										</StyledFlexed>
									) : (
										<>
											{userId !== content?.u_id && (
												<StyledFlexed>
													<Drop>
														<Dots />
														<DropContent>
															<DropMenu
																onClick={() => {
																	reportProductFunction()
																}}>
																Report
															</DropMenu>
														</DropContent>
													</Drop>
												</StyledFlexed>
											)}
										</>
									)}
								</Flexed>
							</Flexed>
						</CardContent>
					</Flexed>

					<Flexed direction="row" justify="space-between">
						<div>
							<TextBelowImg
								onClick={() => {
									setIsProductDetailsModalOpen(true)
								}}
								type="small"
								textTransform="capitalize"
								fontWeight="500"
								color="text_description">
								{content?.name}
							</TextBelowImg>
							{content?.user?.lat && content?.user?.log && _userLocation.lat && _userLocation.log && <Distance margin={'1px 0px'}>{distanceInMiles ? `${distanceInMiles}` : '0 milles'}</Distance>}
						</div>
						<Flexed direction="row" justify="flex-end" gap={0.5}>
							{productPurchase || soldProducts ? null : (
								<>
									{donation ? (
										<ActionButton
											onClick={() => {
												if (isUserLogIn !== null) {
													setIsDonationDetailsModalOpen(true)
												}
											}}
											disabled={isUserLogIn === null}>
											Donation
										</ActionButton>
									) : (
										<>
											{userId !== content?.u_id && (
												// <Flexed direction="row" align="center">
												// 	<ViewCart
												// 		onClick={() => {
												// 			if (isUserLogIn !== null && quantity !== 0) {
												// 				addToCartTrigger()
												// 			}
												// 		}}
												// 		disabled={isUserLogIn === null}>
												// 		<CartIcon
												// 		// onClick={() => {
												// 		// 	if (isUserLogIn !== null) {
												// 		// 		addToCartTrigger()
												// 		// 	}
												// 		// 	}}
												// 		>
												// 			{/* &#128722; */}
												// 			<BsCart3 />
												// 		</CartIcon>
												// 	</ViewCart>
												// </Flexed>
												<ActionButton
													onClick={() => {
														if (isUserLogIn !== null && quantity !== 0) {
															addToCartTrigger()
														}
													}}
													disabled={isUserLogIn === null}>
													<PlusIcons>+</PlusIcons>Cart
												</ActionButton>
											)}
										</>
									)}
								</>
							)}
						</Flexed>
					</Flexed>
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
	width: 6.5rem;
	// text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	cursor: pointer;
`

const Distance = styled(Text)`
	width: 6.5rem;
	font-size: 13px;
	overflow: hidden;
	white-space: nowrap;
	cursor: pointer;
	font-style: italic;
`

const CardContent = styled.div<any>`
	width: ${({isProductCard}) => (isProductCard ? '100%' : '100%')};
	margin-left: ${({isProductCard}) => (isProductCard ? '0' : '0')};
`

const HeartIcon = styled(AiOutlineHeart)<any>`
	cursor: pointer;
	color: ${palette?.Btn_dark_green};

	font-size: 1.2rem;
`
const HeartIconFilled = styled(AiFillHeart)<any>`
	cursor: pointer;
	color: ${palette?.Btn_dark_green};

	font-size: 1.2rem;
`

const StyledDiv = styled.div<any>`
	display: flex;
	flex-direction: column;
	align-items: left;
	justify-content: space-between;
	min-height: 5rem;
	width: ${({isProductCard}) => (isProductCard ? 'auto' : 'auto')};
	overflow: hidden;
	gap: 0.4rem;
	margin-top: 0.3rem;
`

const IconWrapper = styled(Flexed)`
	width: 3rem;
	height: 3rem;
	border-radius: 2rem;
	cursor: pointer;
`
const Icon = styled.img`
	width: 100%;
`
const Dots = styled(BsThreeDots)<any>`
	color: ${palette.text};
	cursor: pointer;
	transform: rotate(90deg);
`

const Img = styled.img<any>`
	height: 5rem;
	width: 6.5rem;
	border-radius: 0.3rem;
	background: #ebebeb;
`

const StyledFlexed = styled.div`
	/* position: absolute;
	right: 1rem; */
`

const DropContent = styled.div<any>`
	display: none;
	margin-top: 0rem;
	position: absolute;
	right: 0;
	background-color: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
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
const ImgPlaceHolder = styled.div`
	height: 5rem;
	width: 8rem;
	border-radius: 0.3rem;
`

const PiecesWrapper = styled.div<any>`
	width: 46%;
	display: flex;
	align-items: center;
	justify-content: center;
`
const ImgWrapper = styled(Flexed)`
	width: 6.5rem;
	cursor: pointer;
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
const ProductName = styled(Text)<any>`
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
const ProductCategory = styled(ProductName)<any>``

const Sale = styled(Flexed)<any>`
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
	background-color: ${({disabled}) => (disabled ? 'rgb(164, 164, 164)' : palette.orange)};
	cursor: ${({disabled}) => (disabled ? 'no-drop' : 'pointer')};

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
	padding: 1rem 1rem 0.5rem 1rem;
`

const CardWrapper = styled.div<any>`
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: ${({soldProducts, productPurchase}) => (soldProducts || productPurchase ? '7rem' : '9.65rem')};
	background-color: ${palette.white};
	box-shadow: ${palette.posts_shadow_1} 0px 8px 24px;
	border: 0.063rem solid #f0f2f5;
	margin-bottom: 1rem;
	border-radius: 1.25rem;
	&:hover {
		border: 0.063rem solid ${palette.Btn_dark_green};
	}
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
	font-family: 'Roboto';
	line-height: 1.3rem;
	outline: none;
	font-weight: 400;
	font-size: 0.875rem;
	padding: 0.2rem 0rem;
	border-radius: 0.2rem;
	color: ${palette.black};
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

const QuantityWrapper = styled(Flexed)<any>`
	// border: ${({productPurchase, soldProducts}) => (productPurchase || soldProducts ? '' : `1px solid ${palette.silver}`)};
	// border-radius: 1.2rem;
	font-size: 14px;
`

export const MobileCartBtn = styled(SwapButton)<any>`
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
	// background-color: ${({add}) => (add ? palette.Btn_dark_green : 'rgb(164 164 164)')};
	transform: ${({rotate}) => (rotate ? 'rotate(180deg)' : 'rotate(0deg)')};
	margin-top: ${({rotate}) => (rotate ? '2px' : '0px')};
	& img {
		width: 10px;
		height: 6px;
	}
`

const CountWrapper = styled(Flexed)<any>`
	height: 95%;
`

const CardFooter = styled(Flexed)`
	background: #f0f2f5;
	padding: 0.7rem 1rem 1rem;
`
const ActionButton = styled.div<any>`
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
	gap: 0.3rem;
	width: 7rem;
	text-transform: uppercase;
	letter-spacing: 0.02em;
	border: 1px solid ${palette.Btn_dark_green};
	background-color: ${({disabled}) => (disabled ? palette.white : palette.white)};
	cursor: ${({disabled}) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		background-color: ${({disabled}) => (disabled ? palette.white : palette.Btn_dark_green)};
	}
`
const PlusIcons = styled.span`
	font-size: 16px;
`
export default StyledCard
