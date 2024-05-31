import React from 'react'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {Heading, Text, Flexed} from '../styled/shared'
import {Container, Row, Col, media} from 'styled-bootstrap-grid'
import LocationSearch from './common/LocationSearch'
import {useSelector} from 'react-redux'

interface IProps {
	isDarkTheme: boolean
}

const MainCover = () => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	return (
		<MainContent>
			<OverLay isDarkTheme={_isDarkTheme} />
			<Content>
				<Container>
					<Row justifyContent="center">
						<Col lg={8}>
							<Flexed margin="0rem 0rem 5rem 0rem">
								<MainHeading level={2} margin="0rem 0rem 1rem 0rem" color="white" textTransform="normal" isCentered>
									Explore the World in comfort. Enjoy your life.
								</MainHeading>
								<MainHeading level={2} margin="0rem 0rem 2rem 0rem" color="white" textTransform="normal" isCentered>
									Exploring the unexplored
								</MainHeading>
								<LocationSearch />
							</Flexed>
						</Col>
					</Row>
				</Container>
				<Container fluid style={{position: 'absolute', bottom: '2rem'}}>
					<Row>
						<Column lg={3} md={3} sm={4} xs={6}>
							<Img src="/images/insta.svg" />
							<Text fontSize="normal" color="white" textTransform="normal" lineHeight="1.8" isCentered>
								Community Of
							</Text>
							<Text fontSize="normal" color="white" textTransform="normal" lineHeight="1.8" isCentered>
								172k+ On Instagram
							</Text>
						</Column>
						<Column lg={3} md={3} sm={4} xs={6}>
							<Img src="/images/google.svg" />
							<Text fontSize="normal" color="white" textTransform="normal" lineHeight="1.8" isCentered>
								2200+
							</Text>
							<Text fontSize="normal" color="white" textTransform="normal" lineHeight="1.8" isCentered>
								Google Review
							</Text>
						</Column>
						<Column lg={3} md={3} sm={4} xs={6}>
							<Img src="/images/location.svg" />
							<Text fontSize="normal" color="white" textTransform="normal" lineHeight="1.8" isCentered>
								400+
							</Text>
							<Text fontSize="normal" color="white" textTransform="normal" lineHeight="1.8" isCentered>
								Itineraries
							</Text>
						</Column>
						<Column lg={3} md={3} sm={4} xs={6}>
							<Img src="/images/location.svg" />
							<Text fontSize="normal" color="white" textTransform="normal" lineHeight="1.8" isCentered>
								No Cost
							</Text>
							<Text fontSize="normal" color="white" textTransform="normal" lineHeight="1.8" isCentered>
								EMI
							</Text>
						</Column>
					</Row>
				</Container>
			</Content>
		</MainContent>
	)
}

const MainContent = styled.div`
	background-image: url('https://d3l9a8mvoa6cl8.cloudfront.net/wp-content/uploads/sites/3/2022/03/29224300/How-to-make-a-food-delivery-app.png');
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
	width: 100%;
	height: 100vh;
`

const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100vh;
	position: relative;
	z-index: 2;
`

const OverLay = styled.div<IProps>`
	background: ${({isDarkTheme}) => (isDarkTheme ? `${palette.main_cover_overlay_dark}` : `${palette.main_cover_overlay_light}`)};
	position: absolute;
	width: 100%;
	height: 100vh;
`

const MainHeading = styled(Heading)`
	@media screen and (min-width: 0px) and (max-width: 1300px) {
		// margin-right:3rem;
		// margin-left:3rem;
		text-align: center;
	}
`

const Column = styled(Col)`
	text-align: center;
	margin-top: 2rem;
`

const Img = styled.img`
	height: 2rem;
	${media.md`height:3rem;`}
	${media.lg`height:4rem;`}
margin-bottom:0.5rem;
`

export default MainCover
