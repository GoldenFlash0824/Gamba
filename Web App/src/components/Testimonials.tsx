import React, {useEffect} from 'react'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {Flexed, Heading, Spacer, Text} from '../styled/shared'
import {Container, Row, Col, media} from 'styled-bootstrap-grid'
import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import {AiOutlineRight, AiOutlineLeft} from 'react-icons/ai'
import {useSelector} from 'react-redux'

interface IProps {
	isDarkTheme: boolean
}

const Testimonials = () => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const responsive = {
		0: {
			items: 1
		},
		500: {
			items: 1
		},
		786: {
			items: 2
		},
		992: {
			items: 2
		},
		1200: {
			items: 2
		},
		1600: {
			items: 3
		}
	}

	useEffect(() => {
		let _domElement_pre = document.querySelectorAll('#testimonials div div.owl-nav button.owl-prev')
		let _domElement_next = document.querySelectorAll('#testimonials div div.owl-nav button.owl-next')
		_domElement_pre[0]?.setAttribute('id', 'testimonialsPre')
		_domElement_next[0]?.setAttribute('id', 'testimonialsNext')
	}, [])

	return (
		<Container fluid>
			<Row justifyContent="center">
				<Col lg={8}>
					<Heading level={2} margin="0rem 0rem 1.2rem 0rem" isCentered isDarkTheme={_isDarkTheme}>
						Delivery Management Software for Enterprises
					</Heading>
					<Text type="large" isCentered isDarkTheme={_isDarkTheme}>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it to make a type specimen book.{' '}
					</Text>
				</Col>
			</Row>
			<Spacer height="2" />
			<Row justifyContent="between" style={{position: 'relative'}}>
				<Flex lg={4} lgOrder={1} order={2}>
					<ControlContent>
						<Heading fontSize="2.188" lineHeight="2.5" margin="0rem 0rem 1.2rem 0rem" isDarkTheme={_isDarkTheme}>
							How Does Tookan Optimize Delivery?
						</Heading>
						<Content direction="row" align="center" gap="0.5">
							<ArrowWrapper htmlFor="testimonialsPre">
								<ArrowLeft />
							</ArrowWrapper>
							<ArrowWrapper htmlFor="testimonialsNext">
								<ArrowRight />
							</ArrowWrapper>
						</Content>
					</ControlContent>
				</Flex>
				<Col id="testimonials" lg={8} lgOrder={2} order={1}>
					<OwlCarousel className="owl-theme" dots={false} autoplay={true} autoplayHoverPause={false} loop margin={10} nav responsive={responsive}>
						<Card className="item" isDarkTheme={_isDarkTheme}>
							<Row style={{textAlign: 'left'}}>
								<Col xs={12} sm={12} md={12} lg={12}>
									<ProfileImage src="https://jungleworks.com/wp-content/uploads/2021/02/group-21-copy-8.png" />
								</Col>
								<Col xs={12} sm={12} md={12} lg={12}>
									<Spacer height={0.2} />
									<Details>
										<Text type="normal" lineHeight="1.8" isDarkTheme={_isDarkTheme}>
											Smart Analytics
										</Text>
										<Text type="small" lineHeight="1.3" isDarkTheme={_isDarkTheme}>
											Dispatch Partners have access to information and tracking summary for upto 90 days past with comprehensive graphical reports.
										</Text>
									</Details>
								</Col>
							</Row>
						</Card>
						<Card className="item" isDarkTheme={_isDarkTheme}>
							<Row style={{textAlign: 'left'}}>
								<Col xs={12} sm={12} md={12} lg={12}>
									<ProfileImage src="https://jungleworks.com/wp-content/uploads/2021/06/route-optimize.jpg" />
								</Col>
								<Col xs={12} sm={12} md={12} lg={12}>
									<Spacer height={0.2} />
									<Details>
										<Text type="normal" lineHeight="1.8" isDarkTheme={_isDarkTheme}>
											Route Optimization
										</Text>
										<Text type="small" lineHeight="1.3" isDarkTheme={_isDarkTheme}>
											Retrieve the most efficient path for any mode of transportation with Tookan
										</Text>
									</Details>
								</Col>
							</Row>
						</Card>
						<Card className="item" isDarkTheme={_isDarkTheme}>
							<Row style={{textAlign: 'left'}}>
								<Col xs={12} sm={12} md={12} lg={12}>
									<ProfileImage src="https://jungleworks.com/wp-content/uploads/2021/02/agentt.png" />
								</Col>
								<Col xs={12} sm={12} md={12} lg={12}>
									<Spacer height={0.2} />
									<Details>
										<Text type="normal" lineHeight="1.8" isDarkTheme={_isDarkTheme}>
											Enhanced Productivity
										</Text>
										<Text type="small" lineHeight="1.3 isDarkTheme={_isDarkTheme}" isDarkTheme={_isDarkTheme}>
											Get valuable insights about your customer's experience by tracking ratings, feedback, and better communication.
										</Text>
									</Details>
								</Col>
							</Row>
						</Card>
					</OwlCarousel>
				</Col>
				<Col style={{position: 'absolute', zIndex: '9', top: '50%', left: 0, right: 0}}></Col>
			</Row>
			<Spacer height={5} />
		</Container>
	)
}
const Flex = styled(Col)`
	display: flex;
	align-items: center;
	justify-content: center;
	${media.lg`justify-content:flex-end;`}
`

const ControlContent = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	${media.lg`width:80%; text-align:start;`}
	${media.xl`width:80%; text-align:start;`}
	${media.xxl`width:70%; text-align:start;`}
`

const Content = styled(Flexed)`
	justify-content: center;
	${media.lg`justify-content:start;`}
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

const ArrowLeft = styled(AiOutlineLeft)`
	cursor: pointer;
	font-size: 1.5rem;
	color: ${palette.white};
`

const Card = styled.div<IProps>`
	background: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	border: 1px solid rgba(0, 0, 0, 0.13);
	margin-bottom: 1rem;
	border-radius: 1rem;
	overflow: hidden;
	min-height: 22.875rem;
`

const ProfileImage = styled.img`
	width: 100% !important;
	height: 15rem;
	background: ${palette.silver};
	object-fit: cover;
`

const Details = styled.div`
	padding: 1rem;
`

export default Testimonials
