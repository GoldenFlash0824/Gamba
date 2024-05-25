import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Spacer, Text } from '../styled/shared'
import { Col, Row } from 'styled-bootstrap-grid'
import CustomInputField from './common/CustomInputField'
import { contactWithUs } from '../apis/apis'
import { toastError, toastSuccess } from '../styled/toastStyle'
import { useDispatch } from 'react-redux'
import { saveSearchText } from '../actions/authActions'
import { useNavigate } from 'react-router-dom'
import LoginPopupModel from './modals/LoginPopupModel'

const ContactUs = () => {
	let _navigate = useNavigate()
	const [firstName, setFirstName] = useState('')
	const [email, setEmail] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [subject, setSubject] = useState('')
	const [caption, setCaption] = useState('')
	const authToken = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [firstNameError, setFirstNameError] = useState('')
	const [emailError, setEmailError] = useState('')
	const [phoneNumberError, setPhoneNumberError] = useState('')
	const [captionError, setCaptionError] = useState('')
	const [subjectError, setSubjectError] = useState('')
	const [loginPopup, setLoginPopup] = useState(false)

	const formValidation = () => {
		let isValid = true

		if (firstName === '') {
			setFirstNameError('first name is required')
			isValid = false
		}
		if (email === '') {
			setEmailError('email is required')
			isValid = false
		}
		if (phoneNumber === '') {
			setPhoneNumberError('phone Number is required')
			isValid = false
		}
		if (caption === '') {
			setCaptionError('Description is required')
			isValid = false
		}
		if (subject === '') {
			setSubjectError('Subject is required')
			isValid = false
		}

		return isValid
	}

	const contectUsHandler = async () => {
		if (authToken) {
			let res = await contactWithUs(firstName, email, phoneNumber, subject, caption)
			if (res?.success === true) {
				toastSuccess('Information sending successful, support team contact you soon')
				// setIsContactUsOpen(false)
				setFirstName('')
				setEmail('')
				setPhoneNumber('')
				setSubject('')
				setCaption('')
				_navigate('/products')
			} else {
				toastError('Information sending failed ')
			}
		} else {
			setLoginPopup(true)
		}
	}

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(saveSearchText(''))
	}, [])

	return (
		<>
			<Flexed direction="row" align="center" gap="0.625">
				<Text
					pointer
					color="gray"
					type="normal"
					fontWeight={500}
					onClick={() => {
						_navigate('/products')
					}}>
					Home
				</Text>
				<img src="/images/icons/arrow.svg" alt="arrow" />
				<Text color="black_100" type="normal" fontWeight={500}>
					Contact
				</Text>
			</Flexed>
			<Spacer height={1.938} />
			<Wrapper>
				<Row>
					<Col>
						<Text color="black_400" textTransform="capitalize" fontSize={1.25} fontWeight={700} >
							Contact Us
						</Text>
						<Spacer height={1.5} />
					</Col>
					<Col lg={6}>
						<CustomInputField
							bgTransparent
							label="Full Name"
							type="text"
							placeholder="John"
							handleChange={(e: any) => {
								setFirstNameError('')
								if (e === '') {
									setFirstNameError('first name is required')
								}
								setFirstName(e)
							}}
							required
							error={firstNameError}
							errorMsg={firstNameError}
							value={firstName}
						/>
						<Spacer height={1.5} />
					</Col>
					<Col lg={6}>
						<CustomInputField
							bgTransparent
							label="Email"
							type="email"
							placeholder="johndoe@mail.com"
							handleChange={(e: any) => {
								const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
								setEmailError('')
								if (e === '') {
									setEmailError('Email is required')
								} else if (!regex.test(e)) {
									setEmailError('Invalid Email')
								}
								setEmail(e)
							}}
							value={email}
							error={emailError}
							errorMsg={emailError}
							required
						/>
						<Spacer height={1.5} />
					</Col>
					<Col lg={6}>
						<CustomInputField
							bgTransparent
							label="Phone No."
							type="text"
							placeholder="+1 234 567 8901"
							handleChange={(e: any) => {
								setPhoneNumberError('')
								if (e === '') {
									setPhoneNumberError('first name is required')
								}
								setPhoneNumber(e)
							}}
							required
							error={phoneNumberError}
							errorMsg={phoneNumberError}
							value={phoneNumber}
							allowOnlyNumbers={true}
						/>
						<Spacer height={1.5} />
					</Col>
					<Col lg={6}>
						<CustomInputField
							bgTransparent
							label="Topic"
							type="text"
							placeholder="Subject of your message"
							handleChange={(e: any) => {
								setSubjectError('')
								if (e === '') {
									setSubjectError('Subject is required')
								}
								setSubject(e)
							}}
							error={subjectError}
							errorMsg={subjectError}
							value={subject}
							required
						/>
						<Spacer height={1.5} />
					</Col>
					<Col>
						<CustomInputField
							bgTransparent
							type="textarea"
							label="Your Message"
							placeholder="How can we help?"
							handleChange={(e: any) => {
								setCaptionError('')
								if (e === '') {
									setCaptionError('Description is required')
								}
								setCaption(e)
							}}
							value={caption}
							error={captionError}
							errorMsg={captionError}
							required
						/>
						<Spacer height={1.125} />
					</Col>

					<Col>
						<Flexed direction="row" align="center" justify="start">
							<Button
								onClick={() => {
									if (formValidation()) {
										contectUsHandler()
									}
								}}>
								Contact
							</Button>
						</Flexed>
						<Flexed className="social-icons" margin="2.125rem 0rem 0rem 0rem" direction="row" align="center" justify="center" gap={1.875}>
							<a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
								<Img src="/images/icons/facebook_icon.svg" alt="facebook_icon" onClick={() => ''} />
							</a>
							<a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
								<Img src="/images/icons/linkedin-fill.svg" alt="linkedin-fill" />
							</a>
							<a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
								<Img src="/images/icons/instagram-fill.svg" alt="instagram-fill" />
							</a>
							<a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
								<Img src="/images/icons/tick_tok.svg" alt="tick_tok" />
							</a>
						</Flexed>
					</Col>
				</Row>
			</Wrapper>
			<Spacer height={1} />
			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</>
	)
}

const Wrapper = styled.div<any>`
	background-color: ${palette.white};
	padding :24px !important;
	border-radius : 1rem !important;
`

const Img = styled.img`
	cursor: pointer;
`

const Button = styled.div`
	opacity: 1;
	border-radius: 2rem;
	border: none;
	padding: 0.65rem 2rem;
	font-size: 1rem;
	height: 50px;
	color: ${palette.white};
	background: ${palette.green_200};
	font-weight: 700;
	cursor: pointer;
	width: 150px;
	white-space: nowrap;
	-webkit-box-align: center;
	align-items: center;
	position: relative;
	display: flex;
	-webkit-box-pack: center;
	justify-content: center;
	transition: all 0.25s ease 0s;
	font-family: Lato-Bold, sans-serif;
	border: 1px solid ${palette.green_200};
	&:hover {
		background-color: ${palette.green};
		color: ${palette.white};
		border-color: ${palette.green}
	}
`

export default ContactUs
