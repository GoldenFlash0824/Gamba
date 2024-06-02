import React, {useState} from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
import {Flexed, Text} from '../../styled/shared'
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs'
import {useSelector} from 'react-redux'
import {IoSend} from 'react-icons/io5'
import {FaThermometerEmpty} from 'react-icons/fa'

const MultiInputField = ({label, value, allowOnlyNumbers, required, type, placeholder, handleChange, disabled, error, errorMsg, bgTransparent, index}: any) => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)

	const [visible, setVisible] = useState(false)
	const [keyValue, setKeyValue] = useState<any>('')

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (allowOnlyNumbers) {
			const re = /^\d+$/
			let val = event.target.value.replace(' ', '')
			if (keyValue == 'Backspace' || keyValue == 'Delete') {
				handleChange(event.target.value)
			} else {
				if (re.test(val) || val?.length == 0) {
					if (handleChange) handleChange(event.target.value.replace(/[\s]/g, ''))
				}
			}
		} else {
			if (handleChange) handleChange(event.target.value)
		}
	}
	return (
		<>
			{type !== 'textarea' ? (
				<>
				{label && (
							
							<Label type="normal"  margin="0rem 0rem 0.25rem 0rem" isDarkTheme={_isDarkTheme}>
									{label} {required ? <Mandatory>*</Mandatory> : ''}
								</Label>
							
						)}
					<InputWrapper>
						<TextInput
							value={value}
							type={`${type && !visible ? (type === 'search' ? 'text' : type) : 'text'}`}
							disabled={disabled}
							placeholder={placeholder}
							error={error}
							onChange={(event: any) => onChange(event)}
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
							<Icon direction="row" align="center" justify="center">
								<Send value={value.length > 0} />
							</Icon>
						)}

						
					</InputWrapper>
					{required && error && !disabled && (
						<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
							{errorMsg}
						</Text>
					)}
				</>
			) : (
				<TextArea isDarkTheme={_isDarkTheme} bgTransparent={bgTransparent} row={4} value={value} placeholder={placeholder} />
			)}
		</>
	)
}

const Label = styled(Text)`
font-weight: 700;
color: ${palette.black};
`

const Mandatory = styled.span`
	color: ${palette.danger};
`

const InputWrapper = styled.div`
	position: relative;
`
const LabelWrapper = styled.div`
	position: absolute;
	top: -0.8rem;
	left: 0.5rem;
	background-color: ${palette.white};
	padding: 0 0.2rem;
`

const TextInput = styled.input<any>`
font-family: 'Lato-Regular',sans-serif;
width: 100%;
line-height: 1.25rem;
outline: none;
font-weight: 400;
text-align: left;
font-size: 1rem;
border-radius: 0.5rem;
padding: ${({inputType}) =>  inputType ? '0.938rem 4.1rem 0.938rem 1.25rem' : '0.938rem 1.25rem' };
border: 1px solid ${({error, disabled, bgTransparent}) => (disabled ? `${palette.light_gray}` : error ? `${palette.danger}` : bgTransparent ? `${palette.stroke}` : `${palette.input_border}`)};
color: ${({disabled, isDarkTheme}) => (disabled ? `${palette.light_gray}` : isDarkTheme ? `${palette.text_black}` : `${palette.black}`)};
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
	width: 2.5rem;
	background: ${({isDarkTheme}) => (isDarkTheme ? `${palette.black}` : `${palette.white}`)};
	border-bottom-right-radius: 0.375rem;
	border-top-right-radius: 0.375rem;
`

const Eye = styled(BsFillEyeFill)<any>`
	font-size: 1.25rem;
	color: ${({isDarkTheme}) => (isDarkTheme ? `${palette.gray}` : `${palette.gray}`)};
	/* opacity: 0.5; */
	cursor: pointer;
`
const CloseEye = styled(BsFillEyeSlashFill)<any>`
	font-size: 1.25rem;
	color: ${({isDarkTheme}) => (isDarkTheme ? `${palette.gray}` : `${palette.gray}`)};
	/* opacity: 0.5; */
	cursor: pointer;
`

const TextArea = styled.textarea<any>`
font-family: 'Lato-Regular',sans-serif;
width: 100%;
line-height: 1.25rem;
outline: none;
font-weight: 400;
text-align: left;
font-size: 1rem;
border-radius: 1rem;
padding: 0.938rem 4.1rem 0.938rem 1.25rem;
border: 1px solid ${({error, disabled, bgTransparent}) => (disabled ? `${palette.light_gray}` : error ? `${palette.danger}` : bgTransparent ? `${palette.stroke}` : `${palette.input_border}`)};
color: ${({disabled, isDarkTheme}) => (disabled ? `${palette.light_gray}` : isDarkTheme ? `${palette.text_black}` : `${palette.black}`)};
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

export default MultiInputField
