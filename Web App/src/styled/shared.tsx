import styled from 'styled-components'
import { palette } from './colors'
import { FaAngleDown } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Col, media } from 'styled-bootstrap-grid'

interface DividerProps {
	isDarkTheme?: boolean
	margin?: string
	opacity?: any
}

interface IProps {
	scroll: number
	path?: boolean
	active?: boolean
	isDarkTheme?: boolean
	fontSize?: boolean
}

const handleHeadingFontSize = (level: any) => {
	switch (level) {
		case 1:
			return '2.5rem'
		case 2:
			return '2rem'
		case 3:
			return '1.625rem'
		case 4:
			return '1.375rem'
		case 5:
			return '1.125rem'
		default:
			return '1rem'
	}
}

// Heading Levels
//             fontSize
// level 1 40px || 2.5rem
// level 2 32px || 2.25rem
// level 3 26px || 1.625rem
// level 4 22px || 1.375rem
// level 5 18px || 1.125rem
// level 6 16px || 1rem

export const Heading = styled.div<any>`
	text-transform: ${({ textTransform }) => (textTransform ? textTransform : 'capitalize')};
	font-size: ${({ level, fontSize }) => (fontSize ? `${fontSize}rem` : handleHeadingFontSize(level))};
	font-family: 'Lato-Regular', sans-serif;
	line-height: ${({ level, lineHeight }) => lineHeight};
	color: ${({ color, isDarkTheme }) => (color ? palette[color] : isDarkTheme ? palette.white : palette.text_description)};
	backgroundColor: ${({ backgroundColor, isDarkTheme }) => (backgroundColor ? palette[backgroundColor] : isDarkTheme ? palette.white : palette.text_description)};
	margin: ${({ margin }) => `${margin}`};
	text-align: ${({ isCentered }) => (isCentered ? `center` : 'inherit')};
	font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 400)};
	cursor: ${({ pointer }) => (pointer ? `pointer` : '')};
	opacity: ${({ opacity }) => (opacity ? opacity : '1')};
	font-style: ${({ fontStyle }) => (fontStyle ? fontStyle : 'normal')};
`

const handleParagraphFontSize = (type: any) => {
	switch (type) {
		case 'large':
			return '1.25rem'
		case 'medium':
			return '1.125rem'
		case 'normal':
			return '1rem'
		case 'small':
			return '0.875rem'
		case 'xsmall':
			return '0.75rem'
		default:
			return '0.875rem'
	}
}

const handleParagraphLineHeight = (type: any) => {
	switch (type) {
		case 'large':
			return '1.688rem'
		case 'medium':
			return '1.563rem'
		case 'normal':
			return '1.5rem'
		case 'small':
			return '1.125rem'
		case 'xsmall':
			return '0.938rem'
		default:
			return '1.125rem'
	}
}

// Paragraph Levels
//             fontSize              LineHight
// large    20px || 1.25rem     .      27px || 1.688rem
// medium   18px || 1.125rem    .      25px || 1.563rem
// normal   16px || 1rem        .      24px || 1.5rem
// small    14px || 0.875rem    .      18px || 1.125rem
// xsmall    12px || 0.875rem    .      18px || 1.125rem

export const Text = styled.div<any>`
	font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : '400')};
	font-size: ${({ type, fontSize }) => (fontSize ? `${fontSize}rem` : handleParagraphFontSize(type))};
	font-family: 'Lato-Regular', sans-serif;
	line-height: ${({ type, lineHeight }) => (lineHeight ? `${lineHeight}rem` : handleParagraphLineHeight(type))};
	color: ${({ color, isDarkTheme }) => (color ? palette[color] : isDarkTheme ? palette.light_gray : palette.dark_gray)};
	margin: ${({ margin }) => `${margin}`};
	text-align: ${({ isCentered }) => (isCentered ? `center` : 'left')};
	cursor: ${({ pointer }) => (pointer ? `pointer` : '')};
	opacity: ${({ opacity }) => (opacity ? opacity : '1')};
	text-transform: ${({ textTransform }) => (textTransform ? textTransform : '')};
	text-decoration: ${({ textDecoration }) => textDecoration};
	text-underline-offset: ${({ textDecoration }) => (textDecoration ? '2.9px' : '')};
	white-space: ${({ whiteSpaces }) => whiteSpaces};
`

export const Divider = styled.div<DividerProps>`
	height: 1px;
	width: 100%;
	background: ${({ color }) => (color ? palette[color] : palette.gray)};
	margin: ${({ margin }) => `${margin}`};
	opacity: ${({ opacity }) => `${opacity}`};
`

