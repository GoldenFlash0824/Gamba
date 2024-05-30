import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, Container, media } from 'styled-bootstrap-grid'
import { Spacer, Text } from '../styled/shared'
import { palette } from '../styled/colors'
import { getUserEvents } from '../apis/apis'
import { Flexed } from '../styled/shared'
import Events from './events/Events'
import Loader from './common/Loader'
import { useNavigate } from 'react-router-dom'

const MyEvents = ({ setUserId }) => {
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	let _navigate = useNavigate()

	const getEvents = async () => {
		setLoading(true)
		const response = await getUserEvents()
		setEvents(response?.data?.event)
		setLoading(false)
	}

	useEffect(() => {
		getEvents()
	}, [])

	return (
		<Main fluid>
			{loading && <Loader visible={loading} />}
			<Spacer height={1.25} />
			<Flexed direction="row" align="center" gap="0.5">
				<Text
					pointer
					fontWeight={500}
					type="normal"
					color="gray"
					s
					onClick={() => {
						_navigate('/products')
					}}>
					Home
				</Text>

				<img src="/images/icons/arrow.svg" alt="arrow" />

				<Text fontWeight={500} type="normal" color="black_100">
					My Events
				</Text>
			</Flexed>
			<Spacer height={1.25} />
			<Wrapper>
				<Row className='d-flex align-items-stretch'>
					{events.length
						? events.map((data, index) => {
							return (
								<Col xxl={6} xl={6} lg={6} key={index} className='d-flex d-flex-col'>
									<Events setUserId={setUserId} data={data} index={index} onEdit={() => getEvents()} parent={true} />
								</Col>
							)
						})
						: events?.length === 0 && (
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
`

const Wrapper = styled.div`
	background-color: ${palette.white} !important;
	width: 100%;
	border-radius: 0.3rem;
	padding: 20px;
	border-radius: 1rem;
`

export default MyEvents
