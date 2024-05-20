import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {media} from 'styled-bootstrap-grid'
import {palette} from '../styled/colors'
import {Flexed, Heading, Text} from '../styled/shared'
import {useSelector, useDispatch} from 'react-redux'
import {BsXLg} from 'react-icons/bs'
import {FaPlus, FaMinus} from 'react-icons/fa'
import CartItemDeleteModal from '../components/modals/CartItemDeleteModal'
import {incrementItem, decrementItem} from '../actions/cartActions'
import {AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai'
import {saveSearchText} from '../actions/authActions'
import TextWithSeeMore from './common/SeeMoreText'

const CartItemList = ({content}: any) => {
	const _isDarkTheme = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const [openDeleteModal, setOpenDeleteModal] = useState(false)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(saveSearchText(''))
	}, [])

	return (
		<>
			<Wrapper isDarkTheme={_isDarkTheme}>
				<Cover>
					<Image src={`https://imagescontent.s3.us-east-1.amazonaws.com/${content.images[0]}`} />
				</Cover>
				<Box>
					<Text type="normal" color="black" fontWeight={700}>
						{content.name}
						<Text type="small" color="gray" fontWeight={500}>
							By {content?.user?.first_name + ' ' + content?.user?.last_name}
						</Text>
						<Text type="small" color="gray" fontWeight={500}>
							{/* {content?.caption} */}
							<TextWithSeeMore text={content?.caption} maxLength={180} />
						</Text>
					</Text>

					<Content>
						<QuantityWrapper direction="row" align="center" gap="0.3" justify="center">
							<div id="quantity">
								<Input>{content.quantity}</Input>
							</div>
							<CountWrapper justify="space-around">
								<div>
									<Icons
										onClick={() => {
											if (content.quantity > 1) {
												// setQuantity(quantity - 1)
												content.quantity--
												dispatch(decrementItem(content))
											}
										}}>
										<img src="/images/icons/arrow_up.svg" alt="arrow_qty" />
									</Icons>
								</div>

								<div>
									<Icons
										rotate={true}
										add
										onClick={() => {
											// if (content?.quantity > 0 ) {
											content.quantity++
											dispatch(incrementItem(content))
											// }
										}}>
										<img src="/images/icons/arrow_up.svg" alt="arrow_qty" />
									</Icons>
								</div>
							</CountWrapper>
						</QuantityWrapper>
						<Text color="black" type="normal" fontWeight={700}>
							$ {content.discountPrice?.toFixed(2) || content.price.toFixed(2)}
						</Text>
						{/* <Div /> */}
						<DeleteItems
							onClick={() => {
								setOpenDeleteModal(true)
							}}>
							<img src="/images/icons/cart_cross.svg" alt="cart_cross" />
						</DeleteItems>
					</Content>
				</Box>
			</Wrapper>
			{openDeleteModal && (
				<CartItemDeleteModal
					id={content.id}
					onClose={() => {
						setOpenDeleteModal(false)
					}}
				/>
			)}
		</>
	)
}

const Div = styled.div`
	/* width: 1rem; */
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
`

const Input = styled.div`
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

const QuantityWrapper = styled(Flexed)<any>`
	border: 1px solid ${palette.stroke};
	border-radius: 1.39rem;
	min-width: 5rem;
	height: 40px;
	padding: 0.2rem;
`
const Wrapper = styled.div<any>`
	display: flex;
	gap: 1rem;
	&:not(:last-child) {
		margin: 0 0 0.75rem 0;
	}
	width: 100%;
	background: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	overflow: hidden;
	padding: 1rem;

	border-radius: 0.5rem;
	transition: all ease 0.25s;
	position: relative;
	border: 1px solid ${palette.stroke};
`

const Box = styled(Flexed)`
	width: 100%;
	justify-content: space-between;
	${media.md`flex-direction: row;`}
`

const Cover = styled.div``

const Image = styled.img`
	width: 6.25rem;
	height: 6.25rem;
	object-fit: cover;
	border-radius: 1rem;
`

const Content = styled(Flexed)`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	row-gap: 0.5rem;
	${media.md`min-width: 14rem;`}
`

const DeleteItems = styled.div`
	width: 1rem;
	height: 1rem;
	border-radius: 2rem;
	position: absolute;
	right: 0.5rem;
	top: 0.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`

const IconCover = styled.div<any>`
	cursor: pointer;
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 0.2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid ${palette.silver};
	font-size: 0.7rem;
`

const Minus = styled(FaMinus)<any>`
	color: ${palette.text};
`

const Add = styled(FaPlus)<any>`
	color: ${palette.text};
`

const CountWrapper = styled(Flexed)<any>`
	height: 95%;
`

export default CartItemList
