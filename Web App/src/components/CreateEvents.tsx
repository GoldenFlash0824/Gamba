import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Spacer, Text } from '../styled/shared'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import Button from '../components/common/Button'
import CustomInputField from '../components/common/CustomInputField'
import { RxCrossCircled } from 'react-icons/rx'
import DateTimePicker from 'react-datetime-picker'
import { createEvent } from '../apis/apis'
import { useDispatch } from 'react-redux'
import { saveRoute, saveSearchAddress, saveSearchLat, saveSearchLog, saveSearchText, setIsLoading } from '../actions/authActions'
import { toastError } from '../styled/toastStyle'
import moment from 'moment-timezone'
import DropDown from './DropDown'
import { useNavigate } from 'react-router-dom'
import { BiCalendarAlt } from 'react-icons/bi'
import Autocomplete from 'react-google-autocomplete'
import LocationSearch from './common/LocationSearch'
import { BsCheckSquareFill } from 'react-icons/bs'
import { ImCheckboxUnchecked } from 'react-icons/im'
import ImageCropModal from './modals/ImageCropModal'

const CreateEvent = ({ onClose }: any) => {
	const _dispatch = useDispatch()
	const timeZone = 'America/New_York'
	const options = { timeZone: timeZone }

	const [title, setTitle] = useState('')
	const [minStartDate, setMinStartDate] = useState(() => {
		const defaultStartDate = new Date()
		defaultStartDate.setHours(7, 0, 0)
		return defaultStartDate
	})
	const [startDate, setStartDate] = useState<any>(() => {
		const defaultStartDate = new Date(moment().format())
		defaultStartDate.setHours(7, 0, 0)
		return defaultStartDate
	})
	const [endDate, setEndDate] = useState<any>(() => {
		const defaultStartDate = new Date(moment().format())
		defaultStartDate.setHours(19, 0, 0)
		return defaultStartDate
	})
	const [price, setPrice] = useState('')
	const [location, setLocation] = useState('')
	const [latitude, setLatitude] = useState('')
	const [longitude, setLongitude] = useState('')
	const [summary, setSummary] = useState('')
	const [isPrivate, setIsPrivate] = useState(false)
	const [limitToNumber, setLimitToNumber] = useState('')

	const _navigate = useNavigate()

	const [limitToNumberError, setLimitToNumberError] = useState('')
	const [limitToError, setLimitToError] = useState('')
	const [titleError, setTitleError] = useState('')
	const [startDateError, setStartDateError] = useState('')
	const [endDateError, setEndDateError] = useState('')
	const [priceError, setPriceError] = useState('')
	const [locationError, setLocationError] = useState('')
	const [showImage, setShowImage]: any = useState(null)
	const [showImageError, setShowImageError]: any = useState('')
	const [summaryError, setSummaryError] = useState('')
	const [privacyOptionsError, setPrivacyOptionsError] = useState('')

	const [result, setResult] = useState<string | null>(null)

	useEffect(() => {
		_dispatch(saveSearchText(''))
		_dispatch(saveSearchLat(null))
		_dispatch(saveSearchLog(null))
		_dispatch(saveSearchAddress(''))
		// setDefaultTime()
	}, [])

	const date = new Date(Date.parse(startDate))

	const handleStartDateChange = (date: any) => {
		setStartDateError('')
		setStartDate(new Date(date))
	}

	const handleEndDateChange = (date: any) => {
		setEndDateError('')
		setEndDate(new Date(date))
	}

	const createAnEvent = async () => {
		_dispatch(setIsLoading(true))

		let response = await createEvent(price, location, latitude, longitude, moment.tz(startDate, 'America/New_York').format(), moment.tz(endDate, 'America/New_York').format(), summary, result, title, isPrivate, privacy, limitTo, limitToNumber)
		if (response.success === true) {
			onClose()
			setPrice('')
			setSummary('')
			setLocation('')
			_navigate('/calendar')
			_dispatch(saveRoute('/calendar'))
		} else {
			toastError(response.message)
		}
		_dispatch(setIsLoading(false))
	}

	const checkValidationOnClick = () => {
		let isValid = true
		if (title === '') {
			setTitleError('Title is required')
			isValid = false
		}
		if (price === '') {
			setPriceError('Price is required')
			isValid = false
		}

		if (location === '') {
			setLocationError('Location is Required')
			isValid = false
		}

		if (summary === '') {
			setSummaryError('Description is Required')
			isValid = false
		}
		// if (limitToNumber === '') {
		// 	setLimitToNumberError('Limit to Number is Required')
		// 	isValid = false
		// }
		if (limitTo === '') {
			setLimitToError('Limit to is Required')
			isValid = false
		}

		// let start = moment(startDate).format('MM-DD-YYYY hh:mm:ss A')
		// let current = moment(new Date()).format('MM-DD-YYYY hh:mm:ss A')
		let start = moment.tz(startDate, 'America/New_York').format('MM-DD-YYYY hh:mm:ss A')
		let current = moment.tz('America/New_York').format('MM-DD-YYYY hh:mm:ss A')
		if (start < current) {
			setStartDateError('Start Date should be in upcoming')
			isValid = false
		}

		if (startDate === null) {
			setStartDateError('Start Date is required')
			isValid = false
		}
		if (endDate === null) {
			setEndDateError('End Date is required')
			isValid = false
		}
		if (startDate === endDate) {
			setEndDateError('End Date should be greater')
			isValid = false
		}
		if (endDate <= startDate) {
			setEndDateError('End Date should be greater')
			isValid = false
		}
		if (endDate < startDate) {
			setEndDateError('End Date should be greater')
			isValid = false
		}
		if (startDate > endDate) {
			setEndDateError('End Date should be greater')
			isValid = false
		}
		if (minStartDate === startDate) {
			setEndDateError('End Date should be greater')
			isValid = false
		}

		if (result === null) {
			setShowImageError('Banner is required')
			isValid = false
		}

		return isValid
	}

	const [privacyOption, setPrivacyOption] = useState([
		{ value: 'Public', label: 'Public' },
		{ value: 'My Network', label: 'My Network' },
		{ value: 'Only Me', label: 'Only Me' }
	])
	const [privacy, setPrivacy] = useState(privacyOption[0]?.value)
	const [limitToOption, setLimitToOption] = useState([
		{ value: 'Up to 5 Guests', label: 'Up to 5 Guests' },
		{ value: 'Up to 10 Guests', label: 'Up to 10 Guests' },
		{ value: 'Up to 15 Guests', label: 'Up to 15 Guests' },
		{ value: 'Up to 20 Guests', label: 'Up to 20 Guests' },
		{ value: 'Enter Number', label: 'Enter Number' }
	])

	const [limitTo, setLimitTo] = useState(limitToOption[0]?.value)

	const handleCapture = ({ target }: any) => {
		const reader = new FileReader()
		reader.readAsDataURL(target.files[0])
		reader.onload = () => {
			if (reader.readyState === 2) {
				setShowImage(reader.result)
			}
		}
	}

	return (
		<Wrapper>
			<Spacer height={1} />
			<Row>
				<Col>
					{!result ? (
						<>
							<InputWrapper>
								<Upload>
									<UploadIcon src="/images/icons/upload_img.svg" />
									<FileInput
										id="faceImage"
										accept="image/jpeg/png"
										type="file"
										onChange={(e) => {
											handleCapture(e)
											setShowImage('')
											setResult(null)
										}}
									/>
								</Upload>
							</InputWrapper>
						</>
					) : (
						<ImgWrapper>
							<ShowImage src={result} />
							<IconWrapper
								onClick={() => {
									setShowImage(null)
									setResult(null)
								}}>
								<CrossIcon src="/images/icons/delete_post.svg" alt="delete_post" />
							</IconWrapper>
						</ImgWrapper>
					)}
					{/* <TextLabel type="small">0 / 1</TextLabel> */}
					{result ? (
						''
					) : (
						<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
							{showImageError}
						</Text>
					)}
					<Spacer height={1.5} />
				</Col>

				<Col lg={6}>
					<CustomInputField
						bgTransparent
						label="Event Title"
						type="text"
						placeholder="Enter"
						handleChange={(e: any) => {
							setTitleError('')
							if (e === '') {
								setTitleError('Title is required')
							}
							setTitle(e)
						}}
						required
						value={title}
						error={titleError}
						errorMsg={titleError}
					/>
					<Spacer height={1.5} />
				</Col>
				<Col lg={6}>
					<CustomInputField
						label="Price"
						bgTransparent
						// type="number"
						placeholder="Enter 0 if no fee"
						handleChange={(e: any) => {
							setPriceError('')
							if (e === '') {
								setPriceError('Price Field is Empty')
							}
							setPrice(e)
						}}
						value={price}
						required
						error={priceError}
						errorMsg={priceError}
						allowOnlyNumbers={true}
					/>
					<Spacer height={1.5} />
				</Col>
				<Col lg={6}>
					<InputWrapper>
						<Text type="normal" margin="0rem 0rem 0.25rem 0rem" color="black" fontWeight={700}>
							Start Date
						</Text>
						<CalenderDiv calendarIcon={<CalendarIconCustom />} minDate={new Date(moment().format())} clearIcon={null} onChange={handleStartDateChange} value={startDate} />
						<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
							{startDateError}
						</Text>
					</InputWrapper>
					<Spacer height={1.5} />
				</Col>

				<Col lg={6}>
					<InputWrapper>
						<Text type="normal" margin="0rem 0rem 0.25rem 0rem" color="black" fontWeight={700}>
							End Date
						</Text>
						<CalenderDiv calendarIcon={<CalendarIconCustom />} minDate={new Date(moment().format())} clearIcon={null} onChange={handleEndDateChange} value={endDate} />
						<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
							{endDateError}
						</Text>
					</InputWrapper>
					<Spacer height={1.5} />
				</Col>

				<Container>
					<Row>
						<Col lg={6}>
							<LocationSearch isPrivate={isPrivate} setLongitude={setLongitude} setLatitude={setLatitude} setLocationError={setLocationError} setLocation={setLocation} />
							<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
								{locationError}
							</Text>
						</Col>
						<Col lg={6}>
							<CustomSpacer />
							<Flexed margin="1rem 0rem 0rem 0rem" direction="row" align="flex-start" onClick={() => { setIsPrivate(!isPrivate) }}>
								<CheckIconWrapper>{!isPrivate ? <Checked /> : <UnChecked />}</CheckIconWrapper>
								<CustomText type="small">Display my location publicly</CustomText>
							</Flexed>
						</Col>
					</Row>
					<Spacer height={1.5} />
				</Container>
				<Col lg={6}>
					{/* <Spacer height={1.5} /> */}
					<DropDown
						label="Privacy"
						firstSelected={privacyOption[0]?.value}
						name="ProductCategory"
						hasChanged={(value: any) => {
							setPrivacyOptionsError('')
							if (value === '') {
								setPrivacyOptionsError('Privacy is Required')
							}
							setPrivacy(value)
						}}
						required
						error={privacyOptionsError}
						errorMsg={privacyOptionsError}
						options={privacyOption}
					/>
					<Spacer height={1.5} />
				</Col>
				<Col lg={6}>
					{/* <Spacer height={1.5} /> */}
					<DropDown
						label="Limit To"
						firstSelected={limitToOption[0]?.value}
						name="ProductCategory"
						hasChanged={(value: any) => {
							setLimitToError('')
							if (value === '') {
								setLimitToError('Limit Number is Required')
							}
							setLimitTo(value)
						}}
						required
						error={limitToError}
						errorMsg={limitToError}
						options={limitToOption}
					/>
					<Spacer height={1.5} />
				</Col>
				{/*  */}

				{limitTo === 'Enter Number' && (
					<Col lg={6}>
						<CustomInputField
							// disabled={}
							label="Limit To Number"
							// type="number"
							placeholder="Enter"
							handleChange={(e: any) => {
								setLimitToNumberError('')
								if (e === '') {
									setLimitToNumberError('Limit Number is Required')
								}
								setLimitToNumber(e)
							}}
							value={limitToNumber}
							required
							error={limitToNumberError}
							errorMsg={limitToNumberError}
							allowOnlyNumbers={true}
						/>
						<Spacer height={1.5} />
					</Col>
				)}

				<Col>
					<CustomInputField
						label="Event Description (Upto 150 Words)"
						bgTransparent
						type="textarea"
						placeholder="Summary"
						handleChange={(e: any) => {
							setSummaryError('')
							if (e === '') {
								setSummaryError('Description is Required')
							}
							const words = e.split(' ')
							if (words.length > 149) {
								const truncatedValue = words.slice(0, 149).join(' ')
								setSummary(truncatedValue)
							} else {
								setSummary(e)
							}
						}}
						required
						error={summaryError}
						errorMsg={summaryError}
						value={summary}
					/>
					<Spacer height={1.5} />
				</Col>

				{/* <Container>
					<Row> */}

				{/* </Row>
				</Container> */}

				<Col lg={12}>
					<Button
						label="Create an Event"
						width="100%"
						ifClicked={() => {
							if (checkValidationOnClick()) {
								createAnEvent()
							}
						}}
					/>
				</Col>
			</Row>
			{showImage && (
				<ImageCropModal
					showImage={showImage}
					result={result}
					setResult={setResult}
					onClose={() => {
						setShowImage('')
					}}
				/>
			)}
		</Wrapper>
	)
}

