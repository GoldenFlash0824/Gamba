import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Flexed, Heading, Spacer, Text} from '../styled/shared'
import {palette} from '../styled/colors'
import {Container, Row, Col, media} from 'styled-bootstrap-grid'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'
import {saveSearchText} from '../actions/authActions'

interface IProps {
	active?: boolean
	isDarkTheme?: boolean
}

const BusinessInterfaces = () => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const [activeTabs, setActiveTabs] = useState('dashboard')
	const _dispatch = useDispatch()

	useEffect(() => {
		_dispatch(saveSearchText(''))
	}, [])

	return (
		<Container>
			<Row justifyContent="center">
				<Heading level={2} margin="0rem 0rem 1.2rem 0rem" fontWeight={700} isCentered isDarkTheme={_isDarkTheme}>
					Business Interfaces
				</Heading>
			</Row>
			<Spacer height="2" />
			<CustomRow justifyContent="center" isDarkTheme={_isDarkTheme}>
				<Col lg={2} md={4} sm={4} xs={4}>
					<Tab
						type="large"
						isDarkTheme={_isDarkTheme}
						fontWeight={700}
						pointer
						active={activeTabs === 'dashboard'}
						isCentered
						onClick={() => {
							setActiveTabs('dashboard')
						}}>
						Dashboard
					</Tab>
				</Col>
				<Col lg={2} md={4} sm={4} xs={4}>
					<Tab
						type="large"
						isDarkTheme={_isDarkTheme}
						fontWeight={700}
						pointer
						active={activeTabs === 'customerapp'}
						isCentered
						onClick={() => {
							setActiveTabs('customerapp')
						}}>
						Customer App
					</Tab>
				</Col>
				<Col lg={2} md={4} sm={4} xs={4}>
					<Tab
						type="large"
						isDarkTheme={_isDarkTheme}
						fontWeight={700}
						pointer
						active={activeTabs === 'agentapp'}
						isCentered
						onClick={() => {
							setActiveTabs('agentapp')
						}}>
						Agent App
					</Tab>
				</Col>
				<Col lg={2} md={4} sm={4} xs={4}>
					<Tab
						type="large"
						isDarkTheme={_isDarkTheme}
						fontWeight={700}
						pointer
						active={activeTabs === 'managerapp'}
						isCentered
						onClick={() => {
							setActiveTabs('managerapp')
						}}>
						Manager App
					</Tab>
				</Col>
				<Col lg={2} md={4} sm={4} xs={4}>
					<Tab
						type="large"
						isDarkTheme={_isDarkTheme}
						fontWeight={700}
						pointer
						active={activeTabs === 'bookingform'}
						isCentered
						onClick={() => {
							setActiveTabs('bookingform')
						}}>
						Booking Form
					</Tab>
				</Col>
			</CustomRow>
			<Row>
				{activeTabs === 'dashboard' && (
					<TabContent>
						<Spacer height={2} />
						<Container>
							<Row>
								<Col lgOrder={1} order={2}>
									<Text type="large" isCentered isDarkTheme={_isDarkTheme}>
										Track your on-field personnel in real-time with powerful geo analytics tools for better workforce productivity.
									</Text>
								</Col>
								<Col lgOrder={2} order={1}>
									<SystemImg src="https://jungleworks.com/wp-content/uploads/2022/10/tookanDashboardImg.png" />
								</Col>
							</Row>
						</Container>
					</TabContent>
				)}
				{activeTabs === 'customerapp' && (
					<TabContent>
						<Spacer height={2} />
						<Container>
							<Row>
								<Col lg={6}>
									<MobileImg src="https://jungleworks.com/wp-content/uploads/2022/10/customerApp-Tookan-1.png" />
								</Col>
								<Col lg={6}>
									<Content>
										<Flexed>
											<CustomHeading fontSize={1.375} level={4} margin="0rem 0rem 0.5rem 0rem" fontWeight={600} isDarkTheme={_isDarkTheme}>
												CUSTOMER APP
											</CustomHeading>
											<Text type="large" isDarkTheme={_isDarkTheme}>
												Allow customers to track the status of their order on map interface with real-time location of delivery agent. And, integrate payment gateways and various online wallets to allow secure payment.
											</Text>
										</Flexed>
									</Content>
								</Col>
							</Row>
						</Container>
					</TabContent>
				)}
				{activeTabs === 'agentapp' && (
					<TabContent>
						<Spacer height={2} />
						<Container>
							<Row>
								<Col lg={6} lgOrder={1} order={2}>
									<Content>
										<Flexed>
											<CustomHeading fontSize={1.375} level={4} margin="0rem 0rem 0.5rem 0rem" fontWeight={600} isDarkTheme={_isDarkTheme}>
												AGENT APP
											</CustomHeading>
											<Text type="large" isDarkTheme={_isDarkTheme}>
												Reduce time and save cost by auto-assigning the delivery task to free and closest agents. Navigate the delivery agent through the most optimized route to make a doorstep delivery for every customer in
												least possible time.
											</Text>
										</Flexed>
									</Content>
								</Col>
								<Col lg={6} lgOrder={2} order={1}>
									<MobileImg src="https://jungleworks.com/wp-content/uploads/2022/10/AgentAppTk-5.png" />
								</Col>
							</Row>
						</Container>
					</TabContent>
				)}
				{activeTabs === 'managerapp' && (
					<TabContent>
						<Spacer height={2} />
						<Container>
							<Row>
								<Col lg={6}>
									<MobileImg src="https://jungleworks.com/wp-content/uploads/2022/10/managerAppImg-3.png" />
								</Col>
								<Col lg={6}>
									<Content>
										<Flexed>
											<CustomHeading fontSize={1.375} level={4} margin="0rem 0rem 0.5rem 0rem" fontWeight={600} isDarkTheme={_isDarkTheme}>
												MANAGER APP
											</CustomHeading>
											<Text type="large" isDarkTheme={_isDarkTheme}>
												Manage details of orders placed at online stores and generate advanced analytic reports of orders placed by customers. Track your on-field personnel in real time with powerful geo-analytics tools for
												better workforce productivity.
											</Text>
										</Flexed>
									</Content>
								</Col>
							</Row>
						</Container>
					</TabContent>
				)}
				{activeTabs === 'bookingform' && (
					<TabContent>
						<Spacer height={2} />

						<Container>
							<Row>
								<Col lg={6} lgOrder={1} order={2}>
									<Content>
										<Flexed>
											<CustomHeading fontSize={1.375} level={4} margin="0rem 0rem 0.5rem 0rem" fontWeight={600} isDarkTheme={_isDarkTheme}>
												PERSONALIZED BOOKING FORM
											</CustomHeading>
											<Text type="large" isDarkTheme={_isDarkTheme}>
												Tookan forms allow you to directly create tasks in the dashboard by accepting customer orders using a web form from your desired URL name. These are customizable through the form editor in your
												dashboard.
											</Text>
										</Flexed>
									</Content>
								</Col>
								<Col lg={6} lgOrder={2} order={1}>
									<SystemImg src="https://jungleworks.com/wp-content/uploads/2022/10/bookingFormsImg-1.png" />
								</Col>
							</Row>
						</Container>
					</TabContent>
				)}
			</Row>
			<Spacer height="5" />
		</Container>
	)
}

