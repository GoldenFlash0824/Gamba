import React, { useState } from 'react'
import styled from 'styled-components'
import { palette } from '../../styled/colors'
import { Flexed, Spacer, Text } from '../../styled/shared'
import { Row, Col, media } from 'styled-bootstrap-grid'
import { IoIosArrowForward } from 'react-icons/io'
import CustomInputField from '../common/CustomInputField'
import { updatePassword } from '../../apis/apis'
import { toastError, toastSuccess } from '../../styled/toastStyle'
import { useDispatch } from 'react-redux'
import { setIsLoading } from '../../actions/authActions'
import { useNavigate } from 'react-router-dom'

const ChangePassword = ({ setSelectCategory, setSelectProfileSettingsCategory }) => {
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [forgotPassword, setForgotPassword] = useState<any>('')
	const [confirmNewPassword, setConfirmNewPassword] = useState('')
	const _dispatch = useDispatch()
	const _navigate = useNavigate()

	const ChangePassword = async () => {
		if (oldPassword.trim().length == 0 && !forgotPassword) {
			toastError('Please enter old password')
		} else if (newPassword.trim().length == 0) {
			toastError('Please enter password')
		} else if (confirmNewPassword.trim().length == 0) {
			toastError('Please enter confirm password')
		} else if (newPassword != confirmNewPassword) {
			toastError('New and Confirm Password is not same ')
		} else {
			_dispatch(setIsLoading(true))
			let data = await updatePassword(oldPassword, newPassword, forgotPassword)
			if (data?.success) {
				toastSuccess(data.message)
				_dispatch(setIsLoading(false))
				_navigate('/settings')
				setSelectCategory('profile')
				setSelectProfileSettingsCategory('')
			} else {
				toastError(data.message)
				_dispatch(setIsLoading(false))
				// _navigate('/settings')
				// setSelectCategory('profile')
				// setSelectProfileSettingsCategory('')
			}
		}
	}

	return (
		<>
			<Wrapper>
				<Row>
					<Col>
						<Flex>
							{!forgotPassword && (
								<CustomInputField
									bgTransparent
									label="Current Password"
									type="password"
									placeholder="Current Password"
									handleChange={(e: any) => {
										setOldPassword(e)
									}}
									value={oldPassword}
									required
								/>
							)}
							<Spacer height={1.25} />
							<CustomInputField
								bgTransparent
								label="New Password"
								type="password"
								placeholder="New Password"
								handleChange={(e: any) => {
									setNewPassword(e)
								}}
								value={newPassword}
								required
							/>
							<Spacer height={1.25} />
							<CustomInputField
								bgTransparent
								label="Confirm Password"
								type="password"
								placeholder="Confirm Password"
								handleChange={(e: any) => {
									setConfirmNewPassword(e)
								}}
								value={confirmNewPassword}
								required
							/>
							<Spacer height={1.875} />
						</Flex>
					</Col>
					<Col>
						<Flexed direction="row" align="center" margin="0rem 0rem 1.25rem 0rem" gap="1">
							<Button
								onClick={() => {
									ChangePassword()
								}}>
								Save Changes
							</Button>
							<Button
								style={{ width: 'max-content' }}
								active={forgotPassword}
								onClick={() => {
									setForgotPassword(true)
								}}>
								Forgot Password ?
							</Button>
						</Flexed>
					</Col>
				</Row>
			</Wrapper>
		</>
	)
}

const Wrapper = styled.div`
	background-color: ${palette.white};
	padding: 0rem 0.6rem;
	width: 100%;
	padding: 24px !important;
	border-radius : 1rem !important;
`

const Button = styled.div<any>`
	padding: 1.25rem 1.3rem;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 1.875rem;
	height: 3.125rem;
	color: ${({ active }) => (active ? palette.green_200 : palette.white)};
	font-weight: 700;
	font-family: 'Lato-Regular', sans-serif;
	font-size: 1rem;
	text-align: left;
	opacity: 1;
	width: 150px;
	border: 1px solid ${palette.green_200};
	background-color: ${({ disabled, active }) => (disabled ? palette.white : active ? palette.white : palette.green_200)};
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		// background-color: ${palette.white};
		// color: ${({ active }) => (active ? palette.green_200 : palette.green_200)};
		background-color: ${palette.green};
		color: ${palette.white};
		border-color: ${palette.green}
	}
`

const Flex = styled(Flexed) <any>`
	max-width: 100%;
`

export default ChangePassword
