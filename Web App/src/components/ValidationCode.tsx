import React, { useState } from 'react'
import styled from 'styled-components'
import 'react-responsive-modal/styles.css'
import { Text, Flexed, Spacer, Heading } from '../styled/shared'
import Button from './common/Button'
import { media } from 'styled-bootstrap-grid'
import { loginUser, reSendApi, verifyUserRegisterCodeApi } from '../apis/apis'
import VerificationInput from 'react-verification-input'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { saveUser, setAuthToken, setUserId } from '../actions/authActions'
import { toastError, toastSuccess } from '../styled/toastStyle'
import Loader from './common/Loader'
import EnableAccountModal from './modals/EnableAccountModal'

const ValidationCode = ({ isRemmber, email, setEmail, password, is2Fa, isModel, onClose }: any) => {
	const [verified, setVerified] = useState('')
	const [errorMsg, setErrorMsg] = useState('')
	const [loading, setLoading] = useState(false)

	const _dispatch = useDispatch()
	let _navigate = useNavigate()
	const [enableAccount, setEnableAccount] = useState(false)

	const checkVerification = async () => {
		setLoading(true)
		const response = await verifyUserRegisterCodeApi(email, parseInt(verified), is2Fa)
		setLoading(false)
		if (response?.data?.two_fector_auth && is2Fa) {
			toastSuccess(response.message)
			if (isRemmber) {
				localStorage.setItem('authorization', response?.data?.auth_token)
			}
			sessionStorage.setItem('authorization', response?.data?.auth_token)
			_dispatch(setUserId(response?.data?.id))

			setVerified('')
			if (response?.data?.disable) {
				setEnableAccount(true)
			} else {
				if (isModel) {
					_dispatch(saveUser(response?.data))
					_dispatch(setAuthToken(response?.data))
					onClose()
				} else {
					_navigate('/products')
				}
			}
		} else if (response.message === 'User verified successfully') {
			toastSuccess(response.message)
			let res = await loginUser(email, password)
			if (isRemmber) {
				localStorage.setItem('authorization', res?.data?.user?.auth_token)
			}
			if (res?.data?.user?.lat && res?.data?.user?.log) {
				let userLocation: any = { lat: res.data.user.lat, log: res.data.user.log }
				localStorage.setItem('userLocation', JSON.stringify(userLocation))
			}
			sessionStorage.setItem('authorization', res?.data?.user?.auth_token)
			_dispatch(setUserId(res?.data?.user?.id))
			setVerified('')
			if (isModel) {
				onClose()
			} else {
				_navigate('/products')
			}
		} else if (response.message === 'User already verified, Please login') {
			toastError(response.message)
			_navigate('/login')
			setLoading(false)
		} else {
			toastError(response.message)
			setErrorMsg(response.message)
			setLoading(false)
		}
	}
	return (
		<Wrapper>
			{loading && <Loader visible={loading} />}
			<Flexed justify="center">
				<Heading level={2} fontWeight={700} isCentered color="dark_black">
					Verification Code
				</Heading>
				<Spacer height={3.125} />
				<Text type="normal" isCentered fontWeight={500} color="dark_black">
					Please Enter the Validation Code which send to your Email {is2Fa ? 'For 2-step verification' : ''}
				</Text>
				<Spacer height={2} />
				<Flexed direction="row" justify="center">
					<VerificationInput
						validChars="0-9"
						classNames={{
							character: 'character'
						}}
						onChange={(e: any) => {
							setErrorMsg('')
							setVerified(e)
						}}
						value={verified}
					/>
				</Flexed>
				<div>
					<Spacer height={0.5} />
					<Error fontSize={0.725} type="small" color="danger" isCentered>
						{errorMsg}
					</Error>
					<Spacer height={1} />
				</div>

				<div>
					<Button
						textTransformation
						width="100%"
						type="danger"
						disabled={verified.length < 6}
						label="Verify Now"
						ifClicked={() => {
							checkVerification()
						}}
					/>
				</div>
				<ResendCode
					pointer
					type="normal"
					margin="0.625rem 0rem 0rem 0rem"
					textDecoration="underline"
					fontWeight={700}
					color="blue"
					onClick={async () => {
						const res = await reSendApi(email)
						if (res?.success) {
							setVerified('')
							toastSuccess(res?.message)
							// setCountdown(60)
						} else {
							toastError(res?.message)
						}
						// checkVerification()
					}}>
					Resend Code
				</ResendCode>
			</Flexed>
			{enableAccount && <EnableAccountModal onClose={() => setEnableAccount(false)} enabled={() => setEnableAccount(false)} />}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	border-radius: 1rem;
	padding: 1rem;
	width: 470px;
	min-height: fit-content;
	${media.xs`width: 100%;padding: 1.5rem;`};
`

const Error = styled(Text)`
	height: 1.125rem;
`

const ResendCode = styled(Text)`
	text-align: end;
`

export default ValidationCode
