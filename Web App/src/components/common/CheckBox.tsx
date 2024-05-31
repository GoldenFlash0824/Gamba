import React, {useEffect, useState} from 'react'
import {palette} from '../../styled/colors'
import styled from 'styled-components'
import {Flexed, Text} from '../../styled/shared'
import {BsCheckSquareFill} from 'react-icons/bs'
// import {ImCheckboxUnchecked} from 'react-icons/im'
import {ImCheckboxUnchecked} from 'react-icons/im'

const Checkbox = ({label, lineHeight, fontSize, fontWeight, opacity, textTransform, isChecked, setIsChecked}: any) => {
	return (
		<Flexed direction="row" align="flex-start" onClick={() => setIsChecked(!isChecked)}>
			<IconWrapper>{isChecked ? <Checked /> : <UnChecked />}</IconWrapper>

			{label && (
				<CustomText fontSize={fontSize} lineHeight={lineHeight} fontWeight={fontWeight} opacity={opacity} textTransform={textTransform}>
					{label}
				</CustomText>
			)}
		</Flexed>
	)
}

const CustomText = styled(Text)`
	padding-left: 0.6rem;
	color: ${palette.text_description};
	text-transform: ${({textTransform}) => (textTransform ? textTransform : 'capitalize')};
	opacity: ${({opacity}) => (opacity ? opacity : 1)};
	cursor: pointer;
`

const IconWrapper = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	cursor: pointer;
	height: 1.25rem;
	/* border-radius: 1rem; */
	width: 1.25rem;
`

const Checked = styled(BsCheckSquareFill)`
	color: ${palette.Btn_dark_green};
	/* font-size: 1rem; */
	/* border-radius: 100%; */
`
const UnChecked = styled(ImCheckboxUnchecked)`
	color: ${palette.input_checkbox};
`

export default Checkbox
