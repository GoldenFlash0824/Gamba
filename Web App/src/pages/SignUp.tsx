import React, { useEffect, useState } from 'react'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Heading, Spacer, Text, getCurrentAddress, Divider } from '../styled/shared'
import { media } from 'styled-bootstrap-grid'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import CustomInputField from '../components/common/CustomInputField'
import { addUserInChat, registerUser } from '../apis/apis'
import { useDispatch } from 'react-redux'
import { setIsLoading } from '../actions/authActions'
import { toastError, toastSuccess } from '../styled/toastStyle'
import AuthSideCover from '../components/common/AuthSideCover'
import ValidationCode from '../components/ValidationCode'

const SignUp = () => {
	const _dispatch = useDispatch()
	let _navigate = useNavigate()
	const [firstName, setFirstName] = useState<string>('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [address, setAddress] = useState('')
	const [password, setPassword] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')

	const [firstNameError, setFirstNameError] = useState<string>('')
	const [lastNameError, setLastNameError] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [registrationCode, setRegistrationCode] = useState(false)
	const [phoneNumberError, setPhoneNumberError] = useState('')
	const [latitude, setLatitude]: any = useState(null)
	const [longitude, setLongitude]: any = useState(null)

	const signUpuser = async () => {
		_dispatch(setIsLoading(true))
		let response: any;
		if (address === '') {
			const { curAdd, curLat, curLog } = await getCurrentLatLng();
			response = await registerUser(firstName, lastName, email, password, phoneNumber, curLat, curLog, curAdd)
		}
		response = await registerUser(firstName, lastName, email, password, phoneNumber, latitude, longitude, address)
		_dispatch(setIsLoading(false))
		if (response.success === true) {
			toastSuccess(response.message)
			await addUserInChat(response?.data?.user?.id, response?.data?.user)
			setFirstName('')
			setLastName('')
			setRegistrationCode(true)
		} else {
			toastError(response.message)
		}
	}

	const checkValidationOnClick = () => {
		let isValid = true
		if (firstName === '') {
			setFirstNameError('First Name Required')
			isValid = false
		}
		if (lastName === '') {
			setLastNameError('Last Name Required')
			isValid = false
		}

		if (email === '') {
			setEmailError('Email Required')
			isValid = false
		}

		if (password === '') {
			setPasswordError('Password  is Required')
			isValid = false
		}
		if (password.length < 8) {
			setPasswordError('Password  must be greater than 8 letters')
			isValid = false
		}

		if (phoneNumber === '') {
			setPhoneNumberError('Phone Number is required')
			isValid = false
		}

		return isValid
	}

	const handleSelect = (address: any) => {
		if (address !== '') {
			setAddress(address);
			geocodeByAddress(address)
				.then((results: any[]) => {
					if (results.length > 0) {
						const location = results[0].geometry.location;
						return {
							lat: location.lat(),
							lng: location.lng()
						};
					} else {
						throw new Error('No results found for the specified address.');
					}
				})
				.then((latLng: any) => {
					setLatitude(latLng?.lat)
					setLongitude(latLng?.lng)
				}).catch((err: any) => console.log('Error: ', err))
		}
	}

	const getCurrentLatLng = (): Promise<any> => {
		return new Promise((resolve, reject) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						try {
							const curAdd = await getCurrentAddress(position.coords.latitude, position.coords.longitude);
							resolve({
								curAdd: curAdd,
								curLat: position.coords.latitude,
								curLog: position.coords.longitude
							});
						} catch (error) {
							console.error('Error getting location:', error);
							reject(error);
						}
					},
					(error) => {
						console.error('Error getting geolocation:', error);
						reject(error);
					}
				);
			} else {
				console.error('Geolocation is not supported by this browser.');
				reject('Geolocation is not supported by this browser.');
			}
		});
	};

	useEffect(() => {
		toastSuccess("Location is necessary for GPS tracking to detect activities near you or nearby");
	}, [])

	return (
		<Grid>
			<AuthSideCover />
			<div>
				<Flex direction="row" justify="center" align="center">
					{registrationCode ? (
						<ValidationCode email={email} password={password} />
					) : (
						<Wrapper>
							<Flexed justify="center">
								<Heading level={2} fontWeight={700} isCentered color="dark_black">
									Register
								</Heading>

								<Spacer height={3.125} />
								<div>
									<CustomInputField
										label="First Name"
										type="text"
										placeholder="Enter your first name"
										handleChange={(e: any) => {
											setFirstNameError('')
											if (e === '') {
												setFirstNameError('First Name Required')
											}
											setFirstName(e)
										}}
										required
										value={firstName}
										error={firstNameError}
										errorMsg={firstNameError}
									/>
									<Spacer height={1.25} />
								</div>

								<div>
									<CustomInputField
										label="Last Name"
										type="text"
										placeholder="Enter your last name"
										handleChange={(e: any) => {
											setLastNameError('')
											if (e === '') {
												setLastNameError('Last Name Required')
											}
											setLastName(e)
										}}
										value={lastName}
										error={lastNameError}
										errorMsg={lastNameError}
										required
									/>
									<Spacer height={1.25} />
								</div>

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
										label="Phone No."
										type="tel"
										placeholder="Enter your phone number"
										handleChange={(e: any) => {
											setPhoneNumberError('')
											if (e === '') {
												setPhoneNumberError('Phone Number is required')
											}
											setPhoneNumber(e)
										}}
										value={phoneNumber}
										error={phoneNumberError}
										errorMsg={phoneNumberError}
										required
										allowOnlyNumbers={true}
									/>
									<Spacer height={1.25} />
								</div>

								<div>
									<PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
										{({ getInputProps, suggestions, getSuggestionItemProps }: any) => (
											<div>
												<>
													<InputWrapper>
														<LabelWrapper>
															<CalenderLabel type="normal" margin="0rem 0rem 0.25rem 0rem">
																Location <Mandatory>*</Mandatory>
															</CalenderLabel>
														</LabelWrapper>
														<GoogleAutoLocation width={'100%'} borderRadius={'0.2rem'} margin={'0'} padding={'0.8rem 0.8rem 0.8rem 2.5rem'} value={address} {...getInputProps()} placeholder="Search location" />
													</InputWrapper>
													<ListItems open={suggestions?.length > 0}>
														{suggestions?.map((suggestion: any, i: any) => {
															const style = {
																backgroundColor: suggestion.active ? '#32CD32' : 'white'
															}
															return (
																<LocationList
																	key={i + 'mapkey'}
																	{...getSuggestionItemProps(suggestion, {
																		style
																	})}>
																	{suggestion?.description}
																</LocationList>
															)
														})}
													</ListItems>
												</>
											</div>
										)}
									</PlacesAutocomplete>
									<Spacer height={1.25} />
								</div>

								<div>
									<CustomInputField
										label="Password"
										type="password"
										placeholder="Enter password"
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
									<Spacer height={2} />
								</div>

								<div>
									<Button
										className="btn-primary"
										textTransformation
										label="Register"
										width="100%"
										type="primary"

										ifClicked={() => {
											if (checkValidationOnClick()) {
												signUpuser()
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
								<Spacer height={2} /> */}
								<Flexed flexWrap="wrap" direction="row" justify="center" gap={0.5} align="center">
									<Text type="normal" fontWeight={500} color="gray">
										Already have an account?
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
								<Spacer height={1} />
							</Flexed>
						</Wrapper>
					)}
				</Flex>
			</div>
		</Grid>
	)
}

const Flex = styled(Flexed)`
	height: 100%;
`
const Grid = styled.div`
	display: grid;
	row-gap: 1rem;
	${media.lg``};
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

export const DiviverGrid = styled.div`
	display: grid;
	gap: 1rem;
	grid-template-columns: 1fr 0.1fr 1fr;
	align-items: center;
`

export const SocialIconsCover = styled(Flexed) <any>`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 0.75rem;
	border: ${({ hasShadow }) => (hasShadow ? 'none' : `1px solid ${palette.stroke}`)};
	background: ${palette.white};
	box-shadow: ${({ hasShadow }) => (hasShadow ? '0px 6px 24px 0px rgba(0, 0, 0, 0.10)' : 'none')};
	cursor: pointer;
`
const LabelWrapper = styled.div``

const InputWrapper = styled.div`
	position: relative;
`

const Mandatory = styled.span`
	color: ${palette.danger};
`

const CalenderLabel = styled(Text)`
	font-weight: 700;
	color: ${palette.black};
`

const LocationList = styled.div`
	background-color: ${palette.white};
	cursor: pointer;
	line-height: 2rem;
	padding: 0.5rem 0.8rem;
	border-bottom: 1px solid ${palette.stroke};
	font-family: 'Lato-Regular', sans-serif;
	text-transform: normal;
	color: ${palette.heading_color};
	&:hover {
		background: ${palette.Btn_dark_green};
		color: ${palette.white};
	}

	&:first-child {
		border-top-left-radius: 0.375rem;
		border-top-right-radius: 0.375rem;
	}
	&:last-child {
		border-bottom-left-radius: 0.375rem;
		border-bottom-right-radius: 0.375rem;
	}
	&:last-child {
		border-bottom: 0;
	}
`

const GoogleAutoLocation = styled.input<any>`
	font-family: 'Lato-Regular', sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: 0.5rem;
	padding: 0.7rem 1.25rem;
	border: 1px solid ${palette.stroke};
	background: ${palette.white};
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

const ListItems = styled.div<any>`
	position: absolute;
	background: ${palette.white};
	z-index: 1;
	width: calc(100% - 1.875rem);
	border: ${({ open }) => (open ? `1px solid ${palette.stroke}` : null)};

	border-radius: 1rem;

	max-height: 15rem;
	overflow-y: auto;
`

export default SignUp
