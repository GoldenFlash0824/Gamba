import React, {useState} from 'react'
import styled from 'styled-components'
import {Flexed, Heading, Spacer, Text} from '../styled/shared'
import {media} from 'styled-bootstrap-grid'
import Button from '../components/common/Button'
import {useNavigate} from 'react-router-dom'
import CustomInputField from '../components/common/CustomInputField'
import {forgetPassword} from '../apis/apis'
import {AuthFooter} from './Login'
import AuthSideCover from '../components/common/AuthSideCover'
import {Flex} from './Login'

const ForgotPassword = () => {
	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState('')
	let _navigate = useNavigate()

	const checkValidationOnClick = () => {
		let isValid = true
		if (email === '') {
			setEmailError('Email Required')
			isValid = false
		}

		return isValid
	}
	return (
		<Grid className='align-items-center'>
			<AuthSideCover />
			<div>
				<Flex justify="space-between" align="center">
					<div></div>
					<Wrapper>
						<Spacer height={1} />
						<Flexed justify="center">
							{/* <Spacer height={4} /> */}
							<Heading level={2} fontWeight={700} isCentered color="dark_black">
								Forgot Password
							</Heading>
							<Spacer height={1.25} />

							<Text type="normal" isCentered fontWeight={500} color="dark_black">
								Enter your email to reset your password
							</Text>

							<Spacer height={1.25} />
							<div>
								<CustomInputField
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
									label="Email"
									type="email"
									placeholder="Enter"
								/>
								<Spacer height={1.25} />
							</div>

							<div>
								<Button
									textTransformation
									label="Reset password"
									width="100%"
									ifClicked={async () => {
										if (checkValidationOnClick()) {
											const res = await forgetPassword(email)
											if (res?.success) {
												_navigate('/sign-in')
											}
										}
									}}
								/>
								<Spacer height={1.25} />
							</div>
						</Flexed>
						<Spacer height={1} />
						<AuthFooter>
							<Flexed direction="row" justify="center" gap={0.5} align="center">
								<Text type="normal" fontWeight={500} color="gray">
									Go back to
								</Text>

								<Text
								   className="hover-link"
									pointer
									type="normal"
									textDecoration="none"
									fontWeight={700}
									color="green_200"
									onClick={() => {
										_navigate('/sign-in')
									}}>
									Login
								</Text>
							</Flexed>
						</AuthFooter>
					</Wrapper>
				</Flex>
			</div>
		</Grid>
	)
}

const Grid = styled.div`
	display: grid;
	row-gap: 1rem;
	@media screen and (min-width: 1120px) and (max-width: 1329px) {
		grid-template-columns: 1.05fr 0.95fr;
	}
	${media.xl`grid-template-columns: 1fr 1fr`};
`

const Wrapper = styled.div`
	border-radius: 1rem;
	padding: 1rem;
	width: 470px;
	min-height: fit-content;
	${media.xs`width: 100%;padding: 1.5rem;`};
`
export default ForgotPassword
