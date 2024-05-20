import React, { useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import TopNavBar from './components/TopNavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import SignUp from './pages/SignUp'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { palette } from './styled/colors'
import useFlyImg from './hooks/useFlyImg'
import History from './pages/History'
import OrderDetails from './pages/OrderDetails'
import PlaceOrder from './pages/PlaceOrder'
import Cart from './pages/Cart'
import Map from './pages/Map'
import Calender from './pages/Calender'
import Notification from './pages/Notification'
import Products from './pages/Products'
import Social from './pages/Social'
import Settings from './pages/Settings'
import { Container, Row, Col } from 'styled-bootstrap-grid'
import SoldProducts from './components/settings/SoldProducts'
import ProductPurchase from './components/settings/ProductPurchase'
import ProfilePosts from './components/settings/ProfilePosts'
import MyEvents from './components/MyEvents'
import MyProducts from './components/MyProducts'
import { saveUser, setIsLoading } from './actions/authActions'
import { useDispatch } from 'react-redux'
import { addUsers, doGetUserProfile, getAllUserPosts } from './apis/apis'
import ProfileFavorites from './components/settings/ProfileFavorites'
import '@weavy/uikit-react/dist/css/weavy.css'
import WeavyChat from './components/WeavyChat'
import ResetForgotPssword from './pages/ResetForgotPssword'
import LegalPolicies from './pages/LegalPolicies'
import PrivacyPolicies from './pages/PrivacyPolicies'
import moment from 'moment-timezone'
import SellerAggrement from './pages/SellerAggrement'
import AboutUs from './pages/AboutUs'

const App = () => {
	const { pathname } = useLocation()
	const _navigate = useNavigate()
	const user = useSelector<any>((state: any) => state.auth.userDetails)
	const _dispatch = useDispatch()

	const [userId, setUserId]: any = useState('')
	const [selectProfileSettingsCategory, setSelectProfileSettingsCategory] = useState('personalInfo')

	const [isAboutOpen, setIsAboutOpen] = useState(false)
	const [isContactUsOpen, setIsContactUsOpen] = useState(false)

	const [singlePost, setSinglePost] = useState<any>(null)
	const [selectCategory, setSelectCategory] = useState('profile')
	const [showStories, setShowStories] = useState<any>(false)

	const [singleEvent, setSingleEvent]: any = useState(null)
	const [selectedBtn, setSelectedBtn] = useState('social')
	const [sellerId, setSellerId] = useState('')

	const [userDetails, setUserDetails]: any = useState('')
	const [notifucationCount, setNotificationCount]: any = useState(0)

	const cart = useRef()
	const flyImg = useFlyImg(cart)
	// const [count, setCount] = useState(0)

	const addToCart = (event: any) => {
		const targetParent = event.target.parentNode
		const img = targetParent.querySelector('img')
		const clone = img.cloneNode()
		targetParent.appendChild(clone)
		flyImg(clone, () => {
			// setCount((counter) => counter + 1)
		})
	}

	const getUserProfile = async () => {
		setUserDetails('')
		// alert(1)
		_dispatch(setIsLoading(true))
		const response = await doGetUserProfile()
		if (response?.data) {
			setUserDetails(response.data)
			_dispatch(saveUser(response.data))
		}

		_dispatch(setIsLoading(false))
	}

	const showStoriesCards = () => {
		if (pathname === '/' && singlePost === null) {
			setShowStories(!showStories)
		} else {
			setShowStories(true)
		}
		setSinglePost(null)
		_navigate('/')
	}

	const getAllNotificationCount = async () => {
		const response = await getAllUserPosts(1)
		if (response.success === true) {
			setNotificationCount(response?.data?.notification_count)
		}
	}

	useEffect(() => {
		// addUsers()
		// moment.tz.setDefault('America/New_York')
		getAllNotificationCount()
	}, [])

	useEffect(() => {
		if (user) {
			setUserDetails(user)
		}
	}, [user])

	return (
		<>
			{pathname !== '/sign-in' && pathname !== '/sign-up' && pathname !== '/forgot-password' && pathname !== '/reset_password' && (
				<CustomRow justifyContent="center" className=''>
					<TopNavBar
						setSellerId={setSellerId}
						setUserDetails={setUserDetails}
						userDetails={userDetails}
						getUserProfile={getUserProfile}
						setSingleEvent={setSingleEvent}
						setIsAboutOpen={setIsAboutOpen}
						isAboutOpen={isAboutOpen}
						setIsContactUsOpen={setIsContactUsOpen}
						cartRef={cart}
						setSinglePost={setSinglePost}
						showStoriesCards={showStoriesCards}
						selectCategory={selectCategory}
						setSelectCategory={setSelectCategory}
						setSelectProfileSettingsCategory={setSelectProfileSettingsCategory}
						selectProfileSettingsCategory={selectProfileSettingsCategory}
						notifucationCount={notifucationCount}
					/>
				</CustomRow>
			)}
			<Wrapper isAuth={pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password' || pathname == '/reset_password'}>


				<Row justifyContent="center">
					<CustomCol isAuth={pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password'}>
						<Main>
							<Routes>
								{/* <Route path="/" element={<Home addToCart={addToCart} />}></Route> */}
								<Route
									path="/products/*"
									element={
										<Products
											setSellerId={setSellerId}
											setSinglePost={setSinglePost}
											sellerId={sellerId}
											setIsContactUsOpen={setIsContactUsOpen}
											setIsAboutOpen={setIsAboutOpen}
											isAboutOpen={isAboutOpen}
											setSingleEvent={setSingleEvent}
											isContactUsOpen={isContactUsOpen}
											setSelectedBtn={setSelectedBtn}
											addToCart={addToCart}
											userId={userId}
											setUserId={setUserId}
										/>
									}></Route>
								<Route path="/reset_password/*" element={<ResetForgotPssword />}></Route>
								<Route path="/sign-in" element={<Login />}></Route>
								<Route path="/sign-up" element={<SignUp />}></Route>
								<Route path="/forgot-password" element={<ForgotPassword />}></Route>
								<Route path="/cart" element={<Cart />}></Route>
								<Route path="/place-order" element={<PlaceOrder />}></Route>
								<Route path="/map" element={<Map />}></Route>
								<Route path="/history" element={<History />}></Route>
								<Route path="/order-details" element={<OrderDetails />}></Route>
								<Route path="/legal-policies" element={<LegalPolicies />}></Route>
								<Route path="/privacy-policies" element={<PrivacyPolicies />}></Route>
								<Route path="/seller-aggrement" element={<SellerAggrement />}></Route>
								<Route path="/about-us" element={<AboutUs />}></Route>
								<Route
									path="/calendar/*"
									element={
										<Calender
											setSelectedBtn={setSelectedBtn}
											singleEvent={singleEvent}
											setSingleEvent={setSingleEvent}
											setUserId={setUserId}
											setSellerId={setSellerId}
											setSelectCategory={setSelectCategory}
											singlePost={singlePost}
											setSinglePost={setSinglePost}
										/>
									}></Route>
								<Route path="/notification" element={<Notification getAllNotificationCount={getAllNotificationCount} />}></Route>
								<Route path="/profileposts" element={<ProfilePosts setUserId={setUserId} />}></Route>
								{/* <Route path="/myevents" element={<MyEvents setUserId={setUserId} />}></Route>
							<Route path="/myproducts" element={<MyProducts addToCart={addToCart} />}></Route> */}
								<Route path="/myevents" element={<MyEvents setUserId={setUserId} />}></Route>
								<Route path="/myproducts" element={<MyProducts setUserId={setUserId} addToCart={addToCart} />}></Route>
								<Route path="/chat/*" element={<WeavyChat />}></Route>
								<Route
									path="/settings"
									element={
										<Settings
											getUserProfile={getUserProfile}
											setUserId={setUserId}
											selectCategory={selectCategory}
											setSelectCategory={setSelectCategory}
											addToCart={addToCart}
											setSelectProfileSettingsCategory={setSelectProfileSettingsCategory}
											selectProfileSettingsCategory={selectProfileSettingsCategory}
										/>
									}></Route>
								<Route path="/soldproducts" element={<SoldProducts addToCart={addToCart} />}></Route>
								<Route path="/productpurchase" element={<ProductPurchase addToCart={addToCart} />}></Route>
								<Route path="/my-network" element={<ProfileFavorites setSellerId={setSellerId} />}></Route>
								<Route
									path="/*"
									element={
										<Social
											setSellerId={setSellerId}
											sellerId={sellerId}
											setSelectCategory={setSelectCategory}
											setSinglePost={setSinglePost}
											singlePost={singlePost}
											showStories={showStories}
											setIsContactUsOpen={setIsContactUsOpen}
											isContactUsOpen={isContactUsOpen}
											setIsAboutOpen={setIsAboutOpen}
											isAboutOpen={isAboutOpen}
											setUserId={setUserId}
											setSelectedBtn={setSelectedBtn}
											setSingleEvent={setSingleEvent}
										/>
									}></Route>
							</Routes>
						</Main>
					</CustomCol>
				</Row>
				{/* {pathname !== '/sign-in' && pathname !== '/sign-up' && pathname !== '/settings' && <Footer />} */}

			</Wrapper>
		</>

	)
}

const CustomRow = styled(Row)`
	// background: ${palette.white};
	background: #F0F2F5;
	position: sticky;
	top: 0;
	z-index: 11;
	width: 100%;
	margin: auto;
`

const Wrapper = styled(Container) <any>`
	background-color: #F0F2F5;
	max-width: ${({ isAuth }) => (isAuth ? '100%' : '1280px')};
`

const CustomCol = styled(Col) <any>`
	padding-top: ${({ isAuth }) => (isAuth ? '0px' : 'auto')};
	padding-left: ${({ isAuth }) => (isAuth ? '0px' : 'auto')};
	padding-right: ${({ isAuth }) => (isAuth ? '0px' : 'auto')};
`

const Main = styled.div`
	background-color: #F0F2F5;
`

export default App
