import React from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
import {Text} from '../../styled/shared'

const InputDate = ({label, value, required, type, placeholder, handleChange, disabled, error, errorMsg, bgTransparent}:any) => {
	return (
		<>
			<Label type="medium" color="black" margin="0rem 0rem 0.19rem 0rem">
				{label} {required ? <Mandatory>*</Mandatory> : ''}
			</Label>
			<TextInput value={value} type={'date'} bgTransparent={bgTransparent} disabled={disabled} placeholder={placeholder} error={error} onChange={(event:any) => handleChange(event.target.value)} />
			{required && error && !disabled && (
				<ErrorMsg fontSize={0.625} type="small" color="danger">
					Error message
				</ErrorMsg>
			)}
		</>
	)
}

const Label = styled(Text)`
	font-weight: 500;
	text-transform: capitalize;
`

const Mandatory = styled.span`
	color: ${palette.danger};
`

const TextInput = styled.input<any>`
	font-family: 'Roboto';
	width: 100%;
	line-height: 2rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 0.875rem;
	border-radius: 0.375rem;
	padding: 0.5rem 0.8rem;
	border: 1px solid ${({error, disabled}) => (disabled ? `${palette.silver}` : error ? `${palette.danger}` : `${palette.silver}`)};
	color: ${({disabled}) => (disabled ? `${palette.silver}` : `${palette.black}`)};
	width: 100%;
	// cursor: ${({disabled}) => (disabled ? `no-drop` : `pointer`)};
	background: ${({disabled, bgTransparent}) => (bgTransparent ? 'transparent' : disabled ? `${palette.silver}` : `${palette.white}`)};

	// &:hover {
	// 	box-shadow: 0 0 0.31rem ${({error, disabled}) => (disabled ? 'none' : error ? `${palette.danger}` : 'rgba(0, 0, 0, 0.25)')};
	// }
	&:focus {
		border: 1px solid ${({error, disabled}) => (disabled ? 'none' : error ? `${palette.danger}` : `${palette.blue}`)};
	}
	&::placeholder {
		color: ${palette.black};
		opacity: 0.5; /* Firefox */
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${palette.black};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.black};
	}
`

const ErrorMsg = styled(Text)`
	text-transform: capitalize;
	font-weight: 400;
`

export default InputDate
