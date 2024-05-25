import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, Container, media } from 'styled-bootstrap-grid'
import { Flexed, Heading, Spacer, Text } from '../../styled/shared'
import { palette } from '../../styled/colors'
import StyledCard from '../StyledCard'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setIsLoading } from '../../actions/authActions'
import { soldProductHistoryApi } from '../../apis/apis'

const SoldProducts = ({ addToCart }) => {
	let _navigate = useNavigate()
	const _dispatch = useDispatch()
	const [loading, setLoading] = useState(true)

	const [soldProducts, setSoldProducts] = useState([])

	useEffect(() => {
		doGetUserSoldProducts()
	}, [])
	// getUserSoldProducts

	const doGetUserSoldProducts = async () => {
		_dispatch(setIsLoading(true))
		setLoading(true)

		let response = await soldProductHistoryApi()
		setSoldProducts(response?.data?.data)
		_dispatch(setIsLoading(false))
		setLoading(false)
	}

	return (
		<Main fluid>
			<Spacer height={1.25} />
			<Flexed direction="row" align="center" gap="0.5">
				<Text
					pointer
					fontWeight={500}
					type="normal"
					color='gray'
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
					Sold Products
				</Text>
			</Flexed>
			<Spacer height={1.25} />
			<Wrapper>
				<Row>
					{soldProducts?.map((content: any, index: any) => {
						return (
							<>
								<Col className='' lg={6} md={6}>
									<StyledCard cardIndex={index} content={content} addToCart={addToCart} soldProducts={true} />
								</Col>
							</>
						)
					})}
					{soldProducts?.length === 0 && (
						<Col>
							<Text type="small" margin="4rem 0rem" isCentered>
								{loading ? '' : 'No data found'}
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

export default SoldProducts
