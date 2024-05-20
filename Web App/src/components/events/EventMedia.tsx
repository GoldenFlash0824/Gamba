import {useState} from 'react'
import Lightbox from 'react-image-lightbox'
import styled from 'styled-components'

const EventMedia = (data: any) => {
	const [lightBoxOpen, setLightBoxOpen] = useState(false)

	return (
		<Main>
			{data?.image ? (
				<Img
					src={`https://imagescontent.s3.us-east-1.amazonaws.com/${data.image}`}
					alt="img"
					onClick={() => {
						setLightBoxOpen(true)
						// setPhotoIndex(0)
					}}
				/>
			) : (
				<DefaultImg />
			)}
			{lightBoxOpen && <Lightbox mainSrc={`https://imagescontent.s3.us-east-1.amazonaws.com/${data.image}`} onCloseRequest={() => setLightBoxOpen(false)} />}
		</Main>
	)
}

const Img = styled.img<any>`
	background: #ebebeb;
	// height: 350px;
	width: 100%;
	object-fit: cover;

	background-image: no-repeat;

	background-color: #ebebeb;
`

const DefaultImg = styled.div`
	background: #ebebeb;
	height: 13.555rem;
	width: 100%;
`

const Main = styled.div`
	border-top-left-radius: 1.25rem;
	border-top-right-radius: 1.25rem;
	// height: 350px;
	overflow: hidden;
`

export default EventMedia
