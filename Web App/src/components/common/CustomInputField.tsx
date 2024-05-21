import React, { useState } from 'react'
import styled from 'styled-components'
import { palette } from '../../styled/colors'
import { Flexed, Text } from '../../styled/shared'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { IoSend } from 'react-icons/io5'
import { MdPercent } from 'react-icons/md'

const CustomInputField = ({
	setIsAllowToOrderModalOpen,
	modal,
	label,
	value,
	required,
	type,
	maxLength,
	placeholder,
	styledType,
	handleChange,
	disabled,
	error,
	errorMsg,
	bgTransparent,
	allowNumber,
	allowPhoneNumberOnly,
	allowText,
	allowOnlyNumbersAndDecimal,
	allowOnlyNumbers,
	textAreaRows,
	style
}: any) => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)

	const [visible, setVisible] = useState(false)
	const [keyValue, setKeyValue] = useState<any>('')

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (allowNumber) {
			const re = /^[0-9 ]+/
			let val = event.target.value.replace(' ', '')
			if (re.test(val) || val?.length == 0) {
				if (handleChange) handleChange(event.target.value.replace(/[\s]/g, ''))
			}
		} else if (allowPhoneNumberOnly) {
			const re = /^[0-9 -]+$/
			let val = event.target.value.replace(' ', '')
			if (re.test(val) || val?.length == 0) {
				if (handleChange) handleChange(event.target.value.replace(/[\s]/g, ''))
			}
		} else if (allowText) {
			const re = /^[a-z]+$/
			let val = event.target.value
			if (re.test(val) || val?.length == 0) {
				if (handleChange) handleChange(event.target.value)
			}
		} else if (allowOnlyNumbers) {
			const re = /^\d+$/
			let val = event.target.value.replace(' ', '')
			if (keyValue == 'Backspace' || keyValue == 'Delete') {
				handleChange(event.target.value)
			} else {
				if (re.test(val) || val?.length == 0) {
					if (handleChange) handleChange(event.target.value.replace(/[\s]/g, ''))
				}
			}
		} else if (allowOnlyNumbersAndDecimal) {
			const re = /^[0-9][0-9]*[.]?[0-9]{0,2}$/
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

	const onKeyDown = (e: any) => {
		e.preventDefault()
	}

	return (
		<>
			{type !== 'textarea' ? (
				<>
					{label && (
						<Label type="normal" style={{ fontWeight: style && '500' }} margin="0rem 0rem 0.25rem 0rem" isDarkTheme={_isDarkTheme}>
							{label}{' '}
							{modal && (
								<span
									onClick={() => {
										setIsAllowToOrderModalOpen(true)
									}}>
									[!]
								</span>
							)}{' '}
							{required ? <Mandatory>*</Mandatory> : ''}
						</Label>
					)}
					<InputWrapper>
						<TextInput
							maxLength={maxLength}
							value={value}
							type={`${type && !visible ? (type === 'search' ? 'text' : type) : 'text'}`}
							inputType={type === 'password' || type === 'search' || type === 'send' || type === 'send' || type === 'discount'}
							disabled={disabled}
							placeholder={placeholder}
							error={error}
							onChange={(event: any) => onChange(event)}
							bgTransparent={bgTransparent}
							isDarkTheme={_isDarkTheme}
							onKeyDown={(e: any) => {
								if (type == 'date') {
									type == 'date' && onKeyDown(e)
								} else {
									setKeyValue(e.key)
								}
							}}
						/>
						{type === 'password' && (
							<Icon direction="row" align="center" justify="center" isDarkTheme={_isDarkTheme}>
								{visible ? (
									<Eye
										src="/images/icons/eye_open.svg"
										alt="eye-open"
										onClick={() => {
											setVisible(false)
										}}
										isDarkTheme={_isDarkTheme}
									/>
								) : (
									<CloseEye
										src="/images/icons/eye-closed.svg"
										alt="eye-closed"
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
						{styledType === 'discount' && (
							<StyledIcon direction="row" align="center" justify="center">
								<Percentage />
							</StyledIcon>
						)}
					</InputWrapper>
					{required && error && !disabled && (
						<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
							{errorMsg}
						</Text>
					)}
				</>
			) : (
				<>
					{label && (
						<LabelWrapper>
							<Label type="normal" margin="0rem 0rem 0.25rem 0rem" isDarkTheme={_isDarkTheme}>
								{label} {required ? <Mandatory>*</Mandatory> : ''}
							</Label>
						</LabelWrapper>
					)}
					<InputWrapper>
						<TextArea
							error={error}
							maxLength={maxLength}
							isDarkTheme={_isDarkTheme}
							bgTransparent={bgTransparent}
							row={textAreaRows ? textAreaRows : 4}
							value={value}
							placeholder={placeholder}
							onChange={(event: any) => handleChange(event.target.value)}
						/>

						{required && error && !disabled && (
							<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
								{errorMsg}
							</Text>
						)}
					</InputWrapper>
				</>
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
const LabelWrapper = styled.div``

const TextInput = styled.input<any>`
	font-family: 'Lato-Regular', sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: .5rem;
	padding: ${({ inputType }) => (inputType ? '0.7rem 4.1rem 0.7rem 1.25rem' : '0.7rem 1.25rem')};
	border: 1px solid ${({ error, disabled, bgTransparent }) => (disabled ? `${palette.light_gray}` : error ? `${palette.danger}` : bgTransparent ? `${palette.stroke}` : `#e1e5e8`)};
	color: ${({ disabled, isDarkTheme }) => (disabled ? `${palette.light_gray}` : isDarkTheme ? `${palette.text_black}` : `${palette.black}`)};
	background: ${({ disabled, bgTransparent, isDarkTheme }) => (bgTransparent ? 'transparent' : disabled ? `${palette.white}` : isDarkTheme ? `${palette.black}` : `${palette.white}`)};
	width: 100%;
	&:focus {
		border: 1px solid ${({ error, disabled }) => (disabled ? 'none' : error ? palette.danger : palette.Btn_dark_green)};
	}
	&::placeholder {
		color: ${palette.gray_100};
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.gray_100}`)};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.gray_100};
	}
`

const Icon = styled(Flexed) <any>`
	position: absolute;
	top: 0.063rem;
	bottom: 0.063rem;
	margin: auto;
	right: 0.063rem;
	width: 4rem;
	background: ${({ isDarkTheme }) => (isDarkTheme ? `${palette.black}` : `${palette.gray_200}`)};
	border-bottom-right-radius: 0.5rem;
	border-top-right-radius: 0.5rem;
`

const Eye = styled.img<any>`
	cursor: pointer;
`
const CloseEye = styled.img<any>`
	cursor: pointer;
`

const TextArea = styled.textarea<any>`
	font-family: 'Lato-Regular', sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: 0.5rem;
	padding: 0.7rem 4.1rem 0.7rem 1.25rem;
	border: 1px solid ${({ error, disabled, bgTransparent }) => (disabled ? `${palette.light_gray}` : error ? `${palette.danger}` : bgTransparent ? `${palette.stroke}` : `${palette.input_border}`)};
	color: ${({ disabled, isDarkTheme }) => (disabled ? `${palette.light_gray}` : isDarkTheme ? `${palette.text_black}` : `${palette.black}`)};
	background: ${({ disabled, bgTransparent, isDarkTheme }) => (bgTransparent ? 'transparent' : disabled ? `${palette.white}` : isDarkTheme ? `${palette.black}` : `${palette.gray_200}`)};
	width: 100%;
	&:focus {
		border: 1px solid ${({ error, disabled }) => (disabled ? 'none' : error ? palette.danger : palette.Btn_dark_green)};
	}
	&::placeholder {
		color: ${palette.gray_100};
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.gray_100}`)};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.gray_100};
	}
`

const Search = styled.img`
	width: 1rem;
`

const Send = styled(IoSend) <any>`
	font-size: 1.2rem;
	cursor: pointer;
	color: ${({ value }) => (value ? palette.Btn_dark_green : palette.silver)};
`
const Percentage = styled(MdPercent) <any>`
	font-size: 1.2rem;
	cursor: pointer;
	color: ${palette.text};
`

const StyledIcon = styled(Flexed) <any>`
	position: absolute;
	top: 0.063rem;
	bottom: 0.063rem;
	margin: auto;
	right: 0.5rem;
	width: 2.5rem;
	border-bottom-right-radius: 0.375rem;
	border-top-right-radius: 0.375rem;
`
export default CustomInputField
