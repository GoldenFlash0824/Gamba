import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { palette } from '../../styled/colors'
import { Flexed, Heading, Spacer, Text, getCurrentAddress, Divider } from '../../styled/shared'
import { media } from 'styled-bootstrap-grid'
import Button from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'
import CustomInputField from '../../components/common/CustomInputField'
import Checkbox from '../../components/common/CheckBox'
import { loginUser } from '../../apis/apis'
import { useDispatch } from 'react-redux'
import { saveUser, setAuthToken, setIsLoading, setUserId } from '../../actions/authActions'
import { toastError, toastSuccess } from '../../styled/toastStyle'
import ValidationCode from '../../components/ValidationCode'
import { DiviverGrid, SocialIconsCover } from '../../pages/SignUp'
import Modal from 'react-responsive-modal'
import Loader from '../common/Loader'
import EnableAccountModal from './EnableAccountModal'

const closeIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
			fill="#75788D"
		/>
	</svg>
)

const LoginPopupModel = ({ onClose }: any) => {
	const _dispatch = useDispatch()
	let _navigate = useNavigate()
	const [registrationCode, setRegistrationCode] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [latitude, setLatitude]: any = useState(null)
	const [longitude, setLongitude]: any = useState(null)
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [isRemmber, setIsRemember] = useState(false)
	const [is2Fa, setIs2Fa] = useState(false)
	const [loading, setLoading] = useState(false)
	const [enableAccount, setEnableAccount] = useState(false)

	const userLogin = async () => {
		setLoading(true)
		let response = await loginUser(email, password, latitude, longitude, location)
		_dispatch(setUserId(response?.data?.user?.id))
		setLoading(false)

		if (response?.data?.is_verified === false || response?.data?.is_verified === null) {
			toastError(response.message)
			setRegistrationCode(true)
		} else if (response?.success && response?.data?.user.two_fector_auth_check_detail) {
			toastSuccess(response.message)
			setRegistrationCode(true)
			setIs2Fa(true)
		} else if (response.success === true) {
			toastSuccess(response.message)
			_dispatch(saveUser(response?.data?.user))
			_dispatch(setAuthToken(response?.data?.user?.auth_token))
			sessionStorage.setItem('authorization', response?.data?.user?.auth_token)
			if (isRemmber) {
				localStorage.setItem('authorization', response?.data?.user?.auth_token)
			}
			if (response?.data?.user?.lat && response?.data?.user?.log) {
				// let userLocation:any = {lat:30.6682,log:73.1114};
				let userLocation: any = { lat: response.data.user.lat, log: response.data.user.log }
				localStorage.setItem('userLocation', JSON.stringify(userLocation))
			}
			setEmail('')
			setPassword('')
			setLoading(false)
			if (response?.data?.user?.disable) {
				setEnableAccount(true)
			} else {
				onClose()
			}
		} else {
			toastError(response.message)
			setLoading(false)
		}
	}

	const checkValidationOnClick = () => {
		let isValid = true
		if (email === '') {
			setEmailError('Email Required')
			isValid = false
		}
		if (password.length < 8) {
			setPasswordError('Password  must be greater than 8 letters')
			isValid = false
		}
		if (password === '') {
			setPasswordError('Password  is Required')
			isValid = false
		}
		return isValid
	}

	useEffect(() => {
		getLatLong()
	}, [])

	const [location, setLocation] = useState('')

	const getLatLong = async () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					setLatitude(position.coords.latitude)
					setLongitude(position.coords.longitude)
					const address = await getCurrentAddress(position.coords.latitude, position.coords.longitude)
					setLocation(address)
				},
				(error) => {
					console.error('Error getting geolocation:', error)
				}
			)
		} else {
			console.error('Geolocation is not supported by this browser.')
		}
	}
	return (
		<Modal
			open={true}
			onClose={() => {
				onClose(false)
			}}
			center
			closeIcon={closeIcon}
			classNames={{
				overlay: 'customOverlay',
				modal: 'smallModal'
			}}>
			{loading && <Loader visible={loading} />}
			<div>
				<Grid>
					{/* <AuthSideCover /> */}
					<div>
						<Flex justify="space-between" align="center">
							<div></div>
							{registrationCode ? (
								<ValidationCode isRemmber={isRemmber} email={email} password={password} is2Fa={is2Fa} isModel={true} onClose={onClose} />
							) : (
								<Wrapper>

									<Flexed justify="center">
										<Heading level={sessionStorage?.getItem('isAccountDisabled') ? 6 : 2} fontWeight={700} isCentered color="dark_black">
											{sessionStorage.getItem('isAccountDisabled') ? 'Your account is now disabled! When you are ready to use Gamba again, simply login and enable your account. Hope to see you soon' : 'Login'}
										</Heading>

										<Spacer height={1.125} />

										<div>
											<CustomInputField
												label="Email"
												type="email"
												placeholder="Enter your email address"
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
											<Spacer height={1.25} />
										</div>

										<div>
											<CustomInputField
												label="Password"
												type="password"
												placeholder="Enter your password"
												handleChange={(e: any) => {
													setPasswordError('')
													if (e === '') {
														setPasswordError('Password is required')
													} else if (e.length < 8) {
														setPasswordError('Password  must be greater than 8 letters')
													}
													setPassword(e)
												}}
												value={password}
												required
												error={passwordError}
												errorMsg={passwordError}
											/>
											<Spacer height={0.625} />
											<Flexed direction="row" justify="flex-end" align="center">
												<Text
													textTransform="capitalize"
													type="small"

													color="green_200"
													className="hover-link"
													fontWeight={700}
													pointer
													onClick={() => {
														_navigate('/forgot-password')
													}}>
													Forgot password?
												</Text>
											</Flexed>
											<Spacer height={1.25} />
										</div>

										{/* <div>
											<Checkbox fontSize="1rem" label="Remember Me" isChecked={isRemmber} setIsChecked={setIsRemember} />
											<Spacer height={1.25} />
										</div> */}

										<div>
											<Button
												textTransformation
												label="Login"
												width="100%"
												ifClicked={async () => {
													if (checkValidationOnClick()) {
														await userLogin()
													}
												}}
											/>
											<Spacer height={1.25} />
										</div>

										<DiviverGrid>
											<Divider opacity={0.25} />
											<Text type="normal" color="gray" fontWeight={600} isCentered>
												or
											</Text>
											<Divider opacity={0.25} />
										</DiviverGrid>

										<Spacer height={1.25} />
										<Flexed direction="row" justify="center" align="center" gap={1.875}>
											<SocialIconsCover direction="row" justify="center" align="center">
												<img src="/images/icons/apple-filled.svg" alt="apple-filled" />
											</SocialIconsCover>
											<SocialIconsCover hasShadow direction="row" justify="center" align="center">
												<img src="/images/icons/facebook.svg" alt="facebook" />
											</SocialIconsCover>
											<SocialIconsCover direction="row" justify="center" align="center">
												<img src="/images/icons/google_color.svg" alt="google_color" />
											</SocialIconsCover>
										</Flexed>
										<Spacer height={1.25} />
									</Flexed>
								</Wrapper>
							)}
							{!registrationCode && (
								<AuthFooter>
									<Flexed flexWrap="wrap" direction="row" justify="center" gap={0.5} align="center">
										<Text type="normal" fontWeight={500} color="gray">
											Don’t have an account?
										</Text>

										<Text
											className="hover-link"
											pointer
											type="normal"

											fontWeight={700}
											color="green_200"
											onClick={() => {
												_navigate('/sign-up')
											}}>
											Sign Up
										</Text>
									</Flexed>
								</AuthFooter>
							)}
							{registrationCode && <div></div>}
						</Flex>
					</div>
				</Grid>
				{enableAccount && (
					<EnableAccountModal
						onClose={() => {
							setEnableAccount(false)
							onClose()
						}}
						enabled={() => {
							setEnableAccount(false)
							onClose()
						}}
					/>
				)}
			</div>
		</Modal>
	)
}
const Grid = styled.div`
	/* display: grid;
	row-gap: 1rem;
	@media screen and (min-width: 1120px) and (max-width: 1329px) {
		grid-template-columns: 1.05fr 0.95fr;
	}
	${media.xl`grid-template-columns: 1fr 1fr`}; */
`
const CustomWrapper = styled.div`
	border-radius: 1rem;
	width: 85%;
	padding: 2rem;
	background-color: ${palette.white};
	box-shadow: ${palette.shadowHover};
	/* height: calc(75vh -6rem); */
	min-height: 514px;
`

export const Flex = styled(Flexed)`
	height: 100%;
	position: relative;
`

const Wrapper = styled.div`
	border-radius: 1rem;
	
	width: 470px;
	min-height: fit-content;
	${media.xs`width: 100%;padding: 1.5rem;`};
`

export const AuthFooter = styled.div`
	// position: absolute;
	// bottom: 3rem;
	// @media screen and (max-width: 1120px) {
	// 	bottom: -3rem;
	// }
`

export default LoginPopupModel
