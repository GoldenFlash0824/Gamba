import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Heading, Spacer, Text } from '../styled/shared'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import { useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { paymentApi } from '../apis/apis'
import { clearCart } from '../actions/cartActions'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Payment from '../components/StripePayment'
import { editCartBeforeCheckout } from '../actions/authActions'
import { toastError } from '../styled/toastStyle'
import InfoPopup from '../components/modals/InfoPopup'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

const PlaceOrder = () => {
	const MySwal = withReactContent(Swal)
	const dispatch = useDispatch()
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const isCartEdit: any = useSelector<any>((state: any) => state.auth.isCartEdit)
	const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery')
	const [openPopup, setOpenPopup] = useState(false)
	let _navigate = useNavigate()
	const [clat, setCLat] = useState<any>('')
	const [clng, setCLng] = useState<any>('')
	const [location, setLocation] = useState('')
	const cart: any = useSelector<any>((state: any) => state.cart)
	const [sellerId, setSellerId] = useState(false)

	useEffect(() => {
		if (isCartEdit === true) {
			setPaymentMethod('debitOrCreditCard')
		}
	}, [isCartEdit])
	useEffect(() => {
		getCurrentLatLng()
	}, [])

	useEffect(() => {
		if (paymentMethod === 'debitOrCreditCard') {
			cart?.products.length &&
				cart?.products?.map((res) => {
					if (!res?.user?.stripe_account_verified) {
						setPaymentMethod('cashOnDelivery')
						setOpenPopup(true)
						setSellerId(res)
						// toastError(`Seller ${res?.user?.first_name} not accept online payments, so remove it's products from cart or do cash on delivery`)
					}
				})
		}
	}, [paymentMethod])

	const getCurrentLatLng = async () => {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				setCLat(position.coords.latitude)
				setCLng(position.coords.longitude)
				await getCurrentAddress(position.coords.latitude, position.coords.longitude)
			},
			function (error) {
				// eslint-disable-next-line eqeqeq
				if (error.code === error.PERMISSION_DENIED) {
				} else {
				}
			},
			{ timeout: 5000, enableHighAccuracy: true }
		)
	}

	//Function to get Exact Address from above taken Latitude and longitude
	const getCurrentAddress = async (lat: any, lng: any) => {
		await axios
			.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${parseFloat(lat)},${parseFloat(lng)}&sensor=true&key=${process.env.REACT_APP_MAP_API_KEY}`)
			.then((response) => {
				setLocation(response.data.results[6].formatted_address)
			})
			.catch((error) => {
				setLocation('')
			})
	}

	const total: number = cart?.products?.reduce((result, item) => {
		return result + item.quantity * item.discountPrice
	}, 0)

	const placeOrderPopup = async () => {
		if (cart?.products.length) {
			let res = await paymentApi(0, 0, total, cart?.products, paymentMethod)
			if (res.data) {
				MySwal.fire({
					customClass: {
						container: 'my-custom-swal'
					},
					showCloseButton: true,
					denyButtonText: 'Your order is placed.',
					imageUrl: '/images/ThankYouGreen.png'
				}).then(() => {
					dispatch(clearCart('0'))
					//_navigate('/order-details', {state: {data: res.data}})
					_navigate('/')
				})
			}
		}
	}

	return (
		<>
			<Main fluid>
				<Spacer height={2} />
				<Row justifyContent="center">
					<Col xxl={7} xl={6} lg={10}>
						<Wrapper>
							<Heading isDarkTheme={_isDarkTheme} color="text" isCentered margin="0rem 0rem 2rem 0rem">
								Checkout List
							</Heading>

							<BillingContent isDarkTheme={_isDarkTheme}>
								<Heading isDarkTheme={_isDarkTheme} margin="0rem 0rem 0.5rem 0rem" color="text">
									Payment Method
								</Heading>
								<Flexed justify="space-between" gap={0.5} pointer>
									<Flexed
										direction="row"
										align="center"
										gap={0.5}
										onClick={() => {
											setPaymentMethod('cashOnDelivery')
										}}>
										<input id="cashOnDelivery" name="paymentMethod" type="radio" value="cashOnDelivery" checked={paymentMethod === 'cashOnDelivery'} />
										<Text type="normal" htmlFor="cashOnDelivery" isDarkTheme={_isDarkTheme} color="text_description">
											Cash on Delivery
										</Text>
									</Flexed>

									<Flexed
										direction="row"
										align="center"
										gap={0.5}
										onClick={() => {
											setPaymentMethod('debitOrCreditCard')
										}}>
										<input id="debitOrCreditCard" name="paymentMethod" type="radio" value="debitOrCreditCard" checked={paymentMethod === 'debitOrCreditCard'} />
										<Text type="normal" htmlFor="debitOrCreditCard" isDarkTheme={_isDarkTheme} color="text_description">
											Debit / Credit card
										</Text>
									</Flexed>
								</Flexed>
								{paymentMethod === 'debitOrCreditCard' && openPopup === false && (
									<>
										<Payment sellersAndProducts={cart?.products} />
									</>
								)}
								<Spacer height={1} />

								{paymentMethod === 'cashOnDelivery' && (
									<Footer margin="1rem 0rem 0rem 0rem">
										<Button
											medium
											hasBorder
											type="clear"
											label="Edit Order"
											width="100%"
											ifClicked={() => {
												dispatch(editCartBeforeCheckout(false))
												_navigate('/cart')
											}}
										/>
										<ButtonOrder onClick={() => placeOrderPopup()}>Place Order</ButtonOrder>
									</Footer>
								)}
							</BillingContent>
						</Wrapper>
					</Col>
				</Row>
				{openPopup && <InfoPopup onClose={() => setOpenPopup(false)} data={sellerId} />}
				<Spacer height={2} />
			</Main>
		</>
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

const Wrapper = styled.div<any>`
	border: 1px solid ${palette.silver};
	border-radius: 0.39rem;
	padding: 1rem 1rem 0rem 1rem;
	box-shadow: ${palette.shadow};
	background: ${({ isDarkTheme }) => (isDarkTheme ? `${palette.light_black}` : `${palette.white}`)};
`

const BillingContent = styled.div<any>`
	background: ${({ isDarkTheme }) => (isDarkTheme ? palette.black : palette.white)};
	padding: 1rem 1rem;
	border-radius: 0.39rem;
`

const Footer = styled(Flexed) <any>`
	flex-direction: row;
	gap: 1rem;
	${media.sm`gap:2rem;`}
`

const ButtonOrder = styled.div`
	pacity: 1;
	text-transform: capitalize;
	border-radius: 2rem;
	padding: 0.65rem 2rem;
	font-size: 1rem;
	height: 2.5rem;
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

export default PlaceOrder
