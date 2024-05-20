import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
import {AiFillCaretDown} from 'react-icons/ai'
import {Text} from '../../styled/shared'

const Select = ({firstSelected, margin, NoLineHeight, language, hasBorderRadius, borderNon, color, icon, transparent, label, height, options, name, hasChanged, error, disabled, width}:any) => {
	const myRef = useRef()

	const [isOpen, setIsOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(firstSelected)
 // @ts-ignore
	Select['handleClickOutside_' + name] = () => {
		setIsOpen(false)
	}

	const toggling = () => {
		if (options?.length > 0) {
			setIsOpen(!isOpen)
		}
	}

	const onOptionClicked = (option:any) => () => {
		setSelectedOption(option.label)
		hasChanged(option.value)
		setIsOpen(false)
	}

	const handleClickOutside = (e:any) => {
		 // @ts-ignore
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
			{/* {label && <Label type="medium" color="black" margin="0rem 0rem 0.19rem 0rem" >{label}</Label>} */}
			<SelectContainer
				ref={myRef}
				borderNon={borderNon}
				transparent={transparent}
				hasBorderRadius={hasBorderRadius}
				height={height}
				color={color}
				margin={margin}
				width={width}
				NoLineHeight={NoLineHeight}
				isdisabled={disabled || options?.length === 0}
				error={disabled || options?.length === 0 ? false : error}>
				<SelectHeader onClick={() => toggling()}>
					{selectedOption ||
						(language ? (
							<DefaultValue color={color}>
								AED
							</DefaultValue>
						) : (
							<DefaultValue color={color}>
								Sort by
							</DefaultValue>
						))}
					{icon ? <Icon> {!isOpen ? <IconDown src="/images/icons/aedarrow.svg" /> : <IconUp src="/images/icons/aedarrow.svg" />}</Icon> : <Icon id="icon"> {!isOpen ? <AiFillCaretDown /> : <ArrowUp />} </Icon>}
				</SelectHeader>
				{isOpen && (
					<SelectListContainer isdisabled={disabled}>
						{/* <PopInBottom friction={20}> */}
						<SelectList>
							{options?.map((option:any) => (
								<ListItem onClick={onOptionClicked(option)} key={Math.random()}>
									{option.label}
								</ListItem>
							))}
						</SelectList>
						{/* </PopInBottom> */}
					</SelectListContainer>
				)}
			</SelectContainer>
		</>
	)
}

const Label = styled(Text)`
	font-weight: 500;
	text-transform: capitalize;
`

const SelectContainer = styled('button')<any>`
	color: ${({isdisabled, color}) => (isdisabled ? `${palette.gray}` : color ? `${palette.white}` : `${palette.black}`)};
	border: ${({error, borderNon}) => (borderNon ? 'none' : error ? ` 1px solid ${palette.danger}` : ` 1px solid ${palette.silver}`)};
	background: ${({isdisabled, transparent}) => (isdisabled ? `#565656` : transparent ? ` ${palette.opacity.white}` : '#ffffff')};
	border-radius: ${({hasBorderRadius}) => (hasBorderRadius ? '0.25rem' : '')};
	padding: 0.5rem 0.8rem;
	height: ${({height}) => height};
	cursor: ${({isdisabled}) => (isdisabled ? `no-drop` : `pointer`)};
	position: relative;
	font-size: 0.875rem;
	margin: ${({margin}) => margin};
	width: ${({width}) => (width ? `${width}rem` : '100%')};
	line-height: ${({NoLineHeight}) => (NoLineHeight ? ' ' : '2rem')};
	// height:3.125rem;
	text-align: left;
	// &:hover {
	//     box - shadow: 0 0 0.31rem ${({error, isdisabled}) => (isdisabled ? 'none' : error ? `${palette.danger}` : 'rgba(0, 0, 0, 0.25)')};
	// }
	&:focus {
		border: ${({error, isdisabled, borderNon}) => (borderNon ? 'none' : isdisabled ? 'none' : error ? ` 1px solid ${palette.danger}` : `1px solid ${palette.blue}`)};
	}
	&:focus #icon {
		color: ${({isdisabled}) => (isdisabled ? `${palette.gray}` : `${palette.black}`)};
	}
`

const Icon = styled.i`
	color: ${palette.dark_gray};
	font-size: 0.7rem;
	margin-left: 1rem;
`

const SelectHeader = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-family: 'Roboto';
	text-transform: capitalize;
`
const DefaultValue = styled.span`
	color: ${({color}) => (color ? `${palette.white}` : `${palette.black}`)};
`

const SelectListContainer = styled('div')<any>`
	display: ${({isdisabled}) => (isdisabled ? `none` : `block`)};
	position: absolute;
	left: 0;
	right: 0;
	top: 3.3rem;
	z-index: 99;
`

const SelectList = styled('ul')`
	padding: 0;
	border-radius: 0.25rem;
	text-align: left;
	margin: 0;
	background: ${palette.white};
	// border: 1px solid ${palette.silver};
	box-sizing: border-box;
	color: ${palette.black};
	box-shadow: 0px 4px 8px rgb(0 0 0 / 15%);
	font-size: 0.875rem;
	line-height: 1.54rem;
	font-weight: 400;
	height: auto;
	max-height: 350px;
	overflow-y: auto;
	overflow-x: hidden;

	/* width */
	::-webkit-scrollbar {
		width: 0.5rem;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #eee;
		border-radius: 1rem;
		border: 0.01rem solid ${palette.silver};
		border-width: 0rem 0.1rem 0rem 0rem;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 1rem;
	}
	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`

const ListItem = styled('li')`
	list-style: none;
	line-height: 2rem;
	white-space: nowrap;
	padding: 0.5rem 0.8rem;
	font-family: 'Roboto';
	text-transform: capitalize;
	// border-bottom: 1px solid ${palette.silver};
	color: ${palette.dark_gray};
	&:hover {
		background: ${palette.gray};
	}
	&:last-child {
		border-bottom: 0;
	}
`

const ArrowUp = styled(AiFillCaretDown)`
	transform: rotate(180deg);
`
const IconDown = styled.img``

const IconUp = styled.img`
	transform: rotate(180deg);
`
export default Select
