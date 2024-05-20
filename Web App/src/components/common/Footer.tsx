import React from 'react'
import styled from 'styled-components'
import {Container, Row, Col, media} from 'styled-bootstrap-grid'
import {Heading, Spacer, Text, Divider} from '../../styled/shared'
import {FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube} from 'react-icons/fa'
import {palette} from '../../styled/colors'
import {useSelector} from 'react-redux'

interface IProps {
	isDarkTheme: boolean
}

const Footer = () => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	return (
		<Section isDarkTheme={_isDarkTheme}>
			<Wrapper>
				<Row>
					<CustomColMain lg={4.8} xs={12} sm={12} md={12}>
						<SubSection>
							<Content>
								<Image src="/images/gambaLogo.png" />
							</Content>
							<Spacer height={2} />
							<Icon>
								<ArrowAvatar>
									<FaLinkedinIn fill={`${_isDarkTheme ? palette.silver : palette.gray}`} />
								</ArrowAvatar>
								<ArrowAvatar>
									<FaTwitter fill={`${_isDarkTheme ? palette.silver : palette.gray}`} />
								</ArrowAvatar>
								<ArrowAvatar>
									<FaFacebookF fill={`${_isDarkTheme ? palette.silver : palette.gray}`} />
								</ArrowAvatar>
								<ArrowAvatar>
									<FaYoutube fill={`${_isDarkTheme ? palette.silver : palette.gray}`} />
								</ArrowAvatar>
							</Icon>
							<Spacer height={1} />
							<Text type="small" isDarkTheme={_isDarkTheme}>
								© Gamba - 2023
							</Text>
						</SubSection>
					</CustomColMain>

					<CustomCol lg={2.4} xs={6} sm={6} md={3}>
						<NewSection>
							<Heading level={4} isDarkTheme={_isDarkTheme}>
								Products
							</Heading>
							<Spacer height={0.5} />
							<FooterList>
								<NewHeading type="small" href="/" isDarkTheme={_isDarkTheme}>
									All Sellers
								</NewHeading>
							</FooterList>
							<FooterList>
								<NewHeading type="small" href="/" isDarkTheme={_isDarkTheme}>
									All Products
								</NewHeading>
							</FooterList>
							<FooterList>
								<NewHeading type="small" href="/" isDarkTheme={_isDarkTheme}>
									Trade
								</NewHeading>
							</FooterList>
							<FooterList>
								<NewHeading type="small" href="/" isDarkTheme={_isDarkTheme}>
									Sale
								</NewHeading>
							</FooterList>
						</NewSection>
					</CustomCol>

					{/* <CustomCol lg={2.4} xs={6} sm={6} md={3}>
						<NewSection>
							<Heading level={4} isDarkTheme={_isDarkTheme}>
								Community
							</Heading>
							<Spacer height={0.5} />
							<FooterList>
								<NewHeading type="small" href="/" isDarkTheme={_isDarkTheme}>
									Community
								</NewHeading>
							</FooterList>
						</NewSection>
					</CustomCol> */}

					<CustomCol lg={2.4} xs={6} sm={6} md={3}>
						<NewSection>
							<Heading level={4} isDarkTheme={_isDarkTheme}>
								Quick Links
							</Heading>
							<Spacer height={0.5} />
							<FooterList>
								<NewHeading type="small" href="/" isDarkTheme={_isDarkTheme}>
									Contact us
								</NewHeading>
							</FooterList>
							<FooterList>
								<NewHeading type="small" href="/" isDarkTheme={_isDarkTheme}>
									Terms
								</NewHeading>
							</FooterList>
							<FooterList>
								<NewHeading type="small" href="/" isDarkTheme={_isDarkTheme}>
									Privacy
								</NewHeading>
							</FooterList>
						</NewSection>
					</CustomCol>

					<CustomCol lg={2.4} xs={6} sm={6} md={3}>
						<NewSection>
							<Heading level={4} isDarkTheme={_isDarkTheme}>
								Contact Us
							</Heading>
							<Spacer height={0.5} />
							<FooterList>
								<NewHeading lowercase type="small" href="/" isDarkTheme={_isDarkTheme}>
									gamba@gmail.com
								</NewHeading>
							</FooterList>
							<FooterList>
								<NewHeading type="small" href="/" isDarkTheme={_isDarkTheme}>
									+123 000 000 000
								</NewHeading>
							</FooterList>
						</NewSection>
					</CustomCol>
				</Row>
			</Wrapper>
		</Section>
	)
}

const Section = styled.div<IProps>`
	background: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	border-top: 0.063rem solid ${({isDarkTheme}) => (isDarkTheme ? palette.light_silver : palette.silver)};
	padding: 2rem 0 0.5rem 0;
`

const Wrapper = styled(Container)`
	max-width: 1500px;
`

const NewHeading = styled(Text)<any>`
	text-transform: capitalize;
	text-transform: ${({lowercase}) => (lowercase ? 'lowercase' : 'capitalize')};

	cursor: pointer;
	&:hover {
		color: ${palette.orange};
	}
`

const ArrowAvatar = styled.div`
	vertical-align: middle;
	width: 2.188rem;
	height: 2.188rem;
	border-radius: 50%;
	border: 0.063rem solid ${palette.silver};
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 0.5rem;
	cursor: pointer;
	&:not(:last-child) {
		margin-right: 0.625rem;
	}
`
const SubSection = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;

	// ${media.lg`
	// 	display:block;
	// `}
	// ${media.xl`
	// 	display:block;
	// `}
	// ${media.xxl`
	// 	display:block;
	// `}
`

const CustomColMain = styled(Col)`
	margin-bottom: 2rem;
`

const Image = styled.img`
	height: 6rem;
`
const Content = styled.div``

const Icon = styled.div`
	display: flex;
	flex-wrap: wrap;
`

const NewSection = styled.div`
	display: flex;
	flex-direction: column;
`
const FooterList = styled.li`
	list-style: none;
	margin-top: 1rem;
`

const CustomCol = styled(Col)`
	margin: 0.5rem 0rem 2rem 0rem;
	&:not(:last-child) {
		border-right: 0.063rem solid ${palette.opacity.white};
	}
	${media.sm`
		padding-left: 2rem;
	`}
	${media.md`&:not(:nth-last-of-type(4)){
		padding-left: 2rem;
	}`}
	${media.lg`&:not(:nth-last-of-type(4)){
		padding-left: 2rem;
	}`}
	${media.xl`&:not(:nth-last-of-type(4)){
		padding-left: 4rem;
	}`}
`

export default Footer
