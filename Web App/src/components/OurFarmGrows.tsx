import React from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Spacer, Text } from '../styled/shared'
import { IoIosArrowForward } from 'react-icons/io'

const OurFarmGrows = ({ setIsOurFarmOpen }) => {
	return (
		<>
			<Flexed direction="row" align="center" gap="0.5">
				<StyledHeading
					opacity
					type="normal"
					onClick={() => {
						setIsOurFarmOpen(false)
					}}>
					Home
				</StyledHeading>
				<IoIosArrowForward />
				<StyledHeading type="normal" color="text">
					Our farm grows
				</StyledHeading>
			</Flexed>

			<Spacer height={2} />
			<Wrapper>
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
const StyledHeading = styled(Text) <any>`
	position: relative;
	cursor: pointer;
	opacity: ${({ opacity }) => (opacity ? '0.5' : '1')};
	/* color: ${({ active }) => (active ? palette.Btn_dark_green : palette.text_black)}; */
`

export default OurFarmGrows
