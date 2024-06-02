import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {Flexed, Heading, Text} from '../styled/shared'
import {useSelector} from 'react-redux'
import Button from './common/Button'
import {useNavigate} from 'react-router-dom'
import {Col, media} from 'styled-bootstrap-grid'
import {getOrdersApi} from '../apis/apis'
import {useDispatch} from 'react-redux'
import {setIsLoading} from '../actions/authActions'
const OrderHistory = () => {
	const _dispatch = useDispatch()
	const [orders, setOrders] = useState([])
	const isLoading = useSelector((state: any) => state.auth.isLoading)
	const [isDataProgress, setIsDataProgress]: any = useState(true)
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	let _navigate = useNavigate()

	useEffect(() => {
		getOrders()
	}, [])

	const getOrders = async () => {
		_dispatch(setIsLoading(true))
		setIsDataProgress(true)
		const orders = await getOrdersApi()
		setOrders(orders.data)
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	return (
		<>
			{orders?.length
				? orders.map((d: any) => (
						
							
						<div className='card mb-3  rounded-5 '>
							<div className='card-body p-3'>
							<div className='row d-flex justify-content-between '>
							<div className='col-md-auto col-6 mb-3 mb-md-auto d-flex gap-3 '>
							{d.order_products?.length ? (
									<Cover
										onClick={() => {
											_navigate('/order-details', {state: {data: d}})
										}}>
										<Image src={`https://imagescontent.s3.us-east-1.amazonaws.com/${d.order_products[0]?.product_orders?.images[0]}`} />
									</Cover>
								) : (
									'Product Deleted'
								)}
								<Flexed
									onClick={() => {
										_navigate('/order-details', {state: {data: d}})
									}}>
									<Heading level={6} color="text">
										{d.order_products.map((e) => e.product_orders.name).join(', ')}
									</Heading>
									<Text type="small" color="text_description">
										${d.total}
									</Text>
								</Flexed>
							</div>
							<div className='col-md-auto mb-md-auto col-6 mb-3 d-flex justify-content-center  align-items-center align-items-md-start  flex-column'>
							<Heading level={6} color="text">
									Seller
								</Heading>
								<Text type="small" color="text_description">
									Mona
								</Text>
							</div>
							<div className='col-md-auto col-6 mb-3 mb-md-auto d-flex justify-content-center align-items-start   flex-column'>
							<Heading level={6} color="text">
									Address
								</Heading>
								<Text type="small" color="text_description">
									A street C road
								</Text>
							</div>
							<div className='col-md-auto col-6 mb-3 mb-md-auto d-flex justify-content-center align-items-center align-items-md-start   flex-column'>
							
								<Heading level={6} color="text">
									Date
								</Heading>
								<Text type="small" color="text_description">
									{new Date(d.createdAt).toLocaleDateString()}
								</Text>
							
							</div>
							<div className='col-md-auto col-6 mb-3 mb-md-auto d-flex justify-content-center align-items-start align-items-md-center  flex-column'>
							<div
								onClick={() => {
									_navigate('/order-details', {state: {data: d}})
								}}>
								<Heading level={6} color="text">
									Order no
								</Heading>
								<Text type="small" color="text_description">
									# {d.id}
								</Text>
							</div>
							</div>
							<div className='col-md-auto col-6 mb-3 mb-md-0 d-flex justify-content-center align-items-center ' style={{color: 'rgb(56, 176, 0)'}}>
						
								Complete
								
							
							</div>
							<div className='col-md-auto col-6 mb-3 mb-md-0 d-flex justify-content-start justify-content-md-center  align-items-start align-items-md-center  '>
							
								<Button
									label="View"
									small
									ifClicked={() => {
										_navigate('/order-details', {state: {data: d}})
									}}
								/>
							
							</div>
						</div>
							</div>
						</div>
						
				  ))
				: orders?.length === 0 && (
						<Col>
							<Text type="small" margin="4rem 0rem" isCentered>
								{isDataProgress ? '' : 'No data found'}
							</Text>
						</Col>
				  )}
		</>
	)
}

const Wrapper = styled.div<any>`
	display: flex;
	// gap: 1rem;
	justify-content: space-between;
	align-items: center;
	margin: 0 0 0.5rem 0;
	width: 100%;
	background: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	overflow: hidden;
	box-shadow: ${palette.shadow};
	padding: 1rem;
	cursor: pointer;
	border-radius: 0.39rem;
	transition: all ease 0.25s;
	position: relative;
	${media.xs`grid-template-columns: 2fr 1fr`};
	${media.sm`grid-template-columns: 2fr 1fr 1fr`};
	${media.md`grid-template-columns: 2fr 1fr 1fr`};
	${media.lg`grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr`};
	&:hover {
		box-shadow: ${palette.shadowHover};
	}
`

const Cover = styled.div`
	cursor: pointer;
`

const Image = styled.img`
	width: 3rem;
	height: 3rem;
	object-fit: cover;
	border-radius: 0.39rem;
`

const Content = styled.div`
	display: flex;
`

export default OrderHistory
