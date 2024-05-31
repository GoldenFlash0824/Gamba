//new ui
import React from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
// import { useSelector } from 'react-redux';

const Button = ({ifClicked, disabled, textTransformation, borderRadius, label, icon, type, stretchMobile, stretchWeb, hasShadow, hasBorder, medium, small, margin, width, tooltip, color, fontWeight, padding}: any) => {
	// const isDarkTheme = useSelector((state) => state.ui.isDarkTheme);

	return (
		<Btn
			type={type}
			color={color}
			hasLabel={label}
			disabled={disabled}
			onClick={ifClicked}
			medium={medium}
			small={small}
			hasBorder={hasBorder}
			borderRadius={borderRadius}
			margin={margin}
			width={width}
			stretchMobile={stretchMobile}
			stretchWeb={stretchWeb}
			textTransformation={textTransformation}
			fontWeight={fontWeight}
			padding={padding}
			hasShadow={hasShadow}>
			{icon && <Icon color={color} hasLabel={label} src={`/images/icons/${icon}`} />}
			{label}
		</Btn>
	)
}

const handleColorType = (type: any) => {
	switch (type) {
		case 'clear':
			return palette.dark_gray
		default:
			return palette.white
	}
}

const handleBackgroundType = (type: any) => {
	switch (type) {
		case 'clear':
			return palette.white
		case 'light_green':
			return palette.green_100
		case 'orange':
			return palette.orange
		case 'pending':
			return palette.Btn_dark_green
		case 'danger':
			return palette.danger
		default:
			return palette.Btn_dark_green
	}
}

const handleBorderColor = (type: any) => {
	switch (type) {
		case 'clear':
			return palette.silver
		case 'dark_grey_border':
			return palette.silver
		default:
			return palette.blue
	}
}

const handleHoverBackgroundType = (type: any) => {
	switch (type) {
		case 'clear':
			return palette.white
		case 'orange':
			return palette.green_100
			case 'primary':
			return palette.green
		case 'complete':
			return
		case 'pending':
			return palette.orange
		default:
			return palette.orange
	}
}

// Button Size
//             fontSize              		Hight
// Large	14px || 0.875rem	.		50px || 3.125rem
// Medium	14px || 0.875rem	.		40px || 2.5rem
// Small	12px || 0.75rem		.		32px || 2rem

const Btn = styled.button<any>`
	opacity: ${({disabled}) => (disabled ? '0.5' : '1')};
	text-transform: ${({textTransformation}) => (textTransformation ? textTransformation : 'capitalize')};
	display: inline-block;
	border-radius: 2rem;
	border: ${({hasBorder, type}) => (hasBorder ? `0.063rem solid ${handleBorderColor(type)}` : 'none')};
	border-radius: ${({borderRadius}) => (borderRadius ? `${borderRadius}` : '')};
	padding: ${({padding}) => `${padding ? padding : '0.65rem 2rem'}`};
	font-size: ${({small}) => (small ? '0.75rem' : '.925rem')};
	height: ${({small, medium}) => (small ? '2rem' : medium ? '2.5rem' : '2.75rem')};
	color: ${({hasBorder, type}) => (hasBorder ? palette[type] : handleColorType(type))};
	background: ${({type, hasBorder}) => (hasBorder ? `transparent` : `${handleBackgroundType(type)}`)};
	margin: ${({margin}) => `${margin}`};
	font-weight: ${({fontWeight}) => (fontWeight ? fontWeight : '700')};
	opacity: ${({type}) => (type === 'disable' ? '50%' : '')};
	cursor: ${({disabled}) => (disabled ? 'no-drop' : 'pointer')};
	min-width: 6rem;
	width: ${({width}) => (width ? width : 'min-content')};
	line-height: 32px;
	white-space: nowrap;
	align-items: center;
	position: relative;
	display: flex;
	justify-content: center;
	transition: all ease 0.25s;
	font-family: 'Lato-Bold', sans-serif;
	// &:hover {
	 //	background: ${({type, disabled}) => (disabled ? '' : `linear-gradient(180deg,${handleHoverBackgroundType(type)} 40%, ${handleHoverBackgroundType(type)} 100%)`)};
	//}
	// &:hover > div {
	// 	visibility: visible !important;
	// }

	&:hover {
		// transition: background-color 0.3s ease 0.2s;
		background-color: ${({type}) => (type ? handleHoverBackgroundType(type) : palette.orange)};
	}
`

const Icon = styled.img<any>`
	margin-right: ${({hasLabel}) => (hasLabel ? ` 0.5rem` : 'none')};
`

Btn.defaultProps = {
	type: 'primary',
	ifClicked: () => null
}

export default Button
