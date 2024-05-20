import React from 'react'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {Flexed, Text} from '../styled/shared'

const ProductPurchasedCard = () => {
	return (
		<CardWrapper>
			<Flexed direction="row" align="center" justify="space-between">
				<Flexed direction="row" align="center" gap="1">
					<ImgWrapper>
						<Img src="/images/apples.webp" />
					</ImgWrapper>
					<Text type="normal">Apple</Text>
				</Flexed>
				<Text type="normal">9qt</Text>
				<Text type="normal">$0</Text>
			</Flexed>
			<Text type="normal">Total</Text>
		</CardWrapper>
	)
}

const CardWrapper = styled.div<any>`
	/* position: relative; */
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 11rem;
	background-color: ${palette.white};
	box-shadow: ${palette.posts_shadow_1} 0px 8px 24px;
	padding: 1rem 1rem 0.5rem 1rem;

	border: 0.063rem solid #f0f2f5;
	margin-bottom: 1rem;
	border-radius: 1.25rem;
`

const ImgWrapper = styled.div<any>`
	width: 5rem;
	height: 5rem;
`
const Img = styled.img<any>`
	width: 100%;
	height: 100%;
`

export default ProductPurchasedCard
