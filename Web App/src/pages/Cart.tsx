import React, { useState } from 'react'
import styled from 'styled-components'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import { Divider, Flexed, Heading, Spacer, Text, MiddleLayout } from '../styled/shared'
import { useSelector } from 'react-redux'
import { palette } from '../styled/colors'
import { useNavigate, useLocation } from 'react-router-dom'
import CartItemList from '../components/CartItemList'
import { GiShoppingCart } from 'react-icons/gi'
import ReorderConfirmationModal from '../components/modals/ReorderConfirmationModal'

const Cart = () => {
	const _isDarkTheme = useSelector<any>((state: any) => state.auth.isDarkTheme)
	let _navigate = useNavigate()
	const data = useLocation()
	const cart: any = useSelector<any>((state: any) => state.cart)
	const total: number = cart?.products?.reduce((result, item) => {
		return result + item.quantity * (item.discountPrice || item.price)
	}, 0)


	const [openReorderConfirmation, setOpenReOrderConfirmation] = useState(false)

	return (
		<Main fluid>
			<Spacer height={1.25} />
			<Row justifyContent="center">
				<MiddleLayout xxl={7} xl={6} lg={10}>
					<Flexed direction="row" align="center" gap="0.5">
						<Text
							pointer
							type="normal"
							fontWeight={500}
							color="gray"
							onClick={() => {
								_navigate('/products')
								// setSinglePost(null)
								// setSelectProfileSettingsCategory('')
								// setSelectCategory('profile')
							}}>
							Products
						</Text>
						<img src="/images/icons/arrow.svg" alt="arrow" />
						<Text type="normal" color="black_100" fontWeight={500}>
							Cart
						</Text>
					</Flexed>
					<Spacer height={1.25} />
				</MiddleLayout>
			</Row>
			<Row justifyContent="center">
				<MiddleLayout xxl={7} xl={6} lg={10}>
					<CartSection isDarkTheme={_isDarkTheme}>
						<CartWrapper isDarkTheme={_isDarkTheme}>
							{cart?.products?.length === 0 && (
								<CartEmpty visible={true}>
									<CartIcon visible={true} isDarkTheme={_isDarkTheme} id="shopping-cart" data-product-count="0" src="/icons/cartLogo.png" alt="cartLogo" />

									<Text type="normal" isDarkTheme={_isDarkTheme} color="text" margin="1rem 0rem 0rem 0rem">
										{!cart?.products?.length && 'Your basket is empty'}
									</Text>
								</CartEmpty>
							)}
							{cart?.products?.length !== 0 && (
								<List>
									<div>
										{cart?.products?.map((d: any, index: any) => (
											<CartItemList index={index} content={d} />
										))}
									</div>
								</List>
							)}
						</CartWrapper>

						{cart?.products?.length !== 0 && (
							<BillingContent isDarkTheme={_isDarkTheme}>
								<Divider id="ss" margin="1.25rem 0rem" color="stroke" />
								<Flexed direction="row" justify="space-between">
									<Text type="normal" color="gray" fontWeight={700}>
										Subtotal:
									</Text>
									<Text type="normal" color="gray" fontWeight={700}>
										$ {total.toFixed(2)}
									</Text>
								</Flexed>
								<Spacer height={0.625} />
								<Flexed direction="row" justify="space-between">
									<Text type="normal" color="gray" fontWeight={700}>
										Delivery Charges:
									</Text>
									<Text type="normal" color="gray" fontWeight={700}>
										$ 0
									</Text>
								</Flexed>
								<Spacer height={0.625} />
								<Flexed direction="row" justify="space-between">
									<Text type="normal" color="gray" fontWeight={700}>
										Discount:
									</Text>
									<Text type="normal" color="gray" fontWeight={700}>
										$ 0
									</Text>
								</Flexed>

								<Divider margin="1.25rem 0rem" color="stroke" />

								<Flexed direction="row" justify="space-between">
									<Heading fontSize={1.5} isDarkTheme={_isDarkTheme} fontWeight={700} color="black">
										Total
									</Heading>
									<Heading fontSize={1.5} isDarkTheme={_isDarkTheme} fontWeight={700} color="green_200">
										$ {total.toFixed(2)}
									</Heading>
								</Flexed>
								<Spacer height={1} />
								<Button
									onClick={() => {
										if (data.state?.isReorder) {
											setOpenReOrderConfirmation(true)
										}
										else {
											_navigate('/place-order')
										}

									}}>
									Checkout
								</Button>
							</BillingContent>
						)}
					</CartSection>
				</MiddleLayout>
				{openReorderConfirmation && (
					<ReorderConfirmationModal
						onClose={() => {
							setOpenReOrderConfirmation(false)
						}}
					/>
				)}
			</Row>
			<Spacer height={6} />
		</Main>
	)
}

const Main = styled(Container)`
	padding-right: 0;
	padding-left: 0;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
`

const List = styled.div`
	// max-height: 60rem;
	// padding: 1rem 0.5rem;
	
	// background: ${palette.silver};
	border-radius: 0.39rem;
`

const CartSection = styled.div<any>`
	overflow: hidden;
	position: -webkit-sticky; /* Safari */
	position: -webkit-sticky;
	position: sticky;
	top: 10rem;
	// border: 1px solid ${palette.stroke};
	border-radius: 0.39rem;
`

const CartWrapper = styled.div<any>``

const CartEmpty = styled.div<any>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-bottom: ${({ visible }) => (visible ? `1rem` : `0rem`)};
`

const CartIcon = styled.img<any>`
	font-size: ${({ visible }) => (visible ? `3.5rem` : `0.5rem`)};
	height: 5rem;
	opacity: 0.3;
	color: ${({ isDarkTheme }) => (isDarkTheme ? palette.silver : palette.gray)};
	visibility: ${({ visible }) => (visible ? `visible` : `hidden`)};
`

const BillingContent = styled.div<any>`
	background: ${({ isDarkTheme }) => (isDarkTheme ? palette.black : palette.white)};
	// padding: 1rem 1rem;
	border-radius: 0.39rem;
	padding: 1rem;
	margin-top : 1rem;
`

const Button = styled.div`
	opacity: 1;
	text-transform: capitalize;
	border-radius: 2rem;
	padding: 0.65rem 2rem;
	font-size: 1rem;
	height: 3.125rem;
	color: ${palette.green_200};
	background: ${palette.white};
	font-weight: 700;
	cursor: pointer;
	min-width: 6rem;
	width: 100%;
	line-height: 32px;
	white-space: nowrap;
	-webkit-box-align: center;
	align-items: center;
	position: relative;
	display: flex;
	-webkit-box-pack: center;
	justify-content: center;
	transition: all 0.25s ease 0s;
	font-family: Lato-Bold, sans-serif;
	border: 1.5px solid ${palette.green_200};
	&:hover {
		color: ${palette.white};
		background: ${palette.green_200};
	}
`

export default Cart
