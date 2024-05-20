import React, { useEffect, useState } from 'react'
import { Flexed, Spacer, Text } from '../styled/shared'
import { media } from 'styled-bootstrap-grid'
import styled from 'styled-components'
import { getPostById } from '../apis/apis'
import { useDispatch, useSelector } from 'react-redux'
import { setIsLoading } from '../actions/authActions'
import { palette } from '../styled/colors'
import { AiFillYoutube } from 'react-icons/ai'
import { FaFacebookF } from 'react-icons/fa'
import { ImTwitter } from 'react-icons/im'
import { AiFillLinkedin } from 'react-icons/ai'
import { getPopularPost } from '../apis/apis'
import moment from 'moment-timezone'
import { colorPicker } from '../components/utils'
import { useLocation } from 'react-router-dom'
import MainTabs from '../components/MainTabs'
import { useNavigate } from 'react-router-dom'

const MainCategorySideBar = ({ sellerId, setSinglePost, isContactUsOpen, setIsContactUsOpen, setIsAboutOpen, isAboutOpen, setSelectedBtn, setSellerId, setSingleEvent, setSelectCategory }: any) => {
	let _navigate = useNavigate()
	const { pathname }: any = useLocation()
	const [topPost, setTopPost]: any = useState()
	const [color, setColor] = useState<any>('')
	const [scrollPosition, setScrollPosition] = useState(0)
	const [isDataProgress, setIsDataProgress]: any = useState(true)
	const currentRoute = useSelector<any>((state: any) => state.auth.currentRoute)
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

	const getTopPost = async () => {
		let response = await getPopularPost()
		console.log(response);
		setTopPost(response)
	}

	const getColor = async () => {
		// let color = await colorPicker(data?.first_name ? data?.first_name[0]?.toLowerCase() : 'n')
		setColor(color)
		return color
	}

	useEffect(() => {
		getTopPost()
	}, [currentRoute])

	const handleItemClick = async (id: any) => {
		_dispatch(setIsLoading(true))
		setIsDataProgress(true)

		let response = await getPostById(id)
		setSinglePost(response?.viewAllPosts)
		_navigate('/')
		setIsContactUsOpen(false)
		setIsAboutOpen(false)
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)
	}

	return (

		<StyledWrapper scroll={scrollPosition} position={isAboutOpen || isContactUsOpen}>
			<MdHide scroll={scrollPosition} isHome={pathname === '/'}>
				<MainTabs setSelectedBtn={setSelectedBtn} setSinglePost={setSinglePost} setSellerId={setSellerId} setSingleEvent={setSingleEvent} />
				<OnlyForWeb className="most-viewed mt-md-5  p-2">

					{topPost?.data?.length > 0 && (
						<Text type="normal" className="mb-3" color="black_100" fontWeight={700}>
							Most Viewed Posts
						</Text>
					)}
					{topPost?.data?.map((item: any, index: any) => (
						
						<List key={index} onClick={() => handleItemClick(item?.id)}>
							<li >
								<Flexed direction="row" align="center" gap={0.5} className='most-viewed-posts'>
									<div >
										<Profile>
											{item?.user?.image ? (
												<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${item?.user?.image}`} />
											) : (
												<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${item?.user?.first_name && item?.user?.first_name[0].toLowerCase() + '.png'}`} />
												// <CustomText styledColor={palette.white} type="normal">
												// 	{item?.user?.first_name && item?.user?.first_name[0].toUpperCase()}
												// </CustomText>
											)}
										</Profile>
									</div>
									<div>
									<Name color="black_100" type="normal" pointer lineHeight={1.5} fontWeight={500} textTransform="capitalize">
										<span>{item?.title}</span>
									</Name>
									
									<Name color="gray" type="normal"  fontSize={0.75} pointer lineHeight={1.2} fontWeight={500} >
										<em><span className='me-1 block'>by</span>
										<span>{item?.user.first_name } {item?.user.last_name }</span></em>
									</Name>
										</div>
										
								</Flexed>
							</li>
						</List>
						
					))}
				</OnlyForWeb>
			</MdHide>
			<FooterWrapper scroll={scrollPosition} isHome={pathname === '/'}>
				<Spacer height={2} />
				<Flexed flexWrap="wrap" gap={0.2} direction="row" align="center" justify="center">
					<div
						onClick={() => {
							setIsAboutOpen(!isAboutOpen)
						}}>
						<StyledText pointer fontSize={0.95} type="normal" color="text">
							About
						</StyledText>
					</div>
					<Text>|</Text>
					<a href="/seller-aggrement" target="_blank" rel="noopener noreferrer">
						<StyledText pointer fontSize={0.95} type="normal" color="text">
							Seller Aggrement
						</StyledText>
					</a>

					<a href="/about-us" target="_blank" rel="noopener noreferrer">
						<StyledText pointer fontSize={0.95} type="normal" color="text">
							About Us
						</StyledText>
					</a>

					<Text>|</Text>
					<div
						onClick={() => {
							setSelectCategory('support')
							_navigate('/settings')
						}}>
						<StyledText pointer fontSize={0.95} type="normal" color="text">
							Contact
						</StyledText>
					</div>
					<Text>|</Text>
					<a href="/legal-policies" target="_blank" rel="noopener noreferrer">
						<StyledText pointer fontSize={0.95} type="normal" color="text">
							Legal
						</StyledText>
					</a>
					<Text>|</Text>
					<a href="/privacy-policies" target="_blank" rel="noopener noreferrer">
						<StyledText pointer fontSize={0.95} type="normal" color="text">
							Privacy
						</StyledText>
					</a>
				</Flexed>
				<Spacer height={1} />
				<Content>
					<Image src="/images/gambaLogo.png" />
				</Content>
				<Spacer height={2} />

				<Flexed direction="row" gap={1}>
					<a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
						<ArrowAvatar className='footer-logo'>
							<FaFacebookF />
						</ArrowAvatar>
					</a>
					<a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
						<ArrowAvatar className='footer-logo'>
							<ImTwitter />
						</ArrowAvatar>
					</a>
					<a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
						<ArrowAvatar className='footer-logo'>
							<AiFillLinkedin />
						</ArrowAvatar>
					</a>
					<a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
						<ArrowAvatar className='footer-logo'>
							<AiFillYoutube />
						</ArrowAvatar>
					</a>
				</Flexed>
				<Spacer height={1} />

				<Flexed>
					<Text color="text" type="small">
						© Gamba | {moment().format('YYYY')}
					</Text>
				</Flexed>
				<Spacer height={0.7} />
			</FooterWrapper>
		</StyledWrapper>
	)
}
const MdHide = styled.div<any>`
	display: ${({ scroll, isHome }) => (scroll > 750 && isHome ? 'none' : 'block')};
`

