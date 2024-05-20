import React, {useState} from 'react'
import {palette} from '../../styled/colors'
import styled from 'styled-components'
import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {Flexed, Text} from '../../styled/shared'
import Button from '../common/Button'
const AdsCarosel = ({loop}) => {
	const [lightBoxOpen, setLightBoxOpen] = useState(false)
	const [photoIndex, setPhotoIndex] = useState(0)
	const {pathname} = useLocation()
	const _navigate = useNavigate()

	return (
		<Wrapper>
			{/* <OwlCarousel responsive={Responsive} nav={true} autoplay autoplayTimeout={2000} className="owl-carousel owl-theme"> */}
			<OwlCarousel responsive={Responsive} nav={true} className="owl-carousel owl-theme">
				{loop?.map((ad: any, index: any) => {
					return (
						<StyledFlex key={index}>
							<Img
								pathname={pathname}
								onClick={() => {
									setLightBoxOpen(true)
									setPhotoIndex(index)
								}}
								key={'carousel' + index}
								src={`/images/${ad.image}`}
							/>
							<Section>
								<div>
									<Text color="text" type="normal">
										{ad?.name}
									</Text>
									<Text color="text_description" type="small">
										{ad?.description}
									</Text>
								</div>
								<a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
									<Button
										ifClicked={() => {
											// _navigate('https://www.google.com/')
										}}
										small
										label="Shop"
									/>
								</a>
							</Section>
						</StyledFlex>
					)
				})}
			</OwlCarousel>
		</Wrapper>
	)
}

const Img = styled.img<any>`
	object-fit: cover;
	border-radius: 1.25rem;
	height: ${({pathname}) => (pathname === '/profileposts' ? '18rem' : '18rem')};
	/* width: 40rem; */
	/* border-radius: 1rem; */
	cursor: pointer;
`
const StyledFlex = styled(Flexed)`
	border: 1px solid ${palette.input_border};
`

const Wrapper = styled.div`
	padding: 1rem 1rem 0.2rem 1rem;
`
const Section = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 0.5rem;
`

const Responsive = {
	0: {
		items: 1,
		margin: 10
	},
	540: {
		items: 2,
		margin: 10
	},
	1000: {
		items: 2,
		// loop: false,
		margin: 10
	}
}

export default AdsCarosel
