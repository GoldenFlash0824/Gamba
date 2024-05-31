import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, Container, media } from 'styled-bootstrap-grid'
import { palette } from '../../styled/colors'
import { getFevSeller } from '../../apis/apis'
import { Text, Flexed, Spacer } from '../../styled/shared'
import { useDispatch } from 'react-redux'
import { setIsLoading } from '../../actions/authActions'
import { useNavigate } from 'react-router-dom'
import SellersCard from '../sellers/SellersCard'
import MyNetworkList from '../MyNetworkList'

const ProfileFavorites = ({ setSellerId }: any) => {
	const [seller, setSeller] = useState([])
	const _dispatch = useDispatch()
	let _navigate = useNavigate()

	const getFevSellerData = async () => {
		_dispatch(setIsLoading(true))
		const resp = await getFevSeller()
		setSeller(resp.data.data.allSellers)
		_dispatch(setIsLoading(false))
	}

	useEffect(() => {
		getFevSellerData()
	}, [])

	return (
		<Wrapper>
			<Main fluid>
				<Spacer height={1.25} />
				<Row justifyContent="center">
					<Col xxl={7} xl={6} lg={10}>
						<Flexed direction="row" align="center" gap="0.5">
							<Text
								pointer
								fontWeight={500}
								type="normal"
								color='gray'
								onClick={() => {
									_navigate('/products')
								}}>
								Home
							</Text>

							<img src='/images/icons/arrow.svg' alt='arrow' />

							<Text type="normal" fontWeight={500} color="black_100">
								My Network
							</Text>
						</Flexed>
						<Spacer height={1.25} />
					</Col>
				</Row>
				<Row justifyContent="center">
					<Col xxl={7} xl={6} lg={10}>
						<Section>
							<SellerWrapper>
								<Body>
									{seller?.length === 0 && (
										<Col>
											<Text type="small" margin="4rem 0rem" isCentered>
												No data found
											</Text>
										</Col>
									)}
									{seller?.map((data: any, index) => {
										return (<>
											<MyNetworkList data={data} setSellerId={setSellerId} getFevSellerData={getFevSellerData} />
											<Spacer height={0.5} />
										</>
										)
									})}
								</Body>
							</SellerWrapper>
						</Section>
					</Col>
				</Row>
				<Spacer height={2} />
			</Main>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	// background: ${palette.fbBg};
`

const Main = styled(Container)`
	padding-right: 0rem;
	padding-left: 0rem;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
`
const Section = styled.div<any>`
	overflow: hidden;
	position: -webkit-sticky; /* Safari */
	position: -webkit-sticky;
	position: sticky;
	top: 10rem;
`

const SellerWrapper = styled.div<any>`
	background: ${palette.white};
	border-radius: 1rem;
`

const Body = styled.div`
	overflow-x: hidden;
	overflow-y: scroll;
	padding: 20px;
	padding-bottom: 1rem;
	height: calc(100vh - 250px);
`

export default ProfileFavorites