const Wrapper = styled(Container)`
	padding: 0;
`

const InputWrapper = styled.div`
	position: relative;
	margin-bottom: 0.5rem;
`
const CalendarIconCustom = styled(BiCalendarAlt)`
	color: ${palette.gray};
	font-size: 1.5rem;
`

const GoogleAutoLocation = styled(Autocomplete)`
	font-family: 'Roboto';
	width: 100%;
	line-height: 2rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 0.875rem;
	border-radius: 0.375rem;
	padding: 0.5rem 0.8rem;
	border: 1px solid ${palette.input_border};
	color: ${palette.text_black};
	background: ${palette.white};
	width: 100%;

	&:focus {
		border: 1px solid ${palette.Btn_dark_green};
	}
	&::placeholder {
		color: ${palette.black};
		opacity: 0.5; /* Firefox */
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${palette.black};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.black};
	}
`

const LabelWrapper = styled.div`
	position: absolute;
	top: -0.8rem;
	left: 0.5rem;
	background-color: ${palette.white};
	padding: 0 0.2rem;
	z-index: 1;
`
const CustomWrapper = styled.div`
	position: absolute;
	top: -0.8rem;
	left: 0.5rem;
	background-color: ${palette.white};
	padding: 0 0.2rem;
`

const TextLabel = styled(Text)`
	/* font-weight: 500; */
	/* text-transform: capitalize; */
	/* font-size: 14px; */
`

