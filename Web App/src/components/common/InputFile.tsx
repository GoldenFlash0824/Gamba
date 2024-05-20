import React, {useState} from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
import {Text} from '../../styled/shared'

const InputFile = ({label, setFileValue, required, placeholder, disabled, error, errorMsg, bgTransparent}:any) => {
	const [file, setFile] = useState(null)

	const uploadFile = ({target}:any) => {
		const reader:any = new FileReader()
		reader.readAsDataURL(target.files[0])

		reader.onload = () => {
			if (reader.readyState === 2) {
				setFile(reader.result)
			}
		}
	}

	return (
		<>
			<Label type="medium" color="black" margin="0rem 0rem 0.19rem 0rem">
				{label} {required ? <Mandatory>*</Mandatory> : ''}
			</Label>
			<InputWrapper>
				<TextInput value={file} type="text" disabled={disabled} placeholder={placeholder} error={error} bgTransparent={bgTransparent} />
				<Browse htmlFor="faceImage" aria-label="upload picture">
					Browse{' '}
				</Browse>
				<FileInput id="faceImage" accept="image/jpeg/png" type="file" onChange={uploadFile} />
			</InputWrapper>
			{required && error && !disabled && (
				<Text fontSize={0.625} type="small" color="danger">
					Error message
				</Text>
			)}
			<InfoText fontSize={0.625} type="small" color="black">
				Recommended size 457 x 359 px
			</InfoText>
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

const InputWrapper = styled.div`
	position: relative;
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
	padding: 0.5rem 6.2rem 0.5rem 0.8rem;
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

const Browse = styled.label`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0rem;
	bottom: 0rem;
	margin: auto;
	right: 0rem;
	width: 6rem;
	/* background: ${palette.white}; */
	border: 0.063rem solid ${palette.blue};
	color: ${palette.blue};
	border-bottom-right-radius: 0.375rem;
	border-top-right-radius: 0.375rem;
	font-family: 'Roboto';
	font-weight: 600;
	font-size: 0.875rrem;
	line-height: 32px;
	text-transform: capitalize;
	cursor: pointer;
`

const FileInput = styled.input`
	display: none !important;
`

const InfoText = styled(Text)`
	text-transform: capitalize;
	font-weight: 400;
`

export default InputFile
