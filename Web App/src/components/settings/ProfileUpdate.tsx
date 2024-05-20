import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Row, Col} from 'styled-bootstrap-grid'
import {Spacer} from '../../styled/shared'
import {palette} from '../../styled/colors'
import CustomInputField from '../common/CustomInputField'
import {Text, Flexed} from '../../styled/shared'

import {doGetUserProfile, updateUserInChat, updateUserInfo} from '../../apis/apis'
import {useDispatch} from 'react-redux'
import {setIsLoading} from '../../actions/authActions'
import {toastError, toastSuccess} from '../../styled/toastStyle'
import DropDown from '../DropDown'
import DateTimePicker from 'react-datetime-picker'
import {BiCalendarAlt} from 'react-icons/bi'
import moment from 'moment-timezone'
import LocationSearch from '../common/LocationSearch'

const ProfileUpdate = ({getUserProfile, profileInfoMenu, setSelectCategory, setSelectProfileSettingsCategory}) => {
	const [email, setEmail] = useState('')
	const [about, setAbout] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [dob, setDob]: any = useState('')
	const [profilImage, setProfileImage]: any = useState('')
	const [showImage, setShowImage]: any = useState(null)
	const [phoneNumber, setPhoneNumber] = useState('')
	// const [startDate, setStartDate] = useState(new Date())
	const [location, setLocation] = useState('')
	const [latitude, setLatitude] = useState('')
	const [longitude, setLongitude] = useState('')
	const [locationError, setLocationError] = useState('')
	const [phoneNumberError, serPhoneNumberError] = useState('')
	const [firstNameError, setFirstNameError] = useState<string>('')
	const [lastNameError, setLastNameError] = useState('')
	const [aboutError, setaboutError] = useState('')

	const [dobError, setDobError] = useState('')
	const [genderError, setGenderError] = useState('')
	const [genderOption, setGenderOption] = useState([
		{value: 'Male', label: 'Male'},
		{value: 'Female', label: 'Female'},
		{value: 'Transgender', label: 'Transgender'},
		{value: 'Other', label: 'Other'}
	])
	const [gender, setGender] = useState('')
	const _dispatch = useDispatch()

	useEffect(() => {
		getUserProfileInfo()
	}, [])

	const getUserProfileInfo = async () => {
		_dispatch(setIsLoading(true))
		const response = await doGetUserProfile()
		if (response?.data) {
			setGender(response.data?.gender)
			setEmail(response?.data?.email)
			setFirstName(response?.data?.first_name)
			setLastName(response?.data?.last_name)
			setAbout(response?.data?.about)
			setDob(response?.data?.dob ? new Date(response?.data?.dob) : '')
			setPhoneNumber(response?.data?.phone)
			setProfileImage(response.data?.image)
			setLocation(response.data?.address)
		}
		_dispatch(setIsLoading(false))
	}
	const updateUser = async () => {
		_dispatch(setIsLoading(true))
		const response = await updateUserInfo(firstName, lastName, profilImage, phoneNumber, about, moment(dob).format('MM/DD/YYYY'), gender, location, email)
		if (response?.success) {
			if (response?.data?.lat && response?.data?.log) {
				// let userLocation:any = {lat:30.6682,log:73.1114};
				let userLocation: any = {lat: response.data.lat, log: response.data.log}
				localStorage.setItem('userLocation', JSON.stringify(userLocation))
			}
			await updateUserInChat(response?.data?.id, response?.data)
			getUserProfile()
			_dispatch(setIsLoading(false))
			toastSuccess('User Information is updated')
		} else {
			_dispatch(setIsLoading(false))
			toastError(response?.message)
		}
	}

	const handleCapture = ({target}: any) => {
		const reader = new FileReader()
		reader.readAsDataURL(target.files[0])
		reader.onload = () => {
			if (reader.readyState === 2) {
				setShowImage(reader.result)
				setProfileImage(reader.result)
			}
		}
	}
	const handleStartDateChange = (date: any) => {
		setDobError('')
		setDob(date)
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
		if (about === '') {
			setaboutError('about is require')
			isValid = false
		}
		if (phoneNumber === '') {
			serPhoneNumberError('Phone Number is required')
			isValid = false
		}
		if (dob === null) {
			setDobError('date of birth is required')
			isValid = false
		}
		if (gender === '') {
			setGenderError('gender is required')
			isValid = false
		}
		return isValid
	}
	return (
		<Wrapper>
			<Row>
				<Col>
					<Flexed direction="row" align="center" justify="start">
						<InputWrapper>
							<UploadIcon showImage={showImage || profilImage} src={showImage ? showImage : profilImage ? process.env.REACT_APP_PUBLIC_IMAGE_URL + profilImage : '/icons/camera.png'} />
							<FileInput
								id="faceImage"
								accept="image/jpeg/png"
								type="file"
								onChange={(e: any) => {
									handleCapture(e)
								}}
							/>
							<Upload htmlFor="faceImage">
								<img src="/images/icons/bi_camera.svg" alt="bi_camera" />
							</Upload>
						</InputWrapper>
					</Flexed>
					​
					<Spacer height={1.25} />
				</Col>
				<Col lg={6} md={6}>
					<CustomInputField
						label="First Name"
						type="text"
						value={firstName}
						error={firstNameError}
						errorMsg={firstNameError}
						placeholder="Enter your first name"
						bgTransparent
						handleChange={(e: any) => {
							setFirstName(e)
						}}
						required
					/>
					<Spacer height={1.25} />
				</Col>
				<Col lg={6} md={6}>
					<CustomInputField
						label="Last Name"
						type="text"
						value={lastName}
						error={lastNameError}
						errorMsg={lastNameError}
						placeholder="Enter your last name"
						bgTransparent
						handleChange={(e: any) => {
							setLastName(e)
						}}
						required
					/>
					<Spacer height={1.25} />
				</Col>
				<Col lg={6} md={6}>
					<CustomInputField
						label="Email"
						type="email"
						placeholder="Enter your email address"
						bgTransparent
						handleChange={(e: any) => {
							setEmail(e)
						}}
						value={email}
						required
					/>
					<Spacer height={1.25} />
				</Col>
				{/* <Col lg={6} md={6}>
						<CustomInputField
							label="Last Name"
							type="text"
							value={lastName}
							error={lastNameError}
							errorMsg={lastNameError}
							placeholder="Enter"
							handleChange={(e: any) => {
								setLastName(e)
							}}
							required
						/>
						<Spacer height={2} />
					</Col> */}
				<Col lg={6} md={6}>
					<CustomInputField
						label="Phone No."
						// type="tel"
						placeholder="Enter your phone number"
						bgTransparent
						handleChange={(e: any) => {
							serPhoneNumberError('')
							if (e === '') {
								serPhoneNumberError('Phone Number is required')
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
				</Col>
				​
				<Col lg={6} md={6}>
					<InputWrapper>
						<Text type="normal" margin="0rem 0rem 0.25rem 0rem" color="black" fontWeight={700}>
							Date of Birth
						</Text>

						<CalenderDiv calendarIcon={<CalendarIconCustom />} clearIcon={null} disableClock={true} maxDate={new Date()} format="dd MMM, y" onChange={handleStartDateChange} onKeyDown={(e) => e.preventDefault()} value={dob} />
						<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
							{dobError}
						</Text>
					</InputWrapper>
					<Spacer height={1.25} />
				</Col>
				​
				<Col lg={6} md={6}>
					<DropDown
						label="Gender"
						firstSelected={gender}
						hasChanged={(value: any) => {
							setGenderError('')
							if (value == '') {
								setGenderError('Privacy Field is empty')
							}
							setGender(value)
						}}
						required
						error={genderError}
						errorMsg={genderError}
						options={genderOption}
						// selectedOption={gender}
					/>
					<Spacer height={1.25} />
				</Col>
				​
				<Col lg={12} md={12}>
					<LocationSearch setLongitude={setLongitude} setLatitude={setLatitude} location={location} setLocationError={setLocationError} setLocation={setLocation} isProfile={true} />
					<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase"></Text>
					<Spacer height={1.25} />
				</Col>
				​
				<Col>
					<CustomInputField
						bgTransparent
						label="About"
						type="textarea"
						placeholder="About"
						handleChange={(e: any) => {
							setAbout(e)
							if (e) {
								setaboutError('')
							}
						}}
						value={about}
						error={aboutError}
						errorMsg={aboutError}
						required
					/>
					<Spacer height={1.25} />
				</Col>
				<Col>
					<Flexed direction="row" align="center" margin="0rem 0rem 1.25rem 0rem">
						<Button
							onClick={() => {
								if (checkValidationOnClick()) {
									updateUser()
								}
							}}>
							Save Changes
						</Button>
					</Flexed>
				</Col>
			</Row>
		</Wrapper>
	)
}
const Wrapper = styled.div`
	background-color: ${palette.white};
	padding: 0rem 0.6rem;
	width: 100%;
	padding: 24px !important;
	border-radius : 1rem !important;
`
const CalendarIconCustom = styled(BiCalendarAlt)`
	color: ${palette.gray};
	font-size: 1.5rem;
`
const CalenderDiv = styled(DateTimePicker)<any>`
	font-family: 'Lato-Regular', sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: 0.5rem;
	padding: 0.8rem 1.25rem;
	border: 1px solid ${({error, disabled, isDarkTheme}) => (disabled ? `${palette.green}` : error ? `${palette.danger}` : isDarkTheme ? `${palette.stroke}` : `${palette.stroke}`)};
	color: ${({disabled, isDarkTheme}) => (disabled || isDarkTheme ? `${palette.text_black}` : `${palette.text_black}`)};
	width: 100%;
	// cursor: ${({disabled}) => (disabled ? `no-drop` : `pointer`)};
	background: ${({disabled, bgTransparent, isDarkTheme}) => (bgTransparent ? 'transparent' : disabled ? `${palette.silver}` : isDarkTheme ? `${palette.black}` : `${palette.white}`)};
	​
	// &:hover {
	// 	box-shadow: 0 0 0.31rem ${({error, disabled}) => (disabled ? 'none' : error ? `${palette.danger}` : 'rgba(0, 0, 0, 0.25)')};
	// }
	&:focus {
		border: 1px solid ${({error, disabled}) => (disabled ? 'none' : error ? `${palette.danger}` : `${palette.Btn_dark_green}`)};
	}
	&::placeholder {
		color: ${palette.gray_100};
	}
	​ &:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${({disabled, isDarkTheme}) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.gray_100}`)};
	}
	​ &::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.gray_100};
	}
