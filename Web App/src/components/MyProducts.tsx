import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, Container, media } from 'styled-bootstrap-grid'
import { Heading, Spacer, Text } from '../styled/shared'
import { palette } from '../styled/colors'
import { Flexed } from '../styled/shared'
import StyledCard from './StyledCard'
import ProductsCard from './ProductCard'
import { useDispatch } from 'react-redux'
import { setIsLoading } from '../actions/authActions'
import { getAllProductsApi, getUserAllProductsApi } from '../apis/apis'
import { useSelector } from 'react-redux'
import { IoIosArrowForward } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const MyProducts = ({ addToCart, setUserId }) => {
	const userId = useSelector<any>((state: any) => state.auth.userId)
	const isLoading = useSelector<any>((state: any) => state.auth.isLoading)
	const [isDataProgress, setIsDataProgress]: any = useState(true)

	let _navigate = useNavigate()

	const _dispatch = useDispatch()

	useEffect(() => {
		getAllProducts()
	}, [])

	const getProductsAllData = async () => {
		getAllProducts()
	}

	const getAllProducts = async () => {
		_dispatch(setIsLoading(true))
		setIsDataProgress(true)
		const response = await getUserAllProductsApi()
		setProducts(response.data)
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	const [products, setProducts]: any = useState([])

	return (
		<Main fluid>
			<Spacer height={1.25} />
			<Flexed direction="row" align="center" gap="0.5">
				<Text
					pointer
					fontWeight={500}
					type="normal"
					color="gray"
					onClick={() => {
						_navigate('/products')
						// setSinglePost(null)
						// setSelectProfileSettingsCategory('')
						// setSelectCategory('profile')
					}}>
					Home
				</Text>

				<img src='/images/icons/arrow.svg' alt='arrow' />

				<Text fontWeight={500} type="normal" color="black_100">
					My Products
				</Text>
			</Flexed>
			<Spacer height={1.25} />
			<Wrapper>
				<Row mdJustifyContent='start' smJustifyContent='center'>
					{products?.map((content: any, index: any) => {
						return (
							<Col xl={4} lg={6} md={6} sm={8} key={index}>
								{content?.discount > 0 ? (
									<StyledCard cardIndex={index} sale myProducts={true} content={content} addToCart={addToCart} onClose={() => getProductsAllData()} />
								) : content?.is_donation ? (
									<StyledCard cardIndex={index} donation myProducts={true} content={content} addToCart={addToCart} onClose={() => getProductsAllData()} />
								) : content?.is_trade ? (
									<ProductsCard cardIndex={index} myProducts={true} trade content={content} addToCart={addToCart} onClose={() => getProductsAllData()} />
								) : (
									<StyledCard cardIndex={index} myProducts={true} content={content} addToCart={addToCart} onClose={() => getProductsAllData()} />
								)}
							</Col>
						)
					})}
					{products?.length === 0 && (
						<Col>
							<Text type="small" margin="4rem 0rem" isCentered>
								{isDataProgress ? '' : 'No data found'}
							</Text>
						</Col>
					)}
				</Row>
			</Wrapper>
			<Spacer height={2} />
		</Main>
	)
}

const Main = styled(Container)`
	padding-right: 0rem;
	padding-left: 0rem;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
`;

const Wrapper = styled.div`
	background-color: ${palette.white} !important;
	width: 100%;
	border-radius: 1rem;
	padding: 20px;
`

export default MyProducts
