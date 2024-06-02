import React from 'react'
import { Flexed, Spacer, Text } from '../styled/shared'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import OrderHistory from '../components/OrderHistory'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const History = () => {
	let _navigate = useNavigate()

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

				<img src="/images/icons/arrow.svg" alt="arrow" />

				<Text fontWeight={500} type="normal" color="black_100">
					Order History
				</Text>
			</Flexed>
			<Spacer height={1.25} />
			<Row>
				<Col>
					<OrderHistory />
				</Col>
			</Row>
			<Spacer height={2} />
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
`

export default History
