import React, {useState} from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
import {Flexed, Text} from '../../styled/shared'
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs'
import {useSelector} from 'react-redux'
import {IoSend} from 'react-icons/io5'
import {IoAttach} from 'react-icons/io5'

const InputField = ({handleImageChange, label, value, required, type, placeholder, handleChange, disabled, error, errorMsg, bgTransparent}: any) => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const [visible, setVisible] = useState(false)

	return (
		<>
			{label && (
				<Label type="normal" margin="0rem 0rem 0.25rem 0rem" isDarkTheme={_isDarkTheme}>
					{label} {required ? <Mandatory>*</Mandatory> : ''}
				</Label>
			)}
			{type !== 'textarea' ? (
				<>
					<InputWrapper>
						<TextInput
							value={value}
							type={`${type && !visible ? (type === 'search' ? 'text' : type) : 'text'}`}
							inputType={type === 'password' || type === 'search' || type === 'send' ||  type === 'send' || type === 'discount'}
							disabled={disabled}
							placeholder={placeholder}
							error={error}
							onChange={(event: any) => handleChange(event.target.value)}
							bgTransparent={bgTransparent}
							isDarkTheme={_isDarkTheme}
						/>
						{type === 'password' && (
							<Icon direction="row" align="center" justify="center" isDarkTheme={_isDarkTheme}>
								{visible ? (
									<Eye
										onClick={() => {
											setVisible(false)
										}}
										isDarkTheme={_isDarkTheme}
									/>
								) : (
									<CloseEye
										onClick={() => {
											setVisible(true)
										}}
										isDarkTheme={_isDarkTheme}
									/>
								)}
							</Icon>
						)}
						{type === 'search' && (
							<Icon direction="row" align="center" justify="center">
								<Search src="/images/icons/search.svg" />
							</Icon>
						)}
						{type === 'send' && (
							<Icon direction="row" align="center" justify="center" gap={0.5}>
								<Upload htmlFor="imageUpload">
									<Attachment />
									<FileUploadInput type="file" id="imageUpload" onChange={(e) => handleImageChange(e)} />
								</Upload>
								<Send value={value.length > 0} />
							</Icon>
						)}
					</InputWrapper>
					{required && error && !disabled && (
						<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
							Error message
						</Text>
					)}
				</>
			) : (
				<>
					<TextArea isDarkTheme={_isDarkTheme} bgTransparent={bgTransparent} row={4} value={value} placeholder={placeholder} onChange={(event: any) => handleChange(event.target.value)} />
					{required && error && !disabled && (
						<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
							{errorMsg}
						</Text>
					)}
				</>
			)}
		</>
	)
}

const Label = styled(Text)`
	font-weight: 700;
	line-height: 20px;
	text-transform: capitalize;
	color: ${palette.black};
`

const Mandatory = styled.span`
	color: ${palette.danger};
`

const InputWrapper = styled.div`
	position: relative;
`

const TextInput = styled.input<any>`
font-family: 'Lato-Regular' , sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: 0.5rem;
	padding: ${({inputType}) =>  inputType ? '0.938rem 4.1rem 0.938rem 1.25rem' : '0.938rem 1.25rem' };
	border: 1px solid ${({error, disabled, bgTransparent}) => (disabled ? `${palette.light_gray}` : error ? `${palette.danger}` : bgTransparent ? `${palette.stroke}` : `${palette.input_border}`)};
	color: ${({disabled, isDarkTheme}) => (disabled || isDarkTheme ? `${palette.text_black}` : `${palette.black}`)};
	background: ${({disabled, bgTransparent, isDarkTheme}) => (bgTransparent ? 'transparent' : disabled ? `${palette.white}` : isDarkTheme ? `${palette.black}` : `${palette.gray_200}`)};
	width: 100%;
	&:focus {
		border: 1px solid ${({error, disabled}) => (disabled ? 'none' : error ? palette.danger : palette.Btn_dark_green)};
	}
	&::placeholder {
		color: ${palette.gray_100};
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${({disabled, isDarkTheme}) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.gray_100}`)};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.gray_100};
	}
`

const Icon = styled(Flexed)<any>`
	position: absolute;
	top: 0.063rem;
	bottom: 0.063rem;
	margin: auto;
	right: 0.063rem;
	width: 4.5rem;
	background: ${({isDarkTheme}) => (isDarkTheme ? `${palette.black}` : `${palette.white}`)};
	border-bottom-right-radius: 1.875rem;
	border-top-right-radius: 1.875rem;
`

const Eye = styled(BsFillEyeFill)<any>`
	font-size: 1.25rem;
	color: ${({isDarkTheme}) => (isDarkTheme ? `${palette.silver}` : `${palette.gray}`)};
	opacity: 0.5;
	cursor: pointer;
`
const CloseEye = styled(BsFillEyeSlashFill)<any>`
	font-size: 1.25rem;
	color: ${({isDarkTheme}) => (isDarkTheme ? `${palette.silver}` : `${palette.gray}`)};
	opacity: 0.5;
	cursor: pointer;
`

const TextArea = styled.textarea<any>`
font-family: 'Lato-Regular' , sans-serif;
width: 100%;
line-height: 1.25rem;
outline: none;
font-weight: 400;
text-align: left;
font-size: 1rem;
border-radius: 0.5rem;
padding: 0.938rem 1.25rem 0.938rem 1.25rem;
border: 1px solid ${({error, disabled, bgTransparent}) => (disabled ? `${palette.light_gray}` : error ? `${palette.danger}` : bgTransparent ? `${palette.stroke}` : `${palette.input_border}`)};
color: ${({disabled, isDarkTheme}) => (disabled || isDarkTheme ? `${palette.text_black}` : `${palette.black}`)};
background: ${({disabled, bgTransparent, isDarkTheme}) => (bgTransparent ? 'transparent' : disabled ? `${palette.white}` : isDarkTheme ? `${palette.black}` : `${palette.gray_200}`)};
width: 100%;
&:focus {
	border: 1px solid ${({error, disabled}) => (disabled ? 'none' : error ? palette.danger : palette.Btn_dark_green)};
}
&::placeholder {
	color: ${palette.gray_100};
}

&:-ms-input-placeholder {
	/* Internet Explorer 10-11 */
	color: ${({disabled, isDarkTheme}) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.gray_100}`)};
}

&::-ms-input-placeholder {
	/* Microsoft Edge */
	// color: ${palette.gray_100};
}
`

const Search = styled.img`
	width: 1rem;
`

const Send = styled(IoSend)<any>`
	font-size: 1.2rem;
	cursor: pointer;
	color: ${({value}) => (value ? palette.Btn_dark_green : palette.silver)};
`
const Attachment = styled(IoAttach)<any>`
	font-size: 1.5rem;
	cursor: pointer;
	color: ${palette.Btn_dark_green};
`

const FileUploadInput = styled.input`
	display: none !important;
`

const Upload = styled.label`
	display: flex;
	flex-direction: column;
	justify-content: center;
	cursor: pointer;
	margin-bottom: 0;
`
export default InputField
