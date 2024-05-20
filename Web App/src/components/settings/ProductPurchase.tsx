import React, {useState} from 'react'
import styled from 'styled-components'
import {Row, Container, media} from 'styled-bootstrap-grid'
import {Text, Flexed, Spacer} from '../../styled/shared'
import {palette} from '../../styled/colors'
import {useNavigate} from 'react-router-dom'

const ProductPurchase = ({addToCart}) => {
	let _navigate = useNavigate()
	return (
		<>
			<Main fluid>
				<Spacer height={1.25} />
				<Flexed direction="row" align="center" gap="0.5">
					<Text
					pointer
						fontWeight={500}
						type="normal"
						color='gray'
						onClick={() => {
							_navigate('/')
						}}>
						Home
					</Text>
				
				<img src='/images/icons/arrow.svg' alt='arrow'/>

					<Text type="normal" fontWeight={500} color="black_100">
						Purchase Product
					</Text>
				</Flexed>
				<Spacer height={1.25} />
				<Wrapper>
					<Row justifyContent="center">
						{/* {dummyData?.map((content: any, index: any) => {
							return (
								<>
									<Col lg={5.5} md={6}>
										<StyledCard cardIndex={index} content={content} addToCart={addToCart} soldProducts={true} />
									</Col>
								</>
							)
						})} */}
					</Row>
				</Wrapper>
				<Spacer height={2} />
			</Main>
		</>
	)
}

const Wrapper = styled.div`
	background-color: ${palette.white} !important;
	width: 100%;
	border-radius: 0.3rem;
`

const Main = styled(Container)`
	padding-right: 0rem;
	padding-left: 0rem;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
`;

export default ProductPurchase
