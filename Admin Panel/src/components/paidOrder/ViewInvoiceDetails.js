import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Typography, Box, Divider } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { color } from '../../assets/css/commonStyle'
import ViewAllPost from './viewAllPost'
import ViewUserDetail from './ViewUserDetails'
import {Container, Row, Col, media} from 'styled-bootstrap-grid'

const Flexed = styled.div`
	display: ${({inline}) => (inline ? 'inline-flex' : 'flex')};
	flex-direction: column;
	flex-direction: ${({direction}) => direction};
	align-items: ${({align}) => align};
	justify-content: ${({justify}) => justify};
	margin: ${({margin}) => `${margin}`};
	gap: ${({gap}) => `${gap}rem`};
	cursor: ${({pointer}) => (pointer ? `pointer` : '')};
	flex-wrap: ${({flexWrap}) => `${flexWrap}`};
`

const ViewInvoiceDetails = ({ order, goBackAllUser }) => {
	console.log('fromto', order)

	useEffect(() => {
		if (order !== null) {
			setUserId('')
			setuserLable('')
		} else {
			_history.push('/viewAllUsers')
		}
	}, [])

	let _history = useHistory()
	const [userLabel, setuserLable] = useState('')
	const classes = useStyles()
	const theme = useTheme()
	const [userId, setUserId] = useState(null)
	const uniqueSellers = [...new Set(
		order.order_products.map((product) => `${product.seller_detail.first_name} ${product.seller_detail.last_name}`)
	  )].join(', ');

	return (
		<div className={classes.root}>
			<Typography variant="h4" className={classes.heading}>
				{userLabel}
			</Typography>
			<Typography variant="body1" style={{marginTop: '12px'}} className={classes.para}>
				Manage {userLabel} Profile
			</Typography>
			<Typography variant="div" className={classes.backButton} onClick={goBackAllUser}>
				<ArrowBack /> Back
			</Typography>
			<Divider variant="fullWidth" className={classes.divider} />
			<div  style={{ backgroundColor: '#f0f2f5' }}>
				<Main fluid>
					<Spacer height={1} />
					<Spacer height={0.5} />
					<Section>
						<Container>
							<Row  justifyContent="center">
								<Col className='bg-white mt-3 p-3 rounded-6' lg={8}>
									<Flexed direction="row" align="center" justify="space-between">
										<div  style={{width: '150em'}}>
											<div className='d-flex align-items-center gap-1'>
												<Text type="normal" fontWeight={600} color="text">Seller Name: </Text>
												<text className="mt-1"  style={{color: 'rgb(82, 82, 82)'}}>{uniqueSellers}</text>
											</div>
											<div className='d-flex align-items-center gap-1'>
												<Text type="normal" fontWeight={600} color="text">Order no: </Text>
												<text className="mt-1"  style={{color: 'rgb(82, 82, 82)'}}># {order?.ref_id || order?.id}</text>
											</div>
											<div  className='d-flex align-items-center gap-1'>
												<Text  fontWeight={600} type="normal" color="text">Order date: </Text>
												<Text className="mt-1"><span style={{color: 'rgb(82, 82, 82)'}}>{new Date(order.createdAt).toLocaleDateString()}</span></Text>
											</div>
											<Text fontWeight={600}  type="normal" color="text">Status: <span style={{color: !order.status || order.status == 'COMPLETED' ? 'rgb(56, 176, 0)' : 'rgb(200, 0, 0)'}}>
												{!order.status || order.status == 'COMPLETED' ? 'Complete' : order.status == 'CANCELLED' ? 'Cancelled' : 'Error'}</span>
											</Text>
										</div>
									</Flexed>
									<Spacer height={1} />
									<OrderID direction="row" justify="space-between">
										<div>
											<div className='d-flex align-items-center  gap-1'>
												<Text fontWeight={600}  type="normal" color="text">Delivered to: </Text>
												<Text className="mt-1"><span style={{color: 'rgb(82, 82, 82)'}}>{order.user_orders.address}</span></Text>
											</div>
											<div className='d-flex align-items-center  gap-1'>
												<Text fontWeight={600}  type="normal" color="text">Payment method: </Text>
												<Text className="mt-1"><span style={{color: 'rgb(82, 82, 82)'}}>{order.payment_method == 'cashOnDelivery' ? 'Cash On Delivery' : 'Debit / Credit card'} </span></Text>
											</div>
										</div>
									</OrderID>
									<Spacer height={1} />
									<Text fontWeight={600} type="normal" color="text" >Products{' '}</Text>
									{order.order_products?.length ? order.order_products.map((d) => (
										<Wrapper isDarkTheme={false}>
											<Cover><Image src={`${process.env.REACT_APP_IMAGE_URL}/${d.product_orders.images[0]}`} /></Cover>
											<Content>
												<Heading level={6} color="text">{d.product_orders.name}</Heading>
												<Flexed gap={0.5}><Text type="normal" color="text_description">{d.quantity} x</Text></Flexed>
												<Flexed gap={0.5}><Text type="normal" color="text_description">$ {d.product_orders?.discount ? (d.product_orders?.price - (d.product_orders?.discount / 100) * d.product_orders?.price)?.toFixed(2) : d.product_orders.price.toFixed(2)}</Text></Flexed>
											</Content>
										</Wrapper>
									))
									: 'Product Deleted'}
									<BillingContent isDarkTheme={false}>
										<Flexed direction="row" justify="space-between">
											<Text type="normal" color="text_description">Subtotal </Text>
											<Text type="normal" color="text_description"> $ {(order.total - order.delivery_charges - order.service_charges).toFixed(2)}</Text>
										</Flexed>
										<Flexed direction="row" justify="space-between">
											<Text type="normal" color="text_description">Delivery fee </Text>
											<Text type="normal" color="text_description">$ {order.delivery_charges.toFixed(2)}</Text>
										</Flexed>
										<Flexed direction="row" justify="space-between">
											<Text type="normal" color="text_description">Service fee </Text>
											<Text type="normal" color="text_description">$ {order.service_charges.toFixed(2)}</Text>
										</Flexed>
										<Flexed  direction="row" justify="space-between">
											<Text fontWeight={700} type="medium" color="text">Total Paid </Text>
											<Text fontWeight={700} type="medium" color="text">$ {order.total.toFixed(2)}
									</Text>
								</Flexed>
							</BillingContent>
						</Col>
					</Row>
					
				</Container>
			</Section>
		</Main>
		<br></br>
		</div>
		</div>
	)
}

