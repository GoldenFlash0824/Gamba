import React, { useState } from 'react'
import { palette } from '../styled/colors'
import styled from 'styled-components'
import { Text, Flexed, Spacer } from '../styled/shared'
import { media } from 'styled-bootstrap-grid'
import moment from 'moment-timezone'
import TradeDetailsCardsCarousel from './TradeDetailsCardsCarousel'
import UsedChemicalsModal from './modals/UsedChemicalsModal'
import TextWithSeeMore from './common/SeeMoreText'

const TradeDetailsCard = ({ cardIndex, sale, content, addToCart, donation, isTrade, productPurchase, soldProducts }: any) => {
	const [isUsedChemicalsOpen, setIsUsedChemicalsOpen] = useState(false)

	const [showImg, setShowImg] = useState(false)

	return (
		<>
			<CardWrapper
				onMouseEnter={() => {
					setShowImg(true)
				}}
				onMouseLeave={() => {
					setShowImg(false)
				}}>
				<CardBody direction="row">
					<CustomFlex>
						{isTrade && (
							<CustomFlexed direction="row" justify="space-between">
								<InfoWrapper>
									<ProductCategory color="text_description" onClick={() => { }}>
										<strong>Name: </strong>
										{content?.name}
									</ProductCategory>
									<Spacer height={0.1} />
									<Text color="text_description">
										<strong>Product is for: </strong> Trade
									</Text>

									<Spacer height={0.1} />

									{content?.trade[0]?.title?.map((data: any, index: any) => {
										return (
											<>
												<Text color="text_description">
													<strong>Trade With: </strong> {data?.trade_quantity} {data?.trade_unit} {data?.trade_title}
												</Text>
											</>
										)
									})}

									<Spacer height={0.1} />
									<Text color="text_description">
										<strong>Category: </strong> {content?.category?.title}
									</Text>
									<Spacer height={0.1} />
									<Spacer height={0.1} />
									<Text color="text_description">
										<strong>Sold By: </strong>
										{content?.unit ? `${content?.unit}` : ' Kilo'}
									</Text>
									<Spacer height={0.1} />
									<Text color="text_description">
										<strong>Delivery Type: </strong> {content?.is_pickUp ? 'PickUp' : content?.is_pickUp && content?.is_delivery ? 'PickUp , Delivery' : content?.is_delivery ? 'Delivery' : 'None'}
									</Text>
									{content?.is_delivery && (
										<>
											<Spacer height={0.1} />
											<Text color="text_description">
												<strong>Delivery Distance: </strong> {content?.distance}
											</Text>
										</>
									)}
								</InfoWrapper>

								<CustomInfoWrapper>
									{/* <Text color="text_description">
										<strong>Allow To Order: </strong> {content?.allow_to_0rder_advance} {content?.allow_to_0rder}
									</Text> */}
									{/* <Spacer height={0.1} />
									<Text color="text_description">
										<strong>Allow To Order In Advance: </strong> {content?.allow_to_0rder_advance}
									</Text> */}

									<Spacer height={0.1} />
									<Text color="text_description">
										<strong>Availibility From: </strong>
										{content?.available_from ? moment(content?.available_from).format('MM/DD/YY') : ''}
									</Text>
									<Spacer height={0.1} />
									<Text color="text_description">
										<strong>Ends On: </strong> {content?.available_from ? moment(content?.available_to).format('MM/DD/YY') : ''}
									</Text>
									{/* <Spacer height={0.1} />

									<Text color="text_description">
										<strong>Discount: </strong> {content?.discount}%
									</Text>
									<Spacer height={0.1} />
									<Text color="text_description" textTransform="capitalize">
										<strong>None: </strong> {content?.none ? 'true' : 'false'}
									</Text> */}
									<Spacer height={0.1} />
									{!content?.is_organic ? (
										<Chemicals>
											<strong>Chemicals: </strong>

											{content?.chemical_data?.length > 0 ? (
												<span
													onClick={() => {
														setIsUsedChemicalsOpen(true)
													}}>
													{content?.chemical_data?.length} Chemicals
												</span>
											) : (
												<>N/A</>
											)}
										</Chemicals>
									) : (
										<Chemicals fontSize={0.813} type="small">
											<strong>Chemicals: </strong> No Chemical Used
										</Chemicals>
									)}
									<Text color="text_description">
										<strong>Caption: </strong>
										<TextWithSeeMore text={content?.caption} maxLength={180} />
									</Text>
								</CustomInfoWrapper>
							</CustomFlexed>
						)}
						<Spacer height={1} />
					</CustomFlex>
				</CardBody>
				{content?.images?.length > 0 && <TradeDetailsCardsCarousel cardIndex={cardIndex} addToCart={addToCart} image={content?.images} data={content} />}
			</CardWrapper>
			{isUsedChemicalsOpen && <UsedChemicalsModal data={content?.chemical_data} onClose={() => setIsUsedChemicalsOpen(false)} />}
		</>
	)
}
const InfoWrapper = styled.div`
	width: 42%;
	${media.xs`width:100%`}
	${media.sm`width:100%`}
	${media.md`width:42%`}
`
const CustomInfoWrapper = styled.div`
	width: 55%;
	${media.xs`width:100%`}
	${media.sm`width:100%`}
	${media.md`width:55%`}
`
const CustomFlexed = styled(Flexed)`
	width: 100%;
	${media.xs`flex-direction: column;`}
`

const CustomFlex = styled(Flexed) <any>`
	width: 100%;

	${media.xs`flex-direction: column;`}
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
	width: 2rem;
	height: 2rem;
	border-radius: 100%;
	background-color: ${palette.Btn_dark_green};
`

const Discount = styled(Text) <any>`
	cursor: pointer;
`

const CardBody = styled(Flexed)`
	padding: 1rem 1rem 0.5rem 1rem;
	display: flex;

	height: 14rem;
	overflow-y: auto;

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

	// justify-content: space-between;
`
const CardWrapper = styled.div<any>`
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 11rem;
	background-color: ${palette.white};
	box-shadow: ${palette.posts_shadow_1} 0px 8px 24px;
	border: 0.063rem solid #f0f2f5;
	margin-bottom: 1rem;
	border-radius: 1.25rem;
	&:hover {
		border: 0.063rem solid ${palette.Btn_dark_green};
	}

	// &:hover ${Discount} {
	// 	font-size: 1rem;
	// }
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
const Chemicals = styled(Text)`
	cursor: pointer;
	color: ${palette.text_description};
	& > span {
		color: ${palette.blue};
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
	font-weight: 600;
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

export const MobileCartBtn = styled(SwapButton) <any>`
	${media.xs`display:flex`}
	${media.sm`display:none`};
`

export default TradeDetailsCard
