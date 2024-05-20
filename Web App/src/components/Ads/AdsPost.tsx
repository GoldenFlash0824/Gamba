import {useEffect, useState} from 'react'
import {palette} from '../../styled/colors'
import styled from 'styled-components'
import {Text, Flexed} from '../../styled/shared'
import PostAction from '../productPost/PostAction'
import AdsProfile from './AdsProfile'
import AdsCarosel from './AdsCarosel'

const AdsPost = () => {
	const [readMore, setReadMore] = useState(false)

	const loop = [
		{
			name: 'Fruits , Apple',
			description: 'Red Apple',
			image: 'apples.webp'
		},
		{
			name: 'Vegetables',
			description: 'Red Apple',
			image: 'vegetables.jpeg'
		},
		{
			name: 'Fruits , Apple',
			description: 'Red Apple',
			image: 'apples.webp'
		},
		{
			name: 'Vegetables',
			description: 'Red Apple',
			image: 'vegetables.jpeg'
		}
	]
	return (
		<CardWrapper>
			{/* <CustomFlex direction="row" align="center" justify="space-between">
				<AdsProfile />
			</CustomFlex> */}

			<DiscriptionContent>
				<Discription type="small" showFullText={readMore}>
					Grow · Sell · Share · Trade
				</Discription>

				<SeeMore
					onClick={() => {
						setReadMore(!readMore)
					}}
					showFullText={readMore}
					type="small"
					color="gray"
					pointer></SeeMore>
			</DiscriptionContent>
			<AdsCarosel loop={loop} />

			{/* <PostAction /> */}
		</CardWrapper>
	)
}

const CardWrapper = styled.div<any>`
	background-color: ${palette.white};
	box-shadow: ${palette.posts_shadow_1} 0px 8px 24px;

	border-radius: 0.5rem;
	transition: border 0.1s ease 0.1s;
	margin-bottom: 1.5rem;
`

const CustomFlex = styled(Flexed)<any>`
	padding: 1rem 1rem 0.5rem 1rem;
`

const DiscriptionContent = styled(Text)`
	position: relative;
	padding: 1rem 1rem 0;
`

const Discription = styled(Text)<any>`
	color: ${palette.text_description};
	display: -webkit-box;
	-webkit-box-orient: vertical;
	white-space: pre-wrap;
	overflow: ${({showFullText}) => (showFullText ? '' : 'hidden')};
	-webkit-line-clamp: ${({showFullText}) => (showFullText ? '' : '3')};
`

const SeeMore = styled(Text)<any>`
	position: ${({showFullText}) => (showFullText ? '' : 'absolute')};
	bottom: 0;
	right: 0;
	background: ${palette.card_bg};
`

export default AdsPost
