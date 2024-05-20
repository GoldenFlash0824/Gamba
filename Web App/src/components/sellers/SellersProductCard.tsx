import React, {useState} from 'react'
import {palette} from '../../styled/colors'
import styled from 'styled-components'
import {Text, Flexed, Spacer} from '../../styled/shared'
import {BsHeart, BsFillHeartFill, BsChatText} from 'react-icons/bs'
import {AiOutlineHeart} from 'react-icons/ai'
import {AiOutlineSwap} from 'react-icons/ai'
import {AiOutlinePlus} from 'react-icons/ai'
import {media} from 'styled-bootstrap-grid'
import InputField from '../common/InputField'
import {AiOutlineMinus} from 'react-icons/ai'
import ProductDetailsModal from '../modals/ProductDetailsModal'
import {useDispatch} from 'react-redux'
import {addItemInCart} from '../../actions/cartActions'
import {BsCart3} from 'react-icons/bs'

const SellersProductCard = ({cardIndex, sale, content, addToCart, donation, trade}: any) => {
	const [like, setLike] = useState(false)
	const [showImg, setShowImg] = useState(false)
	const [quantity, setQuantity] = useState(content.quantity > 0 ? 1 : 0)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const dispatch = useDispatch()
	const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false)
	const [defaultQuantity, setDefaultQuantity] = useState(content.quantity)

	const addToCartTrigger = () => {
		// let _element: any = document.getElementById(`addCartBtn` + cardIndex)
		// _element.click()s
		content['default_quantity'] = defaultQuantity
		content.quantity = quantity
		dispatch(addItemInCart(content))
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
				<Flexed direction="row">
					<ImgWrapper direction={trade ? '' : 'row'} align={trade ? '' : 'center'} justify={trade ? '' : 'center'}>
						<div id={`addCartBtn` + cardIndex} onClick={addToCart}></div>
						{trade ? (
							<>
								<Flexed direction="row" align="center" justify="center">
									{content?.images?.length ? <Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${content.images[0]}`} alt="img" trade={trade} /> : ''}
									<AiOutlineSwap size={70} />
									{content?.images?.length ? <Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${content.images[0]}`} alt="img" trade={trade} /> : ''}
								</Flexed>
							</>
						) : // <Img src={!showImg ? content.image : content.image_hover} alt="img" />
						content?.images?.length ? (
							<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${content.images[0]}`} alt="img" trade={trade} />
						) : (
							''
						)}
						{sale && (
							<Sale direction="row" align="center" justify="center">
								<Text color="white" letterSpacing="0.1rem" type="small">
									Sale
								</Text>
							</Sale>
						)}
						{donation && (
							<Donation direction="row" align="center" justify="center">
								<Text color="white" letterSpacing="0.1rem" type="small">
									Free
								</Text>
							</Donation>
						)}
						{trade && (
							<StyledFlex direction="row" align="center" justify="space-between">
								<PiecesWrapper>
									<Text letterSpacing="0.1rem" type="small">
										(10 Pieces)
									</Text>
								</PiecesWrapper>
								<PiecesWrapper>
									<Text letterSpacing="0.1rem" type="small">
										(2 Pieces)
									</Text>
								</PiecesWrapper>
							</StyledFlex>
						)}
					</ImgWrapper>

					<CustomFlex trade={trade}>
						<ProductDetails>
							<ProductName
								type="normal"
								color="text"
								onClick={() => {
									setIsProductDetailsModalOpen(true)
								}}>
								{content.name}
							</ProductName>
							{!trade && <>{content?.chemical ? <Chemicals type="small">Chemical (4)</Chemicals> : <Chemicals type="small">No Chemical Used</Chemicals>}</>}
						</ProductDetails>
						<div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
							{sale ? (
								<Flex direction="row" align="center" gap={1}>
									<Flexed direction="row" align="center" gap={0.4}>
										<Text color="text_description">
											<del>$5.00</del>
										</Text>
										<Text type="xsmall">Unit</Text>
									</Flexed>
									<Flexed direction="row" align="center" gap={0.4}>
										<Discount color="orange">$3.00</Discount>
										<Text type="xsmall" color="text_description">
											Unit
										</Text>
									</Flexed>
								</Flex>
							) : donation ? (
								<Flexed direction="row" align="center" gap={0.4}>
									<Text color="text_description">$0.00</Text>
									<Text type="xsmall" color="text_description">
										Unit
									</Text>
								</Flexed>
							) : trade ? (
								<Flexed direction="row" align="center" gap={0.4}>
									{/* <Text ></Text> <Text type='small' >Unit</Text> */}
								</Flexed>
							) : (
								<>
									{/* <Flexed direction="row" align="center" gap={0.4}> */}
									<div>
										<Text color="text_description">
											<Price>
												<span>$5.00</span> pound
											</Price>
											&nbsp; &nbsp;<Off>-25%</Off>&nbsp;{' '}
											<Unit color="text_description">
												<span>$1.5</span> unit
											</Unit>
										</Text>

										<Flexed align="center" direction="row" gap="0.2" margin="0.5rem 0 0 0 ">
											{like ? (
												<HeartFill
													fontSize="0.95rem"
													onClick={() => {
														setLike(false)
													}}
												/>
											) : (
												<Heart
													fontSize="0.95rem"
													onClick={() => {
														setLike(true)
													}}
												/>
											)}
											<Text type="xsmall">125</Text>
										</Flexed>
									</div>

									{/* <Text >$5.00</Text>
											<Text type="xsmall" >
												pound
											</Text>
											<Text type="xsmall"  color="red">
												-25%
											</Text>
											<Text type="xsmall" >
												$1.5 unit
											</Text> */}
									{/* </Flexed> */}
								</>
							)}
						</div>

						{trade && (
							<SwapButton>
								<AiOutlineSwap />
							</SwapButton>
						)}
					</CustomFlex>
				</Flexed>
				<Spacer height={1} />

				<Text type="small" color="text_description">
					Description is the pattern of narrative development
				</Text>
				<Spacer height={1} />
				<Flexed direction="row" align="center" gap={0.5} flexWrap="wrap">
					<QuantityWrapper direction="row" align="center" gap="0">
						<div>
							<Icons
								onClick={() => {
									quantity > 1 && setQuantity(quantity - 1)
								}}>
								<AiOutlineMinus />
							</Icons>
						</div>
						<div id="quantity">
							<Input type="number" value={quantity} onChange={(e: any) => setQuantity(e.target.value)} />
						</div>
						<div>
							<Icons add onClick={() => setQuantity(quantity + 1)}>
								<AiOutlinePlus />
							</Icons>
						</div>
					</QuantityWrapper>

					<ViewCart
						onClick={() => {
							if (isUserLogIn !== null && defaultQuantity > 0 && quantity !== 0) {
								addToCartTrigger()
							}
						}}
						disabled={isUserLogIn === null}>
						<CartIcon
						// onClick={() => {
						// 	if (isUserLogIn !== null) {
						// 		addToCartTrigger()
						// 	}
						// }}
						>
							{/* &#128722; */}
							<BsCart3 />
						</CartIcon>
					</ViewCart>

					{/* <BuyNow>
						<Text type="small" color="white">
							Buy Now
						</Text>
					</BuyNow> */}
				</Flexed>
			</CardWrapper>
			{isProductDetailsModalOpen && (
				<ProductDetailsModal
					content={content}
					sale={sale}
					addToCart={addToCart}
					// productPurchase={productPurchase}
					// soldProducts={soldProducts}
					donation={donation}
					onClose={() => {
						setIsProductDetailsModalOpen(false)
					}}
				/>
			)}
		</>
	)
}

const Img = styled.img<any>`
	height: 5rem;
	width: 8rem;
	border-radius: 0.3rem;
	// height: 13.555rem;
	// width: ${({trade}) => (trade ? '46%' : '100%')};
	object-fit: ${({trade}) => (trade ? 'contain' : '')};
`
const PiecesWrapper = styled.div<any>`
	width: 46%;
	display: flex;
	align-items: center;
	justify-content: center;
`
const ImgWrapper = styled(Flexed)`
	position: relative;
	height: 5rem;
	width: 8rem;
	background: #ebebeb;
	border-radius: 0.3rem;
`
const CustomFlex = styled(Flexed)<any>`
	margin-left: 1rem;

	// align-items: center;
	// justify-content: space-between;
	/* padding-top: 0.625rem; */
	${media.xs`flex-direction: column;`}
`
const ProductDetails = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 0.5rem;
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
const Sale = styled(Flexed)<any>`
	position: absolute;
	left: 0;
	top: 0;
	width: 2.625rem;
	height: 2.625rem;
	border-radius: 100%;
	background-color: ${palette.gBtn_dark_greenreen};
`
const Donation = styled(Sale)`
	width: 2.625rem;
	height: 2.625rem;
`
const CartIcon = styled.span`
	font-size: 1rem;
	color: ${palette.white};
	/* @media screen and (min-width: 0px) and (max-width: 405px) {
		font-size: 1rem;
	} */
`

const Discount = styled(Text)<any>`
	cursor: pointer;
`

const Flex = styled(Flexed)`
	flex-wrap: wrap;
`
const StyledFlex = styled(Flexed)`
	padding-bottom: 1rem;
`

const Chemicals = styled(Text)`
	cursor: pointer;
`

const Input = styled.input`
	border: none;
	font-family: 'Roboto';
	line-height: 1.3rem;
	outline: none;
	font-weight: 400;
	font-size: 0.875rem;
	padding: 0.2rem 0.5rem;
	border-radius: 0.2rem;
	color: ${palette.black};
	background: ${palette.white};
	width: 2.5rem;
	&:focus {
		border: none;
	}
	&::placeholder {
		color: ${palette.black};
		opacity: 0.5; /* Firefox */
	}
`

const BuyNow = styled.div`
	padding: 0.2rem 0.7rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${palette.orange};
	border-radius: 0.5rem;
	height: 2rem;
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
const CardWrapper = styled.div<any>`
	display: flex;
	flex-direction: column;
	/* justify-content: space-between; */
	padding: 1.25rem;
	min-height: 15.375rem;
	background: ${palette.fbBg};

	border: 0.063rem solid transparent;
	box-shadow: ${palette.posts_shadow_1} 0px 0px 0px;

	margin-bottom: 1rem;
	border-radius: 1.25rem;
	&:hover {
		border: 0.063rem solid ${palette.border_green};
	}
	/* &:hover ${ViewCart} {
		display: ${({trade}) => (trade ? 'none' : 'flex')};
		${media.xs`display:none`};
	} */
	&:hover ${Img} {
	}
	&:hover ${Discount} {
		font-size: 1.5rem;
	}
	&:hover ${Sale} {
		background-color: ${palette.orange};
		transition: 0.5s ease-in-out;
		animation: loader 2s 1;
		@keyframes loader {
			0% {
				rotate: 0deg;
			}
			25% {
				rotate: y 90deg;
				scale: 0.5;
			}
			/* 50% {
                rotate: 180deg;
            }
            75% {
                rotate: x 270deg;
                border-radius: 50%;
            }
            100% {
                rotate: 360deg;
            } */
		}
		@supports not (rotate: 0deg) {
			@keyframes loader {
				0% {
					transform: rotate(0deg);
				}
				25% {
					transform: scale(0.5) rotateY(90deg);
				}
				50% {
					transfrom: rotate(180deg);
				}
				75% {
					transform: rotateX(270deg);
					border-radius: 50%;
				}
				100% {
					transform: rotate(360deg);
				}
			}
		}
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

const QuantityWrapper = styled(Flexed)`
	border: 1px solid ${palette.silver};
	border-radius: 1.2rem;
	background: ${palette.white};
`

export const MobileCartBtn = styled(SwapButton)<any>`
	${media.xs`display:flex`}
	${media.sm`display:none`};
`

const Off = styled.span`
	color: ${palette.red};
	margin-top: 0.5rem;
	display: inline-block;
`
const Price = styled.span`
	margin-top: 0.5rem;
	display: inline-block;
	& > span {
		/* font-weight: 700; */
	}
`
const Unit = styled.span`
	margin-top: 0.5rem;
	display: inline-block;
	& > span {
		/* font-weight: 500; */
	}
`

const Heart = styled(BsHeart)<any>`
	color: ${palette.text};
	cursor: pointer;
`

const HeartFill = styled(BsFillHeartFill)<any>`
	color: ${palette.Btn_dark_green};
	cursor: pointer;
`
const Icons = styled.div<any>`
	width: 1.7rem;
	height: 1.7rem;
	border-radius: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.8rem;
	cursor: pointer;
	color: ${palette.white};
	background-color: ${({add}) => (add ? palette.Btn_dark_green : 'rgb(164 164 164)')};
`
export default SellersProductCard
