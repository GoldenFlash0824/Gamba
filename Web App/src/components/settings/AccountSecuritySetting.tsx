import React, {useState} from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
import {Flexed, Spacer, Text} from '../../styled/shared'
import {Row, Col, media} from 'styled-bootstrap-grid'
import {IoIosArrowForward} from 'react-icons/io'
import CustomInputField from '../common/CustomInputField'
import Button from '../common/Button'

const AccountSecuritySetting = ({setSelectCategory, setSelectProfileSettingsCategory}) => {
	const [verificationCode, setVerificationCode] = useState('')

	return (
		<>
			<Flexed direction="row" align="center" gap="0.5" margin="0.5rem 0rem">
				<StyledHeading
					opacity
					type="normal"
					onClick={() => {
						setSelectProfileSettingsCategory('')
						setSelectCategory('profile')
					}}>
					Account
				</StyledHeading>
				<IoIosArrowForward />
				<StyledHeading type="normal" color="text">
					Account Security
				</StyledHeading>
			</Flexed>
			<Spacer height={0.5} />
			<Wrapper>
				<Row>
					{/* <Col lg={6} md={6}>
						<CustomInputField
							label="confirm new Password"
							type="password"
							placeholder="Password"
							handleChange={(e: any) => {
								setConfirmNewPassword(e)
							}}
							value={confirmNewPassword}
							required
						/>
						<Spacer height={2} />
					</Col> */}
					<Col>
						<Flexed align="center" justify="center">
							<Text type="large" color="text" isCentered>
								Verify Your Authetication Code
							</Text>
							<Spacer height={0.5} />

							<Text type="normal" color="text_description" isCentered>
								Enter the six digit Code send to you
							</Text>
							<Spacer height={1} />
							<InputField>
								<CustomInputField
									type="text"
									placeholder="Verification Code"
									handleChange={(e: any) => {
										setVerificationCode(e)
									}}
									value={verificationCode}
									required
								/>
							</InputField>

							<Spacer height={1} />

							<Text type="large" color="Btn_dark_green" isCentered>
								Resend Code
							</Text>
							<Spacer height={1} />
						</Flexed>
					</Col>

					<Col>
						<Flexed direction="row" align="center" justify="center">
							<Button label="Verify" width="min-content" ifClicked={() => {}} />
						</Flexed>
					</Col>

					<Col>
						<Spacer height={1} />
						<Flexed align="center" justify="center">
							<Text type="normal" color="text_description" isCentered>
								Need your code send to a new Phone Number
							</Text>
							<Spacer height={0.5} />

							<Text type="large" color="Btn_dark_green" isCentered>
								Contact Customer Support
							</Text>
						</Flexed>
					</Col>
				</Row>
			</Wrapper>
		</>
	)
}

const Wrapper = styled.div`
	background-color: ${palette.white} !important;
	padding: 2.5rem 1.5rem;
	width: 100%;
	box-shadow: 0.063rem 0.063rem 2px ${palette.posts_shadow};
	border-radius: 0.3rem;
`

const InputField = styled.div`
	width: 12rem;
`
const StyledHeading = styled(Text)<any>`
	position: relative;
	cursor: pointer;
	opacity: ${({opacity}) => (opacity ? '0.5' : '1')};
	/* color: ${({active}) => (active ? palette.Btn_dark_green : palette.text_black)}; */
`

export default AccountSecuritySetting
