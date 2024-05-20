import React, {useState} from 'react'
import {palette} from '../../styled/colors'
import styled from 'styled-components'
import OwlCarousel from 'react-owl-carousel'
import {media} from 'styled-bootstrap-grid'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import {useLocation} from 'react-router-dom'

const PostsCarosel = ({cardIndex, sale, commentsModal, data}: any) => {
	const [lightBoxOpen, setLightBoxOpen] = useState(false)
	const [photoIndex, setPhotoIndex] = useState(0)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const {pathname} = useLocation()

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
	padding: ${({commentsModal}) => (commentsModal ? '1.25rem 0rem' : '0')};
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
		// loop: false,
		margin: 10
	}
}

export default PostsCarosel

// import React, { useState, useEffect } from 'react'
// import { palette } from '../../styled/colors'
// import styled from 'styled-components'
// import { Flexed } from '../../styled/shared'
// import Carosel from 'nuka-carousel'
// import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
// import OwlCarousel from 'react-owl-carousel'
// import 'owl.carousel/dist/assets/owl.carousel.css'
// import 'owl.carousel/dist/assets/owl.theme.default.css'
// import Lightbox from 'react-image-lightbox'
// import 'react-image-lightbox/style.css'
// import { useLocation } from 'react-router-dom'
// import { media } from 'styled-bootstrap-grid'
// import { MdKeyboardArrowLeft,MdKeyboardArrowRight } from "react-icons/md";

// const PostsCarosel = ({ cardIndex, sale, commentsModal, data }: any) => {
// 	const [lightBoxOpen, setLightBoxOpen] = useState(false)
// 	const [photoIndex, setPhotoIndex] = useState(0)
// 	const [selectedIndex, setSelectedIndex] = useState(0)
// 	const { pathname } = useLocation()

// 	const removeInertAttr = () => {
// 		let _targetNode: any = document.querySelector(`#carosel${cardIndex} div.slider-frame div.slide-current`)
// 		_targetNode?.removeAttribute('inert')
// 	}

// 	return (
// 		<>
// 		{data?.length &&
// 		<Wrapper id='postsCarosel' key={cardIndex} commentsModal={commentsModal}>
// 			<Main id={'carosel' + cardIndex} onMouseEnter={removeInertAttr}>
// 				<Carosel
// 					adaptiveHeight={true}
// 					renderCenterLeftControls={({ previousDisabled, previousSlide }) => (
// 						<ArrowIcon
// 							active={data?.length > 1}
// 							onClick={() => {
// 								previousSlide()
// 								setTimeout(removeInertAttr, 500)
// 							}}
// 							disabled={previousDisabled}>
// 							<MdKeyboardArrowLeft style={{ color: 'black' }} />
// 						</ArrowIcon>
// 					)}
// 					renderCenterRightControls={({ nextDisabled, nextSlide }) => (
// 						<ArrowIcon
// 							active={data?.length > 1}
// 							onClick={() => {
// 								nextSlide()
// 								setTimeout(removeInertAttr, 500)
// 							}}
// 							disabled={nextDisabled}>
// 							<MdKeyboardArrowRight style={{ color: 'black' }} />
// 						</ArrowIcon>
// 					)}>
// 					{data?.map((d, index) => {
// 						return d?.length ? (
// 								<ImgWrapper key={'carousel' + index} direction="row" align="center" justify="center">
// 									<Img  onClick={() => {
// 										setLightBoxOpen(true)
// 										setPhotoIndex(index)
// 										setSelectedIndex(index)
// 									}}
// 									src={`https://imagescontent.s3.us-east-1.amazonaws.com/${d}`} alt="img" />
// 								</ImgWrapper>
// 						) : (
// 								''
// 							)
// 						})}
// 				</Carosel>
// 			</Main>

// 			{lightBoxOpen && (
// 				<Lightbox
// 					mainSrc={`https://imagescontent.s3.us-east-1.amazonaws.com/${data[photoIndex]}`}
// 					nextSrc={data.length > 1 ? data[(photoIndex + 1) % data.length] : false}
// 					prevSrc={data.length > 1 ? data[(photoIndex + data.length - 1) % data.length] : false}
// 					onCloseRequest={() => setLightBoxOpen(false)}
// 					onMovePrevRequest={() => setPhotoIndex((photoIndex + data.length - 1) % data.length)}
// 					onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % data.length)}
// 				/>
// 			)}
// 		</Wrapper>
// 			}
// 			</>
// 	)
// }

// const Img = styled.img<any>`
// 	cursor: pointer;
// 	max-width: 100% !important;
// 	// width: 100% !important;
// 	border-radius: 1.25rem;
// 	max-height: 18rem;
// 	${media.sm`max-height: 20rem;`};
// 	${media.md`max-height: 30rem;`};
// `
// const ImgWrapper = styled(Flexed)`
// 	position: relative;
// 	height: auto;
// `

// const ArrowIcon = styled.button<any>`
// 	background-color: ${palette.white};
// 	margin: 0 0.5rem;
// 	opacity: 0.9;
// 	display: ${({ active }) => (active ? 'flex' : 'none')};
// 	justify-content: center;
// 	align-items: center;
// 	height: 1.8rem;
// 	width: 1.8rem;
// 	border: none;
// 	border-radius: 50%;
// 	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
// 	opacity: ${({ disabled }) => (disabled ? '0.3' : '1')};
// 	box-shadow: rgb(0 0 0 / 18%) 0px 5px 10px 0px !important;
// 	&:hover{
// 		background-color: #ff7d09;
// 	}

// `
// const Wrapper = styled.div<any>`
// 	padding: ${({ commentsModal }) => (commentsModal ? '1.25rem 0rem' : '0')};
// `

// const Main = styled.div`
// 	border-radius: 1.25rem;
// `

// export default PostsCarosel