const CustomRow = styled(Row)<IProps>`
	border-bottom: 0.2rem solid ${({isDarkTheme}) => (isDarkTheme ? `${palette.light_silver}` : `${palette.silver}`)};
`

const Tab = styled(Text)<IProps>`
	position: relative;
	color: ${({active}) => (active ? `${palette.blue}` : ``)};
	margin-top: 2rem;
	${media.lg` margin-top:0`};
	&:after {
		content: '';
		border-bottom: ${({active}) => (active ? ' 0.2rem' : `hidden`)} solid ${palette.blue};
		display: block;
		border-radius: 1rem;
		margin: 0 auto;
		width: 90%;
		margin-top: 0.35rem;
	}
`

const TabContent = styled(Col)`
	min-height: 25rem;
`

const Content = styled.div`
	display: flex;
	align-items: center;
	height: 100%;
`

const CustomHeading = styled(Heading)`
	width: fit-content;
	&:after {
		content: '';
		border-bottom: 0.2rem solid ${palette.blue};
		display: block;
		border-radius: 1rem;
		margin: 0 auto;
		width: 100%;
		margin-top: 0.35rem;
	}
`

const SystemImg = styled.img`
	width: 100%;
	margin-bottom: 1rem;
`

const MobileImg = styled.img`
	width: 100%;
	margin-bottom: 1rem;
`

export default BusinessInterfaces
