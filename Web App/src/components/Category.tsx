import React from 'react'
import styled from 'styled-components'
import {Heading, Spacer, Text} from '../styled/shared'
import {palette} from '../styled/colors'
import {Container, Row, Col, media} from 'styled-bootstrap-grid'
import {AiOutlineRight} from 'react-icons/ai'
import {useSelector} from 'react-redux'

interface IProps {
	isDarkTheme: boolean
}

const Category = () => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)

	return (
		<Container fluid>
			<Spacer height="5" />
			<Row justifyContent="center">
				<Heading level={2} margin="0rem 0rem 1.2rem 0rem" isDarkTheme={_isDarkTheme} isCentered>
					Tailor-made Solutions for Every Business
				</Heading>
			</Row>
			<Spacer height="2" />
			<Row>
				<Col xl={2.2} lg={4} md={4} sm={6} xs={12}>
					<Card isDarkTheme={_isDarkTheme}>
						<Logo src="/images/food.svg" />
						<Title isDarkTheme={_isDarkTheme} type="normal" lineHeight="1.8" margin="0.5rem 0rem 0rem 0rem" isCentered>
							Food
						</Title>
						<Discription isDarkTheme={_isDarkTheme} type="small" lineHeight="1.3" margin="0.5rem 0rem 0rem 0rem" isCentered>
							Tookan automatically allocates food deliveries with optimized routes which enable quick planning for every driver.
						</Discription>
					</Card>
				</Col>
				<Col xl={2.2} lg={4} md={4} sm={6} xs={12}>
					<Card isDarkTheme={_isDarkTheme}>
						<Logo src="/images/grocery.svg" />
						<Title isDarkTheme={_isDarkTheme} type="normal" lineHeight="1.8" margin="0.5rem 0rem 0rem 0rem" isCentered>
							Grocery
						</Title>
						<Discription isDarkTheme={_isDarkTheme} type="small" lineHeight="1.3" margin="0.5rem 0rem 0rem 0rem" isCentered>
							Improve operational efficiency with auto-mated delivery processes, seamless integration, customer profile, inventory management, and more.
						</Discription>
					</Card>
				</Col>
				<Col xl={2.2} lg={4} md={4} sm={6} xs={12}>
					<Card isDarkTheme={_isDarkTheme}>
						<Logo src="/images/pickup-deliery.webp" />
						<Title isDarkTheme={_isDarkTheme} type="normal" lineHeight="1.8" margin="0.5rem 0rem 0rem 0rem" isCentered>
							Pickup and Delivery
						</Title>
						<Discription isDarkTheme={_isDarkTheme} type="small" lineHeight="1.3" margin="0.5rem 0rem 0rem 0rem" isCentered>
							Enhance pick-up and delivery business with route optimization, real-time tracking, task automation, and more
						</Discription>
					</Card>
				</Col>
				<Col xl={2.2} lg={4} md={4} sm={6} xs={12}>
					<Card isDarkTheme={_isDarkTheme}>
						<Logo src="/images/logistic.webp" />
						<Title isDarkTheme={_isDarkTheme} type="normal" lineHeight="1.8" margin="0.5rem 0rem 0rem 0rem" isCentered>
							Logistics
						</Title>
						<Discription isDarkTheme={_isDarkTheme} type="small" lineHeight="1.3" margin="0.5rem 0rem 0rem 0rem" isCentered>
							Tookan manages all complex logistics operations simultaneously and speeds up the business flow to bring in more revenue.
						</Discription>
					</Card>
				</Col>
				<Col xl={2.2} lg={4} md={4} sm={6} xs={12}>
					<Card isDarkTheme={_isDarkTheme}>
						<Logo src="/images/courier.svg" />
						<Title isDarkTheme={_isDarkTheme} type="normal" lineHeight="1.8" margin="0.5rem 0rem 0rem 0rem" isCentered>
							Courier
						</Title>
						<Discription isDarkTheme={_isDarkTheme} type="small" lineHeight="1.3" margin="0.5rem 0rem 0rem 0rem" isCentered>
							To manage multiple deliveries in a day, Tookan optimizes your delivery operations keeping your profit margins and operation scale in mind.
						</Discription>
					</Card>
				</Col>
				<LoadMore xl={1} lg={4} md={4} sm={6} xs={12}>
					<ArrowWrapper>
						<ArrowRight />
					</ArrowWrapper>
					<Text isDarkTheme={_isDarkTheme} type="normal" lineHeight="1.8" margin="0.5rem 0rem 0rem 0rem">
						View All
					</Text>
				</LoadMore>
			</Row>
			<Spacer height="5" />
		</Container>
	)
}

const Logo = styled.img`
	object-fit: cover;
	height: 5.875rem;
	opacity: 1;
	transition: all ease 1s;
`

const Title = styled(Text)`
	position: absolute;
	top: 8rem;
	left: 0;
	right: 0;
	margin: auto;
	transition: all ease 0.5s;
`

const Discription = styled(Text)`
	top: 14rem;
	position: absolute;
	padding: 0rem 1rem;
	left: 0;
	right: 0;
	margin: auto;
	transition: all ease 0.5s;
`

const Card = styled.div<IProps>`
	position: relative;
	overflow: hidden;
	text-align: center;
	padding: 1rem;
	border-radius: 1rem;
	box-shadow: ${palette.shadow};
	min-height: 13rem;
	cursor: pointer;
	margin-bottom: 1.875rem;
	background: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	${media.xs` min-height: 12rem;`}
	&:hover {
		box-shadow: ${palette.shadowHover};
	}
	&:hover ${Logo} {
		opacity: 0;
		transition: all ease 0.2s;
	}

	&:hover ${Title} {
		top: 1rem;
		transition: all ease 0.5s;
	}

	&:hover ${Discription} {
		top: 3.2rem;
		transition: all ease 0.5s;
	}
`

const LoadMore = styled(Col)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	&:hover div,
	&:hover label {
		opacity: 0.7;
	}
`

const ArrowWrapper = styled.label`
	width: 3rem;
	height: 3rem;
	background: ${palette.black};
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0;
	border-radius: 3rem;
	&:hover {
		opacity: 0.7;
	}
`

const ArrowRight = styled(AiOutlineRight)`
	cursor: pointer;
	font-size: 1.5rem;
	color: ${palette.white};
`

export default Category
