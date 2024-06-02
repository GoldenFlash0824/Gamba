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
	const [expand, setExpand] = useState(false);

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

	return (
		<Wrapper active={pathname === '/calendar' || pathname.includes('/calendar')}>
			<div>
				{seller?.data?.data?.topSeller?.length > 0 && (pathname.includes('/products')) ? (
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

				{pathname.includes('/products') && (
					seller?.data?.data?.topSeller?.length > 7 ? (<>
						{!expand ? <>{seller?.data?.data?.topSeller?.slice(0, 7).map((row: any, index: any) => (
							<PopularSellersCard key={index} product={product} setSelectCategory={setSelectCategory} setSellerId={setSellerId} setUserId={setUserId} social={social} data={row} updateUsers={() => getPopularSellerData(false)} />
						))}</> : <>{seller?.data?.data?.topSeller?.map((row: any, index: any) => (
							<PopularSellersCard key={index} product={product} setSelectCategory={setSelectCategory} setSellerId={setSellerId} setUserId={setUserId} social={social} data={row} updateUsers={() => getPopularSellerData(false)} />
						))}</>}

						<Flexed margin={'1rem 0rem 0rem 0rem'} direction={'row'} justify={'flex-end'}>
							<Button onClick={() => { setExpand(!expand) }}>{!expand ? "Show More" : "Show Less"}</Button>
						</Flexed>
					</>) : (<>{seller?.data?.data?.topSeller?.map((row: any, index: any) => (
						<PopularSellersCard key={index} product={product} setSelectCategory={setSelectCategory} setSellerId={setSellerId} setUserId={setUserId} social={social} data={row} updateUsers={() => getPopularSellerData(false)} />
					))}</>)
				)}
				{!pathname.includes('/products') && (
					topUsers?.length > 7 ? (<>
						{!expand ? <>{topUsers?.slice(0, 6).map((row, index) => (
							<GambaNetworkList
								key={index}
								product={product}
								setSelectCategory={setSelectCategory}
								setSellerId={setSellerId}
								setUserId={setUserId}
								social={social}
								data={row}
							/>
						))}</> : <>{topUsers?.map((row, index) => (
							<GambaNetworkList
								key={index}
								product={product}
								setSelectCategory={setSelectCategory}
								setSellerId={setSellerId}
								setUserId={setUserId}
								social={social}
								data={row}
							/>
						))}</>}

						<Flexed margin={'1rem 0rem 0rem 0rem'} direction={'row'} justify={'flex-end'}>
							<Button onClick={() => { setExpand(!expand) }}>{!expand ? "Show More" : "Show Less"}</Button>
						</Flexed>
					</>
					) : (topUsers.map((row: any, index: any) => {
						return <>
							<GambaNetworkList key={index} product={product} setSelectCategory={setSelectCategory} setSellerId={setSellerId} setUserId={setUserId} social={social} data={row} />
						</>
					})))
				}
				{pathname.includes('/products') && seller?.data?.data?.topSeller?.length > 0 && <Spacer id="1" height={1.5} />}
				{!pathname.includes('/products') && topUsers?.length > 0 && <Spacer id="2" height={1.5} />}
			</div>
			{
				pathname.includes('/products') && <div>
					<Spacer height={3} />
					{/* <HappeningAroundYou /> */}
					<AdsImg src="/images/Products_Image.png" alt="sidebar_ads_img" />
					{/* <Text type="normal" fontWeight={700} color="black_100" textTransform="capitalize">
					Lorem ipsum dolor sit amet
				</Text> */}
					<Text type="small" color="gray" textTransform="">
						<TextWithSeeMore text="Unlock the potential of your farm-fresh produce or homegrown delights by selling them on
							Gamba! Join our platform and connect directly with health-conscious consumers who value
							quality, sustainability, and locally sourced goods. By showcasing your products on Gamba, you'll
							not only expand your reach but also support a community dedicated to healthy living and
							environmental stewardship. Join us in promoting wholesome, nutritious options while growing
							your business. Let your passion for farming and home growing shine on Gamba!" maxLength={100} background="" />
					</Text>
					<Spacer height={1} />
				</div>
			}
			{
				pathname.includes('/community') && <div>
					<HappeningAroundYou />
					<AdsImg src="/images/ImageForGamba.png" alt="sidebar_ads_img" />
					<Text type="small" color="gray" textTransform="">
						<p className="side-img-text">Welcome to Gamba, a vibrant community where passion for good food, a commitment to the environment, and the joy of growing, selling, and sharing homegrown or handmade products more... <a href='/about-us' >read more..</a></p>
					</Text>
					<Spacer height={1} />
				</div>
			}
			{
				pathname.includes('/calendar') && <div>
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
						memorable experiences together on Gamba!" maxLength={100} background="" />
					</Text>
					<Spacer height={1} />
				</div>
			}
			{
				pathname.includes('/network') && <div>
					<Spacer height={3} />
					{/* <HappeningAroundYou /> */}
					<AdsImg src="/images/ImageForGamba.png" alt="sidebar_ads_img" />
					<Text type="small" color="gray" textTransform="">
						<p className="side-img-text">Welcome to Gamba, a vibrant community where passion for good food, a commitment to the environment, and the joy of growing, selling, and sharing homegrown or handmade products more... <a href='/about-us' >read more..</a></p>
					</Text>
					<Spacer height={1} />
				</div>
			}
		</Wrapper >
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

const Button = styled.span`
	border: none;
	cursor: pointer;
	font-size: 0.75rem;
	color: ${palette.gray};
	-webkit-box-align: center;
	-webkit-box-pack: center;
	font-family: Lato-Bold, sans-serif;
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