const CalenderDiv = styled(DateTimePicker) <any>`
	font-family: 'Lato-Regular', sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: 0.5rem;
	padding: 0.575rem 1.25rem;
	border: 1px solid ${({ error, disabled, isDarkTheme }) => (disabled ? `${palette.green}` : error ? `${palette.danger}` : isDarkTheme ? `${palette.stroke}` : `${palette.stroke}`)};
	color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.text_black}` : `${palette.text_black}`)};
	width: 100%;
	// cursor: ${({ disabled }) => (disabled ? `no-drop` : `pointer`)};
	background: ${({ disabled, bgTransparent, isDarkTheme }) => (bgTransparent ? 'transparent' : disabled ? `${palette.silver}` : isDarkTheme ? `${palette.black}` : `${palette.white}`)};

	// &:hover {
	// 	box-shadow: 0 0 0.31rem ${({ error, disabled }) => (disabled ? 'none' : error ? `${palette.danger}` : 'rgba(0, 0, 0, 0.25)')};
	// }
	&:focus {
		border: 1px solid ${({ error, disabled }) => (disabled ? 'none' : error ? `${palette.danger}` : `${palette.Btn_dark_green}`)};
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

export const Upload = styled.label`
	padding: 1rem;
	height: 7rem;
	// height: auto;
	border: 0.063rem solid ${palette.stroke};
	border-radius: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.7rem;
	flex-direction: column;
	cursor: pointer;
	margin-bottom: 0;
`

export const UploadIcon = styled.img`
	width: 3rem;
`

const CustomText = styled(Text)`
	color: ${({ toggle }) => (toggle ? palette.Btn_dark_green : palette.text)};
	cursor: pointer;
`

export const FileInput = styled.input`
	display: none !important;
`

export const NewText = styled(Text)`
	text-align: center;
`

export const ImgWrapper = styled.div`
	position: relative;
	// height: 8.5rem;
	margin-bottom: 0.5rem;
`

export const ShowImage = styled.img`
	width: 100%;
	// height: 8.5rem;
	object-fit: cover;
	border-radius: 1rem;
`

export const IconWrapper = styled.div``

export const CrossIcon = styled.img`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	cursor: pointer;
`

const CalenderLabel = styled(Text)`
	font-weight: 500;
	text-transform: normal;
`

const CheckIconWrapper = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	cursor: pointer;
	height: 1.25rem;
	/* border-radius: 1rem; */
	width: 1.25rem;
`

const Checked = styled(BsCheckSquareFill)`
	color: ${palette.Btn_dark_green};
	/* font-size: 1rem; */
	/* border-radius: 100%; */
`
const UnChecked = styled(ImCheckboxUnchecked)`
	color: ${palette.input_checkbox};
`

const CustomSpacer = styled.div`
	${media.lg`height: 1.688rem`};
`

export default CreateEvent