`
export const StyledHeading = styled(Text)<any>`
	position: relative;
	cursor: pointer;
	opacity: ${({opacity}) => (opacity ? `${opacity}` : '1')};
	/* color: ${({active}) => (active ? palette.Btn_dark_green : palette.text_black)}; */
`
const UploadIcon = styled.img<any>`
	height: 4.25rem;
	width: 4.25rem;
	border-radius: 100%;
	object-fit: cover;
`
const Upload = styled.label`
	height: 1.875rem;
	width: 1.875rem;
	border: 0.125rem solid ${palette.white};
	border-radius: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	background: ${palette.green_200};
	position: absolute;
	right: 0;
	bottom: -0.5rem;
`
const FileInput = styled.input`
	display: none !important;
`
const InputWrapper = styled.div`
	position: relative;
`
export const Button = styled.div<any>`
	padding: 1.25rem 1.3rem;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 1.875rem;
	height: 3.125rem;
	color: ${palette.white};
	font-weight: 700;
	font-family: 'Lato-Regular', sans-serif;
	font-size: 1rem;
	text-align: left;
	opacity: 1;
	width: 150px;
	border: 1px solid ${palette.green_200};
	background-color: ${({disabled}) => (disabled ? palette.white : palette.green_200)};
	cursor: ${({disabled}) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		background-color: ${palette.green};
		color: ${palette.white};
		border-color: ${palette.green}
	}
`
export default ProfileUpdate
