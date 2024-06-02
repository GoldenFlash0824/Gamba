import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { media } from 'styled-bootstrap-grid'
import { palette } from '../../styled/colors'
import { Flexed, Text } from '../../styled/shared'
import { useLocation, useNavigate } from 'react-router-dom'


const AuthSideCover = () => {
	const { pathname } = useLocation()
	let _navigate = useNavigate()

	return (
		<ImageWrapper>
			<Overlay />
			<LogoSection direction='row' align='center'>
				<Flexed direction='row' align='center' gap={3.125}>
					<Logo src='/images/gamba_logo_white.svg' alt='gamba_logo_white' onClick={() => { _navigate('/products') }} />
					<Flexed direction='row' align='center' gap={1.25}>
						<Text color='white' type='normal' fontWeight={500}>Grow</Text>
						<Dots />
						<Text color='white' type='normal' fontWeight={500}>Sell</Text>
						<Dots />
						<Text color='white' type='normal' fontWeight={500}>Share</Text>
						<Dots />
						<Text color='white' type='normal' fontWeight={500}>Trade</Text>
					</Flexed>
				</Flexed>
			</LogoSection>
			<ImageOverlayText direction='row' align='center'>
				<GambaText lineHeight='150%' color='white' fontWeight={700}>Welcome,  Gamba connects you with local growers and fresh sustainable products.</GambaText>
			</ImageOverlayText>
			<CoverImg signUp={pathname === '/sign-up'} src="/images/auth_side_img.png" />
		</ImageWrapper>
	)
}

const ImageWrapper = styled.div`
	position:relative;
	@media screen and (max-width: 1119px)  {
		display:none;
	}
`

const Overlay = styled.div<any>`
	background: ${palette.black};
	position: absolute;
	top:0;
	bottom:0;
	margin-auto;
	width: 100%;
	opacity: 0.75;
`

const Logo = styled.img<any>`
	cursor:pointer;
`

const ImageOverlayText = styled(Flexed) <any>`
	position: absolute;
	top:0;
	bottom:0;
	margin:auto;
	width: 100%;
    padding : 0% 12%;
	& div{
		max-width: 567px;
	}
`

const LogoSection = styled(Flexed)`
		position: absolute;
		left:0;
		right:0;
		margin:auto;
		width: 100%;
        padding: 0% 12%;
        padding-top: 3.5rem;
		z-index:1;
`;

const CoverImg = styled.img<any>`
	width: 100%;
	height: ${({ signUp }) => (signUp ? '100%' : '100vh')};
	object-fit: cover;
`

const Dots = styled.div`
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 100%;
	background: ${palette.white};
	opacity: 0.5;
`

const GambaText = styled(Text)`
	font-size:2rem;
	${media.xl`font-size:2.5rem`};
`

export default AuthSideCover