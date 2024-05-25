import React, { useState, useEffect } from 'react'
import { palette } from '../styled/colors'
import styled from 'styled-components'
import { Text, Flexed, getDistanceFromLatLonInMiles } from '../styled/shared'
import { media } from 'styled-bootstrap-grid'
import moment from 'moment'
import ProductDetailsCardCarousel from './ProductDetailsCardCarousel'
import { useSelector } from 'react-redux'
import UsedChemicalsModal from './modals/UsedChemicalsModal'
import TradeDetailsCardsCarousel from './TradeDetailsCardsCarousel'
import TextWithSeeMore from './common/SeeMoreText'
import Lightbox from 'react-image-lightbox'

const ProductDetailsCard = ({ cardIndex, sale, content, addToCart, donation, isTrade, productPurchase, soldProducts }: any) => {
	const userId = useSelector<any>((state: any) => state.auth.userId)
	const [isUsedChemicalsOpen, setIsUsedChemicalsOpen] = useState(false)
	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [showImg, setShowImg] = useState(false)
	const [quantity, setQuantity] = useState(content?.quantity > 0 ? 1 : 0)
	const [defaultQuantity, setDefaultQuantity] = useState(content?.quantity)
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')
	const [distanceInMiles, setDistanceInMiles]: any = useState('')
	const [lightBoxOpen, setLightBoxOpen] = useState(false)
	const [photoIndex, setPhotoIndex] = useState(0)

	useEffect(() => {
		doGetDistanceFromLatLonInMiles()
	}, [])

	const doGetDistanceFromLatLonInMiles = async () => {
		if (content?.user?.lat && content?.user?.log && _userLocation.lat && _userLocation.log) {
			const res = await getDistanceFromLatLonInMiles(content?.user?.lat, content?.user?.log, _userLocation.lat, _userLocation.log)
			setDistanceInMiles(res)
		}
	}

	return (
		<>
			<CardWrapper
				onMouseEnter={() => {
					setShowImg(true)
				}}
				onMouseLeave={() => {
					setShowImg(false)
				}}>
				<CustomFlex>
					<div>
						<ImageWrapper gap={1.25}>
							<ImageCover>
								{isTrade ? (
									<>{content?.images?.length > 0 && <TradeDetailsCardsCarousel cardIndex={cardIndex} addToCart={addToCart} image={content.images} data={content} />}</>
								) : (
									<>{content?.images?.length > 0 && <ProductDetailsCardCarousel cardIndex={cardIndex} addToCart={addToCart} data={content.images} />}</>
								)}
							</ImageCover>
							<ImgaesContent direction="row" justify="space-between" gap={1.25}>
								<div>
									<Text color="black" margin="0rem 0rem 0.406rem 0rem" type="normal" fontWeight={700}>
										{content?.name} by {content?.user?.first_name} {content?.user?.last_name}
									</Text>
									<Text color="gray" type="xsmall" fontWeight={500}>
										<TextWithSeeMore text={content?.caption} maxLength={280} />
									</Text>
								</div>
							</ImgaesContent>
						</ImageWrapper>
					</div>
					{sale ? (
						<CustomFlexed>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Name
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.name} / {content?.unit}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Product is For
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									Sale
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Chemicals
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{!content?.is_organic ? (
										<>
											{' '}
											{content?.chemical_data?.length > 0 ? (
												<span
													onClick={() => {
														setIsUsedChemicalsOpen(true)
													}}>
													{content?.chemical_data?.length} Chemicals
												</span>
											) : (
												'N / A'
											)}
										</>
									) : (
										'N/A'
									)}
								</Text>
							</Box>

							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Regular Price
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									${content?.price?.toFixed(2)}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Availability From
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.available_from ? moment(content?.available_from).format('MM/DD/YY') : ''}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Ends On
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.isUnlimitted ? 'TBA' : content?.available_from ? moment(content?.available_to).format('MM/DD/YY') : ''}
								</Text>
							</Box>

							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Category
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.category?.title}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Delivery Type
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.is_pickUp ? 'PickUp' : content?.is_pickUp && content?.is_delivery ? 'PickUp , Delivery' : content?.is_delivery ? 'Delivery' : 'None'}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Seller Distance
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									N / A
									{/* {content?.user?.lat && content?.user?.log && _userLocation.lat && _userLocation.log && <>{distanceInMiles ? `${distanceInMiles}` : '0 milles.'}</>} */}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Allow To Order
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.allow_to_0rder_advance !== null && (
										<>
											{' '}
											{content?.allow_to_0rder_advance} {content?.allow_to_0rder}
										</>
									)}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Sale Price
								</Text>
								<Flexed direction="row" align="end" justify="space-between">
									<Text margin="0rem 0rem 0.5rem 0rem" color="black_100" type="normal" fontWeight={700}>
										${(content?.price - (content?.discount / 100) * content?.price)?.toFixed(2)}
									</Text>

									{userId !== content?.u_id && (
										<>
											<QuantityWrapper direction="row" justify="center" align="center" gap="0.3">
												<div id="quantity">
													<Input type="number" disabled={content?.quantity > 0 && content?.quantity >= quantity ? false : true} value={quantity} onChange={(e: any) => setQuantity(e.target.value)} />
												</div>
												<CountWrapper justify="space-around">
													{productPurchase || soldProducts ? null : (
														<div>
															<Icons
																onClick={() => {
																	quantity > 1 && setQuantity(quantity - 1)
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
																	if (content?.quantity > 0 && content?.quantity >= quantity) {
																		setQuantity(quantity + 1)
																	}
																}}>
																<img src="/images/icons/arrow_down.svg" alt="arrow_qty" />
															</Icons>
														</div>
													)}
												</CountWrapper>
											</QuantityWrapper>
										</>
									)}
								</Flexed>
							</Box>
							{userId !== content?.u_id && (
								<Box>
									<Flexed direction="row" align="end" justify="space-between" style={{ height: '100%' }}>
										<ActionButton
											onClick={() => {
												if (isUserLogIn !== null && defaultQuantity > 0 && quantity !== 0) {
													addToCart()
												}
											}}>
											<PlusIcons>+</PlusIcons> Cart
										</ActionButton>
									</Flexed>
								</Box>
							)}
						</CustomFlexed>
					) : donation ? (
						<CustomFlexed>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Name
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.name} / {content?.unit}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Product is For
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									Giveaway
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Chemicals
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{!content?.is_organic ? (
										<>
											{content?.chemical_data?.length > 0 ? (
												<span
													onClick={() => {
														setIsUsedChemicalsOpen(true)
													}}>
													{content?.chemical_data?.length} Chemicals
												</span>
											) : (
												'N / A'
											)}
										</>
									) : (
										'N/A'
									)}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Cost:
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									$0.00
								</Text>
							</Box>

							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Availability From
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.available_from ? moment(content?.available_from).format('MM/DD/YY') : ''}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Ends On
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.isUnlimitted ? 'TBA' : content?.available_from ? moment(content?.available_to).format('MM/DD/YY') : ''}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Category
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.category?.title}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Delivery Type
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.is_pickUp ? 'PickUp' : content?.is_pickUp && content?.is_delivery ? 'PickUp , Delivery' : content?.is_delivery ? 'Delivery' : 'None'}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Delivery Distance
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.distance}
									{/* {content?.user?.lat && content?.user?.log && _userLocation.lat && _userLocation.log && <>{distanceInMiles ? `${distanceInMiles.toFixed(2)} milles.` : '0 milles.'}</>} */}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Allow Per Persons
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.allow_per_person}&nbsp;{content?.unit}
								</Text>
							</Box>
							<Box></Box>
							<Box></Box>
						</CustomFlexed>
					) : isTrade ? (
						<CustomFlexed>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Name
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.name} / {content?.unit}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Product is For
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									Trade
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Chemicals
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{!content?.is_organic ? (
										<>
											{content?.chemical_data?.length > 0 ? (
												<span
													onClick={() => {
														setIsUsedChemicalsOpen(true)
													}}>
													{content?.chemical_data?.length} Chemicals
												</span>
											) : (
												'N / A'
											)}
										</>
									) : (
										'N/A'
									)}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Trade With
								</Text>
								{content?.trade[0]?.title && (() => {
									const tradeArray = JSON.parse(content.trade[0].title);
									return tradeArray.map((data: any, index: number) => (
										<>
											{data?.trade_quantity} {data?.trade_unit} {data?.trade_title}
											{index < tradeArray.length - 1 ? <span>,&nbsp;</span> : ''}
										</>
									));
								})()}
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Availability From
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.available_from ? moment(content?.available_from).format('MM/DD/YY') : ''}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Ends On
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.isUnlimitted ? 'TBA' : content?.available_from ? moment(content?.available_to).format('MM/DD/YY') : ''}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Category
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.category?.title}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Delivery Type
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.is_pickUp ? 'PickUp' : content?.is_pickUp && content?.is_delivery ? 'PickUp , Delivery' : content?.is_delivery ? 'Delivery' : 'None'}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Delivery Distance
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.is_delivery && <>{content?.distance}</>}
									{/* {content?.user?.lat && content?.user?.log && _userLocation.lat && _userLocation.log && <>{distanceInMiles ? `${distanceInMiles.toFixed(2)} milles.` : '0 milles.'}</>} */}
								</Text>
							</Box>
						</CustomFlexed>
					) : (
						<CustomFlexed>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Name
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.name} '/' {content?.unit}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Product is For
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									Sale
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Chemicals
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{!content?.is_organic ? (
										<>
											{content?.chemical_data?.length > 0 ? (
												<span
													onClick={() => {
														setIsUsedChemicalsOpen(true)
													}}>
													{content?.chemical_data?.length} Chemicals
												</span>
											) : (
												'N / A'
											)}
										</>
									) : (
										'N/A'
									)}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Cost
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									${content?.price}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Availability From
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.available_from ? moment(content?.available_from).format('MM/DD/YY') : ''}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Ends On
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.isUnlimitted ? 'TBA' : content?.available_from ? moment(content?.available_to).format('MM/DD/YY') : ''}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Category
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.category?.title}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Delivery Type
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.is_pickUp ? 'PickUp' : content?.is_pickUp && content?.is_delivery ? 'PickUp , Delivery' : content?.is_delivery ? 'Delivery' : 'None'}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Delivery Distance
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.is_delivery && <>{content?.distance} miles</>}
									{/* {content?.user?.lat && content?.user?.log && _userLocation.lat && _userLocation.log && <>{distanceInMiles ? `${distanceInMiles.toFixed(2)} milles.` : '0 milles.'}</>} */}
								</Text>
							</Box>
							<Box>
								<Text color="gray_500" type="normal" fontSize={0.875} fontWeight={600}>
									Allow To Order
								</Text>
								<Text color="black_100" type="normal" fontWeight={500}>
									{content?.allow_to_0rder_advance} {content?.allow_to_0rder} in advance
								</Text>
							</Box>

							<Box>
								<Flexed direction="row" align="end" style={{ height: '100%' }} justify="space-between">
									<Text margin="0rem 0rem 0.5rem 0rem" color="black_100" type="large" fontWeight={700}>
										${(content?.price - (content?.discount / 100) * content?.price)?.toFixed(2)}
									</Text>

									{userId !== content?.u_id && (
										<>
											<QuantityWrapper direction="row" justify="center" align="center" gap="0.3">
												<div id="quantity">
													<Input type="number" disabled={content?.quantity > 0 && content?.quantity >= quantity ? false : true} value={quantity} onChange={(e: any) => setQuantity(e.target.value)} />
												</div>
												<CountWrapper justify="space-around">
													{productPurchase || soldProducts ? null : (
														<div>
															<Icons
																onClick={() => {
																	quantity > 1 && setQuantity(quantity - 1)
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
																	if (content?.quantity > 0 && content?.quantity >= quantity) {
																		setQuantity(quantity + 1)
																	}
																}}>
																<img src="/images/icons/arrow_down.svg" alt="arrow_qty" />
															</Icons>
														</div>
													)}
												</CountWrapper>
											</QuantityWrapper>
										</>
									)}
								</Flexed>
							</Box>
							{userId !== content?.u_id && (
								<Box>
									<ActionButton
										onClick={() => {
											if (isUserLogIn !== null && defaultQuantity > 0 && quantity !== 0) {
												addToCart()
											}
										}}>
										<PlusIcons>+</PlusIcons> Cart
									</ActionButton>
								</Box>
							)}
						</CustomFlexed>
					)}
				</CustomFlex>
			</CardWrapper>

			{isUsedChemicalsOpen && <UsedChemicalsModal data={content?.chemical_data} onClose={() => setIsUsedChemicalsOpen(false)} />}

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