const handleParagraphFontSize = (type) => {
	switch (type) {
		case 'large':
			return '1.25rem'
		case 'medium':
			return '1.125rem'
		case 'normal':
			return '1rem'
		case 'small':
			return '0.875rem'
		case 'xsmall':
			return '0.75rem'
		default:
			return '0.875rem'
	}
}

const handleParagraphLineHeight = (type) => {
	switch (type) {
		case 'large':
			return '1.688rem'
		case 'medium':
			return '1.563rem'
		case 'normal':
			return '1.5rem'
		case 'small':
			return '1.125rem'
		case 'xsmall':
			return '0.938rem'
		default:
			return '1.125rem'
	}
}

const handleHeadingFontSize = (level) => {
	switch (level) {
		case 1:
			return '2.5rem'
		case 2:
			return '2rem'
		case 3:
			return '1.625rem'
		case 4:
			return '1.375rem'
		case 5:
			return '1.125rem'
		default:
			return '1rem'
	}
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
	border-bottom: 1px dashed ${({isDarkTheme}) => (isDarkTheme ? color.light_silver : color.silver)};
`

const Section = styled.div`
	background: ${color.fbBg};

	
`

const Wrapper = styled.div`
	display: flex;
	gap: 1rem;
	width: 100%;
	overflow: hidden;
	padding: 1rem;
	cursor: pointer;
	border-radius: 0.39rem;
	transition: all ease 0.25s;
	position: relative;
	border-bottom: 1px dashed ${({isDarkTheme}) => (isDarkTheme ? color.light_silver : color.silver)};
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

const BillingContent = styled.div`
	background: ${({isDarkTheme}) => (isDarkTheme ? color.black : color.white)};
	padding: 1rem 1rem 0rem 1rem;
	border-radius: 0.39rem;
`

const StatusContent = styled(Flexed)`
	flex-wrap: wrap;
`

const Spacer = styled.div`
	height: ${({height}) => `${height}rem`};
`

const Text = styled.div`
	font-weight: ${({fontWeight}) => (fontWeight ? fontWeight : '400')};
	font-size: ${({type, fontSize}) => (fontSize ? `${fontSize}rem` : handleParagraphFontSize(type))};
	font-family: 'Lato-Regular', sans-serif;
	line-height: ${({type, lineHeight}) => (lineHeight ? `${lineHeight}rem` : handleParagraphLineHeight(type))};
	color: ${({colorl, isDarkTheme}) => (colorl ? color[colorl] : isDarkTheme ? color.light_gray : color.dark_gray)};
	margin: ${({margin}) => `${margin}`};
	text-align: ${({isCentered}) => (isCentered ? `center` : 'left')};
	cursor: ${({pointer}) => (pointer ? `pointer` : '')};
	opacity: ${({opacity}) => (opacity ? opacity : '1')};
	text-transform: ${({textTransform}) => (textTransform ? textTransform : '')};
	text-decoration: ${({textDecoration}) => textDecoration};
	text-underline-offset: ${({textDecoration}) => (textDecoration ? '2.9px' : '')};
	white-space: ${({whiteSpaces}) => whiteSpaces};
`
const Heading = styled.div`
	text-transform: ${({textTransform}) => (textTransform ? textTransform : 'capitalize')};
	font-size: ${({level, fontSize}) => (fontSize ? `${fontSize}rem` : handleHeadingFontSize(level))};
	font-family: 'Lato-Regular', sans-serif;
	line-height: ${({level, lineHeight}) => lineHeight};
	color: ${({colord, isDarkTheme}) => (colord ? color[colord] : isDarkTheme ? color.white : color.text_description)};
	margin: ${({margin}) => `${margin}`};
	text-align: ${({isCentered}) => (isCentered ? `center` : 'inherit')};
	font-weight: ${({fontWeight}) => (fontWeight ? fontWeight : 400)};
	cursor: ${({pointer}) => (pointer ? `pointer` : '')};
	opacity: ${({opacity}) => (opacity ? opacity : '1')};
	// letter-spacing: 0.02em;
	font-style: ${({fontStyle}) => (fontStyle ? fontStyle : 'normal')};
`

export default ViewInvoiceDetails

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	heading: {
		fontWeight: '600',
		fontSize: '36px',
		color: color.black
	},
	para: {
		fontSize: '13px',
		color: color.black
	},
	root1: {
		backgroundColor: theme.palette.background.paper,
		marginTop: '30px',
		padding: '1rem'
	},
	divider: {
		margin: '10px 0px 20px 0px'
	},
	tabHeading: {
		display: 'inline-block',
		color: color.seaGreen
	},
	tabIcon: {
		fontSize: '18px'
	},
	backButton: {
		cursor: 'pointer',
		display: 'block',
		marginTop: '10px',
		fontSize: '15px',
		color: color.blue,
		fontWeight: 'bold'
	}
}))
