import React, {useState} from 'react'
import styled from 'styled-components'
import {Flexed, Text} from '../../styled/shared'
import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import Lightbox from 'react-image-lightbox'
const SellersProducts = (content) => {
	const [lightBoxOpen, setLightBoxOpen] = useState(false)
	const [photoIndex, setPhotoIndex] = useState(0)
	return (
		<div>
			<OwlCarousel responsive={Responsive} nav={true} autoplay className="owl-carousel owl-theme">
				{/* // <OwlCarousel responsive={Responsive} autoplay autoplayTimeout={3000} loop className="owl-carousel owl-theme"> */}
				{content?.content?.map((content, index) => {
					return content?.images?.length ? (
						<Img
							key={'carousel' + index}
							src={`https://imagescontent.s3.us-east-1.amazonaws.com/${content.images[0]}`}
							onClick={() => {
								setLightBoxOpen(true)
								setPhotoIndex(index)
							}}
						/>
					) : (
						''
					)
				})}
			</OwlCarousel>
			{lightBoxOpen && (
				<Lightbox
					mainSrc={content?.images?.length ? `https://imagescontent.s3.us-east-1.amazonaws.com/${content?.images[photoIndex]}` : ''}
					nextSrc={content?.images?.length > 1 ? content?.images[(photoIndex + 1) % content?.images?.length] : false}
					prevSrc={content?.images?.length > 1 ? content?.images[(photoIndex + content?.images?.length - 1) % content?.images?.length] : false}
					onCloseRequest={() => setLightBoxOpen(false)}
					onMovePrevRequest={() => setPhotoIndex((photoIndex + content?.images?.length - 1) % content?.images?.length)}
					onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % content?.images?.length)}
				/>
			)}
			
		</div>
	)
}

const Img = styled.img<any>`
	object-fit: cover;
	width: 200px;
	height: 200px;
	border-radius: 1.25rem;
`

const Responsive = {
	0: {
		items: 1,
		margin: 20
	},
	600: {
		items: 2,
		margin: 20
	},
	992: {
		items: 2,
		// loop: false,
		margin: 20
	},
	1400: {
		items: 3,
		// loop: false,
		margin: 20
	}
}

export default SellersProducts
