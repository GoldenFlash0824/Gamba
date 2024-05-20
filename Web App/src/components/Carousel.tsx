import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import OwlCarousel from 'react-owl-carousel'
import {useSelector} from 'react-redux'
import {palette} from '../styled/colors'
import Button from './common/Button'

const Carousel = ({SetIsSelected}: any) => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const [scrollPosition, setScrollPosition] = useState(0)

	const handleScroll = () => {
		const _position = window.pageYOffset
		setScrollPosition(_position)
	}
	useEffect(() => {
		window.addEventListener('scroll', handleScroll, {passive: true})
	}, [])

	const loop = [
		{
			image: '/images/bg_cover.jpg'
		},
		{
			image: '/images/bg_cover.jpg'
		},
		{
			image: '/images/bg_cover.jpg'
		}
	]

	return (
		<>
			<Section>
				<OverLay isDarkTheme={_isDarkTheme} />
				<OwlCarousel responsive={Responsive} nav={true} className="owl-carousel owl-theme">
					{loop.map((content, index) => {
						return <Img key={'carousel' + index} src={`${content.image}`} />
					})}
				</OwlCarousel>
				<ButtonWrapper>
					<Button
						label="product"
						type="light_green"
						ifClicked={() => {
							SetIsSelected('product')
						}}
					/>
					<Button
						label="community"
						type="orange"
						ifClicked={() => {
							SetIsSelected('community')
						}}
					/>
				</ButtonWrapper>

				<Logo scroll={scrollPosition}>
					<ImgLogo src="/images/gambaLogo.png" alt="logo" />
				</Logo>
			</Section>
		</>
	)
}
const Responsive = {
	0: {
		items: 1,
		margin: 5
	}
}

const Img = styled.img`
	width: 100%;
	height: ${({height}) => (height ? `${height}` : '100vh')};
`

const ImgLogo = styled.img`
	height: 7rem;
`

const Section = styled.div`
	position: relative;
`
const Logo = styled.div<any>`
	display: ${({scroll}) => (scroll > 190 ? 'none' : 'block')};
	position: absolute;
	top: 12vh;
	left: 10%;
	z-index: 9;
`

const ButtonWrapper = styled.div<any>`
	display: flex;
	align-items: center;
	gap: 1rem;
	position: absolute;
	top: 70vh;
	width: 100%;
	justify-content: center;
	right: ${({right}) => (right ? `${right}` : '')};
	left: ${({left}) => (left ? `${left}` : '')};
	z-index: 9;
`

const OverLay = styled.div<any>`
	background: ${({isDarkTheme}) => (isDarkTheme ? `${palette.main_cover_overlay_dark}` : `${palette.main_cover_overlay_light}`)};
	position: absolute;
	width: 100%;
	height: 100vh;
`

export default Carousel
