import React, { useState, useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Heading, Text, Spacer } from '../styled/shared'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import { useSelector, useDispatch } from 'react-redux'
import Button from '../components/common/Button'
import { useJsApiLoader } from '@react-google-maps/api'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { addRatingToProduct, paymentApi } from '.././apis/apis'
import GiveRating from '../components/modals/GiveRating'
import ReportModal from '../components/modals/ReportModal'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

import { addItemInCart, clearCart } from '../actions/cartActions'

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

const OrderDetails = () => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const [clat, setCLat] = useState<any>('')
	const [clng, setCLng] = useState<any>('')
	const [location, setLocation] = useState('')
	const _navigate = useNavigate()
	const dispatch = useDispatch()
	const MySwal = withReactContent(Swal)

	const [isGiveRatingModalOpen, setIsGiveRatingModalOpen] = useState(false)
	const [productId, setProductId] = useState(0)

	const data = useLocation()

	useEffect(() => {
		getCurrentLatLng()
	}, [])

	const printRef = useRef(null);

	const handlePrint = useReactToPrint({
		content: () => printRef.current,
		documentTitle: 'Order Summary',
		copyStyles: true,
		onBeforeGetContent: () => {
		},
	});

	const getCurrentLatLng = async () => {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				setCLat(position.coords.latitude)
				setCLng(position.coords.longitude)
				await getCurrentAddress(position.coords.latitude, position.coords.longitude)
			},
			function (error) {
				// eslint-disable-next-line eqeqeq
				if (error.code == error.PERMISSION_DENIED) {
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

	const addrating = async (product_id) => {
		setProductId(product_id)
		setIsGiveRatingModalOpen(true)
		//await addRatingToProduct(product_id, rating)
	}

	let products = data?.state?.data?.order_products?.map((e) => {
		let a = e.product_orders
		a.quantity = e?.quantity
		return a
	})

	const reorderPopup = async () => {
		dispatch(clearCart('0'))
		data.state.data.order_products.map(
			(orderProduct) => {
				let quantity = 1
				if (orderProduct.product_orders.discount > 0) {
					let amount = orderProduct.product_orders.price - (orderProduct.product_orders.discount / 100) * orderProduct.product_orders.price
					orderProduct.product_orders.discountPrice = amount
				} else {
					orderProduct.product_orders.discountPrice = orderProduct.product_orders.price
				}
				quantity = orderProduct.product_orders.quantity
				dispatch(addItemInCart({ content: orderProduct.product_orders, quantity }))
			}
		);
		_navigate('/cart', { state: { isReorder: true } })
	}

	return (
		<Main fluid>
			<Spacer height={1} />
			<Flexed direction="row" align="center" gap="0.5">
				<Text
					pointer
					fontWeight={500}
					type="normal"
					color="gray"
					onClick={() => {
						_navigate('/')
					}}>
					Home
				</Text>

				<img src="/images/icons/arrow.svg" alt="arrow" />

				<Text
					fontWeight={500}
					type="normal"
					color="black_100"
					pointer={'pointer'}
					onClick={() => {
						_navigate(-1)
					}}>
					Order History
				</Text>

				<img src="/images/icons/arrow.svg" alt="arrow" />

				<Text fontWeight={500} type="normal" color="black_100">
					Order details
				</Text>
			</Flexed>
			<Spacer height={0.5} />
			<Section>
				<Container ref={printRef}>
					<Row justifyContent="center">
						<Col className='bg-white mt-3 p-3 rounded-6' lg={8}>

							<Flexed direction="row" align="self-start" justify="space-between">
								<div style={{ width: '15rem' }}>
									<div className='d-flex align-items-center gap-1'>
										<Text type="normal" fontWeight={600} color="text">
											Seller Name:
										</Text>
										<text className="mt-1" style={{ color: 'rgb(82, 82, 82)' }}>Mona</text>
									</div>
									<div className='d-flex align-items-center gap-1'>
										<Text type="normal" fontWeight={600} color="text">
											Order no:
										</Text>
										<text className="mt-1" style={{ color: 'rgb(82, 82, 82)' }}># {data.state.data.id}</text>
									</div>
									{/* <Text type="normal" color="text">
							# {data.state.data.id}
						</Text> */}
									<div className='d-flex align-items-center gap-1'>
										<Text fontWeight={600} type="normal" color="text">
											Order date:
										</Text>
										<Text className="mt-1"><span style={{ color: 'rgb(82, 82, 82)' }}>{new Date(data.state.data.createdAt).toLocaleDateString()}</span></Text>
									</div>

									<Text fontWeight={600} type="normal" color="text">
										Status: <span style={{ color: 'rgb(56, 176, 0)' }}>Complete</span>
									</Text>
								</div>
								<Flexed direction="column" justify="end">
									<OrderID direction="row" justify="space-between">
										<div>
											<div className='d-flex align-items-center  gap-1'>
												<Text fontWeight={600} type="normal" color="text">
													Delivered to:
												</Text>
												<Text className="mt-1">
													<span style={{ color: 'rgb(82, 82, 82)' }}>XYZ, DownTown street 123 </span>
												</Text>
											</div>

											<div className='d-flex align-items-center  gap-1'>
												<Text fontWeight={600} type="normal" color="text">
													Payment method:
												</Text>
												<Text className="mt-1">
													<span style={{ color: 'rgb(82, 82, 82)' }}>{data.state.data?.payment_method === 'cashOnDelivery' ? 'Cash On Delivery' : 'Debit / Credit card'} </span>
												</Text>
											</div>
										</div>
									</OrderID>

									<StatusContent direction="row" align="self-start" className="btdn-link">

										<Button className="btn" width="50%" label="Re-Order" small ifClicked={() => reorderPopup()} />
										<Text className="VSP-hover"
											pointer
											style={{ marginLeft: '10px' }}
											type="normal"
											textDecoration="none"
											fontWeight={500}
											color="green_200"
											onClick={() => {
												handlePrint()
											}}>
											Print
										</Text>
										{/* <Button width="50%" label="Complete" type="complete" small /> */}
									</StatusContent>
								</Flexed>
							</Flexed>
							<Spacer height={1} />



							<Text fontWeight={600} type="normal" color="text" >
								Products{' '}
							</Text>
							{data.state.data.order_products?.length
								? data.state.data.order_products.map((d) => (
									<Wrapper isDarkTheme={_isDarkTheme}>
										<Cover>
											<Image src={`https://imagescontent.s3.us-east-1.amazonaws.com/${d.product_orders.images[0]}`} />
										</Cover>

										<Content>
											<Heading level={6} color="text">
												{d.product_orders.name}
											</Heading>
											<Flexed gap={0.5}>
												<Text type="normal" color="text_description">
													{d.quantity} x
												</Text>
											</Flexed>
											<Flexed gap={0.5}>
												<Text type="normal" color="text_description">
													$ {d.product_orders?.discount ? (d.product_orders?.price - (d.product_orders?.discount / 100) * d.product_orders?.price)?.toFixed() : d.product_orders.price}
												</Text>
											</Flexed>

											{/* <Flexed gap={0.5}>
										<Button
											width="50%"
											label="give rating"
											type="complete"
											small
											ifClicked={() => {
												//setIsGiveRatingModalOpen(true)
												//
												addrating(d.product_id)
											}}
										/>
									</Flexed> */}
										</Content>
									</Wrapper>
								))
								: 'Product Deleted'}
							{/* <Wrapper isDarkTheme={_isDarkTheme}>
							<Cover>
								<Image src="https://nammorganic.wpengine.com/wp-content/uploads/2023/01/shop-4-1.jpg" />
							</Cover>
							<Content>
								<Heading level={6}  color="text">
									Organic Sweet Peas
								</Heading>
								<Flexed gap={0.5}>
									<Text type="normal" color="text_description">
										2x
									</Text>
								</Flexed>
								<Flexed gap={0.5}>
									<Text type="normal" color="text_description">
										£0.00
									</Text>
								</Flexed>
							</Content>
						</Wrapper>
						<Wrapper isDarkTheme={_isDarkTheme}>
							<Cover>
								<Image src="https://nammorganic.wpengine.com/wp-content/uploads/2023/01/shop-10-1.jpg" />
							</Cover>
							<Content>
								<Heading level={6}  color="text">
									Organic Sweet Corn
								</Heading>
								<Flexed gap={0.5}>
									<Text type="normal" color="text_description">
										2x
									</Text>
								</Flexed>
								<Flexed gap={0.5}>
									<Text type="normal" color="text_description">
										£0.00
									</Text>
								</Flexed>
							</Content>
						</Wrapper> */}
							<BillingContent isDarkTheme={_isDarkTheme}>
								<Flexed direction="row" justify="end" gap="5">
									<Text type="normal" color="text_description">
										Subtotal
									</Text>
									<Text type="normal" color="text_description">
										$ {data.state.data.total}
									</Text>
								</Flexed>
								<Flexed direction="row" justify="end" gap="5">
									<Text type="normal" color="text_description">
										Delivery fee
									</Text>
									<Text type="normal" color="text_description">
										$ 0
									</Text>
								</Flexed>
								<Flexed direction="row" justify="end" gap="5">
									<Text type="normal" color="text_description">
										Service fee
									</Text>
									<Text type="normal" color="text_description">
										$ 0
									</Text>
								</Flexed>
								<Flexed direction="row" justify="end" gap="5">
									<Text fontWeight={700} type="medium" color="text">
										Total Paid
									</Text>
									<Text fontWeight={700} type="medium" color="text">
										$ {data.state.data.total}
									</Text>
								</Flexed>
							</BillingContent>
						</Col>
					</Row>

				</Container>
				{isGiveRatingModalOpen && (
					<GiveRating
						productid={productId}
						onClose={() => {
							setIsGiveRatingModalOpen(false)
						}}
					/>
				)}
			</Section>
		</Main>
	)
}

const Main = styled(Container)`
	padding-right: 0.3rem;
	padding-left: 0.3rem;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
	.btdn-link Button
	{
		// background-color: transparent !important;
		color: black;
		// border-bottom: 2px solid transparent;
		border-radius: 12px;
		// min-width: 2.5rem !important;
		padding: 16px 12px;
		height: 1rem;
		font-size: 0.875rem;
	}

	.btdn-link Button:first-child
	{
		// color: rgb(56, 176, 0); !important;
		color: #fff !important;
		
	}

	.btdn-link Button:first-child:hover
	{
		border-color: rgb(56, 176, 0);
	}

	.btdn-link Button:last-child
	{
		color: red !important;
		background-color: transparent;
		border:1px solid red !important; 
	}

	.btdn-link Button:last-child:hover
	{
		color: #fff !important;
		background-color:red;
	}
`

const OrderID = styled(Flexed)`
	padding-bottom: 1rem;
	border-bottom: 1px dashed ${({ isDarkTheme }) => (isDarkTheme ? palette.light_silver : palette.silver)};
`

const Section = styled.div`
	background: ${palette.fbBg};

	
`

const Wrapper = styled.div<any>`
	display: flex;
	gap: 1rem;
	width: 100%;
	overflow: hidden;
	padding: 1rem;
	cursor: pointer;
	border-radius: 0.39rem;
	transition: all ease 0.25s;
	position: relative;
	border-bottom: 1px dashed ${({ isDarkTheme }) => (isDarkTheme ? palette.light_silver : palette.silver)};
	background-color : #f2f5f7;
	margin-top: 1rem;
`

const Cover = styled.div``

const Image = styled.img`
	width: 3rem;
	height: 3rem;
	object-fit: cover;
	border-radius: 0.39rem;
`

const Content = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`

const BillingContent = styled.div<any>`
	background: ${({ isDarkTheme }) => (isDarkTheme ? palette.black : palette.white)};
	padding: 1rem 1rem 0rem 1rem;
	border-radius: 0.39rem;
`

const StatusContent = styled(Flexed)`
	flex-wrap: wrap;
	
	@media print {
		display: none;
		@page {
			margin-top: 2cm; /* Adjust the value to your desired margin */
		}
	}
`

export default OrderDetails