const OnlyForWeb = styled.div<any>`
	display: none;
	${media.xl`display: block`};
`

const Name = styled(Text) <any>`
	text-overflow: ellipsis;
	overflow: hidden;
	 width: 10rem;
	height: 1.3rem;
	white-space: nowrap;
`
const FooterWrapper = styled.div<any>`
	display: none;
	@media only screen and (min-width: 1200px) {
		display: ${({ scroll, isHome }) => (scroll > 750 && isHome ? 'block' : 'none')};
	}
`

export const StyledWrapper = styled.div<any>`
	position: sticky;
	top: 168.03px;
	overflow-y: auto;
	display: flex;

	flex-direction: column;
	
	margin-bottom: 1rem;

	${media.xl`
	// top: 132.0px;
	top:100px;
	height: calc(100vh - 132.03px);
	// padding-right:1.875rem;
	border-bottom:none;
	// border-right: 1px solid rgb(233, 236, 239);
	margin-bottom: 0rem;
	`}
	justify-content: ${({ scroll }) => (scroll > 750 ? 'flex-end' : 'space-between')};
	::-webkit-scrollbar {
		display: none;
	}
`

const StyledText = styled(Text)`
	&:hover {
		color: ${palette.green_200};
		text-decoration: underline;
		text-underline-offset: 3px;
	}
`

const List = styled.ul`
	list-style: none;
	padding: 0px;
	margin-bottom: 0;

	& > li {
		// padding-bottom: 0.625rem;
		cursor: pointer;
		color: ${palette.text_description};
		&:hover {
			color: ${palette.orange};
			transition: color 0.1s ease-in-out;
		}
	}
`

const Divider = styled.div`
	height: 1px;
	background: ${palette.stroke};
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
	background: ${({ styledColor }) => (styledColor ? `${styledColor} !important` : '')};
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
		color: ${palette.green_200};
		border: 0.063rem solid ${palette.green_200};
	}
`
export default MainCategorySideBar
