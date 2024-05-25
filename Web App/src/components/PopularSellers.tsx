import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flexed, Heading, Text, getCurrentAddress, Spacer } from '../styled/shared'
import PopularSellersCard from './PopularSellersCard'
import { getPopularSeller, getTopUsersApi } from '../apis/apis'
import { useDispatch, useSelector } from 'react-redux'
import { setIsLoading } from '../actions/authActions'
import { useNavigate } from 'react-router-dom'
import HappeningAroundYou from './HappeningAroundYou'
import { useLocation } from 'react-router-dom'
import GambaNetworkList from './GambaNetworkList'
import { palette } from '../styled/colors'
import { media } from 'styled-bootstrap-grid'
import TextWithSeeMore from './common/SeeMoreText'

const PopularSellers = ({ setUserId, setSellerId, product, setSelectCategory, social, selectCategory }: any) => {
	const { pathname } = useLocation()
	const [seller, setSeller]: any = useState()
	const [topUsers, setTopUsers] = useState([])

	const randerGambaNetworkListToggle = useSelector<any>((state: any) => state.auth.randerGambaNetworkListToggle)
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const _navigate = useNavigate()
	const _dispatch = useDispatch()

	const getPopularSellerData = async (loading = true) => {
		_dispatch(setIsLoading(loading))
		let response = await getPopularSeller()
		setSeller(response)
		_dispatch(setIsLoading(false))
	}

	const getTopUsers = async () => {
		const response = await getTopUsersApi()
		setTopUsers(response?.data?.data)
	}

	useEffect(() => {
		if (selectCategory === 'sellers') {
			getPopularSellerData()
		}
		getTopUsers()
	}, [selectCategory])

	useEffect(() => {
		getPopularSellerData()
		getTopUsers()
	}, [randerGambaNetworkListToggle])

	useEffect(() => {
		console.log(seller);
	}, [seller]);

	return (
		<Wrapper active={pathname === '/calendar' || pathname.includes('/calendar')}>
			<div>
				{seller?.data?.data?.topSeller?.length > 0 && pathname.includes('/products') ? (
					<>
						<Flexed >
							<Text type="normal" color="black_100" fontWeight="700">
								Gamba’s Sellers
							</Text>
						</Flexed>
					</>
				) : topUsers?.length > 0 && !pathname.includes('/products') ? (
					<>
						<Flexed   >
							<Text type="normal" color="black_100" fontWeight="700">
								Gamba’s Network
							</Text>
						</Flexed>
					</>
				) : null}

				{pathname.includes('/products') &&
					seller?.data?.data?.topSeller?.map((row: any, index: any) => {
						return (
							<>
								{index < 6 ? (
									<PopularSellersCard key={index} product={product} setSelectCategory={setSelectCategory} setSellerId={setSellerId} setUserId={setUserId} social={social} data={row} updateUsers={() => getPopularSellerData(false)} />
								) : null}
							</>
						)
					})}
				{!pathname.includes('/products') &&
					topUsers?.map((row: any, index: any) => {
						return <>{index < 6 ? <GambaNetworkList key={index} product={product} setSelectCategory={setSelectCategory} setSellerId={setSellerId} setUserId={setUserId} social={social} data={row} /> : null}</>
					})}
				{pathname.includes('/products') && seller?.data?.data?.topSeller?.length > 0 && <Spacer id="1" height={1.5} />}
				{!pathname.includes('/products') && topUsers?.length > 0 && <Spacer id="2" height={1.5} />}
			</div>
			{pathname.includes('/products') && <div>
				<Spacer height={3} />
				<HappeningAroundYou />
				<AdsImg src="/images/Products_Image.png" alt="sidebar_ads_img" />
				{/* <Text type="normal" fontWeight={700} color="black_100" textTransform="capitalize">
					Lorem ipsum dolor sit amet
				</Text> */}
				<Text type="small" color="gray" textTransform="">
					<TextWithSeeMore text="Are you the proud owner of a farm, winery, or any health-conscious venue? If so, we invite you
						to join our vibrant community at Gamba by creating a health-conscious event. Whether it's a
						farm-to-table feast showcasing your fresh produce, a vineyard wellness retreat offering
						rejuvenating experiences, or a venue dedicated to promoting healthy living, your event has a
						place here. Our health-conscious community is eagerly seeking unique and enriching
						experiences that prioritize well-being and sustainability. By hosting an event with us, you'll not
						only connect with like-minded individuals but also contribute to a healthier and more mindful
						world. Join us in inspiring others to embrace a lifestyle of wellness and vitality. Let's create
						memorable experiences together on Gamba!" maxLength={100} />
				</Text>
				<Spacer height={1} />
			</div>}
			{pathname.includes('/community') && <div>
				<Spacer height={3} />
				<HappeningAroundYou />
				<AdsImg src="/images/ImageForGamba.png" alt="sidebar_ads_img" />
				{/* <Text type="normal" fontWeight={700} color="black_100" textTransform="capitalize">
					Lorem ipsum dolor sit amet
				</Text> */}
				<Text type="small" color="gray" textTransform="">
					<p className="side-img-text">Welcome to Gamba, a vibrant community where passion for good food, a commitment to the environment, and the joy of growing, selling, and sharing homegrown or handmade products more... <a href='/about-us' >read more..</a></p>
				</Text>
				<Spacer height={1} />
			</div>}
			{pathname.includes('/calendar') && <div>
				<Spacer height={3} />
				<HappeningAroundYou />
				<AdsImg src="/images/Calendar_Image.png" alt="sidebar_ads_img" />
				{/* <Text type="normal" fontWeight={700} color="black_100" textTransform="capitalize">
					Lorem ipsum dolor sit amet
				</Text> */}
				<Text type="small" color="gray" textTransform="">
					<TextWithSeeMore text="Are you the proud owner of a farm, winery, or any health-conscious venue? If so, we invite you
						to join our vibrant community at Gamba by creating a health-conscious event. Whether it's a
						farm-to-table feast showcasing your fresh produce, a vineyard wellness retreat offering
						rejuvenating experiences, or a venue dedicated to promoting healthy living, your event has a
						place here. Our health-conscious community is eagerly seeking unique and enriching
						experiences that prioritize well-being and sustainability. By hosting an event with us, you'll not
						only connect with like-minded individuals but also contribute to a healthier and more mindful
						world. Join us in inspiring others to embrace a lifestyle of wellness and vitality. Let's create
						memorable experiences together on Gamba!" maxLength={100} />
				</Text>
				<Spacer height={1} />
			</div>}
		</Wrapper>
	)
}

