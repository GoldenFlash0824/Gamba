import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {Flexed, Heading, Spacer, Text, getCurrentAddress, Divider} from '../styled/shared'
import {media} from 'styled-bootstrap-grid'
import Button from '../components/common/Button'
import {useNavigate} from 'react-router-dom'
import CustomInputField from '../components/common/CustomInputField'
import Checkbox from '../components/common/CheckBox'
import {loginUser, updateUserInChat} from '../apis/apis'
import {useDispatch} from 'react-redux'
import {saveUser, setIsLoading, setUserId} from '../actions/authActions'
import {toastError, toastSuccess} from '../styled/toastStyle'
import ValidationCode from '../components/ValidationCode'
import AuthSideCover from '../components/common/AuthSideCover'
import {DiviverGrid, SocialIconsCover} from './SignUp'
import Loader from '../components/common/Loader'
import EnableAccountModal from '../components/modals/EnableAccountModal'

const LogIn = () => {
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
			await updateUserInChat(response?.data?.user?.id, response?.data?.user)
			sessionStorage.setItem('authorization', response?.data?.user?.auth_token)
			if (isRemmber) {
				localStorage.setItem('authorization', response?.data?.user?.auth_token)
			}
			if (response?.data?.user?.lat && response?.data?.user?.log) {
				// let userLocation:any = {lat:30.6682,log:73.1114};
				let userLocation: any = {lat: response.data.user.lat, log: response.data.user.log}
				localStorage.setItem('userLocation', JSON.stringify(userLocation))
			}
			setEmail('')
			setPassword('')
			setLoading(false)
			if (response?.data?.user?.disable) {
				setEnableAccount(true)
			} else {
				_navigate('/')
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
		<Grid className='align-items-center'>  
			{loading && <Loader visible={loading} />}
			<AuthSideCover />
			<div>
				<Flex justify="space-between" align="center">
					<div></div>
					{registrationCode ? (
						<ValidationCode isRemmber={isRemmber} email={email} password={password} is2Fa={is2Fa} />
					) : (
						<Wrapper>
							<Spacer height={1} />
							<Flexed justify="center">
								<Heading level={sessionStorage.getItem('isAccountDisabled') ? 6 : 2} fontWeight={700} isCentered color="dark_black">
									{sessionStorage.getItem('isAccountDisabled') ? 'Your account is now disabled! When you are ready to use Gamba again, simply login and enable your account. Hope to see you soon' : 'Login'}
								</Heading>
								
								<Spacer height={2.125} />

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
											className ="hover-link"
											textTransform="capitalize"
											type="small"
											
											color="green_200"
											textDecoration="none"
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
										type='primary'
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

								{/* <Spacer height={1} /> */}
								{/* <Flexed direction="row" justify="center" align="center" gap={1.875}>
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
								*/}
								<Spacer height={1} />
								{!registrationCode && (
									<AuthFooter>
										<Flexed flexWrap="wrap" direction="row" justify="center" gap={0.5} align="center">
											<Text type="normal" fontWeight={500} color="gray">
												Don’t have an account?
											</Text>

											<Text
												className ="hover-link"
												pointer
												type="normal"
												textDecoration="none"
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
							</Flexed>
							{enableAccount && <EnableAccountModal onClose={() => setEnableAccount(false)} enabled={() => setEnableAccount(false)} />}
						</Wrapper>
					)}
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
	padding-bottom: 3rem;
`

const Wrapper = styled.div`
	border-radius: 1rem;
	padding: 1rem;
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

export default LogIn
