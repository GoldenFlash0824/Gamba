import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import { Link } from 'react-router-dom'
import { Text, Flexed, MenuText, MiddleLayout } from '../styled/shared'
import { palette } from '../styled/colors'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MobViewMenu from './MobViewMenu'
import Loader from './common/Loader'
import jwtDecode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { saveSearchAddress, saveSearchLat, saveSearchLog, saveSearchText, setUserId } from '../actions/authActions'
import { totalCount } from '../apis/apis'
import { colorPicker } from './utils'
import { Icons } from 'react-toastify'
import SubNavBar from './SubNavBar'

const TopNavBar = ({
	getUserProfile,
	setUserDetails,
	userDetails,
	cartRef,
	setSingleEvent,
	setIsAboutOpen,
	setSellerId,
	setIsContactUsOpen,
	setSinglePost,
	showStoriesCards,
	setSelectProfileSettingsCategory,
	selectProfileSettingsCategory,
	selectCategory,
	setSelectCategory,
	notifucationCount
}: any) => {
	const { pathname } = useLocation()
	const myRef: any = useRef<any>()
	const _navigate = useNavigate()
	const authToken = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const user = useSelector<any>((state: any) => state.auth.userDetails)
	const isLoading = useSelector<any>((state: any) => state.auth.isLoading)
	const [scrollPosition, setScrollPosition] = useState(0)
	const [navBarListOpen, setNavBarListOpen] = useState(false)
	const [isnotificationOpen, setIsNotificationOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const cart: any = useSelector<any>((state: any) => state.cart)
	const [allItemsCount, setAllItemsCount] = useState('')
	const _dispatch = useDispatch()

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

	const [color, setColor] = useState<any>('')

	useEffect(() => {
		if (userDetails) {
			getColor()
		}
	}, [userDetails])

	useEffect(() => {
		if (authToken) {
			getUserProfile()
		}
	}, [authToken])

	const getColor = async () => {
		if (userDetails?.first_name) {
			let color = await colorPicker(userDetails?.first_name[0].toLowerCase())
			setColor(color)
			return color
		}
	}

	useEffect(() => {
		if (authToken) {
			let idFromToken: any = jwtDecode(authToken)
			if (idFromToken?.payload?.id) {
				_dispatch(setUserId(idFromToken?.payload?.id))
			}
		}
	}, [])

	const getTotalCount = async () => {
		const res = await totalCount()
		setAllItemsCount(res)
		setIsMenuOpen(true)
	}

	return (
		<>
			<Wrapper fluid className='shadow-sm'>
				<div className='container'>
					<CustomRow className='d-flex justify-content-between align-items-center'>
						<Col xxl={2.5} xl={3} lg={2} md={3} sm={3} xs={3}>
							<Brand direction="row" align="center">
								<Link
									to="/"
									style={{ width: '8.988rem' }}
									onClick={() => {
										setSinglePost(null)
										setSellerId('')
										setIsContactUsOpen(false)
										setIsAboutOpen(false)
										setSingleEvent(null)
										_dispatch(saveSearchText(''))
										_dispatch(saveSearchLat(null))
										_dispatch(saveSearchLog(null))
										_dispatch(saveSearchAddress(''))
									}}>
									<CustomLogo src="/images/gambaLogo.png" alt="logo f" screenWidth={screenWidth} />
								</Link>
							</Brand>
						</Col>
						<MiddleLayout xxl={7} xl={6} lg={7} lgOrder={2} smOrder={3} xsOrder={3}>
							<SubNavBar />
						</MiddleLayout>
						<Col xxl={2.5} xl={3} lg={2} md={9} sm={9} xs={9} lgOrder={3} smOrder={2} xsOrder={2}>
							{authToken === null && (
								<ActionMenu direction="row" align="center" justify="flex-end">
									<>
										{pathname !== '/sign-in' && pathname !== '/sign-up' && pathname !== '/forgot-password' ? (
											<>
												<MenuList>
													<CustomText
														fontWeight={600}
														type="normal"
														onClick={() => {
															_navigate('/sign-up')
															_dispatch(saveSearchText(''))
															_dispatch(saveSearchLat(null))
															_dispatch(saveSearchLog(null))
															_dispatch(saveSearchAddress(''))
														}}>
														Sign Up
													</CustomText>
												</MenuList>
												<MenuList>
													<LoginButton
														onClick={() => {
															_navigate('/sign-in')
															_dispatch(saveSearchText(''))
															_dispatch(saveSearchLat(null))
															_dispatch(saveSearchLog(null))
															_dispatch(saveSearchAddress(''))
														}}>
														Log In
													</LoginButton>
												</MenuList>


											</>
										) : null}
									</>
								</ActionMenu>
							)}

							{authToken !== null && (
								<StyledFlex direction="row" align="center" justify="flex-end">
									<div
										onClick={() => {
											_navigate('/cart')
											_dispatch(saveSearchText(''))
											_dispatch(saveSearchLat(null))
											_dispatch(saveSearchLog(null))
											_dispatch(saveSearchAddress(''))
										}}>
										{cart?.products?.length > 0 ? (
											<div ref={cartRef}>
												<CartIcon className="cart-icon">
													<Icon margin="0rem 0rem 0.2rem 0rem" src="/images/icons/cart_bag.svg" alt="cart_bag" />
													<CartCount>{cart?.products?.length}</CartCount>
												</CartIcon>
											</div>
										) : (
											<div ref={cartRef}>
												<Icon margin="0rem 0rem 0.2rem 0rem" src="/images/icons/cart_bag_default.svg" alt="cart_bag" />
											</div>
										)}
									</div>

									<Icon
										src={notifucationCount > 0 ? '/images/icons/bell-notification.svg' : '/images/icons/bell-notification_default.svg'}
										alt="bell-notification"
										margin="0rem 0.625rem 0rem 0rem"
										onClick={() => {
											setSellerId('')
											_navigate('/notification')
											_dispatch(saveSearchText(''))
											_dispatch(saveSearchLat(null))
											_dispatch(saveSearchLog(null))
										}}
									/>

									<Icon onClick={() => _navigate('/chat')} src="/images/icons/message_default.svg" alt="message"></Icon>

									<div>
										<Profile
											styledColor={color}
											screenWidth={screenWidth}
											onClick={() => {
												setSellerId('')
												setSelectProfileSettingsCategory('personalInfo')
												_navigate('/settings')
												setSelectCategory('profile')
											}}>
											{userDetails?.image ? (
												<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${userDetails?.image}`} />
											) : (
												<Text color="white" type="large" fontSize="1">
													{userDetails?.first_name && userDetails?.first_name[0].toUpperCase()}
												</Text>
											)}
										</Profile>
									</div>
									<MobMenuIcons
										ref={myRef}
										onClick={() => {
											if (isMenuOpen) {
												setNavBarListOpen(false)
												setIsMenuOpen(false)
											} else {
												setNavBarListOpen(true)
												getTotalCount()
											}
											_dispatch(saveSearchText(''))
											_dispatch(saveSearchLat(null))
											_dispatch(saveSearchLog(null))
											_dispatch(saveSearchAddress(''))
										}}>
										<MenuText type="normal">
											<Icon src="/images/icons/bars.svg" alt="bars" />

											{isMenuOpen && (
												<MobViewMenu
													myRef={myRef}
													allItemsCount={allItemsCount}
													setUserDetails={setUserDetails}
													selectCategory={selectCategory}
													setSelectCategory={setSelectCategory}
													setSelectProfileSettingsCategory={setSelectProfileSettingsCategory}
													isnotificationOpen={isnotificationOpen}
													setIsMenuOpen={setIsMenuOpen}
													setNavBarListOpen={setNavBarListOpen}
													authToken={authToken}
												/>
											)}
										</MenuText>
									</MobMenuIcons>
								</StyledFlex>
							)}
						</Col>
					</CustomRow>
				</div>
			</Wrapper>

			{isLoading && <Loader visible={isLoading} />}
		</>
	)
}
const Wrapper = styled(Container)`
	padding-top: 0.875rem;
	padding-bottom: 0.875rem;
	background: ${palette.white};
	// background: #F0F2F5;
	padding-right: 0;
	padding-left: 0;
	${media.sm`
	 padding-right:1rem;
	 padding-left: 1rem;
	 `}
`

const CustomRow = styled(Row)`
	row-gap: 1rem;
	${media.sm`
	margin-right:0px;
	margin-left: 0px;`}
`

const LoginButton = styled.div`
	background-color: ${palette.green_200};
	color: ${palette.white};
	padding: 0.625rem 1.2rem;
	font-size: 1rem;
	border-radius: 2rem;
	font-family: 'Lato-Bold', sans-serif;
	height: 40px;
	display: flex;
	font-weight: 700;
	gap: 0.5rem;
	align-items: center;
	cursor: pointer;
	&:hover {
		/* opacity: 0.7; */
		transition: background-color 0.3s ease 0.2s;
		background-color: rgb(64, 115, 10);
	}
	${media.xs`
	padding: 0.6rem 1rem;
	 `};
	${media.sm`
	padding: 0.6rem 1rem;
	 `};
	${media.md`
	padding: 0.625rem 1.2rem;
	 `};
	${media.lg`
	padding: 0.625rem 1.2rem;
	 `}
`

const Img = styled.img`
	width: 20rem;
`
const Notification = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	background: ${palette.fbBg};
	border-radius: 100%;
	cursor: pointer;
`

const Brand = styled(Flexed)`
	height: 100%;
`
const StyledCircle = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	background: ${palette.fbBg};
	border-radius: 100%;
	cursor: pointer;
`

const MdHide = styled.div<any>`
	display: block;
	/* ${media.lg``} */
	@media screen and (min-width: 0px) and (max-width: 1200px) {
		display: none;
	}
`

const Icon = styled.img<any>`
	cursor: pointer;
	margin: ${({ margin }) => margin};
	${media.xs`
	width: 1.375rem;
	height: 2rem;
	 `};
	${media.sm`
	 width: 1.375rem;
	height: 2rem;
	 `};
	${media.md`
	 width: 1.5rem;
	height: 2.5rem;
	 `};
	${media.lg`
	 width: 1.5rem;
	height: 2.5rem;
	 `}
`

const StyledMenuText = styled(Text) <any>`
	position: relative;
	color: ${({ active }) => (active ? palette.Btn_dark_green : palette.text)};
	letter-spacing: 0.05em;
	font-size: ${({ fontSize }) => (fontSize ? fontSize : '1rem')};
	cursor: pointer;
	&:not(:last-child) {};
	&:hover {
		color: ${palette.orange};
		transition: color 0.1s ease 0.1s;
	}
`
const Profile = styled.div<any>`
	position: relative;
	width: 3.125rem;
	height: 3.125rem;
	border-radius: 100%;
	overflow: hidden;
	background: ${({ styledColor }) => (styledColor ? `${styledColor} !important` : palette.Btn_dark_green)};
	/* border: 0.125rem solid ${palette.Btn_dark_green}; */
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	& > img {
		width: ${({ screenWidth }) => (screenWidth < 500 ? '3rem' : '4rem')};
		height: ${({ screenWidth }) => (screenWidth < 500 ? '3rem' : '4rem')};
		border-radius: 3rem;
		object-fit: cover;
	}
	${media.xs`
	width: 2.125rem;
	height: 2.125rem;
	 `};
	${media.sm`
	width: 2.125rem;
	height: 2.125rem;
	 `};
	${media.md`
	width: 2.125rem;
	height: 2.125rem;
	 `};
	${media.lg`
	width: 2.125rem;
	height: 2.125rem;
	 `}
`

const StyledFlex = styled(Flexed)`
	gap: 0.56rem;
	@media screen and (min-width: 0px) and (max-width: 405px) {
		gap: 0.5rem;
	}
`

const CartIcon = styled.div`
	position: relative;
`

const CartCount = styled.div`
	position: absolute;
	background-color: ${palette.red};
	border: 1px solid ${palette.red};
	color: ${palette.white};
	letter-spacing: -1px;
	top: 11px;
	right: -3px;
	line-height: 0;
	width: 17px;
	height: 17px;
	border-radius: 100%;
	font-size: 10px;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
`

const UserGroupIcon = styled.img`
	width: 1.8rem;
	height: 1rem;
`
const CartIconImg = styled.img`
	height: 2rem;
	margin-bottom: 0.25rem;
`

const Circle = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.3rem;
	height: 1.3rem;
	top: -0.63rem;
	right: -0.1rem;
	border-radius: 100%;
	background-color: ${palette.red};
`

const CustomLogo = styled.img<any>`
	// width: 7.375rem;
	height: 2.8rem;
	position: relative;
	${media.xs`
	// width: 5.375rem;
	height: 2rem;
	 `};
	${media.sm`
	//  width: 7.375rem;
	height: 2rem;
	 `};
	${media.md`
	//  width: 9.375rem;
	height: 2.5rem;
	 `};
	${media.lg`
	//  width: 11.375rem;
	height: 2.5rem;
	 `}
`

const ActionMenu = styled(Flexed)`
	gap: 1rem;
	height: 100%;
`

const DropContent = styled.div<any>`
	display: ${({ display }) => (display ? 'block' : 'none')};
	position: absolute;
	top: 2rem;
	left: -1rem;
	padding: 1rem 0;
	background-color: ${({ isDarkTheme }) => (isDarkTheme ? palette.black : palette.white)};
	box-shadow: ${palette.shadow};
	z-index: 1;
	border-radius: 0.5rem;
	overflow: hidden;
`

const MenuList = styled.div<any>`
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}rem` : '1rem')};
	background-color: ${palette.white};
	gap: 0.5rem;
	&:hover ${DropContent} {
		display: block;
	}
`

const MobMenuIcons = styled.div`
	display: flex;
	cursor: pointer;
`

const CustomText = styled(Text)`
	color: ${palette.green_200};
	&:hover {
		color: ${palette.Btn_dark_green};
		text-decoration: underline;
		text-underline-offset: 3px
	}
`

export default TopNavBar
