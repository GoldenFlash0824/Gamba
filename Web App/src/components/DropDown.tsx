import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { AiFillCaretDown } from 'react-icons/ai'
import { Text } from '../styled/shared'

const DropDown: any = ({ firstSelected, setIsAllowToOrderModalOpen, modal, label, subLable, options, name, hasChanged, error, required, errorMsg, disabled, width, style }) => {
	const myRef = useRef<any>()

	const [isOpen, setIsOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(firstSelected)

	useEffect(() => {
		setSelectedOption(firstSelected)
	}, [firstSelected])

	DropDown['handleClickOutside_' + name] = () => {
		setIsOpen(false)
	}

	const toggling = () => {
		if (options?.length > 0) {
			setIsOpen(!isOpen)
		}
	}

	const onOptionClicked = (option: any) => () => {
		setSelectedOption(option.label)
		hasChanged(option.value)
		setIsOpen(false)
	}

	const handleClickOutside = (e: any) => {
		if (!myRef.current.contains(e.target)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	})

	return (
		<>
			{label && (
				<LabelWrapper>
					<Label type="normal" style={{ fontWeight: style && '500' }} color="black" fontWeight={700} margin="0rem 0rem 0.25rem 0rem">
						{label}{' '}
						{modal && (
							<span
								onClick={() => {
									setIsAllowToOrderModalOpen(true)
								}}>
								[!]
							</span>
						)}
						{required ? <Mandatory>*</Mandatory> : ''}
					</Label>
				</LabelWrapper>
			)}
			<DropDownContainer ref={myRef} width={width} disabled={disabled || options?.length === 0} error={disabled || options?.length === 0 ? false : error}>
				<DropDownHeader disabled={disabled} onClick={() => toggling()}>
					{selectedOption || <DefaultValue>Select</DefaultValue>}{' '}
					<Icon id="icon"> {!isOpen ? <img src="/images/icons/drop_down_arrow.svg" alt="drop_down_arrow" /> : <ArrowUp src="/images/icons/drop_down_arrow.svg" alt="drop_down_arrow" />} </Icon>
				</DropDownHeader>
				{isOpen && (
					<DropDownListContainer disabled={disabled}>
						<DropDownList>
							{options?.map((option) => (
								<ListItem onClick={onOptionClicked(option)} key={Math.random()}>
									{option.label}
								</ListItem>
							))}
						</DropDownList>
					</DropDownListContainer>
				)}
			</DropDownContainer>
			{required && error && !disabled && (
				<Text fontSize={0.625} type="small" color="danger" textTransform="lowerCase">
					{errorMsg}
				</Text>
			)}
		</>
	)
}

const Label = styled(Text)`
	/* text-transform: capitalize; */
`

const Mandatory = styled.span`
	color: ${palette.danger};
	margin-left: 0.3rem;
`

const SubLable = styled.span`
	font-size: 1rem;
	line-height: 2rem;
	color: ${palette.text_color};
	font-family: 'Roboto';
	text-transform: capitalize;
`

const LabelWrapper = styled.div``

const DropDownContainer = styled('button') <any>`
	font-family: 'Lato-Regular', sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 500;
	text-align: left;
	font-size: 1rem;
	border-radius: 0.5rem;
	padding: 0.7rem 1.25rem;
	border: 1px solid ${({ error, disabled, isDarkTheme }) => (disabled ? `${palette.light_gray}` : error ? `${palette.danger}` : isDarkTheme ? `${palette.input_border}` : `${palette.stroke}`)};
	color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.text_black}` : `${palette.black}`)};
	background: ${({ disabled, bgTransparent, isDarkTheme }) => (bgTransparent ? '' : disabled ? `${palette.white}` : isDarkTheme ? `${palette.black}` : `${palette.white}`)};
	// cursor: ${({ disabled }) => (disabled ? `no-drop` : `pointer`)};
	/* background: ${({ disabled, bgTransparent, isDarkTheme }) => (bgTransparent ? 'transparent' : disabled ? `${palette.silver}` : isDarkTheme ? `${palette.black}` : `${palette.white}`)}; */

	// &:hover {
	// 	box-shadow: 0 0 0.31rem ${({ error, disabled }) => (disabled ? 'none' : error ? `${palette.danger}` : 'rgba(0, 0, 0, 0.25)')};
	// }
	&:focus {
		border: 1px solid ${({ error, disabled }) => (disabled ? 'none' : error ? palette.danger : palette.Btn_dark_green)};
	}
	&::placeholder {
		color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.black}`)};
		opacity: 0.5; /* Firefox */
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */

		color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.black}`)};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.black};
	}
`

const Icon = styled.i`
	color: ${palette.text_color};
	font-size: 0.7rem;
	margin-left: 1rem;
`

const DropDownHeader = styled('div') <any>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-family: 'Roboto';
	/* text-transform: capitalize; */
	color: ${({ disabled, isDarkTheme }) => (disabled ? `${palette.light_gray}` : isDarkTheme ? `${palette.text_black}` : `${palette.text_black}`)};
`
const DefaultValue = styled.span`
	opacity: 0.5;
`

const DropDownListContainer = styled('div') <any>`
	display: ${({ isdisabled }) => (isdisabled ? `none` : `block`)};
	position: absolute;
	left: 0;
	right: 0;
	top: 5.2rem;
	z-index: 99;
`

const DropDownList = styled('ul') <any>`
	font-family: 'Lato-Regular', sans-serif;
	
	line-height: 1.25rem;
	outline: none;
	margin: 0px 14px; 
	/* max-height: 10rem; */
	overflow-y: auto;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: 0.5rem;
	/* padding: 0.5rem 0.8rem; */
	border: 1px solid ${({ error, disabled, isDarkTheme }) => (disabled ? `${palette.light_gray}` : error ? `${palette.danger}` : isDarkTheme ? `${palette.input_border}` : `${palette.stroke}`)};
	color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.text_black}` : `${palette.text_black}`)};
	// cursor: ${({ disabled }) => (disabled ? `no-drop` : `pointer`)};
	background: ${({ disabled, bgTransparent, isDarkTheme }) => (bgTransparent ? 'transparent' : disabled ? `${palette.silver}` : isDarkTheme ? `${palette.black}` : `${palette.white}`)};

	// &:hover {
	// 	box-shadow: 0 0 0.31rem ${({ error, disabled }) => (disabled ? 'none' : error ? `${palette.danger}` : 'rgba(0, 0, 0, 0.25)')};
	// }
	&:focus {
		border: 1px solid ${({ error, disabled }) => (disabled ? 'none' : error ? palette.danger : palette.Btn_dark_green)};
	}
	&::placeholder {
		color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.black}`)};
		opacity: 0.5; /* Firefox */
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.black}`)};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.black};
	}
`

const ListItem = styled('li')`
	list-style: none;
	line-height: 2rem;
	white-space: nowrap;
	padding: 0.5rem 0.8rem;
	border-bottom: 1px solid ${palette.input_border};
	font-family: 'Roboto';
	text-transform: normal;
	color: ${palette.heading_color};
	&:hover {
		background: ${palette.Btn_dark_green};
		color: ${palette.white};
	}

	&:first-child {
		border-top-left-radius: 0.375rem;
		border-top-right-radius: 0.375rem;
	}
	&:last-child {
		border-bottom-left-radius: 0.375rem;
		border-bottom-right-radius: 0.375rem;
	}
	&:last-child {
		border-bottom: 0;
	}
`

const ArrowUp = styled.img`
	transform: rotate(180deg);
`

export default DropDown
