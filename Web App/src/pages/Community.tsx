import React, { useEffect, useState } from 'react'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import ProductPost from '../components/productPost/ProductPost'
import { Flexed, Spacer, Text, MiddleLayout } from '../styled/shared'
import styled from 'styled-components'
import { getAllUserPosts, searchPostsApi, getPostById, getSellerById } from '../apis/apis'
import { useDispatch } from 'react-redux'
import { addFav, commentCount, saveRoute, setIsLoading } from '../actions/authActions'
import { palette } from '../styled/colors'
import PopularSellers from '../components/PopularSellers'
import AdsPost from '../components/Ads/AdsPost'
import About from '../components/About'
import { getPopularPost } from '../apis/apis'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import SellerSelfProfile from '../components/SellerSelfProfile'
import NewPostWrapper from '../components/NewPostWrapper'
import MainCategorySideBar from '../components/MainCategorySideBar'

const Community = ({ setUserId, setSellerId, sellerId, singlePost, setSelectCategory, setSinglePost, isContactUsOpen, setIsContactUsOpen, setIsAboutOpen, isAboutOpen, showStories, setSelectedBtn, setSingleEvent }: any) => {
	const { pathname }: any = useLocation()
	const [posts, setPosts] = useState([])
	const [copyPostsData, setCopyPostsData] = useState([])
	const [topPost, setTopPost]: any = useState()
	const authToken = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [isDataProgress, setIsDataProgress]: any = useState(true)

	const [page, setPage] = useState(1)
	const [loadMore, setLoadMore] = useState(false)

	const _dispatch = useDispatch()
	const currentRoute = useSelector<any>((state: any) => state.auth.currentRoute)
	const [scrollPosition, setScrollPosition] = useState(0)
	const countComment: any = useSelector<any>((state: any) => state.auth.countComment)
	const favProduct: any = useSelector<any>((state: any) => state.auth.favProduct)

	const searchPosts: any = useSelector<any>((state: any) => state.auth.topSearch)

	const useWindowSize = () => {
		const [size, setSize] = useState([window.innerHeight, window.innerWidth])

		useEffect(() => {
			const handleResize = () => {
				setSize([window.innerHeight, window.innerWidth])
			}
			window.addEventListener('resize', handleResize)
			window.addEventListener('scroll', handleScroll, { passive: true })
		}, [])
		return size
	}

	const [screenHeight, screenWidth] = useWindowSize()

	const handleScroll = () => {
		const _position = window.pageYOffset
		setScrollPosition(_position)
	}

	const getAlldata = async () => {
		getTopPost()
	}

	useEffect(() => {
		if (countComment > 0) {
			getAllUserAndPosts(page, false)
		}
	}, [countComment])

	const getAllUserAndPosts = async (page: any, loadData: boolean) => {
		_dispatch(setIsLoading(loadData))
		setIsDataProgress(loadData)
		const response = await getAllUserPosts(page)
		if (response.success === true) {
			let postData = response?.data?.viewAllPosts
			if (page > 1) {
				postData = posts.concat(postData)
				const uniqueObjects = Object.values(
					postData.reduce((accumulator, obj) => {
						accumulator[obj.id] = obj
						return accumulator
					}, {})
				)

				postData = uniqueObjects
			}

			// postData = postData.sort((a, b) => {
			// 	return a.created_at - b.created_at
			// })

			setPosts(postData)
			setCopyPostsData(postData)
			_dispatch(commentCount(0))
			setLoadMore(response?.data?.viewAllPosts.length >= 15)
		}
		setIsDataProgress(false)
		_dispatch(setIsLoading(false))
	}

	useEffect(() => {
		if (currentRoute === '/') {
			if (authToken !== null) {
				getAllUserAndPosts(page, true)
				_dispatch(saveRoute(''))
			}
		} else {
			getSlugPost()
		}
	}, [currentRoute])

	useEffect(() => {
		getAlldata()
	}, [!searchPosts])

	useEffect(() => {
		getAllUserAndPosts(page, true)
	}, [])

	const getSlugPost = async () => {
		_dispatch(setIsLoading(true))
		setIsDataProgress(true)

		if (pathname.includes('/post/')) {
			const postIdExtraction = pathname.split('/')
			const id = postIdExtraction[2]

			if (id) {
				const response = await getPostById(id)
				setSinglePost(response?.viewAllPosts)
			}
		}
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	useEffect(() => {
		let timer: any = null
		if (searchPosts.trim().length >= 2 && pathname === '/') {
			timer = setTimeout(async () => {
				_dispatch(setIsLoading(true))
				setIsDataProgress(true)
				// setPosts([])
				const response = await searchPostsApi(searchPosts)
				setPosts(response.data)
				_dispatch(setIsLoading(false))
				setIsDataProgress(false)
			}, 500)
		} else if (searchPosts?.trim()?.length === 0) {
			setPosts(copyPostsData)
		}
		return () => clearTimeout(timer)
	}, [searchPosts])

	// const getTopUsers = async () => {
	// 	const response = await getTopUsersApi()
	// 	setTopUsers(response.data.data)
	// }

	const getTopPost = async () => {
		let response = await getPopularPost()
		setTopPost(response)
	}

	const handleItemClick = async (id: any) => {
		_dispatch(setIsLoading(true))
		setIsDataProgress(true)

		let response = await getPostById(id)
		setSinglePost(response?.viewAllPosts)
		setIsContactUsOpen(false)
		setIsAboutOpen(false)
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	const [selectedSeller, setSelectedSeller] = useState({})

	useEffect(() => {
		if (sellerId !== '') {
			getAllSellers()
		}
	}, [sellerId])

	useEffect(() => {
		if (favProduct?.length && sellerId !== '') {
			getAllSellers()
		}
	}, [favProduct])

	const getAllSellers = async () => {
		if (sellerId) {
			// setSelectCategory('sellers')
			// setIsSellerSelfProfileOpen(false)
			_dispatch(setIsLoading(favProduct?.length ? false : true))
			setIsDataProgress(favProduct?.length ? false : true)

			let response = await getSellerById(sellerId)
			setSelectedSeller(response.data.allSellers)
			_dispatch(setIsLoading(false))
			_dispatch(addFav(0))
			setIsDataProgress(false)

			// setIsSellerSelfProfileOpen(true)
			// setUserId('')
			// _dispatch(saveRoute(''))
		}
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	const loadMoreData = () => {
		setPage(page + 1)
		getAllUserAndPosts(page + 1, true)
	}

	console.log('singlePost======', singlePost)
	return (
		<Main fluid>
			<Row justifyContent="center">
				<Col xxl={2.5} xl={3}>
					<MainCategorySideBar
						setSelectedBtn={setSelectedBtn}
						sellerId={sellerId}
						setSinglePost={setSinglePost}
						isContactUsOpen={isContactUsOpen}
						setIsContactUsOpen={setIsContactUsOpen}
						setIsAboutOpen={setIsAboutOpen}
						isAboutOpen={isAboutOpen}
						setSellerId={setSellerId}
						setSingleEvent={setSingleEvent}
						setSelectCategory={setSelectCategory}
					/>
				</Col>

				{isAboutOpen ? (
					<MiddleLayout xxl={7} xl={6} lg={10}>
						<About setIsAboutOpen={setIsAboutOpen} />
					</MiddleLayout>
				) : (
					<>
						{sellerId === '' ? (
							<MiddleLayout xxl={7} xl={6} lg={10}>
								{/* <>
									{singlePost === null && (
										<>
											<InputField
												handleChange={(val: any) => {
													setSearchPosts(val)
												}}
												type="search"
												placeholder="Search"
											/>
											<Spacer height={1} />
										</>
									)}
								</> */}

								{/* <NewPostWrapper /> */}

								{singlePost !== null ? (
									<>
										<ProductPost
											setSellerId={setSellerId}
											data={singlePost}
											getAllUserAndPosts={getAllUserAndPosts}
											userData={singlePost.user}
											community="community"
											setUserId={setUserId}
											onEdit={() => {
												getTopPost()
												handleItemClick(singlePost?.id)
											}}
										/>
									</>
								) : (
									<>
										{posts?.map((data: any, index) => {
											return (
												<>
													{index === 4 || index === 9 || index === 14 ? (
														<>
															<ProductPost setSellerId={setSellerId} getAllUserAndPosts={getAllUserAndPosts} data={data} index={index} userData={data.user} community="community" setUserId={setUserId} />
															<AdsPost />
														</>
													) : (
														<ProductPost setSellerId={setSellerId} getAllUserAndPosts={getAllUserAndPosts} data={data} index={index} userData={data.user} community="community" setUserId={setUserId} />
													)}
												</>
											)
										})}
										{searchPosts.trim().length === 0 && !isDataProgress && loadMore && (
											<>
												<Button onClick={() => loadMoreData()}>Load More</Button>
												<Spacer height={1} />
											</>
										)}
									</>
								)}

								{posts?.length === 0 && (
									<Text type="small" margin="4rem 0rem" isCentered>
										{isDataProgress ? '' : 'No data found'}
									</Text>
								)}
							</MiddleLayout>
						) : (
							<MiddleLayout xxl={7} xl={6} lg={10}>
								<SellerSelfProfile setSellerId={setSellerId} community={true} sellerId={sellerId} data={selectedSeller} />
							</MiddleLayout>
						)}
					</>
				)}

				<SideCol xxl={2.5} xl={3}>
					<Wrapper scroll={scrollPosition} position={isAboutOpen || isContactUsOpen}>
						{/* {singlePost === null ? ( */}
						<MdHide scroll={scrollPosition}>
							<PopularSellers setSellerId={setSellerId} setSelectCategory={setSelectCategory} setUserId={setUserId} social={true} />
							<Spacer height={1} />
						</MdHide>
						{/* ) : null} */}
						<SponcerWrapper scroll={scrollPosition}>
							<Spacer height={1} />
							<StyledFlex gap={0.5}>
								<div onClick={() => { }}>
									<a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
										<AdsImg src="/images/growing_form.jpeg" alt="growing_form" />
									</a>
									<Text type="normal" fontWeight={700} color="black_100" textTransform="capitalize">
										Our farm grows
									</Text>
									<Text type="small" lineHeight={1.313} fontWeight={500} color="gray" textTransform="capitalize">
										Description
									</Text>
								</div>
							</StyledFlex>
							<Spacer height={0.7} />
						</SponcerWrapper>
					</Wrapper>
				</SideCol>
			</Row>
		</Main>
	)
}

const Main = styled(Container)`
	padding-right: 0;
	padding-left: 0;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
	background: #F0F2F5
`


const MdHide = styled.div<any>`
	display: ${({ scroll }) => (scroll > 750 ? 'none' : 'block')};
`

const Name = styled(Text) <any>`
	text-overflow: ellipsis;
	overflow: hidden;
	// width: 10rem;
	height: 1.2em;
	white-space: nowrap;
`
const FooterWrapper = styled.div<any>`
	display: ${({ scroll }) => (scroll > 750 ? 'block' : 'none')};
`
const SponcerWrapper = styled.div<any>`
	display: ${({ scroll }) => (scroll > 750 ? 'block' : 'none')};
`

const SideCol = styled(Col)`
	display: none;
	${media.xl`display:block;`}
`
export const StyledWrapper = styled.div<any>`
	position: sticky;
	// top: 132.03px;
	top: 100px;
	height: calc(100vh - 132.03px);
	overflow-y: auto;
	display: flex;
	// padding-right: 1.875rem;
	flex-direction: column;
	justify-content: ${({ scroll }) => (scroll > 750 ? 'flex-end' : 'space-between')};
	::-webkit-scrollbar {
		width: 0.2rem !important;
		height: 0.2rem;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #e5e6e9;
		/* opacity: 0.3; */
		border-radius: 1rem;
		border: 0.02rem solid ${palette.gray_100};
		border-width: 0rem 0.2rem 0rem 0rem;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: ${palette.gray};
		border-radius: 1rem;
	}
	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		/* background: #e5e6e9; */
	}
`

const StyledText = styled(Text)`
	&:hover {
		color: ${palette.orange};
	}
`

const Wrapper = styled.div<any>`
	position: sticky;
	// top: 132.03px;
	top : 100px;
	height: calc(100vh - 132.03px);
	overflow-y: auto;
	display: flex;

	flex-direction: column;
	justify-content: ${({ scroll }) => (scroll > 750 ? 'flex-end' : 'space-between')};
	::-webkit-scrollbar {
		display: none !important;
	}
`

const StyledFlex = styled(Flexed)``

const List = styled.ul`
	list-style: none;
	padding: 0px;
	margin-bottom: 0;

	& > li {
		padding-bottom: 0.625rem;
		cursor: pointer;
		color: ${palette.text_description};
		&:hover {
			color: ${palette.orange};
			transition: color 0.1s ease-in-out;
		}
	}
`

const CustomLink = styled(Link)`
	/* all: unset; */
	color: ${palette.text_description};
`

const Divider = styled.div`
	height: 1px;
	background: ${palette.gray_100};
	margin: 1.875rem 0rem;
`

const Img = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 100%;
`

const Content = styled.div`
	width: 6rem;
	/* height: 7rem; */
`
const ImgWrapper = styled.div`
	width: 100%;
	height: 12rem;
	object-fit: cover;
	cursor: pointer;
`

const Button = styled.div`
	background: ${palette.Btn_dark_green};
	color: ${palette.white};
	font-weight: 500;
	padding: 0.5rem 1.5rem;
	font-size: 1rem;
	border-radius: 2rem;
	display: flex;
	gap: 0.5rem;
	align-items: center;
	cursor: pointer;
	width: 100%;
	justify-content: center;
	&:hover {
		transition: background-color 0.3s ease 0.2s;
		background-color: ${palette.orange};
	}
`
const Image = styled.img`
	width: 100%;
	cursor: pointer;
	/* height: 3.809rem; */
`

const CustomText = styled(Text)`
	color: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.red)};
`
const Profile = styled.div<any>`
	height: 2.5rem;
	width: 2.5rem;
	border-radius: 100%;
	// overflow: hidden;
	/* background: ${palette.Btn_dark_green}; */
	background: ${({ styledColor }) => (styledColor ? `${styledColor} !important` : palette.Btn_dark_green)};
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	position: relative;
`
const ArrowAvatar = styled.div`
	vertical-align: middle;
	width: 2.188rem;
	height: 2.188rem;
	border-radius: 50%;
	border: 0.063rem solid ${palette.text_description};
	display: flex;
	justify-content: center;
	color: ${palette.text_description} !important;
	align-items: center;
	cursor: pointer;

	&:hover {
		color: ${palette.orange};
		border: 0.063rem solid ${palette.orange};
	}
`
const AdsImg = styled.img`
	color: ${palette.text_description};
	border-radius: 16px;
	margin-bottom: 0.625rem;
	height: 200px;
	width: 100%;
	object-fit: cover;
`
export default Community