export const Spacer = styled.div<any>`
	height: ${({ height }) => `${height}rem`};
`

export const RsponsiveSpacer = styled(Spacer)`
	display: none;
	${media.lg`display:block`};
`

export const MiddleLayout = styled(Col)`
	${media.xl`padding: 0px 15px;`};
	${media.xxl`padding: 0px 15px;`};
`

export const VerticalSpacer = styled.span<any>`
	width: ${({ width }) => `${width}rem`};
	display: inline-block;
`

export const Flexed = styled.div<any>`
	display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
	flex-direction: column;
	flex-direction: ${({ direction }) => direction};
	align-items: ${({ align }) => align};
	justify-content: ${({ justify }) => justify};
	margin: ${({ margin }) => `${margin}`};
	gap: ${({ gap }) => `${gap}rem`};
	cursor: ${({ pointer }) => (pointer ? `pointer` : '')};
	flex-wrap: ${({ flexWrap }) => `${flexWrap}`};
`

export const IconWrapper = styled.div<any>`
	padding: ${({ padding }) => `${padding}`};
	margin: ${({ margin }) => `${margin}`};
	width: ${({ width }) => `${width}rem`};
	height: ${({ height }) => `${height}rem`};
`

export const DropMenu = styled.span<any>`
	min-width: 10.5rem;
	color: ${({ isDarkTheme }) => (isDarkTheme ? palette.text_black : palette.text_black)};
	font-size: 0.875rem;
	font-weight: 400;
	padding: 0.625rem 1.563rem;
	text-decoration: none;
	display: block;
	background-color: ${palette.white};
	&:hover {
		color: ${palette.orange};
		background: ${palette.fbBg};
		transition: color 0.1s ease 0.1s;
	}
`

export const Arrow = styled(FaAngleDown) <any>`
	transition: transform 0.2s;
	transform: rotate(0deg);
`

export const MenuText = styled(Text) <IProps>`
	position: relative;
	color: ${palette.dark_gray};
	letter-spacing: 0.05em;
	font-weight: 600;
	font-size: ${({ fontSize }) => (fontSize ? fontSize : '1rem')};

	cursor: pointer;
	&:not(:last-child) {
		/* padding-right: 2.5rem; */
	}

	& ${Arrow} {
		color: ${({ scroll, path, isDarkTheme }) => (isDarkTheme ? `${palette.silver}` : scroll < 0 && path ? `${palette.text_black}` : `${palette.gray}`)};
	}

	&:hover ${Arrow} {
		transform: rotate(-180deg);
		color: ${palette.orange};
	}

	&:hover {
		color: ${palette.orange};
		transition: color 0.1s ease 0.1s;
	}
`

export const useWindowSize = () => {
	const [size, setSize] = useState([window.innerHeight, window.innerWidth])

	useEffect(() => {
		const handleResize = () => {
			setSize([window.innerHeight, window.innerWidth])
		}
		window.addEventListener('resize', handleResize)
	}, [])
	return size
}

export const getCurrentAddress = async (lat: any, lng: any) => {
	const res = await axios
		.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${parseFloat(lat)},${parseFloat(lng)}&sensor=true&key=`)
		.then((response) => {
			return response?.data?.results[6]?.formatted_address
		})
		.catch((error) => {
			return ''
		})

	return res
}
// const R = 6371 // Radius of the earth in miles
// export const getDistanceFromLatLonInMiles = async (lat1, lon1, lat2, lon2) => {
// 	let dLat = deg2rad(lat1 - lat2)
// 	let dLon = deg2rad(lon1 - lon2)
// 	let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
// 	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
// 	let d = R * c //km
// 	let m = d * 0.621371 //miles
// 	return m
// }

// function deg2rad(deg) {
// 	return deg * (Math.PI / 180)
// }

const R = 6371 // Radius of the earth in kilometers

export const getDistanceFromLatLonInMiles = async (lat1, lon1, lat2, lon2) => {
	const dLat = deg2rad(lat1 - lat2)
	const dLon = deg2rad(lon1 - lon2)
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	const distanceInKm = R * c

	// Convert distance to miles
	const distanceInMiles = distanceInKm * 0.621371
	// Determine the appropriate unit (miles or feet) based on the magnitude
	const distance = distanceInMiles < 0.1 ? `${(distanceInMiles * 5280).toFixed(2)} ft.` : `${distanceInMiles.toFixed(2)} miles.`

	return distance
}

function deg2rad(deg) {
	return deg * (Math.PI / 180)
}
