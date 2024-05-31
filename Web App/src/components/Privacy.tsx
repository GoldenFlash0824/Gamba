import React from 'react'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {Flexed, Spacer, Text} from '../styled/shared'
import {IoIosArrowForward} from 'react-icons/io'

const Privacy = ({setIsPrivacyOpen}) => {
	return (
		<>
			<Flexed direction="row" align="center" gap="0.5">
				<StyledHeading
					opacity
					type="normal"
					onClick={() => {
						setIsPrivacyOpen(false)
					}}>
					Home
				</StyledHeading>
				<IoIosArrowForward />
				<StyledHeading type="normal" color="text">
					Privacy
				</StyledHeading>
			</Flexed>

			<Spacer height={2} />
			<Wrapper>
				{/* <Text type="normal" color="text">
					Welcome to our online store for fresh vegetables and fruits! We offer a wide range of produce that is picked at the peak of ripeness and delivered straight to your doorstep. Our selection includes locally sourced, organic, and
					seasonal fruits and vegetables that are packed with nutrients, flavor, and color. We take great pride in our commitment to quality and freshness. Our team carefully selects each item, ensuring that only the best produce makes it
					into your basket.
				</Text>

				<ImageWrapper>
					<Img src="/images/growing_form.jpeg" alt="about" />
				</ImageWrapper> */}
			</Wrapper>
			<Spacer height={2} />
		</>
	)
}

const Wrapper = styled.div<any>`
	background-color: ${palette.white};
	padding: 1rem;
	box-shadow: ${palette.posts_shadow_1} 0px 8px 24px;
	border-radius: 0.5rem;
	transition: border 0.1s ease 0.1s;
	/* margin-bottom: 1.5rem; */
`

const ImageWrapper = styled.div`
	margin-top: 1rem;
	width: 100%;
`
const Img = styled.img`
	width: 100%;
`
const StyledHeading = styled(Text)<any>`
	position: relative;
	cursor: pointer;
	opacity: ${({opacity}) => (opacity ? '0.5' : '1')};
	/* color: ${({active}) => (active ? palette.Btn_dark_green : palette.text_black)}; */
`

export default Privacy
