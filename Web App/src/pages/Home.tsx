import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'styled-bootstrap-grid'
import styled from 'styled-components'
import Product from '../components/Product'
import Community from './Community'
import { Spacer } from '../styled/shared'
import { palette } from '../styled/colors'
import { media } from 'styled-bootstrap-grid'
import { useSelector } from 'react-redux'

const Home = ({ addToCart }: any) => {
	const selectedCategory = useSelector<any>((state: any) => state.auth.selectedCategory)
	const [isSelected, setIsSelected] = useState(selectedCategory)

	useEffect(() => {
		setIsSelected(selectedCategory)
	}, [selectedCategory])
	return (
		<>
			<CustomSpacer />
			<Container>
				<Row justifyContent="center">
					<Col lg={8}>
						<Wrapper>
							<Tab
								active={isSelected === 'product'}
								onClick={() => {
									setIsSelected('product')
								}}>
								Products
							</Tab>
							<Tab
								active={isSelected === 'community'}
								onClick={() => {
									setIsSelected('community')
								}}>
								Community
							</Tab>
						</Wrapper>
					</Col>
				</Row>
			</Container>
			<CustomSpacer />
			{isSelected === 'product' && <Product addToCart={addToCart} />}
			{isSelected === 'community' && <Community />}
			<Spacer height={4} />
		</>
	)
}

const Wrapper = styled.div`
	height: 4rem;
	background-color: ${palette.silver};
	border-radius: 0.5rem;
	display: flex;
	overflow: hidden;
	${media.xs`height: 3rem;`}
`

const Tab = styled.div<any>`
	height: 100%;
	width: 100%;
	background-color: ${({ active }) => (active ? palette.Btn_dark_green : palette.silver)};
	color: ${({ active }) => (active ? palette.white : '')};
	font-size: 1.2rem;
	font-weight: bold;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	${media.xs`font-size: 1rem;`}
`

const CustomSpacer = styled.div<any>`
	${media.xs`height: 1.2rem;`}
	${media.sm`height: 2rem;`}
	${media.md`height: 2.5rem;`}
	${media.lg`height: 4rem;`}
`

export default Home
