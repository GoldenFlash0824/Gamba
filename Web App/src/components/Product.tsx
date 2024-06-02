import React, { useEffect, useState, Suspense } from 'react'
import styled from 'styled-components'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import { Flexed, Spacer, Text, MiddleLayout } from '../styled/shared'
import { palette } from '../styled/colors'
import InputField from './common/InputField'
import { getAllProductsApi, getAllUserPosts, getAllSellersApi, searchSellersApi, searchProductsApi, searchTradeApi, getSellerById, getProductById } from '../apis/apis'
import { useDispatch } from 'react-redux'
import { addFav, saveRoute, setIsLoading } from '../actions/authActions'
import ProductCategories from './productPost/ProductCategories'
import { useSelector } from 'react-redux'
import SellersCard from './sellers/SellersCard'
import SellerSelfProfile from './SellerSelfProfile'
import PopularSellers from './PopularSellers'
import { useLocation, useNavigate } from 'react-router-dom'
import ProductDetailsModal from './modals/ProductDetailsModal'
import MainCategorySideBar from './MainCategorySideBar'
import useRouter from './useRouterHook'
const StyledCard = React.lazy(() => import('./StyledCard'))
const ProductsCard = React.lazy(() => import('./ProductCard'))

const Product = ({ addToCart, setSellerId, sellerId, userId, setSelectedBtn, setUserId, setSinglePost, isContactUsOpen, setIsContactUsOpen, setIsAboutOpen, isAboutOpen, setSingleEvent }: any) => {
	const [selectCategory, setSelectCategory] = useState('products')
	const [isSellerSelfProfileOpen, setIsSellerSelfProfileOpen] = useState(false)
	const [posts, setPosts] = useState<any>([])
	const [filteredPosts, setFilteredPosts] = useState<any>([])
	const [copyPostsData, setCopyPostsData] = useState([])
	const _navigate = useNavigate()
	const router = useRouter()
	const organicProducts: any = useSelector<any>((state: any) => state.auth.organicProducts)
	const favProduct: any = useSelector<any>((state: any) => state.auth.favProduct)

	const [isSellerProfileLinkOpen, setIsSellerProfileLinkOpen] = useState(false)

	const [sellers, setSellers] = useState<any>([])
	const [filteredSellers, setFilteredSellers] = useState<any>([])
	const [copySellersData, setCopySellersData] = useState([])

	const auth_token = useSelector<any>((state: any) => state.auth.auth_token)
	const [selectedSeller, setSelectedSeller] = useState<any>({})
	const [searchTrade, setSearchTrade] = useState('')
	const [searchTradeWith, setSearchTradewith] = useState('')
	const [isDataProgress, setIsDataProgress]: any = useState(true)

	const currentRoute = useSelector<any>((state: any) => state.auth.currentRoute)
	const { pathname }: any = useLocation()

	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
	const [singleProduct, setSingleProduct]: any = useState([])

	const [productPageNo, setProductPageNo] = useState(1)
	const [loadMoreProduct, setLoadMoreProduct] = useState(false)
	const [postFlag, setPostFlag] = useState(false)
	const [sellerFlag, setSellerFlag] = useState(false)
	const _dispatch = useDispatch()
	const [sellerPageNo, setSellerPageNo] = useState(1)
	const [loadMoreSeller, setLoadMoreSeller] = useState(false)
	const searchProduct: any = useSelector<any>((state: any) => state.auth.topSearch)
	const searchAddress: any = useSelector<any>((state: any) => state.auth.searchAddress)
	const searchLat: any = useSelector<any>((state: any) => state.auth.searchLat)
	const searchLog: any = useSelector<any>((state: any) => state.auth.searchLog)
	const searchSeller: any = useSelector<any>((state: any) => state.auth.topSearch)

	useEffect(() => {
		if (currentRoute == '/products' && !router?.query?.id) {
			fetchData()
		}
	}, [currentRoute])

	useEffect(() => {
		if (router?.query?.id) {
			getSellerDataById(router?.query?.id)
		}
	}, [router?.query?.id])

	useEffect(() => {
		if (favProduct?.length && pathname == '/products' && !router?.query?.id) {
			getAllSellers(sellerPageNo, true)
		}
	}, [favProduct, userId])

	const fetchData = () => {
		setSearchTrade('')
		setSearchTradewith('')
		setPosts([])
		setFilteredPosts([])
		setCopyPostsData([])
		setSellers([])
		setFilteredSellers([])
		setCopySellersData([])
		setProductPageNo(1)
		setLoadMoreProduct(false)
		setSellerPageNo(1)
		setLoadMoreSeller(false)
		if (pathname === '/products') {
			selectCategory === 'sellers' ? getAllSellers(sellerPageNo, true) : getAllProducts(organicProducts, productPageNo, true)
		} else {
			slugNavigation()
		}
	}
	const getAllProducts = async (isToggle = false, productPageNo, loadData: boolean) => {
		_dispatch(setIsLoading(loadData))
		setIsDataProgress(loadData)
		let is_trade = 0
		let is_donation = 0
		let is_discount = 0
		is_trade = selectCategory === 'trade' ? 1 : 0
		is_donation = selectCategory === 'donation' ? 1 : 0
		is_discount = selectCategory === 'sale' ? 1 : 0
		const response = await getAllProductsApi(is_trade, is_discount, is_donation, isToggle, productPageNo)
		if (response.success === true) {
			let postData = response?.data
			if (productPageNo > 1) {
				postData = posts.concat(postData)
			}
			setPosts(postData)
			setFilteredPosts(postData)
			setCopyPostsData(postData)
			setLoadMoreProduct(response?.data?.length >= 15)
		}
		setUserId('')
		_dispatch(saveRoute(''))
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	const getAllUserAndPosts = async () => {
		_dispatch(setIsLoading(true))
		setIsDataProgress(true)

		const response = await getAllUserPosts(auth_token)
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	const getAllSellers = async (page: any, loadData: boolean) => {
		if (userId) {
			// alert(2)
			setSelectCategory('sellers')
			setIsSellerSelfProfileOpen(false)
			_dispatch(setIsLoading(true))
			setIsDataProgress(true)

			let response = await getSellerById(userId)
			setSelectedSeller(response.data.allSellers)
			_dispatch(setIsLoading(false))
			setIsDataProgress(false)

			setIsSellerSelfProfileOpen(true)
			_dispatch(addFav(0))
			_dispatch(saveRoute(''))
		} else {
			// setSellers([])
			_dispatch(setIsLoading(loadData))
			setIsDataProgress(loadData)
			const response = await getAllSellersApi(organicProducts, page)
			if (response?.success === true) {
				let sellerData = response?.data?.data?.allSellers
				if (page > 1) {
					sellerData = sellers.concat(sellerData)
					const uniqueObjects = Object.values(
						sellerData.reduce((accumulator, obj) => {
							accumulator[obj.id] = obj
							return accumulator
						}, {})
					)
					sellerData = uniqueObjects
				}
				_dispatch(addFav(0))
				if (selectedSeller) {
					// selectedSeller
					let sellers = sellerData?.find((e): any => e.id == selectedSeller?.id)
					setSelectedSeller(sellers)
				}
				setUserId('')
				setSellers(sellerData)
				setFilteredSellers(sellerData)
				setCopySellersData(sellerData)
				setLoadMoreSeller(response?.data?.data?.allSellers.length >= 15)
			}
		}
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	const getSellerDataById = async (id) => {
		if (id) {
			const response: any = await getSellerById(id)
			setSelectedBtn('products')
			setIsSellerSelfProfileOpen(true)
			setIsSellerProfileLinkOpen(true)
			setSelectedSeller(response?.data?.allSellers)
			setSelectCategory('sellers')
		}
	}

	const deg2rad = (deg) => {
		return deg * (Math.PI / 180);
	}

	const getDistanceFromLatLonInMiles = (lat1, lon1, lat2, lon2) => {
		const R = 6371;
		const dLat = deg2rad(lat2 - lat1);
		const dLon = deg2rad(lon2 - lon1);
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distanceInKm = R * c;

		const distanceInMiles = distanceInKm * 0.621371;
		return distanceInMiles;
	}

	useEffect(() => {
		if (pathname.includes('/products/sellers/')) {
			slugNavigation()
		}
	}, [pathname])

	//search seller
	useEffect(() => {
		let timer: any = null
		if (searchSeller) {
			if (searchSeller.trim().length >= 2 && pathname == '/products') {
				timer = setTimeout(async () => {
					_dispatch(setIsLoading(true))
					setIsDataProgress(true)
					const response = await searchSellersApi(searchSeller)
					setSellers(response.data.data)
					setFilteredSellers(response.data.data)
					_dispatch(setIsLoading(false))
					setIsDataProgress(false)
				}, 500)
			}
		} else if (searchSeller?.trim()?.length === 0) {
			setSellers(copySellersData)
			setFilteredSellers(copySellersData)
		}

		return () => clearTimeout(timer)
	}, [searchSeller])

	//search product
	useEffect(() => {
		let timer: any = null
		if (searchProduct) {
			if (searchProduct.trim().length >= 2 && pathname == '/products') {
				timer = setTimeout(async () => {
					_dispatch(setIsLoading(true))
					setIsDataProgress(true)

					let is_trade = 0
					let is_donation = 0
					let is_discount = 0
					is_trade = selectCategory === 'trade' ? 1 : 0
					is_donation = selectCategory === 'donation' ? 1 : 0
					is_discount = selectCategory === 'sale' ? 1 : 0
					const response = await searchProductsApi(is_trade, is_discount, is_donation, searchProduct, organicProducts)
					if (response.data.length < 1) {
						setPostFlag(true)
					} else {
						setPostFlag(false)
					}
					setFilteredPosts(response.data)
					_dispatch(setIsLoading(false))
					setIsDataProgress(false)
				}, 500)
			}
		} else if (searchProduct?.trim()?.length === 0) {
			setFilteredPosts(copyPostsData)
		}

		return () => clearTimeout(timer)
	}, [searchProduct])

	useEffect(() => {
		if (selectCategory === 'sellers') {
			let filtered: any = []
			if (sellers.length > 0 && searchAddress !== null && searchLat !== null && searchLog !== null) {
				for (let i = 0; i < sellers.length; i++) {
					if (sellers[i]?.lat && sellers[i]?.log && sellers[i]?.lat?.toFixed(2) === searchLat?.toFixed(2) && sellers[i]?.log?.toFixed(2) === searchLog?.toFixed(2)) {
						filtered.push(sellers[i])
					}
				}
				if (filtered?.length > 0) {
					setSellerFlag(false)
					setFilteredSellers(filtered)
				} else {
					let minDistance = 1e308, index: any
					for (let i = 0; i < posts.length; i++) {
						if (filtered[i]?.lat && filtered[i]?.log) {
							const distance = getDistanceFromLatLonInMiles(filtered[i].lat, filtered[i].log, searchLat, searchLog)
							if (distance < minDistance) {
								minDistance = distance
								index = i
							}
						}
					}
					setSellerFlag(true)
					setFilteredSellers([sellers[index]])
				}
			} else {
				setFilteredSellers(sellers)
			}
		} else {
			let filtered: any = []
			if (posts.length > 0 && searchAddress !== null && searchLat !== null && searchLog !== null) {
				for (let i = 0; i < posts.length; i++) {
					if (posts[i]?.user?.lat && posts[i]?.user.log && posts[i]?.user?.lat?.toFixed(2) === searchLat?.toFixed(2) && posts[i]?.user?.log?.toFixed(2) === searchLog?.toFixed(2)) {
						filtered.push(posts[i])
					}
				}
				if (filtered?.length > 0) {
					setFilteredPosts(filtered)
					setPostFlag(false)
				} else {
					let minDistance = 1e308, index: any
					for (let i = 0; i < posts.length; i++) {
						if (posts[i]?.user?.lat && posts[i]?.user.log) {
							const distance = getDistanceFromLatLonInMiles(posts[i]?.user?.lat, posts[i]?.user?.log, searchLat, searchLog)
							if (distance < minDistance) {
								minDistance = distance
								index = i
							}
						}
					}
					setPostFlag(true)
					setFilteredPosts([posts[index]])
				}
			} else {
				setFilteredPosts(posts)
			}
		}
	}, [searchAddress])

	const slugNavigation = async () => {
		if (pathname.includes('/products/sellers/')) {
			_dispatch(setIsLoading(true))
			setIsDataProgress(true)

			setIsSellerProfileLinkOpen(true)
			const postIdExtraction = pathname?.split('/products')
			const id = postIdExtraction[postIdExtraction?.length - 1]

			if (id) {
				const response: any = await getSellerById(id)
				setSelectedBtn('products')
				setIsSellerSelfProfileOpen(true)
				setSelectedSeller(response?.data?.allSellers)
				setSelectCategory('sellers')
			} else {
				_dispatch(setIsLoading(true))
				setIsDataProgress(true)
				setSelectedBtn('products')
				setSellers([])
				setFilteredSellers([])
				const response = await getAllSellersApi(organicProducts)
				setSellers(response?.data?.data?.allSellers)
				setFilteredSellers(response?.data?.data?.allSellers)
				setSelectCategory('sellers')
				_dispatch(setIsLoading(false))
				setIsDataProgress(false)
			}

			_dispatch(setIsLoading(false))
			setIsDataProgress(false)

		} else {
			const postIdExtraction = pathname.split('/products')
			const id = postIdExtraction[postIdExtraction.length - 1]

			if (id) {
				setSelectedBtn('products')
				if (pathname.includes('/products/donation/')) {
					setSelectCategory('donation')
				} else if (pathname.includes('/products/sale/')) {
					setSelectCategory('sale')
				} else if (pathname.includes('/products/product/')) {
					setSelectCategory('products')
				} else if (pathname.includes('/products/trade/')) {
					setSelectCategory('trade')
				}
				const response = await getProductById(id)
				setSingleProduct(response)
				setIsDetailsModalOpen(true)
			}
		}
	}

	useEffect(() => {
		if (!router?.query?.id) {
			setSelectCategory(userId ? 'sellers' : 'products')
			getAllProducts(organicProducts, productPageNo, true)
			getAllSellers(sellerPageNo, true)
		}
	}, [])

	const searchTradeProd = async (value) => {
		setSearchTrade(value)
	}

	const searchTradeWithProd = async (value) => {
		setSearchTradewith(value)
	}

	useEffect(() => {
		let timer: any = null
		if (searchTrade || searchTradeWith) {
			if (searchTrade.trim().length >= 2 || searchTradeWith.trim().length >= 2) {
				timer = setTimeout(async () => {
					_dispatch(setIsLoading(true))
					setIsDataProgress(true)
					const response = await searchTradeApi(searchTrade, searchTradeWith, organicProducts)
					setFilteredPosts(response.data)
					setLoadMoreProduct(false)
					_dispatch(setIsLoading(false))
					setIsDataProgress(false)
				}, 500)
			}
		} else if (searchTrade.trim().length === 0 || searchTradeWith.trim().length === 0) {
			setFilteredPosts(copyPostsData)
			setLoadMoreProduct(copyPostsData.length >= 15)
		}

		return () => clearTimeout(timer)
	}, [searchTrade, searchTradeWith])

	useEffect(() => {
		if (!router?.query?.id) {
			fetchData()
		}
	}, [selectCategory, router?.query?.id, organicProducts])

	const loadMoreProductData = () => {
		setProductPageNo(productPageNo + 1)
		getAllProducts(organicProducts, productPageNo + 1, true)
	}

	const loadMoreSellerData = () => {
		setSellerPageNo(sellerPageNo + 1)
		getAllSellers(sellerPageNo + 1, true)
	}

	return (
		<Wrapper>
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
						/>
					</Col>

					<MiddleLayout xxl={7} xl={6} lg={10}>
						<ProductCategories
							getAllSellersApi={getAllSellersApi}
							getAllProducts={getAllProducts}
							isSellerProfileLinkOpen={isSellerProfileLinkOpen}
							setIsSellerProfileLinkOpen={setIsSellerProfileLinkOpen}
							setIsSellerSelfProfileOpen={setIsSellerSelfProfileOpen}
							setSelectCategory={setSelectCategory}
							selectCategory={selectCategory}
							getAllUserAndPosts={getAllUserAndPosts}
						/>
						{selectCategory === 'products' && (
							<>
								<Row mdJustifyContent="start" smJustifyContent="center">
									{postFlag === true && (
										<Col>
											<Text type="small" margin="1rem 0rem" isCentered>
												{isDataProgress ? '' : 'No activities in this neighborhood yet'}
											</Text>
										</Col>
									)}
									{filteredPosts?.map((content: any, index) => {
										return (
											<div className='col-md-6 mx-0 col-12 d-grid align-items-stretch'>
												<Suspense fallback={''}>
													{content?.discount > 0 ? (
														<StyledCard cardIndex={index} sale content={content} addToCart={addToCart} category={selectCategory} />
													)
														: content?.is_donation ? (
															<StyledCard cardIndex={index} donation content={content} addToCart={addToCart} category={selectCategory} />
														)
															: content?.is_trade ? (
																<ProductsCard cardIndex={index} trade content={content} addToCart={addToCart} category={selectCategory} />
															) : (
																<StyledCard cardIndex={index} content={content} addToCart={addToCart} report={true} />
															)}
												</Suspense>
											</div>
										)
									})}
									<Col>
										{!isDataProgress && loadMoreProduct && posts?.length ? (
											<>
												<Button onClick={() => loadMoreProductData()}>Load More</Button>
												<Spacer height={1} />
											</>
										) : (
											<></>
										)}
									</Col>
								</Row>
							</>
						)}
						{selectCategory === 'donation' && (
							<>
								<Row mdJustifyContent="start" smJustifyContent="center">
									{postFlag === true && (
										<Col>
											<Text type="small" margin="1rem 0rem" isCentered>
												{isDataProgress ? '' : 'No activities in this neighborhood yet'}
											</Text>
										</Col>
									)}
									{filteredPosts?.map((content, index) => {
										return (
											<Col lg={6} md={6} sm={8} className='d-grid align-items-stretch'>
												<Suspense fallback={''}>
													<StyledCard cardIndex={index} donation content={content} addToCart={addToCart} category={selectCategory} />
												</Suspense>
											</Col>
										)
									})}
									<Col>
										{searchProduct?.trim()?.length === 0 && !isDataProgress && loadMoreProduct && (
											<>
												<Button onClick={() => loadMoreProductData()}>Load More</Button>
												<Spacer height={1} />
											</>
										)}
									</Col>
								</Row>
							</>
						)}
						{selectCategory === 'sale' && (
							<>
								<Row mdJustifyContent="start" smJustifyContent="center">
									{postFlag === true && (
										<Col>
											<Text type="small" margin="1rem 0rem" isCentered>
												{isDataProgress ? '' : 'No activities in this neighborhood yet'}
											</Text>
										</Col>
									)}
									{filteredPosts?.map((content, index) => {
										return (
											<Col lg={6} md={6} sm={8} className='d-grid align-items-stretch'>
												<Suspense fallback={''}>
													<StyledCard cardIndex={index} sale content={content} addToCart={addToCart} category={selectCategory} />
												</Suspense>
											</Col>
										)
									})}
									<Col>
										{searchProduct?.trim()?.length === 0 && !isDataProgress && loadMoreProduct && (
											<>
												<Button onClick={() => loadMoreProductData()}>Load More</Button>
												<Spacer height={1} />
											</>
										)}
									</Col>
								</Row>
							</>
						)}
						{selectCategory === 'trade' && (
							<>
								<Row>
									<TradeBayCol lg={6} md={6} sm={6} xs={6}>
										<InputField bgTransparent handleChange={searchTradeProd} value={searchTrade} placeholder="Trade By" />
										<Spacer height={1} />
									</TradeBayCol>
									<TradeWithCol lg={6} md={6} sm={6} xs={6}>
										<InputField bgTransparent handleChange={searchTradeWithProd} value={searchTradeWith} placeholder="Trade With" />
										<Spacer height={1} />
									</TradeWithCol>
								</Row>
								{postFlag === true && (
									<Col>
										<Text type="small" margin="1rem 0rem" isCentered>
											{isDataProgress ? '' : 'No activities in this neighborhood yet'}
										</Text>
									</Col>
								)}
								<Row mdJustifyContent="start" smJustifyContent="center">
									{filteredPosts?.map((content, index) => {
										return (
											<Col xxl={6} xl={12} lg={6} md={6} sm={10} className='d-grid align-items-stretch'>
												<Suspense fallback={''}>
													<ProductsCard cardIndex={index} trade content={content} addToCart={addToCart} category={selectCategory} tradeCard={true} />
												</Suspense>
											</Col>
										)
									})}
									<Col>
										{searchProduct?.trim()?.length === 0 && !isDataProgress && loadMoreProduct && (
											<>
												<Button onClick={() => loadMoreProductData()}>Load More</Button>
												<Spacer height={1} />
											</>
										)}
									</Col>
								</Row>
							</>
						)}
						{selectCategory === 'sellers' && (
							<>
								{isSellerSelfProfileOpen ? (
									<SellerSelfProfile sellerId={sellerId} setIsSellerSelfProfileOpen={setIsSellerSelfProfileOpen} getAllSellers={getAllSellers} data={selectedSeller} addToCart={addToCart} />
								) : (
									<>
										{sellerFlag === true && (
											<Col>
												<Text type="small" margin="1rem 0rem" isCentered>
													{isDataProgress ? '' : 'No activities in this neighborhood yet'}
												</Text>
											</Col>
										)}
										{filteredSellers?.map((data: any, index) => {
											return (
												<>
													<SellersCard setSellerId={setSellerId} data={data} sellerCard={true} setSelectedSeller={setSelectedSeller} setIsSellerSelfProfileOpen={setIsSellerSelfProfileOpen} />
													<Spacer height={2} />
												</>
											)
										})}
										<Col>
											{searchSeller?.trim()?.length === 0 && !isDataProgress && loadMoreSeller && (
												<>
													<Button onClick={() => loadMoreSellerData()}>Load More</Button>
													<Spacer height={1} />
												</>
											)}
										</Col>
									</>
								)}
							</>
						)}
					</MiddleLayout>

					<SideCol xxl={2.5} xl={3}>
						<Section>
							<Flexed>
								<PopularSellers product={true} setSelectCategory={setSelectCategory} setUserId={setUserId} selectCategory={selectCategory} />
							</Flexed>
							<Spacer height={1} />
						</Section>
					</SideCol>
				</Row>
			</Main>
			{isDetailsModalOpen && (
				<ProductDetailsModal
					content={singleProduct}
					addToCart={addToCart}
					sale={singleProduct?.discount > 0 ? true : false}
					productPurchase={false}
					soldProducts={false}
					donation={singleProduct?.is_donation}
					onClose={() => {
						_navigate('/products')
						setIsDetailsModalOpen(false)
					}}
				/>
			)}
		</Wrapper>
	)
}

const Main = styled(Container)`
	padding-right: 0;
	padding-left: 0;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
`

const Wrapper = styled.div`
	background: #F0F2F5
`

const Section = styled.div<any>`
	position: sticky;
	// top: 132.03px;
	top : 100px;
	height: calc(100vh - 132.03px);
	overflow-y: auto;
	display: flex;

	flex-direction: column;
	// justify-content: ${({ scroll }) => (scroll > 750 ? 'flex-end' : 'space-between')};
	::-webkit-scrollbar {
		display: none !important;
	}
`

const SideCol = styled(Col)`
	display: none;
	${media.xl`display:block;`}
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
const TradeBayCol = styled(Col)`
	${media.xs`padding-right: 0.2rem;`}
`

const TradeWithCol = styled(Col)`
	${media.xs`padding-left: 0.2rem;`}
`
export default Product
