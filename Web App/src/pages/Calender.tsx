import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import 'react-calendar/dist/Calendar.css'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import { Flexed, Spacer, Text, RsponsiveSpacer, MiddleLayout } from '../styled/shared'
import { palette } from '../styled/colors'
import Events from '../components/events/Events'
import { getAllEventsApi, getUserEvents, searchEventsApi, searchMyEventsApi, getEventById } from '../apis/apis'
import { useDispatch } from 'react-redux'
import { saveRoute, saveSearchText, setIsLoading } from '../actions/authActions'
import CurrentActivities from '../components/CurrentActivities'
import AddPostModal from '../components/modals/AddPostModal'
import InputField from '../components/common/InputField'
import { Router, useLocation, useNavigate } from 'react-router-dom'
import { getPopularEvent } from '../apis/apis'
import { IoIosArrowForward } from 'react-icons/io'
import { useSelector } from 'react-redux'
import MapModal from '../components/modals/MapModal'
import PopularSellers from '../components/PopularSellers'
import MainTabs from '../components/MainTabs'
import useRouter from '../components/useRouterHook'
import LoginPopupModel from '../components/modals/LoginPopupModel'

const Calender = ({ setSelectedBtn, setSingleEvent, singleEvent, setUserId, setSellerId, singlePost, setSinglePost }: any) => {
	const _navigate = useNavigate()
	const { pathname, query }: any = useLocation()
	const router = useRouter()
	const _dispatch = useDispatch()

	const isUserLogIn = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [openEventModal, setOpenEventModal] = useState(false)
	const [selectCategory, setSelectCategory] = useState('AllEvents')
	const [allEvents, setAllEvents] = useState([])
	const [copyAllEventsData, setCopyAllEventsData] = useState([])
	const [myEvents, setMyEvents] = useState([])
	const [copyMyEventsData, setCopyMyEventsData] = useState([])
	const [isModalFooterOpen, setIsModalFooterOpen] = useState(true)
	const [select, setSelect] = useState('Sell')
	const [event, setEvent] = useState()
	const [isDataProgress, setIsDataProgress]: any = useState(true)
	const [allEventPageNo, setAllEventPageNo] = useState(1)
	const [loadMoreAllEvents, setLoadMoreAllEvents] = useState(false)
	const [myEventPageNo, setMyEventPageNo] = useState(1)
	const [loadMoreMyEvents, setLoadMoreMyEvents] = useState(false)
	const [scrollPosition, setScrollPosition] = useState(0)
	const [loginPopup, setLoginPopup] = useState(false)

	const searchQuery: any = useSelector<any>((state: any) => state.auth.topSearch)
	const currentRoute = useSelector<any>((state: any) => state.auth.currentRoute)

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

	useEffect(() => {
		if (currentRoute == '/calendar') {
			selectCategory == 'AllEvents' ? getAllEvents(allEventPageNo, true) : getMyEvents(myEventPageNo, true)
		}
	}, [currentRoute])

	useEffect(() => {
		if (router.query?.id) {
			getSlugEvent(router.query?.id)
		}
	}, [router.query?.id])

	useEffect(() => {
		if (!router.query?.id) {
			selectCategory == 'AllEvents' ? getAllEvents(allEventPageNo, true) : getMyEvents(myEventPageNo, true)
		}
	}, [selectCategory, router.query?.id])

	useEffect(() => {
		latestEvent()
	}, [])

	const getSlugEvent = async (id) => {
		if (id) {
			_dispatch(setIsLoading(true))
			const response = await getEventById(id)
			setSingleEvent(response)
			_dispatch(setIsLoading(false))
		}
	}

	const getAllEvents = async (page: any, loadData: boolean) => {
		_dispatch(setIsLoading(loadData))
		setIsDataProgress(loadData)
		const response = await getAllEventsApi(page)
		if (response.success === true) {
			let eventData = response?.data?.event
			if (page > 1) {
				eventData = allEvents.concat(eventData)
			}
			setSingleEvent(null)
			setAllEvents(eventData)
			setCopyAllEventsData(eventData)
			setLoadMoreAllEvents(response?.data?.event.length >= 15)
		}
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
		_dispatch(saveRoute(''))
	}

	const getMyEvents = async (page: any, loadData: boolean) => {
		_dispatch(setIsLoading(loadData))
		setIsDataProgress(loadData)
		const response = await getUserEvents(page)
		if (response.success === true) {
			let eventData = response?.data?.event
			if (page > 1) {
				eventData = myEvents.concat(eventData)
			}
			setMyEvents(eventData)
			setCopyMyEventsData(eventData)
			setLoadMoreMyEvents(response?.data?.event.length >= 15)
		}
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	useEffect(() => {
		let timer: any = null
		if (searchQuery) {
			if (searchQuery.trim().length >= 2 && pathname === '/calendar') {
				timer = setTimeout(async () => {
					if (selectCategory == 'AllEvents') {
						// setAllEvents([])
						_dispatch(setIsLoading(true))
						setIsDataProgress(true)
						const response = await searchEventsApi(1, searchQuery)
						setAllEvents(response.data?.event)
						_dispatch(setIsLoading(false))
						setIsDataProgress(false)
					} else {
						// setMyEvents([])
						_dispatch(setIsLoading(true))
						setIsDataProgress(true)
						const response = await searchMyEventsApi(1, searchQuery)
						setMyEvents(response.data.event)
						_dispatch(setIsLoading(false))
						setIsDataProgress(false)
					}
				}, 500)
			}
		} else {
			if (selectCategory == 'AllEvents' && searchQuery.trim().length === 0) {
				setAllEvents(copyAllEventsData)
			} else if (searchQuery.trim().length === 0) {
				setMyEvents(copyMyEventsData)
			}
		}
		return () => clearTimeout(timer)
	}, [searchQuery])

	const latestEvent = async () => {
		let response = await getPopularEvent()
		setEvent(response)
	}
	const handleItemClick = async (id: any) => {
		_dispatch(setIsLoading(true))
		setIsDataProgress(true)
		_navigate('')

		let response = await getEventById(id)
		if (response === undefined) {
			setSelectCategory('MyEvents')
			getMyEvents(myEventPageNo, true)
			latestEvent()
			setSingleEvent(null)
		} else {
			setSingleEvent(response)
		}
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	const loadMoreAllEventsData = () => {
		setAllEventPageNo(allEventPageNo + 1)
		getAllEvents(allEventPageNo + 1, true)
	}

	const loadMoreMyEventsData = () => {
		setMyEventPageNo(myEventPageNo + 1)
		getMyEvents(myEventPageNo + 1, true)
	}

	return (
		<Wrapper>
			<RsponsiveSpacer height={1.875} />
			<Main fluid>
				<Row justifyContent="center">
					<Col xxl={2.5} xl={3}>
						<Section>
							<MainTabs setSelectedBtn={setSelectedBtn} setSinglePost={setSinglePost} setSellerId={setSellerId} setSingleEvent={setSingleEvent} />
							<LgHide>
								<Divider />
								<CurrentActivities handleItemClick={handleItemClick} data={event} setSingleEvent={setSingleEvent} />
							</LgHide>
						</Section>
					</Col>
					<MiddleLayout xxl={7} xl={6} lg={10}>
						<Row alignItems="center">
							<Column>
								<StyledFlex gap="1" direction="row" alignItems="center">
									{/* {singleEvent !== null ? null : (
										<Search>
											<InputField type="search" value={searchQuery} placeholder="Search" handleChange={(e) => setSearchQueary(e)} />
										</Search>
									)} */}
									{singleEvent !== null ? null : (
										<Flexed gap={0.5} direction="row" align="center">
											<CustomHeading
												fontSize='0.875'
												type="normal"
												active={selectCategory === 'AllEvents'}
												onClick={() => {
													setSelectCategory('AllEvents')
													_dispatch(saveSearchText(''))
												}}>
												<SocialIcon active={selectCategory === 'AllEvents'} src="/images/icons/calendar.svg" alt="calender" />
												All Events
											</CustomHeading>
											<CustomHeading
												fontSize='0.875'
												type="normal"
												active={selectCategory === 'MyEvents'}
												onClick={() => {
													if (isUserLogIn) {
														setSelectCategory('MyEvents')
													} else {
														setLoginPopup(true)
													}
													_dispatch(saveSearchText(''))
												}}>
												<SocialIcon active={selectCategory === 'MyEvents'} src="/images/icons/account.svg" alt="profile" />
												My Events
											</CustomHeading>
										</Flexed>
									)}
								</StyledFlex>
							</Column>
						</Row>
						{singleEvent === null && <Spacer height={1} />}

						{singleEvent !== null ? (
							<>
								<Row>
									<Col>
										<Events
											setSellerId={setSellerId}
											data={singleEvent}
											setUserId={setUserId}
											onEdit={() => {
												handleItemClick(singleEvent?.id)
												latestEvent()
											}}
										/>
									</Col>
								</Row>
							</>
						) : (
							<>
								{selectCategory === 'AllEvents' && (
									<Row>
										{allEvents?.map((data, index) => (
											<Col>
												<Events
													setSellerId={setSellerId}
													data={data}
													index={index}
													allEvents={true}
													setUserId={setUserId}
													selectCategory={selectCategory}
													getAllEvents={() => {
														getAllEvents(allEventPageNo, true)
													}}
													setSingleEvent={setSingleEvent}
													onEdit={() => getAllEvents(allEventPageNo, true)}
												/>
											</Col>
										))}
										{searchQuery.trim().length === 0 && !isDataProgress && loadMoreAllEvents && (
											<Col>
												<Button onClick={() => loadMoreAllEventsData()}>Load More</Button>
												<Spacer height={1} />
											</Col>
										)}
										{allEvents?.length === 0 && (
											<Col>
												<Text type="small" margin="4rem 0rem" isCentered>
													{isDataProgress ? '' : 'No data found'}
												</Text>
											</Col>
										)}
									</Row>
								)}
								{selectCategory === 'MyEvents' && (
									<Row>
										{myEvents?.map((data, index) => {
											return (
												<Col>
													<Events setSellerId={setSellerId} setSingleEvent={setSingleEvent} setUserId={setUserId} data={data} index={index} selectCategory={selectCategory} onEdit={() => getMyEvents(myEventPageNo, true)} />
												</Col>
											)
										})}
										{searchQuery.trim().length === 0 && !isDataProgress && loadMoreMyEvents && (
											<Col>
												<Button onClick={() => loadMoreMyEventsData()}>Load More</Button>
												<Spacer height={1} />
											</Col>
										)}
										{myEvents?.length === 0 && (
											<Col>
												<Text type="small" margin="4rem 0rem" isCentered>
													{isDataProgress ? '' : 'No data found'}
												</Text>
											</Col>
										)}
									</Row>
								)}
							</>
						)}
					</MiddleLayout>
					<SideCol xxl={2.5} xl={3}>
						<WrapperSide>
							{singlePost === null ? (
								<>
									<PopularSellers direction="" setSellerId={setSellerId} setSelectCategory={setSelectCategory} setUserId={setUserId} social={true} />
									<Spacer height={1} />
								</>
							) : null}
						</WrapperSide>
					</SideCol>
				</Row>
			</Main>
			{openEventModal && (
				<AddPostModal
					setSelect={setSelect}
					setIsModalFooterOpen={setIsModalFooterOpen}
					isModalFooterOpen={isModalFooterOpen}
					select={select}
					onClose={() => {
						setOpenEventModal(false)
					}}
				/>
			)}

			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
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

const StyledFlex = styled(Flexed)`
	width: 100%;
`

const SideCol = styled(Col)`
	display: none;
	${media.xl`display:block;`}
`

const LgHide = styled.div`
	display: none;
	${media.xl`display:block;`}
`

const Section = styled.div`
	position: sticky;
	// top: 168.03px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
	${media.xl`
	top: 0px;
	// height: calc(100vh - 132.03px);
	// padding-right:1.875rem;
	border-bottom: none;
	
	margin-bottom: 0rem;
	`}
	::-webkit-scrollbar {
		display: none;
	}
`

const Wrapper = styled.div`
	// background: ${palette.white};
`

const SocialIcon = styled.img<any>`
	filter: ${({ active }) => (active ? 'invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);' : '')};
	width: 20px;
`

const CustomHeading = styled(Text) <any>`
	position: relative;
	padding: 0.344rem 1rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.625rem;
	white-space: nowrap;
	font-weight: ${({ active }) => (active ? 700 : 400)};
	background: ${({ active }) => (active ? palette.green_300 : palette.white)};
	text-align: center;
	border-radius: 1.25rem;
	color: ${({ active }) => (active ? palette.green_200 : palette.gray_400)};
	margin-bottom: 0.5rem;

	&:hover {
		color: ${palette.green_200};
		background: ${palette.green_300};
	}

	& ${SocialIcon} {
		width:18px;
		height: 18px;
	}
	&:hover ${SocialIcon} {
		filter: invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);
	}

`

const Column = styled(Col)`
	/* padding: 0; */
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

const WrapperSide = styled.div<any>`
	position: sticky;
	// top: 132.03px;
	top: 100px
	height: calc(100vh - 132.03px);
	overflow-y: auto;
	display: flex;

	flex-directo
	justify-content: ${({ scroll }) => (scroll > 750 ? 'flex-end' : 'space-between')};
	::-webkit-scrollbar {
		display: none !important;
	}
	>div {
		flex-direction: column;
	}
`
const Divider = styled.div`
	height: 1px;
	background: ${palette.stroke};
	margin: 1.875rem 0rem;
`
export default Calender
