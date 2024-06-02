import React from 'react'
import {palette} from '../styled/colors'
import styled from 'styled-components'

const BgCover = ({pathname}: any) => {
	return (
		<Section>
			<Img src="/images/bg_cover4.png" alt="logo" />
		</Section>
	)
}

const Section = styled.div`
	padding-top: 4.3rem;
	position: relative;
	background-color: ${palette.white};
`

const Img = styled.img`
	object-fit: cover;
	width: 100%;
	cursor: pointer;
	height: 20rem;
`

export default BgCover
