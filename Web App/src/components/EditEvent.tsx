import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Spacer, Text } from '../styled/shared'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import Button from '../components/common/Button'
import CustomInputField from '../components/common/CustomInputField'
import Toggle from './common/Toggle'
import { Upload, FileInput, ImgWrapper, ShowImage, IconWrapper, CrossIcon } from './CreateEvents'
import moment from 'moment-timezone'
import DateTimePicker from 'react-datetime-picker'
import { UpdateEvent } from '../apis/apis'
import { saveSearchAddress, saveSearchLat, saveSearchLog, saveSearchText, setIsLoading } from '../actions/authActions'
import { toastError, toastSuccess } from '../styled/toastStyle'
import { useDispatch } from 'react-redux'
import DropDown from './DropDown'
import { BiCalendarAlt } from 'react-icons/bi'
import LocationSearch from './common/LocationSearch'
import { BsCheckSquareFill } from 'react-icons/bs'
import { ImCheckboxUnchecked } from 'react-icons/im'
import ImageCropModal from './modals/ImageCropModal'

const EditEvent = ({ data, onClose }) => {
	const _dispatch = useDispatch()
	const [title, setTitle] = useState(data?.title ? data?.title : data?.title)
	const [startDate, setStartDate] = useState(data?.start_date ? new Date(data?.start_date) : new Date())
	const [endDate, setEndDate] = useState(data?.end_date ? new Date(data?.end_date) : new Date())
	const [price, setPrice] = useState(data?.price)
	const [text, setText] = useState(data?.location)
	const [summary, setSummary] = useState(data?.summary)
	const [isPrivate, setIsPrivate] = useState(data?.is_private ? data?.is_private : false)
	const [showImage, setShowImage]: any = useState(data?.image)
	const [summaryError, setSummaryError] = useState('')
	const [latitude, setLatitude] = useState(data?.latitude)
	const [longitude, setLongitude] = useState(data?.longitude)
	const [limitToNumber, setLimitToNumber] = useState(data?.limit_to_number)
	const [showImageError, setShowImageError]: any = useState('')

	const [limitToNumberError, setLimitToNumberError] = useState('')
	const [limitToError, setLimitToError] = useState('')
	const [titleError, setTitleError] = useState('')
	const [startDateError, setStartDateError] = useState('')
	const [endDateError, setEndDateError] = useState('')
	const [priceError, setPriceError] = useState('')
	const [locationError, setLocationError] = useState('')
	const [privacyOptionsError, setPrivacyOptionsError] = useState('')
	const [loading, setLoading] = useState(false)

	const [result, setResult] = useState<string | null>(null)
	const [openCropModel, setOpenCropModel] = useState(false)

	useEffect(() => {
		_dispatch(saveSearchText(''))
		_dispatch(saveSearchLat(null))
		_dispatch(saveSearchLog(null))
		_dispatch(saveSearchAddress(''))
	}, [])

	const handleStartDateChange = (date: any) => {
		// date = moment(date).format('MM/DD/YYYY, hh:mm A')
		setStartDate(date)
	}

	const handleEndDateChange = (date: any) => {
		// date = moment(date).format('MM/DD/YYYY, hh:mm A')
		setEndDate(date)
	}

	const handleCapture = ({ target }: any) => {
		const reader = new FileReader()
		reader.readAsDataURL(target.files[0])
		reader.onload = () => {
			if (reader.readyState === 2) {
				setShowImage(reader.result)
				setOpenCropModel(true)
			}
		}
	}

	const updateEvent = async () => {
		setLoading(true)
		_dispatch(setIsLoading(true))
		let response = await UpdateEvent(
			data?.id,
			price,
			text,
			latitude,
			longitude,
			moment.tz(startDate, 'America/New_York').format(),
			moment.tz(endDate, 'America/New_York').format(),
			summary,
			result,
			title,
			isPrivate,
			privacy,
			limitTo,
			limitTo === 'Enter Number' ? limitToNumber : null
		)
		_dispatch(setIsLoading(false))
		if (response.success === true) {
			// toastSuccess(response.message)
			onClose()
			setPrice('')
			setSummary('')
			setText('')
			setLoading(false)
		} else {
			setLoading(false)
			toastError(response.message)
		}
	}

	const [privacy, setPrivacy] = useState(data?.privacy)

	const [privacyOption, setPrivacyOption] = useState([
		{ value: 'Public', label: 'Public' },
		{ value: 'My Network', label: 'My Network' },
		{ value: 'Only Me', label: 'Only Me' }
	])
	const [limitToOption, setLimitToOption] = useState([
		{ value: 'Up to 5 Guests', label: 'Up to 5 Guests' },
		{ value: 'Up to 10 Guests', label: 'Up to 10 Guests' },
		{ value: 'Up to 15 Guests', label: 'Up to 15 Guests' },
		{ value: 'Up to 20 Guests', label: 'Up to 20 Guests' },
		{ value: 'Enter Number', label: 'Enter Number' }
	])

	const [limitTo, setLimitTo] = useState(data?.limit_to)

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
		if (text === '') {
			setLocationError('Location is Required')
			isValid = false
		}
		if (summary === '') {
			setSummaryError('Description is Required')
			isValid = false
		}

		if (limitTo === '') {
			setLimitToError('Limit to is Required')
			isValid = false
		}

		if (startDate === null) {
			setStartDateError('Start Date is required')
			isValid = false
		} else if (endDate === null) {
			setEndDateError('End Date is required')
			isValid = false
		} else if (startDate === endDate) {
			setEndDateError('End Date should be greater')
			isValid = false
		} else if (endDate <= startDate) {
			setEndDateError('End Date should be greater')
			isValid = false
		}

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

		if (result === null && !showImage) {
			setShowImageError('Banner is required')
			isValid = false
		}
		return isValid
	}

	return (
		<Wrapper>
			<Row>
				<Col>
					{!showImage && !result ? (
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
									{/* <NewText font="1.125rem" color="light_black" weight="300">
											Upload Photo
										</NewText> */}
								</Upload>
							</InputWrapper>
						</>
					) : (
						!result &&
						!openCropModel && (
							<ImgWrapper>
								<ShowImage src={showImage?.startsWith('data:') ? showImage : `https://imagescontent.s3.us-east-1.amazonaws.com/${showImage}`} />
								<IconWrapper
									onClick={() => {
										setShowImage(null)
										setResult(null)
									}}>
									<CrossIcon src="/images/icons/delete_post.svg" alt="delete_post" />
								</IconWrapper>
							</ImgWrapper>
						)
					)}
					{result && (
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
						label="Event Title"
						bgTransparent
						type="text"
						placeholder="Enter"
						handleChange={(e: any) => {
							setTitleError('')
							if (e === '') {
								setTitleError('Title is required')
							}
							setTitle(e)
						}}
						value={title}
						required
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
						<CalenderDiv calendarIcon={<CalendarIconCustom />} clearIcon={null} minDate={new Date()} onChange={handleStartDateChange} value={startDate} />

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
						<CalenderDiv calendarIcon={<CalendarIconCustom />} minTime={startDate} clearIcon={null} minDate={new Date()} onChange={handleEndDateChange} value={endDate} />

						<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
							{endDateError}
						</Text>
					</InputWrapper>
					<Spacer height={1.5} />
				</Col>

				<Container>
					<Row>
						<Col lg={6}>
							<LocationSearch isPrivate={isPrivate} location={text} setLongitude={setLongitude} setLatitude={setLatitude} setLocationError={setLocationError} setLocation={setText} />
							<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
								{locationError}
							</Text>
						</Col>
						<Col lg={6}>
							<CustomSpacer />
							<Flexed margin="1rem 0rem 0rem 0rem" direction="row" align="flex-start" onClick={() => setIsPrivate(!isPrivate)}>
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
						firstSelected={privacy}
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
					<DropDown
						label="Limit To"
						firstSelected={limitTo}
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
							bgTransparent
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
						bgTransparent
						label="Summary"
						type="textarea"
						placeholder="Summary"
						handleChange={(e: any) => {
							setSummaryError('')
							if (e === '') {
								setSummaryError('description is Empty')
							}
							setSummary(e)
						}}
						required
						error={summaryError}
						errorMsg={summaryError}
						value={summary}
					/>
					<Spacer height={1.5} />
				</Col>

				<Col lg={12}>
					<Button
						label="Update event"
						width="100%"
						disabled={loading}
						ifClicked={async () => {
							if (await checkValidationOnClick()) {
								updateEvent()
							}
						}}
					/>
				</Col>
			</Row>
			{openCropModel && (
				<ImageCropModal
					showImage={showImage}
					result={result}
					setResult={setResult}
					onClose={() => {
						setShowImage('')
						setOpenCropModel(false)
					}}
				/>
			)}
		</Wrapper>
	)
}

const Wrapper = styled(Container)`
	padding: 0;
`

const CalendarIconCustom = styled(BiCalendarAlt)`
	color: ${palette.gray};
	font-size: 1.5rem;
`
const InputWrapper = styled.div`
	position: relative;
	margin-bottom: 0.5rem;
`

const CalenderDiv = styled(DateTimePicker) <any>`
	font-family: 'Lato-Regular', sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 0.875rem;
	border-radius: 0.5rem;
	padding: 0.6rem 1.25rem;
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

export const UploadIcon = styled.img`
	width: 3rem;
`

const CustomText = styled(Text)`
	color: ${({ toggle }) => (toggle ? palette.Btn_dark_green : palette.text)};
	cursor: pointer;
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

export default EditEvent
