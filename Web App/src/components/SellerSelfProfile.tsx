import React, {useEffect, useState} from 'react'
import {palette} from '../styled/colors'
import styled from 'styled-components'
import {Text, Flexed, Spacer, getDistanceFromLatLonInMiles} from '../styled/shared'
import {Col, Row, media} from 'styled-bootstrap-grid'
import SellersProfile from './sellers/SellersProfile'
import StyledCard from './StyledCard'

import ProductsCard from './ProductCard'
import SellersAllPosts from './sellers/SellersAllPosts'

const SellerSelfProfile = ({addToCart, community, setSellerId, setIsSellerSelfProfileOpen, sellerId, getAllSellers, data}: any) => {
	const [selectTab, setSelectTab] = useState(community ? 'posts' : 'products')
	const [distanceInMiles, setDistanceInMiles]: any = useState('')
	// getSellerAllPost
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')

	const doGetDistanceFromLatLonInMiles = async () => {
		if (data?.lat && data?.log && _userLocation.lat && _userLocation.log) {
			const res = await getDistanceFromLatLonInMiles(data?.lat, data?.log, _userLocation.lat, _userLocation.log)
			setDistanceInMiles(res)
		}
	}

	useEffect(() => {
		doGetDistanceFromLatLonInMiles()
	}, [])

	return (
		<Wrapper>
			{data?.display_profile ? (
				<>
					<Content>
						<SellersProfile setSellerId={setSellerId} community={community} getAllSellers={getAllSellers} setIsSellerSelfProfileOpen={setIsSellerSelfProfileOpen} data={data} seller={true} distanceInMiles={distanceInMiles} />

						<Divider />
						
						<Discription type="normal" color="black_100">
							{data?.about ? data?.about : ''}
						</Discription>
						

						{/* <Flexed direction="row" align="center" gap={2}>
					<Heading level={5} color="text">
						{data?.first_name}
						<span>'s products</span>
					</Heading>
					<Heading level={5} color="text">
						{data?.first_name}
						<span>'s Posts</span>
					</Heading>
				</Flexed> */}

						<Flexed className="mb-2 " direction="row" align="center" gap={.5}>
							<Tab
								active={selectTab == 'posts'}
								direction="row"
								align="center"
								border
								gap={0.5}
								onClick={() => {
									setSelectTab('posts')
								}}>
								<StyledText active={selectTab === 'posts'} type="normal">
									{data?.first_name}
									<Have>'s</Have>&nbsp; Posts
								</StyledText>
							</Tab>
							<Tab
								active={selectTab == 'products'}
								direction="row"
								align="center"
								border
								gap={0.5}
								onClick={() => {
									setSelectTab('products')
								}}>
								<StyledText active={selectTab == 'products'} type="normal">
									products
								</StyledText>
							</Tab>

							{/* <Tab
						active={selectTab == 'Events'}
						direction="row"
						align="center"
						border
						gap={0.5}
						onClick={() => {
							setSelectTab('Events')
						}}>
						<StyledText active={selectTab == 'Events'} type="normal">
						Events
						</StyledText>
					</Tab> */}
						</Flexed>
					</Content>
					{selectTab === 'products' && (
						<>
							<CustomRow xlJustifyContent="center" mdJustifyContent="start" smJustifyContent="center" style={{padding: '1.25rem'}}>
								{data?.userProducts?.length
									? data?.userProducts?.map((content, index) => {
											return (
												<Col key={index} xxl={6} xl={8} lg={6} md={6} sm={8}>
													{content?.discount > 0 ? (
														<StyledCard cardIndex={index} sale content={content} addToCart={addToCart} />
													) : content?.is_donation ? (
														<StyledCard cardIndex={index} donation content={content} addToCart={addToCart} />
													) : content?.is_trade ? (
														<ProductsCard cardIndex={index} trade content={content} addToCart={addToCart} />
													) : (
														<StyledCard cardIndex={index} content={content} addToCart={addToCart} />
													)}
													{/* <SellersProductCard sale={content.sale} content={content} addToCart={addToCart} /> */}
												</Col>
											)
									  })
									: data?.userProducts?.length == 0 && (
											<Col>
												<Text type="small" margin="3rem 0rem" isCentered>
													{'No data found'}
												</Text>
											</Col>
									  )}
									  
							</CustomRow>
						</>
					)}
					<CustomRow className='p-125 seller-posts' xlJustifyContent="center" mdJustifyContent="start" smJustifyContent="center">
						{selectTab === 'posts' && <SellersAllPosts  sellerId={data?.id} 
						
						/>}
						
					</CustomRow>
				</>
			) : (
				<NotAllowDiv style={{padding: '1rem'}}>User not allowed anyone to see profile</NotAllowDiv>
			)}
		</Wrapper>
	)
}

const StyledText = styled(Text)`
	font-size: 1rem;
	display: block;
	font-weight: ${({active}) => (active ? 700 : 400)};
	color: ${({active}) => (active ? palette.green_200 : palette.gray_400)};
	text-transform: capitalize;
	&:hover {
		color: ${palette.green_200};
		font-weight: 700;
	}
	${media.xs`
	// display:none
	`}
`

const CustomRow = styled(Row)`
	${media.xxl`justify-content: start !important`}
`

const Tab = styled(Flexed)<any>`
	display: flex;
	padding: 0.563rem 1rem;
	height: 2rem;
	cursor: pointer;
	background-color: ${({active}) => (active ? '#ffffff' : '')};
	box-shadow: ${({active}) => (active ? '0 .125rem .25rem rgba(0,0,0,.075) !important' : 'none')};
	border-radius: 1.25rem;
	&:hover{
		background-color: ${palette.white};
		box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;
	}
	&:hover div{
		background-color: ${palette.white};
		color: ${palette.green_200};
		font-weight: 700;
	}
`

const Wrapper = styled.div`
	background-color: ${palette.gray_300};
	border-radius: .675rem;
`

export const NotAllowDiv = styled.div`
	color: rgb(108, 117, 125);
`

const Content = styled.div`
	padding: 1.25rem 1.25rem 0rem;
`

const Divider = styled.div<any>`
	height: 1px;
	width: 100%;
	background: ${palette.stroke};
	margin-bottom: 1.25rem;
`
const Discription = styled(Text)<any>`
	letter-spacing: 0.32px;
`

const Have = styled.span<any>`
	text-transform: lowercase;
`

export default SellerSelfProfile
