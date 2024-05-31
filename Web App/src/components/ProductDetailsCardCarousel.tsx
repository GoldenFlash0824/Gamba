import React, {useState} from 'react'
import styled from 'styled-components'
import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import 'react-image-lightbox/style.css'
import {useLocation} from 'react-router-dom'
import Lightbox from 'react-image-lightbox'
const ProductDetailsCardCarousel = ({cardIndex, sale, commentsModal, data}: any) => {
	const {pathname} = useLocation()
	const [lightBoxOpen, setLightBoxOpen] = useState(false)
	const [photoIndex, setPhotoIndex] = useState(0)

	return (
		<Wrapper key={cardIndex} commentsModal={commentsModal}>
			<OwlCarousel responsive={Responsive} nav={true} className="owl-carousel owl-theme">
				{data.map((d, index) => {
					return d?.length ? (
						<Img
							pathname={pathname}
							onClick={() => {
								setLightBoxOpen(true)
								setPhotoIndex(index)
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
					nextSrc={data?.length > 1 ? data[(photoIndex + 1) % data?.length] : false}
					prevSrc={data?.length > 1 ? data[(photoIndex + data?.length - 1) % data?.length] : false}
					onCloseRequest={() => setLightBoxOpen(false)}
					onMovePrevRequest={() => setPhotoIndex((photoIndex + data?.length - 1) % data?.length)}
					onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % data?.length)}
				/>
			)}
		</Wrapper>
	)
}

const Img = styled.img<any>`
	object-fit: contain;
	width: 300px !important;
	height: 200px;
	min-width: auto;
	border-radius: 1rem;
	cursor: pointer;
	border-radius: 20px;
	object-fit: cover !important;
`

const Wrapper = styled.div<any>`
	width: 300px;
	height: 200px;
	border-radius: 20px;
`

const Responsive = {
	0: {
		items: 1,
		margin: 2
	},
	600: {
		items: 1,
		margin: 2
	},
	1000: {
		items: 1,
		// loop: false,
		margin: 2
	}
}

export default ProductDetailsCardCarousel
