import React, {useState} from 'react'
import {palette} from '../../styled/colors'
import styled from 'styled-components'
import {Flexed, Text} from '../../styled/shared'
import {BsCheckSquareFill} from 'react-icons/bs'
// import {ImCheckboxUnchecked} from 'react-icons/im'
import {ImCheckboxUnchecked} from 'react-icons/im'

const StyledCheckBox = ({label, lineHeight, fontSize, fontWeight, opacity, dummyChemicalsArray, textTransform, data, setDummyChemicalsArray, index}: any) => {
	const [isChecked, setIsChecked] = useState(data.isChecked)

	return (
		<StyledFlex
			direction="row"
			align="center"
			onClick={() => {
				// data.isChecked = isChecked
				setIsChecked(!isChecked)
				dummyChemicalsArray[index].isChecked = !isChecked
				setDummyChemicalsArray(dummyChemicalsArray)
			}}>
			<IconWrapper>{isChecked ? <Checked /> : <UnChecked />}</IconWrapper>

			{label && (
				<CustomText fontSize={fontSize} lineHeight={lineHeight} fontWeight={fontWeight} opacity={opacity} textTransform={textTransform}>
					{label?.toLowerCase()}
				</CustomText>
			)}
		</StyledFlex>
	)
}

const CustomText = styled(Text)`
	padding-left: 0.6rem;
	color: ${palette.text_description};
	text-transform: ${({textTransform}) => (textTransform ? textTransform : 'capitalize')};
	opacity: ${({opacity}) => (opacity ? opacity : 1)};
`
const StyledFlex = styled(Flexed)`
	padding: 0.5rem;
	&:not(:last-child) {
		border-bottom: 1px solid ${palette.input_border};
	}
`

const IconWrapper = styled.div`
	display: flex;
	align-items: center;
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

export default StyledCheckBox
