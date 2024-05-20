import React from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'

const Toggle = ({setToggle, toggle, disabled}: any) => {
	return (
		<Wrapper
		
			toggle={toggle}
			onClick={() => {
					setToggle(!toggle)
			}}>
			<Dot toggle={toggle} />
		</Wrapper>
	)
}

const Wrapper = styled.div<any>`
	display: flex;
	align-items: center;
	justify-content: ${({toggle}) => (toggle ? 'flex-end' : 'flex-start')};
	background-color: ${({toggle}) => (toggle ? palette.Btn_dark_green : palette.gray_100)};
	width: 40px;
	height: 26px;
	border-radius: 1rem;
	padding: 0.5rem 0.1rem;
	transition: justify-content 2s, transform 2s;
	border: 0.063rem solid ${({toggle}) => (toggle ? palette.fbBg : palette.fbBg)};
	cursor: ${({disabled}) => (disabled ? 'no-drop' : 'pointer')};
`

const Dot = styled.div<any>`
	width: 20px;
	height: 20px;
	border-radius: 100%;
	background-color: ${palette.white};
`
export default Toggle
