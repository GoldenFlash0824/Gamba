import React, { useState } from 'react'
import styled from 'styled-components'
import { Flexed, Heading, Spacer, Text } from '../styled/shared'
import { media } from 'styled-bootstrap-grid'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import CustomInputField from '../components/common/CustomInputField'
import { updateUserPassword } from '../apis/apis'
import { AuthFooter } from './Login'
import AuthSideCover from '../components/common/AuthSideCover'
import { Flex } from './Login'
import { useDispatch } from 'react-redux'
import { toastError, toastSuccess } from '../styled/toastStyle'
import { setIsLoading } from '../actions/authActions'
import useRouter from '../components/useRouterHook'

const ResetForgotPssword = () => {
	let _navigate = useNavigate()
	const [newPassword, setNewPassword] = useState('')
	const [confirmNewPassword, setConfirmNewPassword] = useState('')
	const _dispatch = useDispatch()
	const router = useRouter()

	const ChangePassword = async () => {
		if (newPassword !== confirmNewPassword) {
			toastError('New and Confirm Password is not same ')
		} else if (router?.query?.id) {
			_dispatch(setIsLoading(true))
			let data = await updateUserPassword(newPassword, router?.query?.id)
			toastSuccess(data.message)
			_dispatch(setIsLoading(false))
			_navigate('/sign-in')
		}
	}

	return (
		<Grid>
			<AuthSideCover />
			<div>
				<Flex justify="space-between" align="center">
					{/* <div></div> */}
					<Wrapper>
						<Spacer height={1} />
						<Flexed justify="center">
							<Spacer height={4} />
							<Heading level={2} fontWeight={700} isCentered color="dark_black">
								Reset Password
							</Heading>
							<Spacer height={1.125} />

							<Text type="normal" isCentered fontWeight={500} color="dark_black">
								Enter your new password to continue
							</Text>

							<Spacer height={2} />
							<div>
								<CustomInputField
									bgTransparent
									label="New Password"
									type="text"
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
									type="text"
									placeholder="Confirm Password"
									handleChange={(e: any) => {
										setConfirmNewPassword(e)
									}}
									value={confirmNewPassword}
									required
								/>
								<Spacer height={1.25} />
							</div>

							<div>
								<Button
									textTransformation
									label="Update Password"
									width="100%"
									ifClicked={async () => {
										ChangePassword()
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
									pointer
									type="normal"
									textDecoration="underline"
									fontWeight={700}
									color="blue"
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
export default ResetForgotPssword
