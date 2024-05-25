import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { media } from 'styled-bootstrap-grid'
import { Text, Arrow, Flexed } from '../styled/shared'
import { palette } from '../styled/colors'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { saveSearchText } from '../actions/authActions'

const MainTabs = ({ setSellerId, setSelectedBtn, setSinglePost, setSingleEvent }: any) => {
	const _navigate = useNavigate()
	const _dispatch = useDispatch()
	const { pathname } = useLocation()
	const [scrollPosition, setScrollPosition] = useState(0)

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

	return (
		<MainWrapper className="d-flex justify-content-between mb-1 mt-3 mt-md-auto mb-md-auto">
			<Tab
				className="d-flex align-items-center justify-content-center justify-content-md-start"
				active={pathname === '/products' || pathname === '/products/sellers/'}
				direction="row"
				align="center"
				border
				gap={0.625}
				onClick={() => {
					setSelectedBtn('products')
					setSellerId('')
					_navigate('/products')
					_dispatch(saveSearchText(''))
				}}>
				<div>
					<SocialIcon active={pathname.includes('products')} src="/images/icons/home.svg" alt="home" />
				</div>
				<StyledText active={pathname.includes('products')} type="normal">
					Home
				</StyledText>
			</Tab>
			<Tab
				className="d-flex align-items-center justify-content-center justify-content-md-start "
				active={pathname === '/community'}
				direction="row"
				align="center"
				border
				gap={0.625}
				onClick={() => {
					setSelectedBtn('social')
					setSellerId('')
					setSinglePost(null)
					_navigate('/community')
					_dispatch(saveSearchText(''))
				}}>
				<div>
					<SocialIcon active={pathname.includes('community')} src="/images/icons/sellers.svg" alt="product" />
				</div>
				<StyledText active={pathname.includes('community')} type="normal">
					Community
				</StyledText>
			</Tab>
			<Tab
				className="d-flex align-items-center justify-content-center justify-content-md-start"
				active={pathname === '/calendar' || pathname.includes('/calendar')}
				direction="row"
				align="center"
				gap={0.625}
				onClick={() => {
					setSelectedBtn('calendar')
					setSingleEvent(null)
					_navigate('/calendar')
					_dispatch(saveSearchText(''))
				}}>
				<div>
					<SocialIcon active={pathname === '/calendar' || pathname.includes('/calendar')} src="/images/icons/calendar.svg" alt="calendar" />
				</div>
				<StyledText active={pathname === '/calendar' || pathname.includes('/calendar')} type="normal">
					Calendar
				</StyledText>
			</Tab>
		</MainWrapper>
	)
}

const MainWrapper = styled(Flexed) <any>`
	flex-direction: row;
	${media.xs` padding: 0rem 0.3rem;`};
	${media.sm` justify-content: center; gap:0.25rem;`};
	${media.xl`
	flex-direction: column;
	justify-content: start;
	`};
`

const SocialIcon = styled.img<any>`
	filter: ${({ active }) => (active ? 'invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);' : '')};
`

export const MenuText = styled(Text) <any>`
	position: relative;
	color: ${({ active }) => (active ? '#0f1419' : palette.gray)};
	cursor: pointer;

	& ${Arrow} {
		color: ${({ scroll, path, isDarkTheme }) => (isDarkTheme ? `${palette.silver}` : scroll < 0 && path ? `${palette.text_black}` : `${palette.gray}`)};
	}

	&:hover ${Arrow} {
		transform: rotate(-180deg);
		color: ${palette.orange};
	}

	&:hover {
		// color: ${palette.green_200};
		// transition: color 0.1s ease 0.1s;
	}
`

const StyledText = styled(MenuText)`
	display: block;
	font-weight: ${({ active }) => (active ? 700 : 500)};
`

const Tab = styled(Flexed) <any>`
	display: flex;
	border-radius: 48px !important;
	padding: 0.5rem 1.25rem;
	@media only screen and (min-width: 1200px) {
		background-color: ${({ active }) => (active ? ` ${palette.white}` : `0.25rem solid transparent`)};
		box-shadow: ${({ active }) => (active ? '0 .125rem .25rem rgba(0,0,0,.075)!important;' : 'none')};
		// background-color: ${({ active }) => (active ? `${palette.green_200}` : `transparent`)};
		border-top-right-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
		&:hover {
			background-color: ${({ active }) => (active ? '#ffffff' : '#E7E7E8')} !important;
		}
	}

	@media screen and (min-width: 0px) and (max-width: 768px) {
		// border-bottom: ${({ active }) => (active ? `0.25rem solid ${palette.green_200}` : `0.25rem solid transparent`)};
		// border-bottom-left-radius: 0.25rem;
		// border-bottom-right-radius: 0.25rem;
		// &:hover {
		// 	border-bottom: 0.25rem solid ${palette.green_200};
		// }
		background-color: ${({ active }) => (active ? ` ${palette.white}` : `0.25rem solid transparent`)};
		box-shadow: ${({ active }) => (active ? '0 .125rem .25rem rgba(0,0,0,.075)!important;' : 'none')};
		height: 36px;
		padding: 0.5rem .75rem;
	}
	cursor: pointer;
	height: 50px;
	&:hover ${SocialIcon} {
		filter: #000000;
	}
	&:hover ${StyledText} {
		// color: ${palette.green_200};
		// font-weight: 700;
	}
`
export default MainTabs
