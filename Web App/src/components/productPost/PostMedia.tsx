import React, {useState} from 'react'
import {palette} from '../../styled/colors'
import styled from 'styled-components'
import {media} from 'styled-bootstrap-grid'
import {Text, Flexed, Spacer} from '../../styled/shared'
import {BsCartPlus} from 'react-icons/bs'
import Carosel from 'nuka-carousel'
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs'
import {MobileCartBtn} from '../ProductCard'
const ProductsMedia = ({cardIndex, sale, addToCart, data}: any) => {
	const [showImg, setShowImg] = useState(false)

	const addToCartTrigger = () => {
		// let _element: any = document.getElementById(`addCartBtn` + cardIndex)
		// _element.click()
	}
	const removeInertAttr = () => {
		let _targetNode: any = document.querySelector(`#carosel${cardIndex} div.slider-frame div.slide-current`)
		_targetNode?.removeAttribute('inert')
	}

	return (
		<Main id={'carosel' + cardIndex} onMouseEnter={removeInertAttr}>
			<Carosel
				adaptiveHeight={true}
				renderCenterLeftControls={({previousDisabled, previousSlide}) => (
					<ArrowIcon
						onClick={() => {
							previousSlide()
							setTimeout(removeInertAttr, 500)
						}}
						disabled={previousDisabled}>
						<BsChevronLeft style={{color: 'black'}} />
					</ArrowIcon>
				)}
				renderCenterRightControls={({nextDisabled, nextSlide}) => (
					<ArrowIcon
						onClick={() => {
							nextSlide()
							setTimeout(removeInertAttr, 500)
						}}
						disabled={nextDisabled}>
						<BsChevronRight style={{color: 'black'}} />
					</ArrowIcon>
				)}>
				<CardWrapper
					direction="row"
					align="center"
					justify="center"
					onMouseEnter={() => {
						setShowImg(true)
					}}
					onMouseLeave={() => {
						setShowImg(false)
					}}>
					<ImgWrapper direction="row" align="center" justify="center">
						<Img src={!showImg ? 'images/shop-1.jpeg' : 'https://nammorganic.wpengine.com/wp-content/uploads/2023/01/shop-14-1.jpg'} alt="img" />
						<ViewCart id={`addCartBtn` + cardIndex} onClick={addToCart}>
							<CustomText type="normal" color="white">
								Select Options
							</CustomText>
							<CartIcon />
						</ViewCart>
					</ImgWrapper>
					<CustomFlex>
						<ProductDetails>
							<ProductCategory type="medium" color="green">
								Root Vegetables
							</ProductCategory>
							<ProductName type="normal">Organic Broccoli</ProductName>
							{data.chemical ? <Text type="small">Chemical (4)</Text> : <Text type="small">No Chemical Used</Text>}
							{sale ? (
								<Flexed direction="row" align="center" gap={0.8}>
									<Text>
										<del>$5.00</del>
									</Text>
									<Discount color="orange">$3.00</Discount>
								</Flexed>
							) : (
								<Flexed direction="row" align="center" gap={0.4}>
									<Text>$5.00</Text> <Text type="small">Unit</Text>
								</Flexed>
							)}
							{sale && (
								<Sale direction="row" align="center" justify="center">
									<Text color="white" letterSpacing="0.1rem" type="small">
										Sale
									</Text>
								</Sale>
							)}
						</ProductDetails>
						<MobileCartBtn onClick={addToCartTrigger}>
							<MobileCartIcon fill="#ffffff" />
						</MobileCartBtn>
						<Spacer height={0.5} />
					</CustomFlex>
				</CardWrapper>
				<CardWrapper
					direction="row"
					align="center"
					justify="center"
					onMouseEnter={() => {
						setShowImg(true)
					}}
					onMouseLeave={() => {
						setShowImg(false)
					}}>
					<ImgWrapper direction="row" align="center" justify="center">
						<Img src={!showImg ? 'images/shop-1.jpeg' : 'https://nammorganic.wpengine.com/wp-content/uploads/2023/01/shop-14-1.jpg'} alt="img" />
						<ViewCart id={`addCartBtn` + cardIndex} onClick={addToCart}>
							<CustomText type="normal" color="white">
								Select Options
							</CustomText>
							<CartIcon />
						</ViewCart>
					</ImgWrapper>
					<CustomFlex>
						<ProductDetails>
							<ProductCategory type="normal" color="green">
								Root Vegetables
							</ProductCategory>
							<ProductName type="medium">Organic Broccoli</ProductName>
							{data.chemical ? <Text type="small">Chemical (4)</Text> : <Text type="small">No Chemical Used</Text>}
							{sale ? (
								<Flexed direction="row" align="center" gap={0.8}>
									<Text>
										<del>$5.00</del>
									</Text>
									<Discount color="orange">$3.00</Discount>
								</Flexed>
							) : (
								<Flexed direction="row" align="center" gap={0.4}>
									<Text>$5.00</Text> <Text type="small">Unit</Text>
								</Flexed>
							)}
							{sale && (
								<Sale direction="row" align="center" justify="center">
									<Text color="white" letterSpacing="0.1rem" type="small">
										Sale
									</Text>
								</Sale>
							)}
						</ProductDetails>
						<MobileCartBtn onClick={addToCartTrigger}>
							<MobileCartIcon fill="#ffffff" />
						</MobileCartBtn>
						<Spacer height={0.5} />
					</CustomFlex>
				</CardWrapper>
			</Carosel>
		</Main>
	)
}

