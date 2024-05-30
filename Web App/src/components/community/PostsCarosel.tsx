import React, { useState } from 'react'
import { palette } from '../../styled/colors'
import styled from 'styled-components'
import OwlCarousel from 'react-owl-carousel'
import { media } from 'styled-bootstrap-grid'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { useLocation } from 'react-router-dom'

const PostsCarosel = ({ cardIndex, sale, commentsModal, data }: any) => {
	const [lightBoxOpen, setLightBoxOpen] = useState(false)
	const [photoIndex, setPhotoIndex] = useState(0)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const { pathname } = useLocation()

	return (
		<Wrapper id="postsCarosel" key={cardIndex} commentsModal={commentsModal}>
			{/* <OwlCarousel responsive={Responsive} nav={true} autoplay autoplayTimeout={2000} className="owl-carousel owl-theme"> */}
			<OwlCarousel responsive={Responsive} startPosition={selectedIndex} nav={true} lazyLoad={true} className="owl-carousel owl-theme">
				{data.map((d, index) => {
					return d?.length ? (
						<Img
							pathname={pathname}
							onClick={() => {
								setLightBoxOpen(true)
								setPhotoIndex(index)
								setSelectedIndex(index)
							}}
							key={'carousel' + index}
							src={`https://imagescontent.s3.us-east-1.amazonaws.com/${d}`}
						/>
					) : (
						''
					)
				})}
			</OwlCarousel>
			{lightBoxOpen && (
				<Lightbox
					mainSrc={`https://imagescontent.s3.us-east-1.amazonaws.com/${data[photoIndex]}`}
					nextSrc={data.length > 1 ? data[(photoIndex + 1) % data.length] : false}
					prevSrc={data.length > 1 ? data[(photoIndex + data.length - 1) % data.length] : false}
					onCloseRequest={() => setLightBoxOpen(false)}
					onMovePrevRequest={() => setPhotoIndex((photoIndex + data.length - 1) % data.length)}
					onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % data.length)}
				/>
			)}
		</Wrapper>
	)
}

const Img = styled.img<any>`
	// object-fit: cover;
	// border-radius: .25rem;
	cursor: pointer;
	max-width: 100% !important;
	width: auto !important;
	max-height: 18rem;
	${media.sm`max-height: 20rem;`};
	${media.md`max-height: 30rem;`};
`

const Wrapper = styled.div<any>`
	padding: ${({ commentsModal }) => (commentsModal ? '1.25rem 0rem' : '0')};
	width: 100%;
`

const Responsive = {
	0: {
		items: 1,
		margin: 10
	},
	540: {
		items: 1,
		margin: 10
	},
	1000: {
		items: 1,
		margin: 10
	}
}

export default PostsCarosel;