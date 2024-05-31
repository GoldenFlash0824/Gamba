import React, {useEffect, useState} from 'react'
import {palette} from '../../styled/colors'
import styled from 'styled-components'
import {Text, Flexed} from '../../styled/shared'
import {FaShieldAlt} from 'react-icons/fa'
import {media} from 'styled-bootstrap-grid'

const PostReview = ({data}: any) => {
	const [reviews, setReviews] = useState(data?.reviews)
	const [rating, setRating] = useState<any>([])

	const showRating = () => {
		setRating([])
		for (var i = 0; i < data?.rating; i++) {
			setRating((pre: any) => {
				return [...pre, <Strawberry src="/images/strawberry.jpeg" />]
			})
		}
	}

	useEffect(() => {
		showRating()
	}, [data])

	return (
		<Flexed align="end">
			{/* <Flexed direction='row' gap='0.2' align='center' >
                <Review />
                <Text type='small' fontWeight='500'>{reviews}</Text>
            </Flexed> */}
			<Wrapper direction="row" gap="0.2" align="center">
				{rating}
			</Wrapper>
		</Flexed>
	)
}
const Wrapper = styled(Flexed)`
	gap: 0.5rem;
	${media.xs`gap: 0rem;`}
`

const Strawberry = styled.img<any>`
	color: ${palette.danger};
	width: 1.3rem;
	cursor: pointer;
`

const Review = styled(FaShieldAlt)<any>`
	color: ${palette.danger};
	font-size: 1.2rem;
	cursor: pointer;
`

export default PostReview