const Img = styled.img`
	height: 13.555rem;
	width: 100%;
	// object-fit: contain;
`

const ImgWrapper = styled(Flexed)`
	position: relative;
`

const CustomFlex = styled(Flexed)<any>`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-top: 0.063rem solid ${palette.divider_gray};
	padding-top: 0.625rem;
	${media.xs`flex-direction: column;`}
`

const ProductDetails = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 0.5rem;
	padding: 1.25rem 0 0.625rem;
`
const ProductName = styled(Text)<any>`
	cursor: pointer;

	&:hover {
		color: ${palette.text};
		transition: color 0.3s ease 0.5s;
	}
`
const ProductCategory = styled(ProductName)<any>``

const Sale = styled(Flexed)<any>`
	position: absolute;
	right: 0;
	top: 0;
	width: 2.625rem;
	height: 2.625rem;
	border-radius: 100%;
	background-color: ${palette.Btn_dark_green};
`

const CartIcon = styled(BsCartPlus)<any>`
	display: none;
	color: ${palette.white};
`
const CustomText = styled(Text)<any>``

const Discount = styled(Text)<any>`
	cursor: pointer;
`

const ViewCart = styled.div`
	z-index: 999;
	position: absolute;
	display: none;
	align-items: center;
	justify-content: center;
	background-color: ${palette.Btn_dark_green};
	min-width: 10.443rem;
	padding: 0.875rem 1.75rem;
	height: 2.5rem;
	cursor: pointer;
	// z-index: 1;

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

const Main = styled.div`
	padding: 1.25rem;
	border: 0.063rem solid transparent;
	border-radius: 1.25rem;
	&:hover {
		border: 0.063rem solid ${palette.border_green};
	}
	&:hover ${ViewCart} {
		display: flex;
		${media.xs`display:none`};
	}
`

const CardWrapper = styled.div<any>`
	// padding: 1.25rem;
	background-color: ${palette.card_bg};
	border-radius: 1.25rem;
	&:hover ${ViewCart} {
		display: flex;
		${media.xs`display:none`};
	}

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
const ArrowIcon = styled.button`
	background-color: ${palette.silver};
	margin: 0 0.5rem;
	opacity: 0.9;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 1.8rem;
	width: 1.8rem;
	border: none;
	border-radius: 50%;
	cursor: pointer;
	&:hover {
		opacity: 0.8;
	}
`

const MobileCartIcon = styled(BsCartPlus)`
	color: ${palette.white};
`

export default ProductsMedia