const CustomFlexed = styled(Flexed)`
	display: grid;
	grid-template-columns: 1fr 1fr;
	${media.md`grid-template-columns: 1fr 1fr 1fr;`}
`

const CustomFlex = styled(Flexed) <any>`
	width: 100%;
	${media.xs`flex-direction: column;`}
`

const PlusIcons = styled.span`
	font-size: 16px;
`
const CardWrapper = styled.div<any>`
	position: relative;
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

const CountWrapper = styled(Flexed) <any>`
	height: 95%;
`

export const MobileCartBtn = styled(SwapButton) <any>`
	${media.xs`display:flex`}
	${media.sm`display:none`};
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

const ActionButton = styled.div<any>`
	height: 40px;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 1.25rem;
	color: ${palette.white};
	font-weight: 700;
	font-size: 0.875rem;
	text-align: left;
	opacity: 1;
	gap: 0.3rem;
	width: 100%;
	letter-spacing: 0.02em;
	border: 1px solid ${palette.Btn_dark_green};
	background-color: ${palette.Btn_dark_green};
	font-family: 'Lato-Regular', sans-serif;
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
	margin-top: 14px;
	&:hover {
		background-color: ${palette.white};
		color: ${palette.Btn_dark_green};
	}
`

const Box = styled.div`
	border-top: 1px solid ${palette.stroke};
	padding: 0.5rem 0.5rem 0.5rem 0rem;
`

const ImageWrapper = styled(Flexed)`
	margin-bottom: 1.25rem;
	${media.md` flex-direction: row;`}
`

const ImageCover = styled(Flexed)`
	width: 300px;
	height: 200px;
	
`

const ImgaesContent = styled(Flexed)`
	width: 100%;
`

export default ProductDetailsCard