const Wrapper = styled(Flexed)`
	width: 100%;
	flex-flow: ${({ active }) => (active ? 'column-reverse' : '')};
`
const AdsImg = styled.img`
	border-radius: 8px;
	margin-bottom: 0.625rem;
	/* height: 200px; */
	width: 100%;
	object-fit: cover;
`

export const CustomText = styled.div<any>`
	font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : '400')};
	font-size: ${({ type, fontSize }) => (fontSize ? `${fontSize}rem` : '1rem')};
	font-family: 'Lato-Regular', sans-serif;
	line-height: ${({ type, lineHeight }) => (lineHeight ? `${lineHeight}rem` : '')};
	color: ${({ color, isDarkTheme }) => (color ? palette[color] : isDarkTheme ? palette.light_gray : palette.dark_gray)};
	margin: ${({ margin }) => `${margin}`};
	text-align: ${({ isCentered }) => (isCentered ? `center` : 'left')};
	cursor: ${({ pointer }) => (pointer ? `pointer` : '')};
	opacity: ${({ opacity }) => (opacity ? opacity : '1')};
	text-transform: ${({ textTransform }) => (textTransform ? textTransform : '')};
	text-decoration: ${({ textDecoration }) => textDecoration};
	text-underline-offset: ${({ textDecoration }) => (textDecoration ? '2.9px' : '')};
	white-space: ${({ whiteSpaces }) => whiteSpaces};
	${media.xs`
	font-size: 0.9rem;
	`};
	${media.sm`
	font-size: 0.9rem;
	`};
	${media.md`
	font-size: ${({ type, fontSize }: any) => (fontSize ? `${fontSize}rem` : '1rem')};
	`};
	${media.lg`
	font-size: ${({ type, fontSize }: any) => (fontSize ? `${fontSize}rem` : '1rem')};
	`};
	${media.xl`
	font-size: 1rem;
	`};
	${media.xxl`
	font-size: 1rem;
	`};
`

export default PopularSellers
